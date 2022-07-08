import { Scene, PerspectiveCamera, Group, WebGLRenderer } from 'three'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { Water } from 'three/examples/jsm/objects/Water.js'
import { Sky } from 'three/examples/jsm/objects/Sky.js'
import { Texture } from 'three/src/textures/Texture'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js'

class OceanView {
    private container: HTMLElement
    private scene!: Scene
    private renderer!: WebGLRenderer
    private camera!: PerspectiveCamera
    private controls: any
    private sun: any
    private water: any
    private pmremGenerator: any
    private sky: any
    private parameters = {
        elevation: 2,
        azimuth: 180
    }

    constructor(id: string) {
        this.container = document.getElementById(id) as HTMLElement
        if (!this.container) {
            console.log(`不存在id为{id}的HTMLElement`)
            return
        }
        this.init()
        this.animate()
        this.addEventListener()
    }
    init() {
        // renderer
        this.renderer = new THREE.WebGLRenderer()
        this.renderer.setPixelRatio(window.devicePixelRatio)
        this.renderer.setSize(window.innerWidth, window.innerHeight)
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping
        this.container.appendChild(this.renderer.domElement)

        // scene
        this.scene = new THREE.Scene()

        //camera
        this.camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 1, 20000)
        this.camera.position.set(30, 30, 100)

        // sun
        this.sun = new THREE.Vector3()

        // Water

        const waterGeometry = new THREE.PlaneGeometry(10000, 10000)

        this.water = new Water(waterGeometry, {
            textureWidth: 512,
            textureHeight: 512,
            waterNormals: new THREE.TextureLoader().load('static/textures/waternormals.jpg', function (texture: Texture) {
                texture.wrapS = texture.wrapT = THREE.RepeatWrapping
            }),
            sunDirection: new THREE.Vector3(),
            sunColor: 0xffffff,
            waterColor: 0x001e0f,
            distortionScale: 3.7,
            fog: this.scene.fog !== undefined
        })
        this.water.rotation.x = -Math.PI / 2
        this.scene.add(this.water)

        // Skybox
        this.sky = new Sky()
        this.sky.scale.setScalar(10000)
        this.scene.add(this.sky)

        const skyUniforms = this.sky.material.uniforms

        skyUniforms['turbidity'].value = 10
        skyUniforms['rayleigh'].value = 2
        skyUniforms['mieCoefficient'].value = 0.005
        skyUniforms['mieDirectionalG'].value = 0.8

        this.pmremGenerator = new THREE.PMREMGenerator(this.renderer)
        this.updateSun()
        // controls
        this.controls = new OrbitControls(this.camera, this.renderer.domElement)
        this.controls.maxPolarAngle = Math.PI * 0.495
        this.controls.target.set(0, 10, 0)
        this.controls.minDistance = 40.0
        this.controls.maxDistance = 200.0
        this.controls.update()
        // this.addFont()
    }

    addFont() {
        const loader = new FontLoader()
        loader.load('static/fonts/helvetiker_regular.typeface.json', (font) => {
            const textGeo = new TextGeometry('Fe·center', {
                font,
                size: 20,
                height: 10,
                curveSegments: 4,
                bevelThickness: 2,
                bevelSize: 1.5,
                bevelEnabled: true
            })

            textGeo.computeBoundingBox()

            const centerOffset = -0.5 * (textGeo.boundingBox.max.x - textGeo.boundingBox.min.x)

            const textMesh1 = new THREE.Mesh(textGeo, [
                new THREE.MeshPhongMaterial({ color: 0xffffff, flatShading: true }), // front
                new THREE.MeshPhongMaterial({ color: 0xffffff }) // side
            ])

            textMesh1.position.x = centerOffset
            textMesh1.position.y = 30
            textMesh1.position.z = 0

            textMesh1.rotation.x = 0
            textMesh1.rotation.y = Math.PI * 2

            this.scene.add(textMesh1)
        })
    }

    updateSun() {
        const phi = THREE.MathUtils.degToRad(90 - this.parameters.elevation)
        const theta = THREE.MathUtils.degToRad(this.parameters.azimuth)

        this.sun.setFromSphericalCoords(1, phi, theta)

        this.sky.material.uniforms['sunPosition'].value.copy(this.sun)
        this.water.material.uniforms['sunDirection'].value.copy(this.sun).normalize()

        this.scene.environment = this.pmremGenerator.fromScene(this.sky).texture
    }
    animate() {
        requestAnimationFrame(this.animate.bind(this))
        this.render()
    }
    render() {
        this.water.material.uniforms['time'].value += 1.0 / 60.0
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
    }
    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight
        this.camera.updateProjectionMatrix()
        this.renderer.setSize(window.innerWidth, window.innerHeight)
    }
}

export default OceanView
