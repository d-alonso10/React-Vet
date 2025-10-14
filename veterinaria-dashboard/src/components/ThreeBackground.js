import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import styled from 'styled-components';

const CanvasContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
  background: #0c0f1a; // Un azul noche oscuro para que resalte el efecto
`;

const ThreeBackground = () => {
  const mountRef = useRef(null);

  useEffect(() => {
    const mountNode = mountRef.current;
    if (!mountNode) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 50;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mountNode.appendChild(renderer.domElement);

    // --- Post-procesado para el efecto Bloom ---
    const renderScene = new RenderPass(scene, camera);
    const bloomPass = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 0.7, 0.5, 0.8);
    bloomPass.threshold = 0.2;
    bloomPass.strength = 0.5;
    bloomPass.radius = 0.5;

    const composer = new EffectComposer(renderer);
    composer.setSize(window.innerWidth, window.innerHeight);
    composer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    composer.addPass(renderScene);
    composer.addPass(bloomPass);

    // Función de ayuda para crear sistemas de partículas
    const createParticleSystem = (count, size, color, spread) => {
      const positions = new Float32Array(count * 3);
      for (let i = 0; i < count * 3; i++) {
          positions[i] = (Math.random() - 0.5) * spread;
      }
      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      
      const material = new THREE.PointsMaterial({
        color, size, blending: THREE.AdditiveBlending, transparent: true, opacity: 0.9, sizeAttenuation: true,
      });
      
      return {
          points: new THREE.Points(geometry, material),
          originalPositions: new Float32Array(positions),
          count,
      };
    }

    // --- Grupos de Partículas para efecto de Paralaje ---
    const particleGroup1 = createParticleSystem(3000, 0.3, '#abcbd5', 150);
    const particleGroup2 = createParticleSystem(2000, 0.2, '#ffffff', 250);
    const particleGroup3 = createParticleSystem(1000, 0.1, '#8a9ea8', 400);

    scene.add(particleGroup1.points);
    scene.add(particleGroup2.points);
    scene.add(particleGroup3.points);
    
    // --- Interacción con el Ratón ---
    const mouse = new THREE.Vector2();
    const handleMouseMove = (event) => {
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener('mousemove', handleMouseMove);

    // --- Bucle de Animación ---
    const clock = new THREE.Clock();
    let animationFrameId;

    const animateParticles = (particleSystem, elapsedTime, speedFactor, amplitude) => {
      const { points, originalPositions, count } = particleSystem;
      const positions = points.geometry.attributes.position.array;

      for (let i = 0; i < count; i++) {
        const i3 = i * 3;
        const x_orig = originalPositions[i3];
        const y_orig = originalPositions[i3 + 1];
        
        positions[i3 + 1] = y_orig + Math.sin(elapsedTime * speedFactor + x_orig * 0.02) * amplitude;
      }
      points.geometry.attributes.position.needsUpdate = true;
    }

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();
      
      animateParticles(particleGroup1, elapsedTime, 0.3, 5);
      animateParticles(particleGroup2, elapsedTime, 0.2, 4);
      animateParticles(particleGroup3, elapsedTime, 0.1, 2);

      camera.position.x += (mouse.x * 5 - camera.position.x) * 0.05;
      camera.position.y += (-mouse.y * 5 - camera.position.y) * 0.05;
      camera.lookAt(scene.position);

      composer.render();
    };
    
    animate();

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      composer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      if (mountNode && renderer.domElement) {
        mountNode.removeChild(renderer.domElement);
      }
      scene.traverse(child => {
        if (child.geometry) child.geometry.dispose();
        if (child.material) child.material.dispose();
      });
      renderer.dispose();
      composer.dispose();
    };
  }, []);

  return <CanvasContainer ref={mountRef} />;
};

export default ThreeBackground;