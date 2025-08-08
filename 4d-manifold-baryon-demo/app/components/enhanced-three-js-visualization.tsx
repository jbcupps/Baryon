
'use client';

import React, { useEffect, useRef, useState, useMemo } from 'react';
import * as THREE from 'three';
import { useColorConfinement } from './color-confinement-engine';
import { useAdvancedPhysics, PhysicsParameters } from './advanced-physics-engine';
import { ConfinementParameters } from './color-confinement-engine';

interface EnhancedThreeJSVisualizationProps {
  selectedPreset: string;
  isPlaying: boolean;
  progress: number;
  onProgressChange: (progress: number) => void;
  showFlux: boolean;
  showRotation: boolean;
  
  // Advanced physics controls
  physicsParams: PhysicsParameters;
  confinementParams: ConfinementParameters;
  showDeformation: boolean;
  showStressTensor: boolean;
  showFluidFlow: boolean;
  showNecking: boolean;
  
  // Callbacks for real-time data
  onConfinementUpdate?: (data: any) => void;
  onPhysicsUpdate?: (data: any) => void;

  // DSIM parameters (optional)
  dsimDensityRate?: number;
  dsimProximityThreshold?: number;
  dsimTimeStep?: number;
}

const EnhancedThreeJSVisualization: React.FC<EnhancedThreeJSVisualizationProps> = ({
  selectedPreset,
  isPlaying,
  progress,
  onProgressChange,
  showFlux,
  showRotation,
  physicsParams,
  confinementParams,
  showDeformation,
  showStressTensor,
  showFluidFlow,
  showNecking,
  onConfinementUpdate,
  onPhysicsUpdate,
  dsimDensityRate,
  dsimProximityThreshold,
  dsimTimeStep
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
  
  // Store original geometries for deformation calculations
  const originalGeometriesRef = useRef<THREE.BufferGeometry[]>([]);
  const deformedGeometriesRef = useRef<THREE.BufferGeometry[]>([]);

  // Stable refs so UI controls immediately affect the running animation loop
  const isPlayingRef = useRef<boolean>(isPlaying);
  const progressRef = useRef<number>(progress);
  const showFluxRef = useRef<boolean>(showFlux);
  const showRotationRef = useRef<boolean>(showRotation);
  const physicsRef = useRef<PhysicsParameters>(physicsParams);
  const confinementRef = useRef<ConfinementParameters>(confinementParams);
  const togglesRef = useRef({ showDeformation, showStressTensor, showFluidFlow, showNecking });

  useEffect(() => { isPlayingRef.current = isPlaying; }, [isPlaying]);
  useEffect(() => { progressRef.current = progress; }, [progress]);
  useEffect(() => { showFluxRef.current = showFlux; }, [showFlux]);
  useEffect(() => { showRotationRef.current = showRotation; }, [showRotation]);
  useEffect(() => { physicsRef.current = physicsParams; }, [physicsParams]);
  useEffect(() => { confinementRef.current = confinementParams; }, [confinementParams]);
  useEffect(() => { togglesRef.current = { showDeformation, showStressTensor, showFluidFlow, showNecking }; }, [showDeformation, showStressTensor, showFluidFlow, showNecking]);

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

  // Update parent components with real-time data (with debouncing to prevent infinite loops)
  useEffect(() => {
    if (onConfinementUpdate && confinementData && typeof confinementData.confinementStrength === 'number') {
      const timeoutId = setTimeout(() => {
        onConfinementUpdate(confinementData);
      }, 100);
      return () => clearTimeout(timeoutId);
    }
  }, [confinementData?.confinementStrength, confinementData?.isColorNeutral, confinementData?.bordismClass]);

  useEffect(() => {
    if (onPhysicsUpdate && physicsData && typeof physicsData.deformationMagnitude === 'number') {
      const timeoutId = setTimeout(() => {
        onPhysicsUpdate(physicsData);
      }, 100);
      return () => clearTimeout(timeoutId);
    }
  }, [physicsData?.deformationMagnitude, physicsData?.hasNecking]);

  // Enhanced Klein bottle parametric function with deformation
  const kleinBottle = (
    u: number, 
    v: number, 
    scale: number, 
    offset: THREE.Vector3, 
    rotationAngle: number = 0,
    deformationVector: THREE.Vector3 = new THREE.Vector3(0, 0, 0)
  ): THREE.Vector3 => {
    // Base Klein bottle geometry
    let x = (2 + Math.cos(u/2) * Math.sin(v) - Math.sin(u/2) * Math.sin(2*v)) * Math.cos(u) * scale;
    let y = (2 + Math.cos(u/2) * Math.sin(v) - Math.sin(u/2) * Math.sin(2*v)) * Math.sin(u) * scale;
    let z = (Math.sin(u/2) * Math.sin(v) + Math.cos(u/2) * Math.sin(2*v)) * scale;
    
    // Apply energy rotation
    if (rotationAngle !== 0 && showRotationRef.current) {
      const cosRot = Math.cos(rotationAngle);
      const sinRot = Math.sin(rotationAngle);
      const newX = x * cosRot - y * sinRot;
      const newY = x * sinRot + y * cosRot;
      x = newX;
      y = newY;
    }
    
    return new THREE.Vector3(x + offset.x, y + offset.y, z + offset.z);
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

    // Add point lights for better visualization
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
    
    scene.add(kleinBottleGroup);
    scene.add(fluxGroup);
    scene.add(deformationGroup);
    scene.add(stressTensorGroup);
    scene.add(fluidFlowGroup);
    scene.add(neckingGroup);
    
    kleinBottleGroupRef.current = kleinBottleGroup;
    fluxGroupRef.current = fluxGroup;
    deformationGroupRef.current = deformationGroup;
    stressTensorGroupRef.current = stressTensorGroup;
    fluidFlowGroupRef.current = fluidFlowGroup;
    neckingGroupRef.current = neckingGroup;

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

    // Enhanced animation loop
    const animate = () => {
      animationIdRef.current = requestAnimationFrame(animate);
      
      // Update time for physics calculations (scaled by DSIM dt)
      const dtFactor = typeof dsimTimeStep === 'number' ? dsimTimeStep : 1.0;
      timeRef.current += 0.016 * dtFactor; // ~60fps

      // Enhanced camera rotation with momentum
      if (!mouseDown && (Math.abs(rotationVelocity.x) > 0.001 || Math.abs(rotationVelocity.y) > 0.001)) {
        targetRotation.x += rotationVelocity.x;
        targetRotation.y += rotationVelocity.y;
        rotationVelocity.x *= 0.95; // Momentum decay
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
      if (isPlayingRef.current) {
        const step = Math.max(1, Math.floor((dsimTimeStep ?? 1.0)));
        frameRef.current = (frameRef.current + step) % 100;
        const newProgress = frameRef.current / 100;
        onProgressChange(newProgress);
      } else {
        frameRef.current = Math.floor(progressRef.current * 100);
      }

      renderAdvancedVisualization();
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

  // Advanced rendering function with all enhanced features
  const renderAdvancedVisualization = () => {
    if (!kleinBottleGroupRef.current || !fluxGroupRef.current) return;

    // Clear all groups
    kleinBottleGroupRef.current.clear();
    fluxGroupRef.current.clear();
    deformationGroupRef.current?.clear();
    stressTensorGroupRef.current?.clear();
    fluidFlowGroupRef.current?.clear();
    neckingGroupRef.current?.clear();

    const animationProgress = frameRef.current / 100;
    
    // Clear and update geometry arrays
    originalGeometriesRef.current = [];
    deformedGeometriesRef.current = [];

    // DSIM locality threshold used to gate interactions ("touch" condition)
    const localityThreshold = typeof dsimProximityThreshold === 'number' ? dsimProximityThreshold : 1.5;

    // Determine color neutrality from CCP (Z3). CCP prevents causality issues by compensating phases.
    const isColorNeutral = confinementData.isColorNeutral === true;

    // Contact detection: manifolds share the same spacetime; when they touch, interaction must occur
    let isTouching = false;
    for (let i = 0; i < currentPositions.length; i++) {
      for (let j = i + 1; j < currentPositions.length; j++) {
        if (currentPositions[i].distanceTo(currentPositions[j]) <= localityThreshold) {
          isTouching = true;
          break;
        }
      }
      if (isTouching) break;
    }

    // Render enhanced Klein bottles with all effects
    currentPreset.quark_content.forEach((quark, i) => {
      const currentPos = currentPositions[i];
      
      // CTC-based scale evolution (mathematical manifold baseline)
      const initial_scale = 0.6 * currentPreset.ctc_scales[i];
      const final_scale = 0.3;
      const baseScale = initial_scale * (1 - animationProgress) + final_scale * animationProgress;

      // Apply user-controlled confinement scale directly from controls (no fluid override)
      const confinementScale = baseScale * confinementParams.confinementScale;
      
      // Energy rotation with holonomy influence
      const holonomyRotation = confinementData.holonomies[i]?.theta || 0;
      const rotationAngle = showRotation ? 
        (currentPreset.base_rotation_speed * frameRef.current * (1 - animationProgress) *
         currentPreset.rotation_mass_ratios[i] + holonomyRotation * (0.1 * confinementParams.holonomyStrength)) : 0;

      // Create base geometry
      const geometry = new THREE.BufferGeometry();
      const vertices: number[] = [];
      const indices: number[] = [];
      const colors: number[] = [];
      
      const uSegments = 30;
      const vSegments = 30;
      
      // Generate vertices strictly from the mathematical manifold (no deformation applied)
      for (let u = 0; u <= uSegments; u++) {
        for (let v = 0; v <= vSegments; v++) {
          const uParam = (u / uSegments) * 2 * Math.PI;
          const vParam = (v / vSegments) * 2 * Math.PI;
          // Use pure manifold position; overlays rendered separately
          const point = kleinBottle(uParam, vParam, confinementScale, currentPos, rotationAngle);
          vertices.push(point.x, point.y, point.z);
          
          // Color variation based on holonomy and stress
          const baseColor = new THREE.Color(currentPreset.colors[i]);
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
      
      // Store geometries for physics calculations
      const originalGeometry = geometry.clone();
      originalGeometriesRef.current[i] = originalGeometry;
      deformedGeometriesRef.current[i] = geometry;
      
      // Enhanced material with advanced effects
      const material = new THREE.MeshPhongMaterial({
        vertexColors: true,
        wireframe: true,
        transparent: true,
        opacity: 0.8 + confinementData.confinementStrength * 0.2,
        side: THREE.DoubleSide,
        shininess: 100,
        specular: new THREE.Color('#ffffff')
      });
      
      const mesh = new THREE.Mesh(geometry, material);
      kleinBottleGroupRef.current!.add(mesh);
      
      // Flux vectors visualize compensating interactions upon contact (CCP). Always active when touching.
      if (showFlux && isTouching) {
        const ccpScale = isColorNeutral ? 1.0 : 0.6; // non-neutral tries to compensate but weaker coherent flux
        renderEnhancedFluxVectors(i, currentPos, confinementScale, rotationAngle, animationProgress, ccpScale);
      }
      
      // Optionally render stress tensor visualization (overlay)
      if (showStressTensor) {
        renderStressTensorField(i, currentPos, confinementScale);
      }
      
      // Render fluid flow vectors (overlay)
      if (showFluidFlow && physicsData?.fluidState) {
        renderFluidFlowVectors(i, currentPos, physicsData.fluidState);
      }
    });
    
    // Render inter-quark connections (necking bridges) upon contact within locality threshold.
    const prox = localityThreshold;
    const proxNorm = Math.max(0, Math.min(1, (prox - 0.5) / (3.0 - 0.5)));
    const neckingStart = 0.2 + 0.6 * proxNorm;
    if (showNecking && isTouching && animationProgress > neckingStart) {
      // Additionally require that average pairwise distance is below threshold
      const avgDistance = (() => {
        let sum = 0; let n = 0;
        for (let i = 0; i < currentPositions.length; i++) {
          for (let j = i + 1; j < currentPositions.length; j++) {
            sum += currentPositions[i].distanceTo(currentPositions[j]);
            n++;
          }
        }
        return n > 0 ? sum / n : Infinity;
      })();
      if (avgDistance <= prox) {
        renderNeckingBridges(isColorNeutral ? 1.0 : 0.6); // non-neutral forms softer, partial bridges
      }
    }
  };

  // Enhanced flux vector rendering with holonomy coloring
  const renderEnhancedFluxVectors = (
    quarkIndex: number,
    position: THREE.Vector3,
    scale: number,
    rotationAngle: number,
    progress: number,
    ccpScale: number = 1.0
  ) => {
    const holonomy = confinementData.holonomies[quarkIndex];
    if (!holonomy || !fluxGroupRef.current) return;
    
    const baseArrows = currentPreset.num_arrows[quarkIndex];
    const densityMult = Math.max(0.25, Math.min(3, (dsimDensityRate ?? 10) / 20));
    const numArrows = Math.floor(baseArrows * (1 - progress * 0.6) * (1 + confinementData.confinementStrength * 0.5) * densityMult * ccpScale);
    
    const baseLength = currentPreset.flux_lengths[quarkIndex];
    const fluxLength = baseLength * (1 - progress * 0.4) * scale * confinementParams.fluxTubeStrength * (0.8 + 0.4 * ccpScale);
    
    for (let j = 0; j < numArrows; j++) {
      const randU = Math.random() * 2 * Math.PI;
      const randV = Math.random() * 2 * Math.PI;
      const pos = kleinBottle(randU, randV, scale, position, 0);
      
      // Enhanced direction calculation with holonomy influence
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
      
      const finalDirection = baseDirection.lerp(holonomyInfluence, confinementData.confinementStrength * 0.5);
      
      // Enhanced arrow with holonomy coloring
      const arrowGeometry = new THREE.ConeGeometry(
        0.02 * (1 + confinementData.confinementStrength * 0.3) * (0.8 + 0.4 * ccpScale), 
        fluxLength * 0.4, 
        8
      );
      
      const arrowColor = new THREE.Color(currentPreset.colors[quarkIndex]);
      arrowColor.setHSL(
        arrowColor.getHSL({h: 0, s: 0, l: 0}).h + holonomy.colorPhase * 0.1,
        0.8,
        0.5 + confinementData.confinementStrength * 0.3
      );
      
      const arrowMaterial = new THREE.MeshPhongMaterial({ 
        color: arrowColor,
        transparent: true,
        opacity: (0.7 + confinementData.confinementStrength * 0.3) * (0.7 + 0.3 * ccpScale)
      });
      const arrow = new THREE.Mesh(arrowGeometry, arrowMaterial);
      
      arrow.position.copy(pos);
      arrow.lookAt(pos.clone().add(finalDirection));
      
      fluxGroupRef.current!.add(arrow);
    }
  };

  // Render stress tensor field visualization
  const renderStressTensorField = (
    quarkIndex: number,
    position: THREE.Vector3,
    scale: number
  ) => {
    if (!stressTensorGroupRef.current || !physicsData) return;
    
    const stressIndicatorGeometry = new THREE.RingGeometry(0.1, 0.15, 16);
    const stressColor = new THREE.Color().setHSL(
      0.0, // Red for high stress
      Math.min(1.0, physicsData.deformationMagnitude * 2),
      0.5
    );
    
    const stressMaterial = new THREE.MeshBasicMaterial({
      color: stressColor,
      transparent: true,
      opacity: 0.6 * physicsData.deformationMagnitude,
      side: THREE.DoubleSide
    });
    
    const stressMesh = new THREE.Mesh(stressIndicatorGeometry, stressMaterial);
    stressMesh.position.copy(position);
    stressMesh.lookAt(cameraRef.current!.position);
    
    stressTensorGroupRef.current.add(stressMesh);
  };

  // Render fluid flow vectors
  const renderFluidFlowVectors = (
    quarkIndex: number,
    position: THREE.Vector3,
    fluidState: any
  ) => {
    if (!fluidFlowGroupRef.current || !fluidState.velocity) return;
    
    // Sample some velocity vectors around the quark
    for (let i = 0; i < 5; i++) {
      const angle = (i / 5) * 2 * Math.PI;
      const radius = 0.8;
      const samplePos = new THREE.Vector3(
        position.x + radius * Math.cos(angle),
        position.y + radius * Math.sin(angle),
        position.z
      );
      
      // Create velocity vector visualization
      const velocity = new THREE.Vector3(
        Math.cos(angle + timeRef.current * 0.5) * 0.3,
        Math.sin(angle + timeRef.current * 0.7) * 0.3,
        Math.sin(timeRef.current * 0.3) * 0.1
      );
      
      const arrowHelper = new THREE.ArrowHelper(
        velocity.normalize(),
        samplePos,
        velocity.length() * 2,
        new THREE.Color('#00ff88'),
        velocity.length() * 0.5,
        velocity.length() * 0.3
      );
      
      const lineMaterial = arrowHelper.line.material as THREE.LineBasicMaterial;
      lineMaterial.transparent = true;
      lineMaterial.opacity = 0.5;
      
      fluidFlowGroupRef.current.add(arrowHelper);
    }
  };

  // Render necking bridges between quarks (as wireframe cylinders connecting manifolds)
  const renderNeckingBridges = (ccpScale: number = 1.0) => {
    if (!neckingGroupRef.current) return;
    
    // Create bridges between pairs of quarks
    for (let i = 0; i < currentPositions.length; i++) {
      for (let j = i + 1; j < currentPositions.length; j++) {
        const distance = currentPositions[i].distanceTo(currentPositions[j]);
        
        if (distance < 5.0) { // Only create bridges when quarks are close enough
          const bridgeCenter = currentPositions[i].clone().lerp(currentPositions[j], 0.5);
          const bridgeDirection = currentPositions[j].clone().sub(currentPositions[i]).normalize();
          
          // Create bridge geometry (tube connecting the quarks)
          const bridgeRadius = 0.1 * (1 - progress * 0.7) * physicsParams.neckingStrength * (0.8 + 0.4 * ccpScale);
          const bridgeLength = distance * 0.8;
          
          const bridgeGeometry = new THREE.CylinderGeometry(
            bridgeRadius,
            bridgeRadius * 0.7, // Tapered ends
            bridgeLength,
            8
          );
          
          const bridgeMaterial = new THREE.MeshPhongMaterial({
            color: new THREE.Color().setHSL(0.6, 0.5, 0.5),
            transparent: true,
            opacity: 0.4 * physicsParams.neckingStrength * (0.8 + 0.4 * ccpScale),
            wireframe: true
          });
          
          const bridge = new THREE.Mesh(bridgeGeometry, bridgeMaterial);
          bridge.position.copy(bridgeCenter);
          bridge.lookAt(bridgeCenter.clone().add(bridgeDirection));
          bridge.rotateX(Math.PI / 2); // Align cylinder along bridge direction
          
          neckingGroupRef.current.add(bridge);
        }
      }
    }
  };

  // Calculate rippling deformation effects
  const calculateRippling = (
    u: number,
    v: number,
    time: number,
    progress: number
  ): THREE.Vector3 => {
    const ripple = new THREE.Vector3(0, 0, 0);
    
    // Multi-frequency ripples
    const frequency1 = 2.0;
    const frequency2 = 3.5;
    const amplitude = 0.05 * (1 - progress * 0.8) * physicsParams.deformationIntensity;
    
    ripple.x = amplitude * Math.sin(u * frequency1 + time) * Math.cos(v * frequency2 + time * 0.7);
    ripple.y = amplitude * Math.cos(u * frequency2 + time * 1.3) * Math.sin(v * frequency1 + time * 0.5);
    ripple.z = amplitude * Math.sin((u + v) * frequency1 + time * 0.8) * 0.5;
    
    return ripple;
  };

  // Calculate necking deformation
  const calculateNeckingDeformation = (
    u: number,
    v: number,
    currentPos: THREE.Vector3,
    allPositions: THREE.Vector3[],
    progress: number
  ): THREE.Vector3 => {
    const necking = new THREE.Vector3(0, 0, 0);
    
    // Find closest other quark
    let minDistance = Infinity;
    let closestPos = currentPos;
    
    allPositions.forEach(pos => {
      if (!pos.equals(currentPos)) {
        const distance = currentPos.distanceTo(pos);
        if (distance < minDistance) {
          minDistance = distance;
          closestPos = pos;
        }
      }
    });
    
    if (minDistance < 4.0) {
      // Create attraction toward bridge midpoint
      const bridgeCenter = currentPos.clone().lerp(closestPos, 0.5);
      const attraction = bridgeCenter.clone().sub(currentPos).normalize();
      
      const neckingStrength = physicsParams.neckingStrength * progress * (1 - minDistance / 4.0);
      necking.copy(attraction.multiplyScalar(neckingStrength * 0.2));
    }
    
    return necking;
  };

  // Update rendering when key props change (optimized to prevent infinite loops)
  useEffect(() => {
    renderAdvancedVisualization();
  }, [selectedPreset, showFlux, showRotation, showDeformation, showStressTensor, showFluidFlow, showNecking]);

  // Separate effect for progress changes to avoid unnecessary re-renders
  useEffect(() => {
    if (frameRef.current !== Math.floor(progress * 100)) {
      renderAdvancedVisualization();
    }
  }, [progress]);

  return <div ref={mountRef} className="w-full h-full min-h-[500px]" />;
};

export default EnhancedThreeJSVisualization;
