#!/usr/bin/env python3
"""
SKB Baryon Visualization Parameter Optimization

This script analyzes and optimizes visualization parameters for sub-SKB (quark) merger 
animation based on physical quantities from the SKB hypothesis.

Physical basis:
- Scale parameters proportional to inverse quark masses
- Flux arrow numbers scaled by charge magnitudes  
- Flux lengths proportional to flux strength |Qq|
- Energy rotation speeds derived from binding energy
- Grid resolution balancing detail vs performance
- Frame counts for smooth animation

Author: SKB Visualization Optimizer
Date: July 22, 2025
"""

import json
import numpy as np
import matplotlib.pyplot as plt
from typing import Dict, List, Tuple, Any
import math

class SKBParameterOptimizer:
    def __init__(self):
        """Initialize with physical constants and quark properties from SKB hypothesis"""
        
        # Physical constants
        self.constants = {
            'c': 2.998e8,  # m/s - speed of light
            'hbar': 1.055e-34,  # J·s - reduced Planck constant
            'e': 1.602e-19,  # C - elementary charge
            'alpha': 1/137.036,  # fine structure constant
            'planck_length': 1.616e-35,  # m
            'mev_to_kg': 1.783e-30,  # conversion factor
        }
        
        # Quark properties from SKB mathematical foundations
        self.quarks = {
            'u': {
                'mass_mev': 2.3,  # MeV/c²
                'charge': 2/3,    # in units of e
                'holonomy_k': 1,
                'delta': 0.10,
                'n_parameter': 1,
                'color_encoding': 'i'  # quaternionic unit
            },
            'd': {
                'mass_mev': 4.8,  # MeV/c²
                'charge': -1/3,   # in units of e
                'holonomy_k': 2,
                'delta': -0.20,
                'n_parameter': 1,
                'color_encoding': 'j'  # quaternionic unit
            }
        }
        
        # Baryon properties
        self.baryons = {
            'proton': {
                'quark_content': ['u', 'u', 'd'],
                'total_mass_mev': 938.3,
                'binding_energy_mev': -928.7,
                'total_charge': 1.0,
                'k_odd_quarks': 1,
                'stability': 'stable'
            },
            'neutron': {
                'quark_content': ['u', 'd', 'd'],
                'total_mass_mev': 939.6,
                'binding_energy_mev': -930.4,
                'total_charge': 0.0,
                'k_odd_quarks': 2,
                'stability': 'stable'
            }
        }
        
        # Current visualization parameters (baseline)
        self.current_params = {
            'total_frames': 100,
            'u_segments': 30,
            'v_segments': 30,
            'base_scale': 0.8,
            'scale_reduction': 0.7,
            'flux_reduction': 0.5,
            'rotation_reduction': 1.0
        }

    def calculate_inverse_mass_scales(self) -> Dict[str, float]:
        """
        Calculate scale parameters proportional to inverse quark masses.
        
        Physical justification:
        In the SKB hypothesis, the Klein bottle scale should be inversely related 
        to mass due to the uncertainty principle: Δx ~ ℏ/(mc)
        
        Returns:
            Dictionary of normalized scale factors for each quark type
        """
        print("=== CALCULATING INVERSE MASS SCALES ===")
        
        # Calculate inverse masses
        inverse_masses = {}
        for quark, props in self.quarks.items():
            inverse_mass = 1.0 / props['mass_mev']
            inverse_masses[quark] = inverse_mass
            print(f"{quark} quark: mass = {props['mass_mev']} MeV/c², inverse = {inverse_mass:.4f}")
        
        # Normalize to reasonable visualization range (0.5 to 1.5)
        max_inverse = max(inverse_masses.values())
        min_inverse = min(inverse_masses.values())
        
        normalized_scales = {}
        for quark, inv_mass in inverse_masses.items():
            # Map to range [0.6, 1.4] with up quark being larger (lighter)
            normalized_scale = 0.6 + 0.8 * (inv_mass - min_inverse) / (max_inverse - min_inverse)
            normalized_scales[quark] = normalized_scale
            
            print(f"{quark} quark normalized scale: {normalized_scale:.3f}")
            print(f"  Physical basis: lighter quarks → larger Klein bottles")
        
        return normalized_scales

    def calculate_flux_arrow_numbers(self) -> Dict[str, int]:
        """
        Calculate flux arrow numbers scaled by charge magnitudes.
        
        Physical justification:
        From flux quantization Q = (1/2π) ∮ F, the number of flux lines
        should be proportional to |Q/e| to represent charge density.
        
        Returns:
            Dictionary of flux arrow counts for each quark type
        """
        print("\n=== CALCULATING FLUX ARROW NUMBERS ===")
        
        flux_counts = {}
        base_arrows = 12  # Base number for unit charge
        
        for quark, props in self.quarks.items():
            charge_magnitude = abs(props['charge'])
            # Scale by charge magnitude, minimum 3 arrows for visibility
            arrow_count = max(3, int(base_arrows * charge_magnitude))
            flux_counts[quark] = arrow_count
            
            print(f"{quark} quark: |Q| = {charge_magnitude:.3f}e → {arrow_count} flux arrows")
            print(f"  Physical basis: Q = (1/2π) ∮ F → flux density ∝ |Q|")
        
        return flux_counts

    def calculate_flux_lengths(self) -> Dict[str, float]:
        """
        Calculate flux lengths proportional to flux strength |Qq|.
        
        Physical justification:
        Flux strength relates to the electromagnetic field intensity,
        which should scale with charge magnitude and coupling strength.
        
        Returns:
            Dictionary of flux lengths for each quark type
        """
        print("\n=== CALCULATING FLUX LENGTHS ===")
        
        flux_lengths = {}
        base_length = 0.4  # Base flux length
        
        for quark, props in self.quarks.items():
            charge_magnitude = abs(props['charge'])
            # Include fine structure constant for electromagnetic coupling
            flux_strength = charge_magnitude * math.sqrt(self.constants['alpha'])
            flux_length = base_length * flux_strength
            flux_lengths[quark] = flux_length
            
            print(f"{quark} quark: |Q| = {charge_magnitude:.3f}e")
            print(f"  Flux strength = |Q| × √α = {flux_strength:.4f}")
            print(f"  Flux length = {flux_length:.3f}")
        
        return flux_lengths

    def calculate_energy_rotation_speeds(self) -> Dict[str, Dict[str, float]]:
        """
        Calculate energy rotation speeds derived from binding energy.
        
        Physical justification:
        In SKB hypothesis, energy manifests as rotational motion of Klein bottles.
        Rotation speed should relate to energy-to-mass ratio and binding dynamics.
        
        Returns:
            Dictionary of rotation speeds for each baryon configuration
        """
        print("\n=== CALCULATING ENERGY ROTATION SPEEDS ===")
        
        rotation_speeds = {}
        
        for baryon_name, baryon_props in self.baryons.items():
            print(f"\n{baryon_name.upper()} CONFIGURATION:")
            print(f"  Binding energy: {baryon_props['binding_energy_mev']} MeV")
            
            quark_speeds = {}
            binding_energy_magnitude = abs(baryon_props['binding_energy_mev'])
            
            for i, quark_type in enumerate(baryon_props['quark_content']):
                quark_mass = self.quarks[quark_type]['mass_mev']
                
                # Energy-to-mass ratio influences rotation speed
                energy_mass_ratio = binding_energy_magnitude / (3 * quark_mass)  # Divide by 3 quarks
                
                # Base rotation speed scaled by energy-mass ratio
                base_speed = 0.08  # Base rotation speed
                rotation_speed = base_speed * math.sqrt(energy_mass_ratio / 100)  # Normalize
                
                # Lighter quarks rotate faster (inverse mass relationship)
                mass_factor = 1.0 / math.sqrt(quark_mass / 2.3)  # Normalize to up quark
                final_speed = rotation_speed * mass_factor
                
                quark_speeds[f"{quark_type}_{i+1}"] = final_speed
                
                print(f"  {quark_type} quark #{i+1}:")
                print(f"    Mass: {quark_mass} MeV/c²")
                print(f"    Energy/mass ratio: {energy_mass_ratio:.2f}")
                print(f"    Mass factor: {mass_factor:.3f}")
                print(f"    Final rotation speed: {final_speed:.4f}")
            
            rotation_speeds[baryon_name] = quark_speeds
        
        return rotation_speeds

    def calculate_optimal_grid_resolution(self) -> Dict[str, int]:
        """
        Calculate optimal grid resolution balancing detail vs performance.
        
        Physical justification:
        Grid resolution should capture the topological features of Klein bottles
        while maintaining real-time performance. Based on curvature analysis.
        
        Returns:
            Dictionary with optimal u and v segment counts
        """
        print("\n=== CALCULATING OPTIMAL GRID RESOLUTION ===")
        
        # Analyze Klein bottle curvature to determine minimum resolution
        # Klein bottle has characteristic length scales related to its topology
        
        # For real-time visualization, balance detail with performance
        performance_targets = {
            'vertices_per_frame': 10000,  # Target vertex count
            'triangles_per_frame': 18000,  # Target triangle count
            'fps_target': 60  # Target frame rate
        }
        
        # Calculate optimal segments based on vertex budget
        total_quarks = 3  # Three quarks per baryon
        vertices_per_quark = performance_targets['vertices_per_frame'] // total_quarks
        
        # For parametric surface: vertices = (u_segments + 1) × (v_segments + 1)
        # Assume square grid: u_segments = v_segments
        optimal_segments = int(math.sqrt(vertices_per_quark)) - 1
        
        # Ensure minimum quality for topological features
        min_segments = 20  # Minimum for Klein bottle topology
        max_segments = 50  # Maximum for performance
        
        optimal_segments = max(min_segments, min(optimal_segments, max_segments))
        
        print(f"Performance analysis:")
        print(f"  Target vertices per frame: {performance_targets['vertices_per_frame']}")
        print(f"  Vertices per quark: {vertices_per_quark}")
        print(f"  Calculated optimal segments: {optimal_segments}")
        print(f"  Final u_segments = v_segments = {optimal_segments}")
        print(f"  Total vertices per frame: {3 * (optimal_segments + 1)**2}")
        
        return {
            'u_segments': optimal_segments,
            'v_segments': optimal_segments,
            'performance_analysis': performance_targets
        }

    def calculate_optimal_frame_count(self) -> Dict[str, int]:
        """
        Calculate frame counts for smooth animation.
        
        Physical justification:
        Frame count should provide smooth visualization of the merger process
        while representing the physical timescales of strong interactions.
        
        Returns:
            Dictionary with frame counts for different animation aspects
        """
        print("\n=== CALCULATING OPTIMAL FRAME COUNT ===")
        
        # Physical timescales in strong interactions
        strong_interaction_time = 1e-23  # seconds (typical)
        visualization_duration = 10  # seconds (desired animation length)
        
        # Calculate frames for smooth motion
        fps_target = 60  # Target frame rate
        total_frames = fps_target * visualization_duration // 10  # Scale down for web
        
        # Ensure smooth interpolation phases
        phases = {
            'separation_phase': int(0.2 * total_frames),  # Initial separation
            'approach_phase': int(0.5 * total_frames),    # Quarks approaching
            'merger_phase': int(0.2 * total_frames),      # Active merging
            'stabilization_phase': int(0.1 * total_frames) # Final stabilization
        }
        
        print(f"Animation timing analysis:")
        print(f"  Target duration: {visualization_duration} seconds")
        print(f"  Target FPS: {fps_target}")
        print(f"  Total frames: {total_frames}")
        print(f"  Phase breakdown:")
        for phase, frame_count in phases.items():
            percentage = (frame_count / total_frames) * 100
            print(f"    {phase}: {frame_count} frames ({percentage:.1f}%)")
        
        return {
            'total_frames': total_frames,
            'phases': phases,
            'fps_target': fps_target
        }

    def generate_optimized_parameters(self) -> Dict[str, Any]:
        """
        Generate complete optimized parameter set.
        
        Returns:
            Dictionary containing all optimized parameters with physical justification
        """
        print("\n" + "="*60)
        print("GENERATING OPTIMIZED SKB VISUALIZATION PARAMETERS")
        print("="*60)
        
        # Calculate all parameter sets
        mass_scales = self.calculate_inverse_mass_scales()
        flux_arrows = self.calculate_flux_arrow_numbers()
        flux_lengths = self.calculate_flux_lengths()
        rotation_speeds = self.calculate_energy_rotation_speeds()
        grid_resolution = self.calculate_optimal_grid_resolution()
        frame_counts = self.calculate_optimal_frame_count()
        
        # Generate optimized configurations for each baryon
        optimized_config = {
            'metadata': {
                'optimization_date': '2025-07-22',
                'physical_basis': 'SKB hypothesis with topological defect dynamics',
                'optimization_criteria': [
                    'Scale ∝ 1/mass (uncertainty principle)',
                    'Flux arrows ∝ |Q/e| (flux quantization)',
                    'Flux length ∝ |Q|√α (electromagnetic coupling)',
                    'Rotation speed ∝ √(E_binding/mass) (energy-motion relation)',
                    'Grid resolution optimized for topology + performance',
                    'Frame count for smooth physical representation'
                ]
            },
            
            'physical_constants': self.constants,
            'quark_properties': self.quarks,
            'baryon_properties': self.baryons,
            
            'optimized_parameters': {
                'mass_scales': mass_scales,
                'flux_arrows': flux_arrows,
                'flux_lengths': flux_lengths,
                'rotation_speeds': rotation_speeds,
                'grid_resolution': grid_resolution,
                'frame_counts': frame_counts
            }
        }
        
        # Generate specific configurations for proton and neutron
        for baryon_name, baryon_props in self.baryons.items():
            config = self._generate_baryon_config(
                baryon_name, baryon_props, mass_scales, flux_arrows, 
                flux_lengths, rotation_speeds, grid_resolution, frame_counts
            )
            optimized_config[f'{baryon_name}_config'] = config
        
        return optimized_config

    def _generate_baryon_config(self, baryon_name: str, baryon_props: Dict,
                               mass_scales: Dict, flux_arrows: Dict,
                               flux_lengths: Dict, rotation_speeds: Dict,
                               grid_resolution: Dict, frame_counts: Dict) -> Dict:
        """Generate specific configuration for a baryon type"""
        
        quark_content = baryon_props['quark_content']
        config = {
            'name': baryon_name.capitalize(),
            'symbol': 'p⁺' if baryon_name == 'proton' else 'n⁰',
            'quark_content': quark_content,
            'physical_properties': {
                'total_mass_mev': baryon_props['total_mass_mev'],
                'binding_energy_mev': baryon_props['binding_energy_mev'],
                'total_charge': baryon_props['total_charge'],
                'stability': baryon_props['stability']
            },
            
            'optimized_visualization': {
                'scales': [],
                'flux_arrow_counts': [],
                'flux_lengths': [],
                'rotation_speeds': [],
                'colors': [],
                'charges': []
            },
            
            'animation_parameters': {
                'total_frames': frame_counts['total_frames'],
                'u_segments': grid_resolution['u_segments'],
                'v_segments': grid_resolution['v_segments'],
                'phase_breakdown': frame_counts['phases']
            }
        }
        
        # Color mapping for quarks
        color_map = {
            'u': '#FF4444',  # Red for up quarks
            'd': '#4444FF'   # Blue for down quarks
        }
        
        # Generate parameters for each quark in the baryon
        for i, quark_type in enumerate(quark_content):
            config['optimized_visualization']['scales'].append(mass_scales[quark_type])
            config['optimized_visualization']['flux_arrow_counts'].append(flux_arrows[quark_type])
            config['optimized_visualization']['flux_lengths'].append(flux_lengths[quark_type])
            
            # Get rotation speed for this specific quark instance
            speed_key = f"{quark_type}_{i+1}"
            if speed_key in rotation_speeds[baryon_name]:
                config['optimized_visualization']['rotation_speeds'].append(
                    rotation_speeds[baryon_name][speed_key]
                )
            else:
                # Fallback to average speed for this quark type
                avg_speed = np.mean([v for k, v in rotation_speeds[baryon_name].items() 
                                   if k.startswith(quark_type)])
                config['optimized_visualization']['rotation_speeds'].append(avg_speed)
            
            config['optimized_visualization']['colors'].append(color_map[quark_type])
            config['optimized_visualization']['charges'].append(self.quarks[quark_type]['charge'])
        
        return config

    def create_visualization_plots(self, optimized_params: Dict) -> None:
        """Create visualization plots showing parameter relationships"""
        
        fig, ((ax1, ax2), (ax3, ax4)) = plt.subplots(2, 2, figsize=(15, 12))
        fig.suptitle('SKB Baryon Visualization Parameter Optimization', fontsize=16, fontweight='bold')
        
        # Plot 1: Mass vs Scale relationship
        quarks = list(self.quarks.keys())
        masses = [self.quarks[q]['mass_mev'] for q in quarks]
        scales = [optimized_params['optimized_parameters']['mass_scales'][q] for q in quarks]
        
        ax1.scatter(masses, scales, s=100, c=['red', 'blue'], alpha=0.7)
        ax1.plot(masses, scales, 'k--', alpha=0.5)
        for i, q in enumerate(quarks):
            ax1.annotate(f'{q} quark', (masses[i], scales[i]), 
                        xytext=(5, 5), textcoords='offset points')
        ax1.set_xlabel('Quark Mass (MeV/c²)')
        ax1.set_ylabel('Visualization Scale Factor')
        ax1.set_title('Scale ∝ 1/Mass Relationship')
        ax1.grid(True, alpha=0.3)
        
        # Plot 2: Charge vs Flux Arrows
        charges = [abs(self.quarks[q]['charge']) for q in quarks]
        arrows = [optimized_params['optimized_parameters']['flux_arrows'][q] for q in quarks]
        
        ax2.bar(quarks, arrows, color=['red', 'blue'], alpha=0.7)
        ax2.set_xlabel('Quark Type')
        ax2.set_ylabel('Number of Flux Arrows')
        ax2.set_title('Flux Arrows ∝ |Charge|')
        ax2.grid(True, alpha=0.3, axis='y')
        
        # Add charge labels on bars
        for i, (q, arrow_count) in enumerate(zip(quarks, arrows)):
            charge = self.quarks[q]['charge']
            ax2.text(i, arrow_count + 0.2, f'Q = {charge:+.2f}e', 
                    ha='center', va='bottom', fontweight='bold')
        
        # Plot 3: Rotation speeds comparison
        proton_speeds = list(optimized_params['optimized_parameters']['rotation_speeds']['proton'].values())
        neutron_speeds = list(optimized_params['optimized_parameters']['rotation_speeds']['neutron'].values())
        
        x_pos = np.arange(3)
        width = 0.35
        
        ax3.bar(x_pos - width/2, proton_speeds, width, label='Proton (uud)', 
                color='lightcoral', alpha=0.7)
        ax3.bar(x_pos + width/2, neutron_speeds, width, label='Neutron (udd)', 
                color='lightblue', alpha=0.7)
        
        ax3.set_xlabel('Quark Position')
        ax3.set_ylabel('Rotation Speed')
        ax3.set_title('Energy-Derived Rotation Speeds')
        ax3.set_xticks(x_pos)
        ax3.set_xticklabels(['Quark 1', 'Quark 2', 'Quark 3'])
        ax3.legend()
        ax3.grid(True, alpha=0.3, axis='y')
        
        # Plot 4: Performance optimization
        grid_res = optimized_params['optimized_parameters']['grid_resolution']
        frame_count = optimized_params['optimized_parameters']['frame_counts']
        
        categories = ['Grid Resolution\n(u×v segments)', 'Total Frames', 'Target FPS']
        values = [grid_res['u_segments'], frame_count['total_frames'], frame_count['fps_target']]
        colors = ['green', 'orange', 'purple']
        
        bars = ax4.bar(categories, values, color=colors, alpha=0.7)
        ax4.set_ylabel('Count')
        ax4.set_title('Performance Optimization Parameters')
        ax4.grid(True, alpha=0.3, axis='y')
        
        # Add value labels on bars
        for bar, value in zip(bars, values):
            height = bar.get_height()
            ax4.text(bar.get_x() + bar.get_width()/2., height + height*0.01,
                    f'{value}', ha='center', va='bottom', fontweight='bold')
        
        plt.tight_layout()
        plt.savefig('/home/ubuntu/skb_parameter_optimization_analysis.png', 
                   dpi=300, bbox_inches='tight')
        plt.close()
        
        print(f"\nVisualization plots saved to: /home/ubuntu/skb_parameter_optimization_analysis.png")

