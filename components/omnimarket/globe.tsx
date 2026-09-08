'use client';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Component, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import * as THREE from 'three';
import { Globe2 } from 'lucide-react';
function OrbitalSphere({ moving, color }: { moving: boolean; color: string }) {
 const group = useRef<THREE.Group>(null);
 const positions = useMemo(() => {
  const values: number[] = [];
  for (let row = 1; row < 62; row++) {
   const phi = Math.PI * row / 62;
   const count = Math.floor(124 * Math.sin(phi));
   for (let col = 0; col < count; col++) { const theta = 2 * Math.PI * col / count; values.push(1.42 * Math.sin(phi) * Math.cos(theta), 1.42 * Math.cos(phi), 1.42 * Math.sin(phi) * Math.sin(theta)); }
  }
  return new Float32Array(values);
 }, []);
 useFrame((_, delta) => { if (group.current && moving) group.current.rotation.y += Math.min(delta, .04) * .09; });
 return <group ref={group} rotation={[.15, 0, -.3]}>
   <mesh><sphereGeometry args={[1.405, 48, 32]}/><meshBasicMaterial color="#0c0f10"/></mesh>
   <points><bufferGeometry><bufferAttribute attach="attributes-position" args={[positions, 3]}/></bufferGeometry><pointsMaterial color={color} size={.018} transparent opacity={.68} sizeAttenuation/></points>
   <mesh rotation={[Math.PI / 2.5, .2, .2]}><torusGeometry args={[1.82, .006, 6, 140]}/><meshBasicMaterial color={color} transparent opacity={.55}/></mesh>
   <mesh rotation={[Math.PI / 1.8, -.3, -.4]}><torusGeometry args={[1.96, .004, 6, 140]}/><meshBasicMaterial color={color} transparent opacity={.22}/></mesh>
   <mesh rotation={[0, 0, .5]}><torusGeometry args={[1.44, .003, 6, 120]}/><meshBasicMaterial color={color} transparent opacity={.45}/></mesh>
   {[[1.63,.66,.4],[-1.5,-.6,.76],[.8,-1.25,.8]].map((pos,i) => <mesh key={i} position={pos as [number,number,number]}><sphereGeometry args={[.035,12,12]}/><meshBasicMaterial color={color}/></mesh>)}
 </group>;
}
function Fallback() { return <div className="flex h-full items-center justify-center text-primary/50"><Globe2 className="size-52" strokeWidth={.4}/></div>; }
class SceneBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
 state = { failed: false };
 static getDerivedStateFromError() { return { failed: true }; }
 render() { return this.state.failed ? <Fallback/> : this.props.children; }
}
export default function Globe() {
 const host = useRef<HTMLDivElement>(null);
 const [active, setActive] = useState(false); const [reduced, setReduced] = useState(true); const [color, setColor] = useState('#b8ef72'); const [supported, setSupported] = useState(false);
 useEffect(() => {
  const media = window.matchMedia('(prefers-reduced-motion: reduce)');
  const updateMotion = () => setReduced(media.matches); updateMotion(); media.addEventListener('change', updateMotion);
  setColor(getComputedStyle(document.documentElement).getPropertyValue('--primary').trim());
  try { const canvas = document.createElement('canvas'); const gl = canvas.getContext('webgl2'); setSupported(!!gl); gl?.getExtension('WEBGL_lose_context')?.loseContext(); } catch { setSupported(false); }
  let visible = true;
  const update = () => setActive(visible && !document.hidden);
  const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; update(); });
  if (host.current) observer.observe(host.current);
  document.addEventListener('visibilitychange', update); update();
  return () => { observer.disconnect(); media.removeEventListener('change', updateMotion); document.removeEventListener('visibilitychange', update); };
 }, []);
 return <div ref={host} className="h-full w-full" role="img" aria-label="Interactive 3D global market sphere. Drag to rotate. Decorative visualization, not geographic data.">{supported ? <SceneBoundary><Canvas dpr={[1,1.5]} camera={{ position: [0,0,5.4], fov: 44 }} frameloop={active && !reduced ? 'always' : 'demand'} gl={{ antialias: true, alpha: true }}><OrbitalSphere color={color} moving={active && !reduced}/><OrbitControls enableZoom={false} enablePan={false} enableDamping={!reduced} rotateSpeed={.5}/></Canvas></SceneBoundary> : <Fallback/>}</div>;
}
