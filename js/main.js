// var camera, scene, renderer;
// var geometry, material, mesh;

// init();
// animate();

// function init() {

//     camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.01, 10 );
//     camera.position.z = 1;

//     scene = new THREE.Scene();

//     geometry = new THREE.BoxGeometry( 0.2, 0.2, 0.2 );
//     material = new THREE.MeshNormalMaterial();

//     mesh = new THREE.Mesh( geometry, material );
//     scene.add( mesh );

//     renderer = new THREE.WebGLRenderer( { antialias: true } );
//     renderer.setSize( window.innerWidth, window.innerHeight );
//     document.body.appendChild( renderer.domElement );

// }

// function animate() {

//     requestAnimationFrame( animate );

//     mesh.rotation.x += 0.01;
//     mesh.rotation.y += 0.02;

//     renderer.render( scene, camera );

// }


            if ( WEBGL.isWebGLAvailable() === false ) {
                document.body.appendChild( WEBGL.getWebGLErrorMessage() );
            }
            var renderer, scene, ThreeCamera;
            var spotLight, lightHelper, shadowCameraHelper, light_direction;
            var gui;
            var params = {
                    lightcolor: 0,
                    intensity: 0,
                    distance: 0,
                    angle: 0,
                    penumbra: 0,
                    decay: 0,
                    light_direction: 0
                };

            light_direction = 15;

            function init() {
                renderer = new THREE.WebGLRenderer();
                renderer.setPixelRatio( window.devicePixelRatio );
                // renderer.setSize( window.innerWidth, window.innerHeight );
                renderer.setSize(640, 480);
                document.body.appendChild( renderer.domElement );
                renderer.shadowMap.enabled = true;
                renderer.shadowMap.type = THREE.PCFSoftShadowMap;
                renderer.gammaInput = true;
                renderer.gammaOutput = true;
                scene = new THREE.Scene();
                ThreeCamera = new THREE.PerspectiveCamera( 35, window.innerWidth / window.innerHeight, 1, 1000 );
                ThreeCamera.position.set( 65, 8, - 10 );
                var controls = new THREE.OrbitControls( ThreeCamera, renderer.domElement );
                controls.addEventListener( 'change', render );
                controls.minDistance = 20;
                controls.maxDistance = 500;
                controls.enablePan = false;
                var ambient = new THREE.AmbientLight( 0xffffff, 0.1 );
                scene.add( ambient );
                spotLight = new THREE.SpotLight( 0xffffff, 1 );
                // spotLight.position.set( 15, 40, 35 );
                // spotLight.position.set( light_direction, 40, 35 );
                // spotLight.position.set( light_direction, 40, 35 );
                spotLight.position.set( 15, light_direction, 35 );
                // spotLight.angle = Math.PI / 4;

                spotLight.angle = global_light_angle;

                
                spotLight.penumbra = 0.05;
                spotLight.decay = 2;
                spotLight.distance = 200;
                spotLight.castShadow = true;
                spotLight.shadow.mapSize.width = 1024;
                spotLight.shadow.mapSize.height = 1024;
                spotLight.shadow.camera.near = 10;
                spotLight.shadow.camera.far = 200;
                scene.add( spotLight );
                lightHelper = new THREE.SpotLightHelper( spotLight );
                scene.add( lightHelper );
                shadowCameraHelper = new THREE.CameraHelper( spotLight.shadow.camera );
                scene.add( shadowCameraHelper );
                scene.add( new THREE.AxesHelper( 10 ) );
                var material = new THREE.MeshPhongMaterial( { color: 0x808080, dithering: true } );
                var geometry = new THREE.PlaneBufferGeometry( 2000, 2000 );
                var mesh = new THREE.Mesh( geometry, material );
                mesh.position.set( 0, - 1, 0 );
                mesh.rotation.x = - Math.PI * 0.5;
                mesh.receiveShadow = true;
                scene.add( mesh );
                var material = new THREE.MeshPhongMaterial( { color: 0x4080ff, dithering: true } );
                var geometry = new THREE.BoxBufferGeometry( 3, 1, 2 );
                var mesh = new THREE.Mesh( geometry, material );
                mesh.position.set( 40, 2, 0 );
                mesh.castShadow = true;
                scene.add( mesh );
                controls.target.copy( mesh.position );
                controls.update();
                window.addEventListener( 'resize', onResize, false );

            }
            function onResize() {
                ThreeCamera.aspect = window.innerWidth / window.innerHeight;
                ThreeCamera.updateProjectionMatrix();
                // renderer.setSize( window.innerWidth, window.innerHeight );
                renderer.setSize(100, 100);
            }
            function render() {

                console.log("In Three: global_pos: ", global_pos);

                lightHelper.update();
                shadowCameraHelper.update();
                renderer.render( scene, ThreeCamera );
            }
            function animate() {
                requestAnimationFrame( animate );
                spotLight.angle = global_light_angle;
                spotLight.position.set( 15, global_pos, 35 );

                params.angle = global_light_angle;
                params.light_direction = global_pos;

                // Iterate over all controllers
                // for (var i in gui.__controllers) {
                //     gui.__controllers[i].updateDisplay();
                // }
                render();
                // stats.update();
            }


            function buildGui() {
                gui = new dat.GUI();

                params.lightcolor = spotLight.color.getHex();
                params.intensity = spotLight.intensity;
                params.distance = spotLight.distance;
                params.angle = spotLight.angle;
                params.penumbra = spotLight.penumbra;
                params.decay = spotLight.decay;
                params.light_direction = 0;

                // params = {
                //     lightcolor: spotLight.color.getHex(),
                //     intensity: spotLight.intensity,
                //     distance: spotLight.distance,
                //     angle: spotLight.angle,
                //     penumbra: spotLight.penumbra,
                //     decay: spotLight.decay,
                //     light_direction: 0,
                // };

                gui.addColor( params, 'lightcolor' ).onChange( function ( val ) {
                    spotLight.color.setHex( val );
                    render();
                } );
                gui.add( params, 'intensity', 0, 2 ).onChange( function ( val ) {
                    spotLight.intensity = val;
                    render();
                } );
                gui.add( params, 'distance', 50, 200 ).onChange( function ( val ) {
                    spotLight.distance = val;
                    render();
                } );
                // gui.add( params, 'angle', 0, Math.PI / 3 ).onChange( function ( val ) {
                gui.add( params, 'angle', 0, 1 ).onChange( function ( val ) {
                    spotLight.angle = val;
                    render();
                } ).listen();
                gui.add( params, 'penumbra', 0, 1 ).onChange( function ( val ) {
                    spotLight.penumbra = val;
                    render();
                } );
                gui.add( params, 'decay', 1, 2 ).onChange( function ( val ) {
                    spotLight.decay = val;
                    render();
                } );
                gui.add( params, 'light_direction', 0, 100 ).onChange( function ( val ) {
                    spotLight.position.x = val;
                    render();
                } ).listen();

                gui.open();
            }
            init();
            buildGui();
            animate();
            // render();