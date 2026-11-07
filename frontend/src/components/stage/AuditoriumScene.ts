import * as THREE from 'three';
import gsap from 'gsap';
import {
  VolumetricBeamShader,
  LensFlareShader,
  FloorSpotlightShader,
  HazeParticleShader,
} from './stageShaders';
import { audioEngine } from './audioEngine';

export interface AuditoriumCallbacks {
  onPhaseChange?: (phase: number, phaseName: string) => void;
  onComplete?: () => void;
}

export class AuditoriumScene {
  private container: HTMLElement;
  private callbacks: AuditoriumCallbacks;
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private clock: THREE.Clock;
  private animationFrameId: number | null = null;
  private resizeObserver: ResizeObserver | null = null;

  // Master GSAP Timeline
  private masterTimeline: gsap.core.Timeline | null = null;

  // Lighting References
  private ambientLight!: THREE.AmbientLight;
  private leftSpotlight!: THREE.SpotLight;
  private rightSpotlight!: THREE.SpotLight;
  private leftSpotTarget!: THREE.Object3D;
  private rightSpotTarget!: THREE.Object3D;
  private rimLight!: THREE.DirectionalLight;

  // Volumetric Materials & Meshes
  private leftBeamMesh!: THREE.Mesh;
  private rightBeamMesh!: THREE.Mesh;
  private leftBeamMaterial!: THREE.ShaderMaterial;
  private rightBeamMaterial!: THREE.ShaderMaterial;

  // Lens Flares
  private leftFlareMesh!: THREE.Mesh;
  private rightFlareMesh!: THREE.Mesh;
  private leftFlareMaterial!: THREE.ShaderMaterial;
  private rightFlareMaterial!: THREE.ShaderMaterial;

  // Floor Illumination Pools
  private leftFloorPoolMesh!: THREE.Mesh;
  private rightFloorPoolMesh!: THREE.Mesh;
  private leftFloorPoolMaterial!: THREE.ShaderMaterial;
  private rightFloorPoolMaterial!: THREE.ShaderMaterial;

  // Fixture Head Pivots
  private leftFixtureHead!: THREE.Group;
  private rightFixtureHead!: THREE.Group;
  private leftFixtureGlassMat!: THREE.MeshStandardMaterial;
  private rightFixtureGlassMat!: THREE.MeshStandardMaterial;

  // Atmospheric Particles
  private hazeParticles!: THREE.Points;
  private hazeParticleMaterial!: THREE.ShaderMaterial;

  // Identity Backdrop & Materials
  private backdropPanel!: THREE.Mesh;
  private backdropMaterial!: THREE.MeshStandardMaterial;

  // Interactive Camera Controls (post-reveal)
  private isInteracting: boolean = false;
  private mouseX: number = 0;
  private mouseY: number = 0;
  private targetCameraOffset: THREE.Vector2 = new THREE.Vector2(0, 0);
  private currentCameraOffset: THREE.Vector2 = new THREE.Vector2(0, 0);
  private baseCameraPos: THREE.Vector3 = new THREE.Vector3(0, 1.85, 10.6);
  private allowInteractivePan: boolean = false;

