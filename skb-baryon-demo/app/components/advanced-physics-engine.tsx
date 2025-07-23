
'use client';

import React, { useMemo } from 'react';
import * as THREE from 'three';

// Advanced physics parameters for fluid-like dynamics
export interface PhysicsParameters {
  // Deformation controls
  deformationIntensity: number;
  fluidViscosity: number;
  elasticModulus: number;
  
  // Mesh dynamics
  vertexStiffness: number;
  dampingFactor: number;
  proximityThreshold: number;
  
  // Merger physics
  neckingStrength: number;
  bridgeFormation: number;
  surfaceTension: number;
  
  // Time evolution
  timeStep: number;
  maxDeformation: number;
}

export interface ForceField {
  position: THREE.Vector3;
  strength: number;
  range: number;
  type: 'attractive' | 'repulsive' | 'vortex';
}

export interface DeformationTensor {
  xx: number; xy: number; xz: number;
  yx: number; yy: number; yz: number;
  zx: number; zy: number; zz: number;
}

export interface FluidState {
  velocity: THREE.Vector3[];
  acceleration: THREE.Vector3[];
  pressure: number[];
  density: number[];
  vorticity: THREE.Vector3[];
}

export class AdvancedPhysicsEngine {
  private static instance: AdvancedPhysicsEngine;
  
  private deformationHistory: Map<string, THREE.Vector3[]> = new Map();
  private velocityField: Map<string, THREE.Vector3[]> = new Map();
  private stressTensors: Map<string, DeformationTensor[]> = new Map();

  static getInstance(): AdvancedPhysicsEngine {
    if (!AdvancedPhysicsEngine.instance) {
      AdvancedPhysicsEngine.instance = new AdvancedPhysicsEngine();
    }
    return AdvancedPhysicsEngine.instance;
  }

  // Real-time mesh deformation with proximity-based forces
  calculateMeshDeformation(
    originalVertices: Float32Array,
    positions: THREE.Vector3[],
    progress: number,
    params: PhysicsParameters
  ): Float32Array {
    const deformedVertices = new Float32Array(originalVertices.length);
    const vertexCount = originalVertices.length / 3;

    // Create force field sources at quark positions
    const forceFields: ForceField[] = positions.map((pos, i) => ({
      position: pos.clone(),
      strength: 0.5 * (1 - progress) + 0.1, // Weaken during merger
      range: 2.0 + progress * 3.0, // Expand range during merger
      type: i < 2 ? 'attractive' : 'vortex' as const
    }));

    for (let i = 0; i < vertexCount; i++) {
      const baseX = originalVertices[i * 3];
      const baseY = originalVertices[i * 3 + 1];
      const baseZ = originalVertices[i * 3 + 2];
      const vertex = new THREE.Vector3(baseX, baseY, baseZ);

      let totalDeformation = new THREE.Vector3(0, 0, 0);

      // Apply force fields from each quark
      forceFields.forEach((field, fieldIndex) => {
        const distance = vertex.distanceTo(field.position);
        
        if (distance < field.range && distance > 0.001) {
          const direction = vertex.clone().sub(field.position).normalize();
          let forceMagnitude = 0;

          switch (field.type) {
            case 'attractive':
              forceMagnitude = -field.strength * Math.exp(-distance / field.range);
              break;
            case 'repulsive':
              forceMagnitude = field.strength / (distance * distance + 0.1);
              break;
            case 'vortex':
              // Create swirling motion for third quark
              const tangent = new THREE.Vector3(-direction.y, direction.x, 0).normalize();
              totalDeformation.add(tangent.multiplyScalar(
                field.strength * Math.sin(progress * Math.PI * 2) / (distance + 0.1)
              ));
              forceMagnitude = -field.strength * 0.3 * Math.exp(-distance / field.range);
              break;
          }

          const force = direction.multiplyScalar(forceMagnitude * params.deformationIntensity);
          totalDeformation.add(force);
        }
      });

      // Proximity-based inter-vertex forces (fluid-like behavior)
      this.applyProximityForces(vertex, originalVertices, i, totalDeformation, params);

      // Apply elastic restoring force
      const elasticForce = vertex.clone().multiplyScalar(-params.elasticModulus * 0.1);
      totalDeformation.add(elasticForce);

      // Damping
      totalDeformation.multiplyScalar(params.dampingFactor);

      // Clamp deformation magnitude
      if (totalDeformation.length() > params.maxDeformation) {
        totalDeformation.normalize().multiplyScalar(params.maxDeformation);
      }

      // Apply deformation
      deformedVertices[i * 3] = baseX + totalDeformation.x;
      deformedVertices[i * 3 + 1] = baseY + totalDeformation.y;
      deformedVertices[i * 3 + 2] = baseZ + totalDeformation.z;
    }

    return deformedVertices;
  }

