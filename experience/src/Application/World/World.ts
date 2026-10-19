import * as THREE from 'three';
import Application from '../Application';
import { DeskKeyframe, IdleKeyframe } from '../Camera/CameraKeyframes';
import Resources from '../Utils/Resources';
import ComputerSetup from './Computer';
import MonitorScreen from './MonitorScreen';
import Environment from './Environment';
import Decor from './Decor';
import CoffeeSteam from './CoffeeSteam';
import Cursor from './Cursor';
import Hitboxes from './Hitboxes';
import DeskPeripherals from './DeskPeripherals';
import ResumePaper from './ResumePaper';
import CubeRobot from './CubeRobot';
import PortfolioMonitor from './PortfolioMonitor';
import WorkshopProject from './WorkshopProject';
import tennisRacket from './TennisRacket';
import { workshopLayout } from './WorkshopLayout';
import { frcProject, rcProject, elevatorProject, dirtbikeProject, tennisProject } from '../../workshop-projects';
import { CameraKey } from '../Camera/Camera';
export default class World {
    application: Application;
    scene: THREE.Scene;
    resources: Resources;

    // Objects in the scene
    environment: Environment;
    decor: Decor;
    computerSetup: ComputerSetup;
    monitorScreen: MonitorScreen;
    coffeeSteam: CoffeeSteam;
    cursor: Cursor;
    peripherals: DeskPeripherals;
    resumePaper: ResumePaper;
    cubeRobot: CubeRobot;
    portfolioMonitor: PortfolioMonitor;
    projects: WorkshopProject[] = [];

    constructor() {
        this.application = new Application();
        this.scene = this.application.scene;
        this.resources = this.application.resources;
        // Wait for resources
        this.resources.on('ready', () => {
            // Setup
            this.environment = new Environment();
            const bounds = new THREE.Box3();
            this.environment.bakedModel.getModel().children.forEach(part => {
                if (part.name !== 'Background') bounds.union(new THREE.Box3().setFromObject(part));
            });
            (this.application.camera.keyframes.desk as DeskKeyframe).setBounds(bounds);
            (this.application.camera.keyframes.idle as IdleKeyframe).setBounds(bounds);
            // Prepare the rotating desk view while the loading screen/door still covers it.
            this.resumePaper = new ResumePaper();
            this.cubeRobot = new CubeRobot();
            this.portfolioMonitor = new PortfolioMonitor();
            this.peripherals = new DeskPeripherals();
            this.projects = [
                new WorkshopProject('frcRobotModel', frcProject, workshopLayout.frcRobot, 'frc-robot-access'),
                new WorkshopProject('rcCarModel', rcProject, workshopLayout.rcCar, 'rc-car-access'),
                new WorkshopProject('frcElevatorModel', elevatorProject, workshopLayout.elevatorRobot, 'frc-elevator-access'),
                new WorkshopProject(tennisRacket(this.resources.items.gltfModel.tennisBladeModel.scene, this.resources.items.gltfModel.tennisWilsonModel.scene), tennisProject, workshopLayout.tennisRacket, 'tennis-racket-access'),
                new WorkshopProject('dirtbikeModel', dirtbikeProject, workshopLayout.dirtbike, 'dirtbike-access'),
            ];
            // Frame the complete workshop so floor projects remain discoverable on phones.
            bounds.union(new THREE.Box3().setFromObject(this.cubeRobot.group));
            bounds.union(new THREE.Box3().setFromObject(this.portfolioMonitor.group));
            this.projects.forEach(project => bounds.union(new THREE.Box3().setFromObject(project.group)));
            (this.application.camera.keyframes.desk as DeskKeyframe).setBounds(bounds);
            (this.application.camera.keyframes.idle as IdleKeyframe).setBounds(bounds);
            this.application.camera.transition(CameraKey.IDLE, 0);
            // const hb = new Hitboxes();
            // this.cursor = new Cursor();
        });
    }

    update() {
        if (this.resumePaper) this.resumePaper.update();
        if (this.cubeRobot) this.cubeRobot.update();
        this.projects.forEach(project => project.update());
        if (this.portfolioMonitor) this.portfolioMonitor.update();
        if (this.monitorScreen) this.monitorScreen.update();
        if (this.environment) this.environment.update();
        if (this.coffeeSteam) this.coffeeSteam.update();
    }
}
