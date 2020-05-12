import React, { Component, Fragment } from "react";
import "babylonjs-loaders";
import "babylonjs-materials";
import * as BABYLON from "babylonjs";

class Head extends Component {
  constructor(props) {
    super(props);

    this.state = {
      engine: null,
      scene: null,
      camera: null,
      gyroscopeActive: false,
      orientationPermission: false,
      stare: false,
      headLoaded: false,
      hasGyroscope:
        (typeof DeviceOrientationEvent !== "undefined" &&
          DeviceOrientationEvent.requestPermission) ||
        navigator.userAgent.match("CriOS") ||
        navigator.userAgent.match("iPhone"),
    };
  }

  componentDidMount() {
    const engine = new BABYLON.Engine(document.getElementById("head"), true);
    const scene = new BABYLON.Scene(engine);
    scene.clearColor = new BABYLON.Color4(0, 0, 0, 0);

    const camera = new BABYLON.UniversalCamera(
      "camera",
      new BABYLON.Vector3(0, 0, 500),
      scene
    );
    camera.setTarget(BABYLON.Vector3.Zero());
    camera.lowerRadiusLimit = 400;
    camera.upperRadiusLimit = 400;

    const hemisphericLight = new BABYLON.HemisphericLight(
      "hemisphericLight",
      new BABYLON.Vector3(0, 200, 0),
      scene
    );
    hemisphericLight.diffuse = new BABYLON.Color3(1, 1, 1);

    const lightIntensity = 1;
    const spotLightFront = new BABYLON.SpotLight(
      "spotLightFront",
      new BABYLON.Vector3(0, 0, 400),
      new BABYLON.Vector3(0, 0, 0),
      Math.PI * 2,
      0,
      scene
    );
    spotLightFront.intensity = lightIntensity;
    const spotLightLeft = new BABYLON.SpotLight(
      "spotLightLeft",
      new BABYLON.Vector3(400, -200, 100),
      new BABYLON.Vector3(0, 0, 0),
      Math.PI * 2,
      0,
      scene
    );
    spotLightLeft.intensity = lightIntensity;
    const spotLightRight = new BABYLON.SpotLight(
      "spotLightRight",
      new BABYLON.Vector3(-400, -200, 100),
      new BABYLON.Vector3(0, 0, 0),
      Math.PI * 2,
      0,
      scene
    );
    spotLightRight.intensity = lightIntensity;
    const spotLightLower = new BABYLON.SpotLight(
      "spotLightLower",
      new BABYLON.Vector3(0, -200, 200),
      new BABYLON.Vector3(0, 0, 0),
      Math.PI * 2,
      0,
      scene
    );
    spotLightLower.intensity = lightIntensity;

    if (this.state.hasGyroscope) {
      hemisphericLight.intensity = 2;
      spotLightFront.position.z = 300;
      spotLightLeft.position.x = 300;
      spotLightRight.position.x = -300;
    }

    this.setState(
      {
        engine: engine,
        scene: scene,
        camera: camera,
        hemisphericLight: hemisphericLight,
        spotLightFront: spotLightFront,
        spotLightLeft: spotLightLeft,
        spotLightRight: spotLightRight,
        spotLightLower: spotLightLower,
      },
      () => {
        this.loadObjects();
        this.bindEvents();
        this.state.engine.runRenderLoop(() => {
          this.state.scene.render();
        });
      }
    );
  }

  bindEvents = () => {
    if (!this.state.hasGyroscope) {
      // this.buttonGyroscope.style.display = 'none';
      window.addEventListener("mousemove", this.getMousePosition);
    } else {
      // this.buttonGyroscope.style.display = 'inline-block';
      // window.addEventListener("click", this.getMousePosition);
      window.addEventListener("click", this.getGyroscope);
    }

    if (window.DeviceOrientationEvent) {
      window.addEventListener(
        "deviceorientation",
        (e) => {
          this.getDevicePosition(Math.abs(e.beta), e.gamma);
        },
        true
      );
    } else if (window.DeviceMotionEvent) {
      window.addEventListener(
        "devicemotion",
        (e) => {
          // console.log(e.acceleration.x, e.acceleration.y);
          this.getDevicePosition(e.acceleration.x * 2, e.acceleration.y * 2);
        },
        true
      );
    }

    window.addEventListener("resize", this.onWindowResize);
  };

  onWindowResize = (e) => {
    const windowWidth = window.innerWidth;

    if (windowWidth < 768) {
      this.state.camera.position.z = 700;
    } else {
      this.state.camera.position.z = 500;
    }
  };

