import { useEffect, useRef, useState } from 'react';
import { responsiveImages } from '../../data/responsiveImages.js';

export default function PanoramaViewer({ src, title }) {
  const container = useRef(null);
  const [status, setStatus] = useState('loading');

  useEffect(() => {
    const host = container.current;
    let disposed = false;
    let cleanup = () => {};

    async function initialize() {
      try {
        const THREE = await import('three');
        if (disposed) return;
        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 100);
        const geometry = new THREE.SphereGeometry(10, 64, 40);
        geometry.scale(-1, 1, 1);
        const material = new THREE.MeshBasicMaterial();
        scene.add(new THREE.Mesh(geometry, material));
        const canvas = renderer.domElement;
        canvas.style.cssText = 'display:block;width:100%;height:100%;touch-action:none;cursor:grab';
        canvas.tabIndex = 0;
        canvas.setAttribute('aria-label', `${title}. Drag or use arrow keys to look around; plus and minus to zoom.`);
        host.appendChild(canvas);
        let yaw = Math.PI;
        let pitch = 0;
        let pointer = null;
        const render = () => {
          camera.lookAt(Math.cos(pitch) * Math.sin(yaw), Math.sin(pitch), Math.cos(pitch) * Math.cos(yaw));
          renderer.render(scene, camera);
        };
        const resize = () => {
          const { width, height } = host.getBoundingClientRect();
          if (!width || !height) return;
          renderer.setSize(width, height, false);
          camera.aspect = width / height;
          camera.updateProjectionMatrix();
          render();
        };
        const zoom = (delta) => {
          camera.fov = Math.max(30, Math.min(100, camera.fov + delta));
          camera.updateProjectionMatrix();
          render();
        };
        const down = (event) => {
          pointer = { id: event.pointerId, x: event.clientX, y: event.clientY };
          canvas.setPointerCapture(event.pointerId);
          canvas.focus();
        };
        const move = (event) => {
          if (!pointer || pointer.id !== event.pointerId) return;
          yaw -= (event.clientX - pointer.x) * 0.005;
          pitch = Math.max(-1.5, Math.min(1.5, pitch + (event.clientY - pointer.y) * 0.005));
          pointer.x = event.clientX;
          pointer.y = event.clientY;
          render();
        };
        const up = () => { pointer = null; };
        const wheel = (event) => { event.preventDefault(); zoom(event.deltaY * 0.03); };
        const key = (event) => {
          if (!['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', '+', '=', '-'].includes(event.key)) return;
          event.preventDefault();
          if (event.key === 'ArrowLeft') yaw += 0.1;
          if (event.key === 'ArrowRight') yaw -= 0.1;
          if (event.key === 'ArrowUp') pitch = Math.min(1.5, pitch + 0.1);
          if (event.key === 'ArrowDown') pitch = Math.max(-1.5, pitch - 0.1);
          if (event.key === '+' || event.key === '=') zoom(-5);
          if (event.key === '-') zoom(5);
          render();
        };
        const contextLost = (event) => { event.preventDefault(); setStatus('error'); };
        const listeners = { pointerdown: down, pointermove: move, pointerup: up, pointercancel: up, lostpointercapture: up, wheel, keydown: key, webglcontextlost: contextLost };
        Object.entries(listeners).forEach(([name, handler]) => canvas.addEventListener(name, handler, { passive: false }));
        const observer = new ResizeObserver(resize);
        observer.observe(host);
        cleanup = () => {
          observer.disconnect();
          Object.entries(listeners).forEach(([name, handler]) => canvas.removeEventListener(name, handler));
          material.map?.dispose();
          material.dispose();
          geometry.dispose();
          renderer.dispose();
          canvas.remove();
        };
        resize();
        new THREE.TextureLoader().load(responsiveImages.get(src)?.src || src, (texture) => {
          if (disposed) { texture.dispose(); return; }
          texture.colorSpace = THREE.SRGBColorSpace;
          material.map = texture;
          material.needsUpdate = true;
          render();
          setStatus('ready');
        }, undefined, () => { if (!disposed) setStatus('error'); });
      } catch {
        if (!disposed) setStatus('error');
      }
    }
    initialize();
    return () => { disposed = true; cleanup(); };
  }, [src, title]);

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', minHeight: 300 }}>
      <div ref={container} style={{ position: 'absolute', inset: 0 }} />
      {status !== 'ready' && (
        <div role="status" style={{ position: 'absolute', inset: 0, display: 'grid', placeContent: 'center', background: '#111', color: '#fff', textAlign: 'center', padding: 24 }}>
          {status === 'loading' ? 'Loading 360° view…' : <><p>Unable to load the 360° view.</p><a href={src} target="_blank" rel="noopener noreferrer" style={{ color: 'inherit' }}>Open original image</a></>}
        </div>
      )}
    </div>
  );
}