  constructor(container: HTMLElement, callbacks: AuditoriumCallbacks = {}) {
    this.container = container;
    this.callbacks = callbacks;

    // 1. Scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x000000);
    this.scene.fog = new THREE.FogExp2(0x020204, 0.02);

    // 2. Camera (Wide cinema camera perspective)
    const aspect = container.clientWidth / Math.max(container.clientHeight, 1);
    this.camera = new THREE.PerspectiveCamera(40, aspect, 0.1, 100);
    this.camera.position.copy(this.baseCameraPos);
    this.camera.lookAt(0, 1.45, 0);

    // 3. Renderer (Physically calibrated, ACES Filmic Tone Mapping)
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: 'high-performance',
      stencil: false,
    });
    this.renderer.setSize(container.clientWidth, container.clientHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.08;
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.appendChild(this.renderer.domElement);

    this.clock = new THREE.Clock();

    // 4. Build Environment
    this.buildAuditoriumEnvironment();
    this.buildTrussRig();
    this.buildSpotlights();
    this.buildAtmosphericHaze();

    // 5. Setup Listeners
    this.setupEventListeners();

    // 6. Start Render Loop
    this.render();

    // 7. Orchestrate Cinematic Timeline
    this.initCinematicSequence();
  }

  /**
   * Builds Stage Deck, Proscenium Riser, Acoustic Backdrop, and TED Red Circle
   */
  private buildAuditoriumEnvironment() {
    // Stage Deck (Main Platform)
    // 17 units wide, 7.5 units deep, 0.65 units high
    const stageWidth = 17;
    const stageDepth = 7.5;
    const stageHeight = 0.65;

    const stageGeo = new THREE.BoxGeometry(stageWidth, stageHeight, stageDepth);
    const stageMat = new THREE.MeshStandardMaterial({
      color: 0x0f0f13,
      roughness: 0.35, // Satin finish: produces realistic specular reflection of spotlights
      metalness: 0.12,
    });
    const stageMesh = new THREE.Mesh(stageGeo, stageMat);
    stageMesh.position.set(0, stageHeight / 2, -0.2);
    stageMesh.receiveShadow = true;
    this.scene.add(stageMesh);

    // Stage Front Edge Warm Guide Strip (Subtle architectural LED runner)
    const stripGeo = new THREE.BoxGeometry(stageWidth + 0.1, 0.02, 0.03);
    const stripMat = new THREE.MeshBasicMaterial({
      color: 0x442211,
      transparent: true,
      opacity: 0.45,
    });
    const stripMesh = new THREE.Mesh(stripGeo, stripMat);
    stripMesh.position.set(0, stageHeight - 0.01, stageDepth / 2 - 0.2);
    this.scene.add(stripMesh);

    // Classic TED Red Carpet Circle Medallion (Standard TED hallmark)
    const circleRadius = 1.85;
    const circleGeo = new THREE.CircleGeometry(circleRadius, 64);
    const circleMat = new THREE.MeshStandardMaterial({
      color: 0xeb0028, // Official TED Red
      roughness: 0.72, // Rich velvet carpet response
      metalness: 0.04,
      side: THREE.DoubleSide,
    });
    const circleMesh = new THREE.Mesh(circleGeo, circleMat);
    circleMesh.rotation.x = -Math.PI / 2;
    circleMesh.position.set(0, stageHeight + 0.003, 0.1);
    circleMesh.receiveShadow = true;
    this.scene.add(circleMesh);

    // Red Carpet Outer Subtle Trim Ring
    const trimGeo = new THREE.RingGeometry(circleRadius, circleRadius + 0.045, 64);
    const trimMat = new THREE.MeshStandardMaterial({
      color: 0x8a0017,
      roughness: 0.8,
      side: THREE.DoubleSide,
    });
    const trimMesh = new THREE.Mesh(trimGeo, trimMat);
    trimMesh.rotation.x = -Math.PI / 2;
    trimMesh.position.set(0, stageHeight + 0.004, 0.1);
    this.scene.add(trimMesh);

    // Auditorium Rear Acoustic Wall (Vertical Dark Timber/Acoustic Slats)
    const wallGroup = new THREE.Group();
    const slatWidth = 0.16;
    const slatDepth = 0.08;
    const slatHeight = 7.5;
    const numSlats = 74;
    const wallTotalWidth = 22;

    const slatGeo = new THREE.BoxGeometry(slatWidth, slatHeight, slatDepth);
    const slatMat = new THREE.MeshStandardMaterial({
      color: 0x09090c,
      roughness: 0.85,
      metalness: 0.05,
    });

    for (let i = 0; i < numSlats; i++) {
      const x = -wallTotalWidth / 2 + (i / (numSlats - 1)) * wallTotalWidth;
      const slat = new THREE.Mesh(slatGeo, slatMat);
      slat.position.set(x, slatHeight / 2 + 0.35, -3.8);
      slat.receiveShadow = true;
      wallGroup.add(slat);
    }
    this.scene.add(wallGroup);

    // Deep Back Scrim Wall
    const backScrimGeo = new THREE.PlaneGeometry(28, 12);
    const backScrimMat = new THREE.MeshBasicMaterial({ color: 0x010102 });
    const backScrimMesh = new THREE.Mesh(backScrimGeo, backScrimMat);
    backScrimMesh.position.set(0, 4.5, -4.0);
    this.scene.add(backScrimMesh);

    // Central Floating Stage Backdrop Panel (Houses the TEDx CIT Identity)
    const panelWidth = 9.4;
    const panelHeight = 3.8;
    const panelGeo = new THREE.PlaneGeometry(panelWidth, panelHeight);

    // Generate Razor-Sharp High-Resolution TEDx CIT Brand Texture
    const brandTexture = this.generateBrandTexture();
    this.backdropMaterial = new THREE.MeshStandardMaterial({
      map: brandTexture,
      emissive: new THREE.Color(0xffffff),
      emissiveMap: brandTexture,
      emissiveIntensity: 0.0,
      transparent: true,
      roughness: 0.3,
      metalness: 0.08,
      side: THREE.DoubleSide,
    });
    this.backdropPanel = new THREE.Mesh(panelGeo, this.backdropMaterial);
    this.backdropPanel.position.set(0, 2.65, -3.4);
    this.backdropPanel.receiveShadow = true;
    this.backdropPanel.renderOrder = 2;
    this.scene.add(this.backdropPanel);

    // Panel Matte Backplate / Frame
    const frameGeo = new THREE.BoxGeometry(panelWidth + 0.15, panelHeight + 0.15, 0.08);
    const frameMat = new THREE.MeshStandardMaterial({
      color: 0x121216,
      roughness: 0.6,
      metalness: 0.3,
    });
    const frameMesh = new THREE.Mesh(frameGeo, frameMat);
    frameMesh.position.set(0, 2.65, -3.45);
    this.scene.add(frameMesh);
  }

  /**
   * Generates a 2048x1024 crisp canvas texture of the official TEDx CIT branding
   * strictly adhering to official proportions and typography.
   */
  private generateBrandTexture(): THREE.CanvasTexture {
    const canvas = document.createElement('canvas');
    canvas.width = 2048;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d')!;

    // Clean transparent background
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    const tedText = 'TED';
    const xText = 'x';
    const citText = 'CHENNAI INSTITUTE OF TECHNOLOGY';
    const subText = 'x = independently organized TED event';

    ctx.font = '900 134px "Inter", -apple-system, sans-serif';
    const tedWidth = ctx.measureText(tedText).width;

    ctx.font = '900 88px "Inter", -apple-system, sans-serif';
    const xMetrics = ctx.measureText(xText);
    const xWidth = xMetrics.width;

    ctx.font = '700 70px "Inter", -apple-system, sans-serif';
    const citWidth = ctx.measureText(citText).width;

    // Top block total width = tedWidth + xWidth + 34px gap + citWidth
    const totalTopWidth = tedWidth + xWidth + 34 + citWidth;
    const startX = centerX - totalTopWidth / 2;
    const topY = centerY - 28;

    // Render "TED" in official TED red
    ctx.fillStyle = '#EB0028';
    ctx.font = '900 134px "Inter", -apple-system, sans-serif';
    ctx.fillText(tedText, startX, topY);

    // Render "x" slightly offset upward
    ctx.font = '900 90px "Inter", -apple-system, sans-serif';
    ctx.fillText(xText, startX + tedWidth + 2, topY - 14);

    // Render "CHENNAI INSTITUTE OF TECHNOLOGY" in crisp pure white
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '700 70px "Inter", -apple-system, sans-serif';
    ctx.fillText(citText, startX + tedWidth + xWidth + 34, topY + 4);

    // Render "x = independently organized TED event" below
    ctx.fillStyle = '#9E9EA3';
    ctx.font = '500 32px "Inter", -apple-system, sans-serif';
    ctx.fillText(subText, startX + tedWidth + xWidth + 36, topY + 68);

    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.minFilter = THREE.LinearMipmapLinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.generateMipmaps = true;
    texture.needsUpdate = true;

    return texture;
  }

  /**
   * Builds Heavy Aluminum Concert Rigging / Box Truss Overhead
   * Visible in the upper portion of the camera frame.
   */
  private buildTrussRig() {
    const trussGroup = new THREE.Group();
    const trussY = 5.2;
    const trussZ = 1.0;
    const trussSpan = 22;
    const chordRadius = 0.045;

    const chordGeo = new THREE.CylinderGeometry(chordRadius, chordRadius, trussSpan, 16);
    chordGeo.rotateZ(Math.PI / 2);

    const trussMat = new THREE.MeshStandardMaterial({
      color: 0x28282d,
      roughness: 0.36,
      metalness: 0.88,
    });

    // 4 Chords forming a rectangular concert box truss
    const offsets = [
      [-0.35, -0.35],
      [0.35, -0.35],
      [-0.35, 0.35],
      [0.35, 0.35],
    ];

    offsets.forEach(([dy, dz]) => {
      const chord = new THREE.Mesh(chordGeo, trussMat);
      chord.position.set(0, trussY + dy, trussZ + dz);
      trussGroup.add(chord);
    });

    // Zig-Zag Diagonal Struts
    const numBays = 22;
    const strutRadius = 0.02;
    const bayWidth = trussSpan / numBays;

    for (let i = 0; i < numBays; i++) {
      const x0 = -trussSpan / 2 + i * bayWidth;
      const x1 = x0 + bayWidth;

      const start = new THREE.Vector3(x0, trussY - 0.35, trussZ - 0.35);
      const end = new THREE.Vector3(x1, trussY - 0.35, trussZ + 0.35);
      const strutLength = start.distanceTo(end);

      const strutGeo = new THREE.CylinderGeometry(strutRadius, strutRadius, strutLength, 8);
      const strut = new THREE.Mesh(strutGeo, trussMat);
      strut.position.copy(start.clone().add(end).multiplyScalar(0.5));
      strut.quaternion.setFromUnitVectors(
        new THREE.Vector3(0, 1, 0),
        end.clone().sub(start).normalize()
      );
      trussGroup.add(strut);
    }

    this.scene.add(trussGroup);
  }

  /**
   * Constructs the Two Professional Followspots, Volumetric Beams, Lens Coronas,
   * Floor Pools, and Real Three.js Spotlights.
   */
  private buildSpotlights() {
    // 1. Ambient Lighting (Starts at near-zero for Phase 1 darkness)
    this.ambientLight = new THREE.AmbientLight(0x06060a, 0.015);
    this.scene.add(this.ambientLight);

    // Subtle Backdrop Rim / Accent Wash
    this.rimLight = new THREE.DirectionalLight(0xff2b25, 0.0);
    this.rimLight.position.set(0, 6.5, -3.8);
    this.scene.add(this.rimLight);

    // 2. Spotlight Positions & Initial Targets (Both clearly visible in frame)
    // Left: Upper-left rigging
    const leftPos = new THREE.Vector3(-5.8, 4.6, 1.2);
    const leftInitTarget = new THREE.Vector3(-0.9, 0.65, -0.4);

    // Right: Upper-right rigging (symmetrical)
    const rightPos = new THREE.Vector3(5.8, 4.6, 1.2);
    const rightInitTarget = new THREE.Vector3(0.9, 0.65, -0.4);

    // Targets in 3D
    this.leftSpotTarget = new THREE.Object3D();
    this.leftSpotTarget.position.copy(leftInitTarget);
    this.scene.add(this.leftSpotTarget);

    this.rightSpotTarget = new THREE.Object3D();
    this.rightSpotTarget.position.copy(rightInitTarget);
    this.scene.add(this.rightSpotTarget);

    // 3. Physically-Based Three.js SpotLights
    // Left SpotLight
    this.leftSpotlight = new THREE.SpotLight(0xfcf8f2, 0.0, 26, 0.28, 0.45, 2);
    this.leftSpotlight.position.copy(leftPos);
    this.leftSpotlight.target = this.leftSpotTarget;
    this.leftSpotlight.castShadow = true;
    this.leftSpotlight.shadow.bias = -0.0006;
    this.leftSpotlight.shadow.mapSize.set(1024, 1024);
    this.leftSpotlight.shadow.camera.near = 1.0;
    this.leftSpotlight.shadow.camera.far = 28;
    this.scene.add(this.leftSpotlight);

    // Right SpotLight
    this.rightSpotlight = new THREE.SpotLight(0xfcf8f2, 0.0, 26, 0.28, 0.45, 2);
    this.rightSpotlight.position.copy(rightPos);
    this.rightSpotlight.target = this.rightSpotTarget;
    this.rightSpotlight.castShadow = true;
    this.rightSpotlight.shadow.bias = -0.0006;
    this.rightSpotlight.shadow.mapSize.set(1024, 1024);
    this.rightSpotlight.shadow.camera.near = 1.0;
    this.rightSpotlight.shadow.camera.far = 28;
    this.scene.add(this.rightSpotlight);

    // 4. Physical Theatrical Fixture Assemblies (mounted to the truss)
    const leftFixture = this.buildTheatricalFixture();
    leftFixture.position.copy(leftPos);
    this.scene.add(leftFixture);
    this.leftFixtureHead = leftFixture.userData.head;
    this.leftFixtureGlassMat = leftFixture.userData.glassMat;

    const rightFixture = this.buildTheatricalFixture();
    rightFixture.position.copy(rightPos);
    this.scene.add(rightFixture);
    this.rightFixtureHead = rightFixture.userData.head;
    this.rightFixtureGlassMat = rightFixture.userData.glassMat;

    // 5. Volumetric Light Cones (Custom GLSL Shader)
    // Geometry extends along +Z from z = 0 (radius 0.16) to z = +16 (radius 2.45)
    const beamLength = 16.0;
    const beamRadiusTop = 0.16;
    const beamRadiusBottom = 2.45;
    const beamGeo = new THREE.CylinderGeometry(
      beamRadiusTop,
      beamRadiusBottom,
      beamLength,
      64,
      32,
      true
    );
    // Rotate so top (+Y) goes to -Z and bottom (-Y) goes to +Z
    beamGeo.rotateX(-Math.PI / 2);
    // Translate along +Z so apex is at z = 0 and base is at z = +16
    beamGeo.translate(0, 0, beamLength / 2);

    this.leftBeamMaterial = new THREE.ShaderMaterial({
      uniforms: THREE.UniformsUtils.clone(VolumetricBeamShader.uniforms),
      vertexShader: VolumetricBeamShader.vertexShader,
      fragmentShader: VolumetricBeamShader.fragmentShader,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
    });

    this.rightBeamMaterial = new THREE.ShaderMaterial({
      uniforms: THREE.UniformsUtils.clone(VolumetricBeamShader.uniforms),
      vertexShader: VolumetricBeamShader.vertexShader,
      fragmentShader: VolumetricBeamShader.fragmentShader,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
    });

    this.leftBeamMesh = new THREE.Mesh(beamGeo, this.leftBeamMaterial);
    this.leftBeamMesh.position.copy(leftPos);
    this.scene.add(this.leftBeamMesh);

    this.rightBeamMesh = new THREE.Mesh(beamGeo, this.rightBeamMaterial);
    this.rightBeamMesh.position.copy(rightPos);
    this.scene.add(this.rightBeamMesh);

    // 6. Lens Flare Coronas at Fixture Apertures
    const flareGeo = new THREE.PlaneGeometry(1.6, 1.6);
    this.leftFlareMaterial = new THREE.ShaderMaterial({
      uniforms: THREE.UniformsUtils.clone(LensFlareShader.uniforms),
      vertexShader: LensFlareShader.vertexShader,
      fragmentShader: LensFlareShader.fragmentShader,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
    });
    this.rightFlareMaterial = new THREE.ShaderMaterial({
      uniforms: THREE.UniformsUtils.clone(LensFlareShader.uniforms),
      vertexShader: LensFlareShader.vertexShader,
      fragmentShader: LensFlareShader.fragmentShader,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
    });

    this.leftFlareMesh = new THREE.Mesh(flareGeo, this.leftFlareMaterial);
    this.leftFlareMesh.position.copy(leftPos.clone().add(new THREE.Vector3(0.04, -0.04, 0.55)));
    this.scene.add(this.leftFlareMesh);

    this.rightFlareMesh = new THREE.Mesh(flareGeo, this.rightFlareMaterial);
    this.rightFlareMesh.position.copy(rightPos.clone().add(new THREE.Vector3(-0.04, -0.04, 0.55)));
    this.scene.add(this.rightFlareMesh);

    // 7. Floor Illumination Pools
    const floorPoolGeo = new THREE.PlaneGeometry(5.5, 5.5);
    floorPoolGeo.rotateX(-Math.PI / 2);

    this.leftFloorPoolMaterial = new THREE.ShaderMaterial({
      uniforms: THREE.UniformsUtils.clone(FloorSpotlightShader.uniforms),
      vertexShader: FloorSpotlightShader.vertexShader,
      fragmentShader: FloorSpotlightShader.fragmentShader,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    this.leftFloorPoolMaterial.uniforms.uCenter.value.set(leftInitTarget.x, leftInitTarget.z);
    this.leftFloorPoolMaterial.uniforms.uRadius.value.set(2.4, 1.4);

    this.rightFloorPoolMaterial = new THREE.ShaderMaterial({
      uniforms: THREE.UniformsUtils.clone(FloorSpotlightShader.uniforms),
      vertexShader: FloorSpotlightShader.vertexShader,
      fragmentShader: FloorSpotlightShader.fragmentShader,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    this.rightFloorPoolMaterial.uniforms.uCenter.value.set(rightInitTarget.x, rightInitTarget.z);
    this.rightFloorPoolMaterial.uniforms.uRadius.value.set(2.4, 1.4);

    this.leftFloorPoolMesh = new THREE.Mesh(floorPoolGeo, this.leftFloorPoolMaterial);
    this.leftFloorPoolMesh.position.set(0, 0.655, 0);
    this.scene.add(this.leftFloorPoolMesh);

    this.rightFloorPoolMesh = new THREE.Mesh(floorPoolGeo, this.rightFloorPoolMaterial);
    this.rightFloorPoolMesh.position.set(0, 0.656, 0);
    this.scene.add(this.rightFloorPoolMesh);
  }

  /**
   * Detailed Theatrical Followspot 3D Fixture Model
   * Clean, professional, solid casing with mounting yoke, cooling vanes,
   * front optical lens, and rear steering handles.
   */
  private buildTheatricalFixture(): THREE.Group {
    const fixtureGroup = new THREE.Group();

    const chassisMat = new THREE.MeshStandardMaterial({
      color: 0x1a1a1e,
      roughness: 0.35,
      metalness: 0.85,
    });

    const yokeMat = new THREE.MeshStandardMaterial({
      color: 0x24242a,
      roughness: 0.4,
      metalness: 0.88,
    });

    // 1. Truss Clamp
    const clampGeo = new THREE.TorusGeometry(0.09, 0.025, 12, 24, Math.PI * 1.5);
    const clamp = new THREE.Mesh(clampGeo, chassisMat);
    clamp.position.set(0, 0.4, 0);
    fixtureGroup.add(clamp);

    // 2. U-Yoke Bracket
    const yokeGroup = new THREE.Group();
    const yokeBottomGeo = new THREE.CylinderGeometry(0.04, 0.04, 0.65, 16);
    yokeBottomGeo.rotateZ(Math.PI / 2);
    const yokeBottom = new THREE.Mesh(yokeBottomGeo, yokeMat);
    yokeBottom.position.set(0, 0.28, 0);
    yokeGroup.add(yokeBottom);

    const yokeArmGeo = new THREE.BoxGeometry(0.045, 0.55, 0.06);
    const leftArm = new THREE.Mesh(yokeArmGeo, yokeMat);
    leftArm.position.set(-0.32, 0.03, 0);
    const rightArm = new THREE.Mesh(yokeArmGeo, yokeMat);
    rightArm.position.set(0.32, 0.03, 0);
    yokeGroup.add(leftArm);
    yokeGroup.add(rightArm);
    fixtureGroup.add(yokeGroup);

    // 3. Tilting Lamp Head (Followspot Chassis)
    const headGroup = new THREE.Group();

    // Main Cylindrical Body (oriented along Z)
    const bodyGeo = new THREE.CylinderGeometry(0.24, 0.24, 0.75, 32);
    bodyGeo.rotateX(Math.PI / 2);
    const body = new THREE.Mesh(bodyGeo, chassisMat);
    body.position.set(0, 0, 0);
    headGroup.add(body);

    // Cooling Vanes / Heat Sink Fins
    const finMat = new THREE.MeshStandardMaterial({
      color: 0x121215,
      roughness: 0.5,
      metalness: 0.75,
    });
    for (let f = -0.25; f <= 0.1; f += 0.07) {
      const finGeo = new THREE.TorusGeometry(0.26, 0.015, 8, 24);
      const fin = new THREE.Mesh(finGeo, finMat);
      fin.position.set(0, 0, f);
      headGroup.add(fin);
    }

    // Front Zoom Lens Barrel Ring
    const barrelGeo = new THREE.CylinderGeometry(0.22, 0.24, 0.3, 32);
    barrelGeo.rotateX(Math.PI / 2);
    const barrel = new THREE.Mesh(barrelGeo, chassisMat);
    barrel.position.set(0, 0, 0.42);
    headGroup.add(barrel);

    // Front Bezel Lip
    const bezelGeo = new THREE.CylinderGeometry(0.25, 0.25, 0.08, 32);
    bezelGeo.rotateX(Math.PI / 2);
    const bezel = new THREE.Mesh(bezelGeo, chassisMat);
    bezel.position.set(0, 0, 0.58);
    headGroup.add(bezel);

    // Front Optical Glass Lens Disc (facing +Z)
    const lensGeo = new THREE.CircleGeometry(0.23, 32);
    const lensMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      emissive: 0x000000,
      emissiveIntensity: 0.0,
      roughness: 0.05,
      metalness: 0.1,
      side: THREE.DoubleSide,
    });
    const lens = new THREE.Mesh(lensGeo, lensMat);
    lens.position.set(0, 0, 0.62);
    headGroup.add(lens);

    // Rear Operator Steering Handles (at -Z)
    const handleGeo = new THREE.TorusGeometry(0.18, 0.02, 12, 24, Math.PI);
    const handle = new THREE.Mesh(handleGeo, chassisMat);
    handle.position.set(0, 0, -0.4);
    headGroup.add(handle);

    fixtureGroup.add(headGroup);

    fixtureGroup.userData = {
      head: headGroup,
      glassMat: lensMat,
    };

    return fixtureGroup;
  }

  /**
   * Atmospheric Haze Particles (1000 volumetric dust motes suspended in the auditorium air)
   */
  private buildAtmosphericHaze() {
    const particleCount = 1000;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);
    const phases = new Float32Array(particleCount);
    const velocities = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      // Scatter within auditorium stage volume
      positions[i * 3 + 0] = (Math.random() - 0.5) * 20; // X
      positions[i * 3 + 1] = Math.random() * 6.5 + 0.3;  // Y
      positions[i * 3 + 2] = (Math.random() - 0.5) * 12; // Z

      sizes[i] = Math.random() * 0.14 + 0.06;
      phases[i] = Math.random() * Math.PI * 2;

      velocities[i * 3 + 0] = (Math.random() - 0.5) * 0.18;
      velocities[i * 3 + 1] = (Math.random() - 0.5) * 0.1;
      velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.18;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1));
    geometry.setAttribute('aPhase', new THREE.BufferAttribute(phases, 1));
    geometry.setAttribute('aVelocity', new THREE.BufferAttribute(velocities, 3));

    this.hazeParticleMaterial = new THREE.ShaderMaterial({
      uniforms: THREE.UniformsUtils.clone(HazeParticleShader.uniforms),
      vertexShader: HazeParticleShader.vertexShader,
      fragmentShader: HazeParticleShader.fragmentShader,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    this.hazeParticles = new THREE.Points(geometry, this.hazeParticleMaterial);
    this.scene.add(this.hazeParticles);
  }

  /**
   * Orchestrates the 5-Phase Cinematic Sequence with GSAP
   * Lasts ~8.5 seconds as per specification.
   */
  private initCinematicSequence() {
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      this.skipToFinalSettledState();
      return;
    }

    const tl = gsap.timeline({
      onComplete: () => {
        this.allowInteractivePan = true;
        this.callbacks.onComplete?.();
      },
    });
    this.masterTimeline = tl;

    // Phase values proxy
    const lightingState = {
      ambientIntensity: 0.015,
      leftIntensity: 0.0,
      leftTargetX: -0.9,
      leftTargetY: 0.65,
      leftTargetZ: -0.4,
      rightIntensity: 0.0,
      rightTargetX: 0.9,
      rightTargetY: 0.65,
      rightTargetZ: -0.4,
      brandEmissive: 0.0,
      rimIntensity: 0.0,
      cameraZ: 10.6,
      cameraY: 1.85,
    };

    // -------------------------------------------------------------------------
    // PHASE 1 — COMPLETE DARKNESS (0.0 – 1.5s)
    // -------------------------------------------------------------------------
    tl.add(() => {
      this.callbacks.onPhaseChange?.(1, 'COMPLETE DARKNESS');
    }, 0.0);

    // Camera is steady, ambient is barely perceptible
    tl.to(
      lightingState,
      {
        duration: 1.5,
        ambientIntensity: 0.02,
        ease: 'none',
      },
      0.0
    );

    // -------------------------------------------------------------------------
    // PHASE 2 — LEFT SPOTLIGHT ACTIVATION (1.5 – 3.0s)
    // -------------------------------------------------------------------------
    tl.add(() => {
      this.callbacks.onPhaseChange?.(2, 'LEFT SPOTLIGHT ACTIVATION');
      audioEngine.playSpotlightIgnition();
    }, 1.5);

    // Arc lamp ignition surge & beam power-up
    tl.to(
      lightingState,
      {
        leftIntensity: 1.0,
        ambientIntensity: 0.045,
        duration: 1.2,
        ease: 'power2.out',
      },
      1.5
    );

    // Initial spotlight aim sweep across stage floor
    tl.to(
      lightingState,
      {
        leftTargetX: -0.6,
        leftTargetZ: -0.2,
        duration: 1.4,
        ease: 'sine.inOut',
      },
      1.6
    );

    // -------------------------------------------------------------------------
    // PHASE 3 — RIGHT SPOTLIGHT ACTIVATION (3.0 – 4.5s)
    // -------------------------------------------------------------------------
    tl.add(() => {
      this.callbacks.onPhaseChange?.(3, 'RIGHT SPOTLIGHT ACTIVATION');
      audioEngine.playSpotlightIgnition();
    }, 3.0);

    // Right arc lamp powers on
    tl.to(
      lightingState,
      {
        rightIntensity: 1.0,
        ambientIntensity: 0.075,
        duration: 1.2,
        ease: 'power2.out',
      },
      3.0
    );

    // Right beam sweeps towards stage center
    tl.to(
      lightingState,
      {
        rightTargetX: 0.6,
        rightTargetZ: -0.2,
        duration: 1.4,
        ease: 'sine.inOut',
      },
      3.1
    );

    // -------------------------------------------------------------------------
    // PHASE 4 — TEDx IDENTITY REVEAL (4.5 – 7.0s)
    // -------------------------------------------------------------------------
    tl.add(() => {
      this.callbacks.onPhaseChange?.(4, 'TEDx IDENTITY REVEAL');
      audioEngine.playRevealSwell();
    }, 4.5);

    // Both spotlights smoothly converge onto the backdrop brand identity
    tl.to(
      lightingState,
      {
        leftTargetX: -0.7,
        leftTargetY: 2.65,
        leftTargetZ: -3.35,
        rightTargetX: 0.7,
        rightTargetY: 2.65,
        rightTargetZ: -3.35,
        brandEmissive: 0.42,
        rimIntensity: 0.28,
        ambientIntensity: 0.085,
        duration: 2.2,
        ease: 'power3.inOut',
      },
      4.5
    );

    // -------------------------------------------------------------------------
    // PHASE 5 — CINEMATIC HOLD & PUSH-IN (7.0 – 9.5s)
    // -------------------------------------------------------------------------
    tl.add(() => {
      this.callbacks.onPhaseChange?.(5, 'CINEMATIC HOLD');
    }, 7.0);

    // Cinema camera subtle push-in (dolly-in towards stage)
    tl.to(
      lightingState,
      {
        cameraZ: 9.6,
        cameraY: 1.75,
        duration: 2.5,
        ease: 'power1.out',
      },
      7.0
    );

    // Update Frame Hook from GSAP
    tl.eventCallback('onUpdate', () => {
      // 1. Ambient & Rim
      this.ambientLight.intensity = lightingState.ambientIntensity;
      this.rimLight.intensity = lightingState.rimIntensity;

      // 2. Left Spotlight
      this.leftSpotlight.intensity = lightingState.leftIntensity * 42.0;
      this.leftSpotTarget.position.set(
        lightingState.leftTargetX,
        lightingState.leftTargetY,
        lightingState.leftTargetZ
      );
      this.leftBeamMaterial.uniforms.uIntensity.value = lightingState.leftIntensity;
      this.leftFlareMaterial.uniforms.uIntensity.value = lightingState.leftIntensity;

      // Floor pool intensity fades when spotlight tilts up to backdrop
      const leftFloorFactor = Math.max(0.0, 1.0 - (lightingState.leftTargetY - 0.65) / 1.4);
      this.leftFloorPoolMaterial.uniforms.uIntensity.value = lightingState.leftIntensity * leftFloorFactor;
      this.leftFloorPoolMaterial.uniforms.uCenter.value.set(
        lightingState.leftTargetX,
        lightingState.leftTargetZ
      );
      this.leftFixtureGlassMat.emissiveIntensity = lightingState.leftIntensity * 3.5;

      // 3. Right Spotlight
      this.rightSpotlight.intensity = lightingState.rightIntensity * 42.0;
      this.rightSpotTarget.position.set(
        lightingState.rightTargetX,
        lightingState.rightTargetY,
        lightingState.rightTargetZ
      );
      this.rightBeamMaterial.uniforms.uIntensity.value = lightingState.rightIntensity;
      this.rightFlareMaterial.uniforms.uIntensity.value = lightingState.rightIntensity;

      const rightFloorFactor = Math.max(0.0, 1.0 - (lightingState.rightTargetY - 0.65) / 1.4);
      this.rightFloorPoolMaterial.uniforms.uIntensity.value = lightingState.rightIntensity * rightFloorFactor;
      this.rightFloorPoolMaterial.uniforms.uCenter.value.set(
        lightingState.rightTargetX,
        lightingState.rightTargetZ
      );
      this.rightFixtureGlassMat.emissiveIntensity = lightingState.rightIntensity * 3.5;

      // 4. Backdrop Brand Emissive Response
      this.backdropMaterial.emissiveIntensity = lightingState.brandEmissive;

      // 5. Particle Uniforms
      this.hazeParticleMaterial.uniforms.uLeftIntensity.value = lightingState.leftIntensity;
      this.hazeParticleMaterial.uniforms.uLeftTarget.value.copy(this.leftSpotTarget.position);
      this.hazeParticleMaterial.uniforms.uRightIntensity.value = lightingState.rightIntensity;
      this.hazeParticleMaterial.uniforms.uRightTarget.value.copy(this.rightSpotTarget.position);

      // 6. Camera Base Position
      this.baseCameraPos.set(0, lightingState.cameraY, lightingState.cameraZ);
    });

    // Support query parameters for direct phase jumping (?phase=1..5 or ?t=seconds)
    if (typeof window !== 'undefined') {
      const searchParams = new URLSearchParams(window.location.search);
      const phaseParam = searchParams.get('phase');
      const timeParam = searchParams.get('t');

      if (timeParam !== null) {
        const t = parseFloat(timeParam);
        tl.seek(t, false);
        tl.pause();
      } else if (phaseParam !== null) {
        const p = parseInt(phaseParam, 10);
        if (p === 1) {
          tl.seek(0.5, false);
          tl.pause();
        } else if (p === 2) {
          tl.seek(2.4, false);
          tl.pause();
        } else if (p === 3) {
          tl.seek(3.8, false);
          tl.pause();
        } else if (p === 4) {
          tl.seek(5.8, false);
          tl.pause();
        } else if (p === 5) {
          tl.seek(9.2, false);
          tl.pause();
          this.allowInteractivePan = true;
          this.callbacks.onComplete?.();
        }
      }
    }
  }

  /**
   * Fast-forward / Skip to final settled state (used by Skip Intro & Reduced Motion)
   */
  public skipToFinalSettledState() {
    if (this.masterTimeline) {
      this.masterTimeline.seek(9.5, false);
    } else {
      // Fallback manual set
      this.ambientLight.intensity = 0.085;
      this.rimLight.intensity = 0.28;

      this.leftSpotlight.intensity = 42.0;
      this.leftSpotTarget.position.set(-0.7, 2.65, -3.35);
      this.leftBeamMaterial.uniforms.uIntensity.value = 1.0;
      this.leftFlareMaterial.uniforms.uIntensity.value = 1.0;
      this.leftFloorPoolMaterial.uniforms.uIntensity.value = 0.0;
      this.leftFixtureGlassMat.emissiveIntensity = 3.5;

      this.rightSpotlight.intensity = 42.0;
      this.rightSpotTarget.position.set(0.7, 2.65, -3.35);
      this.rightBeamMaterial.uniforms.uIntensity.value = 1.0;
      this.rightFlareMaterial.uniforms.uIntensity.value = 1.0;
      this.rightFloorPoolMaterial.uniforms.uIntensity.value = 0.0;
      this.rightFixtureGlassMat.emissiveIntensity = 3.5;

      this.backdropMaterial.emissiveIntensity = 0.42;

      this.hazeParticleMaterial.uniforms.uLeftIntensity.value = 1.0;
      this.hazeParticleMaterial.uniforms.uLeftTarget.value.copy(this.leftSpotTarget.position);
      this.hazeParticleMaterial.uniforms.uRightIntensity.value = 1.0;
      this.hazeParticleMaterial.uniforms.uRightTarget.value.copy(this.rightSpotTarget.position);

      this.baseCameraPos.set(0, 1.75, 9.6);
    }

    this.allowInteractivePan = true;
    this.callbacks.onPhaseChange?.(5, 'CINEMATIC HOLD');
    this.callbacks.onComplete?.();
  }

  /**
   * Replays the entire cinematic sequence from Phase 1
   */
  public replay() {
    this.allowInteractivePan = false;
    this.targetCameraOffset.set(0, 0);
    this.currentCameraOffset.set(0, 0);

    if (this.masterTimeline) {
      this.masterTimeline.restart();
    } else {
      this.initCinematicSequence();
    }
  }

  /**
   * Sets up interactive pointer controls and resize observer
   */
  private setupEventListeners() {
    // Window Resize
    this.resizeObserver = new ResizeObserver(() => {
      this.handleResize();
    });
    this.resizeObserver.observe(this.container);

    // Interactive Camera Pan (Active post-reveal)
    const onPointerMove = (e: MouseEvent | TouchEvent) => {
      if (!this.allowInteractivePan) return;

      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

      const rect = this.container.getBoundingClientRect();
      const normX = ((clientX - rect.left) / rect.width) * 2 - 1;
      const normY = -(((clientY - rect.top) / rect.height) * 2 - 1);

      // Subtle cinema camera sway (horizontal +/- 1.1 units, vertical +/- 0.4 units)
      this.targetCameraOffset.set(normX * 1.1, normY * 0.4);
    };

    window.addEventListener('mousemove', onPointerMove, { passive: true });
    window.addEventListener('touchmove', onPointerMove, { passive: true });
  }

  private handleResize() {
    const width = this.container.clientWidth;
    const height = Math.max(this.container.clientHeight, 1);

    this.camera.aspect = width / height;

    // Dynamic FOV adjustment for mobile aspect ratios
    if (width < 768) {
      this.camera.fov = 48; // Wider FOV for vertical mobile screens
    } else {
      this.camera.fov = 40; // Cinematic wide FOV for desktop
    }
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  }

  /**
   * Main Per-Frame Render Loop
   */
  private render = () => {
    this.animationFrameId = requestAnimationFrame(this.render);

    const elapsedTime = this.clock.getElapsedTime();

    // 1. Update Shader Uniforms
    this.leftBeamMaterial.uniforms.uTime.value = elapsedTime;
    this.rightBeamMaterial.uniforms.uTime.value = elapsedTime;
    this.hazeParticleMaterial.uniforms.uTime.value = elapsedTime;

    // 2. Aim Physical Followspot Fixture Heads towards targets
    if (this.leftFixtureHead) {
      this.leftFixtureHead.lookAt(this.leftSpotTarget.position);
      this.leftBeamMesh.lookAt(this.leftSpotTarget.position);
    }
    if (this.rightFixtureHead) {
      this.rightFixtureHead.lookAt(this.rightSpotTarget.position);
      this.rightBeamMesh.lookAt(this.rightSpotTarget.position);
    }

    // 3. Make Lens Flare Coronas face Camera
    this.leftFlareMesh.lookAt(this.camera.position);
    this.rightFlareMesh.lookAt(this.camera.position);

    // 4. Camera Smooth Inertial Float & Interactive Pan
    this.currentCameraOffset.lerp(this.targetCameraOffset, 0.05);

    // Subtle cinema camera breathing
    const subtleBreathX = Math.sin(elapsedTime * 0.45) * 0.035;
    const subtleBreathY = Math.cos(elapsedTime * 0.6) * 0.025;

    this.camera.position.x = this.baseCameraPos.x + this.currentCameraOffset.x + subtleBreathX;
    this.camera.position.y = this.baseCameraPos.y + this.currentCameraOffset.y + subtleBreathY;
    this.camera.position.z = this.baseCameraPos.z;

    this.camera.lookAt(0, 1.45, 0);

    // 5. Render Scene
    this.renderer.render(this.scene, this.camera);
  };

  /**
   * Cleanup and memory disposal
   */
  public dispose() {
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
    }
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }
    if (this.masterTimeline) {
      this.masterTimeline.kill();
    }

    this.renderer.dispose();
    if (this.container.contains(this.renderer.domElement)) {
      this.container.removeChild(this.renderer.domElement);
    }
  }
}