  getDevicePosition = (x, y) => {
    if (this.state.gyroscopeActive) {
      let relativeYPositionPercentage = (100 / 180) * (x - 30) * 2.6;
      relativeYPositionPercentage <= 0
        ? (relativeYPositionPercentage = 0)
        : null;
      relativeYPositionPercentage >= 100
        ? (relativeYPositionPercentage = 100)
        : null;

      let relativeXPositionPercentage = (100 / 180) * (y + 45) * 2.6;
      relativeXPositionPercentage <= 0
        ? (relativeXPositionPercentage = 0)
        : null;
      relativeXPositionPercentage >= 100
        ? (relativeXPositionPercentage = 100)
        : null;

      this.turnHead(relativeXPositionPercentage, relativeYPositionPercentage);
    }
  };

  getGyroscope = () => {
    let orientationPermission;

    if (DeviceOrientationEvent && DeviceOrientationEvent.requestPermission) {
      orientationPermission = DeviceOrientationEvent.requestPermission();
    } else {
      orientationPermission = true;
    }
    const gyroscopeActive = !this.gyroscopeActive;

    this.setState({
      gyroscopeActive: gyroscopeActive,
      orientationPermission: orientationPermission,
    });
  };

  getMousePosition = (e) => {
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    const mousePosXPercentage = (100 / windowWidth) * e.clientX;
    const mousePosYPercentage = (100 / windowHeight) * e.clientY;
    if (!this.state.gyroscopeActive && this.head) {
      this.turnHead(mousePosXPercentage, mousePosYPercentage);
    }
  };

  turnHead = (x, y) => {
    const head = this.head;
    let turnXHead, turnYHead;
    turnXHead = ((head.rangeRotationX / 100) * x + head.minRotationX) * -1;
    turnYHead = (head.rangeRotationY / 100) * y + head.minRotationY;
    head.rotation.x = turnYHead;
    head.rotation.y = turnXHead;

    const starePosition = 150;
    const animationLength = 5;
    const animationBox = new BABYLON.Animation(
      "headMoveAnimation",
      "position.z",
      60,
      BABYLON.Animation.ANIMATIONTYPE_FLOAT,
      BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT
    );
    const keys = [
      {
        frame: 0,
        value: 0,
      },
      {
        frame: animationLength,
        value: starePosition,
      },
    ];
    animationBox.setKeys(keys);
    head.animations.push(animationBox);

    const webcamFactor = -0.5;
    const mobileWebcamFactorX = -1;
    const mobileWebcamFactorY = -1.2;
    const stareFactor = -1.8;

    const eyeLeft = this.pivotEyeLeft;
    let turnXEyeLeftOrigin =
      ((eyeLeft.rangeRotationX / 100) * x + eyeLeft.minRotationX) * -1;
    let turnYEyeLeftOrigin =
      (eyeLeft.rangeRotationY / 100) * y + eyeLeft.minRotationY;
    let turnXEyeLeft = turnXEyeLeftOrigin;
    let turnYEyeLeft = turnYEyeLeftOrigin;

    this.webcamActive
      ? (turnXEyeLeft = turnXEyeLeftOrigin * webcamFactor)
      : null;
    this.webcamActive
      ? (turnYEyeLeft = turnYEyeLeftOrigin * webcamFactor)
      : null;
    this.state.stare ? (turnXEyeLeft = turnXEyeLeftOrigin * stareFactor) : null;
    this.state.stare ? (turnYEyeLeft = turnYEyeLeftOrigin * stareFactor) : null;
    this.webcamMobile
      ? (turnXEyeLeft = turnXEyeLeftOrigin * mobileWebcamFactorX)
      : null;
    this.webcamMobile
      ? (turnYEyeLeft = turnYEyeLeftOrigin * mobileWebcamFactorY)
      : null;
    eyeLeft.rotation.x = turnYEyeLeft;
    eyeLeft.rotation.y = turnXEyeLeft;

    const eyeRight = this.pivotEyeRight;
    let turnXEyeRightOrigin =
      ((eyeRight.rangeRotationX / 100) * x + eyeRight.minRotationX) * -1;
    let turnYEyeRightOrigin =
      (eyeRight.rangeRotationY / 100) * y + eyeRight.minRotationY;
    let turnXEyeRight = turnXEyeRightOrigin;
    let turnYEyeRight = turnYEyeRightOrigin;

    this.webcamActive
      ? (turnXEyeRight = turnXEyeRightOrigin * webcamFactor)
      : null;
    this.webcamActive
      ? (turnYEyeRight = turnYEyeRightOrigin * webcamFactor)
      : null;
    this.state.stare
      ? (turnXEyeRight = turnXEyeRightOrigin * stareFactor)
      : null;
    this.state.stare
      ? (turnYEyeRight = turnYEyeRightOrigin * stareFactor)
      : null;
    this.webcamMobile
      ? (turnXEyeRight = turnXEyeRightOrigin * mobileWebcamFactorX)
      : null;
    this.webcamMobile
      ? (turnYEyeRight = turnYEyeRightOrigin * mobileWebcamFactorY)
      : null;
    eyeRight.rotation.x = turnYEyeRight;
    eyeRight.rotation.y = turnXEyeRight;
  };

