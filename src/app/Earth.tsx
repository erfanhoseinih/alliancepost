"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";

const Earth: React.FC = () => {
  const refContainer = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!refContainer.current) return;

    // --- Renderer ---
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio || 1);
    renderer.setSize(window.innerWidth, window.innerHeight);
    // three r152+
    (renderer as any).outputColorSpace = THREE.SRGBColorSpace;

    if (!refContainer.current.children.length) {
      refContainer.current.appendChild(renderer.domElement);
    }

    // --- Scene & Camera ---
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0.5, 0.75, 1).multiplyScalar(0.2);

    let wc = window.innerWidth / 2.5;
    let hc = window.innerHeight / 2.5;
    let camera = new THREE.OrthographicCamera(-wc, wc, hc, -hc, -wc, wc);

    const rotCam = new THREE.Vector3(-0.5, 0, 0);
    camera.rotation.set(rotCam.x, rotCam.y, rotCam.z);

    // --- Objects ---
    const sphere = createSphereWithText(scene, renderer);
    createInnerShell(scene);

    // --- Animation ---
    const clock = new THREE.Clock();
    const animate = () => {
      const t = clock.getElapsedTime();
      sphere.rotation.y = t * 0.1;
      goBackToMainAngle();
      renderer.render(scene, camera);
      renderer.setAnimationLoop(animate);
    };
    animate();

    // --- Events ---
    const onMouseMove = (e: MouseEvent) => {
      if (e.buttons) {
        rotCam.z += (e.movementX / window.innerWidth) * 2;
        rotCam.x += (e.movementY / window.innerWidth) * 2;
        camera.rotation.z = rotCam.z;
        camera.rotation.x = rotCam.x;
        renderer.render(scene, camera);
      }
    };

    const onResize = () => {
      renderer.setSize(window.innerWidth, window.innerHeight);
      wc = window.innerWidth / 3;
      hc = window.innerHeight / 3;
      camera = new THREE.OrthographicCamera(-wc, wc, hc, -hc, -wc, wc);
      camera.rotation.z = rotCam.z;
      camera.rotation.x = rotCam.x;
      renderer.render(scene, camera);
    };

    document.addEventListener("mousemove", onMouseMove);
    window.addEventListener("resize", onResize, false);

    function goBackToMainAngle() {
      const lerp = (a: number, b: number, t: number) => (b - a) * t + a;
      rotCam.x = lerp(rotCam.x, -0.5, 0.006);
      rotCam.z = lerp(rotCam.z, 0.0, 0.006);
      camera.rotation.z = rotCam.z;
      camera.rotation.x = rotCam.x;
    }

    function createSphereWithText(
      targetScene: THREE.Scene,
      r: THREE.WebGLRenderer
    ) {
      const g = new THREE.SphereGeometry(150, 128, 128);

      const tex = getTextTexture(r);
      (tex as any).colorSpace = THREE.SRGBColorSpace;

      tex.wrapS = THREE.ClampToEdgeWrapping;
      tex.wrapT = THREE.ClampToEdgeWrapping;

      const m = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        map: tex,
        transparent: true,
      });

      const mesh = new THREE.Mesh<
        THREE.SphereGeometry,
        THREE.MeshBasicMaterial
      >(g, m);
      targetScene.add(mesh);

      m.map!.repeat.set(1.0, 0.6);
      m.map!.offset.set(0.0, 0.2);

      return mesh;
    }

    function createInnerShell(targetScene: THREE.Scene) {
      const gInner = new THREE.SphereGeometry(149, 128, 128);
      const backColor =
        scene.background instanceof THREE.Color
          ? scene.background
          : new THREE.Color(0x000000);

      const mBack = new THREE.MeshBasicMaterial({ color: backColor });
      const innerMesh = new THREE.Mesh<
        THREE.SphereGeometry,
        THREE.MeshBasicMaterial
      >(gInner, mBack);
      targetScene.add(innerMesh);
      return innerMesh;
    }

    function getTextTexture(r: THREE.WebGLRenderer): THREE.CanvasTexture {
      const c = document.createElement("canvas");
      c.width = 1024;
      c.height = 1024;

      const ctx = c.getContext("2d")!;
      ctx.clearRect(0, 0, c.width, c.height);
      // ctx.textAlign = "center";
      // ctx.textBaseline = "middle";

      const tex = new THREE.CanvasTexture(c);
      tex.minFilter = THREE.LinearMipmapLinearFilter;
      tex.magFilter = THREE.LinearFilter;
      tex.generateMipmaps = true;
      (tex as any).anisotropy =
        (r.capabilities.getMaxAnisotropy &&
          r.capabilities.getMaxAnisotropy()) ||
        1;
      tex.needsUpdate = true;

      const text = "ALLIANCEPOST";
      const ff = new FontFace(
        "Khand-Bold",
        "url(/fonts/Khand/Khand-Bold.woff2)"
      );

      ff.load().then(
        (loadedFace) => {
          try {
            (document as any).fonts?.add(loadedFace);
          } catch {}

          const text = "ALLIANCEPOST";

          let fontSize = 100;
          ctx.font = `${fontSize}px "Khand-Bold"`;

          ctx.fillStyle = "#ffffff";
          // ctx.textAlign = "center";
          // ctx.textBaseline = "middle";

          // تعداد ردیف‌ها
          const rows = 8;
          for (let i = 0; i < rows; i++) {
            const t = i / (rows - 1);
            const y = c.height * (0.3 + t * 0.5);

            ctx.fillText(text, c.width * 0, y);
            ctx.fillText(text, c.width * 0.5, y);
          }

          tex.needsUpdate = true;
        },
        (err) => {
          console.error("Font load error:", err);

          const text = "ALLIANCEPOST";
          let fontSize = 120;
          ctx.font = `${fontSize}px sans-serif`;

          const maxWidth = c.width * 0.9;
          let textWidth = ctx.measureText(text).width;
          while (textWidth < maxWidth && fontSize < 800) {
            fontSize += 5;
            ctx.font = `${fontSize}px sans-serif`;
            textWidth = ctx.measureText(text).width;
          }

          ctx.fillStyle = "#ffffff";
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";

          const rows = 8;
          for (let i = 0; i < rows; i++) {
            const t = i / (rows - 1);
            const y = c.height * (0.2 + t * 0.6);
            ctx.fillText(text, c.width * 0.5, y);
          }

          tex.needsUpdate = true;
        }
      );

      return tex;
    }

    // --- Cleanup ---
    return () => {
      document.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("resize", onResize);
      try {
        renderer.setAnimationLoop(null);
      } catch {}
      scene.traverse((o) => {
        const mesh = o as THREE.Mesh;
        if (mesh.isMesh) {
          mesh.geometry?.dispose();
          const mats = Array.isArray(mesh.material)
            ? mesh.material
            : [mesh.material];
          mats.forEach((m) => (m as THREE.Material)?.dispose?.());
        }
      });
      renderer.dispose();
      if (
        refContainer.current &&
        renderer.domElement.parentElement === refContainer.current
      ) {
        refContainer.current.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div className="canvas" ref={refContainer} />;
};

export default Earth;
