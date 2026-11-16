# Gameforge 3D

A free, browser-based procedural 3D asset prototype. Optimized for desktop and mobile browsers, including touch interaction.

## Run
Open the GitHub Pages deployment, or prepare a local offline site once:

```bash
bash scripts/prepare_pages_site.sh site
python3 -m http.server 4173 --directory site
```

Then open `http://localhost:4173`. The preparation step downloads the pinned Three.js 0.160.1 package and copies only the runtime module, the two required add-ons, their utility module and the MIT license. After preparation, the browser loads all runtime files locally and does not contact jsDelivr. WebGL is still required.

## Current prototype
- Eleven procedural starter assets: light/heavy tank, defense tower, bunker, industrial crate, conifer, mobile radar, logistics truck, self-propelled artillery, hangar and rock.
- Adjustable color, detail level, scale and material finish.
- Orbit, zoom and pan preview using mouse or touch.
- Adaptive mobile renderer: antialiasing and shadow maps disabled on narrow/touch devices, with device-pixel-ratio capped at 1.15 (desktop cap 1.7).
- Export the current model as binary glTF (`.glb`) and save a PNG preview.
- Save projects locally, export/import portable JSON project files.
- No account, backend, paid API or purchase required.

## Scope and limitations
This is a working starter generator based on simple procedural meshes, not an AI prompt-to-3D generator or a sculpting suite. It does not yet create rigged characters, authored PBR texture maps, animation, complex CAD topology or Blender project files. Three.js 0.160.1 and its required add-ons are staged locally in the Pages deployment; the prepared site can run without a runtime CDN connection. Generated geometry is exported locally in the browser.

## Agent workflow
See `AGENTS.md` and `.agents/skills/` for compatible coding-agent guidance.
