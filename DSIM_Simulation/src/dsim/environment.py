"""
DSIM environment scaffolding.

Configures state variables and logging for a modular DSIM simulation environment.
This is an initial skeleton to be extended with schedulers, fluctuation dynamics,
and worldtube persistence logic.
"""

from __future__ import annotations

from dataclasses import dataclass, field
from typing import Any, Dict, List, Tuple, Optional
import logging
import numpy as np
from scipy.spatial.distance import pdist, squareform

# Core DSIM structures
from .structures import InstantonKq, CompositeConfig


def _setup_logger() -> logging.Logger:
    logger = logging.getLogger("DSIM")
    if not logger.handlers:
        handler = logging.StreamHandler()
        fmt = logging.Formatter(
            fmt="%(asctime)s | %(levelname)s | %(name)s | %(message)s",
            datefmt="%Y-%m-%d %H:%M:%S",
        )
        handler.setFormatter(fmt)
        logger.addHandler(handler)
    logger.setLevel(logging.INFO)
    return logger


LOGGER = _setup_logger()


@dataclass
class DSIM_Environment:
    """
    DSIM environment state.

    State Variables:
    - spatial_bounds: Tuple[np.ndarray, np.ndarray] -> (min_xyz, max_xyz)
    - dt: float time step
    - current_time: float current simulation time
    - fluctuation_pool: List[Any] reservoir of transient structures awaiting evaluation
    - history: List[Dict[str, Any]] time-stamped records for analysis/replay
    - persistent_worldtubes: List[Any] stabilized structures persisting through time
    """

    spatial_bounds: Tuple[np.ndarray, np.ndarray]
    dt: float
    current_time: float = 0.0
    fluctuation_pool: List[Any] = field(default_factory=list)
    history: List[Dict[str, Any]] = field(default_factory=list)
    persistent_worldtubes: List[Any] = field(default_factory=list)

    def __post_init__(self) -> None:
        self.spatial_bounds = (
            np.asarray(self.spatial_bounds[0], dtype=float),
            np.asarray(self.spatial_bounds[1], dtype=float),
        )
        if self.spatial_bounds[0].shape != (3,) or self.spatial_bounds[1].shape != (3,):
            raise ValueError("spatial_bounds must be two 3D vectors (min_xyz, max_xyz)")
        LOGGER.info(
            "Initialized DSIM environment | bounds=%s..%s | dt=%.4f",
            self.spatial_bounds[0],
            self.spatial_bounds[1],
            self.dt,
        )

    def step(self) -> None:
        """Advance simulation time by dt. Extend with update rules as needed."""
        self.current_time += self.dt
        LOGGER.debug("Advanced time to t=%.6f", self.current_time)

    def record(self, payload: Dict[str, Any]) -> None:
        """Append a structured record into history with current time."""
        entry = {"t": self.current_time, **payload}
        self.history.append(entry)
        LOGGER.debug("Recorded entry: %s", entry)

    # ------------------------
    # Phase B: Simulation Logic
    # ------------------------

    def generate_fluctuations(
        self,
        density_rate: float,
        flavor_ratios: Optional[Dict[str, float]] = None,
        *,
        scale_by_volume: bool = False,
    ) -> List[InstantonKq]:
        """
        Spawn new InstantonKq objects stochastically.

        Theory Link: Implements stochastic vacuum fluctuations consistent with DSIM
        hypothesis. Flavors approximate initial ratios of u/d/s, etc.

        - Uses a Poisson distribution with mean = density_rate (optionally scaled by
          spatial volume) to determine how many instantons appear this step.
        - Samples positions uniformly within `spatial_bounds`.
        - Samples flavors by provided `flavor_ratios`.
        """
        if flavor_ratios is None or len(flavor_ratios) == 0:
            flavor_ratios = {"u": 2.0, "d": 1.0}  # default u:d = 2:1

        # Normalize flavor probabilities
        flavors = list(flavor_ratios.keys())
        probs = np.asarray([flavor_ratios[f] for f in flavors], dtype=float)
        probs = probs / probs.sum()

        # Expected count via Poisson
        if scale_by_volume:
            volume = float(np.prod(self.spatial_bounds[1] - self.spatial_bounds[0]))
            lam = density_rate * max(volume, 1e-12)
        else:
            lam = density_rate
        count = int(np.random.poisson(lam=lam))

        spawned: List[InstantonKq] = []
        if count <= 0:
            return spawned

        mins, maxs = self.spatial_bounds
        for _ in range(count):
            position = mins + (maxs - mins) * np.random.rand(3)
            flavor = np.random.choice(flavors, p=probs)
            kq = InstantonKq(flavor=flavor, position=position, time_t=self.current_time)
            self.fluctuation_pool.append(kq)
            spawned.append(kq)

        if spawned:
            self.record({
                "event": "spawn",
                "count": len(spawned),
                "ids": [str(k.id) for k in spawned],
            })
            LOGGER.info("Spawned %d fluctuations (Poisson λ=%.3f)", len(spawned), lam)
        return spawned

    def identify_configurations(
        self, proximity_threshold: float
    ) -> List[CompositeConfig]:
        """
        Identify spatially local triplets of InstantonKq as candidate pushout gluings.

        Theory Link: Implements the topological connected sum / Pushout constrained by
        locality. We construct candidate triplets whose pairwise distances are all
        ≤ proximity_threshold using a greedy matching algorithm.
        """
        # Candidates: only non-stabilized, current pool
        candidates: List[InstantonKq] = [k for k in self.fluctuation_pool if not k.is_stabilized]
        if len(candidates) < 3:
            return []

        positions = np.stack([k.position for k in candidates], axis=0)
        # Pairwise distances
        dm = squareform(pdist(positions))

        used: set[int] = set()
        triplets: List[CompositeConfig] = []

        # Greedy: iterate by nearest-neighbor density
        # For each unused index i, try to find j,k such that all pairs within threshold
        order = np.argsort(dm.sum(axis=1))  # lower sum-dist -> denser neighborhood
        for i in order:
            if i in used:
                continue
            # Get neighbors within threshold (excluding self and those already used)
            neighbors = [j for j in np.argsort(dm[i]) if j != i and dm[i, j] <= proximity_threshold and j not in used]
            if len(neighbors) < 2:
                continue
            # Try combinations greedily: pick two closest neighbors that are also close to each other
            for a_idx in range(len(neighbors)):
                j = neighbors[a_idx]
                for b_idx in range(a_idx + 1, len(neighbors)):
                    k = neighbors[b_idx]
                    if dm[j, k] <= proximity_threshold:
                        # Found a valid triangle
                        used.update({i, j, k})
                        config = CompositeConfig(
                            instantons=[candidates[i], candidates[j], candidates[k]],
                            time_t=self.current_time,
                        )
                        triplets.append(config)
                        break
                if i in used:
                    break

        if triplets:
            self.record({
                "event": "pushout_candidates",
                "count": len(triplets),
            })
            LOGGER.info("Identified %d candidate triplets (threshold=%.3f)", len(triplets), proximity_threshold)
        return triplets

    def check_CCP(self, configs: List[CompositeConfig]) -> List[CompositeConfig]:
        """
        Apply the Causal Compensation Principle (CCP) to candidate configurations.

        Theory Link: Implements Axiom 2 (CCP) and confinement constraint by requiring
        color-holonomy neutrality: sum(holonomy_z3) % 3 == 0 for the constituents.

        Side effects:
        - Marks constituent instantons as stabilized and assigns a shared `baryon_id`.
        - Adds stable composite to `persistent_worldtubes`.
        - Removes stabilized instantons from `fluctuation_pool`.
        """
        stable: List[CompositeConfig] = []
        if not configs:
            return stable

        for cfg in configs:
            # CompositeConfig already computes is_stable under Z3 neutrality
            if not cfg.is_stable:
                continue
            # Ensure baryon_id exists
            baryon_id = cfg.baryon_id
            # Stabilize constituents
            for kq in cfg.instantons:
                kq.is_stabilized = True
                kq.baryon_id = baryon_id
            # Remove stabilized instantons from pool
            pool_ids = {id(k) for k in cfg.instantons}
            self.fluctuation_pool = [k for k in self.fluctuation_pool if id(k) not in pool_ids]
            # Persist worldtube snapshot
            self.persistent_worldtubes.append(cfg)
            stable.append(cfg)

        if stable:
            self.record({
                "event": "ccp_stable",
                "count": len(stable),
                "baryon_ids": list({str(cfg.baryon_id) for cfg in stable}),
            })
            LOGGER.info("CCP stabilized %d configurations", len(stable))
        return stable

    def propagate_worldtubes(self, brownian_sigma: float = 0.01) -> List[CompositeConfig]:
        """
        Enforce persistence of previously stabilized configurations (Sequential Colimit).

        Theory Link: Implements Axiom 3 (Emergent Persistence) via sequential colimit.
        For each stable configuration at time t-dt, create a successor at time t with
        simple kinematics: positions + Gaussian perturbation.
        """
        if not self.persistent_worldtubes:
            return []

        target_time = self.current_time
        prev_time = target_time - self.dt
        eps = 1e-9

        successors: List[CompositeConfig] = []
        mins, maxs = self.spatial_bounds
        # Iterate over a snapshot to avoid interacting with items appended during iteration
        for cfg in list(self.persistent_worldtubes):
            if abs(cfg.time_t - prev_time) > eps or not cfg.is_stable:
                continue
            new_instantons: List[InstantonKq] = []
            for kq in cfg.instantons:
                new_pos = kq.position + np.random.normal(loc=0.0, scale=brownian_sigma, size=3)
                # Keep within bounds
                new_pos = np.minimum(np.maximum(new_pos, mins), maxs)
                new_kq = InstantonKq(
                    flavor=kq.flavor,
                    position=new_pos,
                    time_t=target_time,
                )
                new_kq.is_stabilized = True
                new_kq.baryon_id = cfg.baryon_id
                new_instantons.append(new_kq)

            new_cfg = CompositeConfig(instantons=new_instantons, time_t=target_time, baryon_id=cfg.baryon_id)
            # Ensure stability is preserved (it should be, but we keep the check explicit)
            if new_cfg.is_stable:
                self.persistent_worldtubes.append(new_cfg)
                successors.append(new_cfg)

        if successors:
            self.record({
                "event": "worldtube_propagation",
                "count": len(successors),
                "baryon_ids": list({str(cfg.baryon_id) for cfg in successors}),
            })
            LOGGER.info("Propagated %d worldtube(s) to t=%.6f", len(successors), target_time)
        return successors

    def cleanup_pool(self, max_age: Optional[float] = None) -> None:
        """
        Remove stabilized or expired instantons from the fluctuation pool.

        - Stabilized instantons are immediately removed (they persist via worldtubes).
        - If `max_age` is provided, any instanton older than `max_age` seconds is removed.
        """
        before = len(self.fluctuation_pool)
        if max_age is None:
            self.fluctuation_pool = [k for k in self.fluctuation_pool if not k.is_stabilized]
        else:
            cutoff = self.current_time - float(max_age)
            self.fluctuation_pool = [
                k for k in self.fluctuation_pool if (not k.is_stabilized) and (k.time_t >= cutoff)
            ]
        removed = before - len(self.fluctuation_pool)
        if removed > 0:
            self.record({"event": "cleanup", "removed": removed})
            LOGGER.debug("Cleaned up %d instantons from pool", removed)

    def evolve_system(
        self,
        steps: int,
        *,
        density_rate: float,
        flavor_ratios: Optional[Dict[str, float]] = None,
        proximity_threshold: float,
        brownian_sigma: float = 0.01,
        max_age: Optional[float] = None,
        scale_by_volume: bool = False,
    ) -> None:
        """
        Execute the main evolution loop in the proper operation sequence.

        Order per step:
        1) propagate_worldtubes
        2) advance time (step)
        3) generate_fluctuations
        4) identify_configurations
        5) check_CCP
        6) cleanup_pool
        """
        LOGGER.info(
            "Starting evolution: steps=%d, dt=%.4f, λ=%.3f, threshold=%.3f",
            steps,
            self.dt,
            density_rate,
            proximity_threshold,
        )
        for _ in range(int(steps)):
            # Sequential Colimit: propagate stable worldtubes to current time
            self.propagate_worldtubes(brownian_sigma=brownian_sigma)

            # Advance time
            self.step()

            # Fluctuations
            self.generate_fluctuations(
                density_rate=density_rate,
                flavor_ratios=flavor_ratios,
                scale_by_volume=scale_by_volume,
            )

            # Pushout candidates
            candidates = self.identify_configurations(proximity_threshold=proximity_threshold)

            # CCP check & stabilization
            self.check_CCP(candidates)

            # Cleanup
            self.cleanup_pool(max_age=max_age)

        LOGGER.info("Evolution complete | t=%.6f | pool=%d | worldtubes=%d", self.current_time, len(self.fluctuation_pool), len(self.persistent_worldtubes))



