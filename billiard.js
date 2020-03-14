//load ball textures
const texture8 = new THREE.TextureLoader().load('Ball8.jpg');
const texture9 = new THREE.TextureLoader().load('Ball9.jpg');
const texture10 = new THREE.TextureLoader().load('Ball10.jpg');
const texture11 = new THREE.TextureLoader().load('Ball11.jpg');
const texture12 = new THREE.TextureLoader().load('Ball12.jpg');
const texture13 = new THREE.TextureLoader().load('Ball13.jpg');
const texture14 = new THREE.TextureLoader().load('Ball14.jpg');
const texture15 = new THREE.TextureLoader().load('Ball15.jpg');

const variables = {
  length: 2.54,   //table surface length in m
  width: 1.27,     //table surface width
  height: 0.8,    //table height from the surface to the ground
  thickness: 0.2,
  groundWidth: 50,
  ballRadius: 0.4572, //ball radius (international size) 
  ceilingHeight: 20,
  lampRadius: 2,
};

const spotLightPos = {
  x: 0,
  y: 15,
  z: 0,
};

const friction = 0.2;
const boundary1 = (variables.width * 8 / 2 - variables.ballRadius); //boundary to check collision with the side cushion
const boundary2 = (variables.length * 8 / 2 - variables.ballRadius);//boundary to check collision with the front/end cushion

let obj = {}; //object to store ball data later on

let takenPosX = [];
let takenPosY = [];

// Initialize webGL
const canvas = document.getElementById("mycanvas");
const renderer = new THREE.WebGLRenderer({ canvas: canvas });
renderer.setClearColor('grey');    // set background color
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap; // default THREE.PCFShadowMap

// create scene and camera
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(90, canvas.width / canvas.height,
  0.1, 1000);
camera.position.z = 10;
camera.position.y = 10;
camera.position.x = 15;

const ambientLight = new THREE.AmbientLight(0x909090);
scene.add(ambientLight);

const spotLight = new THREE.SpotLight();
spotLight.castShadow = true;
scene.add(spotLight);
spotLight.position.set(spotLightPos.x, spotLightPos.y, spotLightPos.z);

spotLight.shadow.camera.right = 5;
spotLight.shadow.camera.left = -5;
spotLight.shadow.camera.top = 5;
spotLight.shadow.camera.bottom = -5;

const table = createTable();
createCeiling();

const ball8 = createBall(texture8);
const ball9 = createBall(texture9);
const ball10 = createBall(texture10);
const ball11 = createBall(texture11);
const ball12 = createBall(texture12);
const ball13 = createBall(texture13);
const ball14 = createBall(texture14);
const ball15 = createBall(texture15);

//place balls on random non-overlaping positions on the table
placeBallRandom(ball8, takenPosX, takenPosY);
placeBallRandom(ball9, takenPosX, takenPosY);
placeBallRandom(ball10, takenPosX, takenPosY);
placeBallRandom(ball11, takenPosX, takenPosY);
placeBallRandom(ball12, takenPosX, takenPosY);
placeBallRandom(ball13, takenPosX, takenPosY);
placeBallRandom(ball14, takenPosX, takenPosY);
placeBallRandom(ball15, takenPosX, takenPosY);

// give balls a random size speed vector
let ballSpeed8 = getSpeedVector(ball8);
let ballSpeed9 = getSpeedVector(ball9);
let ballSpeed10 = getSpeedVector(ball10);
let ballSpeed11 = getSpeedVector(ball11);
let ballSpeed12 = getSpeedVector(ball12);
let ballSpeed13 = getSpeedVector(ball13);
let ballSpeed14 = getSpeedVector(ball14);
let ballSpeed15 = getSpeedVector(ball15);

let ballPos8 = new THREE.Vector3(ball8.position.x, ball8.position.y, - variables.ballRadius);
let ballPos9 = new THREE.Vector3(ball9.position.x, ball9.position.y, - variables.ballRadius);
let ballPos10 = new THREE.Vector3(ball10.position.x, ball10.position.y, - variables.ballRadius);
let ballPos11 = new THREE.Vector3(ball11.position.x, ball11.position.y, - variables.ballRadius);
let ballPos12 = new THREE.Vector3(ball12.position.x, ball12.position.y, - variables.ballRadius);
let ballPos13 = new THREE.Vector3(ball13.position.x, ball13.position.y, - variables.ballRadius);
let ballPos14 = new THREE.Vector3(ball14.position.x, ball14.position.y, - variables.ballRadius);
let ballPos15 = new THREE.Vector3(ball15.position.x, ball15.position.y, - variables.ballRadius);

