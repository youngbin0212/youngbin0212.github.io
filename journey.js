// Undergrad concept: a plane sits in the middle. On hover, the camera itself
// pushes forward through it into the depth beyond — as if the viewer is the
// one stepping into the virtual.
(function () {
  if (typeof THREE === 'undefined') return;
  var canvas = document.getElementById('journeyCanvas');
  if (!canvas) return;
  var container = canvas.parentElement;

  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var scene = new THREE.Scene();
  var camera = new THREE.PerspectiveCamera(50, 1, 0.05, 30);
  camera.position.set(0, 0, 4.5);

  var renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true });
  } catch (e) {
    return;
  }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

  function resize() {
    var w = container.clientWidth || 1;
    var h = container.clientHeight || 1;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  resize();
  window.addEventListener('resize', resize);

  scene.add(new THREE.AmbientLight(0xffffff, 0.6));
  var key = new THREE.DirectionalLight(0xffffff, 0.9);
  key.position.set(2, 3, 4);
  scene.add(key);

  // The threshold: a frame the camera will pass through.
  var frameSize = 2.6;
  var frame = new THREE.LineSegments(
    new THREE.EdgesGeometry(new THREE.PlaneGeometry(frameSize, frameSize)),
    new THREE.LineBasicMaterial({ color: 0x7c8199 })
  );
  frame.position.z = 0;
  scene.add(frame);
  var frameFill = new THREE.Mesh(
    new THREE.PlaneGeometry(frameSize, frameSize),
    new THREE.MeshBasicMaterial({ color: 0x1c2438, transparent: true, opacity: 0.35, side: THREE.DoubleSide })
  );
  frameFill.position.z = 0;
  scene.add(frameFill);

  // The space beyond: a receding grid of smaller frames, so passing through
  // the first one reveals depth rather than emptiness.
  var beyond = new THREE.Group();
  scene.add(beyond);
  for (var i = 1; i <= 4; i++) {
    var s = frameSize * (1 - i * 0.16);
    var f = new THREE.LineSegments(
      new THREE.EdgesGeometry(new THREE.PlaneGeometry(s, s)),
      new THREE.LineBasicMaterial({ color: 0x3f6fd6, transparent: true, opacity: 0.35 - i * 0.06 })
    );
    f.position.z = -i * 1.5;
    beyond.add(f);
  }

  var hovered = false;
  container.addEventListener('mouseenter', function () { hovered = true; });
  container.addEventListener('mouseleave', function () { hovered = false; });

  var mouseX = 0, mouseY = 0;
  container.addEventListener('mousemove', function (e) {
    var rect = container.getBoundingClientRect();
    mouseX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    mouseY = -((e.clientY - rect.top) / rect.height) * 2 + 1;
  });

  var clock = new THREE.Clock();
  var camZ = camera.position.z;
  function animate() {
    requestAnimationFrame(animate);
    var dt = clock.getDelta();

    var targetZ = hovered ? -5.5 : 4.5;
    camZ += (targetZ - camZ) * 0.035;
    camera.position.x += (mouseX * 0.5 - camera.position.x) * 0.05;
    camera.position.y += (mouseY * 0.32 - camera.position.y) * 0.05;
    camera.position.z = camZ;
    camera.lookAt(0, 0, camZ - 6);

    if (!reduceMotion) {
      beyond.rotation.z += dt * 0.03;
    }

    renderer.render(scene, camera);
  }
  animate();
})();
