
'use client';

import * as THREE from 'three';
import { 
  FluidDynamicsParameters, 
  FluidDeformationState, 
  ProximityResult, 
  KleinBottleSurfaceParams,
  MergerBlendingState,
  PerlinNoiseGenerator 
} from '@/lib/fluid-dynamics-types';

// Simplified Perlin noise implementation
class SimplePerlinNoise implements PerlinNoiseGenerator {
  private permutation: number[];
  
  constructor() {
    this.permutation = [];
    for (let i = 0; i < 256; i++) {
      this.permutation[i] = i;
    }
    
    // Shuffle using Fisher-Yates
    for (let i = 255; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.permutation[i], this.permutation[j]] = [this.permutation[j], this.permutation[i]];
    }
    
    // Extend to avoid wrapping
    for (let i = 0; i < 256; i++) {
      this.permutation[256 + i] = this.permutation[i];
    }
  }
  
  private fade(t: number): number {
    return t * t * t * (t * (t * 6 - 15) + 10);
  }
  
  private lerp(a: number, b: number, t: number): number {
    return a + t * (b - a);
  }
  
  private grad(hash: number, x: number, y: number, z: number): number {
    const h = hash & 15;
    const u = h < 8 ? x : y;
    const v = h < 4 ? y : h === 12 || h === 14 ? x : z;
    return ((h & 1) === 0 ? u : -u) + ((h & 2) === 0 ? v : -v);
  }
  
  noise3D(x: number, y: number, z: number): number {
    const X = Math.floor(x) & 255;
    const Y = Math.floor(y) & 255;
    const Z = Math.floor(z) & 255;
    
    x -= Math.floor(x);
    y -= Math.floor(y);
    z -= Math.floor(z);
    
    const u = this.fade(x);
    const v = this.fade(y);
    const w = this.fade(z);
    
    const A = this.permutation[X] + Y;
    const AA = this.permutation[A] + Z;
    const AB = this.permutation[A + 1] + Z;
    const B = this.permutation[X + 1] + Y;
    const BA = this.permutation[B] + Z;
    const BB = this.permutation[B + 1] + Z;
    
    return this.lerp(
      this.lerp(
        this.lerp(
          this.grad(this.permutation[AA], x, y, z),
          this.grad(this.permutation[BA], x - 1, y, z),
          u
        ),
        this.lerp(
          this.grad(this.permutation[AB], x, y - 1, z),
          this.grad(this.permutation[BB], x - 1, y - 1, z),
          u
        ),
        v
      ),
      this.lerp(
        this.lerp(
          this.grad(this.permutation[AA + 1], x, y, z - 1),
          this.grad(this.permutation[BA + 1], x - 1, y, z - 1),
          u
        ),
        this.lerp(
          this.grad(this.permutation[AB + 1], x, y - 1, z - 1),
          this.grad(this.permutation[BB + 1], x - 1, y - 1, z - 1),
          u
        ),
        v
      ),
      w
    );
  }
  
  noise2D(x: number, y: number): number {
    return this.noise3D(x, y, 0);
  }
}

export class FluidDynamicsEngine {
  private static instance: FluidDynamicsEngine;
  private perlinNoise: PerlinNoiseGenerator;
  private deformationStates: Map<string, FluidDeformationState> = new Map();
  private mergerStates: Map<string, MergerBlendingState> = new Map();
  
  static getInstance(): FluidDynamicsEngine {
    if (!FluidDynamicsEngine.instance) {
      FluidDynamicsEngine.instance = new FluidDynamicsEngine();
    }
    return FluidDynamicsEngine.instance;
  }
  
  constructor() {
    this.perlinNoise = new SimplePerlinNoise();
  }
  
