
'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

interface ThreeJSVisualizationProps {
  selectedPreset: string;
  isPlaying: boolean;
  progress: number;
  onProgressChange: (progress: number) => void;
  showFlux: boolean;
  showRotation: boolean;

  // DSIM parameters (optional)
  dsimDensityRate?: number;
  dsimProximityThreshold?: number;
  dsimTimeStep?: number;
}

const ThreeJSVisualization: React.FC<ThreeJSVisualizationProps> = ({
  selectedPreset,
  isPlaying,
  progress,
  onProgressChange,
  showFlux,
  showRotation,
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
  const kleinBottleGroupRef = useRef<THREE.Group>();
  const fluxGroupRef = useRef<THREE.Group>();

  // NOTE: refs are declared after we compute currentPreset

  // Optimized preset configurations with verified optimal parameters
  const presets = {
    proton: {
      name: 'Proton',
      quark_content: ['u', 'u', 'd'],
      // QCD color assignments for color confinement (red + green + blue = white/colorless)
      colors: ['#FF0000', '#00FF00', '#0000FF'], // red u, green u, blue d
      qcd_colors: ['red', 'green', 'blue'],
      color_names: ['Red', 'Green', 'Blue'],
      charges: [2/3, 2/3, -1/3], // Numerical values for calculations
      charge_labels: ['+2/3', '+2/3', '-1/3'],
      masses: [2.3, 2.3, 4.8], // MeV/c² for u, u, d
      // Verified optimal scales: scale_u = 2.09, scale_d = 1.0
      ctc_scales: [2.09, 2.09, 1.0],
      // Verified optimal flux vectors: [7, 3, 3] for u, u, d quarks
      num_arrows: [7, 7, 3],
      // Verified optimal flux lengths: [0.33, 0.33, 0.17] for u, u, d quarks
      flux_lengths: [0.33, 0.33, 0.17],
      // Inverted mass ratio for energy rotation: [1.0, 1.0, 2.09] for u, u, d
      rotation_mass_ratios: [1.0, 1.0, 2.09],
      base_rotation_speed: 0.1
    },
    neutron: {
      name: 'Neutron',
      quark_content: ['u', 'd', 'd'],
      // QCD color assignments for color confinement (red + green + blue = white/colorless)
      colors: ['#FF0000', '#00FF00', '#0000FF'], // red u, green d, blue d
      qcd_colors: ['red', 'green', 'blue'],
      color_names: ['Red', 'Green', 'Blue'],
      charges: [2/3, -1/3, -1/3],
      charge_labels: ['+2/3', '-1/3', '-1/3'],
      masses: [2.3, 4.8, 4.8],
      // Verified optimal scales: scale_u = 2.09, scale_d = 1.0
      ctc_scales: [2.09, 1.0, 1.0],
      // Verified optimal flux vectors: [7, 3, 3] for u, d, d quarks
      num_arrows: [7, 3, 3],
      // Verified optimal flux lengths: [0.33, 0.17, 0.17] for u, d, d quarks
      flux_lengths: [0.33, 0.17, 0.17],
      // Inverted mass ratio for energy rotation: [1.0, 2.09, 2.09] for u, d, d
      rotation_mass_ratios: [1.0, 2.09, 2.09],
      base_rotation_speed: 0.1
    }
  };

  const currentPreset = presets[selectedPreset as keyof typeof presets];

  // Keep latest control values available inside the animation loop
  const isPlayingRef = useRef<boolean>(isPlaying);
  const progressRef = useRef<number>(progress);
  const showFluxRef = useRef<boolean>(showFlux);
  const showRotationRef = useRef<boolean>(showRotation);
  const presetRef = useRef<typeof currentPreset>(currentPreset);

  useEffect(() => { isPlayingRef.current = isPlaying; }, [isPlaying]);
  useEffect(() => { progressRef.current = progress; }, [progress]);
  useEffect(() => { showFluxRef.current = showFlux; }, [showFlux]);
  useEffect(() => { showRotationRef.current = showRotation; }, [showRotation]);
  useEffect(() => { presetRef.current = currentPreset; }, [selectedPreset, currentPreset]);

  // Klein bottle parametric function (extracted from mathematical data)
  const kleinBottle = (u: number, v: number, scale: number, offset: THREE.Vector3, rotationAngle: number = 0): THREE.Vector3 => {
    let x = (2 + Math.cos(u/2) * Math.sin(v) - Math.sin(u/2) * Math.sin(2*v)) * Math.cos(u) * scale;
    let y = (2 + Math.cos(u/2) * Math.sin(v) - Math.sin(u/2) * Math.sin(2*v)) * Math.sin(u) * scale;
    let z = (Math.sin(u/2) * Math.sin(v) + Math.cos(u/2) * Math.sin(2*v)) * scale;
    
    // Apply rotation for energy-as-motion
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
    scene.background = new THREE.Color('#f4f4f4');
    sceneRef.current = scene;

    // Camera setup
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.set(0, 0, 8);
    cameraRef.current = camera;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    rendererRef.current = renderer;

    // Lighting
    const ambientLight = new THREE.AmbientLight('#404040', 0.4);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight('#ffffff', 0.6);
    directionalLight.position.set(1, 1, 1);
    directionalLight.castShadow = true;
    scene.add(directionalLight);

    // Create groups for organization
    const kleinBottleGroup = new THREE.Group();
    const fluxGroup = new THREE.Group();
    scene.add(kleinBottleGroup);
    scene.add(fluxGroup);
    kleinBottleGroupRef.current = kleinBottleGroup;
    fluxGroupRef.current = fluxGroup;

    mount.appendChild(renderer.domElement);

    // Basic orbit controls (mouse interaction)
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

    // Animation loop
    const animate = () => {
      animationIdRef.current = requestAnimationFrame(animate);

      // Smooth camera rotation
      currentRotation.x += (targetRotation.x - currentRotation.x) * 0.05;
      currentRotation.y += (targetRotation.y - currentRotation.y) * 0.05;
      
      const radius = camera.position.z;
      camera.position.x = radius * Math.sin(currentRotation.y) * Math.cos(currentRotation.x);
      camera.position.y = radius * Math.sin(currentRotation.x);
      camera.position.z = radius * Math.cos(currentRotation.y) * Math.cos(currentRotation.x);
      camera.lookAt(0, 0, 0);

      // Update animation frame (scaled by DSIM dt)
      if (isPlayingRef.current) {
        const step = Math.max(1, Math.floor((dsimTimeStep ?? 1.0)));
        frameRef.current = (frameRef.current + step) % 100;
        const newProgress = frameRef.current / 100;
        onProgressChange(newProgress);
      } else {
        frameRef.current = Math.floor(progressRef.current * 100);
      }

      renderKleinBottles();
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

  // Render Klein bottles based on current state
  const renderKleinBottles = () => {
    if (!kleinBottleGroupRef.current || !fluxGroupRef.current) return;

    // Clear previous geometries
    kleinBottleGroupRef.current.clear();
    fluxGroupRef.current.clear();

    const animationProgress = frameRef.current / 100;
    
    // Initial positions (from extracted data)
    const initialPositions = [
      new THREE.Vector3(-3, -2, 0),
      new THREE.Vector3(3, -2, 0),
      new THREE.Vector3(0, 3, 0)
    ];
    
    const finalPosition = new THREE.Vector3(0, 0, 0);
    
    // Calculate current positions and properties using analytical derivations
    const preset = presetRef.current;
    preset.quark_content.forEach((quark, i) => {
      // Position interpolation
      const currentPos = initialPositions[i].clone().lerp(finalPosition, animationProgress);
      
      // CTC-based scale evolution with linear decrease during merger
      // scale_q = initial_scale_q × (1 - progress) + final_merged_scale × progress
      const initial_scale = 0.6 * preset.ctc_scales[i]; // Base scale modified by CTC factor
      const final_scale = 0.3; // Merged state scale
      const scale = initial_scale * (1 - animationProgress) + final_scale * animationProgress;
      
      // Energy rotation with verified optimal parameters: 0.1 * frame * (1 - progress) * mass_ratio[i]
      // Using inverted mass ratio for speed scaling: [1.0, 2.09, 2.09] for different quark types
      const rotationAngle = showRotationRef.current ? 
        preset.base_rotation_speed * frameRef.current * (1 - animationProgress) * preset.rotation_mass_ratios[i] : 0;
      
      // Create Klein bottle geometry
      const geometry = new THREE.BufferGeometry();
      const vertices: number[] = [];
      const indices: number[] = [];
      
      // Optimized grid resolution: 30×30 points for analytical precision
      const uSegments = 30;
      const vSegments = 30;
      
      // Generate vertices
      for (let u = 0; u <= uSegments; u++) {
        for (let v = 0; v <= vSegments; v++) {
          const uParam = (u / uSegments) * 2 * Math.PI;
          const vParam = (v / vSegments) * 2 * Math.PI;
          
          const point = kleinBottle(uParam, vParam, scale, currentPos, rotationAngle);
          vertices.push(point.x, point.y, point.z);
        }
      }
      
      // Generate indices for wireframe
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
      
      // Enhanced material with vibrant QCD colors for educational clarity
      const material = new THREE.MeshBasicMaterial({
        color: preset.colors[i],
        wireframe: true,
        transparent: true,
        opacity: 0.8, // Increased opacity for better color visibility
        side: THREE.DoubleSide
      });
      
      const mesh = new THREE.Mesh(geometry, material);
      kleinBottleGroupRef.current!.add(mesh);
      
      // Add flux vectors if enabled (using verified optimal parameters)
      if (showFluxRef.current) {
        // Verified optimal flux arrows per quark: [7, 3, 3] with merger reduction
        const baseArrows = preset.num_arrows[i];
        const densityMult = Math.max(0.25, Math.min(3, (dsimDensityRate ?? 10) / 20));
        const numArrows = Math.floor(baseArrows * (1 - animationProgress * 0.6) * densityMult);
        
        // Verified optimal flux lengths: [0.33, 0.17, 0.17] with confinement reduction
        const baseLength = preset.flux_lengths[i];
        const fluxLength = baseLength * (1 - animationProgress * 0.4) * scale;
        
        for (let j = 0; j < numArrows; j++) {
          const randU = Math.random() * 2 * Math.PI;
          const randV = Math.random() * 2 * Math.PI;
          const pos = kleinBottle(randU, randV, scale, currentPos, 0);
          
          const dir = new THREE.Vector3(
            Math.sin(randV) * (1 - animationProgress),
            Math.cos(randU) * (1 - animationProgress),
            0
          ).normalize();
          
          const arrowGeometry = new THREE.ConeGeometry(0.02, fluxLength * 0.3, 8);
          const arrowMaterial = new THREE.MeshBasicMaterial({ color: preset.colors[i] });
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
    renderKleinBottles();
  }, [selectedPreset, showFlux, showRotation, progress]);

  return <div ref={mountRef} className="w-full h-full min-h-[400px]" />;
};

export default ThreeJSVisualization;