// axis and angular velocity of rotational motion
let ax8 = new THREE.Vector3(0, 0, -1).cross(ballSpeed8).normalize();
let ax9 = new THREE.Vector3(0, 0, -1).cross(ballSpeed9).normalize();
let ax10 = new THREE.Vector3(0, 0, -1).cross(ballSpeed10).normalize();
let ax11 = new THREE.Vector3(0, 0, -1).cross(ballSpeed11).normalize();
let ax12 = new THREE.Vector3(0, 0, -1).cross(ballSpeed12).normalize();
let ax13 = new THREE.Vector3(0, 0, -1).cross(ballSpeed13).normalize();
let ax14 = new THREE.Vector3(0, 0, -1).cross(ballSpeed14).normalize();
let ax15 = new THREE.Vector3(0, 0, -1).cross(ballSpeed15).normalize();

let omega8 = ballSpeed8.length() / variables.ballRadius;
let omega9 = ballSpeed9.length() / variables.ballRadius;
let omega10 = ballSpeed10.length() / variables.ballRadius;
let omega11 = ballSpeed11.length() / variables.ballRadius;
let omega12 = ballSpeed12.length() / variables.ballRadius;
let omega13 = ballSpeed13.length() / variables.ballRadius;
let omega14 = ballSpeed14.length() / variables.ballRadius;
let omega15 = ballSpeed15.length() / variables.ballRadius;

const clock = new THREE.Clock();
//* Render loop
const controls = new THREE.TrackballControls(camera, canvas);

render();

