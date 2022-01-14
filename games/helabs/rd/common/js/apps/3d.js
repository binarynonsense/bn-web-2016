class threeDCube {
  constructor(containerElement, width, height) {
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);

    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize(width, height);
    containerElement.appendChild(this.renderer.domElement);

    this.geometry = new THREE.BoxGeometry(1, 1, 1);
    this.material = new THREE.MeshBasicMaterial({
      color: 0x00ff00,
      wireframe: true,
    });
    this.cube = new THREE.Mesh(this.geometry, this.material);
    this.scene.add(this.cube);

    this.camera.position.z = 1.5;

    this.animate();
  }

  animate() {
    let _self = this;
    requestAnimationFrame(function () {
      _self.animate();
    });

    this.cube.rotation.x += 0.01;
    this.cube.rotation.y += 0.01;

    this.renderer.render(this.scene, this.camera);
  }
}
