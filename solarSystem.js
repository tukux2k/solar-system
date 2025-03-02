// Scene, Camera, Renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Lighting
const light = new THREE.PointLight(0xffffff, 1.5, 100);
light.position.set(0, 0, 0);
scene.add(light);

// Sun
const sunGeometry = new THREE.SphereGeometry(5, 32, 32);
const sunMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00 });
const sun = new THREE.Mesh(sunGeometry, sunMaterial);
scene.add(sun);

// Planets and Moons
const planets = [
  { name: "Mercury", radius: 0.4, distance: 10, color: 0xaaaaaa, moons: [] },
  { name: "Venus", radius: 0.9, distance: 20, color: 0xffaa00, moons: [] },
  { name: "Earth", radius: 1, distance: 30, color: 0x0000ff, moons: [{ radius: 0.2, distance: 3, color: 0x888888 }] },
  { name: "Mars", radius: 0.5, distance: 40, color: 0xff0000, moons: [{ radius: 0.1, distance: 2, color: 0xaaaaaa }, { radius: 0.1, distance: 4, color: 0xaaaaaa }] },
  { name: "Jupiter", radius: 2, distance: 60, color: 0xffcc99, moons: [{ radius: 0.3, distance: 5, color: 0x888888 }, { radius: 0.3, distance: 7, color: 0x888888 }] },
  { name: "Saturn", radius: 1.8, distance: 80, color: 0xffdd99, moons: [{ radius: 0.2, distance: 4, color: 0x888888 }, { radius: 0.2, distance: 6, color: 0x888888 }] },
  { name: "Uranus", radius: 1.5, distance: 100, color: 0x99ccff, moons: [{ radius: 0.2, distance: 3, color: 0x888888 }, { radius: 0.2, distance: 5, color: 0x888888 }] },
  { name: "Neptune", radius: 1.4, distance: 120, color: 0x3366ff, moons: [{ radius: 0.2, distance: 4, color: 0x888888 }] }
];

const planetMeshes = [];
planets.forEach(planet => {
  const planetGeometry = new THREE.SphereGeometry(planet.radius, 32, 32);
  const planetMaterial = new THREE.MeshPhongMaterial({ color: planet.color });
  const planetMesh = new THREE.Mesh(planetGeometry, planetMaterial);
  planetMesh.position.x = planet.distance;
  scene.add(planetMesh);

  // Moons
  planet.moons.forEach(moon => {
    const moonGeometry = new THREE.SphereGeometry(moon.radius, 32, 32);
    const moonMaterial = new THREE.MeshPhongMaterial({ color: moon.color });
    const moonMesh = new THREE.Mesh(moonGeometry, moonMaterial);
    moonMesh.position.x = planet.distance + moon.distance;
    planetMesh.add(moonMesh);
  });

  planetMeshes.push(planetMesh);
});

// Camera Position
camera.position.z = 150;

// Animation Loop
function animate() {
  requestAnimationFrame(animate);

  // Rotate Sun
  sun.rotation.y += 0.005;

  // Rotate Planets and Moons
  planetMeshes.forEach((planet, index) => {
    planet.rotation.y += 0.01;
    planet.position.x = planets[index].distance * Math.cos(planet.rotation.y);
    planet.position.z = planets[index].distance * Math.sin(planet.rotation.y);

    // Rotate Moons
    planet.children.forEach(moon => {
      moon.rotation.y += 0.02;
      moon.position.x = planets[index].moons[0].distance * Math.cos(moon.rotation.y);
      moon.position.z = planets[index].moons[0].distance * Math.sin(moon.rotation.y);
    });
  });

  renderer.render(scene, camera);
}

animate();

// Handle Window Resize
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
