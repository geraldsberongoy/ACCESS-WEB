"use client"

import { useEffect, useRef } from "react";

export default function Crystal() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    // Dynamically load Three.js
    const script = document.createElement("script");
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js";
    script.onload = () => initScene(mount);
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  return (
    <div
      ref={mountRef}
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        overflow: "hidden",
      }}
    />
  );
}

function initScene(mount: HTMLDivElement) {
  const THREE = (window as any).THREE;

  // Renderer
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(mount.clientWidth, mount.clientHeight);
  renderer.setClearColor(0x000000, 0);
  mount.appendChild(renderer.domElement);

  // Scene & Camera
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(50, mount.clientWidth / mount.clientHeight, 0.1, 100);
  camera.position.set(0, 0, 14);

  // Lighting
  const ambient = new THREE.AmbientLight(0xffffff, 0.3);
  scene.add(ambient);

  const lights = [
    { color: 0xffffff, intensity: 2.5, pos: [5, 8, 6] },
    { color: 0x8866ff, intensity: 1.5, pos: [-6, -4, 4] },
    { color: 0xff6644, intensity: 1.0, pos: [4, -6, -3] },
    { color: 0x44aaff, intensity: 1.2, pos: [-5, 6, -4] },
  ];
  lights.forEach(({ color, intensity, pos }) => {
    const light = new THREE.PointLight(color, intensity, 30);
    light.position.set(...(pos as [number, number, number]));
    scene.add(light);
  });

  // Crystal material factory
  function makeMaterial(hue: number) {
    return new THREE.MeshPhysicalMaterial({
      color: new THREE.Color().setHSL(hue, 0.3, 0.55),
      metalness: 0.1,
      roughness: 0.05,
      transmission: 0.88,
      thickness: 1.2,
      ior: 2.1,
      reflectivity: 1.0,
      transparent: true,
      opacity: 0.92,
      envMapIntensity: 1.5,
      clearcoat: 1.0,
      clearcoatRoughness: 0.05,
      iridescence: 1.0,
      iridescenceIOR: 1.8,
      iridescenceThicknessRange: [100, 800],
      side: THREE.DoubleSide,
    });
  }

  // Octahedron geometry (diamond-like)
  function makeOctahedron(size: number, hue: number) {
    const geo = new THREE.OctahedronGeometry(size, 0);
    // Flatten slightly to look more like a gem/dice
    geo.scale(1, 0.75, 1);
    const mat = makeMaterial(hue);
    const mesh = new THREE.Mesh(geo, mat);

    // Wireframe edge accent
    const edgeGeo = new THREE.EdgesGeometry(geo);
    const edgeMat = new THREE.LineBasicMaterial({
      color: new THREE.Color().setHSL(hue, 0.6, 0.85),
      transparent: true,
      opacity: 0.35,
    });
    const edges = new THREE.LineSegments(edgeGeo, edgeMat);
    mesh.add(edges);

    return mesh;
  }

  // Crystal configs: [x, y, z, size, hue, speedX, speedY, speedZ, floatAmp, floatSpeed]
  type CrystalConfig = {
    x: number; y: number; z: number;
    size: number; hue: number;
    sx: number; sy: number; sz: number;
    fa: number; fs: number;
    phase: number;
  };

  const configs: CrystalConfig[] = [
    { x: -4.5, y:  2.0, z:  0.0, size: 1.8, hue: 0.62, sx: 0.003, sy: 0.005, sz: 0.002, fa: 0.4, fs: 0.7, phase: 0.0 },
    { x: -6.5, y:  3.5, z: -1.5, size: 0.8, hue: 0.65, sx: 0.006, sy: 0.003, sz: 0.004, fa: 0.3, fs: 0.9, phase: 1.2 },
    { x:  2.5, y:  0.5, z:  1.0, size: 1.0, hue: 0.58, sx: 0.004, sy: 0.006, sz: 0.003, fa: 0.35,fs: 0.8, phase: 2.1 },
    { x: -5.0, y: -2.5, z:  0.5, size: 0.85,hue: 0.60, sx: 0.005, sy: 0.004, sz: 0.005, fa: 0.25,fs: 1.0, phase: 0.7 },
    { x:  1.0, y: -2.8, z: -0.5, size: 0.95,hue: 0.55, sx: 0.003, sy: 0.007, sz: 0.002, fa: 0.3, fs: 0.75,phase: 3.0 },
    { x:  4.5, y: -3.2, z:  0.8, size: 1.2, hue: 0.63, sx: 0.006, sy: 0.003, sz: 0.006, fa: 0.45,fs: 0.65,phase: 1.8 },
  ];

  const meshes = configs.map((c) => {
    const mesh = makeOctahedron(c.size, c.hue);
    mesh.position.set(c.x, c.y, c.z);
    // Random initial rotation
    mesh.rotation.set(
      Math.random() * Math.PI,
      Math.random() * Math.PI,
      Math.random() * Math.PI
    );
    scene.add(mesh);
    return { mesh, config: c, baseY: c.y };
  });

  // Env map for reflections (simple gradient env)
  const pmremGenerator = new THREE.PMREMGenerator(renderer);
  const envScene = new THREE.Scene();
  envScene.background = new THREE.Color(0x111122);
  const envTexture = pmremGenerator.fromScene(envScene).texture;
  scene.environment = envTexture;

  // Animation
  let frameId: number;
  let t = 0;

  function animate() {
    frameId = requestAnimationFrame(animate);
    t += 0.01;

    meshes.forEach(({ mesh, config, baseY }) => {
      mesh.rotation.x += config.sx;
      mesh.rotation.y += config.sy;
      mesh.rotation.z += config.sz;
      mesh.position.y = baseY + Math.sin(t * config.fs + config.phase) * config.fa;
      mesh.position.x = config.x + Math.cos(t * config.fs * 0.5 + config.phase) * 0.12;
    });

    renderer.render(scene, camera);
  }

  animate();

  // Resize handler
  function onResize() {
    const w = mount.clientWidth;
    const h = mount.clientHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  }
  window.addEventListener("resize", onResize);

  // Cleanup stored on mount element
  (mount as any)._cleanup = () => {
    cancelAnimationFrame(frameId);
    window.removeEventListener("resize", onResize);
    renderer.dispose();
    mount.removeChild(renderer.domElement);
  };
}