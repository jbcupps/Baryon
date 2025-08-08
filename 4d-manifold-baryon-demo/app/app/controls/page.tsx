
import ControlsPage from '@/components/controls-page';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function Controls() {
  return (
    <main className="w-full">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-end p-2">
          <Button asChild variant="ghost" size="sm">
            <Link href="/docs">Open Docs</Link>
          </Button>
        </div>
      </div>
      <ControlsPage />
    </main>
  );
}
