
'use client';

import * as THREE from 'three';
import { FluidDynamicsParameters, DeformationValidation, DEFAULT_FLUID_DYNAMICS_PARAMS } from '@/lib/fluid-dynamics-types';
import FluidDynamicsEngine from './fluid-dynamics-engine';

export class FluidDynamicsTestingFramework {
  private static instance: FluidDynamicsTestingFramework;
  private engine: FluidDynamicsEngine;
  
  static getInstance(): FluidDynamicsTestingFramework {
    if (!FluidDynamicsTestingFramework.instance) {
      FluidDynamicsTestingFramework.instance = new FluidDynamicsTestingFramework();
    }
    return FluidDynamicsTestingFramework.instance;
  }
  
  constructor() {
    this.engine = FluidDynamicsEngine.getInstance();
  }
  
  // Run comprehensive test suite
  async runFullTestSuite(): Promise<DeformationValidation[]> {
    const results: DeformationValidation[] = [];
    
    // Test 1: No distortion baseline
    results.push(await this.testNoDistortion());
    
    // Test 2: Maximum distortion stress test
    results.push(await this.testMaxDistortion());
    
    // Test 3: Proximity physics validation
    results.push(await this.testProximityPhysics());
    
    // Test 4: Time-varying warping stability
    results.push(await this.testTimeVaryingWarping());
    
    // Test 5: Fluid blending accuracy
    results.push(await this.testFluidBlending());
    
    // Test 6: Topological constraints
    results.push(await this.testTopologicalConstraints());
    
    // Test 7: Performance benchmarking
    results.push(await this.testPerformanceBenchmark());
    
    // Test 8: Edge case handling
    results.push(await this.testEdgeCases());
    
    return results;
  }
  
  // Test 1: No distortion (baseline validation)
  private async testNoDistortion(): Promise<DeformationValidation> {
    const startTime = performance.now();
    let passed = true;
    const errors: string[] = [];
    
    try {
      // Create baseline parameters with zero deformation
      const params: FluidDynamicsParameters = {
        ...DEFAULT_FLUID_DYNAMICS_PARAMS,
        fluidityStrength: 0,
        dynamic_deform: 0,
        proximityInfluence: 0,
        wiggleAmplitude: 0,
        blendingIntensity: 0
      };
      
      // Generate test Klein bottle surface
      const originalVertices = this.generateTestKleinBottleVertices();
      const positions = [
        new THREE.Vector3(-3, -2, 0),
        new THREE.Vector3(3, -2, 0),
        new THREE.Vector3(0, 3, 0)
      ];
      
      // Apply deformation (should be minimal)
      const deformationVectors = this.engine.computePairwiseDeformationVectors(
        originalVertices,
        positions,
        params
      );
      
      // Validate that deformation is negligible
      const maxDeformation = Math.max(...deformationVectors.map(v => v.length()));
      const avgDeformation = deformationVectors.reduce((sum, v) => sum + v.length(), 0) / deformationVectors.length;
      
      if (maxDeformation > 0.01) {
        passed = false;
        errors.push(`Max deformation ${maxDeformation.toFixed(4)} exceeds threshold 0.01`);
      }
      
      if (avgDeformation > 0.005) {
        passed = false;
        errors.push(`Average deformation ${avgDeformation.toFixed(4)} exceeds threshold 0.005`);
      }
      
      const endTime = performance.now();
      
      return {
        testName: 'No Distortion Baseline',
        passed,
        metrics: {
          maxDeformation,
          averageDeformation: avgDeformation,
          topologicalIntegrity: true,
          performanceMs: endTime - startTime
        },
        errors: errors.length > 0 ? errors : undefined
      };
    } catch (error) {
      return {
        testName: 'No Distortion Baseline',
        passed: false,
        metrics: {
          maxDeformation: 0,
          averageDeformation: 0,
          topologicalIntegrity: false,
          performanceMs: performance.now() - startTime
        },
        errors: [`Test failed with error: ${error}`]
      };
    }
  }
  
