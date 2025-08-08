
'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Settings2, 
  Calculator, 
  BarChart, 
  Gauge,
  Zap,
  HelpCircle,
  Sliders,
  Atom
} from 'lucide-react';

// Import all control components
import ControlPanel from './control-panel';
import AdvancedControlsPanel from './advanced-controls-panel';
import FluidDynamicsControls from './fluid-dynamics-controls';
import MathFormulas from './math-formulas';
import EnhancedMathDisplay from './enhanced-math-display';
import AnalysisSection from './analysis-section';
import Navigation from './navigation';

// Import context and types
import { useVisualization } from '@/contexts/visualization-context';
import { StatusTooltip, ControlTooltip } from '@/components/ui/tooltip-advanced';

const ControlsPage: React.FC = () => {
  const { 
    state,
    setSelectedPreset,
    setIsPlaying,
    setProgress,
    setShowFlux,
    setShowRotation,
    setPhysicsParams,
    setConfinementParams,
    setDsimDensityRate,
    setDsimProximityThreshold,
    setDsimTimeStep,
    setFluidDynamicsParams,
    setShowDeformation,
    setShowStressTensor,
    setShowFluidFlow,
    setShowNecking,
    setShowFluidDynamics
  } = useVisualization();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 bg-blue-600 rounded-lg">
                <Sliders className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-800">
                  Advanced Controls & Settings
                </h1>
                <p className="text-sm text-slate-600">
                  Comprehensive physics parameters and visualization controls
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              {/* Status badges */}
              <div className="flex items-center gap-2">
                <StatusTooltip
                  metric="System Stability"
                  value={state.confinementData.isStable ? "Stable" : "Unstable"}
                  interpretation="Overall system stability based on color neutrality and bordism class constraints"
                  goodRange="Must be Stable for physical baryon existence"
                >
                  <Badge variant={state.confinementData.isStable ? "default" : "destructive"} className="cursor-help">
                    {state.confinementData.isStable ? "Stable" : "Unstable"}
                  </Badge>
                </StatusTooltip>
                
                <StatusTooltip
                  metric="Bordism Class"
                  value={`Ω₂^(Pin⁻) = ${state.confinementData.bordismClass}`}
                  interpretation="Topological classification determining baryon stability in the Pin⁻ bordism group Z₂"
                  goodRange="Class 0 (even) = stable, Class 1 (odd) = unstable"
                >
                  <Badge variant="outline" className="cursor-help">
                    Ω₂^(Pin⁻) = {state.confinementData.bordismClass}
                  </Badge>
                </StatusTooltip>
                
                <StatusTooltip
                  metric="Color Neutrality"
                  value={state.confinementData.isColorNeutral ? "Color Neutral" : "Non-Neutral"}
                  interpretation="QCD color confinement requirement that all observable particles must be colorless"
                  goodRange="Must be Color Neutral for confined quarks"
                >
                  <Badge variant={state.confinementData.isColorNeutral ? "default" : "secondary"} className="cursor-help">
                    {state.confinementData.isColorNeutral ? "Color Neutral" : "Non-Neutral"}
                  </Badge>
                </StatusTooltip>
              </div>

              <Separator orientation="vertical" className="h-8" />
              
              {/* Navigation */}
              <Navigation />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Basic Controls */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Settings2 className="w-5 h-5 text-blue-600" />
              <h2 className="text-lg font-semibold text-slate-800">Basic Controls</h2>
            </div>
            
            <ControlPanel
              selectedPreset={state.selectedPreset}
              setSelectedPreset={setSelectedPreset}
              isPlaying={state.isPlaying}
              setIsPlaying={setIsPlaying}
              progress={state.progress}
              setProgress={setProgress}
              showFlux={state.showFlux}
              setShowFlux={setShowFlux}
              showRotation={state.showRotation}
              setShowRotation={setShowRotation}
            />
          </div>

          {/* Middle Column - Advanced Controls */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Gauge className="w-5 h-5 text-purple-600" />
              <h2 className="text-lg font-semibold text-slate-800">Advanced Physics</h2>
            </div>
            
            <AdvancedControlsPanel
              physicsParams={state.physicsParams}
              setPhysicsParams={setPhysicsParams}
              confinementParams={state.confinementParams}
              setConfinementParams={setConfinementParams}
              showDeformation={state.showDeformation}
              setShowDeformation={setShowDeformation}
              showStressTensor={state.showStressTensor}
              setShowStressTensor={setShowStressTensor}
              showFluidFlow={state.showFluidFlow}
              setShowFluidFlow={setShowFluidFlow}
              showNecking={state.showNecking}
              setShowNecking={setShowNecking}
              confinementStrength={state.confinementData.confinementStrength || 0}
              bordismClass={state.confinementData.bordismClass || 0}
              isColorNeutral={state.confinementData.isColorNeutral || false}
              deformationMagnitude={state.physicsData?.deformationMagnitude || 0}
              dsimDensityRate={state.dsimDensityRate}
              setDsimDensityRate={setDsimDensityRate}
              dsimProximityThreshold={state.dsimProximityThreshold}
              setDsimProximityThreshold={setDsimProximityThreshold}
              dsimTimeStep={state.dsimTimeStep}
              setDsimTimeStep={setDsimTimeStep}
            />
            
            {/* Fluid Dynamics Controls */}
            <FluidDynamicsControls
              params={state.fluidDynamicsParams}
              onParamsChange={setFluidDynamicsParams}
              showFluidDynamics={state.showFluidDynamics}
              onToggleFluidDynamics={setShowFluidDynamics}
              isPlaying={state.isPlaying}
            />
          </div>

          {/* Right Column - Mathematics & Analysis */}
          <div className="space-y-4">
            <Tabs defaultValue="mathematics" className="space-y-4">
              <TabsList className="grid w-full grid-cols-3">
                <ControlTooltip
                  title="Mathematical Foundations"
                  description="Core mathematical formulas and derivations"
                  effect="Explore the topological mathematics behind the 4D Manifold hypothesis"
                  shortcut="M"
                >
                  <TabsTrigger value="mathematics" className="flex items-center gap-1 cursor-help text-xs">
                    <Calculator className="w-3 h-3" />
                    Math
                  </TabsTrigger>
                </ControlTooltip>
                
                <ControlTooltip
                  title="Real-time Analysis"
                  description="Live mathematical constraint verification"
                  effect="Monitor calculations and system status in real-time"
                  shortcut="R"
                >
                  <TabsTrigger value="realtime" className="flex items-center gap-1 cursor-help text-xs">
                    <Gauge className="w-3 h-3" />
                    Live
                  </TabsTrigger>
                </ControlTooltip>
                
                <ControlTooltip
                  title="Data Analysis"
                  description="Comprehensive baryon and quark analysis tables"
                  effect="Study quantitative predictions and experimental correlations"
                  shortcut="A"
                >
                  <TabsTrigger value="analysis" className="flex items-center gap-1 cursor-help text-xs">
                    <BarChart className="w-3 h-3" />
                    Data
                  </TabsTrigger>
                </ControlTooltip>
              </TabsList>

              <TabsContent value="mathematics" className="space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  <Calculator className="w-5 h-5 text-green-600" />
                  <h2 className="text-lg font-semibold text-slate-800">Mathematics</h2>
                </div>
                <MathFormulas />
              </TabsContent>

              <TabsContent value="realtime" className="space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  <Gauge className="w-5 h-5 text-orange-600" />
                  <h2 className="text-lg font-semibold text-slate-800">Real-time Data</h2>
                </div>
                <EnhancedMathDisplay
                  holonomies={state.confinementData.holonomies || []}
                  pinMinusValid={state.confinementData.pinMinusValid || [true, true, true]}
                  bordismClass={state.confinementData.bordismClass || 0}
                  isColorNeutral={state.confinementData.isColorNeutral || true}
                  deformationMagnitude={state.physicsData?.deformationMagnitude || 0}
                  confinementStrength={state.confinementData.confinementStrength || 0}
                  progress={state.progress}
                  selectedPreset={state.selectedPreset}
                />
              </TabsContent>

              <TabsContent value="analysis" className="space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  <BarChart className="w-5 h-5 text-red-600" />
                  <h2 className="text-lg font-semibold text-slate-800">Analysis</h2>
                </div>
                <AnalysisSection />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ControlsPage;
