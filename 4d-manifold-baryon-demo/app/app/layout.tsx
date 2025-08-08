

import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { VisualizationProvider } from '@/contexts/visualization-context'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: '4D Manifold Baryon Visualization - Interactive Mathematical Modeling Tool',
  description: 'Interactive 3D visualization and analysis of baryon formation in the 4D Manifold hypothesis. Explore proton and neutron merger dynamics with mathematically accurate Klein bottle representations.',
  keywords: '4D Manifold, Klein Bottle, Baryon, Proton, Neutron, Particle Physics, Topology, Mathematical Visualization',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/katex.min.css"
          integrity="sha384-GvrOXuhMATgEsSwCs4smul74iXGOixntILdUW9XmUC6+HX0sLNAK3q71HotJqlAn"
          crossOrigin="anonymous"
        />
      </head>
      <body className={inter.className}>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
          <VisualizationProvider>
            {children}
          </VisualizationProvider>
        </div>
      </body>
    </html>
  )
}