  // Enhanced Klein bottle surface generation with fluid dynamics
  generateFluidKleinBottleSurface(params: KleinBottleSurfaceParams): THREE.Vector3 {
    const { u, v, scale, offset, rotationAngle = 0 } = params;
    const { dynamic_deform, interaction_vecs, tension_scalar, time, noiseOffset, wigglePhase } = params;
    
    // Base Klein bottle geometry
    let x = (2 + Math.cos(u/2) * Math.sin(v) - Math.sin(u/2) * Math.sin(2*v)) * Math.cos(u) * scale;
    let y = (2 + Math.cos(u/2) * Math.sin(v) - Math.sin(u/2) * Math.sin(2*v)) * Math.sin(u) * scale;
    let z = (Math.sin(u/2) * Math.sin(v) + Math.cos(u/2) * Math.sin(2*v)) * scale;
    
    // Apply base rotation
    if (rotationAngle !== 0) {
      const cosRot = Math.cos(rotationAngle);
      const sinRot = Math.sin(rotationAngle);
      const newX = x * cosRot - y * sinRot;
      const newY = x * sinRot + y * cosRot;
      x = newX;
      y = newY;
    }
    
    const position = new THREE.Vector3(x, y, z);
    
    // Apply dynamic deformation with sinusoidal distortions
    if (dynamic_deform > 0) {
      const sineDistortion = new THREE.Vector3(
        Math.sin(u * 3 + time * 2) * dynamic_deform * 0.3,
        Math.cos(v * 2 + time * 1.5) * dynamic_deform * 0.3,
        Math.sin(u + v + time) * dynamic_deform * 0.2
      );
      position.add(sineDistortion);
    }
    
    // Apply interaction vector influences (proximity-based deformation)
    interaction_vecs.forEach((vec, index) => {
      if (vec && vec.length() > 0) {
        const influence = Math.exp(-position.distanceTo(vec) * 0.5) * dynamic_deform;
        const direction = vec.clone().sub(position).normalize();
        position.add(direction.multiplyScalar(influence * 0.2));
      }
    });
    
    // Local bulging/necking at closest approach points
    const bulgingFactor = this.calculateLocalBulging(position, interaction_vecs, dynamic_deform);
    position.multiplyScalar(1 + bulgingFactor);
    
    // Surface tension effects (smoothing)
    if (tension_scalar > 0) {
      const tensionSmoothing = new THREE.Vector3(
        Math.sin(u) * tension_scalar * 0.1,
        Math.cos(v) * tension_scalar * 0.1,
        0
      );
      position.add(tensionSmoothing);
    }
    
    // Time-varying warping with Perlin noise
    const noiseValue = this.perlinNoise.noise3D(
      (position.x + noiseOffset.x) * 0.5,
      (position.y + noiseOffset.y) * 0.5,
      (position.z + noiseOffset.z) * 0.5 + time * 0.3
    );
    
    const noiseDeformation = new THREE.Vector3(
      noiseValue * dynamic_deform * 0.4,
      this.perlinNoise.noise3D(position.x * 0.3, position.y * 0.3, time * 0.5) * dynamic_deform * 0.3,
      this.perlinNoise.noise3D(position.z * 0.4, time * 0.4, position.x * 0.2) * dynamic_deform * 0.2
    );
    position.add(noiseDeformation);
    
    // Independent wiggle for each sub-SKB
    const wiggleDeformation = new THREE.Vector3(
      Math.sin(wigglePhase + time * 3) * dynamic_deform * 0.2,
      Math.cos(wigglePhase * 1.3 + time * 2.5) * dynamic_deform * 0.2,
      Math.sin(wigglePhase * 0.7 + time * 1.8) * dynamic_deform * 0.15
    );
    position.add(wiggleDeformation);
    
    // Apply final offset
    position.add(offset);
    
    return position;
  }
  
  // Proximity-based physics engine
  calculateProximityPhysics(
    positions: THREE.Vector3[],
    params: FluidDynamicsParameters
  ): ProximityResult[][] {
    const results: ProximityResult[][] = [];
    
    for (let i = 0; i < positions.length; i++) {
      results[i] = [];
      
      for (let j = 0; j < positions.length; j++) {
        if (i === j) continue;
        
        const distance = positions[i].distanceTo(positions[j]);
        const direction = positions[j].clone().sub(positions[i]).normalize();
        
        let influence = 0;
        if (distance < params.proximityThreshold) {
          influence = (1 - distance / params.proximityThreshold) * params.proximityInfluence;
          influence *= Math.pow(params.forceDecayRate, distance);
        }
        
        const forceVector = direction.clone().multiplyScalar(influence);
        
        results[i][j] = {
          distance,
          direction,
          influence,
          forceVector
        };
      }
    }
    
    return results;
  }
  
