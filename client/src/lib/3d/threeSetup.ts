import * as THREE from 'three';
import { gsap } from 'gsap';

export class ThreeScene {
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  renderer: THREE.WebGLRenderer;
  container: HTMLElement | null;
  particles: THREE.Points | null = null;
  particlesGeometry: THREE.BufferGeometry | null = null;
  mouseX: number = 0;
  mouseY: number = 0;
  targetX: number = 0;
  targetY: number = 0;
  windowHalfX: number = window.innerWidth / 2;
  windowHalfY: number = window.innerHeight / 2;
  isActive: boolean = false;

  constructor(containerId: string) {
    this.container = document.getElementById(containerId);
    
    // Initialize scene
    this.scene = new THREE.Scene();
    
    // Initialize camera
    this.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    this.camera.position.z = 30;
    
    // Initialize renderer
    this.renderer = new THREE.WebGLRenderer({ 
      alpha: true,
      antialias: true
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    
    if (this.container) {
      this.container.appendChild(this.renderer.domElement);
    }
    
    // Event listeners
    window.addEventListener('resize', this.onWindowResize.bind(this));
    document.addEventListener('mousemove', this.onDocumentMouseMove.bind(this));
    
    // Setup and start animation
    this.createParticles();
    this.animate();
  }
  
  createParticles() {
    const particleCount = 1000;
    this.particlesGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    
    for (let i = 0; i < particleCount * 3; i += 3) {
      // Position
      positions[i] = (Math.random() - 0.5) * 100;
      positions[i + 1] = (Math.random() - 0.5) * 100;
      positions[i + 2] = (Math.random() - 0.5) * 100;
      
      // Color - subtle monochromatic palette
      colors[i] = 0.8 + Math.random() * 0.2; // R
      colors[i + 1] = 0.8 + Math.random() * 0.2; // G
      colors[i + 2] = 0.8 + Math.random() * 0.2; // B
    }
    
    this.particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    this.particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    
    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.1,
      transparent: true,
      opacity: 0.6,
      vertexColors: true,
      sizeAttenuation: true,
      depthWrite: false,
    });
    
    this.particles = new THREE.Points(this.particlesGeometry, particlesMaterial);
    this.scene.add(this.particles);
    
    // Initially hide particles
    gsap.set(this.particles.material, { opacity: 0 });
  }
  
  activate() {
    if (!this.isActive && this.particles) {
      this.isActive = true;
      gsap.to(this.particles.material, {
        opacity: 0.6,
        duration: 1.5,
        ease: 'power2.inOut'
      });
    }
  }
  
  deactivate() {
    if (this.isActive && this.particles) {
      this.isActive = false;
      gsap.to(this.particles.material, {
        opacity: 0,
        duration: 1.5,
        ease: 'power2.inOut'
      });
    }
  }
  
  onWindowResize() {
    this.windowHalfX = window.innerWidth / 2;
    this.windowHalfY = window.innerHeight / 2;
    
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }
  
  onDocumentMouseMove(event: MouseEvent) {
    this.mouseX = (event.clientX - this.windowHalfX) * 0.01;
    this.mouseY = (event.clientY - this.windowHalfY) * 0.01;
  }
  
  animate() {
    requestAnimationFrame(this.animate.bind(this));
    
    this.targetX = this.mouseX * 0.1;
    this.targetY = this.mouseY * 0.1;
    
    if (this.particles) {
      this.particles.rotation.x += 0.0005;
      this.particles.rotation.y += 0.0005;
      
      this.particles.rotation.y += (this.targetX - this.particles.rotation.y) * 0.02;
      this.particles.rotation.x += (this.targetY - this.particles.rotation.x) * 0.02;
    }
    
    this.renderer.render(this.scene, this.camera);
  }
  
  dispose() {
    window.removeEventListener('resize', this.onWindowResize.bind(this));
    document.removeEventListener('mousemove', this.onDocumentMouseMove.bind(this));
    
    if (this.particlesGeometry) {
      this.particlesGeometry.dispose();
    }
    
    if (this.particles) {
      this.scene.remove(this.particles);
      (this.particles.material as THREE.Material).dispose();
    }
    
    this.renderer.dispose();
  }
}