'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Float, RoundedBox } from '@react-three/drei';

export default function Robot3D({ hovered }: { hovered: boolean }) {
  const group = useRef<THREE.Group>(null);
  const headGroup = useRef<THREE.Group>(null);
  const leftEye = useRef<THREE.Mesh>(null);
  const rightEye = useRef<THREE.Mesh>(null);

  // Bobbing and looking animation
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (group.current) {
      group.current.position.y = Math.sin(t * 2) * 0.1;
      
      // If hovered, look at mouse, else look around slowly
      if (hovered) {
        const x = (state.pointer.x * state.viewport.width) / 2;
        const y = (state.pointer.y * state.viewport.height) / 2;
        headGroup.current?.lookAt(x, y, 5);
      } else {
        headGroup.current?.rotation.set(
          Math.sin(t * 0.5) * 0.1,
          Math.sin(t * 0.3) * 0.2,
          0
        );
      }
    }

    // Blink eyes occasionally
    if (leftEye.current && rightEye.current) {
      const blink = Math.sin(t * 4) > 0.95 ? 0.1 : 1;
      leftEye.current.scale.y = blink;
      rightEye.current.scale.y = blink;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
      <group ref={group} scale={1.5}>
        <group ref={headGroup}>
          {/* Head */}
          <RoundedBox args={[1.2, 1, 1.2]} radius={0.2} smoothness={4} position={[0, 0.2, 0]}>
            <meshStandardMaterial color="#ffffff" roughness={0.2} metalness={0.1} />
          </RoundedBox>

          {/* Screen / Face */}
          <RoundedBox args={[0.9, 0.5, 1.25]} radius={0.05} smoothness={4} position={[0, 0.2, 0.02]}>
            <meshStandardMaterial color="#0f172a" roughness={0.5} />
          </RoundedBox>

          {/* Eyes */}
          <mesh ref={leftEye} position={[-0.2, 0.2, 0.65]}>
            <capsuleGeometry args={[0.08, 0.05, 4, 8]} />
            <meshBasicMaterial color="#38bdf8" />
          </mesh>
          <mesh ref={rightEye} position={[0.2, 0.2, 0.65]}>
            <capsuleGeometry args={[0.08, 0.05, 4, 8]} />
            <meshBasicMaterial color="#38bdf8" />
          </mesh>

          {/* Antenna Base */}
          <mesh position={[0, 0.75, 0]}>
            <cylinderGeometry args={[0.1, 0.1, 0.1, 16]} />
            <meshStandardMaterial color="#94a3b8" />
          </mesh>

          {/* Antenna Rod */}
          <mesh position={[0, 0.9, 0]}>
            <cylinderGeometry args={[0.02, 0.02, 0.3, 16]} />
            <meshStandardMaterial color="#94a3b8" />
          </mesh>

          {/* Antenna Tip */}
          <mesh position={[0, 1.05, 0]}>
            <sphereGeometry args={[0.08, 16, 16]} />
            <meshStandardMaterial color="#38bdf8" emissive="#38bdf8" emissiveIntensity={0.5} />
          </mesh>
          
          {/* Ear left */}
          <mesh position={[-0.65, 0.2, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.2, 0.2, 0.1, 16]} />
            <meshStandardMaterial color="#e2e8f0" />
          </mesh>

          {/* Ear right */}
          <mesh position={[0.65, 0.2, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.2, 0.2, 0.1, 16]} />
            <meshStandardMaterial color="#e2e8f0" />
          </mesh>
        </group>

        {/* Neck */}
        <mesh position={[0, -0.4, 0]}>
          <cylinderGeometry args={[0.3, 0.3, 0.2, 16]} />
          <meshStandardMaterial color="#94a3b8" />
        </mesh>
        
        {/* Base Body */}
        <RoundedBox args={[1.1, 0.6, 1.1]} radius={0.1} smoothness={4} position={[0, -0.7, 0]}>
          <meshStandardMaterial color="#ffffff" roughness={0.2} metalness={0.1} />
        </RoundedBox>
        
        {/* Core glowing ring */}
        <mesh position={[0, -0.7, 0.56]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.2, 0.04, 16, 32]} />
          <meshStandardMaterial color="#38bdf8" emissive="#38bdf8" emissiveIntensity={0.8} />
        </mesh>
      </group>
    </Float>
  );
}
