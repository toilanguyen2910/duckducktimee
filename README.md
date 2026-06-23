# DuckDuckTimee 🦆

**Desktop Duck Pet** - A cute pixel duck companion that runs on your desktop while you code. When your CLI tasks complete, the duck quacks to notify you!

## Features

- 🦆 **Cute Pixel Art** - 32x32px animated duck sprite with 4 animation states
- 🎮 **Always-On-Top** - Runs above all windows on your desktop
- 🚀 **Lightweight** - Minimal resource usage, written in Electron
- 🎵 **Audio Feedback** - Quacks when tasks complete
- 🖱️ **Draggable** - Move the duck anywhere on screen
- 🔧 **CLI Integration** - Monitor and react to code compilation, tests, deployments
- ⌨️ **Keyboard Shortcut** - Ctrl+Shift+D to show/hide duck

## Installation

### Prerequisites
- Node.js 16+ 
- npm or yarn

### Setup

```bash
cd D:\DuckDuckTimee
npm install
```

### Run

```bash
npm start
```

### Development

```bash
npm run dev
```

## Animation States

| State | Duration | Trigger |
|-------|----------|---------|
| **Idle** | Loops | Default state, breathing animation |
| **Walk** | 3s | Random movement on screen |
| **Quack** | 1s | Double-click duck or task completes |
| **Sleep** | 3s | Random transition from walk |

## Controls

- **Left Click + Drag** - Move duck around screen
- **Double Click** - Make duck quack
- **Right Click** - Context menu (show/hide, quit)
- **Ctrl+Shift+D** - Global hotkey to toggle visibility

## File Structure

```
DuckDuckTimee/
├── main.js                 # Electron main process
├── index.html              # Window content
├── package.json            # Dependencies & config
├── js/
│   └── duck-animation.js   # Animation & state logic
├── css/
│   └── duck.css            # Styling
└── assets/
    └── sprites/
        └── duck-sprite.png # 32x32px sprite sheet
```

## Sprite Sheet Layout

The sprite sheet contains 4 animation sequences in a horizontal strip:
- **Idle** (frames 0-3): 0-127px
- **Walk** (frames 0-5): 128-319px
- **Quack** (frames 0-3): 320-447px
- **Sleep** (frames 0-2): 448-543px

Each frame is 32x32 pixels.

## CLI Integration (Upcoming)

Monitor output from CLI tools and trigger duck state changes:
- Track `npm start`, `npm run build`, tests
- Listen for process completion
- Auto-trigger quack on success
- Show stressed duck animation on errors

## Building for Distribution

```bash
npm run build
```

Creates installer in `dist/` folder.

## License

MIT - Feel free to customize and share!

## Credits

- Pixel art duck sprite - Generated with AI
- Built with Electron
- Made with ❤️ by Jack Nguyen