# JSON l10n Diff Tool

A client-side web application for comparing and editing JSON localization (l10n/i18n) files with visual diff highlighting and inline editing capabilities. All processing happens entirely in your browser—no data ever leaves your machine.

## ✨ Planned Features

- 📤 **Upload & Compare** - Drag-and-drop or select two JSON localization files
- 🌳 **Visual Tree Structure** - Nested key hierarchy with expandable nodes
- 🎨 **Smart Diff Highlighting**:
  - 🔴 **Red**: Missing keys (in either file)
  - 🟡 **Yellow**: Identical values across both files (potential placeholders)
  - ⚪ **Neutral**: Different values (expected for translations)
- ✏️ **Inline Editing** - Edit values directly in the comparison view
- ➕ **Add Missing Keys** - One-click to add missing keys to either file
- 💾 **Save & Download** - Export modified files with your changes
- 🎨 **JSON Prettify** - Format with consistent 2-space indentation
- 📊 **Flexible Tiers**:
  - 🆓 **Free**: Up to 20 keys
  - 💼 **Medium** ($5/month): Up to 100 keys
  - 🏢 **Enterprise** ($99/month): Up to 1000 keys
- 🔒 **Privacy-First** - 100% client-side, no server uploads

## 🛠️ Tech Stack

- **[Vue 3.5.22](https://vuejs.org/)** - Progressive JavaScript framework with Composition API
- **[Vite 7.1.14](https://vite.dev/)** (Rolldown variant) - Lightning-fast build tool with HMR
- **[Pinia 2.2.8](https://pinia.vuejs.org/)** - Intuitive state management for Vue
- **JavaScript ES6+** - Modern language features (async/await, destructuring, etc.)
- **100% Client-Side** - No backend, no server uploads, all processing in-browser

## 📁 Project Structure

```text
json-l10n-diff/
├── src/
│   ├── components/       # Vue components (planned)
│   ├── pages/           # Page components (planned)
│   ├── stores/          # Pinia stores (planned)
│   ├── composables/     # Reusable composition functions (planned)
│   ├── utils/           # Pure utility functions (planned)
│   ├── App.vue          # Root component
│   ├── main.js          # Application entry point
│   └── style.css        # Global styles
├── specs/               # 📋 Comprehensive feature specifications
│   └── 001-json-i18n-comparison/
│       ├── spec.md                 # User stories & requirements
│       ├── plan.md                 # Technical implementation plan
│       ├── data-model.md           # Entity & state definitions
│       ├── quickstart.md           # Developer onboarding guide
│       ├── tasks.md                # Granular task breakdown (52 tasks)
│       ├── research.md             # Technical research & decisions
│       └── contracts/
│           └── component-contracts.md  # Component & store interfaces
├── docs/                # 📖 Architecture documentation
│   ├── ARCHITECTURE.md     # System design & patterns
│   └── README.md           # Documentation index
├── public/              # Static assets
├── index.html          # HTML entry point
├── package.json        # Dependencies and scripts
├── vite.config.js      # Vite configuration
└── README.md           # This file
```

## 🚀 Getting Started

### Prerequisites

- **Node.js 18+** and **npm 9+**
- A modern web browser (Chrome, Firefox, Safari, Edge)

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
# Start development server (http://localhost:5173)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 📊 Current Status

### ✅ Completed

- Project setup with Vite + Vue 3 + Pinia
- Comprehensive feature specifications (5 user stories, P1-P3 prioritized)
- Technical architecture and design patterns documented
- Data model with 5 entities defined
- Component contracts for 6 Vue components + 3 Pinia stores
- Detailed task breakdown (52 tasks across 8 implementation phases)

### 🔄 In Progress

Implementation is following a phased approach:

**Phase 1-5: MVP (2 weeks)** - Core functionality

- ⏳ Phase 1: Setup (T001-T007) - Project structure and Pinia stores
- ⏳ Phase 2: Foundational (T008-T014) - Utilities and base stores
- ⏳ Phase 3: User Story 1 (T015-T021) - File upload and comparison UI
- ⏳ Phase 4: User Story 2 (T022-T026) - Inline editing and add keys
- ⏳ Phase 5: User Story 3 (T027-T032) - Save and export files

**Phase 6-8: Full Feature Set (1-2 weeks)** - Enhanced features

- ⏳ Phase 6: User Story 4 (T033-T037) - Tier limits and validation
- ⏳ Phase 7: User Story 5 (T038-T041) - Tier selection UI
- ⏳ Phase 8: Polish (T042-T052) - Testing, optimization, and refinements

See [`specs/001-json-i18n-comparison/tasks.md`](specs/001-json-i18n-comparison/tasks.md) for the complete task breakdown.

## 📚 Documentation

Comprehensive project documentation:

### Specifications (`specs/001-json-i18n-comparison/`)

- **[spec.md](specs/001-json-i18n-comparison/spec.md)** - User stories, acceptance criteria, and requirements
- **[plan.md](specs/001-json-i18n-comparison/plan.md)** - Technical implementation plan and architecture decisions
- **[tasks.md](specs/001-json-i18n-comparison/tasks.md)** - Granular task breakdown (52 tasks with phases)
- **[quickstart.md](specs/001-json-i18n-comparison/quickstart.md)** - Developer onboarding and setup guide
- **[data-model.md](specs/001-json-i18n-comparison/data-model.md)** - Entity definitions and state structure
- **[research.md](specs/001-json-i18n-comparison/research.md)** - Technical research and decision rationale
- **[contracts/component-contracts.md](specs/001-json-i18n-comparison/contracts/component-contracts.md)** - Component APIs and Pinia store interfaces

### Architecture (`docs/`)

- **[ARCHITECTURE.md](docs/ARCHITECTURE.md)** - System design, patterns, and technical decisions
- **[README.md](docs/README.md)** - Documentation index and navigation

## 🏗️ Architecture Overview

### State Management (Pinia Stores)

Three core stores manage application state:

- **`useFileStore`** - File uploads, parsing, and comparison results
- **`useTierStore`** - User tier selection and key limit enforcement  
- **`useEditStore`** - Edit operations, modifications, and undo/redo

### Vue Components (Planned)

- **`FileUploader`** - Drag-and-drop file input with validation
- **`TreeViewer`** - Recursive tree display with expand/collapse
- **`ComparisonView`** - Side-by-side comparison layout
- **`KeyDiffItem`** - Individual key comparison row with diff highlighting
- **`EditControls`** - Save, prettify, reset, and export actions
- **`TierGate`** - Tier limit enforcement and upgrade prompts

### Pages

- **`Index.vue`** - Main comparison tool interface
- **`About.vue`** - Feature information and pricing details

For detailed architecture information, see [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md).

## 🔗 Repository & Links

- **GitHub**: [iirving/json-l10n-diff](https://github.com/iirving/json-l10n-diff)
- **Branch**: `001-json-i18n-comparison` (active feature development)
- **Issues**: [Report bugs or request features](https://github.com/iirving/json-l10n-diff/issues)
- **Discussions**: [Questions and ideas](https://github.com/iirving/json-l10n-diff/discussions)

## 🤝 Contributing

Contributions are welcome! This project is well-documented with granular tasks ready to be implemented.

**Getting Started with Contributing**:

1. Read [`CONTRIBUTING.md`](CONTRIBUTING.md) for detailed guidelines
2. Review [`specs/001-json-i18n-comparison/quickstart.md`](specs/001-json-i18n-comparison/quickstart.md) for developer onboarding
3. Check [`specs/001-json-i18n-comparison/tasks.md`](specs/001-json-i18n-comparison/tasks.md) to pick a task
4. Follow the component contracts in [`specs/001-json-i18n-comparison/contracts/component-contracts.md`](specs/001-json-i18n-comparison/contracts/component-contracts.md)

**What We Need**:

- 🏗️ Component implementations (see task breakdown)
- 🧪 Testing and validation
- 📝 Documentation improvements
- 🐛 Bug reports and fixes
- 💡 Feature suggestions and enhancements

## 💰 Pricing (Planned)

| Tier | Price | Key Limit | Target Audience |
|------|-------|-----------|-----------------|
| 🆓 **Free** | $0 | 20 keys | Personal projects, demos |
| 💼 **Medium** | $5/month | 100 keys | Small to medium apps |
| 🏢 **Enterprise** | $99/month | 1,000 keys | Large-scale applications |

*Key counting includes parent objects (e.g., `user.profile.name` counts as 3 keys)*

## 📄 License

This project is licensed under the [MIT License](LICENSE) - see the LICENSE file for details.

---

**Built with ❤️ using Vue 3 + Vite** | *Privacy-first localization comparison tool*
