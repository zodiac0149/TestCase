import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export const PolarizedBlueScene = () => {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return undefined;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, mount.clientWidth / mount.clientHeight, 0.1, 100);
    camera.position.set(0, 0, 10);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    mount.appendChild(renderer.domElement);

    const group = new THREE.Group();
    scene.add(group);

    const lineMaterial = new THREE.LineBasicMaterial({
      color: 0x78a6ff,
      transparent: true,
      opacity: 0.42,
    });

    for (let i = -18; i <= 18; i += 1) {
      const points = [];
      for (let j = -18; j <= 18; j += 1) {
        points.push(new THREE.Vector3(j * 0.42, Math.sin(j * 0.42 + i * 0.4) * 0.28 + i * 0.23, -2));
      }
      group.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(points), lineMaterial));
    }

    const ringMaterial = new THREE.MeshBasicMaterial({
      color: 0x0b1020,
      wireframe: true,
      transparent: true,
      opacity: 0.35,
    });
    const ring = new THREE.Mesh(new THREE.TorusKnotGeometry(1.75, 0.12, 140, 12), ringMaterial);
    ring.position.set(3.2, 0.5, 0);
    group.add(ring);

    const dotGeometry = new THREE.BufferGeometry();
    const dotPositions = [];
    for (let i = 0; i < 650; i += 1) {
      dotPositions.push((Math.random() - 0.5) * 14, (Math.random() - 0.5) * 8, (Math.random() - 0.5) * 6);
    }
    dotGeometry.setAttribute('position', new THREE.Float32BufferAttribute(dotPositions, 3));
    const dots = new THREE.Points(
      dotGeometry,
      new THREE.PointsMaterial({ color: 0xb9d3ff, size: 0.018, transparent: true, opacity: 0.7 }),
    );
    group.add(dots);

    let frameId = 0;
    const animate = () => {
      frameId = requestAnimationFrame(animate);
      group.rotation.y += 0.0018;
      ring.rotation.x += 0.004;
      ring.rotation.y += 0.006;
      dots.rotation.y -= 0.0009;
      renderer.render(scene, camera);
    };
    animate();

    const resize = () => {
      camera.aspect = mount.clientWidth / mount.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mount.clientWidth, mount.clientHeight);
    };
    window.addEventListener('resize', resize);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('resize', resize);
      mount.removeChild(renderer.domElement);
      dotGeometry.dispose();
      lineMaterial.dispose();
      ringMaterial.dispose();
      renderer.dispose();
    };
  }, []);

  return <div ref={mountRef} className="absolute inset-0" aria-hidden="true" />;
};
