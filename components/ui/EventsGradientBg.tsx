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
      
      fov={undefined}
      pixelDensity={1}
      pointerEvents="none"
    >
      <ShaderGradient
        animate="on"
        type="waterPlane"
        wireframe={false}
        shader="defaults"
        uTime={0}
        uSpeed={0.93}
        uStrength={0.9}
        uDensity={2.5}
        uFrequency={0}
        uAmplitude={0}
        positionX={-1.5}
        positionY={0.9}
        positionZ={-0.3}
        rotationX={45}
        rotationY={0}
        rotationZ={0}
        color1="#c03000"
        color2="#f8430a"
        color3="#973305"
        reflection={1}

        // View (camera) props
        cAzimuthAngle={170}
        cPolarAngle={70}
        cDistance={4.4}
        cameraZoom={1}

        // Effect props
        lightType="3d"
        brightness={0.5}
        envPreset="dawn"
        grain="off"

        // Tool props
        toggleAxis={false}
        zoomOut={false}
        hoverState=""

        // Optional - if using transition features
        enableTransition={false}
      />
    </ShaderGradientCanvas>
  )
}
