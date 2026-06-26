export interface ConfettiOptions {
  particleCount?: number;
  angle?: number;
  spread?: number;
  startVelocity?: number;
  decay?: number;
  gravity?: number;
  drift?: number;
  ticks?: number;
  origin?: { x?: number; y?: number };
  colors?: string[];
  shapes?: string[];
  zIndex?: number;
  disableForReducedMotion?: boolean;
  scalar?: number;
}

/**
 * A highly performant, sandbox-safe, custom domestic confetti animation engine.
 * Eliminates all Web Worker or cross-origin canvas security errors inside iframe sandboxes.
 */
export const safeConfetti = (options?: ConfettiOptions) => {
  if (typeof window === 'undefined' || typeof document === 'undefined') return;

  // Check for reduced motion
  if (options?.disableForReducedMotion) {
    try {
      if (typeof window !== 'undefined' && typeof window.matchMedia === 'function') {
        const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
        if (mediaQuery && mediaQuery.matches) return;
      }
    } catch (e) {
      console.warn("window.matchMedia is blocked or not supported in this environment.", e);
    }
  }

  // Create absolute container
  const container = document.createElement('div');
  const zIndex = options?.zIndex !== undefined ? options.zIndex : 100000;
  
  container.style.position = 'fixed';
  container.style.top = '0';
  container.style.left = '0';
  container.style.width = '100vw';
  container.style.height = '100vh';
  container.style.pointerEvents = 'none';
  container.style.zIndex = String(zIndex);
  container.style.overflow = 'hidden';
  document.body.appendChild(container);

  const colors = options?.colors || ['#ec4899', '#8b5cf6', '#3b82f6', '#06b6d4', '#e879f9', '#f59e0b', '#10b981'];
  const particleCount = options?.particleCount !== undefined ? options.particleCount : 60;
  
  const originX = options?.origin?.x !== undefined ? options.origin.x : 0.5;
  const originY = options?.origin?.y !== undefined ? options.origin.y : 0.5;

  const width = window.innerWidth;
  const height = window.innerHeight;

  const startX = originX * width;
  const startY = originY * height;

  const defaultAngle = options?.angle !== undefined ? options.angle : (originX < 0.5 ? 45 : (originX > 0.5 ? 135 : 90));

  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement('div');
    const size = (Math.random() * 8 + 6) * (options?.scalar !== undefined ? options.scalar : 1);
    const color = colors[Math.floor(Math.random() * colors.length)];
    
    particle.style.position = 'absolute';
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    particle.style.backgroundColor = color;
    particle.style.borderRadius = Math.random() > 0.4 ? '50%' : '1px';
    
    // Initial placement at origin
    particle.style.left = '0px';
    particle.style.top = '0px';
    particle.style.opacity = '1';
    particle.style.willChange = 'transform, opacity';
    
    container.appendChild(particle);

    // Velocity angles in radians
    const spreadRad = (options?.spread !== undefined ? options.spread : 45) * Math.PI / 180;
    const baseAngleRad = (180 - defaultAngle) * Math.PI / 180; // convert angle to standard coordinate system where 90 is straight up
    const angleRad = baseAngleRad + (Math.random() - 0.5) * spreadRad;
    
    const velocity = (options?.startVelocity !== undefined ? options.startVelocity : 35) * (Math.random() * 0.7 + 0.4);
    
    let vx = Math.cos(angleRad) * velocity * 0.8;
    let vy = -Math.sin(angleRad) * velocity * 0.8; // negative because screen coordinates increase going down the page
    
    let currentX = startX;
    let currentY = startY;
    
    const gravity = options?.gravity !== undefined ? options.gravity : 0.35;
    const decay = options?.decay !== undefined ? options.decay : 0.95;
    const drift = options?.drift !== undefined ? options.drift : 0;
    
    let rotation = Math.random() * 360;
    const rotationSpeed = (Math.random() - 0.5) * 20;
    let opacity = 1.0;
    let tickCount = 0;
    const maxTicks = options?.ticks !== undefined ? options.ticks : 150;

    const animateParticle = () => {
      tickCount++;
      
      // Update forces
      vy += gravity;
      vx *= decay;
      vy *= decay;
      vx += drift;
      
      currentX += vx;
      currentY += vy;
      rotation += rotationSpeed;
      
      // Gradually fade out over the lifecycle
      if (tickCount > maxTicks * 0.5) {
        opacity = 1.0 - ((tickCount - maxTicks * 0.5) / (maxTicks * 0.5));
      }

      particle.style.transform = `translate3d(${currentX}px, ${currentY}px, 0) rotate(${rotation}deg)`;
      particle.style.opacity = String(Math.max(0, opacity));

      if (tickCount < maxTicks && opacity > 0 && currentY < height + 50 && currentX > -50 && currentX < width + 50) {
        requestAnimationFrame(animateParticle);
      } else {
        particle.remove();
      }
    };
    
    requestAnimationFrame(animateParticle);
  }

  // Self-destruct container when finished
  setTimeout(() => {
    container.remove();
  }, 4000);
};
