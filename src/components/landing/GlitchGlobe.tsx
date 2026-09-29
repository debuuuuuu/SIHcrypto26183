'use client';

import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, MeshDistortMaterial, Line, Environment, Html } from '@react-three/drei';
import * as THREE from 'three';
import { NCRP_PRESET_COMPLAINTS } from '@/lib/ncrpRegistry';

export interface GlitchGlobeProps {
  selectedAck?: string | null;
  onSelectNode?: (ack: string) => void;
}

interface GlobeCoreProps {
  globeRef: React.RefObject<THREE.Mesh>;
  wireRef: React.RefObject<THREE.Mesh>;
}

const GlobeCore = ({ globeRef, wireRef }: GlobeCoreProps) => {
  const pointsRef = useRef<THREE.Points>(null);
  
  const geo = useMemo(() => new THREE.SphereGeometry(3, 64, 64), []);
  const largerGeo = useMemo(() => new THREE.SphereGeometry(3.1, 48, 48), []);
  const dotGeo = useMemo(() => new THREE.SphereGeometry(3.2, 80, 80), []);
  
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (globeRef.current) {
      globeRef.current.rotation.x = t * 0.15;
      globeRef.current.rotation.y = t * 0.25;
    }
    if (wireRef.current) {
      wireRef.current.rotation.x = t * 0.15;
      wireRef.current.rotation.y = t * 0.25;
    }
    if (pointsRef.current) {
      pointsRef.current.rotation.x = -t * 0.1;
      pointsRef.current.rotation.y = -t * 0.2;
    }
  });

  return (
    <group>
      {/* Inner Solid Glitch Sphere */}
      <mesh ref={globeRef} geometry={geo}>
        <MeshDistortMaterial
          color="#0a0a0a"
          distort={0.4}
          speed={2}
          roughness={0.6}
          metalness={0.8}
        />
      </mesh>

      {/* Outer Wireframe Glitch Sphere */}
      <mesh ref={wireRef} geometry={largerGeo}>
        <MeshDistortMaterial
          color="#444444"
          distort={0.5}
          speed={2}
          wireframe={true}
          transparent={true}
          opacity={0.3}
        />
      </mesh>

      {/* ASCII/Dot Matrix Particle Sphere */}
      <points ref={pointsRef} geometry={dotGeo}>
        <pointsMaterial
          color="#ffffff"
          size={0.02}
          transparent={true}
          opacity={0.5}
          sizeAttenuation={true}
        />
      </points>
    </group>
  );
};

interface OrbitRingsProps extends GlitchGlobeProps {
  globeRef: React.RefObject<THREE.Mesh>;
  wireRef: React.RefObject<THREE.Mesh>;
}

