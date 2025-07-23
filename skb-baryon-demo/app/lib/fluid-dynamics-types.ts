
'use client';

import * as THREE from 'three';

// Enhanced fluid dynamics parameters
export interface FluidDynamicsParameters {
  // Core fluidity controls
  fluidityStrength: number; // 0-1, overall fluid behavior intensity
  softness: number; // 0-1, material softness/malleability
  
  // Dynamic deformation parameters
  dynamic_deform: number; // 0-1, base deformation intensity
  interaction_vecs: THREE.Vector3[]; // Force vectors between sub-SKBs
  tension_scalar: number; // Surface tension strength
  
  // Proximity-based physics
  proximityInfluence: number; // 0-1, how much proximity affects deformation
  proximityThreshold: number; // Distance threshold for proximity effects
  forceDecayRate: number; // How quickly forces decay with distance
  
  // Time-varying warping
  perlinNoiseScale: number; // Scale of Perlin noise patterns
  perlinTimeSpeed: number; // Speed of temporal variation
  wiggleAmplitude: number; // Amplitude of independent wiggle motion
  wiggleFrequency: number; // Frequency of wiggle motion
  
  // Fluid blending during merger
  blendingIntensity: number; // 0-1, how much surfaces blend during merger
  vertexInterpolationRate: number; // Speed of vertex interpolation
  smoothingIterations: number; // Number of smoothing passes
  
  // Advanced parameters
  viscosityFactor: number; // Fluid viscosity
  elasticRestoring: number; // Elastic restoring force strength
  dampingCoefficient: number; // Overall damping
}

// Perlin noise interface for consistent noise generation
export interface PerlinNoiseGenerator {
  noise3D(x: number, y: number, z: number): number;
  noise2D(x: number, y: number): number;
}

// Enhanced deformation state
export interface FluidDeformationState {
  vertices: Float32Array;
  velocities: THREE.Vector3[];
  forces: THREE.Vector3[];
  proximityInfluences: Map<number, THREE.Vector3[]>;
  noiseOffsets: THREE.Vector3[];
  blendingFactors: number[];
  timePhases: number[];
}

// Proximity calculation result
export interface ProximityResult {
  distance: number;
  direction: THREE.Vector3;
  influence: number;
  forceVector: THREE.Vector3;
}

// Klein bottle surface generation parameters
export interface KleinBottleSurfaceParams {
  u: number;
  v: number;
  scale: number;
  offset: THREE.Vector3;
  rotationAngle?: number;
  
  // New dynamic parameters
  dynamic_deform: number;
  interaction_vecs: THREE.Vector3[];
  tension_scalar: number;
  
  // Time-based parameters
  time: number;
  noiseOffset: THREE.Vector3;
  wigglePhase: number;
}

// Merger blending interface
export interface MergerBlendingState {
  progress: number; // 0-1, merger progress
  activeBlends: Array<{
    vertex1Index: number;
    vertex2Index: number;
    blendFactor: number;
    targetPosition: THREE.Vector3;
  }>;
  bridgeVertices: Array<{
    position: THREE.Vector3;
    connections: number[];
    strength: number;
  }>;
}

// Testing validation interface
export interface DeformationValidation {
  testName: string;
  passed: boolean;
  metrics: {
    maxDeformation: number;
    averageDeformation: number;
    topologicalIntegrity: boolean;
    performanceMs: number;
  };
  errors?: string[];
}

export const DEFAULT_FLUID_DYNAMICS_PARAMS: FluidDynamicsParameters = {
  // Core fluidity
  fluidityStrength: 0.5,
  softness: 0.6,
  
  // Dynamic deformation
  dynamic_deform: 0.4,
  interaction_vecs: [],
  tension_scalar: 0.3,
  
  // Proximity physics
  proximityInfluence: 0.7,
  proximityThreshold: 2.0,
  forceDecayRate: 0.8,
  
  // Time-varying warping
  perlinNoiseScale: 0.5,
  perlinTimeSpeed: 0.3,
  wiggleAmplitude: 0.2,
  wiggleFrequency: 1.5,
  
  // Fluid blending
  blendingIntensity: 0.6,
  vertexInterpolationRate: 0.1,
  smoothingIterations: 3,
  
  // Advanced parameters
  viscosityFactor: 0.4,
  elasticRestoring: 0.2,
  dampingCoefficient: 0.9
};
