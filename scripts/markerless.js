let camera, scene, renderer, raycaster, mouse;

function startMarkerlessAR() {
    document.getElementById('marker-ar').style.display = 'none';
    document.getElementById('markerless-ar').innerHTML = ''; // Clear any existing AR content
    document.getElementById('markerless-ar').style.display = 'block';

    // Set up camera
    camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 100);
    camera.position.set(0, 0, 0); // Set camera position
    camera.lookAt(0, 0, -1); // Look at the origin of the scene

    // Set up scene
    scene = new THREE.Scene();

    // Set up renderer
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById('markerless-ar').appendChild(renderer.domElement);

    // Set up raycaster and mouse
    raycaster = new THREE.Raycaster();
    mouse = new THREE.Vector2();

    // Event listener for mouse click
    document.addEventListener('click', onMouseClick, false);

    // Render loop
    renderer.setAnimationLoop(render);

    console.log('Markerless AR started');
}

function render() {
    renderer.render(scene, camera);
}

function onMouseClick(event) {
    // Calculate mouse position in normalized device coordinates
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    // Update the picking ray with the camera and mouse position
    raycaster.setFromCamera(mouse, camera);

    // Perform intersection test
    const intersects = raycaster.intersectObjects(scene.children, true);

    if (intersects.length > 0) {
        // If there's an intersection, place the model at the intersection point
        const intersection = intersects[0];
        const position = new THREE.Vector3().copy(intersection.point);
        placeModel(position);
    }
}

function placeModel(position) {
    // Load the 3D model
    const loader = new THREE.GLTFLoader();
    loader.load(
        '..models/your-model.glb',
        function (gltf) {
            // Once the model is loaded, position it at the specified location
            const model = gltf.scene;
            model.position.copy(position);
            scene.add(model);
        },
        undefined,
        function (error) {
            console.error('Error loading GLTF model:', error);
        }
    );
}

