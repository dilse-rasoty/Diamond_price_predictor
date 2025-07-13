/* ------------------------------------------------------------------
 *  React hook‑based particle background (uses OGL under the hood).
 *  No build‑step required – loaded directly in the browser via <script type="module">.
 * ------------------------------------------------------------------ */

import { Renderer, Camera, Geometry, Program, Mesh } from 'https://cdn.skypack.dev/ogl@0.0.33';

const { useEffect, useRef } = React;

/* convert #RRGGBB to normalised RGB */
const hexToRgb = (hex) => {
  hex = hex.replace(/^#/, '');
  if (hex.length === 3) hex = hex.split('').map((c) => c + c).join('');
  const int = parseInt(hex, 16);
  return [ ((int >> 16) & 255) / 255, ((int >> 8) & 255) / 255, (int & 255) / 255 ];
};

/* shaders (unchanged from your snippet) */
const vertex = `
attribute vec3 position;
attribute vec4 random;
attribute vec3 color;

uniform mat4 modelMatrix;
uniform mat4 viewMatrix;
uniform mat4 projectionMatrix;
uniform float uTime;
uniform float uSpread;
uniform float uBaseSize;
uniform float uSizeRandomness;

varying vec4 vRandom;
varying vec3 vColor;

void main() {
  vRandom = random;
  vColor  = color;

  vec3 pos = position * uSpread;
  pos.z *= 10.0;

  vec4 mPos = modelMatrix * vec4(pos, 1.0);
  float t = uTime;
  mPos.x += sin(t * random.z + 6.28 * random.w) * mix(0.1, 1.5, random.x);
  mPos.y += sin(t * random.y + 6.28 * random.x) * mix(0.1, 1.5, random.w);
  mPos.z += sin(t * random.w + 6.28 * random.y) * mix(0.1, 1.5, random.z);

  vec4 mvPos  = viewMatrix * mPos;
  gl_PointSize = (uBaseSize * (1.0 + uSizeRandomness * (random.x - 0.5))) / length(mvPos.xyz);
  gl_Position  = projectionMatrix * mvPos;
}`;

const fragment = `
precision highp float;

uniform float uTime;
uniform float uAlphaParticles;
varying vec4 vRandom;
varying vec3 vColor;

void main() {
  vec2 uv = gl_PointCoord.xy;
  float d = length(uv - vec2(0.5));

  if (uAlphaParticles < 0.5) {
    if (d > 0.5) discard;
    gl_FragColor = vec4(vColor + 0.2 * sin(uv.yxx + uTime + vRandom.y * 6.28), 1.0);
  } else {
    float circle = smoothstep(0.5, 0.4, d) * 0.8;
    gl_FragColor = vec4(vColor + 0.2 * sin(uv.yxx + uTime + vRandom.y * 6.28), circle);
  }
}`;

function Particles({
  particleCount      = 200,
  particleSpread     = 10,
  speed              = 0.1,
  particleColors     = ['#ffffff', '#ffffff'],
  moveParticlesOnHover = false,
  particleHoverFactor  = 1,
  alphaParticles     = false,
  particleBaseSize   = 100,
  sizeRandomness     = 1,
  cameraDistance     = 20,
  disableRotation    = false,
  className          = '',
}) {
  const containerRef = useRef(null);
  const mouseRef     = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    /* ---- WebGL / OGL set‑up ---- */
    const renderer = new Renderer({ depth:false, alpha:true });
    const gl       = renderer.gl;
    container.appendChild(gl.canvas);
    gl.clearColor(0,0,0,0);

    const camera  = new Camera(gl, { fov:15 });
    camera.position.set(0,0,cameraDistance);

    /* handle size changes */
    const resize = () => {
      renderer.setSize(container.clientWidth, container.clientHeight);
      camera.perspective({ aspect: gl.canvas.width / gl.canvas.height });
    };
    window.addEventListener('resize', resize);
    resize();

    /* optional mouse parallax */
    const handleMouseMove = (e) => {
      const r = container.getBoundingClientRect();
      mouseRef.current = {
        x: ((e.clientX - r.left) / r.width ) * 2 - 1,
        y: -(((e.clientY - r.top)  / r.height) * 2 - 1),
      };
    };
    if (moveParticlesOnHover) container.addEventListener('mousemove', handleMouseMove);

    /* ----- geometry buffers ----- */
    const positions = new Float32Array(particleCount * 3);
    const randoms   = new Float32Array(particleCount * 4);
    const colors    = new Float32Array(particleCount * 3);

    for (let i=0;i<particleCount;i++) {
      let x,y,z,len;
      do {
        x = Math.random()*2-1;
        y = Math.random()*2-1;
        z = Math.random()*2-1;
        len = x*x + y*y + z*z;
      } while (len > 1 || len === 0);
      const r = Math.cbrt(Math.random());
      positions.set([x*r, y*r, z*r], i*3);
      randoms.set([Math.random(), Math.random(), Math.random(), Math.random()], i*4);

      const col = hexToRgb(particleColors[Math.floor(Math.random()*particleColors.length)]);
      colors.set(col, i*3);
    }

    const geometry = new Geometry(gl, {
      position: { size:3, data:positions },
      random:   { size:4, data:randoms },
      color:    { size:3, data:colors  },
    });

    const program = new Program(gl, {
      vertex, fragment,
      uniforms:{
        uTime:{ value:0 },
        uSpread:{ value:particleSpread },
        uBaseSize:{ value:particleBaseSize },
        uSizeRandomness:{ value:sizeRandomness },
        uAlphaParticles:{ value:alphaParticles ? 1 : 0 },
      },
      transparent:true,
      depthTest:false,
    });

    const particles = new Mesh(gl, { mode:gl.POINTS, geometry, program });

    /* -------- animate -------- */
    let last = performance.now(), elapsed = 0;
    const update = (now) => {
      const dt = now - last; last = now; elapsed += dt * speed;
      program.uniforms.uTime.value = elapsed * 0.001;

      if (moveParticlesOnHover) {
        particles.position.x = -mouseRef.current.x * particleHoverFactor;
        particles.position.y = -mouseRef.current.y * particleHoverFactor;
      }

      if (!disableRotation) {
        particles.rotation.x = Math.sin(elapsed*0.0002)*0.1;
        particles.rotation.y = Math.cos(elapsed*0.0005)*0.15;
        particles.rotation.z += 0.01*speed;
      }

      renderer.render({ scene:particles, camera });
      requestAnimationFrame(update);
    };
    requestAnimationFrame(update);

    /* cleanup on unmount */
    return () => {
      window.removeEventListener('resize', resize);
      if (moveParticlesOnHover) container.removeEventListener('mousemove', handleMouseMove);
      if (container.contains(gl.canvas)) container.removeChild(gl.canvas);
    };
  }, [
    particleCount, particleSpread, speed, moveParticlesOnHover, particleHoverFactor,
    alphaParticles, particleBaseSize, sizeRandomness, cameraDistance, disableRotation
  ]);

  return React.createElement('div', { ref:containerRef, className:`particles-container ${className}` });
}

/* make available globally for the page inline‑script */
window.Particles = Particles;