function render() {
  requestAnimationFrame(render);

  const dt = clock.getDelta();

  //decrease speed by 20% every second
  ballSpeed8 = ballSpeed8.clone().sub(ballSpeed8.multiplyScalar(dt * friction));
  ballSpeed9 = ballSpeed9.clone().sub(ballSpeed9.multiplyScalar(dt * friction));
  ballSpeed10 = ballSpeed10.clone().sub(ballSpeed10.multiplyScalar(dt * friction));
  ballSpeed11 = ballSpeed11.clone().sub(ballSpeed11.multiplyScalar(dt * friction));
  ballSpeed12 = ballSpeed12.clone().sub(ballSpeed12.multiplyScalar(dt * friction));
  ballSpeed13 = ballSpeed13.clone().sub(ballSpeed13.multiplyScalar(dt * friction));
  ballSpeed14 = ballSpeed14.clone().sub(ballSpeed14.multiplyScalar(dt * friction));
  ballSpeed15 = ballSpeed15.clone().sub(ballSpeed15.multiplyScalar(dt * friction));

  //make balls move
  ballPos8.add(ballSpeed8.clone().multiplyScalar(dt));
  ballPos9.add(ballSpeed9.clone().multiplyScalar(dt));
  ballPos10.add(ballSpeed10.clone().multiplyScalar(dt));
  ballPos11.add(ballSpeed11.clone().multiplyScalar(dt));
  ballPos12.add(ballSpeed12.clone().multiplyScalar(dt));
  ballPos13.add(ballSpeed13.clone().multiplyScalar(dt));
  ballPos14.add(ballSpeed14.clone().multiplyScalar(dt));
  ballPos15.add(ballSpeed15.clone().multiplyScalar(dt));

  ball8.position.copy(ballPos8);
  ball9.position.copy(ballPos9);
  ball10.position.copy(ballPos10);
  ball11.position.copy(ballPos11);
  ball12.position.copy(ballPos12);
  ball13.position.copy(ballPos13);
  ball14.position.copy(ballPos14);
  ball15.position.copy(ballPos15);

  omega8 = omega8 - omega8 * dt * friction;
  omega9 = omega9 - omega9 * dt * friction;
  omega10 = omega10 - omega10 * dt * friction;
  omega11 = omega11 - omega11 * dt * friction;
  omega12 = omega12 - omega12 * dt * friction;
  omega13 = omega13 - omega13 * dt * friction;
  omega14 = omega14 - omega14 * dt * friction;
  omega15 = omega15 - omega15 * dt * friction;

  // dR: incremental rotation matrix that performs the rotation of the current time step.
  const dR8 = new THREE.Matrix4();
  const dR9 = new THREE.Matrix4();
  const dR10 = new THREE.Matrix4();
  const dR11 = new THREE.Matrix4();
  const dR12 = new THREE.Matrix4();
  const dR13 = new THREE.Matrix4();
  const dR14 = new THREE.Matrix4();
  const dR15 = new THREE.Matrix4();

  dR8.makeRotationAxis(ax8, omega8 * dt);
  dR9.makeRotationAxis(ax9, omega9 * dt);
  dR10.makeRotationAxis(ax10, omega10 * dt);
  dR11.makeRotationAxis(ax11, omega11 * dt);
  dR12.makeRotationAxis(ax12, omega12 * dt);
  dR13.makeRotationAxis(ax13, omega13 * dt);
  dR14.makeRotationAxis(ax14, omega14 * dt);
  dR15.makeRotationAxis(ax15, omega15 * dt);

  // multiply with dR form the left (matrix.multiply multiplies from the right!)
  ball8.matrix.premultiply(dR8);
  ball9.matrix.premultiply(dR9);
  ball10.matrix.premultiply(dR10);
  ball11.matrix.premultiply(dR11);
  ball12.matrix.premultiply(dR12);
  ball13.matrix.premultiply(dR13);
  ball14.matrix.premultiply(dR14);
  ball15.matrix.premultiply(dR15);

  // set translational part of matrix to current position:
  ball8.matrix.setPosition(ballPos8);
  ball9.matrix.setPosition(ballPos9);
  ball10.matrix.setPosition(ballPos10);
  ball11.matrix.setPosition(ballPos11);
  ball12.matrix.setPosition(ballPos12);
  ball13.matrix.setPosition(ballPos13);
  ball14.matrix.setPosition(ballPos14);
  ball15.matrix.setPosition(ballPos15);

  // Implement reflection from the cushions
  obj = checkCushions9(ballPos8, ballSpeed8, ax8, omega8);
  ballPos8 = obj.ballPos9;
  ballSpeed8 = obj.ballSpeed9;
  ax8 = obj.ax9;
  omega8 = obj.omega9;

  obj = checkCushions9(ballPos9, ballSpeed9, ax9, omega9);
  ballPos9 = obj.ballPos9;
  ballSpeed9 = obj.ballSpeed9;
  ax9 = obj.ax9;
  omega9 = obj.omega9;

  obj = checkCushions9(ballPos10, ballSpeed10, ax10, omega10);
  ballPos10 = obj.ballPos9;
  ballSpeed10 = obj.ballSpeed9;
  ax10 = obj.ax9;
  omega10 = obj.omega9;

  obj = checkCushions9(ballPos11, ballSpeed11, ax11, omega11);
  ballPos11 = obj.ballPos9;
  ballSpeed11 = obj.ballSpeed9;
  ax11 = obj.ax9;
  omega11 = obj.omega9;

  obj = checkCushions9(ballPos12, ballSpeed12, ax12, omega12);
  ballPos12 = obj.ballPos9;
  ballSpeed12 = obj.ballSpeed9;
  ax12 = obj.ax9;
  omega12 = obj.omega9;

  obj = checkCushions9(ballPos13, ballSpeed13, ax13, omega13);
  ballPos13 = obj.ballPos9;
  ballSpeed13 = obj.ballSpeed9;
  ax13 = obj.ax9;
  omega13 = obj.omega9;

  obj = checkCushions9(ballPos14, ballSpeed14, ax14, omega14);
  ballPos14 = obj.ballPos9;
  ballSpeed14 = obj.ballSpeed9;
  ax14 = obj.ax9;
  omega14 = obj.omega9;

  obj = checkCushions9(ballPos15, ballSpeed15, ax15, omega15);
  ballPos15 = obj.ballPos9;
  ballSpeed15 = obj.ballSpeed9;
  ax15 = obj.ax9;
  omega15 = obj.omega9;

  //implement ball colision with ball 8
  obj = checkCollision8(ball11, ballSpeed11, ax11, omega11);
  ballSpeed11 = obj.ballSpeed;
  ax11 = obj.ax;
  omega11 = obj.omega;
  obj = checkCollision8(ball12, ballSpeed12, ax12, omega12);
  ballSpeed12 = obj.ballSpeed;
  ax12 = obj.ax;
  omega12 = obj.omega;
  obj = checkCollision8(ball13, ballSpeed13, ax13, omega13);
  ballSpeed13 = obj.ballSpeed;
  ax13 = obj.ax;
  omega13 = obj.omega;
  obj = checkCollision8(ball14, ballSpeed14, ax14, omega14);
  ballSpeed14 = obj.ballSpeed;
  ax14 = obj.ax;
  omega14 = obj.omega;
  obj = checkCollision8(ball15, ballSpeed15, ax15, omega15);
  ballSpeed15 = obj.ballSpeed;
  ax15 = obj.ax;
  omega15 = obj.omega;

  //implement ball colision with ball 9
  obj = checkCollision9(ball8, ballSpeed8, ax8, omega8);
  ballSpeed8 = obj.ballSpeed;
  ax8 = obj.ax;
  omega8 = obj.omega;
  obj = checkCollision9(ball10, ballSpeed10, ax10, omega10);
  ballSpeed10 = obj.ballSpeed;
  ax10 = obj.ax;
  omega10 = obj.omega;
  obj = checkCollision9(ball11, ballSpeed11, ax11, omega11);
  ballSpeed11 = obj.ballSpeed;
  ax11 = obj.ax;
  omega11 = obj.omega;
  obj = checkCollision9(ball12, ballSpeed12, ax12, omega12);
  ballSpeed12 = obj.ballSpeed;
  ax12 = obj.ax;
  omega12 = obj.omega;
  obj = checkCollision9(ball13, ballSpeed13, ax13, omega13);
  ballSpeed13 = obj.ballSpeed;
  ax13 = obj.ax;
  omega13 = obj.omega;
  obj = checkCollision9(ball14, ballSpeed14, ax14, omega14);
  ballSpeed14 = obj.ballSpeed;
  ax14 = obj.ax;
  omega14 = obj.omega;
  obj = checkCollision9(ball15, ballSpeed15, ax15, omega15);
  ballSpeed15 = obj.ballSpeed;
  ax15 = obj.ax;
  omega15 = obj.omega;

  //implement ball colision with ball 10
  obj = checkCollision10(ball8, ballSpeed8, ax8, omega8);
  ballSpeed8 = obj.ballSpeed;
  ax8 = obj.ax;
  omega8 = obj.omega;
  obj = checkCollision10(ball11, ballSpeed11, ax11, omega11);
  ballSpeed11 = obj.ballSpeed;
  ax11 = obj.ax;
  omega11 = obj.omega;
  obj = checkCollision10(ball12, ballSpeed12, ax12, omega12);
  ballSpeed12 = obj.ballSpeed;
  ax12 = obj.ax;
  omega12 = obj.omega;
  obj = checkCollision10(ball13, ballSpeed13, ax13, omega13);
  ballSpeed13 = obj.ballSpeed;
  ax13 = obj.ax;
  omega13 = obj.omega;
  obj = checkCollision10(ball14, ballSpeed14, ax14, omega14);
  ballSpeed14 = obj.ballSpeed;
  ax14 = obj.ax;
  omega14 = obj.omega;
  obj = checkCollision10(ball15, ballSpeed15, ax15, omega15);
  ballSpeed15 = obj.ballSpeed;
  ax15 = obj.ax;
  omega15 = obj.omega;

  //implement ball colision with ball 11
  obj = checkCollision11(ball12, ballSpeed12, ax12, omega12);
  ballSpeed12 = obj.ballSpeed;
  ax12 = obj.ax;
  omega12 = obj.omega;
  obj = checkCollision11(ball13, ballSpeed13, ax13, omega13);
  ballSpeed13 = obj.ballSpeed;
  ax13 = obj.ax;
  omega13 = obj.omega;
  obj = checkCollision11(ball14, ballSpeed14, ax14, omega14);
  ballSpeed14 = obj.ballSpeed;
  ax14 = obj.ax;
  omega14 = obj.omega;
  obj = checkCollision11(ball15, ballSpeed15, ax15, omega15);
  ballSpeed15 = obj.ballSpeed;
  ax15 = obj.ax;
  omega15 = obj.omega;

  //implement ball colision with ball 12
  obj = checkCollision12(ball13, ballSpeed13, ax13, omega13);
  ballSpeed13 = obj.ballSpeed;
  ax13 = obj.ax;
  omega13 = obj.omega;
  obj = checkCollision12(ball14, ballSpeed14, ax14, omega14);
  ballSpeed14 = obj.ballSpeed;
  ax14 = obj.ax;
  omega14 = obj.omega;
  obj = checkCollision12(ball15, ballSpeed15, ax15, omega15);
  ballSpeed15 = obj.ballSpeed;
  ax15 = obj.ax;
  omega15 = obj.omega;

  //implement ball colision with ball 13
  obj = checkCollision13(ball14, ballSpeed14, ax14, omega14);
  ballSpeed14 = obj.ballSpeed;
  ax14 = obj.ax;
  omega14 = obj.omega;
  obj = checkCollision13(ball15, ballSpeed15, ax15, omega15);
  ballSpeed15 = obj.ballSpeed;
  ax15 = obj.ax;
  omega15 = obj.omega;

  //implement ball colision with ball 14
  obj = checkCollision14(ball15, ballSpeed15, ax15, omega15);
  ballSpeed15 = obj.ballSpeed;
  ax15 = obj.ax;
  omega15 = obj.omega;

  controls.update();
  renderer.render(scene, camera);
};

