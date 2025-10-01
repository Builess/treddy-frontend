'use client'
import { useEffect, useRef } from "react"
import * as THREE from "three"
import { ARButton } from "three/examples/jsm/webxr/ARButton.js"
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js"

export default function ARViewer() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return

    // Limpiar el contenedor antes de montar un nuevo canvas
    containerRef.current.innerHTML = ""

    // Escena
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera()

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.xr.enabled = true

    // Ajustar tamaño dinámico al contenedor
    const { clientWidth, clientHeight } = containerRef.current
    renderer.setSize(clientWidth, clientHeight)

    containerRef.current.appendChild(renderer.domElement)

    // Botón AR (fuera del contenedor)
    const arButton = ARButton.createButton(renderer, { requiredFeatures: ["local"] })
    document.body.appendChild(arButton)

    // Luz
    scene.add(new THREE.AmbientLight(0xffffff, 1.2))
    const dirLight = new THREE.DirectionalLight(0xffffff, 1)
    dirLight.position.set(2, 4, 5)
    scene.add(dirLight)

    // Modelo
    const loader = new GLTFLoader()
    loader.load("HORNET.glb", (gltf) => {
      gltf.scene.scale.set(0.9, 0.9, 0.9)
      gltf.scene.position.set(0, -0.5, -2)
      scene.add(gltf.scene)
    })

    // Animación
    renderer.setAnimationLoop(() => {
      renderer.render(scene, camera)
    })

    return () => {
      renderer.dispose()
      // eslint-disable-next-line react-hooks/exhaustive-deps
      if (containerRef.current) containerRef.current.innerHTML = ""
      if (arButton && arButton.parentNode) arButton.parentNode.removeChild(arButton)
    }
  }, [])

  return (
    <div ref={containerRef} className="w-full h-full bg-black rounded-xl" />
  )
}
