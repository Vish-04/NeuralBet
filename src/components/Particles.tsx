'use client';

import { useEffect } from 'react';

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    particlesJS: any;
  }
}

export default function Particles() {
  useEffect(() => {
    const loadParticles = async () => {
      try {
        await import('particles.js');

        if (window.particlesJS) {
          window.particlesJS.load(
            'particles-js',
            '/particles.json',
            function () {
              console.log('particles.js loaded');
            }
          );
        }
      } catch (error) {
        console.error('Error loading particles.js:', error);
      }
    };

    loadParticles();
  }, []);

  return (
    <div
      id="particles-js"
      className="h-full"
      style={{
        position: 'absolute',
        left: '0',
        width: '150vw',
        marginLeft: '-50vw',
        top: 0,
        bottom: 0,
        zIndex: 0,
        pointerEvents: 'auto',
      }}
    />
  );
}