function createBall(texture) {

  //create the balls
  const ballGeo = new THREE.SphereGeometry(variables.ballRadius, 32, 32);
  const ballMat = new THREE.MeshBasicMaterial({ map: texture });
  const ball = new THREE.Mesh(ballGeo, ballMat);
  table.add(ball);

  ball.matrixAutoUpdate = false;
  ball.castShadow = true;
  return ball;
};

function placeBallRandom(ball, takenPosX, takenPosY) {
  let obj;
  let posX, posY;
  posX = getRandomX();
  posY = getRandomY();

  if (takenPosX.length > 0) {

    obj = checkBallsOverlap(takenPosX.length, posX, posY, takenPosX, takenPosY);

    ball.position.x = obj.posX;
    ball.position.y = obj.posY;

    takenPosX.push(obj.posX);
    takenPosY.push(obj.posY);
  } else {
    takenPosX.push(posX);
    takenPosY.push(posY);

    ball.position.x = posX;
    ball.position.y = posY;
  }
};

function getRandomX() {
  //get random x position
  let check = 0;
  let posX = Math.random() * 10;

  //make sure the number does not exceed the width of the plane
  while (posX > (variables.width * 8 / 2 - variables.ballRadius)) {
    posX = Math.random() * 10;
    check++;
  }

  //make the number positive or negative randomly
  if (check % 2 == 0) {
    posX = - posX;
  }
  return posX;
};
function getRandomY() {
  //get random y position
  let check = 0;
  let posY = Math.random() * 10;

  //make sure the number does not exceed the length of the plane
  while (posY > (variables.length * 8 / 2 - variables.ballRadius)) {
    posY = Math.random() * 10;
    check++;
  }

  //make the number positive or negative randomly
  if (check % 2 == 0) {
    posY = - posY;
  }
  return posY;
};

