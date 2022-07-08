import * as THREE from 'three'
class CloudView {
    private container: any
    private camera: any
    private scene: any
    private renderer: any

    private mouseX = 0
    private mouseY = 0
    private start_time = Date.now()

    private windowHalfX = window.innerWidth / 2
    private windowHalfY = window.innerHeight / 2

    constructor(id: string) {
        this.container = document.getElementById(id) as HTMLElement
        if (!this.container) {
            console.log(`不存在id为{id}的HTMLElement`)
            return
        }
        this.init()
        this.addEventListener()
    }

    init() {
        //bg
        this.container.style['background-image'] = 'linear-gradient(#1e4877, #4584b4,#1e4877)'
        //camera
        this.camera = new THREE.PerspectiveCamera(30, window.innerWidth / window.innerHeight, 1, 3000)
        this.camera.position.z = 6000
        //scene
        this.scene = new THREE.Scene()

        var texture = new THREE.TextureLoader().load('static/textures/cloud10.png', this.animate.bind(this))
        texture.magFilter = THREE.LinearMipMapLinearFilter
        texture.minFilter = THREE.LinearMipMapLinearFilter

        let fog = new THREE.Fog(0x4584b4, -100, 3000)

        const vs = `
varying vec2 vUv;

void main() {

  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

}
    `

        const fs = `
uniform sampler2D map;

uniform vec3 fogColor;
uniform float fogNear;
uniform float fogFar;

varying vec2 vUv;

void main() {

  float depth = gl_FragCoord.z / gl_FragCoord.w;
  float fogFactor = smoothstep( fogNear, fogFar, depth );

  gl_FragColor = texture2D( map, vUv );
  gl_FragColor.w *= pow( gl_FragCoord.z, 20.0 );
  gl_FragColor = mix( gl_FragColor, vec4( fogColor, gl_FragColor.w ), fogFactor );

}
    `

        const material = new THREE.ShaderMaterial({
            uniforms: {
                map: { value: texture },
                fogColor: { value: fog.color },
                fogNear: { value: fog.near },
                fogFar: { value: fog.far }
            },
            vertexShader: vs,
            fragmentShader: fs,
            depthWrite: false,
            depthTest: false,
            transparent: true
        })

        const plane = new THREE.Mesh(new THREE.PlaneGeometry(64, 64), material)
        for (var i = 0; i < 8000; i++) {
            plane.position.x = Math.random() * 1000 - 500
            plane.position.y = -Math.random() * Math.random() * 200 - 15
            plane.position.z = i
            plane.rotation.z = Math.random() * Math.PI
            plane.scale.x = plane.scale.y = Math.random() * Math.random() * 1.5 + 0.5

            this.scene.add(plane.clone())

            const mesh2 = plane.clone()
            mesh2.position.z = -8000
            this.scene.add(mesh2)
        }

        this.renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true })
        this.renderer.setSize(window.innerWidth, window.innerHeight)
        // this.renderer.setClearColor('#4584b4', 1.0)
        this.container.appendChild(this.renderer.domElement)
    }
    onDocumentMouseMove(event: any) {
        this.mouseX = (event.clientX - this.windowHalfX) * 0.25
        this.mouseY = (event.clientY - this.windowHalfY) * 0.15
    }

    animate() {
        requestAnimationFrame(this.animate.bind(this))

        const position = ((Date.now() - this.start_time) * 0.03) % 8000

        this.camera.position.x += (this.mouseX - this.camera.position.x) * 0.01
        this.camera.position.y += (-this.mouseY - this.camera.position.y) * 0.01
        this.camera.position.z = -position + 8000

        this.renderer.render(this.scene, this.camera)
    }
    addEventListener() {
        let listenter = () => {
            try {
                this.onWindowResize()
            } catch (e: any) {
                window.removeEventListener('resize', listenter)
            }
        }
        window.addEventListener('resize', listenter)
        document.addEventListener('mousemove', this.onDocumentMouseMove.bind(this), false)
    }
    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight
        this.camera.updateProjectionMatrix()
        this.renderer.setSize(window.innerWidth, window.innerHeight)
    }
}

export default CloudView
