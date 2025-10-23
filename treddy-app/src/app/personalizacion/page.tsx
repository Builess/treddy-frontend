/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useState, useRef, useEffect } from 'react'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import Nav from '@/pages/nav'
import Footer from '@/pages/footer'

type ParteConfig = {
  color: string
  modo: 'original' | 'teñir' | 'forzar'
}

export default function Personalizador3DIndependiente() {
  const [mostrar3D, setMostrar3D] = useState(false)
  const [animation, setAnimation] = useState<'none' | 'rotate'>('none')
  const [modelUrl, setModelUrl] = useState<string | null>(null)
  const [partes, setPartes] = useState<Record<string, ParteConfig>>({})
  const canvasRef = useRef<HTMLDivElement | null>(null)
  const modelRef = useRef<THREE.Object3D | null>(null)
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null)
  const sceneRef = useRef<THREE.Scene | null>(null)
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null)
  const controlsRef = useRef<OrbitControls | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const url = URL.createObjectURL(file)
    setModelUrl(url)
    setMostrar3D(true)
  }

  useEffect(() => {
    if (!mostrar3D || !canvasRef.current) return

    const width = canvasRef.current.clientWidth
    const height = canvasRef.current.clientHeight

    if (rendererRef.current) {
      rendererRef.current.dispose()
      if (rendererRef.current.domElement.parentElement) {
        rendererRef.current.domElement.parentElement.removeChild(rendererRef.current.domElement)
      }
    }

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(width, height)
    canvasRef.current.innerHTML = ''
    canvasRef.current.appendChild(renderer.domElement)
    rendererRef.current = renderer

    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0x0a1522)
    sceneRef.current = scene

    const camera = new THREE.PerspectiveCamera(70, width / height, 0.01, 100)
    camera.position.set(0, 1, 5)
    cameraRef.current = camera

    const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444, 1.5)
    scene.add(hemiLight)
    const dirLight = new THREE.DirectionalLight(0xffffff, 0.8)
    dirLight.position.set(5, 10, 7.5)
    scene.add(dirLight)

    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    controls.dampingFactor = 0.05
    controls.enablePan = true
    controlsRef.current = controls

    const loader = new GLTFLoader()
    if (modelUrl) {
      loader.load(
        modelUrl,
        (gltf) => {
          if (modelRef.current) scene.remove(modelRef.current)
          modelRef.current = gltf.scene

          const box = new THREE.Box3().setFromObject(modelRef.current)
          const size = box.getSize(new THREE.Vector3()).length()
          const scaleFactor = 2 / size
          modelRef.current.scale.set(scaleFactor, scaleFactor, scaleFactor)
          modelRef.current.position.set(0, -0.5, 0)

          const nuevasPartes: Record<string, ParteConfig> = {}
          let idx = 0
          modelRef.current.traverse((child: any) => {
            if (child.isMesh) {
              const baseName = child.name || `Parte_${++idx}`

              if (!Array.isArray(child.material)) {
                const colorHex = "#" + child.material.color.getHexString()
                nuevasPartes[baseName] = { color: colorHex, modo: 'original' }
              } else {
                child.material.forEach((mat: any, i: number) => {
                  if (mat.color) {
                    const colorHex = "#" + mat.color.getHexString()
                    nuevasPartes[`${baseName}_Mat${i}`] = { color: colorHex, modo: 'original' }
                  }
                })
              }
            }
          })
          setPartes(nuevasPartes)

          scene.add(modelRef.current)
        },
        undefined,
        (err) => console.error('Error cargando GLB:', err)
      )
    }

    const animate = () => {
      renderer.setAnimationLoop(() => {
        if (modelRef.current && animation === 'rotate') {
          modelRef.current.rotation.y += 0.01
        }
        controls.update()
        renderer.render(scene, camera)
      })
    }
    animate()

    return () => {
      renderer.setAnimationLoop(null)
      renderer.dispose()
      controls.dispose()
      if (modelRef.current) {
        scene.remove(modelRef.current)
        modelRef.current = null
      }
    }
  }, [mostrar3D, animation, modelUrl])

  const updateParte = (parte: string, config: Partial<ParteConfig>) => {
    setPartes((prev) => {
      const updated = { ...prev, [parte]: { ...prev[parte], ...config } }

      if (modelRef.current) {
        let idx = 0
        modelRef.current.traverse((child: any) => {
          if (child.isMesh) {
            const baseName = child.name || `Parte_${++idx}`

            if (!Array.isArray(child.material)) {
              if (parte === baseName) {
                aplicarModo(child, updated[parte])
              }
            } else {
              child.material.forEach((mat: any, i: number) => {
                if (parte === `${baseName}_Mat${i}`) {
                  aplicarModo({ material: mat }, updated[parte])
                }
              })
            }
          }
        })
      }

      return updated
    })
  }

  const aplicarModo = (mesh: any, config: ParteConfig) => {
    if (!mesh.material) return

    if (config.modo === 'original') {
      mesh.material.color.set(config.color)
    } else if (config.modo === 'teñir') {
      if (mesh.material.map) {
        mesh.material.color.set(config.color) 
      } else {
        mesh.material.color.set(config.color)
      }
    } else if (config.modo === 'forzar') {
      mesh.material = new THREE.MeshStandardMaterial({
        color: config.color,
        metalness: 0.2,
        roughness: 0.8,
      })
    }
  }

  const handleExport = () => {
    if (!modelRef.current) return
    const exporter = new GLTFExporter()
    exporter.parse(
      modelRef.current,
      (result) => {
        const output = result instanceof ArrayBuffer
          ? new Blob([result], { type: 'model/gltf-binary' })
          : new Blob([JSON.stringify(result, null, 2)], { type: 'application/json' })
        const link = document.createElement('a')
        link.href = URL.createObjectURL(output)
        link.download = 'modelo_modificado.glb'
        link.click()
      },
      { binary: true } as any
    )
  }

  return (
    <>
      <Nav />
      <main className="min-h-screen flex flex-col items-center justify-start bg-[#0A0F2C] -mt-10 -mb-10">
        <h1 className="text-2xl md:text-5xl font-extrabold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent leading-tight py-10">Personalizador 3D</h1>

        <div className="flex w-full max-w-7xl gap-9 bg-[#0F173A]/20 p-6 rounded-2xl shadow-lg text-white">
          {/* Controles */}
          <div className="w-1/3 bg-[#1e2d45] p-6 rounded-xl flex flex-col gap-4 shadow-inner overflow-y-auto max-h-[700px]">
            <h2 className="font-bold mb-2 text-cyan-400">Animación</h2>
            <select
              className="w-full mb-4 p-2 rounded bg-[#0f1c2b] text-white border border-cyan-500"
              value={animation}
              onChange={(e) => setAnimation(e.target.value as 'none' | 'rotate')}
            >
              <option value="none">Ninguna</option>
              <option value="rotate">Rotar automática</option>
            </select>

            <h2 className="font-bold mt-4 text-cyan-400">Partes personalizables</h2>
            {Object.entries(partes).map(([parte, { color, modo }]) => (
              <div key={parte} className="flex flex-col gap-2 border-b border-gray-700 pb-2 mb-2">
                <span className="text-sm text-gray-200">{parte}</span>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={color}
                    onChange={(e) => updateParte(parte, { color: e.target.value })}
                    className="h-8 w-12 border border-cyan-500 rounded"
                  />
                  <select
                    value={modo}
                    onChange={(e) => updateParte(parte, { modo: e.target.value as ParteConfig['modo'] })}
                    className="p-1 rounded bg-[#0f1c2b] text-white border border-cyan-500 text-sm"
                  >
                    <option value="original">Original</option>
                    <option value="teñir">Teñir textura</option>
                    <option value="forzar">Forzar color</option>
                  </select>
                </div>
              </div>
            ))}

            <label className="mt-4 font-bold text-cyan-400">Cargar GLB</label>
            <input type="file" accept=".glb" onChange={handleFileChange} className="text-gray-200" />

            {modelUrl && (
              <button
                onClick={handleExport}
                className="mt-4 bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-4 py-2 rounded-lg hover:opacity-90 transition"
              >
                Exportar modelo
              </button>
            )}
          </div>

          {/* Canvas 3D */}
          <div className="w-2/3 flex flex-col items-center justify-center">
            <button
              onClick={() => setMostrar3D(!mostrar3D)}
              className="mt-1 mb-5 bg-gradient-to-r from-cyan-500 to-blue-500 text-black px-8 py-3 rounded-full hover:opacity-90 font-semibold shadow-lg"
            >
              {mostrar3D ? 'Ocultar 3D' : 'Mostrar 3D'}
            </button>
            {mostrar3D && (
              <div
                ref={canvasRef}
                className="w-full h-[500px] bg-[#0a1522] rounded-xl shadow-lg flex items-center justify-center"
              />
            )}
          </div>
        </div>
      </main>

      <Footer />
    </>
  )
}
