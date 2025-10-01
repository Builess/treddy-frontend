/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { ARButton } from "three/examples/jsm/webxr/ARButton.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { STLLoader } from "three/examples/jsm/loaders/STLLoader.js";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader.js";

interface ARSceneProps {
  active: boolean;
  onClose?: () => void;
  modelUrl?: string; // opcional para cambiar el modelo a cargar
}

export default function ARScene({ active, onClose, modelUrl = "HORNET.glb" }: ARSceneProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!active || !containerRef.current) return;

    // Escena y cámara
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera();

    // Renderer WebXR
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.xr.enabled = true;
    containerRef.current.appendChild(renderer.domElement);

    // Botón AR
    const arButton = ARButton.createButton(renderer, { requiredFeatures: ["local"] });
    containerRef.current.appendChild(arButton);

    // Luz
    scene.add(new THREE.AmbientLight(0xffffff, 1.2));
    const dirLight = new THREE.DirectionalLight(0xffffff, 1);
    dirLight.position.set(2, 4, 5);
    scene.add(dirLight);

    // Grupo para el modelo
    const modelGroup = new THREE.Group();
    scene.add(modelGroup);

    // ------------------------
    // Loader universal
    // ------------------------
    function loadModel(url: string) {
      const ext = url.split(".").pop()?.toLowerCase();

      if (ext === "glb" || ext === "gltf") {
        new GLTFLoader().load(url, (gltf) => {
          modelGroup.add(gltf.scene);
          modelGroup.scale.set(0.5, 0.5, 0.5);
          modelGroup.position.set(0, 0, -1);
        });
      } else if (ext === "stl") {
        new STLLoader().load(url, (geometry) => {
          const material = new THREE.MeshStandardMaterial({ color: 0xaaaaaa });
          const mesh = new THREE.Mesh(geometry, material);
          modelGroup.add(mesh);
          modelGroup.scale.set(0.01, 0.01, 0.01);
          modelGroup.position.set(0, 0, -1);
        });
      } else if (ext === "obj") {
        new OBJLoader().load(url, (obj) => {
          modelGroup.add(obj);
          modelGroup.scale.set(0.5, 0.5, 0.5);
          modelGroup.position.set(0, 0, -1);
        });
      } else if (ext === "fbx") {
        new FBXLoader().load(url, (obj) => {
          modelGroup.add(obj);
          modelGroup.scale.set(0.01, 0.01, 0.01);
          modelGroup.position.set(0, 0, -1);
        });
      } else {
        console.error("Formato no soportado:", ext);
      }
    }

    // Cargar modelo
    loadModel(modelUrl);

    // ------------------------
    // Gestos
    // ------------------------
    let initialDistance: number | null = null;
    let initialScale = 1;

    let initialAngle: number | null = null;
    let initialRotation = 0;

    let isDragging = false;
    let lastTouchX = 0;
    let lastTouchY = 0;

    const getAngle = (t1: Touch, t2: Touch) => {
      const dx = t2.clientX - t1.clientX;
      const dy = t2.clientY - t1.clientY;
      return Math.atan2(dy, dx);
    };

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        isDragging = true;
        lastTouchX = e.touches[0].clientX;
        lastTouchY = e.touches[0].clientY;
      } else if (e.touches.length === 2) {
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        initialDistance = Math.sqrt(dx * dx + dy * dy);
        initialScale = modelGroup.scale.x;

        initialAngle = getAngle(e.touches[0], e.touches[1]);
        initialRotation = modelGroup.rotation.y;
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 1 && isDragging) {
        const deltaX = (e.touches[0].clientX - lastTouchX) / 200;
        const deltaY = (e.touches[0].clientY - lastTouchY) / 200;

        modelGroup.position.x += deltaX;
        modelGroup.position.y -= deltaY;

        lastTouchX = e.touches[0].clientX;
        lastTouchY = e.touches[0].clientY;
      } else if (e.touches.length === 2) {
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (initialDistance !== null) {
          const scaleFactor = distance / initialDistance;
          const newScale = initialScale * scaleFactor;
          modelGroup.scale.set(newScale, newScale, newScale);
        }

        if (initialAngle !== null) {
          const currentAngle = getAngle(e.touches[0], e.touches[1]);
          const angleDiff = currentAngle - initialAngle;
          modelGroup.rotation.y = initialRotation + angleDiff;
        }
      }
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (e.touches.length < 2) {
        initialDistance = null;
        initialAngle = null;
      }
      if (e.touches.length === 0) {
        isDragging = false;
      }
    };

    document.addEventListener("touchstart", handleTouchStart);
    document.addEventListener("touchmove", handleTouchMove);
    document.addEventListener("touchend", handleTouchEnd);

    // Animación
    renderer.setAnimationLoop(() => {
      renderer.render(scene, camera);
    });

    window.addEventListener("resize", () => {
      renderer.setSize(window.innerWidth, window.innerHeight);
    });

    return () => {
      document.removeEventListener("touchstart", handleTouchStart);
      document.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("touchend", handleTouchEnd);
      if (containerRef.current) containerRef.current.innerHTML = "";
    };
  }, [active]);

  if (!active) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black">
      <div ref={containerRef} className="w-full h-full" />
      {onClose && (
        <button
          onClick={onClose}
          className="absolute top-4 right-4 px-4 py-2 bg-red-600 text-white rounded-lg"
        >
          Cerrar AR
        </button>
      )}
    </div>
  );
}
