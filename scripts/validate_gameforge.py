from pathlib import Path
p=Path("index.html")
s=p.read_text(encoding="utf-8")
required=["OrbitControls","GLTFExporter","new THREE.WebGLRenderer","new THREE.Scene","function build()","tank","heavy","tower","bunker","crate","tree","gameforge-","model/gltf-binary","toDataURL","ResizeObserver"]
missing=[x for x in required if x not in s]
if missing: raise SystemExit("Missing features: "+", ".join(missing))
if "touch-action:none" not in s: raise SystemExit("Missing touch interaction configuration")
print("PASS: Gameforge browser generator structure and export features")
