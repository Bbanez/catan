import {
    type Object3D,
    type PerspectiveCamera,
    Raycaster,
    Vector2,
    Vector3,
} from 'three';

export class Ray {
    private static ray = new Raycaster();

    static fromCamera(
        mouseX: number,
        mouseY: number,
        camera: PerspectiveCamera,
        mesh: Object3D,
    ) {
        const pointer = {
            x: mouseX,
            y: mouseY,
        };
        pointer.x = (pointer.x / window.innerWidth) * 2 - 1;
        pointer.y = -(pointer.y / window.innerHeight) * 2 + 1;
        this.ray.setFromCamera(new Vector2(pointer.x, pointer.y), camera);
        return this.ray.intersectObject(mesh);
    }

    static heightOf(x: number, y: number, mesh: Object3D) {
        if (!mesh) {
            return 0;
        }
        this.ray.set(new Vector3(x, 1000, y), new Vector3(0, -1, 0));
        const intersect = this.ray.intersectObject(mesh, true);
        if (intersect[0]) {
            return intersect[0].point.y;
        }
        console.warn(
            Error(
                'No intersection at position' +
                    ` x=${x}, z=${y} with the ${mesh.name}.`,
            ),
        );
    }
}
