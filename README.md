# JSON i18n Diff Tool

A client-side web application for comparing and editing JSON localization (l10n) files with visual diff highlighting and inline editing capabilities.

## Features

- 📤 Upload and compare two JSON localization files
- 🌳 Visual tree structure with nested keys
- 🎨 Color-coded differences:
  - 🔴 **Red**: Missing keys in either file
  - 🟡 **Yellow**: Identical values across files
  - ⚪ **Neutral**: Different values
- ✏️ Inline editing of values
- ➕ Add missing keys directly
- 💾 Save and download modified files
- 🎨 Prettify JSON with consistent formatting
- 📊 Tier-based key limits (Free: 20, Medium: 100, Enterprise: 1000)

## Tech Stack

- **Vue 3.5.22** - Progressive JavaScript framework with Composition API
- **Vite 7.1.14** (Rolldown variant) - Next-generation frontend build tool
- **Pinia** - Vue's official state management library
- **JavaScript ES6+** - Modern JavaScript features

## Project Structure

```
json-l10n-diff/
├── src/
│   ├── components/       # Vue components (to be implemented)
│   ├── pages/           # Page components (to be implemented)
│   ├── stores/          # Pinia stores (to be implemented)
│   ├── composables/     # Reusable logic (to be implemented)
│   ├── utils/           # Pure utility functions (to be implemented)
│   ├── App.vue          # Root component
│   ├── main.js          # Application entry point
│   └── style.css        # Global styles
├── specs/               # Feature specifications and planning docs
│   └── 001-json-i18n-comparison/
│       ├── spec.md                 # Feature requirements
│       ├── plan.md                 # Implementation plan
│       ├── data-model.md           # Entity definitions
│       ├── quickstart.md           # Developer guide
│       ├── tasks.md                # Task breakdown (52 tasks)
│       └── contracts/              # Component contracts
├── public/              # Static assets
├── index.html          # HTML entry point
├── package.json        # Dependencies and scripts
├── vite.config.js      # Vite configuration
└── README.md           # This file
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm 9+

### Installation

```bash
# Clone the repository
git clone https://github.com/iirving/json-l10n-diff.git
cd json-l10n-diff

# Install dependencies
npm install
```

### Development

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Current Status

**⚠️ Project Status: Planning Complete, Implementation Pending**

The project has completed the specification and planning phase:

- ✅ Feature specification with 5 user stories (P1, P2, P3 prioritized)
- ✅ Technical architecture and design patterns
- ✅ Data model with 5 entities
- ✅ Component contracts for 6 Vue components + 3 Pinia stores
- ✅ Detailed task breakdown (52 tasks across 8 phases)
- ⏳ Implementation: Ready to begin

### Implementation Roadmap

**MVP (2 weeks)**:

1. Phase 1: Setup (T001-T007) - Project structure and Pinia
2. Phase 2: Foundational (T008-T014) - Core utilities and stores
3. Phase 3: User Story 1 (T015-T021) - View and compare files
4. Phase 4: User Story 2 (T022-T026) - Edit and add keys
5. Phase 5: User Story 3 (T027-T032) - Save modified files

**Full Feature Set (3-4 weeks)**:
6. Phase 6: User Story 4 (T033-T037) - Tier limits
7. Phase 7: User Story 5 (T038-T041) - Tier selection
8. Phase 8: Polish (T042-T052) - Quality improvements

See `specs/001-json-i18n-comparison/tasks.md` for detailed task breakdown.

## Documentation

Comprehensive documentation is available in the `specs/001-json-i18n-comparison/` directory:

- **[spec.md](specs/001-json-i18n-comparison/spec.md)** - Feature requirements and user stories
- **[plan.md](specs/001-json-i18n-comparison/plan.md)** - Technical implementation plan
- **[tasks.md](specs/001-json-i18n-comparison/tasks.md)** - Granular task breakdown (52 tasks)
- **[quickstart.md](specs/001-json-i18n-comparison/quickstart.md)** - Developer onboarding guide
- **[data-model.md](specs/001-json-i18n-comparison/data-model.md)** - Entity definitions
- **[contracts/component-contracts.md](specs/001-json-i18n-comparison/contracts/component-contracts.md)** - Component and store interfaces

## Architecture

### State Management (Pinia Stores)

- **useFileStore** - Manages uploaded files and comparison results
- **useTierStore** - Handles tier selection and key limits
- **useEditStore** - Tracks edit operations and modified state

### Core Components (To Be Implemented)

- **FileUploader** - File input with drag-and-drop and validation
- **TreeViewer** - Recursive tree display with expand/collapse
- **ComparisonView** - Side-by-side comparison layout
- **KeyDiffItem** - Individual key comparison row
- **EditControls** - Save, prettify, and reset actions
- **TierGate** - Tier limit enforcement and upgrade prompts

### Pages

- **Index.vue** - Main application (comparison tool)
- **About.vue** - Feature information and pricing

## Repository

- **GitHub**: [https://github.com/iirving/json-l10n-diff](https://github.com/iirving/json-l10n-diff)
- **Branch**: `001-json-i18n-comparison` (feature development)
- **Issues**: [Report bugs or request features](https://github.com/iirving/json-l10n-diff/issues)
- **Discussions**: [Ask questions or share ideas](https://github.com/iirving/json-l10n-diff/discussions)

## Contributing

We welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for detailed guidelines on:

- Setting up your development environment
- Picking tasks from the task breakdown
- Code standards and conventions
- Pull request process

## License

[MIT License](LICENSE) - see the LICENSE file for details

## Pricing Tiers

- **Free**: Up to 20 keys
- **Medium**: $5/month - Up to 100 keys
- **Enterprise**: $99/month - Up to 1000 keys

---

**Note**: This project is currently in the specification phase. All functionality described above is planned but not yet implemented. Follow the tasks in `specs/001-json-i18n-comparison/tasks.md` to begin development.
