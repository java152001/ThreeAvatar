import { Scene, PerspectiveCamera, WebGLRenderer, sRGBEncoding, AmbientLight, DirectionalLight, SpotLight, AnimationMixer, Clock, Vector3, Vector2 } from 'three';
import { GLTFLoader } from 'https://unpkg.com/three@0.141.0/examples/jsm/loaders/GLTFLoader.js';

const avatarDiv = document.getElementById('avatarLoc');
const backgroundDiv = document.getElementById('backgroundCont');

console.log(backgroundDiv);

const size = 150;

const clock = new Clock();

const scene = new Scene();
const camera = new PerspectiveCamera( 60, size / size, .1, 10000 );
const renderer = new WebGLRenderer({ alpha: true, antialias: true });

renderer.physicallyCorrectLights = true;
renderer.outputEncoding = sRGBEncoding;
renderer.setClearColor(0x000000, 0);
renderer.setSize( size, size );
avatarDiv.appendChild( renderer.domElement );

const ambientLight = new AmbientLight(0x222222);
ambientLight.intensity = 5;
scene.add(ambientLight);

const backLight = new DirectionalLight(0xffffff);
backLight.position.set(-4.187, 0.839, -5.601);
backLight.intensity = 4;
scene.add(backLight);

const fillLight = new DirectionalLight(0xffffff);
fillLight.position.set(2.78, 0.942, 2.727);
fillLight.intensity = 2;
scene.add(fillLight);

const keyLight = new SpotLight(0xffffff);
keyLight.position.set(-2.268, 2.076, 5);
keyLight.intensity = 12;
scene.add(keyLight);

camera.position.y = 1.7;
camera.position.z = .55;
camera.aspect = size / size;
camera.updateProjectionMatrix;
camera.zoom = -10

function animate() {
    requestAnimationFrame( animate );
    renderer.render( scene, camera );
}

const loader = new GLTFLoader();

loader.load('./exampleAvatar.glb', function( gltf ) {
    let model = gltf.scene;

    const mixer = new AnimationMixer(model);
    mixer.timeScale = .5;

    const { left, top } = avatarDiv.getBoundingClientRect();
    const { pageXOffset, pageYOffset } = window;

    const elementCenterPosition = new Vector2(
        left + pageXOffset + avatarDiv.clientWidth / 2,
        top + pageYOffset + avatarDiv.clientHeight / 2
    );

    document.addEventListener("mousemove", function(event) {
        const { clientX, clientY } = event;

        const mouseX = (clientX / backgroundDiv.offsetWidth) * 2 - 1;
        const mouseY = ((clientY / backgroundDiv.offsetHeight) * 2 + 1) * -1;

        let currentMouse = new Vector2(mouseX, mouseY);

        const centerX = -1 + ((1 - (-1)) * (elementCenterPosition.x - 0)) / (backgroundDiv.offsetWidth - 0);
        const centerY = -1 + ((1 - (-1)) * (elementCenterPosition.y - 0)) / (backgroundDiv.offsetHeight - 0) * -1;

        const centerSpots = new Vector2(centerX, centerY);

        const deltaToMouse = new Vector2();

        deltaToMouse.subVectors(currentMouse, centerSpots);

        const { x, y } = deltaToMouse.clampScalar(-0.35, 0.65);

        const rotation = new Vector3(-y, x, 0);

        model.children[0].children[5].skeleton.bones[5].rotation.setFromVector3(new Vector3(rotation.x, rotation.y, 0), 'XYZ');

        mixer.update(clock.getDelta());
    });

    scene.add ( model );
    
}, undefined, function ( error ) {
    console.error( error );
})

animate();


/*** Virtual Office Manipulation ***/

const statue = document.getElementById('statue');
const statueModal = document.getElementById('statueModal');

statue.addEventListener('click', function() {
    console.log('clicked');
    statueModal.classList.add('show');
})