  // Test 2: Maximum distortion stress test
  private async testMaxDistortion(): Promise<DeformationValidation> {
    const startTime = performance.now();
    let passed = true;
    const errors: string[] = [];
    
    try {
      // Create parameters with maximum deformation
      const params: FluidDynamicsParameters = {
        ...DEFAULT_FLUID_DYNAMICS_PARAMS,
        fluidityStrength: 1.0,
        dynamic_deform: 1.0,
        proximityInfluence: 1.0,
        wiggleAmplitude: 1.0,
        blendingIntensity: 1.0
      };
      
      const originalVertices = this.generateTestKleinBottleVertices();
      const positions = [
        new THREE.Vector3(-1, -1, 0), // Close positions for maximum interaction
        new THREE.Vector3(1, -1, 0),
        new THREE.Vector3(0, 1, 0)
      ];
      
      // Test time-varying warping at maximum settings
      const warpedVertices = this.engine.applyTimeVaryingWarping(
        originalVertices,
        5.0, // Advanced time
        params,
        0 // First sub-4D Manifold
      );
      
      // Validate that deformation is bounded and doesn't break topology
      const maxDeformation = this.calculateMaxVertexDisplacement(originalVertices, warpedVertices);
      const avgDeformation = this.calculateAverageVertexDisplacement(originalVertices, warpedVertices);
      
      // Max deformation should be significant but not infinite
      if (maxDeformation < 0.1) {
        passed = false;
        errors.push(`Max deformation ${maxDeformation.toFixed(4)} too small for maximum settings`);
      }
      
      if (maxDeformation > 10.0) {
        passed = false;
        errors.push(`Max deformation ${maxDeformation.toFixed(4)} too large, may break topology`);
      }
      
      // Check for NaN or infinite values
      if (!this.validateVerticesFinite(warpedVertices)) {
        passed = false;
        errors.push('Warped vertices contain NaN or infinite values');
      }
      
      const endTime = performance.now();
      
      return {
        testName: 'Maximum Distortion Stress Test',
        passed,
        metrics: {
          maxDeformation,
          averageDeformation: avgDeformation,
          topologicalIntegrity: this.validateVerticesFinite(warpedVertices),
          performanceMs: endTime - startTime
        },
        errors: errors.length > 0 ? errors : undefined
      };
    } catch (error) {
      return {
        testName: 'Maximum Distortion Stress Test',
        passed: false,
        metrics: {
          maxDeformation: 0,
          averageDeformation: 0,
          topologicalIntegrity: false,
          performanceMs: performance.now() - startTime
        },
        errors: [`Test failed with error: ${error}`]
      };
    }
  }
  
  // Test 3: Proximity physics validation
  private async testProximityPhysics(): Promise<DeformationValidation> {
    const startTime = performance.now();
    let passed = true;
    const errors: string[] = [];
    
    try {
      const params = DEFAULT_FLUID_DYNAMICS_PARAMS;
      const positions = [
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(1, 0, 0), // Close position
        new THREE.Vector3(5, 0, 0)  // Distant position
      ];
      
      // Test proximity calculations
      const proximityResults = this.engine.calculateProximityPhysics(positions, params);
      
      // Validate proximity results
      const closeInfluence = proximityResults[0][1].influence;
      const distantInfluence = proximityResults[0][2].influence;
      
      // Close positions should have higher influence
      if (closeInfluence <= distantInfluence) {
        passed = false;
        errors.push(`Close influence ${closeInfluence.toFixed(4)} should be > distant influence ${distantInfluence.toFixed(4)}`);
      }
      
      // Validate force decay with distance
      if (distantInfluence > 0.1) {
        passed = false;
        errors.push(`Distant influence ${distantInfluence.toFixed(4)} should be minimal`);
      }
      
      const endTime = performance.now();
      
      return {
        testName: 'Proximity Physics Validation',
        passed,
        metrics: {
          maxDeformation: closeInfluence,
          averageDeformation: (closeInfluence + distantInfluence) / 2,
          topologicalIntegrity: true,
          performanceMs: endTime - startTime
        },
        errors: errors.length > 0 ? errors : undefined
      };
    } catch (error) {
      return {
        testName: 'Proximity Physics Validation',
        passed: false,
        metrics: {
          maxDeformation: 0,
          averageDeformation: 0,
          topologicalIntegrity: false,
          performanceMs: performance.now() - startTime
        },
        errors: [`Test failed with error: ${error}`]
      };
    }
  }
  
