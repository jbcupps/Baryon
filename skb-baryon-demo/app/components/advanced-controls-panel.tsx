
'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Settings2, 
  Zap, 
  Waves, 
  RotateCcw, 
  Target,
  Atom,
  Activity,
  Layers,
  Gauge,
  ChevronDown,
  ChevronUp,
  HelpCircle
} from 'lucide-react';
import { PhysicsParameters } from './advanced-physics-engine';
import { ConfinementParameters } from './color-confinement-engine';
import { ControlTooltip, StatusTooltip, MathTooltip } from '@/components/ui/tooltip-advanced';

interface AdvancedControlsPanelProps {
  // Physics parameters
  physicsParams: PhysicsParameters;
  setPhysicsParams: (params: PhysicsParameters) => void;
  
  // Confinement parameters
  confinementParams: ConfinementParameters;
  setConfinementParams: (params: ConfinementParameters) => void;
  
  // Advanced display options
  showDeformation: boolean;
  setShowDeformation: (show: boolean) => void;
  showStressTensor: boolean;
  setShowStressTensor: (show: boolean) => void;
  showFluidFlow: boolean;
  setShowFluidFlow: (show: boolean) => void;
  showNecking: boolean;
  setShowNecking: (show: boolean) => void;
  
  // Current state information
  confinementStrength: number;
  bordismClass: 0 | 1;
  isColorNeutral: boolean;
  deformationMagnitude: number;
}

