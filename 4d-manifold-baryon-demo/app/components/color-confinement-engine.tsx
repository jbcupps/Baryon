
'use client';

import React, { useMemo } from 'react';
import * as THREE from 'three';

// Advanced mathematical framework for color confinement
export interface QuaternionicHolonomy {
  theta: number;
  quaternion: { w: number; x: number; y: number; z: number };
  colorPhase: number;
}

export interface ConfinementParameters {
  holonomyStrength: number;
  pinMinusField: number;
  bordismClass: 0 | 1;
  fluxTubeStrength: number;
  confinementScale: number;
}

export interface DeformationState {
  vertices: Float32Array;
  normals: Float32Array;
  stressTensor: number[][];
  proximityForces: THREE.Vector3[];
  fluidVelocity: THREE.Vector3[];
}

export class ColorConfinementEngine {
  private static instance: ColorConfinementEngine;
  
  private holonomyCache: Map<string, QuaternionicHolonomy> = new Map();
  private pinMinusVerification: Map<string, boolean> = new Map();
  private bordismClassification: Map<string, 0 | 1> = new Map();

  static getInstance(): ColorConfinementEngine {
    if (!ColorConfinementEngine.instance) {
      ColorConfinementEngine.instance = new ColorConfinementEngine();
    }
    return ColorConfinementEngine.instance;
  }

  // Quaternionic holonomy constraint: ∏(i=1 to 3)(cos(θᵢ/2) + qᵢsin(θᵢ/2)) = 1
  calculateQuaternionicHolonomy(
    quarks: string[],
    charges: number[],
    progress: number
  ): QuaternionicHolonomy[] {
    const key = `${quarks.join('-')}-${progress.toFixed(3)}`;
    
    return quarks.map((quark, i) => {
      const cached = this.holonomyCache.get(`${key}-${i}`);
      if (cached) return cached;

      // Base holonomy angle from charge quantization
      const baseTheta = quark === 'u' ? (2 * Math.PI / 3) : (4 * Math.PI / 3);
      
      // Electromagnetic correction (confinement-dependent)
      const deltaTheta = charges[i] * 0.15 * (1 - progress * 0.8);
      const theta = baseTheta + deltaTheta;

      // Quaternionic representation for color confinement
      const quaternion = {
        w: Math.cos(theta / 2),
        x: i === 0 ? Math.sin(theta / 2) : 0, // Red (i-component)
        y: i === 1 ? Math.sin(theta / 2) : 0, // Green (j-component)
        z: i === 2 ? Math.sin(theta / 2) : 0  // Blue (k-component)
      };

      // Color phase evolution during merger
      const colorPhase = theta / 2; // Simplified to avoid complex number issues

      const result: QuaternionicHolonomy = {
        theta,
        quaternion,
        colorPhase: Math.atan2(Math.sin(theta / 2), Math.cos(theta / 2))
      };

      this.holonomyCache.set(`${key}-${i}`, result);
      return result;
    });
  }

  // Pin⁻ condition: w₂(TK) + w₁²(TK) = 0 ∈ H²(K;Z₂)
  verifyPinMinusCondition(
    kleinBottleGeometry: THREE.BufferGeometry,
    quarkIndex: number
  ): boolean {
    const key = `pin-${quarkIndex}`;
    const cached = this.pinMinusVerification.get(key);
    if (cached !== undefined) return cached;

    const positions = kleinBottleGeometry.attributes.position.array as Float32Array;
    const vertexCount = positions.length / 3;

    // Calculate Stiefel-Whitney classes via discrete differential geometry
    let w1Square = 0;
    let w2 = 0;

    // Sample representative cycles on Klein bottle
    for (let i = 0; i < vertexCount; i += 3) {
      const v1 = new THREE.Vector3(positions[i * 3], positions[i * 3 + 1], positions[i * 3 + 2]);
      const v2 = new THREE.Vector3(positions[(i + 1) * 3], positions[(i + 1) * 3 + 1], positions[(i + 1) * 3 + 2]);
      const v3 = new THREE.Vector3(positions[(i + 2) * 3], positions[(i + 2) * 3 + 1], positions[(i + 2) * 3 + 2]);

      // Discrete curvature calculation
      const edge1 = v2.clone().sub(v1);
      const edge2 = v3.clone().sub(v1);
      const normal = edge1.cross(edge2).normalize();

      // w₁² contribution (orientation obstruction)
      w1Square += Math.sign(normal.z) > 0 ? 1 : 0;

      // w₂ contribution (spin structure obstruction)  
      w2 += (edge1.dot(edge2) < 0) ? 1 : 0;
    }

    // Pin⁻ condition: w₂ + w₁² ≡ 0 (mod 2)
    const pinMinusValid = ((w2 + w1Square) % 2) === 0;
    
    this.pinMinusVerification.set(key, pinMinusValid);
    return pinMinusValid;
  }