function checkBallsOverlap(size, posX, posY, takenPosX, takenPosY) {
  let obj2;
  let obj = {
    posX,
    posY
  };

  //check if ball positions are not overlaping
  for (let i = 0; i < size; i++) {
    if (Math.abs(takenPosX[i] - posX) < variables.ballRadius * 2) {
      if (Math.abs(takenPosY[i] - posY) < variables.ballRadius * 2) {
        //if positions overlap, get new x and y values and check again
        obj2 = checkBallsOverlap(size, getRandomX(), getRandomY(), takenPosX, takenPosY);
        obj.posX = obj2.posX;
        obj.posY = obj2.posY;
        break;
      }
    }
  }
  return obj;
};

function getSpeedVector(ball) {

  let x = Math.random() < 0.5 ? (Math.random() * 20) : (- Math.random() * 20);
  while (Math.abs(x) > variables.width * 8 / 2 - variables.ballRadius - Math.abs(ball.position.x)) {
    x = Math.random() < 0.5 ? Math.random() * 20 : - Math.random() * 20;
  };
  let y = Math.random() < 0.5 ? Math.random() * 20 : - Math.random() * 20;
  while (Math.abs(y) > variables.length * 8 / 2 - variables.ballRadius - Math.abs(ball.position.y)) {
    y = Math.random() < 0.5 ? Math.random() * 20 : - Math.random() * 20;
  };

  return new THREE.Vector3(x, y, 0);
};

