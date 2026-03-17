"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

// ─── Box config ───────────────────────────────────────────────────────────────
// Add, remove, or reposition boxes here.
// position : [x, y, z]  — world-space position
// size     : number      — cube edge length
// rotation : [rx, ry, rz] — initial rotation in radians (optional, defaults 0)
// spin     : [x, y, z]  — rotation speed per frame (optional)
// float    : { speed, amplitude } — vertical bob (optional)
const BLOCKS = [
  // ── upper-right dense cluster ──────────────────────────────────────────────
  { position: [ 0,  1.9,  0.0] as [number,number,number], size: 0.90, rotation: [0.8, 0.6, 0.3] as [number,number,number], spin: [ 0.004,  0.006,  0.002] as [number,number,number], float: { speed: 0.50, amplitude: 0.10 } },
  { position: [ 2.2,  2.5,  0.0] as [number,number,number], size: 1.90, rotation: [0.8, 0.6, 0.3] as [number,number,number], spin: [ 0.004,  0.006,  0.002] as [number,number,number], float: { speed: 0.50, amplitude: 0.10 } },
  { position: [ 4.5, 5, -0.4] as [number,number,number], size: 2.10, rotation: [1.1, 0.3, 0.5] as [number,number,number], spin: [ 0.003,  0.005,  0.001] as [number,number,number], float: { speed: 0.42, amplitude: 0.13 } },
  { position: [ 7.0,  3.8, -0.2] as [number,number,number], size: 1.75, rotation: [0.5, 1.2, 0.1] as [number,number,number], spin: [ 0.005,  0.004,  0.003] as [number,number,number], float: { speed: 0.55, amplitude: 0.09 } },
  { position: [ 4.7,  2.8,  1.2] as [number,number,number], size: 1.95, rotation: [0.2, 0.8, 0.6] as [number,number,number], spin: [ 0.003,  0.007,  0.002] as [number,number,number], float: { speed: 0.38, amplitude: 0.11 } },
  { position: [ 6.1,  4.1,  0.5] as [number,number,number], size: 1.65, rotation: [1.3, 0.5, 0.4] as [number,number,number], spin: [ 0.006,  0.003,  0.004] as [number,number,number], float: { speed: 0.60, amplitude: 0.08 } },
  { position: [ 7.5,  2.2, -0.8] as [number,number,number], size: 1.60, rotation: [0.7, 1.1, 0.2] as [number,number,number], spin: [ 0.004,  0.005,  0.003] as [number,number,number], float: { speed: 0.48, amplitude: 0.10 } },

  // ── mid-right sweep ────────────────────────────────────────────────────────
  { position: [ 6.9,  0.8,  0.3] as [number,number,number], size: 2.05, rotation: [0.4, 0.9, 0.2] as [number,number,number], spin: [ 0.003,  0.005,  0.002] as [number,number,number], float: { speed: 0.45, amplitude: 0.12 } },
  { position: [ 5.9,  1.5,  1.5] as [number,number,number], size: 1.95, rotation: [0.6, 0.4, 0.8] as [number,number,number], spin: [ 0.002,  0.006,  0.003] as [number,number,number], float: { speed: 0.35, amplitude: 0.14 } },
  { position: [ 7.2, -0.2, -1.2] as [number,number,number], size: 1.95, rotation: [1.0, 0.2, 0.5] as [number,number,number], spin: [ 0.005,  0.003,  0.002] as [number,number,number], float: { speed: 0.52, amplitude: 0.11 } },
  { position: [ 6.6, -0.7, -0.2] as [number,number,number], size: 2.05, rotation: [0.3, 1.0, 0.4] as [number,number,number], spin: [ 0.004,  0.004,  0.002] as [number,number,number], float: { speed: 0.40, amplitude: 0.13 } },

  // ── lower sweep to center ──────────────────────────────────────────────────
  { position: [ 5.7, -3.2,  1.0] as [number,number,number], size: 2.05, rotation: [0.9, 0.7, 0.1] as [number,number,number], spin: [ 0.003,  0.005,  0.001] as [number,number,number], float: { speed: 0.44, amplitude: 0.12 } },
  { position: [ 5.5, -4.0,  0.5] as [number,number,number], size: 1.95, rotation: [0.5, 0.6, 0.7] as [number,number,number], spin: [ 0.004,  0.003,  0.003] as [number,number,number], float: { speed: 0.37, amplitude: 0.10 } },
  { position: [ 4.5, -3.6, -0.4] as [number,number,number], size: 1.90, rotation: [1.2, 0.4, 0.3] as [number,number,number], spin: [ 0.002,  0.006,  0.002] as [number,number,number], float: { speed: 0.50, amplitude: 0.09 } },
  { position: [ 4.2, -6.0, -0.3] as [number,number,number], size: 1.85, rotation: [0.6, 1.1, 0.5] as [number,number,number], spin: [ 0.005,  0.004,  0.001] as [number,number,number], float: { speed: 0.43, amplitude: 0.11 } },
  { position: [ 2, -5.4,  0.6] as [number,number,number], size: 1.75, rotation: [0.3, 0.8, 0.9] as [number,number,number], spin: [ 0.003,  0.005,  0.004] as [number,number,number], float: { speed: 0.56, amplitude: 0.08 } },
  { position: [ 0, -3.4,  0.6] as [number,number,number], size: 1.50, rotation: [0.3, 0.8, 0.9] as [number,number,number], spin: [ 0.003,  0.005,  0.004] as [number,number,number], float: { speed: 0.56, amplitude: 0.08 } },

] satisfies BlockConfig[];

