'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Play, Pause, RotateCcw, Settings2, Zap, Atom, TrendingUp, Calculator, Info } from 'lucide-react';

interface OptimizedControlPanelProps {
  selectedPreset: string;
  setSelectedPreset: (preset: string) => void;
  isPlaying: boolean;
  setIsPlaying: (playing: boolean) => void;
  progress: number;
  setProgress: (progress: number) => void;
  showFlux: boolean;
  setShowFlux: (show: boolean) => void;
  showRotation: boolean;
  setShowRotation: (show: boolean) => void;
}

const OptimizedControlPanel: React.FC<OptimizedControlPanelProps> = ({
  selectedPreset,
  setSelectedPreset,
  isPlaying,
  setIsPlaying,
  progress,
  setProgress,
  showFlux,
  setShowFlux,
  showRotation,
  setShowRotation
}) => {
  // Optimized preset data with physical justifications
  const optimizedPresetData = {
    proton: {
      name: 'Proton',
      symbol: 'p⁺',
      quarks: ['u', 'u', 'd'],
      charge: '+e',
      mass: '938.3 MeV/c²',
      binding_energy: '-928.7 MeV',
      stability: 'stable',
      
      optimized_parameters: {
        scales: [1.400, 1.400, 0.600],
        flux_arrows: [8, 8, 4],
        flux_lengths: [0.0228, 0.0228, 0.0114],
        rotation_speeds: [0.0928, 0.0928, 0.0445]
      },
      
      physical_basis: {
        scale_ratio: '2.33:1 (up:down)',
        flux_ratio: '2:1 (charge ratio)',
        rotation_ratio: '2.07:1 (energy/mass)',
        total_flux_arrows: 20
      }
    },
    
    neutron: {
      name: 'Neutron',
      symbol: 'n⁰',
      quarks: ['u', 'd', 'd'],
      charge: '0',
      mass: '939.6 MeV/c²',
      binding_energy: '-930.4 MeV',
      stability: 'stable',
      
      optimized_parameters: {
        scales: [1.400, 0.600, 0.600],
        flux_arrows: [8, 4, 4],
        flux_lengths: [0.0228, 0.0114, 0.0114],
        rotation_speeds: [0.0929, 0.0445, 0.0445]
      },
      
      physical_basis: {
        scale_ratio: '2.33:1 (up:down)',
        flux_ratio: '2:1 (charge ratio)',
        rotation_ratio: '2.07:1 (energy/mass)',
        total_flux_arrows: 16
      }
    }
  };

  const currentData = optimizedPresetData[selectedPreset as keyof typeof optimizedPresetData];

  const handleReset = () => {
    setProgress(0);
    setIsPlaying(false);
  };

  const handleProgressChange = (value: number[]) => {
    setProgress(value[0] / 100);
    setIsPlaying(false);
  };

  // Calculate current animation phase
  const getAnimationPhase = (progress: number): string => {
    if (progress <= 0.2) return 'Separation';
    if (progress <= 0.7) return 'Approach';
    if (progress <= 0.9) return 'Merger';
    return 'Stabilization';
  };

  // Calculate dynamic parameter values
  const getDynamicValues = (progress: number) => {
    return {
      avg_scale: currentData.optimized_parameters.scales.reduce((a, b) => a + b, 0) / 3 * (1 - progress * 0.7),
      flux_intensity: (1 - progress * 0.5) * 100,
      rotation_rate: (1 - progress) * 100,
      total_vertices: 3 * 51 * 51, // 50x50 grid + 1
      current_phase: getAnimationPhase(progress)
    };
  };

  const dynamicValues = getDynamicValues(progress);

  return (
    <div className="space-y-4">
      {/* Preset Selection with Optimization Info */}
      <Card className="scientific-panel">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Settings2 className="w-4 h-4" />
            Optimized Baryon Configuration
          </CardTitle>
          <CardDescription>
            Physically-motivated parameters from 4D Manifold hypothesis
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Baryon Type</Label>
            <Select value={selectedPreset} onValueChange={setSelectedPreset}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="proton">
                  <div className="flex items-center justify-between w-full">
                    <span>Proton (p⁺)</span>
                    <Badge variant="secondary" className="ml-2">uud</Badge>
                  </div>
                </SelectItem>
                <SelectItem value="neutron">
                  <div className="flex items-center justify-between w-full">
                    <span>Neutron (n⁰)</span>
                    <Badge variant="secondary" className="ml-2">udd</Badge>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Current Selection Info with Optimization Details */}
          <div className="p-3 bg-slate-50 rounded-lg space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-medium">{currentData.name}</span>
              <Badge variant="outline">{currentData.symbol}</Badge>
            </div>
            
            <div className="text-sm space-y-1">
              <div className="flex justify-between">
                <span className="text-slate-600">Quarks:</span>
                <span className="font-mono">{currentData.quarks.join(' + ')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Charge:</span>
                <span className="font-mono">{currentData.charge}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Mass:</span>
                <span className="font-mono text-xs">{currentData.mass}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Binding Energy:</span>
                <span className="font-mono text-xs">{currentData.binding_energy}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Total Flux Arrows:</span>
                <span className="font-mono">{currentData.physical_basis.total_flux_arrows}</span>
              </div>
            </div>

            <div className="pt-2 border-t">
              <Badge variant="secondary" className="text-xs">
                <TrendingUp className="w-3 h-3 mr-1" />
                Optimized Parameters
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Animation Controls */}
      <Card className="scientific-panel">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Play className="w-4 h-4" />
            Animation Controls
          </CardTitle>
          <CardDescription>
            60 frames optimized for smooth 60fps performance
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <Button
              onClick={() => setIsPlaying(!isPlaying)}
              variant={isPlaying ? "default" : "outline"}
              className="control-button flex-1"
            >
              {isPlaying ? (
                <>
                  <Pause className="w-4 h-4 mr-2" />
                  Pause
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 mr-2" />
                  Play
                </>
              )}
            </Button>
            <Button
              onClick={handleReset}
              variant="outline"
              className="control-button flex-shrink-0"
            >
              <RotateCcw className="w-4 h-4" />
            </Button>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label>Manual Progress Control</Label>
              <Badge variant="outline" className="text-xs">
                {dynamicValues.current_phase}
              </Badge>
            </div>
            <Slider
              value={[progress * 100]}
              onValueChange={handleProgressChange}
              max={100}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-slate-500">
              <span>Separated Quarks</span>
              <span>Merged Baryon</span>
            </div>
          </div>

          {/* Phase Breakdown */}
          <div className="text-xs space-y-1 p-2 bg-slate-50 rounded">
            <div className="font-medium">Animation Phases:</div>
            <div className="grid grid-cols-2 gap-1">
              <span>Separation (20%): 12 frames</span>
              <span>Approach (50%): 30 frames</span>
              <span>Merger (20%): 12 frames</span>
              <span>Stabilization (10%): 6 frames</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Visualization Options */}
      <Card className="scientific-panel">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Atom className="w-4 h-4" />
            Display Options
          </CardTitle>
          <CardDescription>
            Toggle optimized visualization features
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="flex items-center gap-2">
                <Zap className="w-4 h-4" />
                Flux Vectors
              </Label>
              <p className="text-xs text-slate-500">
                Arrows ∝ |Q/e| (flux quantization)
              </p>
            </div>
            <Switch
              checked={showFlux}
              onCheckedChange={setShowFlux}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="flex items-center gap-2">
                <RotateCcw className="w-4 h-4" />
                Energy Rotation
              </Label>
              <p className="text-xs text-slate-500">
                Speed ∝ √(E_binding/mass)
              </p>
            </div>
            <Switch
              checked={showRotation}
              onCheckedChange={setShowRotation}
            />
          </div>
        </CardContent>
      </Card>

      {/* Optimized Parameters Display */}
      <Card className="scientific-panel">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Calculator className="w-4 h-4" />
            Optimized Parameters
          </CardTitle>
          <CardDescription>
            Real-time parameter values with physical basis
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="current" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="current">Current</TabsTrigger>
              <TabsTrigger value="physical">Physical</TabsTrigger>
              <TabsTrigger value="performance">Performance</TabsTrigger>
            </TabsList>
            
            <TabsContent value="current" className="space-y-3">
              <div className="text-sm space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-600">Average Scale:</span>
                  <span className="font-mono text-xs">
                    {dynamicValues.avg_scale.toFixed(3)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Flux Intensity:</span>
                  <span className="font-mono text-xs">
                    {dynamicValues.flux_intensity.toFixed(0)}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Rotation Rate:</span>
                  <span className="font-mono text-xs">
                    {dynamicValues.rotation_rate.toFixed(0)}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Animation Phase:</span>
                  <Badge variant="secondary" className="text-xs">
                    {dynamicValues.current_phase}
                  </Badge>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="physical" className="space-y-3">
              <div className="text-sm space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-600">Scale Ratio (u:d):</span>
                  <span className="font-mono text-xs">
                    {currentData.physical_basis.scale_ratio}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Flux Ratio (u:d):</span>
                  <span className="font-mono text-xs">
                    {currentData.physical_basis.flux_ratio}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Rotation Ratio (u:d):</span>
                  <span className="font-mono text-xs">
                    {currentData.physical_basis.rotation_ratio}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Quark Masses:</span>
                  <span className="font-mono text-xs">
                    u: 2.3, d: 4.8 MeV/c²
                  </span>
                </div>
              </div>
              
              <div className="text-xs text-slate-500 pt-2 border-t">
                <p className="font-medium mb-1">Physical Basis:</p>
                <ul className="space-y-1">
                  <li>• Scale ∝ 1/mass (uncertainty principle)</li>
                  <li>• Flux ∝ |Q/e| (flux quantization)</li>
                  <li>• Length ∝ |Q|√α (EM coupling)</li>
                  <li>• Rotation ∝ √(E/m) (energy-motion)</li>
                </ul>
              </div>
            </TabsContent>
            
            <TabsContent value="performance" className="space-y-3">
              <div className="text-sm space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-600">Grid Resolution:</span>
                  <span className="font-mono text-xs">50×50</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Total Vertices:</span>
                  <span className="font-mono text-xs">
                    {dynamicValues.total_vertices.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Target FPS:</span>
                  <span className="font-mono text-xs">60</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Total Frames:</span>
                  <span className="font-mono text-xs">60</span>
                </div>
              </div>
              
              <div className="text-xs text-slate-500 pt-2 border-t">
                <p className="font-medium mb-1">Optimizations:</p>
                <ul className="space-y-1">
                  <li>• 50×50 grid balances topology + performance</li>
                  <li>• 60 frames provides smooth animation</li>
                  <li>• Vertex budget: 10K per frame</li>
                  <li>• Optimized for real-time rendering</li>
                </ul>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Quark Parameter Comparison */}
      <Card className="scientific-panel">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Info className="w-4 h-4" />
            Quark Parameter Comparison
          </CardTitle>
          <CardDescription>
            Individual quark properties in current baryon
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {currentData.quarks.map((quark, index) => (
              <div key={index} className="p-2 bg-slate-50 rounded text-sm">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">{quark} quark #{index + 1}</span>
                  <Badge 
                    variant="outline" 
                    style={{ backgroundColor: currentData.name === 'Proton' 
                      ? (quark === 'u' ? '#FF4444' : '#4444FF')
                      : (index === 0 ? '#FF4444' : index === 1 ? '#4444FF' : '#44FF44')
                    }}
                    className="text-white text-xs"
                  >
                    {quark}
                  </Badge>
                </div>
                
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-slate-600">Scale:</span>
                    <span className="font-mono ml-1">
                      {currentData.optimized_parameters.scales[index].toFixed(3)}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-600">Flux:</span>
                    <span className="font-mono ml-1">
                      {currentData.optimized_parameters.flux_arrows[index]} arrows
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-600">Length:</span>
                    <span className="font-mono ml-1">
                      {currentData.optimized_parameters.flux_lengths[index].toFixed(4)}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-600">Rotation:</span>
                    <span className="font-mono ml-1">
                      {currentData.optimized_parameters.rotation_speeds[index].toFixed(4)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OptimizedControlPanel;
