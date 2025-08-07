'use client';

import React, { useMemo, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Infinity as InfinityIcon } from 'lucide-react';

const formatRootOfUnity = (k: number): string => {
  if (k === 0) return '1';
  if (k === 8) return '-1';
  if (k === 4) return 'i';
  if (k === 12) return '-i';
  return `exp(2πi·${k}/16)`;
};

const BordismEtaDemo: React.FC = () => {
  const [eta, setEta] = useState<number>(0.0);

  const { klass, rootStr } = useMemo(() => {
    const k = ((Math.round(eta * 16) % 16) + 16) % 16;
    return { klass: k, rootStr: formatRootOfUnity(k) };
  }, [eta]);

  return (
    <Card className="scientific-panel">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <InfinityIcon className="w-5 h-5" />
          Fermion Bordism via η-Invariant
        </CardTitle>
        <CardDescription>
          {'Ω₄^{Pin⁻} ≅ Z/16Z with spectral map exp(2πi·η(K))'}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium">η (Dirac operator spectral asymmetry)</span>
            <Badge variant="outline" className="font-mono">{eta.toFixed(3)}</Badge>
          </div>
          <Slider value={[eta]} onValueChange={(vals) => setEta(vals[0] ?? 0)} min={0} max={0.999} step={0.001} />
        </div>

        <Separator />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <div className="text-slate-600">Mapped root of unity</div>
            <div className="mt-1 font-mono">{rootStr}</div>
          </div>
          <div>
            <div className="text-slate-600">Bordism class</div>
            <Badge className="mt-1">[{klass}] ∈ Z/16Z</Badge>
          </div>
          <div>
            <div className="text-slate-600">Examples</div>
            <div className="mt-1 space-y-1 font-mono text-xs">
              <div>η = 0 → class 0</div>
              <div>η ≈ 1/16 → class 1</div>
              <div>η ≈ 1/2 → class 8 (−1)</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BordismEtaDemo;


