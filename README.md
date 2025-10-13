# JSON l10n Diff Tool

> **⚠️ Status**: Coming Soon - In Active Development

Compare and synchronize your translation files effortlessly. A fast, secure, browser-based tool for managing JSON localization files across multiple languages.

## Why JSON l10n Diff?

**Perfect for developers, translators, and localization teams** who need to:

- 🔍 Quickly spot missing translations between language files
- 🎯 Identify untranslated placeholder text that's been copied across files
- ✏️ Edit translations directly without switching tools
- 💾 Keep translation files in sync across your project
- 🔒 Work with sensitive data locally (nothing uploaded to servers)

## ✨ What You Can Do

### Compare Translation Files

Upload your JSON localization files (e.g., `en.json` and `fr.json`) and instantly see:

- 🔴 **Missing keys** - Translations that exist in one file but not the other
- 🟡 **Identical values** - Potential untranslated text (same value in both languages)
- ⚪ **Different values** - Properly translated content

### Edit On-the-Spot

- **Add missing keys** with one click to either file
- **Edit translations** directly in the comparison view
- **Fix placeholders** without leaving your browser

### Export Your Updates

- **Download modified files** with all your changes
- **Prettify JSON** for consistent formatting
- **Clean diffs** for easier version control

## 💰 Pricing

| Plan | Price | File Size Limit | Best For |
|------|-------|-----------------|----------|
| 🆓 **Free** | $0 | Up to 20 keys | Small projects, testing, demos |
| 💼 **Medium** | $5/month | Up to 100 keys | Growing apps, indie developers |
| 🏢 **Enterprise** | $99/month | Up to 1,000 keys | Large applications, teams |

> **Note**: Keys are counted including parent objects. For example, `user.profile.name` counts as 3 keys: "user", "profile", and "name".

## 🔒 Privacy & Security

- **100% client-side** - All processing happens in your browser
- **No uploads** - Your files never leave your computer
- **No tracking** - We don't collect or store your data
- **Open source** - Inspect the code yourself on [GitHub](https://github.com/iirving/json-l10n-diff)

## � Getting Started

### For End Users

**Coming Soon!** The tool will be available at a hosted URL. Simply:

1. Visit the website
2. Upload your first JSON translation file
3. Upload your second JSON translation file
4. Review differences with color-coded highlighting
5. Edit, add missing keys, and export your updated files

No installation required—just open your browser and start comparing!

### For Developers

Want to run it locally or contribute? See the [Development Setup](#%EF%B8%8F-for-developers--contributors) section below.

## 📝 Use Cases

### Scenario 1: Finding Missing Translations

You've added new features to your app and need to ensure all languages are up to date.

```text
✅ Upload en.json (your main language file)
✅ Upload fr.json (French translations)
🔴 Missing keys highlighted instantly
➕ Add missing keys with one click
💾 Download updated fr.json
```

### Scenario 2: Catching Untranslated Placeholders

Sometimes placeholder text gets copied instead of translated.

```text
✅ Upload en.json: { "welcome": "Welcome" }
✅ Upload es.json: { "welcome": "Welcome" }
🟡 Identical values highlighted in yellow
✏️ Edit "Welcome" → "Bienvenido"
💾 Download corrected es.json
```

### Scenario 3: Team Synchronization

Multiple team members working on translations? Keep files in sync.

```text
✅ Compare your local changes against the main branch
🔴 See what others added that you're missing
➕ Add new keys to your file
💾 Export and commit synchronized files
```

## 💡 How It Works

1. **Upload** - Drag and drop or select your JSON files
2. **Parse** - Files are validated and structured into a nested tree
3. **Compare** - Differences are calculated and highlighted
4. **Edit** - Make changes directly in the interface
5. **Export** - Download your modified files

All processing happens in your browser—fast, secure, and private.

## ❓ FAQ

**Q: What file formats are supported?**
A: Valid JSON files only. The tool validates your files on upload.

**Q: Is there a file size limit?**
A: Yes, 10 MB per file. This is sufficient for even very large translation projects.

**Q: Can I use this offline?**
A: Yes! Once loaded, the app works completely offline. (Note: Initial download requires internet)

**Q: Do you support other formats (YAML, XML, etc.)?**
A: Currently JSON only. Other formats may be added based on user demand.

**Q: How are keys counted for tier limits?**
A: Every key including parent objects counts. Example: `{ "user": { "profile": { "name": "John" } } }` = 3 keys.

**Q: What happens if I exceed my tier limit?**
A: You'll see an error message and be prompted to upgrade or use a smaller file.

## 🔗 Links

- **Live App**: Coming Soon
- **GitHub**: [iirving/json-l10n-diff](https://github.com/iirving/json-l10n-diff)
- **Report Issues**: [GitHub Issues](https://github.com/iirving/json-l10n-diff/issues)
- **Request Features**: [GitHub Discussions](https://github.com/iirving/json-l10n-diff/discussions)

## 📞 Support

- 📧 **Email**: support@[domain-coming-soon]
- 💬 **Discussions**: [GitHub Discussions](https://github.com/iirving/json-l10n-diff/discussions)
- 🐛 **Bug Reports**: [GitHub Issues](https://github.com/iirving/json-l10n-diff/issues)

---

## �🛠️ For Developers & Contributors

### Tech Stack

- **[Vue 3.5.22](https://vuejs.org/)** - Progressive JavaScript framework
- **[Vite 7.1.14](https://vite.dev/)** (Rolldown variant) - Lightning-fast build tool
- **[Pinia 2.2.8](https://pinia.vuejs.org/)** - State management
- **JavaScript ES6+** - Modern JavaScript

### Local Development Setup

```bash
# Clone the repository
git clone https://github.com/iirving/json-l10n-diff.git
cd json-l10n-diff

# Install dependencies
npm install

# Start development server (http://localhost:5173)
npm run dev

# Build for production
npm run build
```

### Development Status

**Current Phase**: Implementation in progress (MVP development)

- ✅ Planning & specifications complete
- ✅ Architecture & component design finalized
- 🔄 Core features being implemented
- ⏳ Expected MVP: 2-3 weeks
- ⏳ Full release: 4-6 weeks

### Contributing

We welcome contributions! Check out:

- **[CONTRIBUTING.md](CONTRIBUTING.md)** - Contribution guidelines
- **[Tasks Breakdown](specs/001-json-i18n-comparison/tasks.md)** - Pick a task to work on
- **[Component Contracts](specs/001-json-i18n-comparison/contracts/component-contracts.md)** - Technical specs

### Documentation for Developers

- **[Architecture Overview](docs/ARCHITECTURE.md)** - System design and patterns
- **[Feature Specification](specs/001-json-i18n-comparison/spec.md)** - User stories and requirements
- **[Implementation Plan](specs/001-json-i18n-comparison/plan.md)** - Technical roadmap
- **[Quick Start Guide](specs/001-json-i18n-comparison/quickstart.md)** - Developer onboarding

## 📄 License

This project is licensed under the [MIT License](LICENSE) - free to use, modify, and distribute.

---

**Built with ❤️ using Vue 3 + Vite** | *Privacy-first localization comparison tool*
