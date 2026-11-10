import { useEffect, useRef, useState } from 'react';

export default function FinancingScene() {
  const hostRef = useRef(null);
  const [ready, setReady] = useState(false);
  const [paused, setPaused] = useState(false);
  const pauseRef = useRef(false);

  useEffect(() => {
    const host = hostRef.current;
    let disposed = false;
    let cleanup = () => {};
    import('three').then(async THREE => {
      const { OrbitControls } = await import('three/addons/controls/OrbitControls.js');
      if (disposed) return;
      let renderer;
      try { renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true }); }
      catch { return; }
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
      renderer.setClearColor(0x000000, 0);
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      host.appendChild(renderer.domElement);
      renderer.domElement.setAttribute('aria-label', 'Interactive 3D house with dollar bills and gold coins. Drag to rotate; use arrow keys when focused.');
      renderer.domElement.setAttribute('role', 'img');
      renderer.domElement.tabIndex = 0;
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(36, 1, .1, 100);
      camera.position.set(6, 4.5, 8);
      const controls = new OrbitControls(camera, renderer.domElement);
      controls.target.set(0, 1.1, 0);
      controls.enableZoom = false;
      controls.enablePan = false;
      controls.minPolarAngle = .5;
      controls.maxPolarAngle = Math.PI / 2.1;
      controls.autoRotateSpeed = .65;
      scene.add(new THREE.HemisphereLight(0xffffff, 0x64786b, 2.6));
      const light = new THREE.DirectionalLight(0xffefd2, 4);
      light.position.set(4, 7, 5);
      scene.add(light);
      const fill = new THREE.DirectionalLight(0xd6e8ff, 2);
      fill.position.set(-5, 3, -4);
      scene.add(fill);
      const model = new THREE.Group();
      scene.add(model);
      const material = (color, metalness = 0) => new THREE.MeshStandardMaterial({ color, metalness, roughness: metalness ? .3 : .65 });
      const white = material(0xf5f0e5);
      const navy = material(0x112033);
      const gold = material(0xdab36a, .7);
      const glass = material(0x9ebec6, .25);
      const green = material(0x759a79);
      const box = (w, h, d, mat, x, y, z) => {
        const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
        mesh.position.set(x, y, z);
        model.add(mesh);
        return mesh;
      };
      const base = new THREE.Mesh(new THREE.CylinderGeometry(2.8, 2.85, .18, 64), material(0xc8d9ce));
      model.add(base);
      box(2.8, 1.6, 2.1, white, 0, .9, 0);
      const roofShape = new THREE.Shape();
      roofShape.moveTo(-1.6, 0); roofShape.lineTo(0, 1.1); roofShape.lineTo(1.6, 0); roofShape.closePath();
      const roof = new THREE.Mesh(new THREE.ExtrudeGeometry(roofShape, { depth: 2.5, bevelEnabled: false }), navy);
      roof.position.set(0, 1.7, -1.25);
      model.add(roof);
      box(.62, 1.15, .08, navy, 0, .68, 1.09);
      box(.1, .1, .08, gold, .2, .65, 1.15);
      [-.95, .95].forEach(x => {
        box(.62, .72, .1, gold, x, 1.03, 1.09);
        box(.5, .6, .12, glass, x, 1.03, 1.12);
        box(.035, .6, .13, white, x, 1.03, 1.14);
      });
      [-.55, .55].forEach(z => box(.1, .65, .5, glass, 1.44, 1.05, z));
      box(.44, .8, .4, white, .85, 2.35, -.6);
      box(.54, .12, .5, gold, .85, 2.76, -.6);
      box(1.1, .15, .5, white, 0, .12, 1.35);
      const textures = [];
      const billCanvas = document.createElement('canvas');
      billCanvas.width = 512; billCanvas.height = 256;
      const ctx = billCanvas.getContext('2d');
      ctx.fillStyle = '#adc39a'; ctx.fillRect(0, 0, 512, 256);
      ctx.strokeStyle = '#3e6547'; ctx.lineWidth = 8; ctx.strokeRect(15, 15, 482, 226);
      ctx.lineWidth = 2; ctx.strokeRect(27, 27, 458, 202);
      ctx.beginPath(); ctx.ellipse(256, 128, 76, 95, 0, 0, Math.PI * 2); ctx.stroke();
      ctx.fillStyle = '#31593c'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.font = 'bold 130px Georgia'; ctx.fillText('$', 256, 136);
      ctx.font = 'bold 46px Georgia'; ctx.fillText('$', 65, 62); ctx.fillText('$', 447, 197);
      const billTexture = new THREE.CanvasTexture(billCanvas);
      billTexture.colorSpace = THREE.SRGBColorSpace;
      textures.push(billTexture);
      const billMat = new THREE.MeshStandardMaterial({ map: billTexture, side: THREE.DoubleSide, roughness: .85 });
      const billPositions = [[-2, 2.8, .2], [1.9, 3.1, -.4], [1.9, 1.5, 1.5]];
      billPositions.forEach(([x, y, z], i) => {
        const geometry = new THREE.PlaneGeometry(1.45, .72, 24, 8);
        const points = geometry.attributes.position;
        for (let j = 0; j < points.count; j++) points.setZ(j, Math.sin(points.getX(j) * 4) * .12);
        geometry.computeVertexNormals();
        const bill = new THREE.Mesh(geometry, billMat);
        bill.position.set(x, y, z);
        bill.rotation.set(-.15, i * .35, (i - 1) * .3);
        model.add(bill);
      });
      for (let i = 0; i < 5; i++) {
        const coin = new THREE.Mesh(new THREE.CylinderGeometry(.38, .38, .11, 40), gold);
        coin.position.set(1.6, .18 + i * .12, 1.4);
        model.add(coin);
      }
      for (let i = 0; i < 4; i++) box(1.05, .07, .53, green, -1.35, .17 + i * .075, 1.5);
      box(.2, .32, .56, gold, -1.35, .3, 1.5);
      const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
      let visible = true;
      let frame = 0;
      let previousTime = 0;
      const render = () => renderer.render(scene, camera);
      const tick = time => {
        frame = requestAnimationFrame(tick);
        if (!visible || document.hidden) { previousTime = time; return; }
        controls.autoRotate = !pauseRef.current && !motion.matches;
        if (controls.autoRotate) { controls.update(Math.min((time - previousTime) / 1000, .05)); render(); }
        previousTime = time;
      };
      controls.addEventListener('change', render);
      const resize = new ResizeObserver(() => {
        const { width, height } = host.getBoundingClientRect();
        if (!width || !height) return;
        renderer.setSize(width, height);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        render();
      });
      resize.observe(host);
      const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; });
      observer.observe(host);
      const onKey = event => {
        if (!['ArrowLeft', 'ArrowRight'].includes(event.key)) return;
        event.preventDefault();
        model.rotation.y += event.key === 'ArrowLeft' ? -.15 : .15;
        render();
      };
      renderer.domElement.addEventListener('keydown', onKey);
      controls.update(); render();
      frame = requestAnimationFrame(tick);
      setReady(true);
      cleanup = () => {
        cancelAnimationFrame(frame); resize.disconnect(); observer.disconnect();
        renderer.domElement.removeEventListener('keydown', onKey);
        controls.dispose();
        const geometries = new Set(); const materials = new Set();
        scene.traverse(object => { if (object.isMesh) { geometries.add(object.geometry); materials.add(object.material); } });
        geometries.forEach(item => item.dispose()); materials.forEach(item => item.dispose()); textures.forEach(item => item.dispose());
        renderer.dispose(); renderer.domElement.remove();
      };
    }).catch(() => { /* Keep the static fallback when WebGL is unavailable. */ });
    return () => { disposed = true; cleanup(); };
  }, []);

  return <div className="financing-scene">
    {!ready && <img className="financing-scene-fallback" src="/financing/home-financing-3d.webp" alt="Home improvement financing: a house, dollar bills and gold coins" width="1000" height="667" loading="lazy" />}
    <div className="financing-scene-canvas" ref={hostRef} />
    {ready && <div className="financing-scene-controls"><span>Drag to explore in 3D</span><button type="button" aria-pressed={paused} onClick={() => { pauseRef.current = !paused; setPaused(!paused); }}>{paused ? 'Resume rotation' : 'Pause rotation'}</button></div>}
  </div>;
}