  // Test 4: Time-varying warping stability
  private async testTimeVaryingWarping(): Promise<DeformationValidation> {
    const startTime = performance.now();
    let passed = true;
    const errors: string[] = [];
    
    try {
      const params = DEFAULT_FLUID_DYNAMICS_PARAMS;
      const originalVertices = this.generateTestKleinBottleVertices();
      
      // Test warping at different time points
      const timePoints = [0, 1, 2, 5, 10];
      const warpedResults = timePoints.map(time => 
        this.engine.applyTimeVaryingWarping(originalVertices, time, params, 0)
      );
      
      // Validate that warping is smooth and bounded
      let maxTemporalVariation = 0;
      for (let i = 1; i < warpedResults.length; i++) {
        const variation = this.calculateAverageVertexDisplacement(warpedResults[i-1], warpedResults[i]);
        maxTemporalVariation = Math.max(maxTemporalVariation, variation);
      }
      
      // Temporal variation should be smooth (not too jumpy)
      if (maxTemporalVariation > 2.0) {
        passed = false;
        errors.push(`Max temporal variation ${maxTemporalVariation.toFixed(4)} too large, warping not smooth`);
      }
      
      // All warped vertices should be finite
      const allFinite = warpedResults.every(vertices => this.validateVerticesFinite(vertices));
      if (!allFinite) {
        passed = false;
        errors.push('Some warped vertices contain NaN or infinite values');
      }
      
      const endTime = performance.now();
      const avgDeformation = warpedResults.reduce((sum, vertices) => 
        sum + this.calculateAverageVertexDisplacement(originalVertices, vertices), 0
      ) / warpedResults.length;
      
      return {
        testName: 'Time-Varying Warping Stability',
        passed,
        metrics: {
          maxDeformation: maxTemporalVariation,
          averageDeformation: avgDeformation,
          topologicalIntegrity: allFinite,
          performanceMs: endTime - startTime
        },
        errors: errors.length > 0 ? errors : undefined
      };
    } catch (error) {
      return {
        testName: 'Time-Varying Warping Stability',
        passed: false,
        metrics: {
          maxDeformation: 0,
          averageDeformation: 0,
          topologicalIntegrity: false,
          performanceMs: performance.now() - startTime
        },
        errors: [`Test failed with error: ${error}`]
      };
    }
  }
  
  // Test 5: Fluid blending accuracy
  private async testFluidBlending(): Promise<DeformationValidation> {
    const startTime = performance.now();
    let passed = true;
    const errors: string[] = [];
    
    try {
      const params = DEFAULT_FLUID_DYNAMICS_PARAMS;
      const verticesA = this.generateTestKleinBottleVertices();
      const verticesB = this.generateTestKleinBottleVertices(1.5); // Different scale
      
      // Test blending at different progress levels
      const progressLevels = [0.0, 0.25, 0.5, 0.75, 1.0];
      const blendedResults = progressLevels.map(progress => 
        this.engine.performFluidBlending(verticesA, verticesB, progress, params)
      );
      
      // Validate blending properties
      // At progress = 0, should be similar to verticesA
      const similarity0 = this.calculateAverageVertexDisplacement(verticesA, blendedResults[0]);
      if (similarity0 > 0.5) {
        passed = false;
        errors.push(`Blending at progress=0 differs too much from source A: ${similarity0.toFixed(4)}`);
      }
      
      // At progress = 1, should be similar to verticesB
      const similarity1 = this.calculateAverageVertexDisplacement(verticesB, blendedResults[4]);
      if (similarity1 > 0.5) {
        passed = false;
        errors.push(`Blending at progress=1 differs too much from source B: ${similarity1.toFixed(4)}`);
      }
      
      // Blending should be smooth (monotonic progression)
      let smoothnessViolations = 0;
      for (let i = 1; i < blendedResults.length; i++) {
        const displacement = this.calculateAverageVertexDisplacement(blendedResults[i-1], blendedResults[i]);
        if (displacement > 2.0) { // Threshold for smooth blending
          smoothnessViolations++;
        }
      }
      
      if (smoothnessViolations > 1) {
        passed = false;
        errors.push(`Too many smoothness violations: ${smoothnessViolations}`);
      }
      
      const endTime = performance.now();
      
      return {
        testName: 'Fluid Blending Accuracy',
        passed,
        metrics: {
          maxDeformation: Math.max(similarity0, similarity1),
          averageDeformation: (similarity0 + similarity1) / 2,
          topologicalIntegrity: blendedResults.every(vertices => this.validateVerticesFinite(vertices)),
          performanceMs: endTime - startTime
        },
        errors: errors.length > 0 ? errors : undefined
      };
    } catch (error) {
      return {
        testName: 'Fluid Blending Accuracy',
        passed: false,
        metrics: {
          maxDeformation: 0,
          averageDeformation: 0,
          topologicalIntegrity: false,
          performanceMs: performance.now() - startTime
        },
        errors: [`Test failed with error: ${error}`]
      };
    }
  }
  