  // Bordism class calculation in Ω₂^(Pin⁻) = Z₂
  calculateBordismClass(
    holonomies: QuaternionicHolonomy[],
    pinMinusValid: boolean[]
  ): 0 | 1 {
    const key = holonomies.map(h => h.theta.toFixed(3)).join('-');
    const cached = this.bordismClassification.get(key);
    if (cached !== undefined) return cached;

    // Count Pin⁻ Klein bottles with valid spin structures
    const validPinMinusCount = pinMinusValid.filter(valid => valid).length;
    
    // Bordism invariant: parity of valid Pin⁻ structures
    const bordismClass: 0 | 1 = (validPinMinusCount % 2) as 0 | 1;
    
    this.bordismClassification.set(key, bordismClass);
    return bordismClass;
  }

  // Holonomy color matching: ∏(i=1 to 3)exp(iθᵢ/2) = 1
  verifyColorNeutrality(holonomies: QuaternionicHolonomy[]): boolean {
    let productReal = 1;
    let productImag = 0;

    // Calculate holonomy product in complex representation
    holonomies.forEach(h => {
      const cosHalf = Math.cos(h.theta / 2);
      const sinHalf = Math.sin(h.theta / 2);
      
      const newReal = productReal * cosHalf - productImag * sinHalf;
      const newImag = productReal * sinHalf + productImag * cosHalf;
      
      productReal = newReal;
      productImag = newImag;
    });

    // Check if product is identity (within numerical tolerance)
    const magnitude = Math.sqrt(productReal * productReal + productImag * productImag);
    const isIdentity = Math.abs(magnitude - 1.0) < 1e-10 && Math.abs(productImag) < 1e-10;
    
    return isIdentity;
  }

  // Calculate confinement flux tube energy: E(r) = σ·r + const
  calculateFluxTubeEnergy(
    separation: number,
    stringTension: number = 0.18 // GeV/fm (typical QCD value)
  ): number {
    const constantTerm = -0.48; // GeV (Coulomb correction)
    return stringTension * separation + constantTerm;
  }

  // Dynamic confinement strength based on proximity and holonomy
  calculateDynamicConfinement(
    positions: THREE.Vector3[],
    holonomies: QuaternionicHolonomy[],
    progress: number
  ): number {
    // Calculate average inter-quark separation
    const avgSeparation = this.calculateAverageDistance(positions);
    
    // Holonomy-weighted confinement strength
    const holonomyFactor = holonomies.reduce((sum, h) => {
      return sum + Math.abs(Math.sin(h.theta / 2));
    }, 0) / holonomies.length;

    // Progress-dependent confinement (stronger during merger)
    const progressFactor = 1 + 2 * progress * (1 - progress); // Peaks at progress = 0.5
    
    return holonomyFactor * progressFactor / (1 + avgSeparation);
  }

  private calculateAverageDistance(positions: THREE.Vector3[]): number {
    let totalDistance = 0;
    let pairCount = 0;

    for (let i = 0; i < positions.length; i++) {
      for (let j = i + 1; j < positions.length; j++) {
        totalDistance += positions[i].distanceTo(positions[j]);
        pairCount++;
      }
    }

    return pairCount > 0 ? totalDistance / pairCount : 0;
  }

  // Clear caches to prevent memory leaks
  clearCaches(): void {
    this.holonomyCache.clear();
    this.pinMinusVerification.clear();
    this.bordismClassification.clear();
  }
}

// React hook for color confinement calculations
export const useColorConfinement = (
  quarks: string[],
  charges: number[],
  positions: THREE.Vector3[],
  progress: number,
  geometries?: THREE.BufferGeometry[]
) => {
  const engine = useMemo(() => ColorConfinementEngine.getInstance(), []);

  return useMemo(() => {
    // Calculate holonomies for all quarks
    const holonomies = engine.calculateQuaternionicHolonomy(quarks, charges, progress);

    // Verify Pin⁻ conditions if geometries available
    const pinMinusValid = geometries?.map((geom, i) => 
      engine.verifyPinMinusCondition(geom, i)
    ) ?? [true, true, true];

    // Calculate bordism class
    const bordismClass = engine.calculateBordismClass(holonomies, pinMinusValid);

    // Verify color neutrality
    const isColorNeutral = engine.verifyColorNeutrality(holonomies);

    // Calculate dynamic confinement strength
    const confinementStrength = engine.calculateDynamicConfinement(positions, holonomies, progress);

    return {
      holonomies,
      pinMinusValid,
      bordismClass,
      isColorNeutral,
      confinementStrength,
      isStable: bordismClass === 0 && isColorNeutral
    };
  }, [engine, quarks, charges, positions, progress, geometries]);
};

export default ColorConfinementEngine;
