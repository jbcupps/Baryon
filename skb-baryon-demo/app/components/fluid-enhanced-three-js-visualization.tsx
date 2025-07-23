
'use client';

import React, { useEffect, useRef, useState, useMemo } from 'react';
import * as THREE from 'three';
import { useColorConfinement } from './color-confinement-engine';
import { useAdvancedPhysics, PhysicsParameters } from './advanced-physics-engine';
import { ConfinementParameters } from './color-confinement-engine';
import FluidDynamicsEngine from './fluid-dynamics-engine';
import { 
  FluidDynamicsParameters, 
  KleinBottleSurfaceParams,
  FluidDeformationState 
} from '@/lib/fluid-dynamics-types';

interface FluidEnhancedThreeJSVisualizationProps {
  selectedPreset: string;
  isPlaying: boolean;
  progress: number;
  onProgressChange: (progress: number) => void;
  showFlux: boolean;
  showRotation: boolean;
  
  // Advanced physics controls
  physicsParams: PhysicsParameters;
  confinementParams: ConfinementParameters;
  
  // Fluid dynamics controls (new)
  fluidDynamicsParams: FluidDynamicsParameters;
  
  // Visualization toggles
  showDeformation: boolean;
  showStressTensor: boolean;
  showFluidFlow: boolean;
  showNecking: boolean;
  showFluidDynamics: boolean;
  
  // Callbacks for real-time data
  onConfinementUpdate?: (data: any) => void;
  onPhysicsUpdate?: (data: any) => void;
  onFluidDynamicsUpdate?: (data: any) => void;
}

