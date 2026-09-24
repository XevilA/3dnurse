#!/bin/bash
# ============================================================
# 3D Model Downloader for Postpartum & Newborn Care Metaverse
# Downloads real GLB models from free sources (CC0/CC-BY)
# ============================================================

set -e
MODELS_DIR="/Volumes/MAC/3DNURSE/public/models"
ROOMS_DIR="$MODELS_DIR/rooms"
mkdir -p "$MODELS_DIR" "$ROOMS_DIR"

echo "🏥 3DNURSE Model Downloader"
echo "==========================="
echo ""

# ── 1. Furniture from Poly Haven (CC0) ──
# Poly Haven GLB download URL pattern:
# https://dl.polyhaven.org/file/ph-assets/Models/gltf/{name}/{name}_1k.gltf.zip
# OR for GLB: we use their direct API

echo "📥 Downloading Arm Chair (nursing chair)..."
curl -L -o "$MODELS_DIR/armchair.glb" \
  "https://dl.polyhaven.org/file/ph-assets/Models/glb/ArmChair_01/ArmChair_01.glb" 2>/dev/null || \
curl -L -o "$MODELS_DIR/armchair.glb" \
  "https://dl.polyhaven.org/file/ph-assets/Models/gltf/ArmChair_01/ArmChair_01_1k.gltf/ArmChair_01_1k.glb" 2>/dev/null || \
echo "  ⚠️  Armchair direct link failed, trying alternative..."

echo "📥 Downloading Rocking Chair (nursing chair alternative)..."
curl -L -o "$MODELS_DIR/rocking_chair.glb" \
  "https://dl.polyhaven.org/file/ph-assets/Models/glb/Rockingchair_01/Rockingchair_01.glb" 2>/dev/null || \
echo "  ⚠️  Rocking chair direct link failed"

echo "📥 Downloading Sofa..."
curl -L -o "$MODELS_DIR/sofa.glb" \
  "https://dl.polyhaven.org/file/ph-assets/Models/glb/Sofa_01/Sofa_01.glb" 2>/dev/null || \
echo "  ⚠️  Sofa direct link failed"

echo "📥 Downloading Gothic Bed (hospital bed alternative)..."
curl -L -o "$MODELS_DIR/bed.glb" \
  "https://dl.polyhaven.org/file/ph-assets/Models/glb/GothicBed_01/GothicBed_01.glb" 2>/dev/null || \
echo "  ⚠️  Bed direct link failed"

echo "📥 Downloading Wooden Table..."
curl -L -o "$MODELS_DIR/table.glb" \
  "https://dl.polyhaven.org/file/ph-assets/Models/glb/WoodenTable_01/WoodenTable_01.glb" 2>/dev/null || \
echo "  ⚠️  Table direct link failed"

echo "📥 Downloading Shelf..."
curl -L -o "$MODELS_DIR/shelf.glb" \
  "https://dl.polyhaven.org/file/ph-assets/Models/glb/Shelf_01/Shelf_01.glb" 2>/dev/null || \
echo "  ⚠️  Shelf direct link failed"

echo "📥 Downloading Cabinet..."
curl -L -o "$MODELS_DIR/cabinet.glb" \
  "https://dl.polyhaven.org/file/ph-assets/Models/glb/GothicCabinet_01/GothicCabinet_01.glb" 2>/dev/null || \
echo "  ⚠️  Cabinet direct link failed"

# ── 2. Character from Mixamo/ReadyPlayerMe ──
# Ready Player Me public demo avatars
echo ""
echo "📥 Downloading Female Avatar (Ready Player Me demo)..."
curl -L -o "$MODELS_DIR/mother.glb" \
  "https://models.readyplayer.me/64bfa15f0e72c63d7c3934a6.glb?morphTargets=ARKit&textureAtlas=none&lod=1" 2>/dev/null || \
curl -L -o "$MODELS_DIR/mother.glb" \
  "https://models.readyplayer.me/6478e1e36a3c1b8e7e65bcc2.glb?morphTargets=ARKit&textureAtlas=none&lod=1" 2>/dev/null || \
echo "  ⚠️  RPM avatar link failed (create your own at readyplayer.me)"

# ── 3. Animated character from Three.js/Mixamo samples ──
echo "📥 Downloading Animated Character (Mixamo Xbot)..."
curl -L -o "$MODELS_DIR/xbot.glb" \
  "https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/models/gltf/Xbot.glb" 2>/dev/null || \
echo "  ⚠️  Xbot link failed"

# ── 4. Baby model — using small sphere placeholder, link to search ──  
echo ""
echo "📥 Downloading Baby model..."
curl -L -o "$MODELS_DIR/baby.glb" \
  "https://raw.githubusercontent.com/AaronClaworthy/glb-models/main/baby.glb" 2>/dev/null || \
echo "  ℹ️  No direct baby GLB available. Search Sketchfab: https://sketchfab.com/search?q=baby&downloadable=true"

# ── 5. KhronosGroup sample assets (useful for testing) ──
echo "📥 Downloading test models (Khronos samples)..."
curl -L -o "$MODELS_DIR/suzanne.glb" \
  "https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/Suzanne/glTF-Binary/Suzanne.glb" 2>/dev/null || \
echo "  ⚠️  Suzanne link failed"

# ── Summary ──
echo ""
echo "============================================"
echo "✅ Download complete! Files in $MODELS_DIR:"
echo "============================================"
ls -lh "$MODELS_DIR"/*.glb 2>/dev/null || echo "  No GLB files found"
echo ""
echo "📋 Next steps:"
echo "  1. Visit https://readyplayer.me to create your custom mother avatar"
echo "  2. Visit https://sketchfab.com/search?q=baby&downloadable=true for baby model"  
echo "  3. Visit https://www.mixamo.com for character animations"
echo "  4. Visit https://polyhaven.com/models for more furniture"
echo ""
echo "🔗 Poly Haven ZIP downloads (manual, higher quality):"
echo "  Arm Chair:     https://polyhaven.com/a/ArmChair_01"
echo "  Rocking Chair: https://polyhaven.com/a/Rockingchair_01"  
echo "  Bed:           https://polyhaven.com/a/GothicBed_01"
echo "  Sofa:          https://polyhaven.com/a/Sofa_01"
echo "  Cabinet:       https://polyhaven.com/a/GothicCabinet_01"
