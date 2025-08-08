
'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { 
  Target, 
  Atom, 
  Layers, 
  RotateCw, 
  Zap,
  Activity,
  Gauge,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { QuaternionicHolonomy } from './color-confinement-engine';
import SafeMathComponent from './safe-math-component';

interface EnhancedMathDisplayProps {
  holonomies: QuaternionicHolonomy[];
  pinMinusValid: boolean[];
  bordismClass: 0 | 1;
  isColorNeutral: boolean;
  confinementStrength: number;
  deformationMagnitude: number;
  progress: number;
  selectedPreset: string;
}

const EnhancedMathDisplay: React.FC<EnhancedMathDisplayProps> = ({
  holonomies,
  pinMinusValid,
  bordismClass,
  isColorNeutral,
  confinementStrength,
  deformationMagnitude,
  progress,
  selectedPreset
}) => {
  const [expandedSections, setExpandedSections] = React.useState({
    holonomy: true,
    pinMinus: true,
    bordism: true,
    deformation: true,
    realTime: true
  });

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Calculate holonomy product for color neutrality verification
  const calculateHolonomyProduct = () => {
    let productReal = 1;
    let productImag = 0;

    holonomies.forEach(h => {
      const cosHalf = Math.cos(h.theta / 2);
      const sinHalf = Math.sin(h.theta / 2);
      
      const newReal = productReal * cosHalf - productImag * sinHalf;
      const newImag = productReal * sinHalf + productImag * cosHalf;
      
      productReal = newReal;
      productImag = newImag;
    });

    return { real: productReal, imag: productImag };
  };

  const holonomyProduct = calculateHolonomyProduct();

  return (
    <div className="space-y-6">
      {/* Real-time Holonomy Analysis */}
      <Card className="scientific-panel">
        <CardHeader 
          className="cursor-pointer"
          onClick={() => toggleSection('holonomy')}
        >
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Target className="w-5 h-5" />
              Quaternionic Holonomy Analysis
            </div>
            {expandedSections.holonomy ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </CardTitle>
          <CardDescription>
            Real-time holonomy constraint calculations
          </CardDescription>
        </CardHeader>
        
        {expandedSections.holonomy && (
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div>
                <Badge variant="secondary" className="mb-2">Constraint Formula</Badge>
                <SafeMathComponent 
                  formula="\prod_{i=1}^3 \left(\cos\frac{\theta_i}{2} + q_i \sin\frac{\theta_i}{2}\right) = 1" 
                  display 
                />
              </div>

              <Separator />

              <div className="space-y-3">
                <h4 className="font-semibold">Current Holonomy Values:</h4>
                {holonomies.map((h, i) => (
                  <div key={i} className="bg-slate-50 p-3 rounded space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">
                        Quark {i + 1} ({selectedPreset === 'proton' 
                          ? (i < 2 ? 'up' : 'down')
                          : (i === 0 ? 'up' : 'down')
                        }):
                      </span>
                      <Badge variant="outline">
                        θ = {h.theta.toFixed(3)}
                      </Badge>
                    </div>
                    
                    <div className="text-sm font-mono space-y-1">
                      <div>cos(θ/2) = {Math.cos(h.theta / 2).toFixed(4)}</div>
                      <div>sin(θ/2) = {Math.sin(h.theta / 2).toFixed(4)}</div>
                      <div>Color Phase = {h.colorPhase.toFixed(4)}</div>
                    </div>

                    <div className="text-xs space-y-1">
                      <div>Quaternion: w={h.quaternion.w.toFixed(3)}, x={h.quaternion.x.toFixed(3)}, y={h.quaternion.y.toFixed(3)}, z={h.quaternion.z.toFixed(3)}</div>
                    </div>
                  </div>
                ))}
              </div>

              <Separator />

              <div className="bg-blue-50 p-3 rounded">
                <h4 className="font-semibold text-blue-800 mb-2">Holonomy Product:</h4>
                <div className="font-mono text-sm space-y-1">
                  <div>Real part: {holonomyProduct.real.toFixed(6)}</div>
                  <div>Imaginary part: {holonomyProduct.imag.toFixed(6)}</div>
                  <div>Magnitude: {Math.sqrt(holonomyProduct.real ** 2 + holonomyProduct.imag ** 2).toFixed(6)}</div>
                </div>
                <div className="mt-2">
                  <Badge variant={isColorNeutral ? "default" : "destructive"}>
                    {isColorNeutral ? "Constraint Satisfied" : "Constraint Violated"}
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Pin⁻ Structure Analysis */}
      <Card className="scientific-panel">
        <CardHeader 
          className="cursor-pointer"
          onClick={() => toggleSection('pinMinus')}
        >
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Layers className="w-5 h-5" />
              Pin⁻ Structure Verification
            </div>
            {expandedSections.pinMinus ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </CardTitle>
          <CardDescription>
            Spin structure obstruction analysis
          </CardDescription>
        </CardHeader>
        
        {expandedSections.pinMinus && (
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div>
                <Badge variant="secondary" className="mb-2">Pin⁻ Condition</Badge>
                <SafeMathComponent 
                  formula="w_2(TK) + w_1^2(TK) = 0 \in H^2(K; \mathbb{Z}_2)" 
                  display 
                />
              </div>

              <Separator />

              <div className="space-y-3">
                <h4 className="font-semibold">Stiefel-Whitney Class Analysis:</h4>
                {pinMinusValid.map((valid, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded">
                    <span className="font-medium">Klein Bottle {i + 1}:</span>
                    <div className="flex items-center gap-2">
                      <Badge variant={valid ? "default" : "destructive"}>
                        {valid ? "Valid Pin⁻" : "Invalid Pin⁻"}
                      </Badge>
                      <Progress value={valid ? 100 : 0} className="w-16" />
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-green-50 p-3 rounded">
                <h4 className="font-semibold text-green-800 mb-2">Physical Interpretation:</h4>
                <p className="text-sm text-green-700">
                  Pin⁻ structures ensure that spinor fields can be globally defined on Klein bottles. 
                  Valid Pin⁻ structures are necessary for consistent quantum field theory on these topological spaces.
                </p>
              </div>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Bordism Classification */}
      <Card className="scientific-panel">
        <CardHeader 
          className="cursor-pointer"
          onClick={() => toggleSection('bordism')}
        >
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Atom className="w-5 h-5" />
              Bordism Class Analysis
            </div>
            {expandedSections.bordism ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </CardTitle>
          <CardDescription>
            Topological stability classification
          </CardDescription>
        </CardHeader>
        
        {expandedSections.bordism && (
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div>
                <Badge variant="secondary" className="mb-2">Bordism Group</Badge>
                <SafeMathComponent 
                  formula="\Omega_2^{\text{Pin}^-}(pt) = \mathbb{Z}_2" 
                  display 
                />
              </div>

              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h4 className="font-semibold">Current Classification:</h4>
                  <div className="p-3 bg-slate-50 rounded">
                    <div className="flex items-center justify-between">
                      <span>Bordism Class:</span>
                      <Badge variant={bordismClass === 0 ? "default" : "secondary"}>
                        Class {bordismClass}
                      </Badge>
                    </div>
                    <div className="mt-2 text-sm">
                      <div className="text-slate-600">
                        {bordismClass === 0 
                          ? "Even number of Pin⁻ Klein bottles → Stable baryon"
                          : "Odd number → Unstable configuration"
                        }
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-semibold">Pin⁻ Count Analysis:</h4>
                  <div className="p-3 bg-slate-50 rounded">
                    <div className="text-sm space-y-1">
                      <div>Valid Pin⁻ structures: {pinMinusValid.filter(v => v).length}</div>
                      <div>Invalid Pin⁻ structures: {pinMinusValid.filter(v => !v).length}</div>
                      <div>Parity: {pinMinusValid.filter(v => v).length % 2 === 0 ? 'Even' : 'Odd'}</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className={`p-3 rounded ${bordismClass === 0 ? 'bg-green-50' : 'bg-red-50'}`}>
                <h4 className={`font-semibold mb-2 ${bordismClass === 0 ? 'text-green-800' : 'text-red-800'}`}>
                  Stability Analysis:
                </h4>
                <p className={`text-sm ${bordismClass === 0 ? 'text-green-700' : 'text-red-700'}`}>
                  {bordismClass === 0 
                    ? "The system belongs to the trivial bordism class, indicating a stable baryon configuration that can exist as an isolated particle."
                    : "The system belongs to the non-trivial bordism class, indicating topological instability that prevents long-term existence."
                  }
                </p>
              </div>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Deformation Tensor Analysis */}
      <Card className="scientific-panel">
        <CardHeader 
          className="cursor-pointer"
          onClick={() => toggleSection('deformation')}
        >
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5" />
              Deformation Tensor Field
            </div>
            {expandedSections.deformation ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </CardTitle>
          <CardDescription>
            Stress-strain relationship analysis
          </CardDescription>
        </CardHeader>
        
        {expandedSections.deformation && (
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div>
                <Badge variant="secondary" className="mb-2">Constitutive Relation</Badge>
                <SafeMathComponent 
                  formula="\sigma_{ij} = \lambda \delta_{ij} \text{tr}(\epsilon) + 2\mu \epsilon_{ij}" 
                  display 
                />
                <p className="text-sm text-slate-600 mt-2">
                  Where σ is stress tensor, ε is strain tensor, λ and μ are Lamé parameters
                </p>
              </div>

              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold mb-2">Deformation Metrics:</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between p-2 bg-slate-50 rounded text-sm">
                      <span>Magnitude:</span>
                      <span className="font-mono">{deformationMagnitude.toFixed(4)}</span>
                    </div>
                    <div className="flex justify-between p-2 bg-slate-50 rounded text-sm">
                      <span>Progress Factor:</span>
                      <span className="font-mono">{progress.toFixed(4)}</span>
                    </div>
                    <div className="flex justify-between p-2 bg-slate-50 rounded text-sm">
                      <span>Confinement Effect:</span>
                      <span className="font-mono">{(confinementStrength * progress).toFixed(4)}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Stress Distribution:</h4>
                  <div className="space-y-2">
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span>Tensile Stress:</span>
                        <span>{(deformationMagnitude * 100).toFixed(1)}%</span>
                      </div>
                      <Progress value={Math.min(100, deformationMagnitude * 100)} className="h-2" />
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span>Shear Stress:</span>
                        <span>{(progress * 80).toFixed(1)}%</span>
                      </div>
                      <Progress value={Math.min(100, progress * 80)} className="h-2" />
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span>Compression:</span>
                        <span>{(confinementStrength * 60).toFixed(1)}%</span>
                      </div>
                      <Progress value={Math.min(100, confinementStrength * 60)} className="h-2" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Real-time System Status */}
      <Card className="scientific-panel">
        <CardHeader 
          className="cursor-pointer"
          onClick={() => toggleSection('realTime')}
        >
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Gauge className="w-5 h-5" />
              Real-time System Status
            </div>
            {expandedSections.realTime ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </CardTitle>
          <CardDescription>
            Live mathematical constraint verification
          </CardDescription>
        </CardHeader>
        
        {expandedSections.realTime && (
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-3 bg-slate-50 rounded">
                <div className="text-2xl font-bold mb-1">
                  {isColorNeutral ? '✓' : '✗'}
                </div>
                <div className="text-sm font-semibold">Color Neutrality</div>
                <div className="text-xs text-slate-600">
                  ∏exp(iθᵢ/2) = {isColorNeutral ? '1' : '≠1'}
                </div>
              </div>

              <div className="text-center p-3 bg-slate-50 rounded">
                <div className="text-2xl font-bold mb-1">
                  {pinMinusValid.every(v => v) ? '✓' : '✗'}
                </div>
                <div className="text-sm font-semibold">Pin⁻ Validity</div>
                <div className="text-xs text-slate-600">
                  w₂ + w₁² = 0 (mod 2)
                </div>
              </div>

              <div className="text-center p-3 bg-slate-50 rounded">
                <div className="text-2xl font-bold mb-1">
                  {bordismClass === 0 ? '✓' : '✗'}
                </div>
                <div className="text-sm font-semibold">Stability</div>
                <div className="text-xs text-slate-600">
                  Ω₂^(Pin⁻) = {bordismClass}
                </div>
              </div>
            </div>

            <Separator />

            <div className="space-y-3">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Overall System Health:</span>
                  <Badge variant={isColorNeutral && bordismClass === 0 ? "default" : "destructive"}>
                    {isColorNeutral && bordismClass === 0 ? "Stable" : "Unstable"}
                  </Badge>
                </div>
                <Progress 
                  value={
                    (isColorNeutral ? 50 : 0) + 
                    (bordismClass === 0 ? 50 : 0)
                  } 
                  className="h-3" 
                />
              </div>

              <div className="bg-amber-50 p-3 rounded">
                <h4 className="font-semibold text-amber-800 mb-2">Mathematical Consistency Check:</h4>
                <div className="text-sm text-amber-700 space-y-1">
                  <div>• Holonomy product magnitude: {Math.sqrt(holonomyProduct.real ** 2 + holonomyProduct.imag ** 2).toFixed(6)}</div>
                  <div>• Valid Pin⁻ structures: {pinMinusValid.filter(v => v).length}/3</div>
                  <div>• Confinement strength: {(confinementStrength * 100).toFixed(1)}%</div>
                  <div>• Merger progress: {(progress * 100).toFixed(1)}%</div>
                </div>
              </div>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
};

export default EnhancedMathDisplay;
