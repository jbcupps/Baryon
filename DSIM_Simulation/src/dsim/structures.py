"""
Core DSIM data structures.

Theory context:
- InstantonKq represents a transient, compact 4D manifold Kq (an instanton-like event)
  with a Z3-valued topological charge (holonomy/color) assignment used in SKB/QCD modeling.
- CompositeConfig models the topological pushout (gluing) of multiple Kq into a composite
  configuration; its stability reflects whether a color-neutral, bordism-compatible
  baryonic configuration emerges.

Notes:
- We keep this module lightweight and free of external runtime dependencies beyond numpy/uuid.
- All mutation is explicit; dataclasses are used for clarity and type safety.
"""

from __future__ import annotations

from dataclasses import dataclass, field
from typing import List, Optional, Tuple
import uuid
import numpy as np


def _normalize_position(position: np.ndarray) -> np.ndarray:
    if not isinstance(position, np.ndarray):
        position = np.asarray(position, dtype=float)
    if position.shape != (3,):
        raise ValueError("position must be a 3D vector (x, y, z)")
    return position.astype(float)


@dataclass
class InstantonKq:
    """
    Representation of a transient, compact 4D manifold Kq (instanton-like event).

    Attributes:
    - id: UUID unique identifier
    - flavor: string label (e.g., 'u', 'd') mapping to SKB quark-like manifold class
    - position: np.ndarray shape (3,) spatial position at time_t
    - time_t: float physical/simulation time of this snapshot
    - is_stabilized: whether this Kq has entered a stabilized worldtube state
    - baryon_id: UUID of composite baryon if stabilized into a composite configuration (else None)

    The Z3 holonomy model is used for topological charge assignment; see _assign_holonomy.
    """

    flavor: str
    position: np.ndarray
    time_t: float
    id: uuid.UUID = field(default_factory=uuid.uuid4)
    is_stabilized: bool = False
    baryon_id: Optional[uuid.UUID] = None
    holonomy_z3: int = field(init=False)

    def __post_init__(self) -> None:
        self.position = _normalize_position(self.position)
        self.holonomy_z3 = self._assign_holonomy()

    def _assign_holonomy(self) -> int:
        """
        Assign a Z3-valued topological charge based on a simple, stable mapping.

        Z3 model: map flavors onto {0,1,2} with deterministic hashing to keep
        consistency across runs; this encodes a color-like holonomy class for Kq.
        """
        flavor_map = {"u": 0, "d": 1, "s": 2}
        base = flavor_map.get(self.flavor.lower(), hash(self.flavor) % 3)
        # Slight deterministic offset from spatial parity to differentiate coincident flavors
        parity = int((np.sign(self.position).clip(min=0).sum()) % 3)
        return (base + parity) % 3


@dataclass
class CompositeConfig:
    """
    Topological pushout (gluing) of a set of Kq into a composite configuration.

    Attributes:
    - instantons: list[InstantonKq]
    - time_t: float simulation time for the composite snapshot
    - is_stable: boolean, true when topological/color constraints indicate a stable baryon-like state
    - center_position: np.ndarray barycenter of constituent instantons
    - baryon_id: optional UUID shared by stabilized constituents
    - composition: tuple[str, ...] sorted flavors (e.g., ('d','u','u'))

    Stability criterion (starter heuristic):
    - Color neutrality via Z3: sum(holonomy_z3) % 3 == 0
    - Minimum of 3 constituents
    This is a placeholder aligned with Z3 holonomy neutrality; refine using full SKB criteria.
    """

    instantons: List[InstantonKq]
    time_t: float
    is_stable: bool = field(init=False)
    center_position: np.ndarray = field(init=False)
    baryon_id: Optional[uuid.UUID] = None
    composition: Tuple[str, ...] = field(init=False)

    def __post_init__(self) -> None:
        if len(self.instantons) == 0:
            raise ValueError("CompositeConfig requires at least one InstantonKq")
        self.center_position = self._compute_barycenter()
        self.composition = tuple(sorted([kq.flavor for kq in self.instantons]))
        self.is_stable = self._assess_stability()
        if self.is_stable and self.baryon_id is None:
            self.baryon_id = uuid.uuid4()

    def _compute_barycenter(self) -> np.ndarray:
        positions = np.stack([_normalize_position(kq.position) for kq in self.instantons], axis=0)
        return positions.mean(axis=0)

    def _assess_stability(self) -> bool:
        if len(self.instantons) < 3:
            return False
        total_z3 = sum(kq.holonomy_z3 for kq in self.instantons) % 3
        return total_z3 == 0



