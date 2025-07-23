
'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { PhysicsParameters } from '@/components/advanced-physics-engine';
import { ConfinementParameters } from '@/components/color-confinement-engine';
import { FluidDynamicsParameters, DEFAULT_FLUID_DYNAMICS_PARAMS } from '@/lib/fluid-dynamics-types';

export interface VisualizationState {
  // Basic control state
  selectedPreset: string;
  isPlaying: boolean;
  progress: number;
  showFlux: boolean;
  showRotation: boolean;

  // Advanced physics parameters
  physicsParams: PhysicsParameters;

  // Color confinement parameters
  confinementParams: ConfinementParameters;

  // Fluid dynamics parameters (new)
  fluidDynamicsParams: FluidDynamicsParameters;

  // Advanced visualization options
  showDeformation: boolean;
  showStressTensor: boolean;
  showFluidFlow: boolean;
  showNecking: boolean;
  showFluidDynamics: boolean; // New toggle for fluid dynamics

  // Real-time data from visualization
  confinementData: any;
  physicsData: any;
  fluidDynamicsData: any; // New real-time fluid dynamics data
}

interface VisualizationContextType {
  state: VisualizationState;
  
  // Basic controls
  setSelectedPreset: (preset: string) => void;
  setIsPlaying: (playing: boolean) => void;
  setProgress: (progress: number) => void;
  setShowFlux: (show: boolean) => void;
  setShowRotation: (show: boolean) => void;

  // Advanced physics
  setPhysicsParams: (params: PhysicsParameters) => void;
  
  // Color confinement
  setConfinementParams: (params: ConfinementParameters) => void;
  
  // Fluid dynamics (new)
  setFluidDynamicsParams: (params: FluidDynamicsParameters) => void;
  
  // Visualization options
  setShowDeformation: (show: boolean) => void;
  setShowStressTensor: (show: boolean) => void;
  setShowFluidFlow: (show: boolean) => void;
  setShowNecking: (show: boolean) => void;
  setShowFluidDynamics: (show: boolean) => void; // New toggle
  
  // Real-time data updates
  handleConfinementUpdate: (data: any) => void;
  handlePhysicsUpdate: (data: any) => void;
  handleFluidDynamicsUpdate: (data: any) => void; // New update handler
}

const VisualizationContext = createContext<VisualizationContextType | null>(null);

export const useVisualization = () => {
  const context = useContext(VisualizationContext);
  if (!context) {
    throw new Error('useVisualization must be used within a VisualizationProvider');
  }
  return context;
};

interface VisualizationProviderProps {
  children: ReactNode;
}