function createTable() {

  const table = new THREE.Mesh();
  scene.add(table);
  table.rotation.x = Math.PI / 2;

  const material = new THREE.MeshStandardMaterial({ color: "green", side: THREE.DoubleSide });

  const geometry5 = new THREE.PlaneGeometry(variables.width * 8, variables.length * 8, variables.thickness * 8);
  const material5 = new THREE.MeshStandardMaterial({ color: "green", side: THREE.DoubleSide });
  const tableSurfaceTop = new THREE.Mesh(geometry5, material5);
  scene.add(tableSurfaceTop);
  tableSurfaceTop.rotation.x = Math.PI / 2;

  const tableSurfaceBottom = new THREE.Mesh(geometry5, material);
  scene.add(tableSurfaceBottom);
  tableSurfaceBottom.rotation.x = Math.PI / 2;
  tableSurfaceBottom.position.y = -0.15;

  const geometry1 = new THREE.BoxGeometry(variables.thickness * 4, variables.length * 8, variables.thickness * 4);
  const cushionLeft = new THREE.Mesh(geometry1, material);
  table.add(cushionLeft);
  cushionLeft.position.x = - (variables.width * 8 / 2 + variables.thickness * 4 / 2);
  cushionLeft.position.z = -(variables.thickness * 4 / 2 - variables.thickness / 2);

  const cushionRight = new THREE.Mesh(geometry1, material);
  table.add(cushionRight);
  cushionRight.position.x = (variables.width * 8 / 2 + variables.thickness * 4 / 2);
  cushionRight.position.z = -(variables.thickness * 4 / 2 - variables.thickness / 2);

  const geometry2 = new THREE.BoxGeometry(variables.width * 8 + variables.thickness * 4 * 2, variables.thickness * 4, variables.thickness * 4);
  const cushionFront = new THREE.Mesh(geometry2, material);
  table.add(cushionFront);
  cushionFront.position.y = (variables.length * 8 / 2 + variables.thickness * 4 / 2);
  cushionFront.position.z = - (variables.thickness * 4 / 2 - variables.thickness / 2);

  const cushionBack = new THREE.Mesh(geometry2, material);
  table.add(cushionBack);
  cushionBack.position.y = -(variables.length * 8 / 2 + variables.thickness * 4 / 2);
  cushionBack.position.z = - (variables.thickness * 4 / 2 - variables.thickness / 2);

  //create legs
  const geometry3 = new THREE.BoxGeometry(variables.thickness * 4, variables.thickness * 4, variables.height * 8 - variables.thickness);
  const material3 = new THREE.MeshStandardMaterial({ color: 0xffead9 });
  const legFrontRight = new THREE.Mesh(geometry3, material3);
  table.add(legFrontRight);
  legFrontRight.position.z = (variables.height * 8 / 2);
  legFrontRight.position.y = (variables.length * 8 / 2 - variables.thickness * 4 / 2);
  legFrontRight.position.x = (variables.width * 8 / 2 - variables.thickness * 4 / 2);

  const legFrontLeft = new THREE.Mesh(geometry3, material3);
  table.add(legFrontLeft);
  legFrontLeft.position.z = (variables.height * 8 / 2);
  legFrontLeft.position.y = (variables.length * 8 / 2 - variables.thickness * 4 / 2);
  legFrontLeft.position.x = -(variables.width * 8 / 2 - variables.thickness * 4 / 2);

  const legBackLeft = new THREE.Mesh(geometry3, material3);
  table.add(legBackLeft);
  legBackLeft.position.z = (variables.height * 8 / 2);
  legBackLeft.position.y = -(variables.length * 8 / 2 - variables.thickness * 4 / 2);
  legBackLeft.position.x = -(variables.width * 8 / 2 - variables.thickness * 4 / 2);

  const legBackRight = new THREE.Mesh(geometry3, material3);
  table.add(legBackRight);
  legBackRight.position.z = (variables.height * 8 / 2);
  legBackRight.position.y = -(variables.length * 8 / 2 - variables.thickness * 4 / 2);
  legBackRight.position.x = (variables.width * 8 / 2 - variables.thickness * 4 / 2);

  //create the ground
  const geometry4 = new THREE.PlaneGeometry(variables.groundWidth, variables.groundWidth, variables.groundWidth / variables.groundWidth);
  const material4 = new THREE.MeshStandardMaterial({ color: 0x7d857f, side: THREE.DoubleSide });
  const ground = new THREE.Mesh(geometry4, material4);
  scene.add(ground);
  ground.rotation.x = Math.PI / 2;
  ground.position.y = - variables.height * 8;

  ground.receiveShadow = true;
  tableSurfaceTop.receiveShadow = true;
  tableSurfaceTop.castShadow = false;
  tableSurfaceBottom.castShadow = true;
  tableSurfaceBottom.receiveShadow = false;
  legFrontRight.castShadow = true;
  legFrontLeft.castShadow = true;
  legBackRight.castShadow = true;
  legBackLeft.castShadow = true;

  return table;
}
function createCeiling() {
  //create the ceiling
  const geometry = new THREE.PlaneGeometry(variables.groundWidth, variables.groundWidth, variables.groundWidth / variables.groundWidth);
  const material = new THREE.MeshStandardMaterial({ color: "magenta", side: THREE.DoubleSide });
  const ceiling = new THREE.Mesh(geometry, material);
  scene.add(ceiling);
  ceiling.rotation.x = Math.PI / 2;
  ceiling.position.y = variables.ceilingHeight;

  //create the lamp
  const lampGeo = new THREE.SphereGeometry(variables.lampRadius, 32, 32);
  const lampMat = new THREE.MeshBasicMaterial({ color: 0xfffd91, wireframe: false });
  const lamp = new THREE.Mesh(lampGeo, lampMat);
  scene.add(lamp);
  lamp.position.x = spotLightPos.x;
  lamp.position.y = spotLightPos.y;
  lamp.position.z = spotLightPos.z;

  //create the cord
  const cordGeo = new THREE.BoxGeometry(variables.thickness, variables.ceilingHeight - 15, variables.thickness);
  const cordMat = new THREE.MeshStandardMaterial({ color: "white", side: THREE.DoubleSide });
  const cord = new THREE.Mesh(cordGeo, cordMat);
  scene.add(cord);
  cord.position.x = spotLightPos.x;
  cord.position.y = spotLightPos.y + (variables.ceilingHeight - 15) / 2;
  cord.position.z = -spotLightPos.z;

  //create the holder
  const holderGeo = new THREE.BoxGeometry(variables.thickness * 4, variables.thickness * 4, variables.thickness * 4);
  const holderdMat = new THREE.MeshStandardMaterial({ color: "white", side: THREE.DoubleSide });
  const holder = new THREE.Mesh(holderGeo, holderdMat);
  scene.add(holder);
  holder.position.x = spotLightPos.x;
  holder.position.y = variables.ceilingHeight;
  holder.position.z = spotLightPos.z;
};