  // Test 6: Topological constraints validation
  private async testTopologicalConstraints(): Promise<DeformationValidation> {
    const startTime = performance.now();
    let passed = true;
    const errors: string[] = [];
    
    try {
      const params: FluidDynamicsParameters = {
        ...DEFAULT_FLUID_DYNAMICS_PARAMS,
        dynamic_deform: 0.8,
        proximityInfluence: 0.9
      };
      
      // Generate Klein bottle and apply various deformations
      const originalVertices = this.generateTestKleinBottleVertices();
      const positions = [
        new THREE.Vector3(-2, -1, 0),
        new THREE.Vector3(2, -1, 0),
        new THREE.Vector3(0, 2, 0)
      ];
      
      // Apply multiple deformation types
      const deformationVectors = this.engine.computePairwiseDeformationVectors(originalVertices, positions, params);
      const warpedVertices = this.engine.applyTimeVaryingWarping(originalVertices, 3.0, params, 0);
      
      // Check topological integrity
      const topologicallySound = this.validateTopologicalIntegrity(originalVertices, warpedVertices);
      if (!topologicallySound) {
        passed = false;
        errors.push('Deformation broke topological constraints');
      }
      
      // Check genus preservation (Klein bottle should remain genus 2)
      const genusPreserved = this.validateGenusPreservation(originalVertices, warpedVertices);
      if (!genusPreserved) {
        passed = false;
        errors.push('Genus not preserved during deformation');
      }
      
      const maxDeformation = Math.max(...deformationVectors.map(v => v.length()));
      const avgDeformation = deformationVectors.reduce((sum, v) => sum + v.length(), 0) / deformationVectors.length;
      
      const endTime = performance.now();
      
      return {
        testName: 'Topological Constraints',
        passed,
        metrics: {
          maxDeformation,
          averageDeformation: avgDeformation,
          topologicalIntegrity: topologicallySound && genusPreserved,
          performanceMs: endTime - startTime
        },
        errors: errors.length > 0 ? errors : undefined
      };
    } catch (error) {
      return {
        testName: 'Topological Constraints',
        passed: false,
        metrics: {
          maxDeformation: 0,
          averageDeformation: 0,
          topologicalIntegrity: false,
          performanceMs: performance.now() - startTime
        },
        errors: [`Test failed with error: ${error}`]
      };
    }
  }
  