const AdvancedControlsPanel: React.FC<AdvancedControlsPanelProps> = ({
  physicsParams,
  setPhysicsParams,
  confinementParams,
  setConfinementParams,
  showDeformation,
  setShowDeformation,
  showStressTensor,
  setShowStressTensor,
  showFluidFlow,
  setShowFluidFlow,
  showNecking,
  setShowNecking,
  confinementStrength,
  bordismClass,
  isColorNeutral,
  deformationMagnitude
}) => {
  const [expandedSections, setExpandedSections] = React.useState({
    confinement: true,
    physics: true,
    visualization: true,
    status: true
  });

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const resetToDefaults = () => {
    setPhysicsParams({
      deformationIntensity: 0.5,
      fluidViscosity: 0.3,
      elasticModulus: 0.4,
      vertexStiffness: 0.2,
      dampingFactor: 0.8,
      proximityThreshold: 0.5,
      neckingStrength: 0.3,
      bridgeFormation: 0.4,
      surfaceTension: 0.2,
      timeStep: 0.016,
      maxDeformation: 1.0
    });
    
    setConfinementParams({
      holonomyStrength: 1.0,
      pinMinusField: 0.8,
      bordismClass: 0,
      fluxTubeStrength: 0.6,
      confinementScale: 1.2
    });
  };

  return (
    <div className="space-y-4">
      {/* Color Confinement Controls */}
      <Card className="scientific-panel">
        <CardHeader 
          className="cursor-pointer" 
          onClick={() => toggleSection('confinement')}
        >
          <CardTitle className="flex items-center justify-between text-lg">
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4" />
              Color Confinement Parameters
            </div>
            {expandedSections.confinement ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </CardTitle>
          <CardDescription>
            Quaternionic holonomy and Pin⁻ structure controls
          </CardDescription>
        </CardHeader>
        
        {expandedSections.confinement && (
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div>
                <ControlTooltip
                  title="Holonomy Strength"
                  description="Controls the strength of quaternionic holonomy constraints in the color confinement mathematics"
                  range="0.0 - 2.0"
                  effect="Higher values enforce stricter holonomy product conditions ∏(cos(θᵢ/2) + qᵢsin(θᵢ/2)) = 1"
                  shortcut="H"
                >
                  <Label className="flex items-center gap-2 mb-2 cursor-help">
                    <HelpCircle className="w-3 h-3 text-slate-400" />
                    Holonomy
                    <Badge variant="outline" className="text-xs ml-auto">
                      {confinementParams.holonomyStrength.toFixed(2)}
                    </Badge>
                  </Label>
                </ControlTooltip>
                <Slider
                  value={[confinementParams.holonomyStrength]}
                  onValueChange={([value]) => 
                    setConfinementParams({...confinementParams, holonomyStrength: value})
                  }
                  min={0}
                  max={2}
                  step={0.1}
                  className="w-full"
                />
              </div>

              <div>
                <MathTooltip
                  formula="w₂(TK) + w₁²(TK) = 0"
                  explanation="Pin⁻ structure condition ensuring spinor fields can be globally defined on Klein bottles"
                  variables={[
                    { symbol: "w₁, w₂", meaning: "Stiefel-Whitney characteristic classes" },
                    { symbol: "TK", meaning: "Tangent bundle of Klein bottle K" },
                    { symbol: "H²(K;Z₂)", meaning: "Second cohomology with Z₂ coefficients" }
                  ]}
                >
                  <Label className="flex items-center gap-2 mb-2 cursor-help">
                    <HelpCircle className="w-3 h-3 text-slate-400" />
                    Pin⁻ Field
                    <Badge variant="outline" className="text-xs ml-auto">
                      {confinementParams.pinMinusField.toFixed(2)}
                    </Badge>
                  </Label>
                </MathTooltip>
                <Slider
                  value={[confinementParams.pinMinusField]}
                  onValueChange={([value]) => 
                    setConfinementParams({...confinementParams, pinMinusField: value})
                  }
                  min={0}
                  max={1}
                  step={0.05}
                  className="w-full"
                />
              </div>

              <div>
                <MathTooltip
                  formula="V(r) = σr"
                  explanation="Linear confinement potential representing QCD color force that grows with distance"
                  variables={[
                    { symbol: "σ", meaning: "String tension (~1 GeV/fm)" },
                    { symbol: "r", meaning: "Quark separation distance" },
                    { symbol: "V(r)", meaning: "Confinement potential energy" }
                  ]}
                >
                  <Label className="flex items-center gap-2 mb-2 cursor-help">
                    <HelpCircle className="w-3 h-3 text-slate-400" />
                    Flux Tube σ
                    <Badge variant="outline" className="text-xs ml-auto">
                      {confinementParams.fluxTubeStrength.toFixed(2)}
                    </Badge>
                  </Label>
                </MathTooltip>
                <Slider
                  value={[confinementParams.fluxTubeStrength]}
                  onValueChange={([value]) => 
                    setConfinementParams({...confinementParams, fluxTubeStrength: value})
                  }
                  min={0}
                  max={1}
                  step={0.05}
                  className="w-full"
                />
              </div>

              <div>
                <ControlTooltip
                  title="Confinement Scale"
                  description="Overall length scale parameter that controls the spatial extent of confinement effects"
                  range="0.5 - 2.0"
                  effect="Adjusts the characteristic distance over which color forces operate (~1 fm)"
                  shortcut="S"
                >
                  <Label className="flex items-center gap-2 mb-2 cursor-help">
                    <HelpCircle className="w-3 h-3 text-slate-400" />
                    Scale
                    <Badge variant="outline" className="text-xs ml-auto">
                      {confinementParams.confinementScale.toFixed(2)}
                    </Badge>
                  </Label>
                </ControlTooltip>
                <Slider
                  value={[confinementParams.confinementScale]}
                  onValueChange={([value]) => 
                    setConfinementParams({...confinementParams, confinementScale: value})
                  }
                  min={0.5}
                  max={2}
                  step={0.1}
                  className="w-full"
                />
              </div>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Advanced Physics Controls */}
      <Card className="scientific-panel">
        <CardHeader 
          className="cursor-pointer"
          onClick={() => toggleSection('physics')}
        >
          <CardTitle className="flex items-center justify-between text-lg">
            <div className="flex items-center gap-2">
              <Waves className="w-4 h-4" />
              Physics Dynamics
            </div>
            {expandedSections.physics ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </CardTitle>
          <CardDescription>
            Mesh deformation and fluid dynamics parameters
          </CardDescription>
        </CardHeader>
        
        {expandedSections.physics && (
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <ControlTooltip
                  title="Deformation Intensity"
                  description="Controls how much the Klein bottle mesh deforms during quark interactions"
                  range="0.0 - 2.0"
                  effect="Higher values create more dramatic visual deformation of the 3D surface"
                  shortcut="D"
                >
                  <Label className="flex items-center gap-2 mb-2 cursor-help">
                    <HelpCircle className="w-3 h-3 text-slate-400" />
                    Deformation
                    <Badge variant="outline" className="text-xs ml-auto">
                      {physicsParams.deformationIntensity.toFixed(2)}
                    </Badge>
                  </Label>
                </ControlTooltip>
                <Slider
                  value={[physicsParams.deformationIntensity]}
                  onValueChange={([value]) => 
                    setPhysicsParams({...physicsParams, deformationIntensity: value})
                  }
                  min={0}
                  max={2}
                  step={0.1}
                  className="w-full"
                />
              </div>

              <div>
                <MathTooltip
                  formula="η = μ(∂u/∂y + ∂v/∂x)"
                  explanation="Fluid viscosity parameter controlling resistance to deformation flow"
                  variables={[
                    { symbol: "η", meaning: "Dynamic viscosity coefficient" },
                    { symbol: "μ", meaning: "Viscosity parameter" },
                    { symbol: "u,v", meaning: "Velocity field components" }
                  ]}
                >
                  <Label className="flex items-center gap-2 mb-2 cursor-help">
                    <HelpCircle className="w-3 h-3 text-slate-400" />
                    Viscosity η
                    <Badge variant="outline" className="text-xs ml-auto">
                      {physicsParams.fluidViscosity.toFixed(2)}
                    </Badge>
                  </Label>
                </MathTooltip>
                <Slider
                  value={[physicsParams.fluidViscosity]}
                  onValueChange={([value]) => 
                    setPhysicsParams({...physicsParams, fluidViscosity: value})
                  }
                  min={0}
                  max={1}
                  step={0.05}
                  className="w-full"
                />
              </div>

              <div>
                <MathTooltip
                  formula="E = σ/ε"
                  explanation="Elastic modulus defining material stiffness and stress-strain relationship"
                  variables={[
                    { symbol: "E", meaning: "Young's modulus (GPa)" },
                    { symbol: "σ", meaning: "Applied stress" },
                    { symbol: "ε", meaning: "Resulting strain" }
                  ]}
                >
                  <Label className="flex items-center gap-2 mb-2 cursor-help">
                    <HelpCircle className="w-3 h-3 text-slate-400" />
                    Elastic E
                    <Badge variant="outline" className="text-xs ml-auto">
                      {physicsParams.elasticModulus.toFixed(2)}
                    </Badge>
                  </Label>
                </MathTooltip>
                <Slider
                  value={[physicsParams.elasticModulus]}
                  onValueChange={([value]) => 
                    setPhysicsParams({...physicsParams, elasticModulus: value})
                  }
                  min={0}
                  max={1}
                  step={0.05}
                  className="w-full"
                />
              </div>

              <div>
                <ControlTooltip
                  title="Necking Strength"
                  description="Controls formation of topological bridges between approaching quarks during merger"
                  range="0.0 - 1.0"
                  effect="Higher values create stronger connections between merging Klein bottles"
                  shortcut="N"
                >
                  <Label className="flex items-center gap-2 mb-2 cursor-help">
                    <HelpCircle className="w-3 h-3 text-slate-400" />
                    Necking
                    <Badge variant="outline" className="text-xs ml-auto">
                      {physicsParams.neckingStrength.toFixed(2)}
                    </Badge>
                  </Label>
                </ControlTooltip>
                <Slider
                  value={[physicsParams.neckingStrength]}
                  onValueChange={([value]) => 
                    setPhysicsParams({...physicsParams, neckingStrength: value})
                  }
                  min={0}
                  max={1}
                  step={0.05}
                  className="w-full"
                />
              </div>

              <div>
                <MathTooltip
                  formula="γ = ∂F/∂A"
                  explanation="Surface tension energy per unit area, causing surfaces to minimize area"
                  variables={[
                    { symbol: "γ", meaning: "Surface tension (N/m)" },
                    { symbol: "F", meaning: "Free energy" },
                    { symbol: "A", meaning: "Surface area" }
                  ]}
                >
                  <Label className="flex items-center gap-2 mb-2 cursor-help">
                    <HelpCircle className="w-3 h-3 text-slate-400" />
                    Tension γ
                    <Badge variant="outline" className="text-xs ml-auto">
                      {physicsParams.surfaceTension.toFixed(2)}
                    </Badge>
                  </Label>
                </MathTooltip>
                <Slider
                  value={[physicsParams.surfaceTension]}
                  onValueChange={([value]) => 
                    setPhysicsParams({...physicsParams, surfaceTension: value})
                  }
                  min={0}
                  max={1}
                  step={0.05}
                  className="w-full"
                />
              </div>

              <div>
                <ControlTooltip
                  title="Damping Factor"
                  description="Energy dissipation parameter that stabilizes oscillations and prevents runaway deformation"
                  range="0.0 - 1.0"
                  effect="Higher values provide stronger damping, leading to more stable animations"
                  shortcut="F"
                >
                  <Label className="flex items-center gap-2 mb-2 cursor-help">
                    <HelpCircle className="w-3 h-3 text-slate-400" />
                    Damping
                    <Badge variant="outline" className="text-xs ml-auto">
                      {physicsParams.dampingFactor.toFixed(2)}
                    </Badge>
                  </Label>
                </ControlTooltip>
                <Slider
                  value={[physicsParams.dampingFactor]}
                  onValueChange={([value]) => 
                    setPhysicsParams({...physicsParams, dampingFactor: value})
                  }
                  min={0}
                  max={1}
                  step={0.05}
                  className="w-full"
                />
              </div>
            </div>

            <Separator />

            <div className="flex gap-2">
              <ControlTooltip
                title="Reset to Defaults"
                description="Restore all physics parameters to their optimal default values for stable visualization"
                effect="Resets all sliders to scientifically validated default parameters"
                shortcut="Ctrl+R"
              >
                <Button
                  onClick={resetToDefaults}
                  variant="outline"
                  size="sm"
                  className="flex-1"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Reset Defaults
                </Button>
              </ControlTooltip>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Advanced Visualization Options */}
      <Card className="scientific-panel">
        <CardHeader 
          className="cursor-pointer"
          onClick={() => toggleSection('visualization')}
        >
          <CardTitle className="flex items-center justify-between text-lg">
            <div className="flex items-center gap-2">
              <Atom className="w-4 h-4" />
              Advanced Visualization
            </div>
            {expandedSections.visualization ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </CardTitle>
          <CardDescription>
            Enhanced visual effects and analysis tools
          </CardDescription>
        </CardHeader>
        
        {expandedSections.visualization && (
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center justify-between">
                <ControlTooltip
                  title="Mesh Deformation"
                  description="Real-time vertex-level deformation of Klein bottle surfaces during quark interactions"
                  effect="Shows how the topological structure responds to proximity forces and confinement"
                  shortcut="M"
                >
                  <Label className="flex items-center gap-2 cursor-help">
                    <Waves className="w-4 h-4" />
                    Mesh Deformation
                    <HelpCircle className="w-3 h-3 text-slate-400 ml-1" />
                  </Label>
                </ControlTooltip>
                <Switch
                  checked={showDeformation}
                  onCheckedChange={setShowDeformation}
                />
              </div>

              <div className="flex items-center justify-between">
                <MathTooltip
                  formula="σᵢⱼ = λδᵢⱼtr(ε) + 2μεᵢⱼ"
                  explanation="Stress tensor field visualization showing internal forces within the Klein bottle material"
                  variables={[
                    { symbol: "σᵢⱼ", meaning: "Stress tensor components" },
                    { symbol: "εᵢⱼ", meaning: "Strain tensor components" },
                    { symbol: "λ,μ", meaning: "Lamé parameters" }
                  ]}
                >
                  <Label className="flex items-center gap-2 cursor-help">
                    <Activity className="w-4 h-4" />
                    Stress Tensor
                    <HelpCircle className="w-3 h-3 text-slate-400 ml-1" />
                  </Label>
                </MathTooltip>
                <Switch
                  checked={showStressTensor}
                  onCheckedChange={setShowStressTensor}
                />
              </div>

              <div className="flex items-center justify-between">
                <MathTooltip
                  formula="v = ∇ × ψ"
                  explanation="Fluid flow vector field showing velocity and vorticity patterns in deforming material"
                  variables={[
                    { symbol: "v", meaning: "Velocity field vector" },
                    { symbol: "ψ", meaning: "Stream function" },
                    { symbol: "∇ ×", meaning: "Curl operator (vorticity)" }
                  ]}
                >
                  <Label className="flex items-center gap-2 cursor-help">
                    <Zap className="w-4 h-4" />
                    Fluid Vectors
                    <HelpCircle className="w-3 h-3 text-slate-400 ml-1" />
                  </Label>
                </MathTooltip>
                <Switch
                  checked={showFluidFlow}
                  onCheckedChange={setShowFluidFlow}
                />
              </div>

              <div className="flex items-center justify-between">
                <ControlTooltip
                  title="Topological Necking"
                  description="Surface bridging effects when Klein bottles approach each other during baryon formation"
                  effect="Visualizes the formation of connections between merging topological structures"
                  shortcut="T"
                >
                  <Label className="flex items-center gap-2 cursor-help">
                    <Layers className="w-4 h-4" />
                    Necking
                    <HelpCircle className="w-3 h-3 text-slate-400 ml-1" />
                  </Label>
                </ControlTooltip>
                <Switch
                  checked={showNecking}
                  onCheckedChange={setShowNecking}
                />
              </div>
            </div>
          </CardContent>
        )}
      </Card>

      {/* System Status */}
      <Card className="scientific-panel">
        <CardHeader 
          className="cursor-pointer"
          onClick={() => toggleSection('status')}
        >
          <CardTitle className="flex items-center justify-between text-lg">
            <div className="flex items-center gap-2">
              <Gauge className="w-4 h-4" />
              System Status
            </div>
            {expandedSections.status ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </CardTitle>
          <CardDescription>
            Real-time confinement and stability analysis
          </CardDescription>
        </CardHeader>
        
        {expandedSections.status && (
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <StatusTooltip
                    metric="Color Neutrality"
                    value={isColorNeutral ? "Neutral" : "Non-Neutral"}
                    interpretation="QCD color confinement requires that all observable particles be color-neutral"
                    goodRange="Must be Neutral for stable baryons"
                  >
                    <span className="text-sm font-medium cursor-help flex items-center gap-1">
                      Color Neutrality
                      <HelpCircle className="w-3 h-3 text-slate-400" />
                    </span>
                  </StatusTooltip>
                  <Badge variant={isColorNeutral ? "default" : "destructive"}>
                    {isColorNeutral ? "Neutral" : "Non-Neutral"}
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between">
                  <MathTooltip
                    formula="Ω₂^(Pin⁻) = Z₂"
                    explanation="Bordism classification determines topological stability of the baryon configuration"
                    variables={[
                      { symbol: "Ω₂^(Pin⁻)", meaning: "Pin⁻ bordism group in dimension 2" },
                      { symbol: "Z₂", meaning: "Cyclic group {0, 1}" },
                      { symbol: "Class 0", meaning: "Even number of Pin⁻ structures → stable" },
                      { symbol: "Class 1", meaning: "Odd number → unstable" }
                    ]}
                  >
                    <span className="text-sm font-medium cursor-help flex items-center gap-1">
                      Bordism Class
                      <HelpCircle className="w-3 h-3 text-slate-400" />
                    </span>
                  </MathTooltip>
                  <Badge variant={bordismClass === 0 ? "default" : "secondary"}>
                    Ω₂^(Pin⁻) = {bordismClass}
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between">
                  <StatusTooltip
                    metric="System Stability"
                    value={bordismClass === 0 && isColorNeutral ? "Stable" : "Unstable"}
                    interpretation="Stability requires both color neutrality and trivial bordism class (0)"
                    goodRange="Stable configurations can exist as isolated particles"
                  >
                    <span className="text-sm font-medium cursor-help flex items-center gap-1">
                      Stability
                      <HelpCircle className="w-3 h-3 text-slate-400" />
                    </span>
                  </StatusTooltip>
                  <Badge variant={bordismClass === 0 && isColorNeutral ? "default" : "destructive"}>
                    {bordismClass === 0 && isColorNeutral ? "Stable" : "Unstable"}
                  </Badge>
                </div>
              </div>

              <div className="space-y-3">
                <div className="space-y-2">
                  <StatusTooltip
                    metric="Confinement Strength"
                    value={confinementStrength.toFixed(3)}
                    interpretation="Measures the effective strength of color confinement forces binding quarks together"
                    goodRange="0.5 - 1.0 for typical QCD confinement"
                  >
                    <div className="flex justify-between text-sm cursor-help">
                      <span className="flex items-center gap-1">
                        Confinement
                        <HelpCircle className="w-3 h-3 text-slate-400" />
                      </span>
                      <span className="font-mono">{confinementStrength.toFixed(3)}</span>
                    </div>
                  </StatusTooltip>
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${Math.min(100, confinementStrength * 50)}%` }}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <StatusTooltip
                    metric="Deformation Magnitude"
                    value={deformationMagnitude.toFixed(3)}
                    interpretation="Quantifies how much the Klein bottle surfaces are deformed from their equilibrium shape"
                    goodRange="0.0 - 0.8 for stable visualizations"
                  >
                    <div className="flex justify-between text-sm cursor-help">
                      <span className="flex items-center gap-1">
                        Deformation
                        <HelpCircle className="w-3 h-3 text-slate-400" />
                      </span>
                      <span className="font-mono">{deformationMagnitude.toFixed(3)}</span>
                    </div>
                  </StatusTooltip>
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div 
                      className="bg-green-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${Math.min(100, deformationMagnitude * 100)}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            <ControlTooltip
              title="Physical Interpretation"
              description="Real-time analysis of system stability based on topological and color confinement constraints"
              effect="Provides immediate feedback on whether the current configuration represents a physically viable baryon"
            >
              <div className="bg-blue-50 p-3 rounded-lg cursor-help">
                <h4 className="font-semibold text-blue-800 mb-2 flex items-center gap-1">
                  Physical Interpretation
                  <HelpCircle className="w-3 h-3 text-blue-600" />
                </h4>
                <p className="text-sm text-blue-700">
                  {isColorNeutral && bordismClass === 0 
                    ? "System exhibits stable baryon configuration with proper color confinement. Quaternionic holonomy constraints are satisfied."
                    : "System shows unstable configuration. Color neutrality or bordism class constraints are violated."
                  }
                </p>
              </div>
            </ControlTooltip>
          </CardContent>
        )}
      </Card>
    </div>
  );
};

export default AdvancedControlsPanel;
