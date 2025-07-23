
'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Palette, Info } from 'lucide-react';

interface QCDColorLegendProps {
  selectedPreset: string;
}

const QCDColorLegend: React.FC<QCDColorLegendProps> = ({ selectedPreset }) => {
  const presetData = {
    proton: {
      name: 'Proton (p⁺)',
      quarks: [
        { type: 'u', color: 'Red', hex: '#FF0000', charge: '+2/3' },
        { type: 'u', color: 'Green', hex: '#00FF00', charge: '+2/3' },
        { type: 'd', color: 'Blue', hex: '#0000FF', charge: '-1/3' }
      ],
      totalCharge: '+1',
      colorResult: 'Colorless (White)'
    },
    neutron: {
      name: 'Neutron (n⁰)',
      quarks: [
        { type: 'u', color: 'Red', hex: '#FF0000', charge: '+2/3' },
        { type: 'd', color: 'Green', hex: '#00FF00', charge: '-1/3' },
        { type: 'd', color: 'Blue', hex: '#0000FF', charge: '-1/3' }
      ],
      totalCharge: '0',
      colorResult: 'Colorless (White)'
    }
  };

  const currentData = presetData[selectedPreset as keyof typeof presetData];

  return (
    <Card className="scientific-panel">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Palette className="w-4 h-4" />
          QCD Color Legend
        </CardTitle>
        <CardDescription>
          Quantum Chromodynamics color assignments
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Current Baryon Configuration */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-medium">{currentData.name}</span>
            <Badge variant="outline">{currentData.totalCharge}e</Badge>
          </div>
          
          <div className="space-y-2">
            {currentData.quarks.map((quark, index) => (
              <div key={index} className="flex items-center justify-between p-2 bg-slate-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <div 
                    className="w-4 h-4 rounded-full border-2 border-slate-300"
                    style={{ backgroundColor: quark.hex }}
                  />
                  <span className="font-mono text-sm">{quark.type}-quark</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="text-xs">
                    {quark.color}
                  </Badge>
                  <span className="text-xs text-slate-600">{quark.charge}e</span>
                </div>
              </div>
            ))}
          </div>

          <div className="p-2 bg-green-50 rounded-lg border border-green-200">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-green-800">Color Confinement:</span>
              <Badge variant="default" className="bg-green-600">
                {currentData.colorResult}
              </Badge>
            </div>
            <p className="text-xs text-green-700 mt-1">
              Red + Green + Blue = Colorless (stable)
            </p>
          </div>
        </div>

        <Separator />

        {/* QCD Theory Explanation */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-blue-600" />
            <span className="font-medium text-blue-600">QCD Color Theory</span>
          </div>
          
          <div className="text-sm space-y-2 text-slate-700">
            <p>
              <strong>Color Charge:</strong> Each quark carries one of three color charges 
              (red, green, or blue) - analogous to electric charge but for the strong force.
            </p>
            
            <p>
              <strong>Color Confinement:</strong> Quarks cannot exist in isolation. They must 
              combine in color-neutral (colorless) configurations that sum to "white."
            </p>
            
            <p>
              <strong>Baryon Rule:</strong> All baryons contain exactly one red, one green, 
              and one blue quark, making them colorless and stable.
            </p>
          </div>
        </div>

        <Separator />

        {/* Color Mixing Visualization */}
        <div className="space-y-3">
          <span className="font-medium text-slate-700">Color Mixing</span>
          
          <div className="flex items-center justify-center space-x-2">
            <div className="w-6 h-6 rounded-full bg-red-500 border-2 border-slate-300" />
            <span className="text-lg">+</span>
            <div className="w-6 h-6 rounded-full bg-green-500 border-2 border-slate-300" />
            <span className="text-lg">+</span>
            <div className="w-6 h-6 rounded-full bg-blue-500 border-2 border-slate-300" />
            <span className="text-lg">=</span>
            <div className="w-6 h-6 rounded-full bg-white border-2 border-slate-800" />
          </div>
          
          <p className="text-center text-xs text-slate-600">
            Three color charges combine to form a colorless baryon
          </p>
        </div>

        {/* Educational Note */}
        <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-xs text-blue-800">
            <strong>Educational Note:</strong> The colors used in this visualization are 
            purely representational. Actual quarks do not have visible colors - "color" 
            is a quantum property analogous to electric charge.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default QCDColorLegend;