function checkCushions9(ballPos9, ballSpeed9, ax9, omega9) {

  let obj = {
    ballPos9, ballSpeed9, ax9, omega9
  };

  if (obj.ballPos9.x > boundary1) {
    obj.ballSpeed9.x = - Math.abs(obj.ballSpeed9.x);
    obj.ballSpeed9 = ballSpeed9.multiplyScalar(0.8);
    obj.ax9 = new THREE.Vector3(0, 0, -1).cross(obj.ballSpeed9).normalize();
    obj.omega9 = obj.ballSpeed9.length() / variables.ballRadius * 0.8;
  }
  if (obj.ballPos9.x < - boundary1) {
    obj.ballSpeed9.x = Math.abs(obj.ballSpeed9.x);
    obj.ballSpeed9 = obj.ballSpeed9.multiplyScalar(0.8);
    obj.ax9 = new THREE.Vector3(0, 0, -1).cross(obj.ballSpeed9).normalize();
    obj.omega9 = obj.ballSpeed9.length() / variables.ballRadius * 0.8;
  }

  if (obj.ballPos9.y > boundary2) {
    obj.ballSpeed9.y = - Math.abs(obj.ballSpeed9.y);
    obj.ballSpeed9 = obj.ballSpeed9.multiplyScalar(0.8);
    obj.ax9 = new THREE.Vector3(0, 0, -1).cross(obj.ballSpeed9).normalize();
    obj.omega9 = obj.ballSpeed9.length() / variables.ballRadius * 0.8;
  }
  if (obj.ballPos9.y < - boundary2) {
    obj.ballSpeed9.y = Math.abs(obj.ballSpeed9.y);
    obj.ballSpeed9 = obj.ballSpeed9.multiplyScalar(0.8);
    obj.ax9 = new THREE.Vector3(0, 0, -1).cross(obj.ballSpeed9).normalize();
    obj.omega9 = obj.ballSpeed9.length() / variables.ballRadius * 0.8;
  }
  return obj;
}