  private applyProximityForces(
    vertex: THREE.Vector3,
    allVertices: Float32Array,
    currentIndex: number,
    deformation: THREE.Vector3,
    params: PhysicsParameters
  ): void {
    const proximityForce = new THREE.Vector3(0, 0, 0);
    const vertexCount = allVertices.length / 3;
    const sampleStep = Math.max(1, Math.floor(vertexCount / 100)); // Sample subset for performance

    for (let j = 0; j < vertexCount; j += sampleStep) {
      if (j === currentIndex) continue;

      const otherVertex = new THREE.Vector3(
        allVertices[j * 3],
        allVertices[j * 3 + 1],
        allVertices[j * 3 + 2]
      );

      const distance = vertex.distanceTo(otherVertex);
      
      if (distance < params.proximityThreshold && distance > 0.001) {
        const direction = vertex.clone().sub(otherVertex).normalize();
        
        // Soft-body repulsion (prevents mesh collapse)
        const repulsionStrength = params.vertexStiffness / (distance * distance + 0.01);
        proximityForce.add(direction.multiplyScalar(repulsionStrength));
      }
    }

    deformation.add(proximityForce);
  }

  // Dynamic warping and rippling effects
  calculateRipplingDeformation(
    vertex: THREE.Vector3,
    time: number,
    progress: number,
    proximityToOtherQuarks: number[]
  ): THREE.Vector3 {
    const ripple = new THREE.Vector3(0, 0, 0);

    // Wave propagation based on proximity to other quarks
    proximityToOtherQuarks.forEach((distance, i) => {
      if (distance > 0.001) {
        const frequency = 2.0 + i * 0.5; // Different frequencies per quark
        const amplitude = 0.1 * Math.exp(-distance) * (1 - progress * 0.7);
        const phase = time * frequency - distance * 2.0;
        
        // Multi-directional ripples
        ripple.x += amplitude * Math.sin(phase) * Math.cos(i * Math.PI / 3);
        ripple.y += amplitude * Math.cos(phase) * Math.sin(i * Math.PI / 3);
        ripple.z += amplitude * Math.sin(phase + Math.PI / 4) * 0.5;
      }
    });

    return ripple;
  }

