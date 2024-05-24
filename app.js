let container;
let camera, scene, renderer;
let controller;
let reticle;
let hitTestSource = null;
let hitTestSourceRequested = false;
let model = null;

function startAR() {
    if (isIOS()) {
        document.getElementById('quick-look').click();
    } else {
        if (navigator.xr) {
            navigator.xr.requestSession('immersive-ar', {
                requiredFeatures: ['camera-access']
            }).then(() => {
                startWebXR();
            }).catch((error) => {
                console.error('Error requesting XR session:', error);
            });
        } else {
            console.error('WebXR not supported.');
        }
    }
}

function isIOS() {
    return /iPhone|iPad|iPod/i.test(navigator.userAgent);
}

function startWebXR() {
    document.getElementById('index-page').style.display = 'none';
    document.getElementById('ar-view').style.display = 'flex';

    container = document.createElement('div');
    document.body.appendChild(container);

    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 20);

    const light = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 1);
    light.position.set(0.5, 1, 0.25);
    scene.add(light);

    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.xr.enabled = true;
    container.appendChild(renderer.domElement);

    document.body.appendChild(VRButton.createButton(renderer));

    const loader = new THREE.GLTFLoader();
    loader.load('model/wombat-model.glb', (gltf) => {
        model = gltf.scene;
    });

    controller = renderer.xr.getController(0);
    controller.addEventListener('select', onSelect);
    scene.add(controller);

    reticle = new THREE.Mesh(
        new THREE.RingGeometry(0.15, 0.2, 32).rotateX(-Math.PI / 2),
        new THREE.MeshBasicMaterial()
    );
    reticle.matrixAutoUpdate = false;
    reticle.visible = false;
    scene.add(reticle);

    window.addEventListener('resize', onWindowResize, false);

    navigator.xr.requestSession('immersive-ar', {
        requiredFeatures: ['hit-test']
    }).then(onSessionStarted);

    renderer.setAnimationLoop(render);
}

function onSessionStarted(session) {
    session.addEventListener('end', onSessionEnded);
    renderer.xr.setSession(session);

    hitTestSourceRequested = false;
}

function onSessionEnded() {
    hitTestSourceRequested = false;
    hitTestSource = null;
}

function onSelect() {
    if (reticle.visible) {
        const clone = model.clone();
        clone.position.setFromMatrixPosition(reticle.matrix);
        scene.add(clone);
    }
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function render(timestamp, frame) {
    if (frame) {
        const referenceSpace = renderer.xr.getReferenceSpace();
        const session = renderer.xr.getSession();

        if (!hitTestSourceRequested) {
            session.requestReferenceSpace('viewer').then((referenceSpace) => {
                session.requestHitTestSource({ space: referenceSpace }).then((source) => {
                    hitTestSource = source;
                });
            });

            session.addEventListener('end', () => {
                hitTestSourceRequested = false;
                hitTestSource = null;
            });

            hitTestSourceRequested = true;
        }

        if (hitTestSource) {
            const hitTestResults = frame.getHitTestResults(hitTestSource);

            if (hitTestResults.length) {
                const hit = hitTestResults[0];

                reticle.visible = true;
                reticle.matrix.fromArray(hit.getPose(referenceSpace).transform.matrix);
            } else {
                reticle.visible = false;
            }
        }
    }

    renderer.render(scene, camera);
}

window.startAR = startAR;
