
'use client';

import React, { useState, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Atom, 
  Settings, 
  Calculator, 
  BarChart, 
  Gauge,
  Zap,
  HelpCircle
} from 'lucide-react';

// Import all components
import ControlPanel from './control-panel';
import AdvancedControlsPanel from './advanced-controls-panel';
import EnhancedThreeJSVisualization from './enhanced-three-js-visualization';
import MathFormulas from './math-formulas';
import EnhancedMathDisplay from './enhanced-math-display';
import AnalysisSection from './analysis-section';

// Import types
import { PhysicsParameters } from './advanced-physics-engine';
import { ConfinementParameters } from './color-confinement-engine';
import { StatusTooltip, ControlTooltip } from '@/components/ui/tooltip-advanced';

const Enhanced4DManifoldVisualizationApp: React.FC = () => {
  // Basic control state
  const [selectedPreset, setSelectedPreset] = useState('proton');
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showFlux, setShowFlux] = useState(true);
  const [showRotation, setShowRotation] = useState(true);

  // Advanced physics parameters
  const [physicsParams, setPhysicsParams] = useState<PhysicsParameters>({
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

  // Color confinement parameters
  const [confinementParams, setConfinementParams] = useState<ConfinementParameters>({
    holonomyStrength: 1.0,
    pinMinusField: 0.8,
    bordismClass: 0,
    fluxTubeStrength: 0.6,
    confinementScale: 1.2
  });

  // Advanced visualization options
  const [showDeformation, setShowDeformation] = useState(false);
  const [showStressTensor, setShowStressTensor] = useState(false);
  const [showFluidFlow, setShowFluidFlow] = useState(false);
  const [showNecking, setShowNecking] = useState(true);

  // Real-time data from visualization
  const [confinementData, setConfinementData] = useState<any>({
    holonomies: [],
    pinMinusValid: [true, true, true],
    bordismClass: 0,
    isColorNeutral: true,
    confinementStrength: 0,
    isStable: true
  });

  const [physicsData, setPhysicsData] = useState<any>({
    deformationMagnitude: 0,
    hasNecking: false,
    fluidState: null
  });

  // Callbacks for real-time updates (memoized to prevent infinite loops)
  const handleConfinementUpdate = useCallback((data: any) => {
    setConfinementData((prevData: any) => {
      // Only update if data has actually changed
      if (!prevData || JSON.stringify(prevData) !== JSON.stringify(data)) {
        return data;
      }
      return prevData;
    });
  }, []);

  const handlePhysicsUpdate = useCallback((data: any) => {
    if (data) {
      setPhysicsData((prevData: any) => {
        // Only update if data has actually changed
        if (!prevData || JSON.stringify(prevData) !== JSON.stringify(data)) {
          return data;
        }
        return prevData;
      });
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 bg-blue-600 rounded-lg">
                <Atom className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-800">
                  Advanced 4D Manifold Baryon Visualization
                </h1>
                <p className="text-sm text-slate-600">
                  Interactive color confinement and topological dynamics
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <StatusTooltip
                metric="System Stability"
                value={confinementData.isStable ? "Stable" : "Unstable"}
                interpretation="Overall system stability based on color neutrality and bordism class constraints"
                goodRange="Must be Stable for physical baryon existence"
              >
                <Badge variant={confinementData.isStable ? "default" : "destructive"} className="cursor-help">
                  {confinementData.isStable ? "Stable" : "Unstable"}
                </Badge>
              </StatusTooltip>
              
              <StatusTooltip
                metric="Bordism Class"
                value={`Ω₂^(Pin⁻) = ${confinementData.bordismClass}`}
                interpretation="Topological classification determining baryon stability in the Pin⁻ bordism group Z₂"
                goodRange="Class 0 (even) = stable, Class 1 (odd) = unstable"
              >
                <Badge variant="outline" className="cursor-help">
                  Ω₂^(Pin⁻) = {confinementData.bordismClass}
                </Badge>
              </StatusTooltip>
              
              <StatusTooltip
                metric="Color Neutrality"
                value={confinementData.isColorNeutral ? "Color Neutral" : "Non-Neutral"}
                interpretation="QCD color confinement requirement that all observable particles must be colorless"
                goodRange="Must be Color Neutral for confined quarks"
              >
                <Badge variant={confinementData.isColorNeutral ? "default" : "secondary"} className="cursor-help">
                  {confinementData.isColorNeutral ? "Color Neutral" : "Non-Neutral"}
                </Badge>
              </StatusTooltip>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Sidebar - Controls */}
          <div className="lg:col-span-1 space-y-4">
            {/* Basic Controls */}
            <ControlPanel
              selectedPreset={selectedPreset}
              setSelectedPreset={setSelectedPreset}
              isPlaying={isPlaying}
              setIsPlaying={setIsPlaying}
              progress={progress}
              setProgress={setProgress}
              showFlux={showFlux}
              setShowFlux={setShowFlux}
              showRotation={showRotation}
              setShowRotation={setShowRotation}
            />

            {/* Advanced Controls (trimmed to hypothesis-relevant options handled within panel) */}
            <AdvancedControlsPanel
              physicsParams={physicsParams}
              setPhysicsParams={setPhysicsParams}
              confinementParams={confinementParams}
              setConfinementParams={setConfinementParams}
              showDeformation={showDeformation}
              setShowDeformation={setShowDeformation}
              showStressTensor={showStressTensor}
              setShowStressTensor={setShowStressTensor}
              showFluidFlow={showFluidFlow}
              setShowFluidFlow={setShowFluidFlow}
              showNecking={showNecking}
              setShowNecking={setShowNecking}
              confinementStrength={confinementData.confinementStrength || 0}
              bordismClass={confinementData.bordismClass || 0}
              isColorNeutral={confinementData.isColorNeutral || false}
              deformationMagnitude={physicsData?.deformationMagnitude || 0}
            />
          </div>

          {/* Main Visualization Area */}
          <div className="lg:col-span-3">
            <Tabs defaultValue="visualization" className="space-y-4">
              <TabsList className="grid w-full grid-cols-4 lg:grid-cols-4">
                <ControlTooltip
                  title="3D Visualization"
                  description="Interactive Klein bottle visualization with real-time physics and color confinement effects"
                  effect="Navigate and observe the baryon formation process with dynamic deformation"
                  shortcut="1"
                >
                  <TabsTrigger value="visualization" className="flex items-center gap-2 cursor-help">
                    <Atom className="w-4 h-4" />
                    <span className="hidden sm:inline">3D View</span>
                  </TabsTrigger>
                </ControlTooltip>
                
                <ControlTooltip
                  title="Mathematical Foundations"
                  description="Detailed mathematical formulas and derivations underlying the 4D Manifold baryon hypothesis"
                  effect="Explore the topological mathematics and QCD theory behind the visualization"
                  shortcut="2"
                >
                  <TabsTrigger value="mathematics" className="flex items-center gap-2 cursor-help">
                    <Calculator className="w-4 h-4" />
                    <span className="hidden sm:inline">Math</span>
                  </TabsTrigger>
                </ControlTooltip>
                
                <ControlTooltip
                  title="Data Analysis"
                  description="Comprehensive tables and analysis of quark properties, baryon characteristics, and QCD color theory"
                  effect="Study the quantitative predictions and experimental correlations"
                  shortcut="3"
                >
                  <TabsTrigger value="analysis" className="flex items-center gap-2 cursor-help">
                    <BarChart className="w-4 h-4" />
                    <span className="hidden sm:inline">Analysis</span>
                  </TabsTrigger>
                </ControlTooltip>
                
                <ControlTooltip
                  title="Real-time Data"
                  description="Live mathematical constraint verification and dynamic system status monitoring"
                  effect="Monitor holonomy calculations, Pin⁻ structures, and bordism classification in real-time"
                  shortcut="4"
                >
                  <TabsTrigger value="realtime" className="flex items-center gap-2 cursor-help">
                    <Gauge className="w-4 h-4" />
                    <span className="hidden sm:inline">Live Data</span>
                  </TabsTrigger>
                </ControlTooltip>
              </TabsList>

              {/* 3D Visualization Tab */}
              <TabsContent value="visualization">
                <Card className="scientific-panel">
                  <CardContent className="p-0">
                    <div className="relative">
                      {/* Real-time status overlay */}
                      <div className="absolute top-4 right-4 z-10 space-y-2">
                        <StatusTooltip
                          metric="System Metrics"
                          value="Live Data"
                          interpretation="Real-time monitoring of confinement strength, deformation magnitude, and simulation progress"
                          goodRange="Stable values indicate proper baryon formation"
                        >
                          <div className="bg-black/70 text-white px-3 py-2 rounded-lg backdrop-blur-sm cursor-help">
                            <div className="text-xs space-y-1">
                              <div className="flex justify-between gap-4">
                                <span>Confinement:</span>
                                <span className="font-mono">
                                  {(confinementData.confinementStrength * 100).toFixed(1)}%
                                </span>
                              </div>
                              <div className="flex justify-between gap-4">
                                <span>Deformation:</span>
                                <span className="font-mono">
                                  {((physicsData?.deformationMagnitude || 0) * 100).toFixed(1)}%
                                </span>
                              </div>
                              <div className="flex justify-between gap-4">
                                <span>Progress:</span>
                                <span className="font-mono">{(progress * 100).toFixed(0)}%</span>
                              </div>
                            </div>
                            <HelpCircle className="w-3 h-3 opacity-50 mt-1" />
                          </div>
                        </StatusTooltip>

                        {/* Active effects indicators */}
                        <div className="flex flex-col gap-1">
                          {showDeformation && (
                            <ControlTooltip
                              title="Mesh Deformation Active"
                              description="Real-time vertex deformation is currently enabled, showing how Klein bottle surfaces respond to forces"
                              effect="Vertices move based on proximity forces and confinement physics"
                            >
                              <Badge variant="secondary" className="text-xs cursor-help">
                                <Zap className="w-3 h-3 mr-1" />
                                Deformation
                              </Badge>
                            </ControlTooltip>
                          )}
                          {showNecking && progress > 0.3 && (
                            <ControlTooltip
                              title="Topological Necking Active"
                              description="Surface bridging effects are forming between approaching Klein bottles"
                              effect="Creates connections that lead to baryon formation"
                            >
                              <Badge variant="secondary" className="text-xs cursor-help">
                                Necking
                              </Badge>
                            </ControlTooltip>
                          )}
                          {showStressTensor && (
                            <ControlTooltip
                              title="Stress Field Visualization"
                              description="Internal stress distribution is being visualized across the Klein bottle surfaces"
                              effect="Shows regions of high and low mechanical stress in color"
                            >
                              <Badge variant="secondary" className="text-xs cursor-help">
                                Stress Field
                              </Badge>
                            </ControlTooltip>
                          )}
                          {showFluidFlow && (
                            <ControlTooltip
                              title="Fluid Flow Vectors"
                              description="Velocity and vorticity vector fields are being displayed"
                              effect="Arrows show flow patterns and circulation in the deforming material"
                            >
                              <Badge variant="secondary" className="text-xs cursor-help">
                                Fluid Flow
                              </Badge>
                            </ControlTooltip>
                          )}
                        </div>
                      </div>

                      {/* Enhanced 3D visualization */}
                      <div className="h-[600px] bg-gradient-to-b from-slate-50 to-slate-100 rounded-lg overflow-hidden">
                        <EnhancedThreeJSVisualization
                          selectedPreset={selectedPreset}
                          isPlaying={isPlaying}
                          progress={progress}
                          onProgressChange={setProgress}
                          showFlux={showFlux}
                          showRotation={showRotation}
                          physicsParams={physicsParams}
                          confinementParams={confinementParams}
                          showDeformation={showDeformation}
                          showStressTensor={showStressTensor}
                          showFluidFlow={showFluidFlow}
                          showNecking={showNecking}
                          onConfinementUpdate={handleConfinementUpdate}
                          onPhysicsUpdate={handlePhysicsUpdate}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Mathematics Tab */}
              <TabsContent value="mathematics">
                <div className="space-y-6">
                  {/* Basic mathematical formulas */}
                  <MathFormulas />
                </div>
              </TabsContent>

              {/* Analysis Tab */}
              <TabsContent value="analysis">
                <div className="space-y-6">
                  <AnalysisSection />
                </div>
              </TabsContent>

              {/* Real-time Data Tab */}
              <TabsContent value="realtime">
                <div className="space-y-6">
                  {/* Enhanced mathematical display with real-time data */}
                  <EnhancedMathDisplay
                    holonomies={confinementData.holonomies || []}
                    pinMinusValid={confinementData.pinMinusValid || [true, true, true]}
                    bordismClass={confinementData.bordismClass || 0}
                    isColorNeutral={confinementData.isColorNeutral || false}
                    confinementStrength={confinementData.confinementStrength || 0}
                    deformationMagnitude={physicsData?.deformationMagnitude || 0}
                    progress={progress}
                    selectedPreset={selectedPreset}
                  />
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-12 border-t bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="text-center space-y-2">
            <p className="text-sm text-slate-600">
              Advanced 4D Manifold Baryon Visualization with Color Confinement Mathematics
            </p>
            <div className="flex items-center justify-center gap-4 text-xs text-slate-500">
              <span>Quaternionic Holonomy Constraints</span>
              <Separator orientation="vertical" className="h-4" />
              <span>Pin⁻ Structure Analysis</span>
              <Separator orientation="vertical" className="h-4" />
              <span>Bordism Classification</span>
              <Separator orientation="vertical" className="h-4" />
              <span>Real-time Deformation Physics</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Enhanced4DManifoldVisualizationApp;
