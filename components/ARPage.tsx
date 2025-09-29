// 




'use client';

import { useEffect, useRef } from 'react';

// TypeScript: let compiler know about global window.AFRAME
declare global {
  interface Window {
    AFRAME?: any;
  }
}

// Mock ARGO float data
const mockFloats = [
  {
    id: 'A1',
    temperature: 28.5,
    salinity: 35.2,
    depth: 1000,
    region: 'Arabian Sea',
    lastUpdate: '2 min ago',
  },
  {
    id: 'A2',
    temperature: 26.8,
    salinity: 34.9,
    depth: 1500,
    region: 'Pacific Ocean',
    lastUpdate: '5 min ago',
  },
];

export default function ARPage() {
  const sceneRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Only load scripts client-side and once
    if (typeof window !== 'undefined' && !window.AFRAME) {
      const aframeScript = document.createElement('script');
      aframeScript.src = 'https://aframe.io/releases/1.3.0/aframe.min.js';
      aframeScript.async = true;
      document.head.appendChild(aframeScript);

      const arjsScript = document.createElement('script');
      arjsScript.src = 'https://cdn.jsdelivr.net/gh/AR-js-org/AR.js/aframe/build/aframe-ar.js';
      arjsScript.async = true;
      document.head.appendChild(arjsScript);
    }
  }, []);

  // Build marker entity HTML for floats
  const markerHtml = encodeURIComponent(`
    <a-marker preset="hiro">
      ${mockFloats.map((float, i) => `
        <a-entity 
          position="0 ${i * 1.2 + 0.5} 0" 
          scale="0.4 0.4 0.4"
        >
          <a-box color="#0ea5e9"></a-box>
          <a-entity
            position="0 0.4 0"
            text="value: ${float.id}; color: #fff; width: 4;"
          ></a-entity>
          <a-entity
            position="0 0.2 0"
            text="value: T: ${float.temperature}°C, S: ${float.salinity} PSU; color: #bae6fd; width: 4;"
          ></a-entity>
          <a-entity
            position="0 0 0"
            text="value: Depth: ${float.depth}m; color: #fbbf24; width: 4;"
          ></a-entity>
          <a-entity
            position="0 -0.2 0"
            text="value: Region: ${float.region}; color: #2dd4bf; width: 4;"
          ></a-entity>
        </a-entity>
      `).join('\n')}
    </a-marker>
  `);

  return (
    <div className="w-full h-[90vh] flex flex-col items-center justify-center bg-black">
      <h2 className="text-xl font-semibold text-white mb-2">
        Augmented Reality Ocean Data (Demo)
      </h2>
      <p className="text-gray-300 text-sm mb-4 max-w-xl text-center px-3">
        Point your camera at a Hiro marker (print from{' '}
        <a
          href="https://hiro-marker-tutorial.ar-js-org.vercel.app/img/hiro.png"
          className="underline text-blue-400"
          target="_blank"
          rel="noopener noreferrer"
        >
          here
        </a>
        ) to view real ocean floats in AR.
      </p>
      <div
        ref={sceneRef}
        style={{ width: '100%', height: '80vh' }}
        dangerouslySetInnerHTML={{
          __html: `
            <a-scene 
              embedded 
              vr-mode-ui="enabled: false" 
              renderer="logarithmicDepthBuffer: true;"
              arjs="sourceType: webcam; debugUIEnabled: false;"
              style="width: 100%; height: 80vh; background: transparent"
            >
              ${decodeURIComponent(markerHtml)}
              <a-entity camera></a-entity>
            </a-scene>
          `,
        }}
      />
    </div>
  );
}
