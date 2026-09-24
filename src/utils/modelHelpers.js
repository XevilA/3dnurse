import * as THREE from 'three';

/**
 * Traverses a model to find a bone/object by name
 */
export const findBoneByName = (model, boneName) => {
  let targetBone = null;
  if (!model) return null;
  
  model.traverse((child) => {
    if (child.isBone && child.name.includes(boneName)) {
      targetBone = child;
    }
  });
  return targetBone;
};

/**
 * Swaps material on specific mesh nodes
 */
export const swapMaterial = (model, meshName, newMaterial) => {
  if (!model || !newMaterial) return;
  
  model.traverse((child) => {
    if (child.isMesh && child.name.includes(meshName)) {
      child.material = newMaterial;
      child.material.needsUpdate = true;
    }
  });
};

/**
 * Creates predefined material presets for clothing
 */
export const createClothingMaterials = () => {
  return {
    hospitalGown: new THREE.MeshStandardMaterial({ 
      color: '#add8e6', 
      roughness: 0.8,
      name: 'mat_hospitalGown' 
    }),
    casual: new THREE.MeshStandardMaterial({ 
      color: '#ffb6c1', 
      roughness: 0.9,
      name: 'mat_casual' 
    }),
    sleepwear: new THREE.MeshStandardMaterial({ 
      color: '#e6e6fa', 
      roughness: 1.0,
      name: 'mat_sleepwear' 
    })
  };
};

/**
 * Attaches a child object to a parent's bone, maintaining local transforms
 */
export const attachToBone = (child, parentBone, boneName = null, offset = [0, 0, 0]) => {
  if (!child) return;
  
  let target = parentBone;
  if (boneName && parentBone) {
     target = findBoneByName(parentBone, boneName);
  }

  if (target) {
    target.add(child);
    child.position.set(offset[0], offset[1], offset[2]);
    // Reset rotation and scale relative to the bone
    child.rotation.set(0, 0, 0);
    child.scale.set(1, 1, 1);
  } else {
    console.warn(`Could not attach to bone. Target not found.`);
  }
};

/**
 * Detaches child from bone and returns it to scene root
 */
export const detachFromBone = (child, scene) => {
  if (child && scene) {
    scene.attach(child); // THREE.Scene.attach preserves world transform
  }
};