interface BlockConfig {
  position:  [number, number, number];
  size:      number;
  rotation?: [number, number, number];
  spin?:     [number, number, number];
  float?:    { speed: number; amplitude: number };
}
// ──────────────────────────────────────────────────────────────────────────────

export default function FloatingBlocks() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const width = mount.clientWidth;
    const height = mount.clientHeight;

    // Scene — no background so the hero image shows through
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x000000, 0.08);

    // Camera — left-offset, looking right to frame the arc
    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 100);
    camera.position.set(-3, 0, 8);
    camera.lookAt(2, 0, 0);

    // Renderer — alpha:true keeps the canvas transparent
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.15);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 2.5);
    keyLight.position.set(-4, 6, 4);
    keyLight.castShadow = true;
    scene.add(keyLight);

    const fillLight = new THREE.PointLight(0xffddaa, 0.5, 20);
    fillLight.position.set(3, -2, 3);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0xaaaacc, 0.8);
    rimLight.position.set(5, -3, -5);
    scene.add(rimLight);

    // Build meshes from config
    const baseMaterial = new THREE.MeshStandardMaterial({
      color: 0x3a2a2a,
      roughness: 0.55,
      metalness: 0.15,
    });

    const meshes = BLOCKS.map((cfg) => {
      const mesh = new THREE.Mesh(
        new THREE.BoxGeometry(cfg.size, cfg.size, cfg.size),
        baseMaterial.clone(),
      );
      mesh.position.set(...cfg.position);
      if (cfg.rotation) {
        mesh.rotation.set(...cfg.rotation);
      }
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      scene.add(mesh);
      return { mesh, cfg };
    });

    // Animation loop
    let frameId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      frameId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      meshes.forEach(({ mesh, cfg }, i) => {
        const [sx = 0, sy = 0, sz = 0] = cfg.spin ?? [0, 0, 0];
        mesh.rotation.x += sx;
        mesh.rotation.y += sy;
        mesh.rotation.z += sz;

        if (cfg.float) {
          const baseY = cfg.position[1];
          mesh.position.y =
            baseY + Math.sin(elapsed * cfg.float.speed + i) * cfg.float.amplitude;
        }
      });

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("resize", handleResize);
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      aria-hidden="true"
    />
  );
}
