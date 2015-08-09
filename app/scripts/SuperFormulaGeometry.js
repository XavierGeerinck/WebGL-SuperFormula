/**
 * @author xavier geerinck http://xaviergeerinck.com
 */

THREE.SuperFormulaGeometry = function ( widthSegments, heightSegments, a, b, m, n1, n2, n3, phiStart, phiLength, thetaStart, thetaLength ) {

	THREE.Geometry.call( this );

	this.type = 'SuperFormulaGeometry';

	this.parameters = {
		widthSegments: widthSegments,
		heightSegments: heightSegments,
    a: a,
    b: b,
    m: m,
    n1: n1,
    n2: n2,
    n3: n3,
		phiStart: phiStart,
		phiLength: phiLength,
		thetaStart: thetaStart,
		thetaLength: thetaLength
	};

  widthSegments = widthSegments || 32;
  heightSegments = heightSegments || 32;
  a = a || 1;
  b = b || 1;
  m = m || 3;
  n1 = n1 || 2;
  n2 = n2 || 5;
  n3 = n3 || 7;

	widthSegments = Math.max( 3, Math.floor( widthSegments ) || 8 );
	heightSegments = Math.max( 2, Math.floor( heightSegments ) || 6 );

	phiStart = phiStart !== undefined ? phiStart : -Math.PI;
	phiLength = phiLength !== undefined ? phiLength : Math.PI * 2;

	thetaStart = thetaStart !== undefined ? thetaStart : -Math.PI / 2;
	thetaLength = thetaLength !== undefined ? thetaLength : Math.PI;

	var x, y, vertices = [], uvs = [];

	for ( y = 0; y <= heightSegments; y ++ ) {

		var verticesRow = [];
		var uvsRow = [];

		for ( x = 0; x <= widthSegments; x ++ ) {

			var u = x / widthSegments;
			var v = y / heightSegments;

			var vertex = new THREE.Vector3();

      // R1 uses theta, ranges from -pi to pi
      var r1 = superFormula(phiStart + u * phiLength, a, b, m, n1, n2, n3);

      // R2 uses phi, ranges from -pi / 2 to pi / 2
      var r2 = superFormula(thetaStart + v * thetaLength, a, b, m, n1, n2, n3);

      vertex.x = superFormula3DgetX(r1, r2, phiStart + u * phiLength, thetaStart + v * thetaLength);
      vertex.y = superFormula3DgetY(r1, r2, phiStart + u * phiLength, thetaStart + v * thetaLength);
      vertex.z = superFormula3DgetZ(r1, r2, phiStart + u * phiLength, thetaStart + v * thetaLength);

			// vertex.x = - radius * Math.cos( phiStart + u * phiLength ) * Math.sin( thetaStart + v * thetaLength );
			// vertex.y = radius * Math.cos( thetaStart + v * thetaLength );
			// vertex.z = radius * Math.sin( phiStart + u * phiLength ) * Math.sin( thetaStart + v * thetaLength );

			this.vertices.push( vertex );

			verticesRow.push( this.vertices.length - 1 );
			uvsRow.push( new THREE.Vector2( u, 1 - v ) );

		}

		vertices.push( verticesRow );
		uvs.push( uvsRow );

	}

	for ( y = 0; y < heightSegments; y ++ ) {

		for ( x = 0; x < widthSegments; x ++ ) {

			var v1 = vertices[ y ][ x + 1 ];
			var v2 = vertices[ y ][ x ];
			var v3 = vertices[ y + 1 ][ x ];
			var v4 = vertices[ y + 1 ][ x + 1 ];

			var n1 = this.vertices[ v1 ].clone().normalize();
			var n2 = this.vertices[ v2 ].clone().normalize();
			var n3 = this.vertices[ v3 ].clone().normalize();
			var n4 = this.vertices[ v4 ].clone().normalize();

			var uv1 = uvs[ y ][ x + 1 ].clone();
			var uv2 = uvs[ y ][ x ].clone();
			var uv3 = uvs[ y + 1 ][ x ].clone();
			var uv4 = uvs[ y + 1 ][ x + 1 ].clone();

      this.faces.push( new THREE.Face3( v1, v2, v4, [ n1, n2, n4 ] ) );
      this.faceVertexUvs[ 0 ].push( [ uv1, uv2, uv4 ] );

      this.faces.push( new THREE.Face3( v2, v3, v4, [ n2.clone(), n3, n4.clone() ] ) );
      this.faceVertexUvs[ 0 ].push( [ uv2.clone(), uv3, uv4.clone() ] );

		}

	}

	this.computeFaceNormals();


};

/**
 * 1degree = pi / 180 is almost 0.017
 */
var createSuperFormulaShape = function (params) {
  var vertices = [];

  var a = params.a;
  var b = params.b;
  var m = params.m;
  var n1 = params.n1;
  var n2 = params.n2;
  var n3 = params.n3;

  // Create range for theta
  var theta = [];

  var n = 0.017 * (params.sampleSize || 1);
  for (var i = -Math.PI; i < Math.PI; i += n) {
    theta.push(i);
  }

  // Create range for phi
  var phi = [];

  for (var i = -Math.PI / 2; i < Math.PI / 2; i += n) {
    phi.push(i);
  }

  // Loop over and add vertices
  for (var i = 0; i < theta.length; i++) {
    for (var j = 0; j < phi.length; j++) {
      // So the used vars: i = theta, j = phi

      // R1 uses theta, ranges from -pi to pi
      var r1 = superFormula(theta[i], a, b, m, n1, n2, n3);

      // R2 uses phi, ranges from -pi / 2 to pi / 2
      var r2 = superFormula(phi[j], a, b, m, n1, n2, n3);

      var x = superFormula3DgetX(r1, r2, theta[i], phi[j]);
      var y = superFormula3DgetY(r1, r2, theta[i], phi[j]);
      var z = superFormula3DgetZ(r1, r2, theta[i], phi[j]);

      vertices.push(new THREE.Vector3(x, y, z));
    }
  }

  return vertices;
}

/**
 * Apply the superformula, can be found here: https://en.wikipedia.org/wiki/Superformula
 * It is written in polar coordinates and we are getting the x, y and z coordinates out of it
 * We also let the period go from -pi/2 to pi/2 for phi and -pi to pi for theta
 */
var superFormula = function(angle, a, b, m, n1, n2, n3) {
	var mp = (m * angle) / 4.0;

	var part1 = Math.cos(mp) * (1.0 / a);
	var part2 = Math.sin(mp) * (1.0 / b);

	part1 = Math.pow(Math.abs(part1), n2);
	part2 = Math.pow(Math.abs(part2), n3);

	var r = Math.abs(Math.pow(part1 + part2, 1.0 / n1));

  return 1.0 / r;
}

/**
 * Gets the x coordinate for the given r1 and r2
 */
var superFormula3DgetX = function (r1, r2, theta, phi) {
  return (r1 * Math.cos(theta)) * (r2 * Math.cos(phi));
}

/**
 * Gets the y coordinate for the given r1 and r2
 */
var superFormula3DgetY = function (r1, r2, theta, phi) {
  return (r1 * Math.sin(theta)) * (r2 * Math.cos(phi));
}

/**
 * Gets the z coordinate for the given r1 and r2
 */
var superFormula3DgetZ = function (r1, r2, theta, phi) {
  return (r2 * Math.sin(phi));
}

THREE.SuperFormulaGeometry.prototype = Object.create( THREE.Geometry.prototype );
THREE.SuperFormulaGeometry.prototype.constructor = THREE.SphereGeometry;
