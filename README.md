# 🎥 Dual Video Player

A web-based dual video player for side-by-side video analysis with frame-accurate scrubbing, zooming, panning, and intuitive controls.

## Features

- **Two videos side by side**: Load and display two videos for comparison or analysis.
- **Frame-by-frame scrubbing**: Step through videos frame by frame using buttons or keyboard arrows.
- **Zoom & Pan**: Pinch-to-zoom (trackpad/wheel) and drag to pan each video independently.
- **Per-player controls**: Play, pause, and scrub each video separately.
- **Sync toggle**: Optionally sync playback between both videos.
- **Responsive UI**: Maximized, square video players for best use of screen space.
- **Built with React, TypeScript, and Tailwind CSS**.

## Getting Started

1. **Install dependencies:**
   ```sh
   cd src
   npm install
   ```

2. **Run the development server:**
   ```sh
   npm run dev
   ```
   Open the local URL shown in the terminal (e.g., http://localhost:5173/).

3. **Usage:**
   - Click "Choose File" under each player to load a video.
   - Use play/pause and frame-step controls below each player.
   - Use your trackpad (pinch or ctrl+wheel) to zoom, and drag to pan the video.
   - Use the "Sync" toggle to enable/disable synchronized playback.

## Project Structure

- `src/components/VideoPlayer.tsx` — Main player UI and controls
- `src/components/VideoCanvas.tsx` — Canvas rendering, zoom, and pan logic
- `src/components/Controls.tsx` — Global sync toggle
- `src/index.css` — Tailwind CSS setup

## Roadmap

- [ ] True frame-accurate scrubbing with FFmpeg/WebCodecs
- [ ] Advanced timeline and annotation tools
- [ ] Touch gesture support for mobile/tablet

## License

MIT

---

Made with ❤️ for video analysis and comparison.