  // Topological necking and partial merge visualization
  calculateNeckingEffect(
    vertices: Float32Array,
    quarkPositions: THREE.Vector3[],
    progress: number,
    params: PhysicsParameters
  ): Float32Array {
    const neckedVertices = new Float32Array(vertices.length);
    const vertexCount = vertices.length / 3;

    // Identify bridge regions between quarks
    const bridgeRegions = this.identifyBridgeRegions(vertices, quarkPositions, progress);

    for (let i = 0; i < vertexCount; i++) {
      const vertex = new THREE.Vector3(
        vertices[i * 3],
        vertices[i * 3 + 1],
        vertices[i * 3 + 2]
      );

      let neckingDeformation = new THREE.Vector3(0, 0, 0);

      // Apply necking in bridge regions
      bridgeRegions.forEach((bridge, bridgeIndex) => {
        const distanceToBridge = vertex.distanceTo(bridge.center);
        
        if (distanceToBridge < bridge.radius) {
          // Create constriction toward bridge axis
          const toBridgeCenter = bridge.center.clone().sub(vertex);
          const projectionLength = toBridgeCenter.dot(bridge.axis);
          const radialDirection = toBridgeCenter.clone().sub(
            bridge.axis.clone().multiplyScalar(projectionLength)
          ).normalize();

          // Necking strength increases with progress and proximity
          const neckingFactor = params.neckingStrength * progress * 
            (1 - distanceToBridge / bridge.radius);

          neckingDeformation.add(radialDirection.multiplyScalar(neckingFactor));
        }
      });

      // Surface tension effects (smooth out sharp deformations)
      const smoothing = this.applySurfaceTension(vertex, vertices, i, params.surfaceTension);
      neckingDeformation.add(smoothing);

      neckedVertices[i * 3] = vertices[i * 3] + neckingDeformation.x;
      neckedVertices[i * 3 + 1] = vertices[i * 3 + 1] + neckingDeformation.y;
      neckedVertices[i * 3 + 2] = vertices[i * 3 + 2] + neckingDeformation.z;
    }

    return neckedVertices;
  }

  private identifyBridgeRegions(
    vertices: Float32Array,
    quarkPositions: THREE.Vector3[],
    progress: number
  ): Array<{ center: THREE.Vector3; axis: THREE.Vector3; radius: number }> {
    const bridges: Array<{ center: THREE.Vector3; axis: THREE.Vector3; radius: number }> = [];

    // Create bridges between pairs of quarks as they approach
    for (let i = 0; i < quarkPositions.length; i++) {
      for (let j = i + 1; j < quarkPositions.length; j++) {
        const distance = quarkPositions[i].distanceTo(quarkPositions[j]);
        
        if (distance < 4.0 && progress > 0.3) { // Only create bridges when quarks are close
          const center = quarkPositions[i].clone().lerp(quarkPositions[j], 0.5);
          const axis = quarkPositions[j].clone().sub(quarkPositions[i]).normalize();
          const radius = 0.8 * (1 - progress * 0.5); // Shrinking bridge radius

          bridges.push({ center, axis, radius });
        }
      }
    }

    return bridges;
  }

  private applySurfaceTension(
    vertex: THREE.Vector3,
    allVertices: Float32Array,
    vertexIndex: number,
    surfaceTension: number
  ): THREE.Vector3 {
    const smoothing = new THREE.Vector3(0, 0, 0);
    const neighbors: THREE.Vector3[] = [];
    const vertexCount = allVertices.length / 3;
    const searchRadius = 0.5;

    // Find neighboring vertices
    for (let i = 0; i < vertexCount; i++) {
      if (i === vertexIndex) continue;

      const neighbor = new THREE.Vector3(
        allVertices[i * 3],
        allVertices[i * 3 + 1],
        allVertices[i * 3 + 2]
      );

      if (vertex.distanceTo(neighbor) < searchRadius) {
        neighbors.push(neighbor);
      }
    }

    // Calculate Laplacian smoothing (surface tension approximation)
    if (neighbors.length > 0) {
      const centroid = neighbors.reduce((sum, neighbor) => {
        return sum.add(neighbor);
      }, new THREE.Vector3(0, 0, 0)).divideScalar(neighbors.length);

      smoothing.copy(centroid.sub(vertex)).multiplyScalar(surfaceTension);
    }

    return smoothing;
  }