const OrbitRings = ({ selectedAck, onSelectNode, globeRef, wireRef }: OrbitRingsProps) => {
  const groupRef = useRef<THREE.Group>(null);
  
  // Ref for satellites to rotate them independently
  const sat1Ref = useRef<THREE.Group>(null);
  const sat1bRef = useRef<THREE.Group>(null);
  const sat2Ref = useRef<THREE.Group>(null);
  const sat2bRef = useRef<THREE.Group>(null);
  const sat3Ref = useRef<THREE.Group>(null);
  const sat3bRef = useRef<THREE.Group>(null);

  // Helper to generate coordinates on a specific axis plane
  const getOrbitPoint = (angle: number, radius: number, axis: 'x' | 'y' | 'z') => {
    switch (axis) {
      case 'z': return new THREE.Vector3(Math.cos(angle) * radius, Math.sin(angle) * radius, 0); // XY plane
      case 'y': return new THREE.Vector3(Math.cos(angle) * radius, 0, Math.sin(angle) * radius); // XZ plane
      case 'x': return new THREE.Vector3(0, Math.cos(angle) * radius, Math.sin(angle) * radius); // YZ plane
    }
  };

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (groupRef.current) {
      groupRef.current.rotation.y = t * 0.05;
      groupRef.current.rotation.z = Math.sin(t * 0.1) * 0.1;
    }
    
    // Animate satellites along their orbits exactly matching the rings
    if (sat1Ref.current) {
      sat1Ref.current.position.copy(getOrbitPoint(t * 0.5, 4.5, 'z'));
    }
    if (sat1bRef.current) {
      sat1bRef.current.position.copy(getOrbitPoint(t * 0.5 + Math.PI, 4.5, 'z'));
    }
    if (sat2Ref.current) {
      sat2Ref.current.position.copy(getOrbitPoint(t * 0.3 + 2, 5.8, 'y'));
    }
    if (sat2bRef.current) {
      sat2bRef.current.position.copy(getOrbitPoint(t * 0.3 + 2 + Math.PI, 5.8, 'y'));
    }
    if (sat3Ref.current) {
      sat3Ref.current.position.copy(getOrbitPoint(t * 0.2 + 4, 7.0, 'x'));
    }
    if (sat3bRef.current) {
      sat3bRef.current.position.copy(getOrbitPoint(t * 0.2 + 4 + Math.PI, 7.0, 'x'));
    }
  });

  const ring1 = useMemo(() => {
    const pts = [];
    for (let i = 0; i <= 128; i++) {
      pts.push(getOrbitPoint((i / 128) * Math.PI * 2, 4.5, 'z'));
    }
    return pts;
  }, []);

  const ring2 = useMemo(() => {
    const pts = [];
    for (let i = 0; i <= 128; i++) {
      pts.push(getOrbitPoint((i / 128) * Math.PI * 2, 5.8, 'y'));
    }
    return pts;
  }, []);

  const ring3 = useMemo(() => {
    const pts = [];
    for (let i = 0; i <= 128; i++) {
      pts.push(getOrbitPoint((i / 128) * Math.PI * 2, 7.0, 'x'));
    }
    return pts;
  }, []);

  return (
    <group ref={groupRef} rotation={[Math.PI / 5, -Math.PI / 6, Math.PI / 8]}>
      {/* Dashed Orbits */}
      <Line points={ring1} color="#ffffff" opacity={0.5} transparent lineWidth={1} dashed dashSize={0.1} gapSize={0.15} />
      <Line points={ring2} color="#ffffff" opacity={0.4} transparent lineWidth={1} dashed dashSize={0.15} gapSize={0.2} />
      <Line points={ring3} color="#ffffff" opacity={0.3} transparent lineWidth={1} dashed dashSize={0.2} gapSize={0.3} />
      
      {/* Outer Glow Orbits for depth */}
      <Line points={ring1} color="#888888" opacity={0.2} transparent lineWidth={2} />
      <Line points={ring2} color="#888888" opacity={0.15} transparent lineWidth={2} />
      <Line points={ring3} color="#888888" opacity={0.1} transparent lineWidth={2} />

      {/* Orbiting Satellites / Nodes */}
      <group ref={sat1Ref}>
        <Html center zIndexRange={[100, 0]} occlude={[globeRef, wireRef]}>
          <div onClick={() => onSelectNode?.(NCRP_PRESET_COMPLAINTS[0].ackNumber)} className="flex flex-col items-center cursor-pointer group pointer-events-auto">
            <div className={`relative w-8 h-8 rounded-full border flex items-center justify-center transition-all duration-300 group-hover:scale-110 ${selectedAck === NCRP_PRESET_COMPLAINTS[0].ackNumber ? 'bg-white/10 border-white/80 shadow-[0_0_20px_rgba(255,255,255,0.4)]' : 'border-white/20 bg-black/40 backdrop-blur-sm group-hover:border-white/50'}`}>
              <div className={`w-2 h-2 rounded-full ${selectedAck === NCRP_PRESET_COMPLAINTS[0].ackNumber ? 'bg-white shadow-[0_0_10px_white]' : 'bg-zinc-400 group-hover:bg-white'} transition-colors`} />
              {selectedAck === NCRP_PRESET_COMPLAINTS[0].ackNumber && <div className="absolute inset-0 rounded-full border border-white animate-ping opacity-50" />}
            </div>
            <div className="absolute top-full mt-1 hidden md:flex flex-col items-center opacity-80 group-hover:opacity-100 transition-opacity pointer-events-auto">
              <div className="w-px h-3 bg-gradient-to-b from-white/40 to-transparent" />
              <div className="flex flex-col text-left bg-obsidian-900/95 backdrop-blur-md border border-white/20 p-2.5 rounded-[4px] shadow-[0_10px_30px_rgba(0,0,0,0.8)] w-[160px]">
                <span className="text-[9px] text-zinc-400 font-mono tracking-widest uppercase mb-1">NET // {NCRP_PRESET_COMPLAINTS[0].targetChain}</span>
                <span className="text-[11px] text-white font-mono tracking-wider truncate">{NCRP_PRESET_COMPLAINTS[0].targetAddress}...</span>
                <span className="text-[10px] text-red-400 font-mono mt-1 opacity-90 tracking-widest">${NCRP_PRESET_COMPLAINTS[0].lossAmountUSD.toLocaleString()} USD</span>
              </div>
            </div>
          </div>
        </Html>
      </group>
      
      <group ref={sat1bRef}>
        <Html center zIndexRange={[100, 0]} occlude={[globeRef, wireRef]}>
          <div onClick={() => onSelectNode?.(NCRP_PRESET_COMPLAINTS[0].ackNumber)} className="flex flex-col items-center cursor-pointer group pointer-events-auto">
            <div className={`relative w-6 h-6 rounded-full border flex items-center justify-center transition-all duration-300 group-hover:scale-110 border-white/20 bg-black/40 backdrop-blur-sm group-hover:border-white/50`}>
              <div className={`w-1.5 h-1.5 rounded-full bg-zinc-500 group-hover:bg-white transition-colors`} />
            </div>
            <div className="absolute top-full mt-1 hidden md:flex flex-col items-center opacity-60 group-hover:opacity-100 transition-opacity pointer-events-auto">
              <div className="w-px h-2 bg-gradient-to-b from-white/40 to-transparent" />
              <div className="flex flex-col text-left bg-obsidian-900/80 backdrop-blur-md border border-white/10 p-2 rounded-[4px] shadow-[0_10px_30px_rgba(0,0,0,0.8)] w-[120px]">
                <span className="text-[8px] text-zinc-500 font-mono tracking-widest uppercase mb-1">NODE // LINK</span>
                <span className="text-[9px] text-zinc-300 font-mono tracking-wider truncate">{NCRP_PRESET_COMPLAINTS[0].targetAddress}...</span>
              </div>
            </div>
          </div>
        </Html>
      </group>
      
      <group ref={sat2Ref}>
        <Html center zIndexRange={[100, 0]} occlude={[globeRef, wireRef]}>
          <div onClick={() => onSelectNode?.(NCRP_PRESET_COMPLAINTS[1].ackNumber)} className="flex flex-col items-center cursor-pointer group pointer-events-auto">
            <div className={`relative w-8 h-8 rounded-full border flex items-center justify-center transition-all duration-300 group-hover:scale-110 ${selectedAck === NCRP_PRESET_COMPLAINTS[1].ackNumber ? 'bg-white/10 border-white/80 shadow-[0_0_20px_rgba(255,255,255,0.4)]' : 'border-white/20 bg-black/40 backdrop-blur-sm group-hover:border-white/50'}`}>
              <div className={`w-2 h-2 rounded-full ${selectedAck === NCRP_PRESET_COMPLAINTS[1].ackNumber ? 'bg-white shadow-[0_0_10px_white]' : 'bg-zinc-400 group-hover:bg-white'} transition-colors`} />
              {selectedAck === NCRP_PRESET_COMPLAINTS[1].ackNumber && <div className="absolute inset-0 rounded-full border border-white animate-ping opacity-50" />}
            </div>
            <div className="absolute top-full mt-1 hidden md:flex flex-col items-center opacity-80 group-hover:opacity-100 transition-opacity pointer-events-auto">
              <div className="w-px h-3 bg-gradient-to-b from-white/40 to-transparent" />
              <div className="flex flex-col text-left bg-obsidian-900/95 backdrop-blur-md border border-white/20 p-2.5 rounded-[4px] shadow-[0_10px_30px_rgba(0,0,0,0.8)] w-[160px]">
                <span className="text-[9px] text-zinc-400 font-mono tracking-widest uppercase mb-1">NET // {NCRP_PRESET_COMPLAINTS[1].targetChain}</span>
                <span className="text-[11px] text-white font-mono tracking-wider truncate">{NCRP_PRESET_COMPLAINTS[1].targetAddress}...</span>
                <span className="text-[10px] text-red-400 font-mono mt-1 opacity-90 tracking-widest">${NCRP_PRESET_COMPLAINTS[1].lossAmountUSD.toLocaleString()} USD</span>
              </div>
            </div>
          </div>
        </Html>
      </group>
      
      <group ref={sat2bRef}>
        <Html center zIndexRange={[100, 0]} occlude={[globeRef, wireRef]}>
          <div onClick={() => onSelectNode?.(NCRP_PRESET_COMPLAINTS[1].ackNumber)} className="flex flex-col items-center cursor-pointer group pointer-events-auto">
            <div className={`relative w-6 h-6 rounded-full border flex items-center justify-center transition-all duration-300 group-hover:scale-110 border-white/20 bg-black/40 backdrop-blur-sm group-hover:border-white/50`}>
              <div className={`w-1.5 h-1.5 rounded-full bg-zinc-500 group-hover:bg-white transition-colors`} />
            </div>
            <div className="absolute top-full mt-1 hidden md:flex flex-col items-center opacity-60 group-hover:opacity-100 transition-opacity pointer-events-auto">
              <div className="w-px h-2 bg-gradient-to-b from-white/40 to-transparent" />
              <div className="flex flex-col text-left bg-obsidian-900/80 backdrop-blur-md border border-white/10 p-2 rounded-[4px] shadow-[0_10px_30px_rgba(0,0,0,0.8)] w-[120px]">
                <span className="text-[8px] text-zinc-500 font-mono tracking-widest uppercase mb-1">NODE // LINK</span>
                <span className="text-[9px] text-zinc-300 font-mono tracking-wider truncate">{NCRP_PRESET_COMPLAINTS[1].targetAddress}...</span>
              </div>
            </div>
          </div>
        </Html>
      </group>

      <group ref={sat3Ref}>
        <Html center zIndexRange={[100, 0]} occlude={[globeRef, wireRef]}>
          <div onClick={() => onSelectNode?.(NCRP_PRESET_COMPLAINTS[2].ackNumber)} className="flex flex-col items-center cursor-pointer group pointer-events-auto">
            <div className={`relative w-8 h-8 rounded-full border flex items-center justify-center transition-all duration-300 group-hover:scale-110 ${selectedAck === NCRP_PRESET_COMPLAINTS[2].ackNumber ? 'bg-white/10 border-white/80 shadow-[0_0_20px_rgba(255,255,255,0.4)]' : 'border-white/20 bg-black/40 backdrop-blur-sm group-hover:border-white/50'}`}>
              <div className={`w-2 h-2 rounded-full ${selectedAck === NCRP_PRESET_COMPLAINTS[2].ackNumber ? 'bg-white shadow-[0_0_10px_white]' : 'bg-zinc-400 group-hover:bg-white'} transition-colors`} />
              {selectedAck === NCRP_PRESET_COMPLAINTS[2].ackNumber && <div className="absolute inset-0 rounded-full border border-white animate-ping opacity-50" />}
            </div>
            <div className="absolute top-full mt-1 hidden md:flex flex-col items-center opacity-80 group-hover:opacity-100 transition-opacity pointer-events-auto">
              <div className="w-px h-3 bg-gradient-to-b from-white/40 to-transparent" />
              <div className="flex flex-col text-left bg-obsidian-900/95 backdrop-blur-md border border-white/20 p-2.5 rounded-[4px] shadow-[0_10px_30px_rgba(0,0,0,0.8)] w-[160px]">
                <span className="text-[9px] text-zinc-400 font-mono tracking-widest uppercase mb-1">NET // {NCRP_PRESET_COMPLAINTS[2].targetChain}</span>
                <span className="text-[11px] text-white font-mono tracking-wider truncate">{NCRP_PRESET_COMPLAINTS[2].targetAddress}...</span>
                <span className="text-[10px] text-red-400 font-mono mt-1 opacity-90 tracking-widest">${NCRP_PRESET_COMPLAINTS[2].lossAmountUSD.toLocaleString()} USD</span>
              </div>
            </div>
          </div>
        </Html>
      </group>
      
      <group ref={sat3bRef}>
        <Html center zIndexRange={[100, 0]} occlude={[globeRef, wireRef]}>
          <div onClick={() => onSelectNode?.(NCRP_PRESET_COMPLAINTS[2].ackNumber)} className="flex flex-col items-center cursor-pointer group pointer-events-auto">
            <div className={`relative w-6 h-6 rounded-full border flex items-center justify-center transition-all duration-300 group-hover:scale-110 border-white/20 bg-black/40 backdrop-blur-sm group-hover:border-white/50`}>
              <div className={`w-1.5 h-1.5 rounded-full bg-zinc-500 group-hover:bg-white transition-colors`} />
            </div>
            <div className="absolute top-full mt-1 hidden md:flex flex-col items-center opacity-60 group-hover:opacity-100 transition-opacity pointer-events-auto">
              <div className="w-px h-2 bg-gradient-to-b from-white/40 to-transparent" />
              <div className="flex flex-col text-left bg-obsidian-900/80 backdrop-blur-md border border-white/10 p-2 rounded-[4px] shadow-[0_10px_30px_rgba(0,0,0,0.8)] w-[120px]">
                <span className="text-[8px] text-zinc-500 font-mono tracking-widest uppercase mb-1">NODE // LINK</span>
                <span className="text-[9px] text-zinc-300 font-mono tracking-wider truncate">{NCRP_PRESET_COMPLAINTS[2].targetAddress}...</span>
              </div>
            </div>
          </div>
        </Html>
      </group>
    </group>
  );
};

export const GlitchGlobe = ({ selectedAck, onSelectNode }: GlitchGlobeProps) => {
  const globeRef = useRef<THREE.Mesh>(null);
  const wireRef = useRef<THREE.Mesh>(null);

  return (
    <div className="absolute inset-0 z-0 w-full h-full pointer-events-none opacity-90 flex items-center justify-center">
      <Canvas camera={{ position: [0, 0, 12], fov: 45 }} dpr={[1, 2]}>
        <ambientLight intensity={0.2} />
        <directionalLight position={[10, 10, 5]} intensity={3} color="#ffffff" />
        <directionalLight position={[-10, -10, -5]} intensity={1.5} color="#555555" />
        <GlobeCore globeRef={globeRef} wireRef={wireRef} />
        <OrbitRings selectedAck={selectedAck} onSelectNode={onSelectNode} globeRef={globeRef} wireRef={wireRef} />
        <Environment preset="city" />
      </Canvas>
    </div>
  );
};