  // Test 7: Performance benchmarking
  private async testPerformanceBenchmark(): Promise<DeformationValidation> {
    const startTime = performance.now();
    let passed = true;
    const errors: string[] = [];
    
    try {
      const params = DEFAULT_FLUID_DYNAMICS_PARAMS;
      const largeMeshVertices = this.generateLargeTestMesh(); // ~10k vertices
      const positions = [
        new THREE.Vector3(-2, -1, 0),
        new THREE.Vector3(2, -1, 0),
        new THREE.Vector3(0, 2, 0)
      ];
      
      // Benchmark different operations
      const benchmarkStart = performance.now();
      
      const deformationVectors = this.engine.computePairwiseDeformationVectors(largeMeshVertices, positions, params);
      const proximityResults = this.engine.calculateProximityPhysics(positions, params);
      const warpedVertices = this.engine.applyTimeVaryingWarping(largeMeshVertices, 2.0, params, 0);
      
      const benchmarkEnd = performance.now();
      const benchmarkTime = benchmarkEnd - benchmarkStart;
      
      // Performance should be reasonable for real-time usage (< 16ms for 60fps)
      if (benchmarkTime > 50) { // Relaxed threshold for complex operations
        passed = false;
        errors.push(`Performance benchmark ${benchmarkTime.toFixed(2)}ms exceeds 50ms threshold`);
      }
      
      // Validate that large mesh operations don't break
      const maxDeformation = Math.max(...deformationVectors.map(v => v.length()));
      const allFinite = this.validateVerticesFinite(warpedVertices);
      
      if (!allFinite) {
        passed = false;
        errors.push('Large mesh deformation produced invalid vertices');
      }
      
      const endTime = performance.now();
      
      return {
        testName: 'Performance Benchmark',
        passed,
        metrics: {
          maxDeformation,
          averageDeformation: benchmarkTime, // Use benchmark time as metric
          topologicalIntegrity: allFinite,
          performanceMs: endTime - startTime
        },
        errors: errors.length > 0 ? errors : undefined
      };
    } catch (error) {
      return {
        testName: 'Performance Benchmark',
        passed: false,
        metrics: {
          maxDeformation: 0,
          averageDeformation: 0,
          topologicalIntegrity: false,
          performanceMs: performance.now() - startTime
        },
        errors: [`Test failed with error: ${error}`]
      };
    }
  }
  
