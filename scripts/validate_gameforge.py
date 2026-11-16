from pathlib import Path
import re

root = Path(__file__).resolve().parents[1]
html = (root / "index.html").read_text(encoding="utf-8")
readme = (root / "README.md").read_text(encoding="utf-8")

required = [
    "OrbitControls", "GLTFExporter", "new THREE.WebGLRenderer",
    "new THREE.Scene", "function build()", "model/gltf-binary",
    "toDataURL", "ResizeObserver", "saveProject", "loadProject",
    "downloadProject", "importProject", "gameforge3d.project.v1",
    "function applyProject(p)", "Number.isInteger(+p.scale)", "JSON.stringify(data,null,2)",
]
missing = [token for token in required if token not in html]
if missing:
    raise SystemExit("Missing features: " + ", ".join(missing))

if "touch-action:none" not in html:
    raise SystemExit("Missing touch interaction configuration")

kind_select = re.search(r'<select id="kind">(.*?)</select>', html, re.DOTALL)
if not kind_select:
    raise SystemExit("Missing asset type selector")

actual_kinds = set(re.findall(r'<option value="([^"]+)"', kind_select.group(1)))
expected_kinds = {
    "tank", "heavy", "tower", "bunker", "crate", "tree",
    "radar", "truck", "artillery", "hangar", "rock",
}
if actual_kinds != expected_kinds:
    missing_kinds = sorted(expected_kinds - actual_kinds)
    unexpected_kinds = sorted(actual_kinds - expected_kinds)
    raise SystemExit(
        f"Asset catalog mismatch; missing={missing_kinds}, unexpected={unexpected_kinds}"
    )

documented_labels = [
    "light/heavy tank", "defense tower", "bunker", "industrial crate",
    "conifer", "mobile radar", "logistics truck",
    "self-propelled artillery", "hangar", "rock",
]
missing_docs = [label for label in documented_labels if label not in readme]
if missing_docs:
    raise SystemExit("README asset catalog is incomplete: " + ", ".join(missing_docs))

print("PASS: Gameforge structure, project persistence, exports and all 11 documented asset types")
