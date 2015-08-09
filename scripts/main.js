// jshint devel:true
//////////////////////////////////////////////////////////////////////////////////
//		Init
//////////////////////////////////////////////////////////////////////////////////

// init renderer
var renderer	= new THREE.WebGLRenderer({
  antialias	: true
});
renderer.setClearColor(new THREE.Color('lightgrey'), 1)
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

// array of functions for the rendering loop
var onRenderFcts= [];

// init scene and camera
var scene	= new THREE.Scene();
var camera	= new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.01, 1000);
camera.position.z = 4;
var controls	= new THREE.OrbitControls(camera)

//////////////////////////////////////////////////////////////////////////////////
//		add an object in the scene
//////////////////////////////////////////////////////////////////////////////////

// add a torus
// var geometry	= new THREE.TorusKnotGeometry(0.5-0.12, 0.12);
// var material	= new THREE.MeshNormalMaterial();
// var mesh	= new THREE.Mesh( geometry, material );
// scene.add( mesh );

// Add light
var ambientLight = new THREE.AmbientLight(0x111111);
scene.add(ambientLight);

var light = new THREE.DirectionalLight(0x999999, 1.0);
light.position.set(-10, 10, 10);
light.target.position.set(0, 0, 0);
light.castShadow = true;
light.shadowDarkness = 0.2;
scene.add(light);

// ******************
//  Render Mesh
// ******************
var cache;
var renderScene = function (params) {
  if (cache) {
    scene.remove(cache);
  }

  var geometry = new THREE.SuperFormulaGeometry( params.widthSegments, params.heightSegments, params.a, params.b, params.m, params.n1, params.n2, params.n3 );
  var material = new THREE.MeshBasicMaterial( {color: 0xffff00} );

  var mesh = THREE.SceneUtils.createMultiMaterialObject( geometry, [
      new THREE.MeshLambertMaterial( { color: 0xffffff} ),
      new THREE.MeshBasicMaterial( { color: 0x222222, wireframe: true} )
  ]);

  cache = mesh;
  scene.add( cache );
};


// // ******************
// //  Render Particles
// // ******************
// var cache;
// var renderScene = function (params) {
//   if (cache) {
//     scene.remove(cache);
//   }
//
//   // geometry
//   var material = new THREE.PointCloudMaterial({
//       color: 0x00ff00,
//       size: 2,
//       sizeAttenuation: false
//   });
//
//   var points = createSuperFormulaShape(params);
//   var geometry = new THREE.Geometry();
//   geometry.vertices = points;
//
//   var particleSystem = new THREE.PointCloud(geometry, material);
//
//   cache = particleSystem;
//   scene.add( cache );
// };

// // ******************
// //   Render ConvexGeometry
// // ******************
// var cache;
// var renderScene = function (params) {
//   params.sampleSize = 50;
//
//   if (cache) {
//     scene.remove(cache);
//   }
//
//   // geometry
//   var material = new THREE.MeshPhongMaterial({
//       color: 0x00ff00
//   });
//
//   var points = createSuperFormulaShape(params);
//   var geometry = new THREE.ConvexGeometry(points);
//   var mesh = new THREE.Mesh(geometry, material);
//   mesh.position.x = -0.17;
//   mesh.position.y = -0.50;
//   mesh.position.z = -0.05;
//
//   cache = mesh;
//   scene.add( cache );
// };

// // ******************
// //   Render contour
// // ******************
// var cache;
// var renderScene = function (params) {
//   if (cache) {
//     scene.remove(cache);
//   }
//
//   // geometry
//   var points = createSuperFormulaShape(params);
//   var geometry = new THREE.Geometry();
//   geometry.vertices = points;
//
//   // material
//   var material = new THREE.LineBasicMaterial( { color: 0xffffff, linewidth: 1 } );
//
//   // line
//   var line = new THREE.Line( geometry, material );
//
//   cache = line;
//   scene.add( cache );
// };


//////////////////////////////////////////////////////////////////////////////////
//		render the whole thing on the page
//////////////////////////////////////////////////////////////////////////////////

// handle window resize
window.addEventListener('resize', function(){
  renderer.setSize( window.innerWidth, window.innerHeight )
  camera.aspect	= window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
}, false)

// render the scene
onRenderFcts.push(function(){
  renderer.render( scene, camera );
})

// run the rendering loop
var lastTimeMsec= null
requestAnimationFrame(function animate(nowMsec){
  // keep looping
  requestAnimationFrame( animate );
  // measure time
  lastTimeMsec	= lastTimeMsec || nowMsec-1000/60
  var deltaMsec	= Math.min(200, nowMsec - lastTimeMsec)
  lastTimeMsec	= nowMsec
  // call each update function
  onRenderFcts.forEach(function(onRenderFct){
    onRenderFct(deltaMsec/1000, nowMsec/1000)
  })
});
