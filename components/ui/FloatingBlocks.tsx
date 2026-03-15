"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

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

    // Camera
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

    // Cube material — dark brownish-gray matching the reference design
    const cubeMaterial = new THREE.MeshStandardMaterial({
      color: 0x3a2a2a,
      roughness: 0.55,
      metalness: 0.15,
    });

    // Arc positions — sweeping upper-right to lower-center
    const arcPositions: [number, number, number][] = [
      [3.5,  3.5,  0.0],
      [4.8,  2.2, -0.5],
      [5.2,  0.8,  0.3],
      [4.9, -0.7, -0.2],
      [3.8, -2.0,  0.5],
      [2.5, -3.0, -0.3],
      [4.2,  1.5,  1.5],
      [5.5, -0.2, -1.2],
      [3.0,  2.8,  1.2],
      [4.0, -1.2,  1.0],
    ];

    const sizes = [0.7, 0.85, 0.75, 0.9, 0.8, 0.7, 0.65, 0.8, 0.75, 0.7];

    const cubes: THREE.Mesh[] = [];

    for (let i = 0; i < arcPositions.length; i++) {
      const size = sizes[i];
      const geometry = new THREE.BoxGeometry(size, size, size);
      const mesh = new THREE.Mesh(geometry, cubeMaterial.clone());

      const [x, y, z] = arcPositions[i];
      mesh.position.set(x, y, z);
      mesh.rotation.x = Math.random() * Math.PI;
      mesh.rotation.y = Math.random() * Math.PI;
      mesh.rotation.z = Math.random() * Math.PI * 0.5;
      mesh.castShadow = true;
      mesh.receiveShadow = true;

      mesh.userData.rotX       = (Math.random() - 0.5) * 0.005;
      mesh.userData.rotY       = (Math.random() - 0.5) * 0.008;
      mesh.userData.rotZ       = (Math.random() - 0.5) * 0.004;
      mesh.userData.floatOffset = Math.random() * Math.PI * 2;
      mesh.userData.floatSpeed  = 0.3 + Math.random() * 0.4;
      mesh.userData.baseY       = y;

      scene.add(mesh);
      cubes.push(mesh);
    }

    // Depth fade for far-back cubes
    cubes.forEach((cube) => {
      if (cube.position.z < -0.5) {
        (cube.material as THREE.MeshStandardMaterial).transparent = true;
        (cube.material as THREE.MeshStandardMaterial).opacity = 0.75 + cube.position.z * 0.1;
      }
    });

    // Animation loop
    let frameId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      frameId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      cubes.forEach((cube) => {
        cube.rotation.x += cube.userData.rotX;
        cube.rotation.y += cube.userData.rotY;
        cube.rotation.z += cube.userData.rotZ;

        cube.position.y =
          cube.userData.baseY +
          Math.sin(elapsed * cube.userData.floatSpeed + cube.userData.floatOffset) * 0.12;
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
