// /**
//  * 1degree = pi / 180 is almost 0.017
//  */
// var createSuperFormulaShape = function (params) {
//   var vertices = [];
//
//   var a = params.a;
//   var b = params.b;
//   var m = params.m;
//   var n1 = params.n1;
//   var n2 = params.n2;
//   var n3 = params.n3;
//
//   // Create range for theta
//   var theta = [];
//
//   var n = 0.017 * (params.sampleSize || 1);
//   for (var i = -Math.PI; i < Math.PI; i += n) {
//     theta.push(i);
//   }
//
//   // Create range for phi
//   var phi = [];
//
//   for (var i = -Math.PI / 2; i < Math.PI / 2; i += n) {
//     phi.push(i);
//   }
//
//   // Loop over and add vertices
//   for (var i = 0; i < theta.length; i++) {
//     for (var j = 0; j < phi.length; j++) {
//       // So the used vars: i = theta, j = phi
//
//       // R1 uses theta, ranges from -pi to pi
//       var r1 = superFormula(theta[i], a, b, m, n1, n2, n3);
//
//       // R2 uses phi, ranges from -pi / 2 to pi / 2
//       var r2 = superFormula(phi[j], a, b, m, n1, n2, n3);
//
//       var x = superFormula3DgetX(r1, r2, theta[i], phi[j]);
//       var y = superFormula3DgetY(r1, r2, theta[i], phi[j]);
//       var z = superFormula3DgetZ(r1, r2, theta[i], phi[j]);
//
//       vertices.push(new THREE.Vector3(x, y, z));
//     }
//   }
//
//   return vertices;
// }
//
// /**
//  * Apply the superformula, can be found here: https://en.wikipedia.org/wiki/Superformula
//  * It is written in polar coordinates and we are getting the x, y and z coordinates out of it
//  * We also let the period go from -pi/2 to pi/2 for phi and -pi to pi for theta
//  */
// var superFormula = function(angle, a, b, m, n1, n2, n3) {
//   var part1 = Math.pow(Math.abs(Math.cos((m * angle) / 4) / a), n2);
//   var part2 = Math.pow(Math.abs(Math.sin((m * angle) / 4) / b), n3);
//   var r = Math.pow(Math.abs(part1 + part2), -(1 / n1));
//
//   return r;
// }
//
// /**
//  * Gets the x coordinate for the given r1 and r2
//  */
// var superFormula3DgetX = function (r1, r2, theta, phi) {
//   return (r1 * Math.cos(theta)) * (r2 * Math.cos(phi));
// }
//
// /**
//  * Gets the y coordinate for the given r1 and r2
//  */
// var superFormula3DgetY = function (r1, r2, theta, phi) {
//   return (r1 * Math.sin(theta)) * (r2 * Math.cos(phi));
// }
//
// /**
//  * Gets the z coordinate for the given r1 and r2
//  */
// var superFormula3DgetZ = function (r1, r2, theta, phi) {
//   return (r2 * Math.sin(phi));
// }
