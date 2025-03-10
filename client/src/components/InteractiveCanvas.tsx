import { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { gsap } from 'gsap';

interface InteractiveCanvasProps {
  className?: string;
}

const InteractiveCanvas: React.FC<InteractiveCanvasProps> = ({ className }) => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const particlesRef = useRef<THREE.Points | null>(null);
  const mouseRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const raycasterRef = useRef<THREE.Raycaster>(new THREE.Raycaster());
  const interactiveParticlesRef = useRef<THREE.Object3D[]>([]);
  const isInteractingRef = useRef<boolean>(false);

  useEffect(() => {
    if (!canvasRef.current) return;

    // Initialize Three.js scene
    const container = canvasRef.current;
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Setup camera
    const camera = new THREE.PerspectiveCamera(
      70,
      window.innerWidth / window.innerHeight,
      0.1,
      2000
    );
    camera.position.z = 1000;
    cameraRef.current = camera;

    // Setup renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Create particles
    const createParticles = () => {
      // Remove existing particles if any
      if (particlesRef.current) {
        scene.remove(particlesRef.current);
      }

      const particleCount = 1000;
      const geometry = new THREE.BufferGeometry();
      const positions = new Float32Array(particleCount * 3);
      const scales = new Float32Array(particleCount);
      const colors = new Float32Array(particleCount * 3);

      // Create a collection of interactive particles
      interactiveParticlesRef.current = [];

      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;

        // Position particles in a cube
        positions[i3] = (Math.random() - 0.5) * 2000;
        positions[i3 + 1] = (Math.random() - 0.5) * 2000;
        positions[i3 + 2] = (Math.random() - 0.5) * 2000;

        // Random scales
        scales[i] = Math.random() * 2 + 0.5;

        // Subtle color variations
        colors[i3] = 0.7 + Math.random() * 0.3; // R
        colors[i3 + 1] = 0.7 + Math.random() * 0.3; // G
        colors[i3 + 2] = 0.7 + Math.random() * 0.3; // B

        // Create an interactive object for raycasting
        if (i % 5 === 0) { // Only make some particles interactive
          const interactiveParticle = new THREE.Mesh(
            new THREE.SphereGeometry(10, 8, 8),
            new THREE.MeshBasicMaterial({ visible: false })
          );
          interactiveParticle.position.set(
            positions[i3],
            positions[i3 + 1],
            positions[i3 + 2]
          );
          interactiveParticle.userData = { particleIndex: i };
          scene.add(interactiveParticle);
          interactiveParticlesRef.current.push(interactiveParticle);
        }
      }

      geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      geometry.setAttribute('scale', new THREE.BufferAttribute(scales, 1));
      geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

      const material = new THREE.PointsMaterial({
        size: 5,
        sizeAttenuation: true,
        vertexColors: true,
        transparent: true,
        opacity: 0.8,
      });

      const particles = new THREE.Points(geometry, material);
      scene.add(particles);
      particlesRef.current = particles;

      // Initial animation
      gsap.fromTo(
        particles.rotation,
        { x: -Math.PI / 2 },
        { x: 0, duration: 2, ease: 'power2.out' }
      );
      gsap.fromTo(
        material,
        { opacity: 0 },
        { opacity: 0.8, duration: 2.5, ease: 'power2.out' }
      );
    };

    createParticles();

    // Handle window resize
    const handleResize = () => {
      if (!cameraRef.current || !rendererRef.current) return;

      cameraRef.current.aspect = window.innerWidth / window.innerHeight;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(window.innerWidth, window.innerHeight);
    };

    // Handle mouse movement
    const handleMouseMove = (event: MouseEvent) => {
      // Calculate normalized mouse coordinates
      mouseRef.current.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouseRef.current.y = -(event.clientY / window.innerHeight) * 2 + 1;
    };

    // Handle mouse down
    const handleMouseDown = () => {
      isInteractingRef.current = true;
    };

    // Handle mouse up
    const handleMouseUp = () => {
      isInteractingRef.current = false;
    };

    // Animation loop
    const animate = () => {
      if (!sceneRef.current || !cameraRef.current || !rendererRef.current || !particlesRef.current) return;

      requestAnimationFrame(animate);

      // Gently rotate the entire particle system
      particlesRef.current.rotation.y += 0.001;
      particlesRef.current.rotation.x += 0.0005;

      // Handle interaction with particles
      raycasterRef.current.setFromCamera(new THREE.Vector2(mouseRef.current.x, mouseRef.current.y), cameraRef.current);

      if (isInteractingRef.current) {
        const intersects = raycasterRef.current.intersectObjects(interactiveParticlesRef.current);

        if (intersects.length > 0) {
          const { particleIndex } = intersects[0].object.userData;
          
          // Access the particle's position in the buffer geometry
          if (particlesRef.current.geometry.attributes.position && 
              particlesRef.current.geometry.attributes.color &&
              particleIndex !== undefined) {
            
            const i3 = particleIndex * 3;
            const positions = particlesRef.current.geometry.attributes.position.array;
            const colors = particlesRef.current.geometry.attributes.color.array;
            
            // Move the particle away from its position (explosion effect)
            const direction = new THREE.Vector3(
              positions[i3] - cameraRef.current.position.x,
              positions[i3 + 1] - cameraRef.current.position.y,
              positions[i3 + 2] - cameraRef.current.position.z
            ).normalize();
            
            positions[i3] += direction.x * 10;
            positions[i3 + 1] += direction.y * 10;
            positions[i3 + 2] += direction.z * 10;
            
            // Change its color
            colors[i3] = 1.0;     // R
            colors[i3 + 1] = 0.5; // G
            colors[i3 + 2] = 0.2; // B
            
            particlesRef.current.geometry.attributes.position.needsUpdate = true;
            particlesRef.current.geometry.attributes.color.needsUpdate = true;
          }
        }
      }

      // Update and render
      rendererRef.current.render(sceneRef.current, cameraRef.current);
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);

    animate();

    return () => {
      // Clean up
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);

      if (rendererRef.current?.domElement) {
        container.removeChild(rendererRef.current.domElement);
      }

      // Dispose geometry and materials to prevent memory leaks
      if (particlesRef.current) {
        particlesRef.current.geometry.dispose();
        (particlesRef.current.material as THREE.Material).dispose();
      }

      interactiveParticlesRef.current.forEach((particle) => {
        (particle as THREE.Mesh).geometry.dispose();
        ((particle as THREE.Mesh).material as THREE.Material).dispose();
        scene.remove(particle);
      });

      scene.clear();
    };
  }, []);

  return <div ref={canvasRef} className={`interactive-canvas absolute inset-0 -z-10 ${className || ''}`} />;
};

export default InteractiveCanvas;