const FluidEnhancedThreeJSVisualization: React.FC<FluidEnhancedThreeJSVisualizationProps> = ({
  selectedPreset,
  isPlaying,
  progress,
  onProgressChange,
  showFlux,
  showRotation,
  physicsParams,
  confinementParams,
  fluidDynamicsParams,
  showDeformation,
  showStressTensor,
  showFluidFlow,
  showNecking,
  showFluidDynamics,
  onConfinementUpdate,
  onPhysicsUpdate,
  onFluidDynamicsUpdate
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene>();
  const rendererRef = useRef<THREE.WebGLRenderer>();
  const cameraRef = useRef<THREE.PerspectiveCamera>();
  const frameRef = useRef<number>(0);
  const animationIdRef = useRef<number>();
  const timeRef = useRef<number>(0);
  
  // Refs for different visualization groups
  const kleinBottleGroupRef = useRef<THREE.Group>();
  const fluxGroupRef = useRef<THREE.Group>();
  const deformationGroupRef = useRef<THREE.Group>();
  const stressTensorGroupRef = useRef<THREE.Group>();
  const fluidFlowGroupRef = useRef<THREE.Group>();
  const neckingGroupRef = useRef<THREE.Group>();
  const fluidDynamicsGroupRef = useRef<THREE.Group>(); // New group for fluid dynamics visualization
  
  // Store original and deformed geometries
  const originalGeometriesRef = useRef<THREE.BufferGeometry[]>([]);
  const deformedGeometriesRef = useRef<THREE.BufferGeometry[]>([]);
  
  // Fluid dynamics engine instance
  const fluidEngine = useMemo(() => FluidDynamicsEngine.getInstance(), []);
  
  // Enhanced preset configurations
  const presets = {
    proton: {
      name: 'Proton',
      quark_content: ['u', 'u', 'd'],
      colors: ['#FF0000', '#00FF00', '#0000FF'],
      qcd_colors: ['red', 'green', 'blue'],
      charges: [2/3, 2/3, -1/3],
      masses: [2.3, 2.3, 4.8],
      ctc_scales: [2.09, 2.09, 1.0],
      num_arrows: [7, 7, 3],
      flux_lengths: [0.33, 0.33, 0.17],
      rotation_mass_ratios: [1.0, 1.0, 2.09],
      base_rotation_speed: 0.1
    },
    neutron: {
      name: 'Neutron',
      quark_content: ['u', 'd', 'd'],
      colors: ['#FF0000', '#00FF00', '#0000FF'],
      qcd_colors: ['red', 'green', 'blue'],
      charges: [2/3, -1/3, -1/3],
      masses: [2.3, 4.8, 4.8],
      ctc_scales: [2.09, 1.0, 1.0],
      num_arrows: [7, 3, 3],
      flux_lengths: [0.33, 0.17, 0.17],
      rotation_mass_ratios: [1.0, 2.09, 2.09],
      base_rotation_speed: 0.1
    }
  };

  const currentPreset = presets[selectedPreset as keyof typeof presets];

  // Calculate current positions for physics calculations
  const currentPositions = useMemo(() => {
    const initialPositions = [
      new THREE.Vector3(-3, -2, 0),
      new THREE.Vector3(3, -2, 0),
      new THREE.Vector3(0, 3, 0)
    ];
    const finalPosition = new THREE.Vector3(0, 0, 0);
    
    return initialPositions.map(pos => pos.clone().lerp(finalPosition, progress));
  }, [progress]);

  // Calculate interaction vectors for fluid dynamics
  const interactionVectors = useMemo(() => {
    const vectors: THREE.Vector3[] = [];
    
    // Create interaction vectors between each pair of quarks
    for (let i = 0; i < currentPositions.length; i++) {
      for (let j = i + 1; j < currentPositions.length; j++) {
        const midPoint = currentPositions[i].clone().lerp(currentPositions[j], 0.5);
        const direction = currentPositions[j].clone().sub(currentPositions[i]).normalize();
        const distance = currentPositions[i].distanceTo(currentPositions[j]);
        
        // Scale interaction strength based on proximity and progress
        const interactionStrength = (1 - distance / 8) * progress * fluidDynamicsParams.proximityInfluence;
        const interactionVec = midPoint.clone().add(direction.multiplyScalar(interactionStrength));
        
        vectors.push(interactionVec);
      }
    }
    
    return vectors;
  }, [currentPositions, progress, fluidDynamicsParams.proximityInfluence]);

  // Use color confinement calculations
  const confinementData = useColorConfinement(
    currentPreset.quark_content,
    currentPreset.charges,
    currentPositions,
    progress,
    deformedGeometriesRef.current
  );

  // Use advanced physics calculations
  const physicsData = useAdvancedPhysics(
    originalGeometriesRef.current[0] || null,
    currentPositions,
    progress,
    physicsParams
  );

  // Update parent components with real-time data (with debouncing)
  useEffect(() => {
    if (onConfinementUpdate && confinementData && typeof confinementData.confinementStrength === 'number') {
      const timeoutId = setTimeout(() => {
        onConfinementUpdate(confinementData);
      }, 100);
      return () => clearTimeout(timeoutId);
    }
  }, [confinementData?.confinementStrength, confinementData?.isColorNeutral, onConfinementUpdate]);

  useEffect(() => {
    if (onPhysicsUpdate && physicsData && typeof physicsData.deformationMagnitude === 'number') {
      const timeoutId = setTimeout(() => {
        onPhysicsUpdate(physicsData);
      }, 100);
      return () => clearTimeout(timeoutId);
    }
  }, [physicsData?.deformationMagnitude, physicsData?.hasNecking, onPhysicsUpdate]);

  // Enhanced Klein bottle parametric function with fluid dynamics
  const generateFluidKleinBottleSurface = (
    u: number, 
    v: number, 
    scale: number, 
    offset: THREE.Vector3, 
    rotationAngle: number = 0,
    subSKBIndex: number = 0
  ): THREE.Vector3 => {
    if (!showFluidDynamics) {
      // Fall back to basic Klein bottle generation
      let x = (2 + Math.cos(u/2) * Math.sin(v) - Math.sin(u/2) * Math.sin(2*v)) * Math.cos(u) * scale;
      let y = (2 + Math.cos(u/2) * Math.sin(v) - Math.sin(u/2) * Math.sin(2*v)) * Math.sin(u) * scale;
      let z = (Math.sin(u/2) * Math.sin(v) + Math.cos(u/2) * Math.sin(2*v)) * scale;
      
      if (rotationAngle !== 0 && showRotation) {
        const cosRot = Math.cos(rotationAngle);
        const sinRot = Math.sin(rotationAngle);
        const newX = x * cosRot - y * sinRot;
        const newY = x * sinRot + y * cosRot;
        x = newX;
        y = newY;
      }
      
      return new THREE.Vector3(x + offset.x, y + offset.y, z + offset.z);
    }

    // Enhanced fluid dynamics surface generation
    const surfaceParams: KleinBottleSurfaceParams = {
      u,
      v,
      scale,
      offset,
      rotationAngle,
      dynamic_deform: fluidDynamicsParams.dynamic_deform * fluidDynamicsParams.fluidityStrength,
      interaction_vecs: interactionVectors,
      tension_scalar: fluidDynamicsParams.tension_scalar,
      time: timeRef.current,
      noiseOffset: new THREE.Vector3(subSKBIndex * 100, subSKBIndex * 200, subSKBIndex * 50),
      wigglePhase: subSKBIndex * Math.PI / 3
    };

    return fluidEngine.generateFluidKleinBottleSurface(surfaceParams);
  };

  // Initialize Three.js scene
  useEffect(() => {
    if (!mountRef.current) return;

    const mount = mountRef.current;
    const width = mount.clientWidth;
    const height = mount.clientHeight;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#f8f9fa');
    sceneRef.current = scene;

    // Camera setup with enhanced controls
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.set(0, 0, 10);
    cameraRef.current = camera;

    // Enhanced renderer setup
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true, 
      alpha: true,
      powerPreference: "high-performance"
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    rendererRef.current = renderer;

    // Enhanced lighting setup
    const ambientLight = new THREE.AmbientLight('#ffffff', 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight('#ffffff', 0.8);
    directionalLight.position.set(5, 5, 5);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    scene.add(directionalLight);

    // Add colored point lights for better visualization
    const pointLight1 = new THREE.PointLight('#ff4444', 0.5, 20);
    pointLight1.position.set(-5, 3, 2);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight('#4444ff', 0.5, 20);
    pointLight2.position.set(5, -3, 2);
    scene.add(pointLight2);

    // Create visualization groups
    const kleinBottleGroup = new THREE.Group();
    const fluxGroup = new THREE.Group();
    const deformationGroup = new THREE.Group();
    const stressTensorGroup = new THREE.Group();
    const fluidFlowGroup = new THREE.Group();
    const neckingGroup = new THREE.Group();
    const fluidDynamicsGroup = new THREE.Group(); // New group
    
    scene.add(kleinBottleGroup);
    scene.add(fluxGroup);
    scene.add(deformationGroup);
    scene.add(stressTensorGroup);
    scene.add(fluidFlowGroup);
    scene.add(neckingGroup);
    scene.add(fluidDynamicsGroup);
    
    kleinBottleGroupRef.current = kleinBottleGroup;
    fluxGroupRef.current = fluxGroup;
    deformationGroupRef.current = deformationGroup;
    stressTensorGroupRef.current = stressTensorGroup;
    fluidFlowGroupRef.current = fluidFlowGroup;
    neckingGroupRef.current = neckingGroup;
    fluidDynamicsGroupRef.current = fluidDynamicsGroup;

    mount.appendChild(renderer.domElement);

    // Enhanced mouse controls with momentum
    let mouseDown = false;
    let mouseX = 0;
    let mouseY = 0;
    let targetRotation = { x: 0, y: 0 };
    let currentRotation = { x: 0, y: 0 };
    let rotationVelocity = { x: 0, y: 0 };

    const handleMouseDown = (event: MouseEvent) => {
      mouseDown = true;
      mouseX = event.clientX;
      mouseY = event.clientY;
      rotationVelocity = { x: 0, y: 0 };
    };

    const handleMouseMove = (event: MouseEvent) => {
      if (!mouseDown) return;
      const deltaX = event.clientX - mouseX;
      const deltaY = event.clientY - mouseY;
      
      targetRotation.x += deltaY * 0.01;
      targetRotation.y += deltaX * 0.01;
      
      rotationVelocity.x = deltaY * 0.001;
      rotationVelocity.y = deltaX * 0.001;
      
      mouseX = event.clientX;
      mouseY = event.clientY;
    };

    const handleMouseUp = () => {
      mouseDown = false;
    };

    const handleWheel = (event: WheelEvent) => {
      camera.position.z += event.deltaY * 0.01;
      camera.position.z = Math.max(3, Math.min(20, camera.position.z));
    };

    mount.addEventListener('mousedown', handleMouseDown);
    mount.addEventListener('mousemove', handleMouseMove);
    mount.addEventListener('mouseup', handleMouseUp);
    mount.addEventListener('wheel', handleWheel);

    // Enhanced animation loop with fluid dynamics
    const animate = () => {
      animationIdRef.current = requestAnimationFrame(animate);
      
      // Update time for physics calculations
      timeRef.current += 0.016; // ~60fps

      // Enhanced camera rotation with momentum
      if (!mouseDown && (Math.abs(rotationVelocity.x) > 0.001 || Math.abs(rotationVelocity.y) > 0.001)) {
        targetRotation.x += rotationVelocity.x;
        targetRotation.y += rotationVelocity.y;
        rotationVelocity.x *= 0.95;
        rotationVelocity.y *= 0.95;
      }
      
      currentRotation.x += (targetRotation.x - currentRotation.x) * 0.08;
      currentRotation.y += (targetRotation.y - currentRotation.y) * 0.08;
      
      const radius = camera.position.z;
      camera.position.x = radius * Math.sin(currentRotation.y) * Math.cos(currentRotation.x);
      camera.position.y = radius * Math.sin(currentRotation.x);
      camera.position.z = radius * Math.cos(currentRotation.y) * Math.cos(currentRotation.x);
      camera.lookAt(0, 0, 0);

      // Update animation frame
      if (isPlaying) {
        frameRef.current = (frameRef.current + 1) % 100;
        const newProgress = frameRef.current / 100;
        onProgressChange(newProgress);
      } else {
        frameRef.current = Math.floor(progress * 100);
      }

      renderFluidEnhancedVisualization();
      renderer.render(scene, camera);
    };

    animate();

    // Handle resize
    const handleResize = () => {
      if (!mount) return;
      const newWidth = mount.clientWidth;
      const newHeight = mount.clientHeight;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
      if (mount && renderer.domElement) {
        mount.removeChild(renderer.domElement);
      }
      mount.removeEventListener('mousedown', handleMouseDown);
      mount.removeEventListener('mousemove', handleMouseMove);
      mount.removeEventListener('mouseup', handleMouseUp);
      mount.removeEventListener('wheel', handleWheel);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
    };
  }, []);

  // Enhanced rendering function with fluid dynamics
  const renderFluidEnhancedVisualization = () => {
    if (!kleinBottleGroupRef.current || !fluxGroupRef.current) return;

    // Clear all groups
    kleinBottleGroupRef.current.clear();
    fluxGroupRef.current.clear();
    deformationGroupRef.current?.clear();
    stressTensorGroupRef.current?.clear();
    fluidFlowGroupRef.current?.clear();
    neckingGroupRef.current?.clear();
    fluidDynamicsGroupRef.current?.clear();

    const animationProgress = frameRef.current / 100;
    
    // Clear and update geometry arrays
    originalGeometriesRef.current = [];
    deformedGeometriesRef.current = [];

    // Store fluid dynamics data for real-time updates
    const fluidDynamicsData: {
      proximityInfluences: any[];
      deformationVectors: THREE.Vector3[][];
      timeVaryingWarping: any;
      fluidBlending: any;
      performanceMetrics: any;
    } = {
      proximityInfluences: [],
      deformationVectors: [],
      timeVaryingWarping: null,
      fluidBlending: null,
      performanceMetrics: null
    };

    const performanceStart = performance.now();

    // Render enhanced Klein bottles with fluid dynamics
    currentPreset.quark_content.forEach((quark, i) => {
      const currentPos = currentPositions[i];
      
      // CTC-based scale evolution with fluid dynamics modulation
      const initial_scale = 0.6 * currentPreset.ctc_scales[i];
      const final_scale = 0.3;
      const baseScale = initial_scale * (1 - animationProgress) + final_scale * animationProgress;
      
      // Fluid dynamics scale modulation
      const fluidScaleModulation = showFluidDynamics ? 
        1 + Math.sin(timeRef.current * fluidDynamicsParams.wiggleFrequency + i * Math.PI / 3) * 
        fluidDynamicsParams.softness * 0.2 : 1;
      
      const confinementScale = baseScale * (1 + confinementData.confinementStrength * 0.2) * fluidScaleModulation;
      
      // Energy rotation with holonomy influence
      const holonomyRotation = confinementData.holonomies[i]?.theta || 0;
      const rotationAngle = showRotation ? 
        (currentPreset.base_rotation_speed * frameRef.current * (1 - animationProgress) * 
         currentPreset.rotation_mass_ratios[i] + holonomyRotation * 0.1) : 0;

      // Create enhanced geometry with fluid dynamics
      const geometry = new THREE.BufferGeometry();
      const vertices: number[] = [];
      const indices: number[] = [];
      const colors: number[] = [];
      
      const uSegments = 30;
      const vSegments = 30;
      
      // Generate vertices with fluid dynamics enhancement
      for (let u = 0; u <= uSegments; u++) {
        for (let v = 0; v <= vSegments; v++) {
          const uParam = (u / uSegments) * 2 * Math.PI;
          const vParam = (v / vSegments) * 2 * Math.PI;
          
          // Use fluid-enhanced Klein bottle surface generation
          const point = generateFluidKleinBottleSurface(
            uParam, vParam, confinementScale, currentPos, rotationAngle, i
          );
          
          vertices.push(point.x, point.y, point.z);
          
          // Enhanced color variation with fluid dynamics
          const baseColor = new THREE.Color(currentPreset.colors[i]);
          
          if (showFluidDynamics) {
            // Add fluid-based color variation
            const fluidColorVariation = Math.sin(timeRef.current * 2 + uParam + vParam) * 
              fluidDynamicsParams.fluidityStrength * 0.3;
            baseColor.setHSL(
              baseColor.getHSL({h: 0, s: 0, l: 0}).h + fluidColorVariation * 0.1,
              Math.min(1, 0.8 + fluidColorVariation * 0.2),
              Math.max(0.2, 0.5 + fluidColorVariation * 0.3)
            );
          }
          
          const stressIntensity = showStressTensor ? (confinementData.confinementStrength + animationProgress) * 0.5 : 0;
          baseColor.lerp(new THREE.Color('#ffffff'), stressIntensity * 0.3);
          
          colors.push(baseColor.r, baseColor.g, baseColor.b);
        }
      }
      
      // Generate indices
      for (let u = 0; u < uSegments; u++) {
        for (let v = 0; v < vSegments; v++) {
          const a = u * (vSegments + 1) + v;
          const b = u * (vSegments + 1) + (v + 1);
          const c = (u + 1) * (vSegments + 1) + (v + 1);
          const d = (u + 1) * (vSegments + 1) + v;
          
          indices.push(a, b, c);
          indices.push(a, c, d);
        }
      }
      
      geometry.setIndex(indices);
      geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
      geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
      geometry.computeVertexNormals();
      
      // Apply additional fluid dynamics deformations if enabled
      if (showFluidDynamics) {
        const vertexArray = new Float32Array(vertices);
        
        // Apply proximity-based deformation
        const deformationVectors = fluidEngine.computePairwiseDeformationVectors(
          vertexArray, currentPositions, fluidDynamicsParams
        );
        fluidDynamicsData.deformationVectors.push(deformationVectors);
        
        // Apply time-varying warping
        const warpedVertices = fluidEngine.applyTimeVaryingWarping(
          vertexArray, timeRef.current, fluidDynamicsParams, i
        );
        
        // Update geometry with warped vertices
        geometry.setAttribute('position', new THREE.Float32BufferAttribute(warpedVertices, 3));
        geometry.computeVertexNormals();
      }
      
      // Store geometries for physics calculations
      const originalGeometry = geometry.clone();
      originalGeometriesRef.current[i] = originalGeometry;
      deformedGeometriesRef.current[i] = geometry;
      
      // Enhanced material with fluid dynamics effects
      const material = new THREE.MeshPhongMaterial({
        vertexColors: true,
        wireframe: true,
        transparent: true,
        opacity: showFluidDynamics ? 
          0.7 + Math.sin(timeRef.current * fluidDynamicsParams.wiggleFrequency) * 0.1 :
          0.8 + confinementData.confinementStrength * 0.2,
        side: THREE.DoubleSide,
        shininess: showFluidDynamics ? 100 + fluidDynamicsParams.fluidityStrength * 50 : 100,
        specular: new THREE.Color('#ffffff')
      });
      
      const mesh = new THREE.Mesh(geometry, material);
      kleinBottleGroupRef.current!.add(mesh);
      
      // Enhanced flux vectors with fluid dynamics
      if (showFlux) {
        renderFluidEnhancedFluxVectors(i, currentPos, confinementScale, rotationAngle, animationProgress);
      }
      
      // Render stress tensor visualization
      if (showStressTensor) {
        renderStressTensorField(i, currentPos, confinementScale);
      }
      
      // Render fluid flow vectors
      if (showFluidFlow && physicsData?.fluidState) {
        renderFluidFlowVectors(i, currentPos, physicsData.fluidState);
      }
      
      // Render fluid dynamics visualizations
      if (showFluidDynamics) {
        renderFluidDynamicsVisualization(i, currentPos, confinementScale);
      }
    });
    
    // Render inter-quark connections (necking bridges) with fluid blending
    if (showNecking && animationProgress > 0.3) {
      renderFluidBlendingBridges();
    }
    
    const performanceEnd = performance.now();
    fluidDynamicsData.performanceMetrics = {
      renderTime: performanceEnd - performanceStart,
      vertexCount: originalGeometriesRef.current.reduce((sum, geo) => 
        sum + (geo.attributes.position?.count || 0), 0),
      geometryCount: originalGeometriesRef.current.length
    };
    
    // Update fluid dynamics data
    if (onFluidDynamicsUpdate && showFluidDynamics) {
      const timeoutId = setTimeout(() => {
        onFluidDynamicsUpdate?.(fluidDynamicsData);
      }, 100);
    }
  };

  // Enhanced flux vector rendering with fluid dynamics
  const renderFluidEnhancedFluxVectors = (
    quarkIndex: number,
    position: THREE.Vector3,
    scale: number,
    rotationAngle: number,
    progress: number
  ) => {
    const holonomy = confinementData.holonomies[quarkIndex];
    if (!holonomy || !fluxGroupRef.current) return;
    
    const baseArrows = currentPreset.num_arrows[quarkIndex];
    const fluidArrowModulation = showFluidDynamics ? 
      1 + Math.sin(timeRef.current * fluidDynamicsParams.wiggleFrequency + quarkIndex * Math.PI / 4) * 
      fluidDynamicsParams.fluidityStrength * 0.3 : 1;
    
    const numArrows = Math.floor(baseArrows * (1 - progress * 0.6) * 
      (1 + confinementData.confinementStrength * 0.5) * fluidArrowModulation);
    
    const baseLength = currentPreset.flux_lengths[quarkIndex];
    const fluxLength = baseLength * (1 - progress * 0.4) * scale * confinementParams.fluxTubeStrength;
    
    for (let j = 0; j < numArrows; j++) {
      const randU = Math.random() * 2 * Math.PI;
      const randV = Math.random() * 2 * Math.PI;
      
      // Use fluid-enhanced surface generation for arrow placement
      const pos = generateFluidKleinBottleSurface(randU, randV, scale, position, 0, quarkIndex);
      
      // Enhanced direction calculation with fluid dynamics influence
      const holonomyInfluence = new THREE.Vector3(
        Math.cos(holonomy.theta + randU),
        Math.sin(holonomy.theta + randV),
        Math.sin(holonomy.colorPhase)
      ).normalize();
      
      const baseDirection = new THREE.Vector3(
        Math.sin(randV) * (1 - progress),
        Math.cos(randU) * (1 - progress),
        0
      ).normalize();
      
      const fluidDirection = showFluidDynamics ? new THREE.Vector3(
        Math.sin(timeRef.current * fluidDynamicsParams.perlinTimeSpeed + randU) * fluidDynamicsParams.dynamic_deform,
        Math.cos(timeRef.current * fluidDynamicsParams.perlinTimeSpeed + randV) * fluidDynamicsParams.dynamic_deform,
        0
      ) : new THREE.Vector3(0, 0, 0);
      
      const finalDirection = baseDirection.lerp(holonomyInfluence, confinementData.confinementStrength * 0.5)
        .add(fluidDirection.multiplyScalar(0.3)).normalize();
      
      // Enhanced arrow with fluid dynamics scaling
      const fluidArrowScale = showFluidDynamics ? 
        1 + Math.sin(timeRef.current * 3 + j) * fluidDynamicsParams.softness * 0.2 : 1;
      
      const arrowGeometry = new THREE.ConeGeometry(
        0.02 * (1 + confinementData.confinementStrength * 0.3) * fluidArrowScale, 
        fluxLength * 0.4, 
        8
      );
      
      const arrowColor = new THREE.Color(currentPreset.colors[quarkIndex]);
      if (showFluidDynamics) {
        const fluidHue = (arrowColor.getHSL({h: 0, s: 0, l: 0}).h + 
          holonomy.colorPhase * 0.1 + timeRef.current * 0.1) % 1;
        arrowColor.setHSL(fluidHue, 0.8, 0.5 + confinementData.confinementStrength * 0.3);
      }
      
      const arrowMaterial = new THREE.MeshPhongMaterial({ 
        color: arrowColor,
        transparent: true,
        opacity: 0.7 + confinementData.confinementStrength * 0.3
      });
      const arrow = new THREE.Mesh(arrowGeometry, arrowMaterial);
      
      arrow.position.copy(pos);
      arrow.lookAt(pos.clone().add(finalDirection));
      
      fluxGroupRef.current!.add(arrow);
    }
  };

  // Render stress tensor field visualization (enhanced)
  const renderStressTensorField = (
    quarkIndex: number,
    position: THREE.Vector3,
    scale: number
  ) => {
    if (!stressTensorGroupRef.current || !physicsData) return;
    
    const fluidStressModulation = showFluidDynamics ? 
      fluidDynamicsParams.fluidityStrength * Math.sin(timeRef.current * 2 + quarkIndex * Math.PI / 3) * 0.3 : 0;
    
    const stressIndicatorGeometry = new THREE.RingGeometry(
      0.1 * (1 + fluidStressModulation), 
      0.15 * (1 + fluidStressModulation * 1.5), 
      16
    );
    const stressColor = new THREE.Color().setHSL(
      0.0, // Red for high stress
      Math.min(1.0, physicsData.deformationMagnitude * 2 + Math.abs(fluidStressModulation)),
      0.5 + fluidStressModulation * 0.3
    );
    
    const stressMaterial = new THREE.MeshBasicMaterial({
      color: stressColor,
      transparent: true,
      opacity: 0.6 * physicsData.deformationMagnitude * (1 + Math.abs(fluidStressModulation)),
      side: THREE.DoubleSide
    });
    
    const stressMesh = new THREE.Mesh(stressIndicatorGeometry, stressMaterial);
    stressMesh.position.copy(position);
    stressMesh.lookAt(cameraRef.current!.position);
    
    stressTensorGroupRef.current.add(stressMesh);
  };

  // Render fluid flow vectors (enhanced)
  const renderFluidFlowVectors = (
    quarkIndex: number,
    position: THREE.Vector3,
    fluidState: any
  ) => {
    if (!fluidFlowGroupRef.current || !fluidState.velocity) return;
    
    // Sample velocity vectors around the quark with fluid dynamics enhancement
    const numSamples = showFluidDynamics ? 8 : 5;
    for (let i = 0; i < numSamples; i++) {
      const angle = (i / numSamples) * 2 * Math.PI;
      const radius = 0.8 * (1 + fluidDynamicsParams.proximityInfluence * 0.2);
      const samplePos = new THREE.Vector3(
        position.x + radius * Math.cos(angle),
        position.y + radius * Math.sin(angle),
        position.z
      );
      
      // Enhanced velocity calculation with fluid dynamics
      const fluidVelocityModulation = showFluidDynamics ? 
        fluidDynamicsParams.viscosityFactor * Math.sin(timeRef.current * 2 + angle) * 0.5 : 0;
      
      const velocity = new THREE.Vector3(
        Math.cos(angle + timeRef.current * 0.5 + fluidVelocityModulation) * 0.3,
        Math.sin(angle + timeRef.current * 0.7 + fluidVelocityModulation) * 0.3,
        Math.sin(timeRef.current * 0.3 + fluidVelocityModulation) * 0.1
      );

      // Create velocity vector visualization
      const arrowGeometry = new THREE.ConeGeometry(0.015, velocity.length() * 2, 6);
      const arrowMaterial = new THREE.MeshBasicMaterial({ 
        color: new THREE.Color().setHSL(0.6, 0.8, 0.6),
        transparent: true,
        opacity: 0.5
      });
      const arrow = new THREE.Mesh(arrowGeometry, arrowMaterial);
      
      arrow.position.copy(samplePos);
      arrow.lookAt(samplePos.clone().add(velocity));
      
      fluidFlowGroupRef.current.add(arrow);
    }
  };

  // New: Render fluid dynamics specific visualizations
  const renderFluidDynamicsVisualization = (
    quarkIndex: number,
    position: THREE.Vector3,
    scale: number
  ) => {
    if (!fluidDynamicsGroupRef.current || !showFluidDynamics) return;
    
    // Render proximity influence zones
    const influenceGeometry = new THREE.SphereGeometry(
      fluidDynamicsParams.proximityThreshold * scale * 0.3, 
      16, 
      12
    );
    const influenceMaterial = new THREE.MeshBasicMaterial({
      color: new THREE.Color().setHSL(quarkIndex * 0.33, 0.6, 0.4),
      transparent: true,
      opacity: 0.15 + fluidDynamicsParams.proximityInfluence * 0.1,
      wireframe: true
    });
    
    const influenceMesh = new THREE.Mesh(influenceGeometry, influenceMaterial);
    influenceMesh.position.copy(position);
    fluidDynamicsGroupRef.current.add(influenceMesh);
    
    // Render interaction force lines
    interactionVectors.forEach((interactionVec, index) => {
      if (interactionVec.length() > 0) {
        const lineGeometry = new THREE.BufferGeometry().setFromPoints([
          position,
          interactionVec
        ]);
        
        const lineMaterial = new THREE.LineBasicMaterial({
          color: new THREE.Color().setHSL((index * 0.2) % 1, 0.8, 0.6),
          transparent: true,
          opacity: 0.4 * fluidDynamicsParams.dynamic_deform
        });
        
        const line = new THREE.Line(lineGeometry, lineMaterial);
        if (fluidDynamicsGroupRef.current) {
          fluidDynamicsGroupRef.current.add(line);
        }
      }
    });
  };

  // Enhanced necking bridges with fluid blending
  const renderFluidBlendingBridges = () => {
    if (!neckingGroupRef.current) return;
    
    // Create fluid blending bridges between close quarks
    for (let i = 0; i < currentPositions.length; i++) {
      for (let j = i + 1; j < currentPositions.length; j++) {
        const distance = currentPositions[i].distanceTo(currentPositions[j]);
        
        if (distance < 4.0 * (1 + fluidDynamicsParams.blendingIntensity)) {
          const bridgeCenter = currentPositions[i].clone().lerp(currentPositions[j], 0.5);
          const bridgeDirection = currentPositions[j].clone().sub(currentPositions[i]).normalize();
          
          // Enhanced bridge geometry with fluid blending
          const bridgeRadius = 0.1 * (1 - progress * 0.3) * (1 + fluidDynamicsParams.softness * 0.5);
          const bridgeLength = distance * 0.8;
          
          const bridgeGeometry = new THREE.CylinderGeometry(
            bridgeRadius, bridgeRadius * 0.6, bridgeLength, 8
          );
          
          // Fluid-enhanced bridge material
          const bridgeColor = new THREE.Color().setHSL(
            0.1 + Math.sin(timeRef.current + i + j) * fluidDynamicsParams.wiggleAmplitude * 0.1,
            0.6 + fluidDynamicsParams.fluidityStrength * 0.3,
            0.4
          );
          
          const bridgeMaterial = new THREE.MeshPhongMaterial({
            color: bridgeColor,
            transparent: true,
            opacity: 0.3 + fluidDynamicsParams.blendingIntensity * 0.4
          });
          
          const bridgeMesh = new THREE.Mesh(bridgeGeometry, bridgeMaterial);
          bridgeMesh.position.copy(bridgeCenter);
          bridgeMesh.lookAt(bridgeCenter.clone().add(bridgeDirection));
          
          neckingGroupRef.current.add(bridgeMesh);
        }
      }
    }
  };

  // Update rendering when props change
  useEffect(() => {
    renderFluidEnhancedVisualization();
  }, [
    selectedPreset, showFlux, showRotation, progress, 
    showDeformation, showStressTensor, showFluidFlow, showNecking,
    showFluidDynamics, fluidDynamicsParams
  ]);

  return <div ref={mountRef} className="w-full h-full min-h-[400px]" />;
};

export default FluidEnhancedThreeJSVisualization;