function checkCollision8(ball, ballSpeed, ax, omega) {

  const obj = {
    ax,
    omega,
    ballSpeed
  };

  let dist = ball.position.clone();
  dist.sub(ball8.position);
  let distSq = dist.lengthSq();

  if (distSq < 2 * variables.ballRadius) {
    const diffU = obj.ballSpeed.clone().sub(ballSpeed8);
    const factor = dist.dot(diffU) / distSq;

    obj.ballSpeed = obj.ballSpeed.multiplyScalar(0.7);
    ballSpeed8 = ballSpeed8.multiplyScalar(0.7);

    let v1 = obj.ballSpeed.clone().sub(dist.clone().multiplyScalar(factor));
    let v2 = ballSpeed8.clone().add(dist.clone().multiplyScalar(factor));

    ballSpeed8 = v2;
    obj.ballSpeed = v1;

    obj.ax = new THREE.Vector3(0, 0, -1).cross(v1).normalize();
    obj.omega = v1.length() / variables.ballRadius;
    ax8 = new THREE.Vector3(0, 0, -1).cross(v2).normalize();
    omega8 = v2.length() / variables.ballRadius;

  }
  return obj;
}
function checkCollision9(ball, ballSpeed, ax, omega) {

  const obj = {
    ax,
    omega,
    ballSpeed
  };

  let dist = ball.position.clone();
  dist.sub(ball9.position);
  let distSq = dist.lengthSq();

  if (distSq < 2 * variables.ballRadius) {
    const diffU = obj.ballSpeed.clone().sub(ballSpeed9);
    const factor = dist.dot(diffU) / distSq;

    obj.ballSpeed = obj.ballSpeed.multiplyScalar(0.7);
    ballSpeed19 = ballSpeed9.multiplyScalar(0.7);

    let v1 = obj.ballSpeed.clone().sub(dist.clone().multiplyScalar(factor));
    let v2 = ballSpeed9.clone().add(dist.clone().multiplyScalar(factor));

    ballSpeed9 = v2;
    obj.ballSpeed = v1;

    obj.ax = new THREE.Vector3(0, 0, -1).cross(v1).normalize();
    obj.omega = v1.length() / variables.ballRadius;
    ax9 = new THREE.Vector3(0, 0, -1).cross(v2).normalize();
    omega9 = v2.length() / variables.ballRadius;

  }
  return obj;
}
function checkCollision10(ball, ballSpeed, ax, omega) {

  const obj = {
    ax,
    omega,
    ballSpeed
  };

  let dist = ball.position.clone();
  dist.sub(ball10.position);
  let distSq = dist.lengthSq();

  if (distSq < 2 * variables.ballRadius) {
    const diffU = obj.ballSpeed.clone().sub(ballSpeed10);
    const factor = dist.dot(diffU) / distSq;

    obj.ballSpeed = obj.ballSpeed.multiplyScalar(0.7);
    ballSpeed10 = ballSpeed10.multiplyScalar(0.7);

    let v1 = obj.ballSpeed.clone().sub(dist.clone().multiplyScalar(factor));
    let v2 = ballSpeed10.clone().add(dist.clone().multiplyScalar(factor));

    ballSpeed10 = v2;
    obj.ballSpeed = v1;

    obj.ax = new THREE.Vector3(0, 0, -1).cross(v1).normalize();
    obj.omega = v1.length() / variables.ballRadius;
    ax10 = new THREE.Vector3(0, 0, -1).cross(v2).normalize();
    omega10 = v2.length() / variables.ballRadius;
  }
  return obj;
}
function checkCollision11(ball, ballSpeed, ax, omega) {

  const obj = {
    ax,
    omega,
    ballSpeed
  };

  let dist = ball.position.clone();
  dist.sub(ball11.position);
  let distSq = dist.lengthSq();

  if (distSq < 2 * variables.ballRadius) {
    const diffU = obj.ballSpeed.clone().sub(ballSpeed11);
    const factor = dist.dot(diffU) / distSq;

    obj.ballSpeed = obj.ballSpeed.multiplyScalar(0.7);
    ballSpeed11 = ballSpeed11.multiplyScalar(0.7);

    let v1 = obj.ballSpeed.clone().sub(dist.clone().multiplyScalar(factor));
    let v2 = ballSpeed11.clone().add(dist.clone().multiplyScalar(factor));

    ballSpeed11 = v2;
    obj.ballSpeed = v1;

    obj.ax = new THREE.Vector3(0, 0, -1).cross(v1).normalize();
    obj.omega = v1.length() / variables.ballRadius;
    ax11 = new THREE.Vector3(0, 0, -1).cross(v2).normalize();
    omega11 = v2.length() / variables.ballRadius;
  }
  return obj;
}
function checkCollision12(ball, ballSpeed, ax, omega) {

  const obj = {
    ax,
    omega,
    ballSpeed
  };

  let dist = ball.position.clone();
  dist.sub(ball12.position);
  let distSq = dist.lengthSq();

  if (distSq < 2 * variables.ballRadius) {
    const diffU = obj.ballSpeed.clone().sub(ballSpeed12);
    const factor = dist.dot(diffU) / distSq;

    obj.ballSpeed = obj.ballSpeed.multiplyScalar(0.7);
    ballSpeed12 = ballSpeed12.multiplyScalar(0.7);

    let v1 = obj.ballSpeed.clone().sub(dist.clone().multiplyScalar(factor));
    let v2 = ballSpeed12.clone().add(dist.clone().multiplyScalar(factor));

    ballSpeed12 = v2;
    obj.ballSpeed = v1;

    obj.ax = new THREE.Vector3(0, 0, -1).cross(v1).normalize();
    obj.omega = v1.length() / variables.ballRadius;
    ax12 = new THREE.Vector3(0, 0, -1).cross(v2).normalize();
    omega12 = v2.length() / variables.ballRadius;
  }
  return obj;
}
function checkCollision13(ball, ballSpeed, ax, omega) {

  const obj = {
    ax,
    omega,
    ballSpeed
  };

  let dist = ball.position.clone();
  dist.sub(ball13.position);
  let distSq = dist.lengthSq();

  if (distSq < 2 * variables.ballRadius) {
    const diffU = obj.ballSpeed.clone().sub(ballSpeed13);
    const factor = dist.dot(diffU) / distSq;

    obj.ballSpeed = obj.ballSpeed.multiplyScalar(0.7);
    ballSpeed13 = ballSpeed13.multiplyScalar(0.7);

    let v1 = obj.ballSpeed.clone().sub(dist.clone().multiplyScalar(factor));
    let v2 = ballSpeed13.clone().add(dist.clone().multiplyScalar(factor));

    ballSpeed13 = v2;
    obj.ballSpeed = v1;

    obj.ax = new THREE.Vector3(0, 0, -1).cross(v1).normalize();
    obj.omega = v1.length() / variables.ballRadius;
    ax13 = new THREE.Vector3(0, 0, -1).cross(v2).normalize();
    omega13 = v2.length() / variables.ballRadius;
  }
  return obj;
}

function checkCollision14(ball, ballSpeed, ax, omega) {

  const obj = {
    ax,
    omega,
    ballSpeed
  };

  let dist = ball.position.clone();
  dist.sub(ball14.position);
  let distSq = dist.lengthSq();

  if (distSq < 2 * variables.ballRadius) {
    const diffU = obj.ballSpeed.clone().sub(ballSpeed14);
    const factor = dist.dot(diffU) / distSq;

    obj.ballSpeed = obj.ballSpeed.multiplyScalar(0.7);
    ballSpeed14 = ballSpeed14.multiplyScalar(0.7);

    let v1 = obj.ballSpeed.clone().sub(dist.clone().multiplyScalar(factor));
    let v2 = ballSpeed14.clone().add(dist.clone().multiplyScalar(factor));

    ballSpeed14 = v2;
    obj.ballSpeed = v1;

    obj.ax = new THREE.Vector3(0, 0, -1).cross(v1).normalize();
    obj.omega = v1.length() / variables.ballRadius;
    ax14 = new THREE.Vector3(0, 0, -1).cross(v2).normalize();
    omega14 = v2.length() / variables.ballRadius;
  }
  return obj;
}
