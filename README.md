# Physics of Shred

Interactive physics simulations exploring the science behind electric guitars. This educational resource grew out of nearly a decade of guest lectures for MIT's Heavy Metal 101 course.

**Live site:** [physicsofshred.com](https://physicsofshred.com)

## What's Inside

This site features interactive visualizations covering:

- **Wave Mechanics** — Vibrating strings, standing waves, normal modes, and Fourier decomposition
- **Electromagnetic Transduction** — How pickups convert string motion to electrical signals, pickup placement effects, humbuckers
- **Fret Placement** — Equal temperament math, multiscale/fanned fret designs, True Temperament systems
- **Electronics** — Amplifier gain stages, clipping types, intermodulation distortion, vacuum tube operation
- **Tonewoods** — A physics-based look at coupled oscillator systems and how wood properties can affect tone

All simulations run in-browser using HTML Canvas and React, with no external dependencies for the physics calculations.

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Installation

```bash
git clone https://github.com/WillLunden/guitar-physics.git
cd guitar-physics
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the site.

### Build

```bash
npm run build
npm start
```

## Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS 4
- **Animations:** HTML Canvas with requestAnimationFrame
- **Theming:** next-themes (dark/light mode)

## Contributing

Contributions are welcome! This is an open educational resource.

### Ways to Contribute

- **Report bugs** — Open an issue describing the problem and steps to reproduce
- **Suggest features** — Have an idea for a new simulation or visualization? Open an issue to discuss
- **Fix typos or improve explanations** — Physics should be accessible; help make the content clearer
- **Add new simulations** — See guidelines below
- **Improve accessibility** — Help make simulations work better with screen readers and keyboard navigation

### Adding a New Simulation

1. **Open an issue first** to discuss the concept and scope
2. Create your simulation component in `app/components/`
3. Follow existing patterns:
   - Use TypeScript with proper type annotations
   - Implement dark mode support (detect `document.documentElement.classList.contains('dark')`)
   - Make controls accessible with proper labels
   - Include educational context explaining the physics
4. Add a page in the appropriate section under `app/`
5. Update the sidebar navigation in `app/components/Sidebar.tsx`

### Code Style

- Use TypeScript strict mode
- Follow existing component patterns
- Use Tailwind CSS for styling (no CSS modules)
- Keep simulations self-contained with no external physics libraries
- Prefer clarity over cleverness in physics calculations

### Pull Request Process

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-simulation`)
3. Make your changes
4. Run `npm run lint` to check for issues
5. Commit with a clear message describing what and why
6. Open a PR against `main`

### Code of Conduct

Be respectful and constructive. This is an educational project — we're all here to learn about physics and guitars.

## Project Structure

```
app/
├── components/          # Reusable React components
│   ├── *Sim.tsx        # Simulation components
│   ├── Sidebar.tsx     # Navigation
│   └── ...
├── vibrations-and-waves/   # Wave mechanics section
├── transduction/           # Pickup physics section
├── tuning/                 # Fret placement section
├── electronics/            # Amp/effects section
├── about/                  # About page
├── layout.tsx              # Root layout
├── page.tsx                # Home page
└── globals.css             # Global styles
```

## License

This project is open source. See individual simulation components for any specific attribution requirements.

## Author

**Dr. Will Lunden** — Physicist, guitarist, and creator of this project. PhD in atomic physics from MIT. Plays guitar in [The Beast of Nod](https://thebeastofnod.bandcamp.com).

Learn more at [wlunden.com](https://wlunden.com)

## Acknowledgments

- Joe Diaz and the MIT Heavy Metal 101 course for inspiring this project
- The metal and physics communities for asking great questions about how guitars actually work
