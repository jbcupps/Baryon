
'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  FluidDynamicsParameters, 
  DEFAULT_FLUID_DYNAMICS_PARAMS
} from '@/lib/fluid-dynamics-types';
import { 
  Waves, 
  Zap, 
  Activity, 
  Target, 
  Gauge, 
  Settings
} from 'lucide-react';

interface FluidDynamicsControlsProps {
  params: FluidDynamicsParameters;
  onParamsChange: (params: FluidDynamicsParameters) => void;
  showFluidDynamics: boolean;
  onToggleFluidDynamics: (show: boolean) => void;
  isPlaying?: boolean;
}

const FluidDynamicsControls: React.FC<FluidDynamicsControlsProps> = ({
  params,
  onParamsChange,
  showFluidDynamics,
  onToggleFluidDynamics,
  isPlaying = false
}) => {
  // Update parameter helper
  const updateParam = (key: keyof FluidDynamicsParameters, value: number) => {
    onParamsChange({
      ...params,
      [key]: value
    });
  };

  // Reset to defaults
  const resetToDefaults = () => {
    onParamsChange(DEFAULT_FLUID_DYNAMICS_PARAMS);
  };

  return (
    <div className="space-y-4">
      {/* Master Toggle and Status */}
      <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Waves className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <CardTitle className="text-lg">Fluid Dynamics Engine</CardTitle>
                <CardDescription>
                  Advanced mesh deformation with proximity physics and time-varying warping
                </CardDescription>
              </div>
            </div>
            <Switch
              checked={showFluidDynamics}
              onCheckedChange={onToggleFluidDynamics}
              disabled={isPlaying}
            />
          </div>
        </CardHeader>
        
        {showFluidDynamics && (
          <CardContent className="space-y-4">
            {/* Core Fluidity Controls */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Activity className="h-4 w-4 text-blue-500" />
                  <span className="text-sm font-medium">Fluidity: {params.fluidityStrength.toFixed(2)}</span>
                </div>
                <Slider
                  value={[params.fluidityStrength]}
                  onValueChange={([value]) => updateParam('fluidityStrength', value)}
                  min={0}
                  max={1}
                  step={0.01}
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Target className="h-4 w-4 text-green-500" />
                  <span className="text-sm font-medium">Softness: {params.softness.toFixed(2)}</span>
                </div>
                <Slider
                  value={[params.softness]}
                  onValueChange={([value]) => updateParam('softness', value)}
                  min={0}
                  max={1}
                  step={0.01}
                  className="w-full"
                />
              </div>
            </div>

            <Separator />

            {/* Dynamic Deformation Controls */}
            <div>
              <h4 className="text-sm font-medium mb-3 flex items-center space-x-2">
                <Zap className="h-4 w-4 text-yellow-500" />
                <span>Dynamic Deformation</span>
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <span className="text-sm font-medium">
                    Base Intensity: {params.dynamic_deform.toFixed(2)}
                  </span>
                  <Slider
                    value={[params.dynamic_deform]}
                    onValueChange={([value]) => updateParam('dynamic_deform', value)}
                    min={0}
                    max={1}
                    step={0.01}
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <span className="text-sm font-medium">
                    Surface Tension: {params.tension_scalar.toFixed(2)}
                  </span>
                  <Slider
                    value={[params.tension_scalar]}
                    onValueChange={([value]) => updateParam('tension_scalar', value)}
                    min={0}
                    max={1}
                    step={0.01}
                    className="w-full"
                  />
                </div>
              </div>
            </div>

            <Separator />

            {/* Time-Varying Warping Controls */}
            <div>
              <h4 className="text-sm font-medium mb-3 flex items-center space-x-2">
                <Activity className="h-4 w-4 text-orange-500" />
                <span>Time-Varying Warping</span>
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <span className="text-xs font-medium">
                    Wiggle Amplitude: {params.wiggleAmplitude.toFixed(2)}
                  </span>
                  <Slider
                    value={[params.wiggleAmplitude]}
                    onValueChange={([value]) => updateParam('wiggleAmplitude', value)}
                    min={0}
                    max={1.0}
                    step={0.01}
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <span className="text-xs font-medium">
                    Wiggle Frequency: {params.wiggleFrequency.toFixed(1)}
                  </span>
                  <Slider
                    value={[params.wiggleFrequency]}
                    onValueChange={([value]) => updateParam('wiggleFrequency', value)}
                    min={0.5}
                    max={3.0}
                    step={0.1}
                    className="w-full"
                  />
                </div>
              </div>
            </div>

            <Separator />

            {/* Control Actions */}
            <div className="flex items-center justify-between pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={resetToDefaults}
                className="text-xs"
              >
                Reset to Defaults
              </Button>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
};

export default FluidDynamicsControls;
