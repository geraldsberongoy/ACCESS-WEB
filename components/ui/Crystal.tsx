"use client"

import { useEffect, useRef } from "react"
import * as THREE from "three"

const iridVertexShader = `
  varying vec3 vNormal;
  varying vec3 vViewDir;
  varying vec3 vWorldPos;
  varying vec2 vUv;

  void main() {
    vUv = uv;
    vec4 worldPos = modelMatrix * vec4(position, 1.0);
    vWorldPos = worldPos.xyz;
    vNormal = normalize(normalMatrix * normal);
    vec3 cameraPos = cameraPosition;
    vViewDir = normalize(cameraPos - worldPos.xyz);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

const iridFragmentShader = `
  varying vec3 vNormal;
  varying vec3 vViewDir;
  varying vec3 vWorldPos;
  varying vec2 vUv;

  uniform float uTime;
  uniform float uIridStrength;

  float fresnel(vec3 viewDir, vec3 normal, float power) {
    return pow(1.0 - abs(dot(viewDir, normal)), power);
  }

  vec3 rainbow(float t) {
    t = fract(t);
    vec3 c = vec3(0.0);
    c.r = smoothstep(0.0, 0.5, t) - smoothstep(0.5, 1.0, t);
    c.g = smoothstep(0.25, 0.75, t) - smoothstep(0.75, 1.0, t);
    c.b = smoothstep(0.5, 1.0, t);
    c += vec3(smoothstep(0.0, 0.25, t)) * vec3(0.2, 0.0, 0.5);
    return clamp(c, 0.0, 1.0);
  }

  void main() {
    vec3 n = normalize(vNormal);
    vec3 v = normalize(vViewDir);

    float fres = fresnel(v, n, 2.5);
    float fresSharp = fresnel(v, n, 5.0);

    float angle = dot(v, n);
    float iridAngle = angle * 0.5 + 0.5 + uTime * 0.03;
    vec3 iridColor = rainbow(iridAngle + uIridStrength * 0.2);
    vec3 iridColor2 = rainbow(iridAngle + 0.15);

    vec3 baseColor = vec3(0.04, 0.06, 0.08);
    float faceDark = max(0.0, dot(n, vec3(0.0, 1.0, 0.0))) * 0.3;
    baseColor += faceDark * vec3(0.02, 0.03, 0.05);

    vec3 lightDir = normalize(vec3(-1.0, 2.0, 1.5));
    float spec = pow(max(0.0, dot(reflect(-lightDir, n), v)), 32.0);
    vec3 specColor = vec3(1.0, 0.95, 0.9) * spec * 0.8;

    float topSpec = pow(max(0.0, dot(reflect(-vec3(0.5, 1.0, 0.5), n), v)), 48.0);
    vec3 topHighlight = vec3(1.0) * topSpec;

    vec3 color = baseColor;
    color += iridColor * fres * 0.9;
    color += iridColor2 * fresSharp * 0.5;
    color += specColor;
    color += topHighlight;

    float alpha = mix(0.55, 0.92, 1.0 - fres * 0.6);

    color += vec3(0.3, 0.5, 0.8) * fresSharp * 0.4;
    color += vec3(0.8, 0.3, 0.2) * fresSharp * 0.25;

    gl_FragColor = vec4(color, alpha);
  }
