# Gameforge 3D

A free, browser-based procedural 3D asset prototype. Optimized for desktop and mobile browsers, including touch interaction.

## Run
Open `index.html` through GitHub Pages or any static HTTP server. WebGL and access to jsDelivr are required.

## Current prototype
- Procedural starter assets: light/heavy tank, defense tower, bunker, industrial crate and conifer.
- Adjustable color, detail level, scale and material finish.
- Orbit, zoom and pan preview using mouse or touch.
- Export the current model as binary glTF (`.glb`) and save a PNG preview.
- No account, backend, paid API or purchase required.

## Scope and limitations
This is a working starter generator based on procedural meshes, not a sculpting suite. It does not yet create rigged characters, authored PBR texture maps, animation, complex CAD topology or Blender project files. Three.js is loaded from jsDelivr, so offline startup is not guaranteed. Generated geometry is exported locally in the browser.

## Agent workflow
See `AGENTS.md` and `.agents/skills/` for compatible coding-agent guidance.
