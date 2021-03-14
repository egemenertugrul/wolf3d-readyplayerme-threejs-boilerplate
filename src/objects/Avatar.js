import {
  AnimationMixer,
  LoopRepeat,
  Object3D,
  Vector3
} from 'three'
import {
  preloader
} from '../loader'
import MorphTargetAnimator from '../helpers/MorphTargetAnimator';
import CursorTracker from '../helpers/CursorTracker';

export default class Avatar extends Object3D {
  constructor(renderer, avatarSettings) {
    super()
    this.renderer = renderer;
    
    this.isTrackCursor = avatarSettings.isTrackCursor;
    this.isAutoAnimated = avatarSettings.isAutoAnimated;
    this.isAutoMorphAnimated = avatarSettings.isAutoMorphAnimated;
    
    if (this.isTrackCursor === undefined) {
      this.isTrackCursor = true;
    }
    if (this.isAutoAnimated === undefined) {
      this.isAutoAnimated = true;
    }
    if (this.isAutoMorphAnimated === undefined) {
      this.isAutoMorphAnimated = true;
    }

    /* Set transformation */
    this.position.set(0, 0, 0);

    /* Load avatar model */
    this.mixer = new AnimationMixer(this.model);
    this.mixer.timeScale = 0.5; // Half-speed animations (not morph animations)

    this.avatar = preloader.get('avatar');
    this.model = this.avatar.scene;

    this.headMesh = this.model.getObjectByName("Wolf3D_Head");

    this.headBone = this.model.getObjectByName("Head");
    this.leftEyeBone = this.model.getObjectByName("LeftEye");
    this.rightEyeBone = this.model.getObjectByName("RightEye");

    /*
      Set morph target animations
      To see available morph targets and animations, upload your avatar to: https://gltf-viewer.donmccurdy.com/
     */
    this.morphTargetAnimator = new MorphTargetAnimator(this.headMesh, this.isAutoMorphAnimated);
    
    if(avatarSettings.morphTargets !== undefined){
          this.morphTargetAnimator.addRange(avatarSettings.morphTargets);
    }

    /* 
    Animations 
    To see available morph targets and animations, upload your avatar to: https://gltf-viewer.donmccurdy.com/
    */
    this.mixer = new AnimationMixer(this.model);
    this.mixer.timeScale = 0.5; // Half-speed animations (not morph animations)

    if(avatarSettings.defaultAnimation !== undefined){
      this.animationClip = this.findAnimation(avatarSettings.defaultAnimation);
    } else {
      this.animationClip = this.findAnimation("idle_eyes");
    }
    
    if(this.isAutoAnimated){
      let anim = this.mixer.clipAction(this.animationClip).reset().play();
      anim.setLoop(LoopRepeat);
    }

    if (this.isTrackCursor) {
      /* Cursor tracking setup */
      const ct = new CursorTracker(this.renderer.domElement);
      ct.addEventListener('deltaToMouse', (deltaToMouse) => {
        let deltaToMouseData = deltaToMouse.data.clampScalar(-0.65, 0.65);
        this.deltaToMouseRotation = new Vector3(-deltaToMouseData.y, deltaToMouseData.x, 0);
      })
    }

    this.add(this.model);
  }

  findAnimation(name){
    return this.avatar.animations.find(anim => {
      return anim.name === name
    });
  }

  rotateHead() {
    if (!this.deltaToMouseRotation) {
      return;
    }
    this.headBone.rotation.set(this.deltaToMouseRotation.x, this.deltaToMouseRotation.y, 0);
  }

  update(scene, camera, renderer, delta) {
    this.rotateHead();
    this.mixer.update(delta);
  }
}