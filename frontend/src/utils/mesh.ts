import type { Group, Mesh, Object3D } from 'three';

export function isObjectPartOfMesh(
    mesh: Mesh | Group | Object3D,
    obj: Group | Mesh | Object3D,
): boolean {
    if (mesh.id === obj.id) {
        return true;
    }
    if (mesh.children) {
        for (let i = 0; i < mesh.children.length; i++) {
            const result = isObjectPartOfMesh(mesh.children[i], obj);
            if (result) {
                return true;
            }
        }
    }
    return false;
}

export function traversMeshChildren(
    mesh: Object3D,
    callback: (child: Object3D) => void,
) {
    callback(mesh);
    if (!mesh.children) {
        return;
    }
    for (let i = 0; i < mesh.children.length; i++) {
        traversMeshChildren(mesh.children[i], callback);
    }
}
