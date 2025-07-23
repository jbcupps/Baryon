
'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Atom, Zap, RotateCw, Table, Info } from 'lucide-react';
import ThreeJSVisualization from './three-js-visualization';
import ControlPanel from './control-panel';
import AnalysisSection from './analysis-section';
import MathFormulas from './math-formulas';

const SKBVisualizationApp = () => {
  const [selectedPreset, setSelectedPreset] = useState('proton');
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showFlux, setShowFlux] = useState(true);
  const [showRotation, setShowRotation] = useState(true);

  return (
    <div className="skb-container py-6">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Atom className="w-8 h-8 text-blue-600" />
          <h1 className="text-3xl lg:text-4xl font-bold text-slate-900">
            SKB Baryon Visualization
          </h1>
        </div>
        <p className="text-lg text-slate-600 max-w-4xl mx-auto leading-relaxed">
          Interactive mathematical modeling tool for visualizing baryon formation in the 
          Spacetime Klein Bottle hypothesis. Explore how quarks merge to form stable particles 
          through topological defect dynamics.
        </p>
        <div className="flex items-center justify-center gap-4 mt-4">
          <Badge variant="secondary" className="flex items-center gap-1">
            <Zap className="w-3 h-3" />
            3D Klein Bottle Visualization
          </Badge>
          <Badge variant="secondary" className="flex items-center gap-1">
            <RotateCw className="w-3 h-3" />
            Real-time Animation
          </Badge>
          <Badge variant="secondary" className="flex items-center gap-1">
            <Table className="w-3 h-3" />
            Mathematical Analysis
          </Badge>
        </div>
      </div>

      <Tabs defaultValue="visualization" className="w-full">
        <TabsList className="grid w-full grid-cols-4 mb-6">
          <TabsTrigger value="visualization" className="flex items-center gap-2">
            <Atom className="w-4 h-4" />
            3D Visualization
          </TabsTrigger>
          <TabsTrigger value="mathematics" className="flex items-center gap-2">
            <Zap className="w-4 h-4" />
            Mathematics
          </TabsTrigger>
          <TabsTrigger value="analysis" className="flex items-center gap-2">
            <Table className="w-4 h-4" />
            Analysis
          </TabsTrigger>
          <TabsTrigger value="about" className="flex items-center gap-2">
            <Info className="w-4 h-4" />
            About SKB
          </TabsTrigger>
        </TabsList>

        <TabsContent value="visualization" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Control Panel */}
            <div className="lg:col-span-1">
              <ControlPanel
                selectedPreset={selectedPreset}
                setSelectedPreset={setSelectedPreset}
                isPlaying={isPlaying}
                setIsPlaying={setIsPlaying}
                progress={progress}
                setProgress={setProgress}
                showFlux={showFlux}
                setShowFlux={setShowFlux}
                showRotation={showRotation}
                setShowRotation={setShowRotation}
              />
            </div>

            {/* 3D Visualization */}
            <div className="lg:col-span-3">
              <Card className="scientific-panel">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Atom className="w-5 h-5" />
                    3D Klein Bottle Merger Animation
                  </CardTitle>
                  <CardDescription>
                    Mathematically accurate representation of sub-SKB (quark) merger dynamics
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="threejs-container">
                    <ThreeJSVisualization
                      selectedPreset={selectedPreset}
                      isPlaying={isPlaying}
                      progress={progress}
                      onProgressChange={setProgress}
                      showFlux={showFlux}
                      showRotation={showRotation}
                    />
                  </div>
                  
                  {/* Progress Display */}
                  <div className="mt-4 space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-slate-600">
                        Merge Progress: {Math.round(progress * 100)}%
                      </span>
                      <span className="text-sm text-slate-500">
                        {selectedPreset === 'proton' ? 'Proton (uud)' : 'Neutron (udd)'} Formation
                      </span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-100"
                        style={{ width: `${progress * 100}%` }}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="mathematics">
          <MathFormulas />
        </TabsContent>

        <TabsContent value="analysis">
          <AnalysisSection />
        </TabsContent>

        <TabsContent value="about">
          <Card className="scientific-panel">
            <CardHeader>
              <CardTitle>About the SKB Hypothesis</CardTitle>
              <CardDescription>
                Spacetime Klein Bottle theory for fundamental particles
              </CardDescription>
            </CardHeader>
            <CardContent className="prose prose-slate max-w-none">
              <p className="text-slate-700 leading-relaxed mb-4">
                The Spacetime Klein Bottle (SKB) hypothesis proposes that fundamental particles 
                are non-orientable topological defects in 4D spacetime. Unlike traditional 
                particle physics models, the SKB framework treats spacetime as the only 
                fundamental entity, with particles emerging as Klein bottle-shaped defects.
              </p>
              
              <h3 className="text-lg font-semibold mt-6 mb-3">Core Postulates</h3>
              <ul className="space-y-2 text-slate-600">
                <li>• Spacetime is the only fundamental entity</li>
                <li>• Particles are non-orientable topological defects with Klein bottle topology</li>
                <li>• Causal Compensation Principle ensures external causality</li>
                <li>• Forces emerge from topological connections (handles)</li>
              </ul>

              <h3 className="text-lg font-semibold mt-6 mb-3">Mathematical Framework</h3>
              <p className="text-slate-700 leading-relaxed mb-4">
                The theory uses advanced topological concepts including Pin⁻ structures, 
                bordism theory, and quaternionic holonomy to predict particle properties. 
                This visualization demonstrates how quarks (individual SKBs) merge to form 
                stable baryons through topologically constrained processes.
              </p>

              <h3 className="text-lg font-semibold mt-6 mb-3">Physical Predictions</h3>
              <p className="text-slate-700 leading-relaxed">
                The SKB hypothesis successfully predicts quark charges, masses, and confinement 
                behavior. The merger animations show how color confinement emerges naturally 
                from the requirement that only topologically compatible Klein bottles can 
                exist in stable configurations.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SKBVisualizationApp;
