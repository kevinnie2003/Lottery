# Annual Meeting Lottery

A browser-based lottery tool for company annual meetings. Upload an employee list, configure prize levels, and draw winners with slot-machine animations, confetti effects, and sound.

## Features

- **Slot machine animation** — names scroll and decelerate to reveal winners, with staggered column stops for suspense
- **3 prize levels** — Grand Prize, Second Prize, Third Prize with escalating visual effects (confetti, spotlight, fireworks, screen shake)
- **Configurable prize counts** — adjust the number of winners per prize level before starting
- **CSV / Excel upload** — drag-and-drop import of employee lists (.csv, .xlsx, .xls) with flexible column matching (supports English and Chinese headers)
- **No repeat winners** — drawn employees are excluded from future draws automatically
- **Undo / re-draw** — reverse the last draw with a confirmation prompt
- **Winners board** — view all winners grouped by prize level
- **Fullscreen mode** — presentation-optimized display for projectors
- **LocalStorage persistence** — state survives page refresh; no backend required
- **Sound effects** — drumroll during draw, fanfare on reveal (bring your own audio files)

## Quick Start

```bash
npm install
npm run dev
```

Open http://localhost:5173 in your browser.

## Usage

1. **Setup** — adjust prize counts (default: 1 Grand, 3 Second, 5 Third), then upload a CSV/Excel file with employee data
2. **Lottery** — select a prize level, click "Start Draw", watch the slot machine animation reveal winners
3. **Winners** — view the winners board at any time via the nav bar

### CSV Format

The file should have columns for employee name, ID, and optionally department. Column headers are matched flexibly:

| Name | Employee ID | Department |
|------|-------------|------------|
| Alice Chen | E001 | Engineering |
| Bob Zhang | E002 | Marketing |

Supported header aliases: `name` / `姓名`, `id` / `employee id` / `工号`, `department` / `部门`

### Sound Files

Place MP3 files in `public/sounds/` to enable audio:

- `drumroll.mp3` — looping drumroll during the draw
- `tick.mp3` — click sound on each name change
- `fanfare-third.mp3` — Third Prize celebration
- `fanfare-second.mp3` — Second Prize celebration
- `fanfare-grand.mp3` — Grand Prize celebration

The app works without sound files — audio is optional.

## Tech Stack

- React 19 + TypeScript
- Vite
- Zustand (state management + LocalStorage persistence)
- Motion (animations)
- canvas-confetti (celebration effects)
- PapaParse + SheetJS (CSV/Excel parsing)
- Howler.js (audio)

## Build

```bash
npm run build     # outputs to dist/
npm run preview   # preview the production build locally
```

The output is a static site — deploy to any static hosting (Netlify, Vercel, S3, etc.) with no server required.
