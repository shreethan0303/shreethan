import * as THREE from 'three';
import Application from '../Application';
import BakedModel from '../Utils/BakedModel';
import Resources from '../Utils/Resources';

export default class Environment {
    application: Application;
    scene: THREE.Scene;
    resources: Resources;
    bakedModel: BakedModel;

    constructor() {
        this.application = new Application();
        this.scene = this.application.scene;
        this.resources = this.application.resources;

        this.bakeModel();
        this.setModel();
    }

    bakeModel() {
        this.bakedModel = new BakedModel(
            this.resources.items.gltfModel.environmentModel,
            this.resources.items.texture.environmentTexture,
            900
        );
    }

    setModel() {
        const model = this.bakedModel.getModel();
        // Match the reference desk's darker charcoal-brown surface after clearing its bake.
        const tabletop = model.getObjectByName('Tabletop') as THREE.Mesh;
        if (tabletop) {
            const material = this.bakedModel.material.clone();
            material.color.setRGB(.36, .36, .36);
            tabletop.material = material;
        }
        this.extendBackdrop(model);
        this.scene.add(model);
    }

    /** Keep the original baked floor under the workshop; remove the finite
     * curved walls and blend its outer edge into a much larger matching floor. */
    extendBackdrop(model: THREE.Group) {
        const background = model.getObjectByName('Background') as THREE.Mesh;
        const geometry = background.geometry.clone();
        const position = geometry.getAttribute('position');
        geometry.computeBoundingBox();
        const floorY = geometry.boundingBox!.min.y;
        const source = geometry.index;
        const floor: number[] = [];
        for (let i = 0; i < (source ? source.count : position.count); i += 3) {
            const indices = [0, 1, 2].map(offset => source ? source.getX(i + offset) : i + offset);
            if (indices.every(index => Math.abs(position.getY(index) - floorY) < .00001)) floor.push(...indices);
        }
        geometry.setIndex(floor);
        background.geometry = geometry;
        background.updateWorldMatrix(true, false);

        // Sample an unoccupied floor point from its actual baked texture.
        const probe = new THREE.Vector3(16, floorY, 0).applyMatrix4(background.matrixWorld);
        const ray = new THREE.Raycaster(probe.clone().add(new THREE.Vector3(0, 1000, 0)), new THREE.Vector3(0, -1, 0));
        const uv = ray.intersectObject(background)[0].uv!;
        const image = this.bakedModel.texture.image as HTMLImageElement;
        const canvas = document.createElement('canvas'); canvas.width = canvas.height = 1;
        const context = canvas.getContext('2d')!;
        context.drawImage(image, Math.min(image.width - 1, Math.floor(uv.x * image.width)),
            Math.min(image.height - 1, Math.floor(uv.y * image.height)), 1, 1, 0, 0, 1, 1);
        const pixel = context.getImageData(0, 0, 1, 1).data;
        const color = new THREE.Color(pixel[0] / 255, pixel[1] / 255, pixel[2] / 255).convertSRGBToLinear();
        // Free orbit can see above the floor's horizon. Render those rays in
        // the same color as its outer edge instead of exposing the white page.
        // Three r137 clears a Color background directly in output color space.
        this.scene.background = color.clone().convertLinearToSRGB();
        const material = this.bakedModel.material.clone();
        material.onBeforeCompile = shader => {
            shader.uniforms.backdropColor = { value: color };
            shader.vertexShader = 'varying vec2 backdropPosition;\n' + shader.vertexShader;
            shader.vertexShader = shader.vertexShader.replace('#include <begin_vertex>',
                '#include <begin_vertex>\nbackdropPosition = position.xz;');
            shader.fragmentShader = 'uniform vec3 backdropColor;\nvarying vec2 backdropPosition;\n' + shader.fragmentShader;
            shader.fragmentShader = shader.fragmentShader.replace('#include <map_fragment>',
                '#include <map_fragment>\nfloat edge = smoothstep(15.0, 19.5, max(abs(backdropPosition.x), abs(backdropPosition.y)));\ndiffuseColor.rgb = mix(diffuseColor.rgb, backdropColor, edge);');
        };
        background.material = material;
        // A ring, not an overlapping plane: distant depth precision otherwise
        // makes the two nearly coplanar floors alternate visibly during orbit.
        const outer = new THREE.Shape();
        outer.moveTo(-1000000, -1000000); outer.lineTo(1000000, -1000000);
        outer.lineTo(1000000, 1000000); outer.lineTo(-1000000, 1000000); outer.closePath();
        const xs = floor.map(index => position.getX(index) * background.scale.x);
        const zs = floor.map(index => position.getZ(index) * background.scale.z);
        const hole = new THREE.Path();
        hole.moveTo(Math.min(...xs), -Math.max(...zs)); hole.lineTo(Math.min(...xs), -Math.min(...zs));
        hole.lineTo(Math.max(...xs), -Math.min(...zs)); hole.lineTo(Math.max(...xs), -Math.max(...zs)); hole.closePath();
        outer.holes.push(hole);
        const extension = new THREE.Mesh(new THREE.ShapeGeometry(outer), new THREE.MeshBasicMaterial({ color }));
        extension.name = 'BackdropExtension';
        extension.rotation.x = -Math.PI / 2;
        extension.position.y = probe.y;
        this.scene.add(extension);
    }

    update() {}
}
