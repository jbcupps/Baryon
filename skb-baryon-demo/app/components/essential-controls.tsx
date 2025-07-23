
'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Play, Pause, RotateCcw, Atom, Settings } from 'lucide-react';
import { ControlTooltip } from '@/components/ui/tooltip-advanced';
import Link from 'next/link';

interface EssentialControlsProps {
  selectedPreset: string;
  setSelectedPreset: (preset: string) => void;
  isPlaying: boolean;
  setIsPlaying: (playing: boolean) => void;
  progress: number;
  setProgress: (progress: number) => void;
}

const EssentialControls: React.FC<EssentialControlsProps> = ({
  selectedPreset,
  setSelectedPreset,
  isPlaying,
  setIsPlaying,
  progress,
  setProgress
}) => {
  const presetData = {
    proton: {
      name: 'Proton',
      symbol: 'p⁺',
      quarks: ['u', 'u', 'd'],
      charge: '+e'
    },
    neutron: {
      name: 'Neutron',
      symbol: 'n⁰',
      quarks: ['u', 'd', 'd'],
      charge: '0'
    }
  };

  const currentPreset = presetData[selectedPreset as keyof typeof presetData];

  const handleReset = () => {
    setProgress(0);
    setIsPlaying(false);
  };

  return (
    <Card className="backdrop-blur-sm bg-white/95 border shadow-lg">
      <CardContent className="p-4 space-y-4">
        {/* Baryon Selection */}
        <div className="space-y-2">
          <ControlTooltip
            title="Baryon Type Selection"
            description="Choose between proton (uud) and neutron (udd) configurations for visualization"
            effect="Updates quark composition and physical properties in real-time"
          >
            <Label className="text-sm font-medium cursor-help">Baryon Type</Label>
          </ControlTooltip>
          
          <Select value={selectedPreset} onValueChange={setSelectedPreset}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(presetData).map(([key, data]) => (
                <SelectItem key={key} value={key}>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      {data.symbol}
                    </Badge>
                    <span>{data.name}</span>
                    <span className="text-xs text-muted-foreground">
                      ({data.quarks.join('')})
                    </span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Current selection info */}
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Badge variant="secondary" className="text-xs">
              {currentPreset?.charge}
            </Badge>
            <span>Quarks: {currentPreset?.quarks.join('-')}</span>
          </div>
        </div>

        {/* Animation Controls */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <ControlTooltip
              title="Animation Controls"
              description="Control the baryon formation animation playback"
              effect="Play, pause, or reset the Klein bottle deformation sequence"
            >
              <Label className="text-sm font-medium cursor-help">Animation</Label>
            </ControlTooltip>

            <div className="flex items-center gap-1">
              <ControlTooltip
                title={isPlaying ? "Pause Animation" : "Play Animation"}
                description={isPlaying ? "Pause the baryon formation process" : "Start the baryon formation animation"}
                effect="Toggle real-time visualization playback"
                shortcut="Space"
              >
                <Button
                  variant={isPlaying ? "default" : "outline"}
                  size="sm"
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="gap-1"
                >
                  {isPlaying ? (
                    <Pause className="w-3 h-3" />
                  ) : (
                    <Play className="w-3 h-3" />
                  )}
                  <span className="hidden sm:inline">
                    {isPlaying ? 'Pause' : 'Play'}
                  </span>
                </Button>
              </ControlTooltip>

              <ControlTooltip
                title="Reset Animation"
                description="Reset the animation to the initial state"
                effect="Returns baryon formation to starting configuration"
                shortcut="R"
              >
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleReset}
                  className="gap-1"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span className="hidden sm:inline">Reset</span>
                </Button>
              </ControlTooltip>
            </div>
          </div>

          {/* Animation Speed Slider */}
          <div className="space-y-2">
            <ControlTooltip
              title="Animation Speed"
              description="Control the playback speed of the baryon formation process"
              effect="Adjusts the rate of Klein bottle deformation and quark dynamics"
            >
              <Label className="text-xs text-muted-foreground cursor-help">
                Speed: {Math.round(progress * 100)}%
              </Label>
            </ControlTooltip>
            
            <Slider
              value={[progress]}
              onValueChange={(value) => setProgress(value[0] ?? 0)}
              max={1}
              step={0.01}
              className="w-full"
            />
          </div>
        </div>

        {/* Quick Access to Advanced Controls */}
        <div className="pt-2 border-t">
          <ControlTooltip
            title="Advanced Settings"
            description="Access comprehensive physics parameters, color confinement settings, and mathematical displays"
            effect="Navigate to the full controls interface with all advanced options"
          >
            <Button asChild variant="outline" size="sm" className="w-full gap-2">
              <Link href="/controls">
                <Settings className="w-4 h-4" />
                Advanced Settings
              </Link>
            </Button>
          </ControlTooltip>
        </div>
      </CardContent>
    </Card>
  );
};

export default EssentialControls;
