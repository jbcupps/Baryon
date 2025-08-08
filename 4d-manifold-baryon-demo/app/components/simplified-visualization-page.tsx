
'use client';

import React from 'react';
import { Badge } from '@/components/ui/badge';
import { 
  Atom, 
  Eye,
  Activity,
  Zap
} from 'lucide-react';

// Import components
import EssentialControls from './essential-controls';
import FluidEnhancedThreeJSVisualization from './fluid-enhanced-three-js-visualization';
import Navigation from './navigation';
import { Slider } from '@/components/ui/slider';

// Import context and types
import { useVisualization } from '@/contexts/visualization-context';
import { StatusTooltip } from '@/components/ui/tooltip-advanced';

const SimplifiedVisualizationPage: React.FC = () => {
  const { 
    state,
    setSelectedPreset,
    setIsPlaying,
    setProgress,
    handleConfinementUpdate,
    handlePhysicsUpdate,
    handleFluidDynamicsUpdate
  } = useVisualization();

  // Local camera control state
  const [cameraDistance, setCameraDistance] = React.useState<number>(8);
  const [cameraRotX, setCameraRotX] = React.useState<number>(0);
  const [cameraRotY, setCameraRotY] = React.useState<number>(0);
  const [cameraFov, setCameraFov] = React.useState<number>(70);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 bg-blue-600 rounded-lg">
                <Eye className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-slate-800 mb-4">
                  4D Manifold Baryon Visualization
                </h1>
                <p className="text-sm text-slate-600">
                  Interactive 3D Klein bottle dynamics
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              {/* Status Overlay - Always Visible */}
              <div className="flex items-center gap-2">
                <StatusTooltip
                  metric="System Stability"
                  value={state.confinementData.isStable ? "Stable" : "Unstable"}
                  interpretation="Overall system stability based on color neutrality and bordism class constraints"
                  goodRange="Must be Stable for physical baryon existence"
                >
                  <Badge variant={state.confinementData.isStable ? "default" : "destructive"} className="cursor-help">
                    <Activity className="w-3 h-3 mr-1" />
                    {state.confinementData.isStable ? "Stable" : "Unstable"}
                  </Badge>
                </StatusTooltip>
                
                <StatusTooltip
                  metric="Color Neutrality"
                  value={state.confinementData.isColorNeutral ? "Color Neutral" : "Non-Neutral"}
                  interpretation="QCD color confinement requirement that all observable particles must be colorless"
                  goodRange="Must be Color Neutral for confined quarks"
                >
                  <Badge variant={state.confinementData.isColorNeutral ? "default" : "secondary"} className="cursor-help">
                    <Zap className="w-3 h-3 mr-1" />
                    {state.confinementData.isColorNeutral ? "Neutral" : "Non-Neutral"}
                  </Badge>
                </StatusTooltip>
              </div>

              {/* Navigation */}
              <Navigation />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content - Focused Layout */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Essential Controls Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <EssentialControls
                selectedPreset={state.selectedPreset}
                setSelectedPreset={setSelectedPreset}
                isPlaying={state.isPlaying}
                setIsPlaying={setIsPlaying}
                progress={state.progress}
                setProgress={setProgress}
              />
              
              {/* Real-time Metrics */}
              <div className="mt-4 space-y-2">
                <div className="bg-white/90 backdrop-blur-sm rounded-lg p-3 border">
                  <div className="text-xs text-muted-foreground mb-1">Real-time Metrics</div>
                  
                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between">
                      <span>Bordism Class:</span>
                      <Badge variant="outline" className="text-xs h-auto py-0.5">
                        Ω₂^(Pin⁻) = {state.confinementData.bordismClass}
                      </Badge>
                    </div>
                    
                    <div className="flex justify-between">
                      <span>Deformation:</span>
                      <span className="font-mono">
                        {Math.round((state.physicsData?.deformationMagnitude || 0) * 100)}%
                      </span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span>Confinement:</span>
                      <span className="font-mono">
                        {Math.round((state.confinementData.confinementStrength || 0) * 100)}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Visualization Area - Full Focus */}
          <div className="lg:col-span-4">
            <div className="bg-white/90 backdrop-blur-sm rounded-lg border shadow-lg overflow-hidden">
              <div className="aspect-[16/10] relative">
                <FluidEnhancedThreeJSVisualization
                  selectedPreset={state.selectedPreset}
                  isPlaying={state.isPlaying}
                  progress={state.progress}
                  onProgressChange={setProgress}
                  showFlux={state.showFlux}
                  showRotation={state.showRotation}
                  
                  // Advanced physics (from context)
                  physicsParams={state.physicsParams}
                  confinementParams={state.confinementParams}
                  
                  // Fluid dynamics (new)
                  fluidDynamicsParams={state.fluidDynamicsParams}
                  
                  // Visualization toggles
                  showDeformation={state.showDeformation}
                  showStressTensor={state.showStressTensor}
                  showFluidFlow={state.showFluidFlow}
                  showNecking={state.showNecking}
                  showFluidDynamics={state.showFluidDynamics}
                  
                  // Camera controls
                  cameraFov={cameraFov}
                  cameraDistance={cameraDistance}
                  cameraRotX={cameraRotX}
                  cameraRotY={cameraRotY}
                  
                  // Real-time callbacks
                  onConfinementUpdate={handleConfinementUpdate}
                  onPhysicsUpdate={handlePhysicsUpdate}
                  onFluidDynamicsUpdate={handleFluidDynamicsUpdate}
                />
              </div>
              {/* Camera Controls */}
              <div className="px-4 py-3 bg-white/90 border-t">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">Zoom (Distance): {cameraDistance.toFixed(1)}</div>
                    <Slider value={[cameraDistance]} onValueChange={([v]) => setCameraDistance(Math.max(3, Math.min(20, v)))} min={3} max={20} step={0.1} />
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">Field of View: {Math.round(cameraFov)}°</div>
                    <Slider value={[cameraFov]} onValueChange={([v]) => setCameraFov(Math.max(30, Math.min(100, v)))} min={30} max={100} step={1} />
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">Rotate X: {cameraRotX.toFixed(2)} rad</div>
                    <Slider value={[cameraRotX]} onValueChange={([v]) => setCameraRotX(v)} min={-1.2} max={1.2} step={0.01} />
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">Rotate Y: {cameraRotY.toFixed(2)} rad</div>
                    <Slider value={[cameraRotY]} onValueChange={([v]) => setCameraRotY(v)} min={-3.14} max={3.14} step={0.01} />
                  </div>
                </div>
              </div>
              
              {/* Status Strip */}
              <div className="px-4 py-2 bg-slate-50 border-t">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <div className="flex items-center gap-4">
                    <span>
                      {state.selectedPreset === 'proton' ? 'Proton (p⁺)' : 'Neutron (n⁰)'}
                    </span>
                    <span>•</span>
                    <span>
                      {state.isPlaying ? 'Playing' : 'Paused'} • Speed: {Math.round(state.progress * 100)}%
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <span>
                      Quarks: {state.selectedPreset === 'proton' ? 'u-u-d' : 'u-d-d'}
                    </span>
                    <span>•</span>
                    <span>
                      Status: {state.confinementData.isStable ? 'Stable' : 'Unstable'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimplifiedVisualizationPage;
