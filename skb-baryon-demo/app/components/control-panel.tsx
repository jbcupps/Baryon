
'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Play, Pause, RotateCcw, Settings2, Zap, Atom, HelpCircle } from 'lucide-react';
import QCDColorLegend from './qcd-color-legend';
import { ControlTooltip, StatusTooltip } from '@/components/ui/tooltip-advanced';

interface ControlPanelProps {
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

const ControlPanel: React.FC<ControlPanelProps> = ({
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
  const presetData = {
    proton: {
      name: 'Proton',
      symbol: 'p⁺',
      quarks: ['u', 'u', 'd'],
      charge: '+e',
      mass: '938.3 MeV/c²',
      stability: 'stable'
    },
    neutron: {
      name: 'Neutron',
      symbol: 'n⁰',
      quarks: ['u', 'd', 'd'],
      charge: '0',
      mass: '939.6 MeV/c²',
      stability: 'stable'
    }
  };

  const currentData = presetData[selectedPreset as keyof typeof presetData];

  const handleReset = () => {
    setProgress(0);
    setIsPlaying(false);
  };

  const handleProgressChange = (value: number[]) => {
    setProgress(value[0] / 100);
    setIsPlaying(false);
  };

  return (
    <div className="space-y-4">
      {/* Preset Selection */}
      <Card className="scientific-panel">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Settings2 className="w-4 h-4" />
            Baryon Configuration
          </CardTitle>
          <CardDescription>
            Select proton or neutron formation
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <ControlTooltip
              title="Baryon Type Selection"
              description="Choose between proton (uud) and neutron (udd) configurations for the visualization"
              effect="Changes the quark composition and physical properties displayed in the simulation"
              shortcut="B"
            >
              <Label className="cursor-help flex items-center gap-1">
                Baryon Type
                <HelpCircle className="w-3 h-3 text-slate-400" />
              </Label>
            </ControlTooltip>
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

          {/* Current Selection Info */}
          <div className="p-3 bg-slate-50 rounded-lg space-y-2">
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
                <span className="text-slate-600">Stability:</span>
                <Badge variant="secondary" className="text-xs">{currentData.stability}</Badge>
              </div>
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
            Control the merger animation
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <ControlTooltip
              title={isPlaying ? "Pause Animation" : "Play Animation"}
              description={isPlaying ? "Pause the automatic baryon formation process" : "Start the automatic baryon formation animation"}
              effect={isPlaying ? "Stops the timer and freezes the current state" : "Begins the merger sequence from separated quarks to formed baryon"}
              shortcut="Space"
            >
              <Button
                onClick={() => setIsPlaying(!isPlaying)}
                variant={isPlaying ? "default" : "outline"}
                className="control-button flex-1 cursor-help"
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
            </ControlTooltip>
            
            <ControlTooltip
              title="Reset Animation"
              description="Reset the simulation to the initial state with separated quarks"
              effect="Returns progress to 0% and stops the animation"
              shortcut="R"
            >
              <Button
                onClick={handleReset}
                variant="outline"
                className="control-button cursor-help"
              >
                <RotateCcw className="w-4 h-4" />
              </Button>
            </ControlTooltip>
          </div>

          <div className="space-y-2">
            <ControlTooltip
              title="Manual Progress Control"
              description="Manually control the merger progress from separated quarks (0%) to fully formed baryon (100%)"
              effect="Overrides automatic animation and allows precise control of the formation process"
              range="0% - 100%"
            >
              <Label className="cursor-help flex items-center gap-1">
                Manual Progress Control
                <HelpCircle className="w-3 h-3 text-slate-400" />
              </Label>
            </ControlTooltip>
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
            Toggle visualization features
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <ControlTooltip
              title="Flux Vectors"
              description="Display electric field lines and electromagnetic flux patterns around the Klein bottles"
              effect="Shows how electric fields interact during quark confinement and baryon formation"
              shortcut="F"
            >
              <Label className="flex items-center gap-2 cursor-help">
                <Zap className="w-4 h-4" />
                Flux Vectors
                <HelpCircle className="w-3 h-3 text-slate-400 ml-1" />
              </Label>
            </ControlTooltip>
            <Switch
              checked={showFlux}
              onCheckedChange={setShowFlux}
            />
          </div>

          <div className="flex items-center justify-between">
            <ControlTooltip
              title="Energy Rotation"
              description="Show rotational energy motion and angular momentum of the Klein bottle structures"
              effect="Visualizes the spin properties and rotational dynamics during baryon formation"
              shortcut="E"
            >
              <Label className="flex items-center gap-2 cursor-help">
                <RotateCcw className="w-4 h-4" />
                Energy Rotation
                <HelpCircle className="w-3 h-3 text-slate-400 ml-1" />
              </Label>
            </ControlTooltip>
            <Switch
              checked={showRotation}
              onCheckedChange={setShowRotation}
            />
          </div>
        </CardContent>
      </Card>

      {/* QCD Color Legend */}
      <QCDColorLegend selectedPreset={selectedPreset} />

      {/* Variable Impact */}
      <Card className="scientific-panel">
        <CardHeader>
          <ControlTooltip
            title="Variable Impact Analysis"
            description="Real-time analysis of how merger progress affects various system parameters"
            effect="Shows the dynamic relationship between quark separation and physical properties"
          >
            <CardTitle className="text-lg cursor-help flex items-center gap-2">
              Variable Impact
              <HelpCircle className="w-4 h-4 text-slate-400" />
            </CardTitle>
          </ControlTooltip>
          <CardDescription>
            Live parameter relationships
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="text-sm space-y-2">
            <div className="flex justify-between">
              <StatusTooltip
                metric="Scale Factor"
                value={(0.8 * (1 - progress * 0.7)).toFixed(2)}
                interpretation="Geometric scaling factor that changes as quarks approach each other"
                goodRange="Decreases from 0.8 to ~0.24 during merger"
              >
                <span className="text-slate-600 cursor-help flex items-center gap-1">
                  Scale Factor:
                  <HelpCircle className="w-3 h-3 text-slate-400" />
                </span>
              </StatusTooltip>
              <span className="font-mono text-xs">
                {(0.8 * (1 - progress * 0.7)).toFixed(2)}
              </span>
            </div>
            
            <div className="flex justify-between">
              <StatusTooltip
                metric="Flux Intensity"
                value={`${((1 - progress * 0.5) * 100).toFixed(0)}%`}
                interpretation="Electric field strength decreases as quarks become confined within the baryon"
                goodRange="100% (separated) to 50% (merged)"
              >
                <span className="text-slate-600 cursor-help flex items-center gap-1">
                  Flux Intensity:
                  <HelpCircle className="w-3 h-3 text-slate-400" />
                </span>
              </StatusTooltip>
              <span className="font-mono text-xs">
                {((1 - progress * 0.5) * 100).toFixed(0)}%
              </span>
            </div>
            
            <div className="flex justify-between">
              <StatusTooltip
                metric="Rotation Rate"
                value={`${((1 - progress) * 100).toFixed(0)}%`}
                interpretation="Individual quark rotation slows as collective baryon rotation emerges"
                goodRange="100% (independent) to 0% (unified)"
              >
                <span className="text-slate-600 cursor-help flex items-center gap-1">
                  Rotation Rate:
                  <HelpCircle className="w-3 h-3 text-slate-400" />
                </span>
              </StatusTooltip>
              <span className="font-mono text-xs">
                {((1 - progress) * 100).toFixed(0)}%
              </span>
            </div>
          </div>
          
          <ControlTooltip
            title="Physical Interpretation"
            description="The transition from individual quark properties to collective baryon behavior represents fundamental physics"
            effect="Understanding how microscopic properties combine to create macroscopic particles"
          >
            <div className="text-xs text-slate-500 pt-2 border-t cursor-help">
              <p className="flex items-start gap-1">
                <HelpCircle className="w-3 h-3 mt-0.5 flex-shrink-0" />
                As quarks merge, individual properties diminish while collective baryon properties emerge.
              </p>
            </div>
          </ControlTooltip>
        </CardContent>
      </Card>
    </div>
  );
};

export default ControlPanel;
