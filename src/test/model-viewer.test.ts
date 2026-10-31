import { describe, it, expect } from "vitest";
import * as THREE from "three";

describe("Three.js dependency alignment", () => {
  it("loads three.js version compatible with @google/model-viewer peer dependency", () => {
    expect(THREE.REVISION).toBe("163");
  });

  it("can construct Three.js primitives without errors", () => {
    const scene = new THREE.Scene();
    const geom = new THREE.BoxGeometry(1, 1, 1);
    const mat = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    const mesh = new THREE.Mesh(geom, mat);
    scene.add(mesh);
    expect(scene.children.length).toBe(1);
  });
});
