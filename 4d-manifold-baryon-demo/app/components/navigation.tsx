
'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Atom, 
  Settings, 
  Eye, 
  Sliders,
  ArrowLeft,
  ArrowRight
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useVisualization } from '@/contexts/visualization-context';
import { ControlTooltip } from '@/components/ui/tooltip-advanced';

const Navigation: React.FC = () => {
  const pathname = usePathname();
  const { state } = useVisualization();
  
  const isVisualizationPage = pathname === '/';
  const isControlsPage = pathname === '/controls';

  return (
    <div className="flex items-center gap-2">
      {/* Main Navigation */}
      <div className="flex items-center gap-1 bg-white/90 backdrop-blur-sm rounded-lg p-1 border shadow-sm">
        <ControlTooltip
          title="3D Visualization"
          description="Interactive Klein bottle visualization with essential animation controls"
          effect="View the baryon formation process with streamlined controls"
          shortcut="V"
        >
          <Button
            asChild
            variant={isVisualizationPage ? "default" : "ghost"}
            size="sm"
            className={cn(
              "gap-2 transition-all duration-200",
              isVisualizationPage && "shadow-sm"
            )}
          >
            <Link href="/">
              <Eye className="w-4 h-4" />
              <span className="hidden sm:inline">Visualization</span>
            </Link>
          </Button>
        </ControlTooltip>

        <ControlTooltip
          title="Advanced Controls"
          description="Comprehensive physics parameters, color confinement settings, and mathematical controls"
          effect="Access all advanced parameters and detailed configuration options"
          shortcut="C"
        >
          <Button
            asChild
            variant={isControlsPage ? "default" : "ghost"}
            size="sm"
            className={cn(
              "gap-2 transition-all duration-200",
              isControlsPage && "shadow-sm"
            )}
          >
            <Link href="/controls">
              <Sliders className="w-4 h-4" />
              <span className="hidden sm:inline">Controls</span>
            </Link>
          </Button>
        </ControlTooltip>
      </div>

      {/* Quick Navigation Arrows */}
      <div className="flex items-center gap-1">
        {isControlsPage && (
          <ControlTooltip
            title="Back to Visualization"
            description="Return to the main 3D visualization interface"
            effect="Quick navigation to the visualization page"
          >
            <Button asChild variant="outline" size="sm" className="gap-1">
              <Link href="/">
                <ArrowLeft className="w-3 h-3" />
                <span className="hidden sm:inline">Back</span>
              </Link>
            </Button>
          </ControlTooltip>
        )}

        {isVisualizationPage && (
          <ControlTooltip
            title="Advanced Controls"
            description="Access detailed physics parameters and mathematical settings"
            effect="Navigate to the comprehensive controls interface"
          >
            <Button asChild variant="outline" size="sm" className="gap-1">
              <Link href="/controls">
                <span className="hidden sm:inline">Settings</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </Button>
          </ControlTooltip>
        )}
      </div>

      {/* Status Indicator */}
      <div className="hidden md:flex items-center gap-1">
        <Badge 
          variant={state.isPlaying ? "default" : "secondary"} 
          className="text-xs"
        >
          {state.isPlaying ? "Active" : "Paused"}
        </Badge>
        <Badge variant="outline" className="text-xs">
          {state.selectedPreset === 'proton' ? 'p⁺' : 'n⁰'}
        </Badge>
      </div>
    </div>
  );
};

export default Navigation;