`

interface PyramidConfig {
  pos: [number, number, number]
  scale: [number, number, number]
  rot: [number, number, number]
  irid: number
}

function buildSquarePyramid(): THREE.BufferGeometry {
  const h = 1.0
  const s = 0.7

  const vertices = new Float32Array([
     0,  h,  0,   -s, -h,  s,    s, -h,  s,
     0,  h,  0,    s, -h,  s,    s, -h, -s,
     0,  h,  0,    s, -h, -s,   -s, -h, -s,
     0,  h,  0,   -s, -h, -s,   -s, -h,  s,
    -s, -h,  s,    s, -h,  s,    s, -h, -s,
    -s, -h,  s,    s, -h, -s,   -s, -h, -s,
  ])

  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute("position", new THREE.BufferAttribute(vertices, 3))
  geometry.computeVertexNormals()
  geometry.setAttribute("uv", new THREE.BufferAttribute(new Float32Array((vertices.length / 3) * 2), 2))

  return geometry
}

export default function Crystal() {
  const mountRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return

    const width = mount.clientWidth
    const height = mount.clientHeight

    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0x000000)

    const camera = new THREE.PerspectiveCamera(55, width / height, 0.1, 100)
    camera.position.set(0, 1.5, 9)
    camera.lookAt(0.5, 0, 0)

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false })
    renderer.setSize(width, height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.2
    mount.appendChild(renderer.domElement)

    const makeMaterial = (iridStrength = 1.0) =>
      new THREE.ShaderMaterial({
        vertexShader: iridVertexShader,
        fragmentShader: iridFragmentShader,
        uniforms: {
          uTime: { value: 0 },
          uIridStrength: { value: iridStrength },
        },
        transparent: true,
        side: THREE.DoubleSide,
        depthWrite: false,
      })

    const configs: PyramidConfig[] = [
      { pos: [-0.8,  0.2,  0],   scale: [2.0,  2.2,  2.0],  rot: [ 0.15,  0.4,  -0.3],  irid: 1.0  },
      { pos: [-4.5,  2.2, -1],   scale: [0.7,  0.75, 0.7],  rot: [ 0.1,   0.6,   0.2],  irid: 0.8  },
      { pos: [ 2.8,  2.0, -0.5], scale: [1.1,  1.2,  1.1],  rot: [-0.1,  -0.5,   0.4],  irid: 1.1  },
      { pos: [ 3.5, -0.3,  0.5], scale: [1.0,  1.1,  1.0],  rot: [ 0.3,   0.3,  -0.2],  irid: 0.9  },
      { pos: [-3.5, -2.5,  0],   scale: [0.9,  1.0,  0.9],  rot: [ 0.2,   0.8,   0.1],  irid: 1.0  },
      { pos: [ 0.5, -2.8,  0.3], scale: [0.85, 0.9,  0.85], rot: [-0.2,   0.5,   0.3],  irid: 0.85 },
      { pos: [ 4.5, -2.5,  0.5], scale: [1.3,  1.4,  1.3],  rot: [ 0.1,  -0.2,  -0.15], irid: 1.2  },
    ]

    const geometry = buildSquarePyramid()
    const pyramids: THREE.Mesh[] = []

    configs.forEach((cfg) => {
      const mat = makeMaterial(cfg.irid)
      const mesh = new THREE.Mesh(geometry, mat)
      mesh.position.set(...cfg.pos)
      mesh.scale.set(...cfg.scale)
      mesh.rotation.set(...cfg.rot)

      mesh.userData.baseRot = { x: cfg.rot[0], y: cfg.rot[1], z: cfg.rot[2] }
      mesh.userData.basePos = { x: cfg.pos[0], y: cfg.pos[1], z: cfg.pos[2] }
      mesh.userData.floatOffset = Math.random() * Math.PI * 2
      mesh.userData.floatSpeed = 0.25 + Math.random() * 0.3
      mesh.userData.rotSpeed = {
        y: (Math.random() - 0.5) * 0.004,
        x: (Math.random() - 0.5) * 0.002,
      }

      scene.add(mesh)
      pyramids.push(mesh)
    })

    const blueLight = new THREE.PointLight(0x4488ff, 1.5, 15)
    blueLight.position.set(-3, 3, 3)
    scene.add(blueLight)

    const orangeLight = new THREE.PointLight(0xff6622, 0.8, 12)
    orangeLight.position.set(4, -2, 2)
    scene.add(orangeLight)

    const whiteLight = new THREE.PointLight(0xffffff, 2.0, 20)
    whiteLight.position.set(0, 5, 5)
    scene.add(whiteLight)

    let frameId: number
    const clock = new THREE.Clock()

    const animate = () => {
      frameId = requestAnimationFrame(animate)
      const t = clock.getElapsedTime()

      pyramids.forEach((mesh) => {
        const { floatOffset, floatSpeed, basePos, baseRot } = mesh.userData
        mesh.position.y = basePos.y + Math.sin(t * floatSpeed + floatOffset) * 0.08
        mesh.rotation.y = baseRot.y + Math.sin(t * 0.2 + floatOffset) * 0.15
        mesh.rotation.x = baseRot.x + Math.sin(t * 0.15 + floatOffset + 1) * 0.05
        ;(mesh.material as THREE.ShaderMaterial).uniforms.uTime.value = t
      })

      blueLight.position.x = -3 + Math.sin(t * 0.3) * 1.5
      blueLight.position.z = 3 + Math.cos(t * 0.3) * 1.5

      renderer.render(scene, camera)
    }
    animate()

    const handleResize = () => {
      const w = mount.clientWidth
      const h = mount.clientHeight
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      renderer.setSize(w, h)
    }
    window.addEventListener("resize", handleResize)

    return () => {
      cancelAnimationFrame(frameId)
      window.removeEventListener("resize", handleResize)
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement)
      renderer.dispose()
    }
  }, [])

  return (
    <div className="relative w-full h-full overflow-hidden bg-black">
      {/* Three.js canvas mount */}
      <div ref={mountRef} className="absolute inset-0 w-full h-full" />

      {/* Radial vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at 50% 50%, transparent 30%, rgba(0,0,0,0.75) 100%)",
        }}
      />
    </div>
  )
}
