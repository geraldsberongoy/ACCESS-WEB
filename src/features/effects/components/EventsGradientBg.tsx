"use client"

import { ShaderGradientCanvas, ShaderGradient } from "@shadergradient/react"

export default function EventsGradientBg() {
  return (
    <ShaderGradientCanvas
      style={{
        width: '100%',
        height: '100%',
      }}
      lazyLoad={undefined}
      
      fov={45}
      pixelDensity={1}
      pointerEvents="none"
    >
      <ShaderGradient
        animate="on"
        type="waterPlane"
        wireframe={false}
        shader="defaults"
        uTime={0.2}
        uSpeed={0.1}
        uStrength={2.4}
        uDensity={1.1}
        uFrequency={5.5}
        uAmplitude={0}
        positionX={-0.5}
        positionY={0.1}
        positionZ={0}
        rotationX={0}
        rotationY={0}
        rotationZ={235}
        color1="#ff0505"
        color2="#ff6300"
        color3="#000000"
        reflection={0.1}

        // View (camera) props
        cAzimuthAngle={180}
        cPolarAngle={115}
        cDistance={3.9}
        cameraZoom={1}

        // Effect props
        lightType="3d"
        brightness={1.1}
        envPreset="city"
        grain="off"

        // Tool props
        toggleAxis={undefined}
        zoomOut={undefined}
        hoverState=""

        // Optional - if using transition features
        enableTransition={false}
      />
    </ShaderGradientCanvas>
  )
}
