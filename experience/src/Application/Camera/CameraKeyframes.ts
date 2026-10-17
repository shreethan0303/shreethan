import * as THREE from 'three';
import { CameraKey } from './Camera';
import Time from '../Utils/Time';
import Application from '../Application';
import Sizes from '../Utils/Sizes';
import { workshopLayout } from '../World/WorkshopLayout';

export class CameraKeyframeInstance {
    position: THREE.Vector3;
    focalPoint: THREE.Vector3;

    constructor(keyframe: CameraKeyframe) {
        this.position = keyframe.position;
        this.focalPoint = keyframe.focalPoint;
    }

    update() {}
}

const keys: { [key in CameraKey]: CameraKeyframe } = {
    idle: {
        position: new THREE.Vector3(-20000, 12000, 20000),
        focalPoint: new THREE.Vector3(0, -1000, 0),
    },
    monitor: {
        position: new THREE.Vector3(0, 950, 2000),
        focalPoint: new THREE.Vector3(0, 950, 0),
    },
    project: { position: new THREE.Vector3(), focalPoint: new THREE.Vector3() },
    desk: {
        position: new THREE.Vector3(0, 1800, 5500),
        focalPoint: new THREE.Vector3(0, 500, 0),
    },
    loading: {
        position: new THREE.Vector3(-35000, 35000, 35000),
        focalPoint: new THREE.Vector3(0, -5000, 0),
    },
    orbitControlsStart: {
        position: new THREE.Vector3(-15000, 10000, 15000),
        focalPoint: new THREE.Vector3(-100, 350, 0),
    },
};

export class MonitorKeyframe extends CameraKeyframeInstance {
    application: Application;
    sizes: Sizes;
    targetPos: THREE.Vector3;
    origin: THREE.Vector3;

    constructor() {
        const keyframe = keys.monitor;
        super(keyframe);
        this.application = new Application();
        this.sizes = this.application.sizes;
        this.origin = new THREE.Vector3().copy(keyframe.position);
        this.targetPos = new THREE.Vector3().copy(keyframe.position);
    }

    update() {
        const aspect = this.sizes.height / this.sizes.width;
        const additionalZoom = this.sizes.width < 768 ? 0 : 600;
        this.targetPos.z = this.origin.z + aspect * 1200 - additionalZoom;
        this.position.copy(this.targetPos);
    }
}

export class LoadingKeyframe extends CameraKeyframeInstance {
    constructor() {
        const keyframe = keys.loading;
        super(keyframe);
    }

    update() {}
}

/** Fit a bounding box into the camera's perspective with consistent screen margins. */
function frameBounds(bounds: THREE.Box3, direction: THREE.Vector3, sizes: Sizes, fill: number) {
    const center = bounds.getCenter(new THREE.Vector3());
    const view = new THREE.PerspectiveCamera(35, sizes.width / sizes.height);
    view.position.copy(center).add(direction.clone().normalize());
    view.lookAt(center);
    const inverse = view.quaternion.clone().invert();
    const tangent = Math.tan(THREE.MathUtils.degToRad(35 / 2));
    let distance = 0;
    for (const x of [bounds.min.x, bounds.max.x]) {
        for (const y of [bounds.min.y, bounds.max.y]) {
            for (const z of [bounds.min.z, bounds.max.z]) {
                const corner = new THREE.Vector3(x, y, z).sub(center).applyQuaternion(inverse);
                distance = Math.max(distance,
                    corner.z + Math.abs(corner.x) / (tangent * view.aspect * fill),
                    corner.z + Math.abs(corner.y) / (tangent * fill));
            }
        }
    }
    return { center, position: center.clone().addScaledVector(direction.clone().normalize(), distance) };
}

export class DeskKeyframe extends CameraKeyframeInstance {
    sizes: Sizes;
    bounds?: THREE.Box3;

    constructor() {
        super(keys.desk);
        this.sizes = new Application().sizes;
    }

    setBounds(bounds: THREE.Box3) {
        this.bounds = bounds.clone();
        this.update();
    }

    update() {
        if (!this.bounds) return;
        const view = workshopLayout.deskView;
        const frame = frameBounds(this.bounds, new THREE.Vector3().fromArray(view.direction), this.sizes, view.fill);
        const offset = new THREE.Vector3().fromArray(view.targetOffset);
        this.position.copy(frame.position).add(offset);
        this.focalPoint.copy(frame.center).add(offset);
    }
}

export class IdleKeyframe extends CameraKeyframeInstance {
    time: Time;
    sizes: Sizes;
    bounds?: THREE.Box3;

    constructor() {
        super(keys.idle);
        this.time = new Time();
        this.sizes = new Application().sizes;
    }

    setBounds(bounds: THREE.Box3) {
        this.bounds = bounds.clone();
        this.update();
    }

    update() {
        if (!this.bounds) return;
        const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const orbit = reduced ? -1 : -Math.sin((this.time.elapsed + 19000) * .00008);
        const frame = frameBounds(this.bounds, new THREE.Vector3(orbit, .65, 1), this.sizes, .30);
        this.position.copy(frame.position);
        this.focalPoint.copy(frame.center);
    }
}

export class OrbitControlsStart extends CameraKeyframeInstance {
    constructor() {
        const keyframe = keys.orbitControlsStart;
        super(keyframe);
    }

    update() {}
}

/** Fit only the selected project; this never changes the authored desk/overview. */
export class ProjectKeyframe extends CameraKeyframeInstance {
    sizes = new Application().sizes;
    bounds?: THREE.Box3;
    constructor() { super(keys.project); }
    setBounds(bounds: THREE.Box3) { this.bounds = bounds.clone(); this.update(); }
    update() {
        if (!this.bounds) return;
        const frame = frameBounds(this.bounds,
            new THREE.Vector3().fromArray(workshopLayout.deskView.direction), this.sizes, .48);
        this.position.copy(frame.position);
        this.focalPoint.copy(frame.center);
    }
}
