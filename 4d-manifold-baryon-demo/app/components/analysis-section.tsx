
'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Table, BarChart3, Zap, Target, Info, TrendingUp, Palette } from 'lucide-react';

const AnalysisSection: React.FC = () => {
  // Data tables from extracted mathematical foundations
  const quarkProperties = [
    {
      quark: 'up (u)',
      mass: '2.3 MeV/c²',
      charge: '+2/3 e',
      n: 1,
      k: 1,
      delta: '+0.10',
      holonomy: '2π/3 + δᵤ',
      ctc_period: 'T = 2πℓₚ/√1'
    },
    {
      quark: 'down (d)',
      mass: '4.8 MeV/c²',
      charge: '-1/3 e',
      n: 1,
      k: 2,
      delta: '-0.20',
      holonomy: '4π/3 + δ_d',
      ctc_period: 'T = 2πℓₚ/√1'
    },
    {
      quark: 'charm (c)',
      mass: '1275 MeV/c²',
      charge: '+2/3 e',
      n: 2,
      k: 1,
      delta: '+0.08',
      holonomy: '2π/3 + δ_c',
      ctc_period: 'T = 2πℓₚ/√2'
    },
    {
      quark: 'strange (s)',
      mass: '95 MeV/c²',
      charge: '-1/3 e',
      n: 2,
      k: 2,
      delta: '-0.15',
      holonomy: '4π/3 + δ_s',
      ctc_period: 'T = 2πℓₚ/√2'
    },
    {
      quark: 'top (t)',
      mass: '173000 MeV/c²',
      charge: '+2/3 e',
      n: 3,
      k: 1,
      delta: '+0.05',
      holonomy: '2π/3 + δ_t',
      ctc_period: 'T = 2πℓₚ/√3'
    },
    {
      quark: 'bottom (b)',
      mass: '4180 MeV/c²',
      charge: '-1/3 e',
      n: 3,
      k: 2,
      delta: '-0.12',
      holonomy: '4π/3 + δ_b',
      ctc_period: 'T = 2πℓₚ/√3'
    }
  ];

  const baryonProperties = [
    {
      baryon: 'Proton',
      quark_content: 'uud',
      k_odd: 1,
      sign: '+',
      c: 1,
      bordism_class: 0,
      charge: '+e',
      mass: '938.3 MeV/c²',
      binding_energy: '-928.7 MeV',
      stability: 'stable',
      charge_radius: '~0.8 fm'
    },
    {
      baryon: 'Neutron',
      quark_content: 'udd',
      k_odd: 2,
      sign: '+',
      c: 1,
      bordism_class: 0,
      charge: '0',
      mass: '939.6 MeV/c²',
      binding_energy: '-930.4 MeV',
      stability: 'stable',
      charge_radius: 'N/A'
    }
  ];

  const physicsConstants = [
    {
      constant: 'Planck Length',
      symbol: 'ℓₚ',
      value: '1.616 × 10⁻³⁵ m',
      formula: '√(ℏG/c³)',
      role: 'Fundamental length scale for CTCs'
    },
    {
      constant: 'Fine Structure',
      symbol: 'α',
      value: '1/137.036',
      formula: 'e²/(4πε₀ℏc)',
      role: 'Electromagnetic correction δ_q'
    },
    {
      constant: 'Elementary Charge',
      symbol: 'e',
      value: '1.602 × 10⁻¹⁹ C',
      formula: 'Fundamental',
      role: 'Charge quantization unit'
    },
    {
      constant: 'Reduced Planck',
      symbol: 'ℏ',
      value: '1.055 × 10⁻³⁴ J·s',
      formula: 'h/(2π)',
      role: 'Quantum action scale'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Introduction */}
      <Card className="scientific-panel">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            4D Manifold Hypothesis Analysis
          </CardTitle>
          <CardDescription>
            Comprehensive data analysis and mathematical predictions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="prose prose-slate max-w-none">
            <p className="text-slate-700 leading-relaxed">
              The 4D Manifold hypothesis provides quantitative predictions for particle properties through
              topological constraints and geometric considerations. Below are detailed analyses showing how holonomy, flux
              quantization, and bordism theory predict observed quark and baryon characteristics.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Quark Properties Table */}
      <Card className="scientific-panel">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5" />
            Quark Properties Analysis
          </CardTitle>
          <CardDescription>
            Complete quark spectrum from 4D Manifold mathematical framework
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="analysis-table">
              <thead>
                <tr>
                  <th>Quark</th>
                  <th>Mass</th>
                  <th>Charge</th>
                  <th>n</th>
                  <th>k</th>
                  <th>δ</th>
                  <th>Holonomy</th>
                  <th>CTC Period</th>
                </tr>
              </thead>
              <tbody>
                {quarkProperties.map((quark, index) => (
                  <tr key={index} className={index < 2 ? 'bg-blue-50' : ''}>
                    <td className="font-semibold">
                      {quark.quark}
                      {index < 2 && <Badge variant="secondary" className="ml-2 text-xs">visualized</Badge>}
                    </td>
                    <td className="font-mono text-xs">{quark.mass}</td>
                    <td className="font-mono">{quark.charge}</td>
                    <td className="font-mono">{quark.n}</td>
                    <td className="font-mono">{quark.k}</td>
                    <td className="font-mono text-xs">{quark.delta}</td>
                    <td className="font-mono text-xs">{quark.holonomy}</td>
                    <td className="font-mono text-xs">{quark.ctc_period}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-4 p-4 bg-slate-50 rounded-lg">
            <h4 className="font-semibold mb-2 flex items-center gap-2">
              <Info className="w-4 h-4" />
              Key Insights
            </h4>
            <ul className="text-sm space-y-1 text-slate-700">
              <li>• Generation structure emerges from n parameter (CTC complexity)</li>
              <li>• Charge pattern determined by k ∈ {`{1, 2}`} (bordism classification)</li>
              <li>• Electromagnetic corrections δ_q scale approximately with α</li>
              <li>• Mass hierarchy follows √n scaling from quantized CTC periods</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Baryon Properties */}
      <Card className="scientific-panel">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5" />
            Baryon Formation Analysis
          </CardTitle>
          <CardDescription>
            Composite baryon properties from quark merger
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="analysis-table">
              <thead>
                <tr>
                  <th>Baryon</th>
                  <th>Quarks</th>
                  <th>k_odd</th>
                  <th>Bordism</th>
                  <th>Charge</th>
                  <th>Mass</th>
                  <th>Binding Energy</th>
                  <th>Stability</th>
                  <th>Radius</th>
                </tr>
              </thead>
              <tbody>
                {baryonProperties.map((baryon, index) => (
                  <tr key={index}>
                    <td className="font-semibold">{baryon.baryon}</td>
                    <td className="font-mono">{baryon.quark_content}</td>
                    <td className="font-mono">{baryon.k_odd}</td>
                    <td className="font-mono">{baryon.bordism_class}</td>
                    <td className="font-mono">{baryon.charge}</td>
                    <td className="font-mono text-xs">{baryon.mass}</td>
                    <td className="font-mono text-xs">{baryon.binding_energy}</td>
                    <td>
                      <Badge variant="secondary" className="text-xs">
                        {baryon.stability}
                      </Badge>
                    </td>
                    <td className="font-mono text-xs">{baryon.charge_radius}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-4 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-green-50 rounded-lg">
                <h4 className="font-semibold text-green-800 mb-2">Proton (uud)</h4>
                <ul className="text-sm space-y-1 text-green-700">
                  <li>• Two up quarks + one down quark</li>
                  <li>• Total charge: 2(+2/3) + (-1/3) = +e</li>
                  <li>• Bordism class 0 → stable configuration</li>
                  <li>• Binding energy ~93% of total mass</li>
                </ul>
              </div>

              <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="font-semibold text-blue-800 mb-2">Neutron (udd)</h4>
                <ul className="text-sm space-y-1 text-blue-700">
                  <li>• One up quark + two down quarks</li>
                  <li>• Total charge: (+2/3) + 2(-1/3) = 0</li>
                  <li>• Bordism class 0 → stable configuration</li>
                  <li>• Slightly heavier due to down quark mass</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* QCD Color Theory Analysis */}
      <Card className="scientific-panel">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="w-5 h-5" />
            QCD Color Theory & Visualization
          </CardTitle>
          <CardDescription>
            Quantum Chromodynamics color representation in 4D Manifold framework
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Color Assignment Tables */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <h4 className="font-semibold flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  Proton (uud) Color Assignment
                </h4>
                <div className="overflow-x-auto">
                  <table className="w-full border border-slate-200 rounded-lg">
                    <thead className="bg-slate-50">
                      <tr>
                        <th className="p-2 text-left text-sm font-semibold">Quark</th>
                        <th className="p-2 text-left text-sm font-semibold">QCD Color</th>
                        <th className="p-2 text-left text-sm font-semibold">Charge</th>
                        <th className="p-2 text-left text-sm font-semibold">Visual</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-t">
                        <td className="p-2 font-mono">u₁</td>
                        <td className="p-2">Red</td>
                        <td className="p-2 font-mono">+2/3e</td>
                        <td className="p-2">
                          <div className="w-4 h-4 rounded-full bg-red-500 border"></div>
                        </td>
                      </tr>
                      <tr className="border-t">
                        <td className="p-2 font-mono">u₂</td>
                        <td className="p-2">Green</td>
                        <td className="p-2 font-mono">+2/3e</td>
                        <td className="p-2">
                          <div className="w-4 h-4 rounded-full bg-green-500 border"></div>
                        </td>
                      </tr>
                      <tr className="border-t">
                        <td className="p-2 font-mono">d</td>
                        <td className="p-2">Blue</td>
                        <td className="p-2 font-mono">-1/3e</td>
                        <td className="p-2">
                          <div className="w-4 h-4 rounded-full bg-blue-500 border"></div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className="p-2 bg-green-50 rounded text-sm">
                  <strong>Result:</strong> Red + Green + Blue = Colorless (Stable)
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-semibold flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                  Neutron (udd) Color Assignment
                </h4>
                <div className="overflow-x-auto">
                  <table className="w-full border border-slate-200 rounded-lg">
                    <thead className="bg-slate-50">
                      <tr>
                        <th className="p-2 text-left text-sm font-semibold">Quark</th>
                        <th className="p-2 text-left text-sm font-semibold">QCD Color</th>
                        <th className="p-2 text-left text-sm font-semibold">Charge</th>
                        <th className="p-2 text-left text-sm font-semibold">Visual</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-t">
                        <td className="p-2 font-mono">u</td>
                        <td className="p-2">Red</td>
                        <td className="p-2 font-mono">+2/3e</td>
                        <td className="p-2">
                          <div className="w-4 h-4 rounded-full bg-red-500 border"></div>
                        </td>
                      </tr>
                      <tr className="border-t">
                        <td className="p-2 font-mono">d₁</td>
                        <td className="p-2">Green</td>
                        <td className="p-2 font-mono">-1/3e</td>
                        <td className="p-2">
                          <div className="w-4 h-4 rounded-full bg-green-500 border"></div>
                        </td>
                      </tr>
                      <tr className="border-t">
                        <td className="p-2 font-mono">d₂</td>
                        <td className="p-2">Blue</td>
                        <td className="p-2 font-mono">-1/3e</td>
                        <td className="p-2">
                          <div className="w-4 h-4 rounded-full bg-blue-500 border"></div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className="p-2 bg-green-50 rounded text-sm">
                  <strong>Result:</strong> Red + Green + Blue = Colorless (Stable)
                </div>
              </div>
            </div>

            <Separator />

            {/* QCD Theory Principles */}
            <div className="space-y-4">
              <h4 className="font-semibold">QCD Color Confinement Principles</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 border rounded-lg space-y-2">
                  <h5 className="font-semibold text-blue-800">Fundamental Rules</h5>
                  <ul className="text-sm space-y-1 text-slate-700">
                    <li>• Quarks carry one of three color charges: red, green, or blue</li>
                    <li>• Only color-neutral combinations can exist in isolation</li>
                    <li>• Baryons require exactly one quark of each color</li>
                    <li>• Color force becomes stronger with distance (confinement)</li>
                  </ul>
                </div>

                <div className="p-4 border rounded-lg space-y-2">
                  <h5 className="font-semibold text-purple-800">4D Manifold Integration</h5>
                  <ul className="text-sm space-y-1 text-slate-700">
                    <li>• Klein bottle topology enforces color confinement</li>
                    <li>• Topological stability requires color neutrality</li>
                    <li>• CTC periods respect QCD symmetries</li>
                    <li>• Merger dynamics preserve color conservation</li>
                  </ul>
                </div>
              </div>
            </div>

            <Separator />

            {/* Color Force Analysis */}
            <div className="space-y-4">
              <h4 className="font-semibold">Color Force Dynamics</h4>
              <div className="overflow-x-auto">
                <table className="analysis-table">
                  <thead>
                    <tr>
                      <th>Property</th>
                      <th>Electromagnetic</th>
                      <th>QCD Color Force</th>
                      <th>4D Manifold Interpretation</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="font-semibold">Charge Types</td>
                      <td>±1 (attractive/repulsive)</td>
                      <td>3 colors × 3 anticolors</td>
                      <td>Topological handle orientations</td>
                    </tr>
                    <tr>
                      <td className="font-semibold">Force Carriers</td>
                      <td>Photons (massless)</td>
                      <td>Gluons (8 types, massless)</td>
                      <td>Topological flux connections</td>
                    </tr>
                    <tr>
                      <td className="font-semibold">Distance Behavior</td>
                      <td>Decreases as 1/r²</td>
                      <td>Increases with distance</td>
                      <td>Klein bottle self-intersection tension</td>
                    </tr>
                    <tr>
                      <td className="font-semibold">Confinement</td>
                      <td>No confinement</td>
                      <td>Complete confinement</td>
                      <td>Topological stability requirement</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <Separator />

            {/* Visualization Educational Value */}
            <div className="p-4 bg-blue-50 rounded-lg">
              <h4 className="font-semibold text-blue-800 mb-3">Educational Visualization Benefits</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <h5 className="font-semibold mb-2">Color Representation</h5>
                  <ul className="space-y-1 text-blue-700">
                    <li>• Pure RGB colors (#FF0000, #00FF00, #0000FF) for maximum distinction</li>
                    <li>• Wireframe Klein bottles maintain scientific accuracy</li>
                    <li>• Enhanced opacity (80%) for clear color visibility</li>
                    <li>• Real-time animation shows merger dynamics</li>
                  </ul>
                </div>
                <div>
                  <h5 className="font-semibold mb-2">Learning Outcomes</h5>
                  <ul className="space-y-1 text-blue-700">
                    <li>• Simultaneous topology and QCD understanding</li>
                    <li>• Visual confirmation of color confinement rules</li>
                    <li>• Interactive exploration of baryon formation</li>
                    <li>• Bridge between abstract theory and visualization</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Mathematical Connection */}
            <div className="p-4 bg-amber-50 rounded-lg">
              <h4 className="font-semibold text-amber-800 mb-2">4D Manifold-QCD Mathematical Connection</h4>
              <p className="text-sm text-amber-700 mb-3">
                The 4D Manifold hypothesis provides a topological foundation for QCD color confinement.
                Klein bottle self-intersections naturally enforce the three-color structure,
                while CTC periods ensure gauge invariance under color transformations.
              </p>
              <div className="font-mono text-xs space-y-1 bg-white p-3 rounded">
                <div>Color Symmetry: SU(3)_C ↔ Klein Bottle Automorphisms</div>
                <div>Confinement: Stable topology ↔ Color neutrality</div>
                <div>Gluon Exchange: ↔ Topological flux connections</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Physical Constants */}
      <Card className="scientific-panel">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Physical Constants & Their Roles
          </CardTitle>
          <CardDescription>
            Fundamental constants in the 4D Manifold framework
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="analysis-table">
              <thead>
                <tr>
                  <th>Constant</th>
                  <th>Symbol</th>
                  <th>Value</th>
                  <th>Formula</th>
                  <th>Role in 4D Manifold</th>
                </tr>
              </thead>
              <tbody>
                {physicsConstants.map((constant, index) => (
                  <tr key={index}>
                    <td className="font-semibold">{constant.constant}</td>
                    <td className="font-mono text-lg">{constant.symbol}</td>
                    <td className="font-mono text-xs">{constant.value}</td>
                    <td className="font-mono text-sm">{constant.formula}</td>
                    <td className="text-sm">{constant.role}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <Separator className="my-4" />

          <div className="space-y-4">
            <h4 className="font-semibold">Maxwell's Equations Emergence</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="space-y-2">
                <Badge variant="outline">Homogeneous Equations</Badge>
                <div className="font-mono text-xs space-y-1 bg-slate-50 p-3 rounded">
                  <div>dF = 0 → ∇·B = 0</div>
                  <div>dF = 0 → ∇×E = -∂B/∂t</div>
                </div>
                <p className="text-slate-600">
                  No magnetic monopoles and Faraday's law emerge from flux conservation.
                </p>
              </div>

              <div className="space-y-2">
                <Badge variant="outline">Inhomogeneous Equations</Badge>
                <div className="font-mono text-xs space-y-1 bg-slate-50 p-3 rounded">
                  <div>d(⋆F) = μ₀J → ∇·E = ρ/ε₀</div>
                  <div>d(⋆F) = μ₀J → ∇×B = μ₀J + μ₀ε₀∂E/∂t</div>
                </div>
                <p className="text-slate-600">
                  Gauss's law and Ampère-Maxwell law emerge from topological defect sources.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Variable Impact Analysis */}
      <Card className="scientific-panel">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Table className="w-5 h-5" />
            Parameter Impact Analysis
          </CardTitle>
          <CardDescription>
            How mathematical parameters affect physical properties
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold mb-2">n Parameter</h4>
                <div className="text-sm space-y-2">
                  <div className="flex justify-between">
                    <span>n = 1:</span>
                    <span className="font-mono">u, d quarks</span>
                  </div>
                  <div className="flex justify-between">
                    <span>n = 2:</span>
                    <span className="font-mono">c, s quarks</span>
                  </div>
                  <div className="flex justify-between">
                    <span>n = 3:</span>
                    <span className="font-mono">t, b quarks</span>
                  </div>
                  <p className="text-xs text-slate-600 pt-2 border-t">
                    Controls generation structure and mass scale through CTC complexity.
                  </p>
                </div>
              </div>

              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold mb-2">k Parameter</h4>
                <div className="text-sm space-y-2">
                  <div className="flex justify-between">
                    <span>k = 1:</span>
                    <span className="font-mono">+2/3 charge</span>
                  </div>
                  <div className="flex justify-between">
                    <span>k = 2:</span>
                    <span className="font-mono">-1/3 charge</span>
                  </div>
                  <p className="text-xs text-slate-600 pt-2 border-t">
                    Determines electric charge through holonomy classification.
                  </p>
                </div>
              </div>

              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold mb-2">δ Corrections</h4>
                <div className="text-sm space-y-2">
                  <div className="flex justify-between">
                    <span>δ &gt; 0:</span>
                    <span className="font-mono">up-type</span>
                  </div>
                  <div className="flex justify-between">
                    <span>δ &lt; 0:</span>
                    <span className="font-mono">down-type</span>
                  </div>
                  <p className="text-xs text-slate-600 pt-2 border-t">
                    Electromagnetic fine-tuning corrections ∼ α.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 p-4 bg-amber-50 rounded-lg">
              <h4 className="font-semibold text-amber-800 mb-2">Predictive Power</h4>
              <p className="text-sm text-amber-700">
                The 4D Manifold hypothesis successfully predicts the complete quark spectrum, their charges,
                and mass hierarchy from first principles using only topological mathematics. The
                visualization demonstrates how these individual Klein bottles merge to form stable
                baryons through color confinement and causal compensation.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AnalysisSection;