def main():
    """Main optimization routine"""
    print("SKB Baryon Visualization Parameter Optimization")
    print("=" * 50)
    
    # Initialize optimizer
    optimizer = SKBParameterOptimizer()
    
    # Generate optimized parameters
    optimized_params = optimizer.generate_optimized_parameters()
    
    # Create visualization plots
    optimizer.create_visualization_plots(optimized_params)
    
    # Save optimized parameters to JSON
    output_file = '/home/ubuntu/skb_optimized_parameters.json'
    with open(output_file, 'w') as f:
        json.dump(optimized_params, f, indent=2)
    
    print(f"\n" + "="*60)
    print("OPTIMIZATION COMPLETE")
    print("="*60)
    print(f"Optimized parameters saved to: {output_file}")
    print(f"Analysis plots saved to: /home/ubuntu/skb_parameter_optimization_analysis.png")
    
    # Print summary
    print(f"\nSUMMARY OF OPTIMIZATIONS:")
    print(f"- Scale factors: up={optimized_params['optimized_parameters']['mass_scales']['u']:.3f}, "
          f"down={optimized_params['optimized_parameters']['mass_scales']['d']:.3f}")
    print(f"- Flux arrows: up={optimized_params['optimized_parameters']['flux_arrows']['u']}, "
          f"down={optimized_params['optimized_parameters']['flux_arrows']['d']}")
    print(f"- Grid resolution: {optimized_params['optimized_parameters']['grid_resolution']['u_segments']}×"
          f"{optimized_params['optimized_parameters']['grid_resolution']['v_segments']}")
    print(f"- Total frames: {optimized_params['optimized_parameters']['frame_counts']['total_frames']}")

if __name__ == "__main__":
    main()
