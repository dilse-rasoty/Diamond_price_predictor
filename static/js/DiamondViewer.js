// DiamondViewer.js
// A minimal Three.js GLTF viewer for a diamond model, interactive with mouse
import * as THREE from './three/three.module.js';
import { OrbitControls } from './three/OrbitControls.js';
import { GLTFLoader } from './three/GLTFLoader.js';

export function mountDiamondViewer(containerId, modelUrl) {
    const container = document.getElementById(containerId);
    if (!container) return;
    // Clean up if already mounted
    container.innerHTML = '';
    const width = container.clientWidth;
    const height = container.clientHeight;
    const scene = new THREE.Scene();
    scene.background = null;
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, 3);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setClearColor(0x000000, 0);
    renderer.setSize(width, height);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);
    // Ultra Sparkle Lighting for diamond (all pure white, even more lights)
    const ambient = new THREE.AmbientLight(0xffffff, 0.18);
    scene.add(ambient);
    // Even more pure white point lights for maximum sparkle (quadrupled)
    const sparklePositions = [
        // Original positions
        [2, 3, 4], [-3, 2, 2], [0, -3, 3], [1, -2, 4], [-2, 4, -2], [0, 0, 6],
        [3, -3, 2], [-4, 1, 5], [0, 5, 0], [0, -5, 0], [5, 0, 0], [-5, 0, 0],
        [2, -4, 5], [-3, -5, 2], [4, 2, -3], [-2, -3, 4], [3, 4, -2], [-4, -2, 3],
        [4, 4, 4], [-4, 4, 4], [4, -4, 4], [-4, -4, 4], [4, 4, -4], [-4, 4, -4],
        [4, -4, -4], [-4, -4, -4], [6, 0, 0], [-6, 0, 0], [0, 6, 0], [0, -6, 0],
        [0, 0, 8], [0, 0, -8],
        // Duplicates with slightly offset positions for more sparkle
        [2.5, 3.5, 4.5], [-3.5, 2.5, 2.5], [0.5, -3.5, 3.5], [1.5, -2.5, 4.5], [-2.5, 4.5, -2.5], [0.5, 0.5, 6.5],
        [3.5, -3.5, 2.5], [-4.5, 1.5, 5.5], [0.5, 5.5, 0.5], [0.5, -5.5, 0.5], [5.5, 0.5, 0.5], [-5.5, 0.5, 0.5],
        [2.5, -4.5, 5.5], [-3.5, -5.5, 2.5], [4.5, 2.5, -3.5], [-2.5, -3.5, 4.5], [3.5, 4.5, -2.5], [-4.5, -2.5, 3.5],
        [4.5, 4.5, 4.5], [-4.5, 4.5, 4.5], [4.5, -4.5, 4.5], [-4.5, -4.5, 4.5], [4.5, 4.5, -4.5], [-4.5, 4.5, -4.5],
        [4.5, -4.5, -4.5], [-4.5, -4.5, -4.5], [6.5, 0.5, 0.5], [-6.5, 0.5, 0.5], [0.5, 6.5, 0.5], [0.5, -6.5, 0.5],
        [0.5, 0.5, 8.5], [0.5, 0.5, -8.5],
        // More sparkle: additional random and patterned positions
        [3, 6, 5], [-3, 6, 5], [3, -6, 5], [-3, -6, 5], [6, 3, 5], [-6, 3, 5], [6, -3, 5], [-6, -3, 5],
        [5, 5, 7], [-5, 5, 7], [5, -5, 7], [-5, -5, 7], [7, 0, 0], [-7, 0, 0], [0, 7, 0], [0, -7, 0],
        [0, 0, 10], [0, 0, -10], [8, 8, 8], [-8, 8, 8], [8, -8, 8], [-8, -8, 8], [8, 8, -8], [-8, 8, -8],
        [8, -8, -8], [-8, -8, -8], [10, 0, 0], [-10, 0, 0], [0, 10, 0], [0, -10, 0], [0, 0, 12], [0, 0, -12]
    ];
    sparklePositions.forEach(pos => {
        const pl = new THREE.PointLight(0xffffff, 10.0, 0); // even higher intensity
        pl.position.set(...pos);
        scene.add(pl);
    });
    // Add even more spotlights for extra highlight
    const spot1a = new THREE.SpotLight(0xffffff, 10.0, 18, Math.PI / 8, 0.5, 1);
    spot1a.position.set(2, 6, 4);
    spot1a.target.position.set(0, 0, 0);
    scene.add(spot1a);
    scene.add(spot1a.target);
    const spot2a = new THREE.SpotLight(0xffffff, 10.0, 18, Math.PI / 10, 0.7, 1);
    spot2a.position.set(-4, 5, 3);
    spot2a.target.position.set(0, 0, 0);
    scene.add(spot2a);
    scene.add(spot2a.target);
    const spot3a = new THREE.SpotLight(0xffffff, 9.0, 18, Math.PI / 7, 0.6, 1);
    spot3a.position.set(0, -7, 5);
    spot3a.target.position.set(0, 0, 0);
    scene.add(spot3a);
    scene.add(spot3a.target);
    // Three more spotlights from new angles
    const spot4 = new THREE.SpotLight(0xffffff, 8.0, 18, Math.PI / 9, 0.6, 1);
    spot4.position.set(7, -8, 8);
    spot4.target.position.set(0, 0, 0);
    scene.add(spot4);
    scene.add(spot4.target);
    const spot5 = new THREE.SpotLight(0xffffff, 8.0, 18, Math.PI / 9, 0.6, 1);
    spot5.position.set(-7, 8, -8);
    spot5.target.position.set(0, 0, 0);
    scene.add(spot5);
    scene.add(spot5.target);
    const spot6 = new THREE.SpotLight(0xffffff, 8.0, 18, Math.PI / 9, 0.6, 1);
    spot6.position.set(0, 10, -9);
    spot6.target.position.set(0, 0, 0);
    scene.add(spot6);
    scene.add(spot6.target);
    // Even stronger directional light
    const dirLightA = new THREE.DirectionalLight(0xffffff, 16.0);
    dirLightA.position.set(8, 16, 12);
    dirLightA.castShadow = true;
    dirLightA.shadow.mapSize.width = 2048;
    dirLightA.shadow.mapSize.height = 2048;
    dirLightA.shadow.camera.near = 1;
    dirLightA.shadow.camera.far = 40;
    scene.add(dirLightA);
    // Add three pure white spotlights for extra highlight (doubled intensity)
    const spot1b = new THREE.SpotLight(0xffffff, 6.4, 12, Math.PI / 8, 0.5, 1);
    spot1b.position.set(2, 6, 4);
    spot1b.target.position.set(0, 0, 0);
    scene.add(spot1b);
    scene.add(spot1b.target);
    const spot2b = new THREE.SpotLight(0xffffff, 6.4, 12, Math.PI / 10, 0.7, 1);
    spot2b.position.set(-4, 5, 3);
    spot2b.target.position.set(0, 0, 0);
    scene.add(spot2b);
    scene.add(spot2b.target);
    const spot3b = new THREE.SpotLight(0xffffff, 5.6, 12, Math.PI / 7, 0.6, 1);
    spot3b.position.set(0, -7, 5);
    spot3b.target.position.set(0, 0, 0);
    scene.add(spot3b);
    scene.add(spot3b.target);
    const dirLightB = new THREE.DirectionalLight(0xffffff, 8.0);
    dirLightB.position.set(4, 8, 6);
    dirLightB.castShadow = true;
    dirLightB.shadow.mapSize.width = 1024;
    dirLightB.shadow.mapSize.height = 1024;
    dirLightB.shadow.camera.near = 1;
    dirLightB.shadow.camera.far = 20;
    scene.add(dirLightB);
    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.enablePan = false;
    controls.minDistance = 2;
    controls.maxDistance = 6;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 2.75;
    // Load model
    const loader = new GLTFLoader();
    loader.load(modelUrl, (gltf) => {
        const model = gltf.scene;
        model.traverse(obj => {
            if (obj.isMesh) {
                obj.castShadow = true;
                obj.receiveShadow = true;
                // Pure white, ultra-sparkle diamond material (no blue/green tint)
                obj.material.transparent = true;
                obj.material.opacity = 0.82;
                obj.material.roughness = 0.001;
                obj.material.metalness = 1.0;
                obj.material.envMapIntensity = 7.5; // even more sparkle
                obj.material.refractionRatio = 0.999;
                obj.material.color.set(0xffffff); // pure white
                if (obj.material.specular) obj.material.specular = new THREE.Color(0xffffff);
                if (typeof obj.material.shininess !== 'undefined') obj.material.shininess = 1000;
                // Remove any emissive color
                if (obj.material.emissive) obj.material.emissive.set(0x000000);
            }
        });
        model.position.set(0, 0, 0);
        model.scale.set(1.0, 1.0, 1.0);
        scene.add(model);
    });
    // Responsive
    window.addEventListener('resize', () => {
        const w = container.clientWidth;
        const h = container.clientHeight;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
    });
    // Animate
    function animate() {
        requestAnimationFrame(animate);
        controls.update();
        renderer.render(scene, camera);
    }
    animate();
}
