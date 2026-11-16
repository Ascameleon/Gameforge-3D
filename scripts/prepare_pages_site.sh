#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
DEST="${1:-site}"
if [[ "$DEST" != /* ]]; then
  DEST="$ROOT/$DEST"
fi
VERSION="0.160.1"
WORK="$(mktemp -d)"
trap 'rm -rf "$WORK"' EXIT

mkdir -p \
  "$DEST/vendor/three/build" \
  "$DEST/vendor/three/examples/jsm/controls" \
  "$DEST/vendor/three/examples/jsm/exporters" \
  "$DEST/vendor/three/examples/jsm/utils"

cp "$ROOT/index.html" "$DEST/index.html"
npm pack "three@$VERSION" --ignore-scripts --silent --pack-destination "$WORK" >/dev/null
tar -xzf "$WORK/three-$VERSION.tgz" -C "$WORK"
PACKAGE="$WORK/package"

PACKAGE_VERSION="$(node -p "require('$WORK/package/package.json').version")"
PACKAGE_LICENSE="$(node -p "require('$WORK/package/package.json').license")"
test "$PACKAGE_VERSION" = "$VERSION"
test "$PACKAGE_LICENSE" = "MIT"

cp "$PACKAGE/build/three.module.js" "$DEST/vendor/three/build/three.module.js"
cp "$PACKAGE/examples/jsm/controls/OrbitControls.js" "$DEST/vendor/three/examples/jsm/controls/OrbitControls.js"
cp "$PACKAGE/examples/jsm/exporters/GLTFExporter.js" "$DEST/vendor/three/examples/jsm/exporters/GLTFExporter.js"
cp "$PACKAGE/examples/jsm/utils/TextureUtils.js" "$DEST/vendor/three/examples/jsm/utils/TextureUtils.js"
cp "$PACKAGE/LICENSE" "$DEST/vendor/three/LICENSE"
printf 'Three.js %s\nSource: https://www.npmjs.com/package/three/v/%s\nLicense: MIT (see LICENSE)\n' "$VERSION" "$VERSION" > "$DEST/vendor/three/THREE-VERSION.txt"

test -s "$DEST/vendor/three/build/three.module.js"
test -s "$DEST/vendor/three/examples/jsm/controls/OrbitControls.js"
test -s "$DEST/vendor/three/examples/jsm/exporters/GLTFExporter.js"
test -s "$DEST/vendor/three/examples/jsm/utils/TextureUtils.js"
test -s "$DEST/vendor/three/LICENSE"
echo "PASS: staged Three.js $VERSION and required add-ons with MIT license into $DEST"
