"use client";
import { useEffect, useRef, useState } from "react";
import * as CANNON from "cannon";

export default function DiceRoller({ sides = 20, onResult }) {
  const mountRef = useRef(null);
  const [rolling, setRolling] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return; // SSR guard

    let scene, camera, renderer, world, dice, animationId;
    let DiceManager;

    (async () => {
      // dynamic imports so they only run in the browser
      const THREE = (await import("three")).default ?? (await import("three"));
    //   const CANNON = (await import("cannon-es")).default ?? (await import("cannon-es"));
      const CANNON = (await import("cannon")).default ?? (await import("cannon"));
      const diceLib = await import("threejs-dice");
      DiceManager = diceLib.DiceManager;
      const { DiceD20 } = diceLib;

      // --- THREE scene
      scene = new THREE.Scene();
      camera = new THREE.PerspectiveCamera(45, 1, 0.1, 1000);
      camera.position.set(0, 12, 24);
      camera.lookAt(0, 0, 0);

      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setSize(320, 320);
      mountRef.current.appendChild(renderer.domElement);

      // --- CANNON world
      world = new CANNON.World();
      world.gravity.set(0, -9.82, 0);

      // --- SHIMS for compatibility with libraries expecting older cannon API
      // threejs-dice (and other libs) sometimes call world.add(...) or world.remove(...)
      // cannon-es uses world.addBody / world.removeBody — create aliases.
      if (typeof world.add !== "function" && typeof world.addBody === "function") {
        world.add = world.addBody.bind(world);
      }
      if (typeof world.remove !== "function" && typeof world.removeBody === "function") {
        world.remove = world.removeBody.bind(world);
      }

      // Now set world into DiceManager (library expects this)
      DiceManager.setWorld(world);

      // ground plane
      const groundBody = new CANNON.Body({ mass: 0 });
      const groundShape = new CANNON.Plane();
      groundBody.addShape(groundShape);
      // orient plane so Y is up
      groundBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0);
      world.addBody(groundBody);

      // light
      const light = new THREE.DirectionalLight(0xffffff, 1);
      light.position.set(10, 20, 10);
      scene.add(light);
      scene.add(new THREE.AmbientLight(0x888888));

      // --- create dice (D20)
      dice = new DiceD20({ size: 2, fontColor: "#000" });

      // some versions expose mesh vs object; try to add mesh if present
      if (dice.mesh) scene.add(dice.mesh);
      else if (dice.object) scene.add(dice.object);
      else scene.add(dice);

      // add dice body to physics
      if (dice.body) world.addBody(dice.body);
      // some internals require DiceManager to manage dice list — it's already done by setWorld

      // animation loop
      const animate = () => {
        world.step(1 / 60);
        try {
          // library helper to sync mesh and body if present
          if (typeof dice.updateMeshFromBody === "function") {
            dice.updateMeshFromBody();
          } else if (dice.mesh && dice.body) {
            // fallback: copy position/quaternion
            dice.mesh.position.copy(dice.body.position);
            dice.mesh.quaternion.copy(dice.body.quaternion);
          }
        } catch (e) {
          // ignore transient errors during cleanup
        }
        renderer.render(scene, camera);
        animationId = requestAnimationFrame(animate);
      };
      animate();

      // store refs
      mountRef.current.__three = { scene, camera, renderer, world, dice, DiceManager };
      setReady(true);
    })();

    return () => {
      // cleanup
      cancelAnimationFrame(animationId);
      try {
        const r = mountRef.current.__three;
        if (r?.renderer) {
          r.renderer.dispose();
          mountRef.current.removeChild(r.renderer.domElement);
        }
      } catch (e) {}
      mountRef.current.__three = null;
    };
  }, []);

  const rollDice = () => {
    if (!ready) return;
    setRolling(true);

    const { world, dice } = mountRef.current.__three;

    // random linear + angular velocity
    if (dice?.body) {
      const v = new (world?.constructor?.Vec3 || (function(){}) )(); // not used if not present
      // set velocity/angVel using cannon-es Vec3
      try {
        dice.body.velocity.set(Math.random() * 6 - 3, 14 + Math.random() * 6, Math.random() * 6 - 3);
        dice.body.angularVelocity.set(
          Math.random() * 10 - 5,
          Math.random() * 10 - 5,
          Math.random() * 10 - 5
        );
      } catch (e) {
        // if body manipulation fails, ignore (still safe fallback)
      }
    }

    // wait for dice to settle, then read value
    // NOTE: reading exact face reliably requires the library's helper (dice.getValue()).
    // We'll attempt to use it; if not present, fall back to a random result.
    const settleMs = 2200;
    setTimeout(() => {
      let result;
      try {
        if (dice && typeof dice.getValue === "function") {
          result = dice.getValue();
        } else if (dice && typeof dice.value === "number") {
          result = dice.value;
        } else {
          // fallback — random result if library doesn't expose value
          result = Math.floor(Math.random() * sides) + 1;
        }
      } catch (e) {
        result = Math.floor(Math.random() * sides) + 1;
      }

      setRolling(false);
      if (onResult) onResult(result);
    }, settleMs);
  };

  return (
    <div className="flex flex-col items-center">
      <div ref={mountRef} style={{ width: 320, height: 320 }} />
      <button
        className="mt-2 bg-blue-600 text-white px-4 py-2 rounded"
        onClick={rollDice}
        disabled={rolling || !ready}
      >
        {rolling ? "Rolling..." : `Roll d${sides}`}
      </button>
    </div>
  );
}