  loadObjects = () => {
    const _this = this;

    const assetsManager = new BABYLON.AssetsManager(this.state.scene);
    assetsManager.useDefaultLoadingScreen = false;

    const textureNormalTask = assetsManager.addTextureTask(
      "face normal",
      "../dist/obj/head3d.png"
    );
    textureNormalTask.onSuccess = function (task) {
      _this.normalTexture = task.texture;
    };

    const texturePsychoTask = assetsManager.addTextureTask(
      "face psycho",
      "../dist/obj/head3d_psycho.png"
    );
    texturePsychoTask.onSuccess = function (task) {
      _this.psychoTexture = task.texture;
    };

    const meshTask = assetsManager.addMeshTask(
      "mesh task",
      "",
      "../dist/obj/",
      "head3d.obj"
    );
    meshTask.onSuccess = function (task) {
      /*
            ---
            0 -> Head
            ---
            1 -> Eyeball right
            2 -> ?
            3 -> pupil right
            4 -> lens right
            ---
            5 -> Eyeball left
            6 -> ?
            7 -> pupil left
            8 -> lens left
            ---
            */

      // both eyeballs
      task.loadedMeshes[1].material.diffuseColor = new BABYLON.Color3(
        0.54,
        0.5,
        0.54
      );
      task.loadedMeshes[1].material.specularColor = new BABYLON.Color3(
        0.1,
        0.1,
        0.1
      );

      // both ???
      task.loadedMeshes[2].material.diffuseColor = new BABYLON.Color3(0.0, 0);
      task.loadedMeshes[2].material.specularColor = new BABYLON.Color3(0, 0, 0);

      // both irises
      const irisRight = task.loadedMeshes[3];
      irisRight.material.diffuseColor = new BABYLON.Color3(
        (1 / 255) * 45,
        (1 / 255) * 22.5,
        0
      );
      irisRight.material.specularColor = new BABYLON.Color3(0, 0, 0);

      // both lenses
      task.loadedMeshes[4].material.alpha = 0.2;
      task.loadedMeshes[4].material.diffuseColor = new BABYLON.Color3(1, 1, 1);
      task.loadedMeshes[4].material.specularColor = new BABYLON.Color3(1, 1, 1);

      // head
      const head = task.loadedMeshes[0];
      head.material.emissiveColor = new BABYLON.Color3(0, 0, 0);
      head.material.specularColor = new BABYLON.Color3(0, 0, 0);
      head.material.diffuseTexture.hasAlpha = true;
      head.material.backFaceCulling = false;

      head.maxRotationX = (Math.PI / 180) * 30;
      head.minRotationX = (Math.PI / 180) * -30;
      head.rangeRotationX = (Math.PI / 180) * 60;

      head.maxRotationY = (Math.PI / 180) * 45;
      head.minRotationY = (Math.PI / 180) * -45;
      head.rangeRotationY = (Math.PI / 180) * 90;

      const pivotEyeRight = new BABYLON.TransformNode("pivotEyeRight");
      pivotEyeRight.position = new BABYLON.Vector3(29.4, 27, 72.2);
      pivotEyeRight.parent = head;

      pivotEyeRight.maxRotationY = (Math.PI / 180) * 5;
      pivotEyeRight.minRotationY = (Math.PI / 180) * -5;
      pivotEyeRight.rangeRotationY = (Math.PI / 180) * 10;
      pivotEyeRight.maxRotationX = (Math.PI / 180) * 12.5;
      pivotEyeRight.minRotationX = (Math.PI / 180) * -12.5;
      pivotEyeRight.rangeRotationX = (Math.PI / 180) * 25;

      const pupilRight = new BABYLON.MeshBuilder.CreateSphere(
        "pupilRight",
        {
          diameter: 8,
          diameterY: 2,
          slice: 0.5,
        },
        _this.scene
      );
      pupilRight.parent = pivotEyeRight;
      pupilRight.position.z = 13;
      pupilRight.position.y = -3.5;
      pupilRight.position.x = 2;
      pupilRight.rotation.x = Math.PI / 2;

      const pupilRightMaterial = new BABYLON.StandardMaterial(
        "pupilRightMaterial",
        _this.scene
      );
      pupilRightMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
      pupilRightMaterial.specularColor = new BABYLON.Color3(0.1, 0.1, 0.1);
      pupilRightMaterial.backFaceCulling = false;
      pupilRight.material = pupilRightMaterial;

      task.loadedMeshes[1].parent = pivotEyeRight;
      task.loadedMeshes[2].parent = pivotEyeRight;
      task.loadedMeshes[3].parent = pivotEyeRight;
      task.loadedMeshes[4].parent = pivotEyeRight;

      const translateRight = new BABYLON.Vector3(-29.4, -27, -72.2);
      task.loadedMeshes[1].position = translateRight;
      task.loadedMeshes[2].position = translateRight;
      task.loadedMeshes[3].position = translateRight;
      task.loadedMeshes[4].position = translateRight;

      const pivotEyeLeft = new BABYLON.TransformNode("pivotEyeLeft");
      pivotEyeLeft.position = new BABYLON.Vector3(-29.4, 27, 72.2);
      pivotEyeLeft.parent = head;

      pivotEyeLeft.maxRotationY = (Math.PI / 180) * 10;
      pivotEyeLeft.minRotationY = (Math.PI / 180) * -10;
      pivotEyeLeft.rangeRotationY = (Math.PI / 180) * 20;
      pivotEyeLeft.maxRotationX = (Math.PI / 180) * 12.5;
      pivotEyeLeft.minRotationX = (Math.PI / 180) * -12.5;
      pivotEyeLeft.rangeRotationX = (Math.PI / 180) * 25;

      const pupilLeft = new BABYLON.MeshBuilder.CreateSphere(
        "pupilLeft",
        {
          diameter: 8,
          diameterY: 2,
          slice: 0.5,
        },
        _this.scene
      );
      pupilLeft.parent = pivotEyeLeft;
      pupilLeft.position.z = 13;
      pupilLeft.position.y = -3.5;
      pupilLeft.position.x = 0;
      pupilLeft.rotation.x = Math.PI / 2;

      const pupilLeftMaterial = new BABYLON.StandardMaterial(
        "pupilLeftMaterial",
        _this.scene
      );
      pupilLeftMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
      pupilLeftMaterial.specularColor = new BABYLON.Color3(0.1, 0.1, 0.1);
      pupilLeftMaterial.backFaceCulling = false;
      pupilLeft.material = pupilLeftMaterial;

      task.loadedMeshes[5].parent = pivotEyeLeft;
      task.loadedMeshes[6].parent = pivotEyeLeft;
      task.loadedMeshes[7].parent = pivotEyeLeft;
      task.loadedMeshes[8].parent = pivotEyeLeft;

      const translateLeft = new BABYLON.Vector3(29.4, -27, -72.2);
      task.loadedMeshes[5].position = translateLeft;
      task.loadedMeshes[6].position = translateLeft;
      task.loadedMeshes[7].position = translateLeft;
      task.loadedMeshes[8].position = translateLeft;

      head.actionManager = new BABYLON.ActionManager(_this.state.scene);
      head.actionManager.registerAction(
        new BABYLON.ExecuteCodeAction(
          {
            trigger: BABYLON.ActionManager.OnPickTrigger,
          },
          () => {
            _this.props.setPsychoMode();
            head.material.diffuseTexture = _this.props.psychoMode
              ? _this.psychoTexture
              : _this.normalTexture;
            irisRight.material.diffuseColor = _this.props.psychoMode
              ? new BABYLON.Color3(
                  (1 / 255) * 250,
                  (1 / 255) * 10,
                  (1 / 255) * 255
                )
              : new BABYLON.Color3((1 / 255) * 45, (1 / 255) * 22.5, 0);
            _this.setState({
              stare: !_this.state.stare,
            });
          }
        )
      );

      _this.head = head;
      _this.pivotEyeRight = pivotEyeRight;
      _this.pivotEyeLeft = pivotEyeLeft;

      _this.setState({
        headLoaded: true,
      });
    };
    meshTask.onError = function (task, message, exception) {
      console.log("error");
    };

    assetsManager.onFinish = (tasks) => {
      this.state.engine.runRenderLoop(() => {
        this.state.scene.render();
      });
    };

    window.setTimeout(() => {
      assetsManager.load();
    }, 1000);
  };

  render() {
    return (
      <Fragment>
        <canvas id="head" width="1500" height="1500"></canvas>
        {this.state.headLoaded ? null : <div className="head__loader"></div>}
      </Fragment>
    );
  }
}

export default Head;