export const VisualizationProvider: React.FC<VisualizationProviderProps> = ({ children }) => {
  // Initialize state with default values
  const [state, setState] = useState<VisualizationState>({
    // Basic control state
    selectedPreset: 'proton',
    isPlaying: false,
    progress: 0,
    showFlux: true,
    showRotation: true,

    // Advanced physics parameters
    physicsParams: {
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
    },

    // Color confinement parameters
    confinementParams: {
      holonomyStrength: 1.0,
      pinMinusField: 0.8,
      bordismClass: 0,
      fluxTubeStrength: 0.6,
      confinementScale: 1.2
    },

    // Fluid dynamics parameters (new)
    fluidDynamicsParams: DEFAULT_FLUID_DYNAMICS_PARAMS,

    // Advanced visualization options
    showDeformation: true,
    showStressTensor: false,
    showFluidFlow: false,
    showNecking: true,
    showFluidDynamics: true, // New toggle for fluid dynamics

    // Real-time data from visualization
    confinementData: {
      holonomies: [],
      pinMinusValid: [true, true, true],
      bordismClass: 0,
      isColorNeutral: true,
      confinementStrength: 0,
      isStable: true
    },
    physicsData: {
      deformationMagnitude: 0,
      hasNecking: false,
      fluidState: null
    },
    fluidDynamicsData: { // New real-time fluid dynamics data
      proximityInfluences: [],
      deformationVectors: [],
      timeVaryingWarping: null,
      fluidBlending: null,
      performanceMetrics: null
    }
  });

  // Basic control setters
  const setSelectedPreset = useCallback((preset: string) => {
    setState(prev => ({ ...prev, selectedPreset: preset }));
  }, []);

  const setIsPlaying = useCallback((playing: boolean) => {
    setState(prev => ({ ...prev, isPlaying: playing }));
  }, []);

  const setProgress = useCallback((progress: number) => {
    setState(prev => ({ ...prev, progress }));
  }, []);

  const setShowFlux = useCallback((show: boolean) => {
    setState(prev => ({ ...prev, showFlux: show }));
  }, []);

  const setShowRotation = useCallback((show: boolean) => {
    setState(prev => ({ ...prev, showRotation: show }));
  }, []);

  // Advanced physics setter
  const setPhysicsParams = useCallback((params: PhysicsParameters) => {
    setState(prev => ({ ...prev, physicsParams: params }));
  }, []);

  // Color confinement setter
  const setConfinementParams = useCallback((params: ConfinementParameters) => {
    setState(prev => ({ ...prev, confinementParams: params }));
  }, []);

  // Fluid dynamics setter (new)
  const setFluidDynamicsParams = useCallback((params: FluidDynamicsParameters) => {
    setState(prev => ({ ...prev, fluidDynamicsParams: params }));
  }, []);

  // Visualization option setters
  const setShowDeformation = useCallback((show: boolean) => {
    setState(prev => ({ ...prev, showDeformation: show }));
  }, []);

  const setShowStressTensor = useCallback((show: boolean) => {
    setState(prev => ({ ...prev, showStressTensor: show }));
  }, []);

  const setShowFluidFlow = useCallback((show: boolean) => {
    setState(prev => ({ ...prev, showFluidFlow: show }));
  }, []);

  const setShowNecking = useCallback((show: boolean) => {
    setState(prev => ({ ...prev, showNecking: show }));
  }, []);

  const setShowFluidDynamics = useCallback((show: boolean) => {
    setState(prev => ({ ...prev, showFluidDynamics: show }));
  }, []);

  // Real-time data update callbacks (memoized to prevent infinite loops)
  const handleConfinementUpdate = useCallback((data: any) => {
    setState(prev => {
      // Only update if data has actually changed
      if (!prev.confinementData || JSON.stringify(prev.confinementData) !== JSON.stringify(data)) {
        return { ...prev, confinementData: data };
      }
      return prev;
    });
  }, []);

  const handlePhysicsUpdate = useCallback((data: any) => {
    if (data) {
      setState(prev => {
        // Only update if data has actually changed
        if (!prev.physicsData || JSON.stringify(prev.physicsData) !== JSON.stringify(data)) {
          return { ...prev, physicsData: data };
        }
        return prev;
      });
    }
  }, []);

  const handleFluidDynamicsUpdate = useCallback((data: any) => {
    if (data) {
      setState(prev => {
        // Only update if data has actually changed
        if (!prev.fluidDynamicsData || JSON.stringify(prev.fluidDynamicsData) !== JSON.stringify(data)) {
          return { ...prev, fluidDynamicsData: data };
        }
        return prev;
      });
    }
  }, []);

  const contextValue: VisualizationContextType = {
    state,
    
    // Basic controls
    setSelectedPreset,
    setIsPlaying,
    setProgress,
    setShowFlux,
    setShowRotation,

    // Advanced controls
    setPhysicsParams,
    setConfinementParams,
    setFluidDynamicsParams, // New fluid dynamics setter
    
    // Visualization options
    setShowDeformation,
    setShowStressTensor,
    setShowFluidFlow,
    setShowNecking,
    setShowFluidDynamics, // New fluid dynamics toggle
    
    // Real-time updates
    handleConfinementUpdate,
    handlePhysicsUpdate,
    handleFluidDynamicsUpdate // New fluid dynamics update handler
  };

  return (
    <VisualizationContext.Provider value={contextValue}>
      {children}
    </VisualizationContext.Provider>
  );
};
