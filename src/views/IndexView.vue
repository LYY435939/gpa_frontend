<template>
  <div style="align-content: center;">
    <img src="@/assets/img/logo.png" alt="item" height="200" style=";display:block;padding-top: 10vh">
  </div>

  <div class="login-container">
    <div class="login-form">
      <login-form/>
    </div>
  </div>
  <a href="https://beian.miit.gov.cn/" target="_blank"
     style="position: absolute; bottom: 5px; z-index: 20; left: 50%; width: 200px; margin-left: -100px; text-align: center;">
    陕ICP备2023000763号-1</a>
  <div id="wall-bg">
  </div>
</template>


<script>
import LoginForm from "@/components/LoginForm";
import THREE from "@/assets/js/three.min";

export default {
  components: {
    LoginForm
  },
  created() {
    if (localStorage.getItem("gpa") !== null || localStorage.getItem("admin") !== null) {
      this.$message.warning("这是来自缓存的数据，若要获取最新成绩，请点击右上角刷新按钮；登录其它账号，请点击左上角返回按钮");
      let flag = localStorage.getItem("admin")
      if (flag !== null)
        this.$router.push("/admin");
      else
        this.$router.push("/main");
    }
  },
  mounted() {
    setTimeout(() => {
      this.init();
    }, 20);
  },
  unmounted() {
  },
  methods: {
    init() {
      const SEPARATION = 100, AMOUNTX = 50, AMOUNTY = 50;
      let container;
      let camera, scene, renderer;
      let particles, particle, count = 0;
      let mouseX = 0, mouseY = 0;
      let windowHalfX = window.innerWidth / 2;
      let windowHalfY = window.innerHeight;
      init();
      animate();

      function init() {
        container = document.getElementById('wall-bg');
        let overlay = document.createElement('span');
        container.appendChild(overlay);
        camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 10000);
        camera.position.z = 1000;
        scene = new THREE.Scene();
        particles = [];
        const PI2 = Math.PI * 2;
        const material = new THREE.ParticleCanvasMaterial({
          color: '#e6eaea',
          program: function (context) {
            context.beginPath();
            context.arc(0, 0, 1, 0, PI2, true);
            context.fill();
          }
        });
        let i = 0;
        for (let ix = 0; ix < AMOUNTX; ix++) {
          for (let iy = 0; iy < AMOUNTY; iy++) {
            particle = particles[i++] = new THREE.Particle(material);
            particle.position.x = ix * SEPARATION - ((AMOUNTX * SEPARATION) / 2);
            particle.position.z = iy * SEPARATION - ((AMOUNTY * SEPARATION) / 2);
            scene.add(particle);
          }
        }
        renderer = new THREE.CanvasRenderer();
        renderer.setSize(window.innerWidth, window.innerHeight);
        container.appendChild(renderer.domElement);
        document.addEventListener('mousemove', onDocumentMouseMove, false);
        window.addEventListener('resize', onWindowResize, false);
      }

      function onWindowResize() {
        windowHalfX = window.innerWidth / 2;
        windowHalfY = window.innerHeight / 2;
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
      }

      function onDocumentMouseMove(event) {
        mouseX = event.clientX - windowHalfX;
        mouseY = event.clientY - windowHalfY;
      }

      function animate() {
        requestAnimationFrame(animate);
        render();
      }

      function render() {
        camera.position.x += (mouseX - camera.position.x) * .05;
        camera.position.y += (-mouseY - camera.position.y) * .05;
        camera.lookAt(scene.position);
        let i = 0;
        for (let ix = 0; ix < AMOUNTX; ix++) {
          for (let iy = 0; iy < AMOUNTY; iy++) {
            particle = particles[i++];
            particle.position.y = (Math.sin((ix + count) * 0.3) * 50) + (Math.sin((iy + count) * 0.5) * 50);
            particle.scale.x = particle.scale.y = (Math.sin((ix + count) * 0.3) + 1) * 2 + (Math.sin((iy + count) * 0.5) + 1) * 2;
          }
        }
        renderer.render(scene, camera);
        count += 0.08;
      }
    },
  },
}
</script>

<style>
* {
  margin: 0;
  padding: 0;
}

.login-form {
  width: 300px;
  height: 166px;
  margin: auto;
}

.login-container {
  display: flex;
  width: auto;
  flex-direction: row;
  -webkit-box-pack: center;
  justify-content: center;
  -webkit-box-align: center;
  align-items: center;
  padding: 5vw 0px 0px 0px;
  height: 130px;
  border: #0a58ca 10px;
  min-height: 300px;
  background: rgba(255, 255, 255, 0%);
  border-radius: 15px;
}

img {
  position: relative;
  left: 50%;
  transform: translate(-50%);
}

.foot-container {
  position: absolute;
  top: 96vh;
  text-align: left;
  height: 42px;
  line-height: 42px;
  color: #51585e;
  z-index: 999;
  left: 50%;
  transform: translate(-50%);
}

</style>