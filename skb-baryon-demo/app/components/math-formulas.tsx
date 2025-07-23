
'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Zap, Atom, RotateCw, Target, Infinity, Layers } from 'lucide-react';
import SafeMathComponent from './safe-math-component';

const MathFormulas: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Introduction */}
      <Card className="scientific-panel">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Atom className="w-5 h-5" />
            Mathematical Framework
          </CardTitle>
          <CardDescription>
            Core equations governing SKB baryon formation and properties
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-slate-700 leading-relaxed">
            The SKB hypothesis uses advanced topological mathematics to describe particle formation. 
            Below are the key equations that govern how quarks (individual Klein bottles) merge to 
            form stable baryons through topologically constrained processes.
          </p>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Holonomy and Charge */}
        <Card className="scientific-panel">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5" />
              Holonomy & Charge Quantization
            </CardTitle>
            <CardDescription>
              How electric charge emerges from topology
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div>
                <Badge variant="secondary" className="mb-2">Holonomy Formula</Badge>
                <SafeMathComponent formula="\theta_q = \frac{2\pi k}{3} + \delta_q" display />
                <p className="text-sm text-slate-600 mt-2">
                  Where <em>k</em> ∈ {`{1, 2}`} for quarks and δ<sub>q</sub> is the electromagnetic correction.
                </p>
              </div>
              
              <Separator />
              
              <div>
                <Badge variant="secondary" className="mb-2">Flux Quantization</Badge>
                <SafeMathComponent formula="Q = \frac{1}{2\pi} \oint F" display />
                <p className="text-sm text-slate-600 mt-2">
                  Electric charge via flux integration over the 3D boundary ∂K<sub>p</sub>.
                </p>
              </div>

              <div className="bg-slate-50 p-3 rounded text-sm">
                <div className="font-semibold mb-2">Specific Values:</div>
                <div className="space-y-1 font-mono text-xs">
                  <div>Up quark: θ<sub>u</sub> = 2π/3 + 0.10 → Q<sub>u</sub> = +2/3 e</div>
                  <div>Down quark: θ<sub>d</sub> = 4π/3 - 0.20 → Q<sub>d</sub> = -1/3 e</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* CTC Period & Mass Quantization */}
        <Card className="scientific-panel">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5" />
              CTC Period & Mass Quantization
            </CardTitle>
            <CardDescription>
              Analytical derivations from closed timelike curves
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div>
                <Badge variant="secondary" className="mb-2">CTC Period Formula</Badge>
                <SafeMathComponent formula="T_q = \frac{2\pi t_P}{\sqrt{n}}" display />
                <p className="text-sm text-slate-600 mt-2">
                  Where t<sub>P</sub> = √(ℏG/c⁵) is the Planck time.
                </p>
              </div>
              
              <Separator />
              
              <div>
                <Badge variant="secondary" className="mb-2">Mass Quantization</Badge>
                <SafeMathComponent formula="m_q = \frac{2\pi n\hbar}{c^2 T_q}" display />
                <p className="text-sm text-slate-600 mt-2">
                  Direct relationship between CTC period and quark mass.
                </p>
              </div>

              <div>
                <Badge variant="secondary" className="mb-2">Scale Parameters</Badge>
                <div className="bg-slate-50 p-3 rounded space-y-2">
                  <div className="font-mono text-sm">
                    <div>scale_u = m_d/m_u ≈ 4.8/2.3 ≈ 2.09</div>
                    <div>scale_d = 1.0 (reference)</div>
                  </div>
                  <p className="text-xs text-slate-600">
                    CTC-based scaling with linear decrease during merger.
                  </p>
                </div>
              </div>

              <div>
                <Badge variant="secondary" className="mb-2">Energy Rotation</Badge>
                <SafeMathComponent formula="\omega_q = 0.1 \times \frac{m_u}{m_q} \times (1 - \text{progress})" display />
                <p className="text-sm text-slate-600 mt-2">
                  Rotation frequency decreases as quarks merge into baryon.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Klein Bottle Parametrics */}
        <Card className="scientific-panel">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <RotateCw className="w-5 h-5" />
              Klein Bottle Parametrics
            </CardTitle>
            <CardDescription>
              3D visualization equations for quarks
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div>
                <Badge variant="secondary" className="mb-2">4D Construction</Badge>
                <SafeMathComponent formula="(t, x, y, z) \sim (t + T, -x, y, z)" display />
              </div>
              
              <Separator />
              
              <div>
                <Badge variant="secondary" className="mb-2">3D Projection</Badge>
                <div className="space-y-2 text-sm font-mono bg-slate-50 p-3 rounded">
                  <div>x = (2 + cos(u/2)sin(v) - sin(u/2)sin(2v)) × cos(u) × s</div>
                  <div>y = (2 + cos(u/2)sin(v) - sin(u/2)sin(2v)) × sin(u) × s</div>
                  <div>z = sin(u/2)sin(v) + cos(u/2)sin(2v) × s</div>
                </div>
                <p className="text-sm text-slate-600 mt-2">
                  Where s = 0.8(1 - progress × 0.7) is the scale factor.
                </p>
              </div>

              <div>
                <Badge variant="secondary" className="mb-2">Parameter Ranges</Badge>
                <div className="text-sm space-y-1">
                  <div>u ∈ [0, 2π], v ∈ [0, 2π]</div>
                  <div>30 × 30 segments for rendering</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Color Confinement */}
        <Card className="scientific-panel">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Layers className="w-5 h-5" />
              Color Confinement
            </CardTitle>
            <CardDescription>
              Quaternionic holonomy constraint
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div>
                <Badge variant="secondary" className="mb-2">Confinement Condition</Badge>
                <SafeMathComponent formula="\prod_{i=1}^3 \left(\cos\frac{\theta_i}{2} + q_i \sin\frac{\theta_i}{2}\right) = 1" display />
                <p className="text-sm text-slate-600 mt-2">
                  Where q<sub>i</sub> are orthogonal quaternionic units (i, j, k).
                </p>
              </div>
              
              <Separator />
              
              <div>
                <Badge variant="secondary" className="mb-2">Pin⁻ Condition</Badge>
                <SafeMathComponent formula="w_2(TK) + w_1^2(TK) = 0 \in H^2(K; \mathbb{Z}_2)" display />
                <p className="text-sm text-slate-600 mt-2">
                  Ensures globally defined spinor fields on the Klein bottle.
                </p>
              </div>

              <div className="bg-blue-50 p-3 rounded text-sm">
                <div className="font-semibold mb-2 text-blue-800">Physical Meaning:</div>
                <p className="text-blue-700">
                  Only color-neutral combinations where the holonomy product equals 
                  identity can exist as stable composites. Individual quarks cannot 
                  exist due to uncompensated closed timelike curves.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* QCD Integration */}
        <Card className="scientific-panel">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Infinity className="w-5 h-5" />
              QCD Integration via SKB Hypothesis
            </CardTitle>
            <CardDescription>
              How topological defects reproduce quantum chromodynamics
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div>
                <Badge variant="secondary" className="mb-2">Color Confinement Mechanism</Badge>
                <SafeMathComponent formula="\text{Flux tube energy: } E(r) = \sigma \cdot r + \text{const}" display />
                <p className="text-sm text-slate-600 mt-2">
                  Linear confinement emerges from topological flux tubes between Klein bottles.
                </p>
              </div>
              
              <Separator />
              
              <div>
                <Badge variant="secondary" className="mb-2">Bordism Classes in Ω₂^(Pin⁻)</Badge>
                <SafeMathComponent formula="\Omega_2^{\text{Pin}^-}(pt) = \mathbb{Z}_2" display />
                <div className="bg-blue-50 p-3 rounded mt-2">
                  <div className="text-sm space-y-1">
                    <div className="font-semibold">Classification:</div>
                    <div>• Class 0: Even number of Pin⁻ Klein bottles → Stable baryons</div>
                    <div>• Class 1: Odd number → Unstable configurations</div>
                  </div>
                </div>
              </div>

              <div>
                <Badge variant="secondary" className="mb-2">Holonomy Color Matching</Badge>
                <SafeMathComponent formula="\prod_{i=1}^3 \exp(i\theta_i/2) = 1 \quad \text{(color neutrality)}" display />
                <p className="text-sm text-slate-600 mt-2">
                  Three-quark combinations must satisfy holonomy constraint for stability.
                </p>
              </div>

              <div>
                <Badge variant="secondary" className="mb-2">Flux Quantization Parameters</Badge>
                <div className="bg-slate-50 p-3 rounded space-y-2">
                  <div className="font-mono text-sm space-y-1">
                    <div>num_flux_arrows = 10 × |Q_q/e|</div>
                    <div>flux_length ∝ |Q_q|/e × (confinement_factor)</div>
                  </div>
                  <p className="text-xs text-slate-600">
                    Electric field visualization based on charge quantization.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Analytical Grid Optimization */}
        <Card className="scientific-panel">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Layers className="w-5 h-5" />
              Analytical Grid Optimization
            </CardTitle>
            <CardDescription>
              Enhanced visualization parameters for precision
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div>
                <Badge variant="secondary" className="mb-2">Grid Resolution</Badge>
                <div className="bg-slate-50 p-3 rounded">
                  <div className="font-mono text-sm">30 × 30 points, 100 frames</div>
                  <p className="text-xs text-slate-600 mt-2">
                    Optimized for smooth Klein bottle representation and merger transition.
                  </p>
                </div>
              </div>
              
              <Separator />
              
              <div>
                <Badge variant="secondary" className="mb-2">Progressive Scale Evolution</Badge>
                <SafeMathComponent formula="s_q(t) = s_{q,0} \cdot \text{ctc\_scale}_q \cdot (1-t) + s_{\text{final}} \cdot t" display />
                <p className="text-sm text-slate-600 mt-2">
                  Linear interpolation from individual CTC scales to merged baryon scale.
                </p>
              </div>

              <div className="bg-green-50 p-3 rounded">
                <h4 className="font-semibold text-green-800 mb-2">Physical Interpretation</h4>
                <p className="text-sm text-green-700">
                  The SKB hypothesis provides a geometric foundation for QCD phenomena: 
                  color confinement arises from topological flux tubes, asymptotic freedom 
                  emerges from decreasing CTC density at high energy, and the strong force 
                  is unified with gravity through spacetime topology.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Causal Compensation */}
      <Card className="scientific-panel">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Infinity className="w-5 h-5" />
            Causal Compensation Principle
          </CardTitle>
          <CardDescription>
            How SKBs maintain external causality despite internal CTCs
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Badge variant="secondary">External Causality</Badge>
              <SafeMathComponent formula="\oint T_\mu dx^\mu = 0" display />
              <p className="text-xs text-slate-600">
                For all external observers O ∉ K
              </p>
            </div>
            
            <div className="space-y-2">
              <Badge variant="secondary">Internal Consistency</Badge>
              <SafeMathComponent formula="[\nabla_\mu, \nabla_\nu]\psi = R_{\mu\nu} \psi" display />
              <p className="text-xs text-slate-600">
                Curvature relation within K
              </p>
            </div>
            
            <div className="space-y-2">
              <Badge variant="secondary">Gluing Compatibility</Badge>
              <SafeMathComponent formula="\Phi^*\omega_C = -\omega_K \text{ on } \partial K" display />
              <p className="text-xs text-slate-600">
                Boundary matching condition
              </p>
            </div>
          </div>

          <div className="mt-4 p-4 bg-amber-50 rounded-lg">
            <h4 className="font-semibold text-amber-800 mb-2">Confinement Energy</h4>
            <div className="space-y-2">
              <SafeMathComponent formula="E_{\text{sep}}(r) = \sigma \cdot r" display />
              <p className="text-sm text-amber-700">
                Linear confinement potential where σ is the causal string tension. 
                This explains why quarks cannot be separated - the energy cost grows 
                linearly with distance.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MathFormulas;
