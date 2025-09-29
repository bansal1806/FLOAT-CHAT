'use client';

import { useEffect, useRef } from 'react';

// Tell TypeScript about global window.AFRAME
declare global {
  interface Window {
    AFRAME?: any;
  }
}

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

export default function EnhancedARPage() {
  const sceneRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
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

  const markerHtml = encodeURIComponent(`
    <a-marker preset="hiro">
      ${mockFloats.map((float, i) => `
        <a-entity
          position="0 ${i * 1.3 + 0.6} 0"
          animation="property: position; dir: alternate; dur: 2800; easing: easeInOutSine; loop: true; to: 0 ${i * 1.3 + 0.9} 0"
          scale="0.5 0.5 0.5"
        >
          <!-- translucent glowing cube -->
          <a-box
            color="#0ea5e9"
            opacity="0.6"
            material="shader: standard; metalness: 0.7; roughness: 0.2;"
            position="0 0 0"
            depth="0.25"
            height="0.25"
            width="0.25"
            animation="property: rotation; dur: 10000; easing: linear; loop: true; to: 0 360 0"
          ></a-box>

          <!-- glowing outline -->
          <a-entity
            geometry="primitive: box; depth: 0.26; height: 0.26; width: 0.26"
            material="shader: flat; color: #0ea5e9; opacity: 0.1; transparent: true"
            position="0 0 0"
          ></a-entity>

          <!-- floating info text -->
          <a-text
            value="ID: ${float.id}\nT: ${float.temperature}°C\nS: ${float.salinity} PSU\nDepth: ${float.depth}m"
            color="#ffffff"
            align="center"
            position="0 0.4 0"
            width="3"
            anchor="center"
            side="double"
            shader="msdf"
          ></a-text>
        </a-entity>
      `).join('\n')}
    </a-marker>
  `);

  return (
    <div className="w-full h-[90vh] flex flex-col items-center justify-center bg-black text-white">
      <h2 className="text-2xl font-bold mb-4">Enhanced AR Ocean Floats Visualization</h2>
      <p className="max-w-lg text-center mb-8">
        Point your camera to a Hiro marker to view animated, glowing AR ocean floats with detailed data. Print the marker from{' '}
        <a
          href="https://hiro-marker-tutorial.ar-js-org.vercel.app/img/hiro.png"
          className="underline text-blue-400"
          target="_blank"
          rel="noopener noreferrer"
        >
          here
        </a>.
      </p>
      <div
        ref={sceneRef}
        style={{ width: '100%', height: '80vh' }}
        dangerouslySetInnerHTML={{
          __html: `
            <a-scene
              embedded
              vr-mode-ui="enabled: false"
              renderer="logarithmicDepthBuffer: true"
              arjs="sourceType: webcam; debugUIEnabled: false;"
              environment="preset: forest; groundColor: #445; skyColor: #222; horizonColor: #123"
              fog="type: exponential; color: #0d1b2a; density: 0.5"
              style="width: 100%; height: 80vh;"
            >
              <a-entity light="type: directional; color: #0ea5e9; intensity: 1" position="5 10 7"></a-entity>
              <a-entity light="type: ambient; color: #43556a; intensity: 0.7"></a-entity>

              ${decodeURIComponent(markerHtml)}

              <a-entity camera>
                <a-cursor color="#0ea5e9" fuse="true" fuse-timeout="2000"></a-cursor>
              </a-entity>
            </a-scene>
          `,
        }}
      />
    </div>
  );
}
