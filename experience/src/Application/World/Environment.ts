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
        this.scene.add(model);
    }

    update() {}
}