  // Compute pairwise distances and translate to deformation vectors
  computePairwiseDeformationVectors(
    vertices: Float32Array,
    quarkPositions: THREE.Vector3[],
    params: FluidDynamicsParameters
  ): THREE.Vector3[] {
    const vertexCount = vertices.length / 3;
    const deformationVectors: THREE.Vector3[] = [];
    
    for (let i = 0; i < vertexCount; i++) {
      const vertex = new THREE.Vector3(
        vertices[i * 3],
        vertices[i * 3 + 1],
        vertices[i * 3 + 2]
      );
      
      let totalDeformation = new THREE.Vector3(0, 0, 0);
      
      // Calculate influence from each quark position
      quarkPositions.forEach((quarkPos, quarkIndex) => {
        const distance = vertex.distanceTo(quarkPos);
        
        if (distance < params.proximityThreshold && distance > 0.001) {
          const direction = quarkPos.clone().sub(vertex);
          const influence = params.proximityInfluence * 
            Math.exp(-distance / params.proximityThreshold) *
            Math.pow(params.forceDecayRate, distance);
          
          // Different force types based on quark index
          let forceMagnitude = influence;
          switch (quarkIndex % 3) {
            case 0: // Attractive
              forceMagnitude *= -0.8;
              break;
            case 1: // Repulsive
              forceMagnitude *= 0.6;
              break;
            case 2: // Vortex
              const tangent = new THREE.Vector3(-direction.y, direction.x, 0).normalize();
              totalDeformation.add(tangent.multiplyScalar(influence * 0.3));
              forceMagnitude *= -0.4;
              break;
          }
          
          direction.normalize().multiplyScalar(forceMagnitude);
          totalDeformation.add(direction);
        }
      });
      
      // Apply viscosity damping
      totalDeformation.multiplyScalar(params.viscosityFactor);
      
      deformationVectors[i] = totalDeformation;
    }
    
    return deformationVectors;
  }
  
  // Time-varying warping system with Perlin noise
  applyTimeVaryingWarping(
    vertices: Float32Array,
    time: number,
    params: FluidDynamicsParameters,
    subSKBIndex: number
  ): Float32Array {
    const warpedVertices = new Float32Array(vertices.length);
    const vertexCount = vertices.length / 3;
    
    // Independent noise offset for each sub-SKB
    const noiseOffset = new THREE.Vector3(
      subSKBIndex * 100,
      subSKBIndex * 200,
      subSKBIndex * 300
    );
    
    for (let i = 0; i < vertexCount; i++) {
      const vertex = new THREE.Vector3(
        vertices[i * 3],
        vertices[i * 3 + 1],
        vertices[i * 3 + 2]
      );
      
      // Perlin noise warping
      const noiseX = this.perlinNoise.noise3D(
        (vertex.x + noiseOffset.x) * params.perlinNoiseScale,
        (vertex.y + noiseOffset.y) * params.perlinNoiseScale,
        time * params.perlinTimeSpeed
      );
      
      const noiseY = this.perlinNoise.noise3D(
        (vertex.y + noiseOffset.y) * params.perlinNoiseScale,
        (vertex.z + noiseOffset.z) * params.perlinNoiseScale,
        time * params.perlinTimeSpeed + 100
      );
      
      const noiseZ = this.perlinNoise.noise3D(
        (vertex.z + noiseOffset.z) * params.perlinNoiseScale,
        (vertex.x + noiseOffset.x) * params.perlinNoiseScale,
        time * params.perlinTimeSpeed + 200
      );
      
      // Independent wiggle for each sub-SKB
      const wigglePhase = subSKBIndex * Math.PI / 3;
      const wiggleX = Math.sin(time * params.wiggleFrequency + wigglePhase) * params.wiggleAmplitude;
      const wiggleY = Math.cos(time * params.wiggleFrequency * 1.3 + wigglePhase) * params.wiggleAmplitude;
      const wiggleZ = Math.sin(time * params.wiggleFrequency * 0.7 + wigglePhase) * params.wiggleAmplitude * 0.5;
      
      // Apply warping
      warpedVertices[i * 3] = vertex.x + (noiseX + wiggleX) * params.dynamic_deform;
      warpedVertices[i * 3 + 1] = vertex.y + (noiseY + wiggleY) * params.dynamic_deform;
      warpedVertices[i * 3 + 2] = vertex.z + (noiseZ + wiggleZ) * params.dynamic_deform;
    }
    
    return warpedVertices;
  }
  