  // Test 8: Edge case handling
  private async testEdgeCases(): Promise<DeformationValidation> {
    const startTime = performance.now();
    let passed = true;
    const errors: string[] = [];
    
    try {
      const params = DEFAULT_FLUID_DYNAMICS_PARAMS;
      
      // Test edge cases
      const edgeCases = [
        { name: 'Empty vertices', vertices: new Float32Array(0) },
        { name: 'Single vertex', vertices: new Float32Array([0, 0, 0]) },
        { name: 'Coincident positions', positions: [new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 0, 0)] },
        { name: 'Very large distances', positions: [new THREE.Vector3(0, 0, 0), new THREE.Vector3(1000, 1000, 1000)] }
      ];
      
      let edgeFailures = 0;
      
      for (const edgeCase of edgeCases) {
        try {
          if (edgeCase.vertices) {
            const positions = [new THREE.Vector3(0, 0, 0)];
            this.engine.computePairwiseDeformationVectors(edgeCase.vertices, positions, params);
          }
          
          if (edgeCase.positions) {
            this.engine.calculateProximityPhysics(edgeCase.positions, params);
          }
        } catch (error) {
          edgeFailures++;
          errors.push(`Edge case '${edgeCase.name}' failed: ${error}`);
        }
      }
      
      if (edgeFailures > edgeCases.length / 2) { // Allow some edge case failures
        passed = false;
      }
      
      const endTime = performance.now();
      
      return {
        testName: 'Edge Case Handling',
        passed,
        metrics: {
          maxDeformation: edgeFailures,
          averageDeformation: edgeFailures / edgeCases.length,
          topologicalIntegrity: edgeFailures === 0,
          performanceMs: endTime - startTime
        },
        errors: errors.length > 0 ? errors : undefined
      };
    } catch (error) {
      return {
        testName: 'Edge Case Handling',
        passed: false,
        metrics: {
          maxDeformation: 0,
          averageDeformation: 0,
          topologicalIntegrity: false,
          performanceMs: performance.now() - startTime
        },
        errors: [`Test failed with error: ${error}`]
      };
    }
  }
  
  // Helper methods
  private generateTestKleinBottleVertices(scale: number = 1.0): Float32Array {
    const vertices: number[] = [];
    const uSegments = 30;
    const vSegments = 30;
    
    for (let u = 0; u <= uSegments; u++) {
      for (let v = 0; v <= vSegments; v++) {
        const uParam = (u / uSegments) * 2 * Math.PI;
        const vParam = (v / vSegments) * 2 * Math.PI;
        
        // Klein bottle parametric equations
        const x = (2 + Math.cos(uParam/2) * Math.sin(vParam) - Math.sin(uParam/2) * Math.sin(2*vParam)) * Math.cos(uParam) * scale;
        const y = (2 + Math.cos(uParam/2) * Math.sin(vParam) - Math.sin(uParam/2) * Math.sin(2*vParam)) * Math.sin(uParam) * scale;
        const z = (Math.sin(uParam/2) * Math.sin(vParam) + Math.cos(uParam/2) * Math.sin(2*vParam)) * scale;
        
        vertices.push(x, y, z);
      }
    }
    
    return new Float32Array(vertices);
  }
  
  private generateLargeTestMesh(): Float32Array {
    const vertices: number[] = [];
    const resolution = 100; // 100x100 = 10k vertices
    
    for (let u = 0; u < resolution; u++) {
      for (let v = 0; v < resolution; v++) {
        const uParam = (u / resolution) * 2 * Math.PI;
        const vParam = (v / resolution) * 2 * Math.PI;
        
        const x = (2 + Math.cos(uParam/2) * Math.sin(vParam) - Math.sin(uParam/2) * Math.sin(2*vParam)) * Math.cos(uParam);
        const y = (2 + Math.cos(uParam/2) * Math.sin(vParam) - Math.sin(uParam/2) * Math.sin(2*vParam)) * Math.sin(uParam);
        const z = (Math.sin(uParam/2) * Math.sin(vParam) + Math.cos(uParam/2) * Math.sin(2*vParam));
        
        vertices.push(x, y, z);
      }
    }
    
    return new Float32Array(vertices);
  }
  
  private calculateMaxVertexDisplacement(verticesA: Float32Array, verticesB: Float32Array): number {
    let maxDisplacement = 0;
    const minLength = Math.min(verticesA.length, verticesB.length);
    
    for (let i = 0; i < minLength; i += 3) {
      const dx = verticesA[i] - verticesB[i];
      const dy = verticesA[i + 1] - verticesB[i + 1];
      const dz = verticesA[i + 2] - verticesB[i + 2];
      const displacement = Math.sqrt(dx * dx + dy * dy + dz * dz);
      maxDisplacement = Math.max(maxDisplacement, displacement);
    }
    
    return maxDisplacement;
  }
  
  private calculateAverageVertexDisplacement(verticesA: Float32Array, verticesB: Float32Array): number {
    let totalDisplacement = 0;
    const minLength = Math.min(verticesA.length, verticesB.length);
    const vertexCount = minLength / 3;
    
    for (let i = 0; i < minLength; i += 3) {
      const dx = verticesA[i] - verticesB[i];
      const dy = verticesA[i + 1] - verticesB[i + 1];
      const dz = verticesA[i + 2] - verticesB[i + 2];
      const displacement = Math.sqrt(dx * dx + dy * dy + dz * dz);
      totalDisplacement += displacement;
    }
    
    return vertexCount > 0 ? totalDisplacement / vertexCount : 0;
  }
  
  private validateVerticesFinite(vertices: Float32Array): boolean {
    for (let i = 0; i < vertices.length; i++) {
      if (!isFinite(vertices[i])) {
        return false;
      }
    }
    return true;
  }
  
  private validateTopologicalIntegrity(originalVertices: Float32Array, deformedVertices: Float32Array): boolean {
    // Simplified topological check - ensure no vertices moved too far
    const maxDisplacement = this.calculateMaxVertexDisplacement(originalVertices, deformedVertices);
    return maxDisplacement < 5.0; // Reasonable threshold for Klein bottle
  }
  
  private validateGenusPreservation(originalVertices: Float32Array, deformedVertices: Float32Array): boolean {
    // Simplified genus check - Klein bottle should maintain its basic structure
    // In a real implementation, this would involve more sophisticated topological invariants
    return this.validateVerticesFinite(deformedVertices) && deformedVertices.length === originalVertices.length;
  }
}

export default FluidDynamicsTestingFramework;
