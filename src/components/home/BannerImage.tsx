'use client';

import { Suspense, useRef, useEffect, useState } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { useGLTF, useFBX, useTexture, Environment } from '@react-three/drei';
import * as THREE from 'three';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader.js';
import styles from './BannerImage.module.css';

function FlyingModel({ audioRef, isPlaying }: { audioRef: React.MutableRefObject<HTMLAudioElement | null>, isPlaying: boolean }) {
  const materials = useLoader(MTLLoader, '/3dmodel/Airplane_v1_L1.123c4a6fedec-1680-4a36-a228-b0d440a4f280/11803_Airplane_v1_l1.mtl');
  const obj = useLoader(OBJLoader, '/3dmodel/Airplane_v1_L1.123c4a6fedec-1680-4a36-a228-b0d440a4f280/11803_Airplane_v1_l1.obj', (loader) => {
    materials.preload();
    loader.setMaterials(materials);
  });

  const groupRef = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (groupRef.current) {
      // Move perfectly straight from right to left
      groupRef.current.position.x -= delta * 4; // horizontal speed

      // Adjust sound volume based on distance to the center
      if (audioRef && audioRef.current && isPlaying) {
        // Center of screen is 0, max distance before reset is 15
        const distance = Math.abs(groupRef.current.position.x);
        let vol = 1 - (distance / 15);
        if (vol < 0) vol = 0;
        if (vol > 1) vol = 1;
        audioRef.current.volume = vol;
      }

      // Reset position when it goes too far left
      if (groupRef.current.position.x < -15) { // increased bound due to larger scale
        groupRef.current.position.x = 15;
      }
    }
  });

  // Rotate Y by Math.PI to point left, Z by -0.05 to pitch up slightly
  return (
    <group ref={groupRef} position={[11, -0.35, 0]} rotation={[Math.PI / 2, Math.PI, -0.05]}>
      <primitive object={obj} scale={0.003} />
    </group>
  );
}

export default function BannerImage() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false); // Default to paused/muted



  const toggleAudio = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play().then(() => {
          setIsPlaying(true);
        }).catch((err) => {
          console.error("Error playing audio:", err);
        });
      }
    }
  };

  return (
    <section className={styles.section}>
      <audio ref={audioRef} src="/music/document_6062062157497902689.mp3" loop preload="auto" />
      <div className={styles.imageBackground}></div>
      <div className={styles.canvasContainer}>
        <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 10, 5]} intensity={1} />
          <Suspense fallback={null}>
            <FlyingModel audioRef={audioRef} isPlaying={isPlaying} />
            <Environment preset="city" />
          </Suspense>
        </Canvas>
      </div>
      <button className={styles.audioButton} onClick={toggleAudio}>
        {isPlaying ? (
          <>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
              <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
            </svg>
            Pause Sound
          </>
        ) : (
          <>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
              <line x1="23" y1="9" x2="17" y2="15"></line>
              <line x1="17" y1="9" x2="23" y2="15"></line>
            </svg>
            Play Sound
          </>
        )}
      </button>
    </section>
  );
}
