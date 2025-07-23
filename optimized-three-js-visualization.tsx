'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

interface OptimizedThreeJSVisualizationProps {
  selectedPreset: string;
  isPlaying: boolean;
  progress: number;
  onProgressChange: (progress: number) => void;
  showFlux: boolean;
  showRotation: boolean;
}

const OptimizedThreeJSVisualization: React.FC<OptimizedThreeJSVisualizationProps> = ({
  selectedPreset,
  isPlaying,
  progress,
  onProgressChange,
  showFlux,
  showRotation
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene>();
  const rendererRef = useRef<THREE.WebGLRenderer>();
  const cameraRef = useRef<THREE.PerspectiveCamera>();
  const frameRef = useRef<number>(0);
  const animationIdRef = useRef<number>();
  const kleinBottleGroupRef = useRef<THREE.Group>();
  const fluxGroupRef = useRef<THREE.Group>();

  // Optimized preset configurations based on physical calculations
  const optimizedPresets = {
    proton: {
      name: 'Proton',
      symbol: 'p⁺',
      quark_content: ['u', 'u', 'd'],
      colors: ['#FF4444', '#FF4444', '#4444FF'],
      charges: ['+2/3', '+2/3', '-1/3'],
      charge_values: [0.6667, 0.6667, -0.3333],
      masses: [2.3, 2.3, 4.8],
      
      // Optimized parameters based on physical quantities
      optimized_parameters: {
        scales: [1.400, 1.400, 0.600],           // ∝ 1/mass (uncertainty principle)
        num_arrows: [8, 8, 4],                   // ∝ |Q/e| (flux quantization)
        flux_lengths: [0.0228, 0.0228, 0.0114], // ∝ |Q|√α (EM coupling)
        rotation_speeds: [0.0928, 0.0928, 0.0445] // ∝ √(E_binding/mass)
      },
      
      physical_properties: {
        total_mass_mev: 938.3,
        binding_energy_mev: -928.7,
        total_charge: 1.0
      }
    },
    
    neutron: {
      name: 'Neutron',
      symbol: 'n⁰',
      quark_content: ['u', 'd', 'd'],
      colors: ['#FF4444', '#4444FF', '#44FF44'],
      charges: ['+2/3', '-1/3', '-1/3'],
      charge_values: [0.6667, -0.3333, -0.3333],
      masses: [2.3, 4.8, 4.8],
      
      // Optimized parameters based on physical quantities
      optimized_parameters: {
        scales: [1.400, 0.600, 0.600],           // ∝ 1/mass
        num_arrows: [8, 4, 4],                   // ∝ |Q/e|
        flux_lengths: [0.0228, 0.0114, 0.0114], // ∝ |Q|√α
        rotation_speeds: [0.0929, 0.0445, 0.0445] // ∝ √(E_binding/mass)
      },
      
      physical_properties: {
        total_mass_mev: 939.6,
        binding_energy_mev: -930.4,
        total_charge: 0.0
      }
    }
  };

  // Optimized animation parameters
  const animationConfig = {
    total_frames: 60,        // Optimized for 60fps performance
    u_segments: 50,          // Optimized grid resolution
    v_segments: 50,          // Balances topology detail with performance
    fps_target: 60,
    
    // Phase breakdown for realistic merger dynamics
    phases: {
      separation_phase: 12,    // 20% - Initial separation
      approach_phase: 30,      // 50% - Quarks approaching
      merger_phase: 12,        // 20% - Active merging
      stabilization_phase: 6   // 10% - Final stabilization
    }
  };

  const currentPreset = optimizedPresets[selectedPreset as keyof typeof optimizedPresets];

  // Optimized Klein bottle parametric function with physical scaling
  const kleinBottle = (u: number, v: number, scale: number, offset: THREE.Vector3, rotationAngle: number = 0): THREE.Vector3 => {
    let x = (2 + Math.cos(u/2) * Math.sin(v) - Math.sin(u/2) * Math.sin(2*v)) * Math.cos(u) * scale;
    let y = (2 + Math.cos(u/2) * Math.sin(v) - Math.sin(u/2) * Math.sin(2*v)) * Math.sin(u) * scale;
    let z = (Math.sin(u/2) * Math.sin(v) + Math.cos(u/2) * Math.sin(2*v)) * scale;
    
    // Apply energy-derived rotation
    if (rotationAngle !== 0 && showRotation) {
      const cosRot = Math.cos(rotationAngle);
      const sinRot = Math.sin(rotationAngle);
      const newX = x * cosRot - y * sinRot;
      const newY = x * sinRot + y * cosRot;
      x = newX;
      y = newY;
    }
    
    return new THREE.Vector3(x + offset.x, y + offset.y, z + offset.z);
  };

  // Calculate animation phase for realistic merger dynamics
  const getAnimationPhase = (progress: number): string => {
    const frame = Math.floor(progress * animationConfig.total_frames);
    
    if (frame <= animationConfig.phases.separation_phase) {
      return 'separation';
    } else if (frame <= animationConfig.phases.separation_phase + animationConfig.phases.approach_phase) {
      return 'approach';
    } else if (frame <= animationConfig.phases.separation_phase + animationConfig.phases.approach_phase + animationConfig.phases.merger_phase) {
      return 'merger';
    } else {
      return 'stabilization';
    }
  };

  // Initialize Three.js scene with optimized settings
  useEffect(() => {
    if (!mountRef.current) return;

    const mount = mountRef.current;
    const width = mount.clientWidth;
    const height = mount.clientHeight;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#f4f4f4');
    sceneRef.current = scene;

    // Camera setup with optimized parameters
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.set(0, 0, 8);
    cameraRef.current = camera;

    // Renderer setup with performance optimizations
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true,
      powerPreference: "high-performance"
    });
    renderer.setSize(width, height);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Limit pixel ratio for performance
    rendererRef.current = renderer;

    // Optimized lighting setup
    const ambientLight = new THREE.AmbientLight('#404040', 0.4);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight('#ffffff', 0.6);
    directionalLight.position.set(1, 1, 1);
    directionalLight.castShadow = true;
    // Optimize shadow map size
    directionalLight.shadow.mapSize.width = 1024;
    directionalLight.shadow.mapSize.height = 1024;
    scene.add(directionalLight);

    // Create groups for organization
    const kleinBottleGroup = new THREE.Group();
    const fluxGroup = new THREE.Group();
    scene.add(kleinBottleGroup);
    scene.add(fluxGroup);
    kleinBottleGroupRef.current = kleinBottleGroup;
    fluxGroupRef.current = fluxGroup;

    mount.appendChild(renderer.domElement);

    // Optimized mouse controls with smooth damping
    let mouseDown = false;
    let mouseX = 0;
    let mouseY = 0;
    let targetRotation = { x: 0, y: 0 };
    let currentRotation = { x: 0, y: 0 };

    const handleMouseDown = (event: MouseEvent) => {
      mouseDown = true;
      mouseX = event.clientX;
      mouseY = event.clientY;
    };

    const handleMouseMove = (event: MouseEvent) => {
      if (!mouseDown) return;
      const deltaX = event.clientX - mouseX;
      const deltaY = event.clientY - mouseY;
      targetRotation.x += deltaY * 0.01;
      targetRotation.y += deltaX * 0.01;
      mouseX = event.clientX;
      mouseY = event.clientY;
    };

    const handleMouseUp = () => {
      mouseDown = false;
    };

    const handleWheel = (event: WheelEvent) => {
      camera.position.z += event.deltaY * 0.01;
      camera.position.z = Math.max(3, Math.min(15, camera.position.z));
    };

    mount.addEventListener('mousedown', handleMouseDown);
    mount.addEventListener('mousemove', handleMouseMove);
    mount.addEventListener('mouseup', handleMouseUp);
    mount.addEventListener('wheel', handleWheel);

    // Optimized animation loop targeting 60fps
    const animate = () => {
      animationIdRef.current = requestAnimationFrame(animate);

      // Smooth camera rotation with optimized damping
      currentRotation.x += (targetRotation.x - currentRotation.x) * 0.05;
      currentRotation.y += (targetRotation.y - currentRotation.y) * 0.05;
      
      const radius = camera.position.z;
      camera.position.x = radius * Math.sin(currentRotation.y) * Math.cos(currentRotation.x);
      camera.position.y = radius * Math.sin(currentRotation.x);
      camera.position.z = radius * Math.cos(currentRotation.y) * Math.cos(currentRotation.x);
      camera.lookAt(0, 0, 0);

      // Update animation frame with optimized frame count
      if (isPlaying) {
        frameRef.current = (frameRef.current + 1) % animationConfig.total_frames;
        const newProgress = frameRef.current / animationConfig.total_frames;
        onProgressChange(newProgress);
      } else {
        frameRef.current = Math.floor(progress * animationConfig.total_frames);
      }

      renderOptimizedKleinBottles();
      renderer.render(scene, camera);
    };

    animate();

    // Handle resize with performance optimization
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

  // Render Klein bottles with optimized parameters
  const renderOptimizedKleinBottles = () => {
    if (!kleinBottleGroupRef.current || !fluxGroupRef.current) return;

    // Clear previous geometries
    kleinBottleGroupRef.current.clear();
    fluxGroupRef.current.clear();

    const animationProgress = frameRef.current / animationConfig.total_frames;
    const currentPhase = getAnimationPhase(animationProgress);
    
    // Initial positions optimized for visual clarity
    const initialPositions = [
      new THREE.Vector3(-3, -2, 0),
      new THREE.Vector3(3, -2, 0),
      new THREE.Vector3(0, 3, 0)
    ];
    
    const finalPosition = new THREE.Vector3(0, 0, 0);
    
    // Calculate current positions and properties for each quark
    currentPreset.quark_content.forEach((quark, i) => {
      // Position interpolation with phase-dependent easing
      let easingFactor = animationProgress;
      if (currentPhase === 'merger') {
        // Accelerated merging in merger phase
        easingFactor = Math.pow(animationProgress, 0.5);
      } else if (currentPhase === 'stabilization') {
        // Smooth stabilization
        easingFactor = 1 - Math.pow(1 - animationProgress, 2);
      }
      
      const currentPos = initialPositions[i].clone().lerp(finalPosition, easingFactor);
      
      // Optimized scale evolution using physical parameters
      const baseScale = currentPreset.optimized_parameters.scales[i];
      const scale = baseScale * (1 - animationProgress * 0.7);
      
      // Energy-derived rotation angle
      const baseRotationSpeed = currentPreset.optimized_parameters.rotation_speeds[i];
      const rotationAngle = showRotation ? baseRotationSpeed * frameRef.current * (1 - animationProgress) : 0;
      
      // Create optimized Klein bottle geometry
      const geometry = new THREE.BufferGeometry();
      const vertices: number[] = [];
      const indices: number[] = [];
      
      const uSegments = animationConfig.u_segments;
      const vSegments = animationConfig.v_segments;
      
      // Generate vertices with optimized grid resolution
      for (let u = 0; u <= uSegments; u++) {
        for (let v = 0; v <= vSegments; v++) {
          const uParam = (u / uSegments) * 2 * Math.PI;
          const vParam = (v / vSegments) * 2 * Math.PI;
          
          const point = kleinBottle(uParam, vParam, scale, currentPos, rotationAngle);
          vertices.push(point.x, point.y, point.z);
        }
      }
      
      // Generate indices for wireframe with optimized triangle count
      for (let u = 0; u < uSegments; u++) {
        for (let v = 0; v < vSegments; v++) {
          const a = u * (vSegments + 1) + v;
          const b = u * (vSegments + 1) + (v + 1);
          const c = (u + 1) * (vSegments + 1) + (v + 1);
          const d = (u + 1) * (vSegments + 1) + v;
          
          // Two triangles per quad
          indices.push(a, b, c);
          indices.push(a, c, d);
        }
      }
      
      geometry.setIndex(indices);
      geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
      geometry.computeVertexNormals();
      
      // Material with quark color and optimized properties
      const material = new THREE.MeshBasicMaterial({
        color: currentPreset.colors[i],
        wireframe: true,
        transparent: true,
        opacity: 0.6,
        side: THREE.DoubleSide
      });
      
      const mesh = new THREE.Mesh(geometry, material);
      kleinBottleGroupRef.current!.add(mesh);
      
      // Add optimized flux vectors if enabled
      if (showFlux) {
        const baseArrowCount = currentPreset.optimized_parameters.num_arrows[i];
        const numArrows = Math.floor(baseArrowCount * (1 - animationProgress * 0.5));
        const baseFluxLength = currentPreset.optimized_parameters.flux_lengths[i];
        const fluxLength = baseFluxLength * 20 * (1 - animationProgress * 0.3); // Scale up for visibility
        
        for (let j = 0; j < numArrows; j++) {
          const randU = Math.random() * 2 * Math.PI;
          const randV = Math.random() * 2 * Math.PI;
          const pos = kleinBottle(randU, randV, scale, currentPos, 0);
          
          // Direction based on charge sign and electromagnetic field
          const chargeSign = Math.sign(currentPreset.charge_values[i]);
          const dir = new THREE.Vector3(
            Math.sin(randV) * (1 - animationProgress) * chargeSign,
            Math.cos(randU) * (1 - animationProgress) * chargeSign,
            0
          ).normalize();
          
          // Optimized arrow geometry
          const arrowGeometry = new THREE.ConeGeometry(0.02, fluxLength * 0.3, 8);
          const arrowMaterial = new THREE.MeshBasicMaterial({ 
            color: currentPreset.colors[i],
            transparent: true,
            opacity: 0.8
          });
          const arrow = new THREE.Mesh(arrowGeometry, arrowMaterial);
          
          arrow.position.copy(pos);
          arrow.lookAt(pos.clone().add(dir));
          
          fluxGroupRef.current!.add(arrow);
        }
      }
    });
  };

  // Update rendering when props change
  useEffect(() => {
    renderOptimizedKleinBottles();
  }, [selectedPreset, showFlux, showRotation, progress]);

  return (
    <div className="relative w-full h-full min-h-[400px]">
      <div ref={mountRef} className="w-full h-full" />
      
      {/* Optimization info overlay */}
      <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white text-xs p-2 rounded">
        <div>Grid: {animationConfig.u_segments}×{animationConfig.v_segments}</div>
        <div>Frames: {animationConfig.total_frames}</div>
        <div>Phase: {getAnimationPhase(progress)}</div>
        <div>Vertices: {3 * (animationConfig.u_segments + 1) * (animationConfig.v_segments + 1)}</div>
      </div>
    </div>
  );
};

export default OptimizedThreeJSVisualization;