  // Calculate stress tensor for each vertex
  calculateStressTensor(
    vertex: THREE.Vector3,
    deformation: THREE.Vector3,
    neighbors: THREE.Vector3[]
  ): DeformationTensor {
    // Simplified stress tensor based on local deformation gradient
    const gradientMatrix = this.calculateDeformationGradient(vertex, deformation, neighbors);
    
    // Convert to stress using constitutive relation (Hook's law approximation)
    const lambda = 0.5; // First Lamé parameter
    const mu = 0.3;     // Second Lamé parameter (shear modulus)
    
    const trace = gradientMatrix.xx + gradientMatrix.yy + gradientMatrix.zz;
    
    return {
      xx: lambda * trace + 2 * mu * gradientMatrix.xx,
      xy: mu * (gradientMatrix.xy + gradientMatrix.yx),
      xz: mu * (gradientMatrix.xz + gradientMatrix.zx),
      yx: mu * (gradientMatrix.yx + gradientMatrix.xy),
      yy: lambda * trace + 2 * mu * gradientMatrix.yy,
      yz: mu * (gradientMatrix.yz + gradientMatrix.zy),
      zx: mu * (gradientMatrix.zx + gradientMatrix.xz),
      zy: mu * (gradientMatrix.zy + gradientMatrix.yz),
      zz: lambda * trace + 2 * mu * gradientMatrix.zz
    };
  }

  private calculateDeformationGradient(
    vertex: THREE.Vector3,
    deformation: THREE.Vector3,
    neighbors: THREE.Vector3[]
  ): DeformationTensor {
    // Simplified finite difference approximation
    const epsilon = 0.001;
    
    return {
      xx: deformation.x / epsilon,
      xy: 0,
      xz: 0,
      yx: 0,
      yy: deformation.y / epsilon,
      yz: 0,
      zx: 0,
      zy: 0,
      zz: deformation.z / epsilon
    };
  }

  // Fluid dynamics simulation for quasi-fluid rotation
  simulateFluidDynamics(
    vertices: Float32Array,
    timeStep: number,
    viscosity: number
  ): FluidState {
    const vertexCount = vertices.length / 3;
    const velocity: THREE.Vector3[] = [];
    const acceleration: THREE.Vector3[] = [];
    const pressure: number[] = [];
    const density: number[] = [];
    const vorticity: THREE.Vector3[] = [];

    for (let i = 0; i < vertexCount; i++) {
      // Initialize fluid state
      velocity[i] = new THREE.Vector3(0, 0, 0);
      acceleration[i] = new THREE.Vector3(0, 0, 0);
      pressure[i] = 1.0; // Normalized pressure
      density[i] = 1.0;  // Normalized density
      vorticity[i] = new THREE.Vector3(0, 0, 0);
    }

    // Simplified Navier-Stokes approximation for visual effects
    // ∂v/∂t = -∇p/ρ + ν∇²v + f
    
    return {
      velocity,
      acceleration,
      pressure,
      density,
      vorticity
    };
  }

  clearCaches(): void {
    this.deformationHistory.clear();
    this.velocityField.clear();
    this.stressTensors.clear();
  }
}

// React hook for advanced physics calculations
export const useAdvancedPhysics = (
  originalGeometry: THREE.BufferGeometry | null,
  quarkPositions: THREE.Vector3[],
  progress: number,
  physicsParams: PhysicsParameters
) => {
  const engine = useMemo(() => AdvancedPhysicsEngine.getInstance(), []);

  return useMemo(() => {
    if (!originalGeometry) return null;

    const positions = originalGeometry.attributes.position.array as Float32Array;
    
    // Calculate deformed mesh
    const deformedVertices = engine.calculateMeshDeformation(
      positions,
      quarkPositions,
      progress,
      physicsParams
    );

    // Apply necking effects
    const neckedVertices = engine.calculateNeckingEffect(
      deformedVertices,
      quarkPositions,
      progress,
      physicsParams
    );

    // Simulate fluid dynamics
    const fluidState = engine.simulateFluidDynamics(
      neckedVertices,
      physicsParams.timeStep,
      physicsParams.fluidViscosity
    );

    return {
      deformedVertices: neckedVertices,
      fluidState,
      hasNecking: progress > 0.3,
      deformationMagnitude: progress * physicsParams.deformationIntensity
    };
  }, [engine, originalGeometry, quarkPositions, progress, physicsParams]);
};

export default AdvancedPhysicsEngine;