  // Fluid blending during merger with vertex interpolation
  performFluidBlending(
    verticesA: Float32Array,
    verticesB: Float32Array,
    mergerProgress: number,
    params: FluidDynamicsParameters
  ): Float32Array {
    const blendedVertices = new Float32Array(Math.max(verticesA.length, verticesB.length));
    const vertexCountA = verticesA.length / 3;
    const vertexCountB = verticesB.length / 3;
    const maxVertexCount = Math.max(vertexCountA, vertexCountB);
    
    // Calculate blending factor based on merger progress
    const blendFactor = this.calculateBlendingFactor(mergerProgress, params);
    
    for (let i = 0; i < maxVertexCount; i++) {
      let vertexA = new THREE.Vector3(0, 0, 0);
      let vertexB = new THREE.Vector3(0, 0, 0);
      
      // Get vertex A (or interpolate if fewer vertices)
      if (i < vertexCountA) {
        vertexA.set(verticesA[i * 3], verticesA[i * 3 + 1], verticesA[i * 3 + 2]);
      } else {
        // Interpolate from existing vertices
        const ratio = i / maxVertexCount;
        const sourceIndex = Math.floor(ratio * vertexCountA);
        vertexA.set(
          verticesA[sourceIndex * 3] || 0,
          verticesA[sourceIndex * 3 + 1] || 0,
          verticesA[sourceIndex * 3 + 2] || 0
        );
      }
      
      // Get vertex B (or interpolate if fewer vertices)
      if (i < vertexCountB) {
        vertexB.set(verticesB[i * 3], verticesB[i * 3 + 1], verticesB[i * 3 + 2]);
      } else {
        // Interpolate from existing vertices
        const ratio = i / maxVertexCount;
        const sourceIndex = Math.floor(ratio * vertexCountB);
        vertexB.set(
          verticesB[sourceIndex * 3] || 0,
          verticesB[sourceIndex * 3 + 1] || 0,
          verticesB[sourceIndex * 3 + 2] || 0
        );
      }
      
      // Smooth interpolation with easing
      const easedBlendFactor = this.easeInOutCubic(blendFactor);
      const blendedVertex = vertexA.lerp(vertexB, easedBlendFactor * params.blendingIntensity);
      
      // Apply smoothing iterations
      for (let iter = 0; iter < params.smoothingIterations; iter++) {
        blendedVertex.lerp(vertexA.clone().add(vertexB).multiplyScalar(0.5), 0.1);
      }
      
      blendedVertices[i * 3] = blendedVertex.x;
      blendedVertices[i * 3 + 1] = blendedVertex.y;
      blendedVertices[i * 3 + 2] = blendedVertex.z;
    }
    
    return blendedVertices;
  }
  
  // Helper methods
  private calculateLocalBulging(
    position: THREE.Vector3,
    interactionVecs: THREE.Vector3[],
    intensity: number
  ): number {
    let bulgingFactor = 0;
    
    interactionVecs.forEach((vec) => {
      if (vec && vec.length() > 0) {
        const distance = position.distanceTo(vec);
        const closenessInfluence = Math.exp(-distance * 2) * intensity;
        
        // Create local bulging effect
        bulgingFactor += closenessInfluence * 0.15;
      }
    });
    
    return Math.min(bulgingFactor, intensity * 0.3); // Cap the bulging
  }
  
  private calculateBlendingFactor(progress: number, params: FluidDynamicsParameters): number {
    // S-curve for smooth blending transition
    const normalizedProgress = Math.max(0, Math.min(1, progress));
    return normalizedProgress * normalizedProgress * (3 - 2 * normalizedProgress);
  }
  
  private easeInOutCubic(t: number): number {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }
  
  // Cleanup method
  clearCaches(): void {
    this.deformationStates.clear();
    this.mergerStates.clear();
  }
}

export default FluidDynamicsEngine;
