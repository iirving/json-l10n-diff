<script setup>
/**
 * About.vue - Static Information Page
 *
 * Purpose: Provide information about the tool, features, and how it works
 * Content:
 * - Feature overview
 * - How it works
 * - Technical details
 * - Privacy & security information
 */
</script>

<template>
  <div class="about-page">
    <header class="page-header">
      <h1>About JSON l10n Diff Tool</h1>
      <p class="subtitle">Privacy-first localization comparison tool</p>
    </header>

    <main class="page-content">
      <!-- Features Section -->
      <section class="content-section">
        <h2>✨ Features</h2>
        <div class="feature-grid">
          <div class="feature-card">
            <div class="feature-icon">📤</div>
            <h3>Upload & Compare</h3>
            <p>
              Drag-and-drop or select two JSON localization files to compare
              instantly
            </p>
          </div>

          <div class="feature-card">
            <div class="feature-icon">🌳</div>
            <h3>Visual Tree Structure</h3>
            <p>View nested key hierarchy with expandable/collapsible nodes</p>
          </div>

          <div class="feature-card">
            <div class="feature-icon">🎨</div>
            <h3>Smart Diff Highlighting</h3>
            <p>
              Color-coded differences: red for missing keys, yellow for
              identical values, green for different values
            </p>
          </div>

          <div class="feature-card">
            <div class="feature-icon">✏️</div>
            <h3>Inline Editing</h3>
            <p>Edit translations directly in the comparison view</p>
          </div>

          <div class="feature-card">
            <div class="feature-icon">➕</div>
            <h3>Add Missing Keys</h3>
            <p>One-click to add missing keys to either file</p>
          </div>

          <div class="feature-card">
            <div class="feature-icon">💾</div>
            <h3>Save & Download</h3>
            <p>Export modified files with all your changes</p>
          </div>

          <div class="feature-card">
            <div class="feature-icon">🎨</div>
            <h3>JSON Prettify</h3>
            <p>Format with consistent 2-space indentation</p>
          </div>

          <div class="feature-card">
            <div class="feature-icon">🔒</div>
            <h3>Privacy-First</h3>
            <p>100% client-side processing, no server uploads</p>
          </div>
        </div>
      </section>

      <!-- How It Works Section -->
      <section class="content-section">
        <h2>💡 How It Works</h2>
        <div class="steps-container">
          <div class="step">
            <div class="step-number">1</div>
            <div class="step-content">
              <h3>Upload</h3>
              <p>Drag and drop or select your JSON localization files</p>
            </div>
          </div>

          <div class="step">
            <div class="step-number">2</div>
            <div class="step-content">
              <h3>Parse</h3>
              <p>Files are validated and structured into a nested tree</p>
            </div>
          </div>

          <div class="step">
            <div class="step-number">3</div>
            <div class="step-content">
              <h3>Compare</h3>
              <p>
                Differences are calculated and highlighted with color coding
              </p>
            </div>
          </div>

          <div class="step">
            <div class="step-number">4</div>
            <div class="step-content">
              <h3>Edit</h3>
              <p>Make changes directly in the interface</p>
            </div>
          </div>

          <div class="step">
            <div class="step-number">5</div>
            <div class="step-content">
              <h3>Export</h3>
              <p>Download your modified files</p>
            </div>
          </div>
        </div>
        <p class="highlight-box">
          All processing happens in your browser—fast, secure, and private.
        </p>
      </section>

      <!-- Technical Details Section -->
      <section class="content-section">
        <h2>🛠️ Technical Details</h2>
        <div class="tech-grid">
          <div class="tech-item">
            <h4>Framework</h4>
            <p>Vue 3.5.22 with Composition API</p>
          </div>

          <div class="tech-item">
            <h4>Build Tool</h4>
            <p>Vite 7.1.14 (Rolldown variant)</p>
          </div>

          <div class="tech-item">
            <h4>State Management</h4>
            <p>Pinia 2.2.8</p>
          </div>

          <div class="tech-item">
            <h4>Language</h4>
            <p>JavaScript ES6+</p>
          </div>

          <div class="tech-item">
            <h4>File Size Limit</h4>
            <p>10 MB per file</p>
          </div>

          <div class="tech-item">
            <h4>Supported Format</h4>
            <p>Valid JSON files only</p>
          </div>
        </div>
      </section>

      <!-- Privacy & Security Section -->
      <section class="content-section">
        <h2>🔒 Privacy & Security</h2>
        <div class="privacy-list">
          <div class="privacy-item">
            <span class="check-icon">✓</span>
            <div>
              <h4>100% Client-Side Processing</h4>
              <p>All file processing happens entirely in your browser</p>
            </div>
          </div>

          <div class="privacy-item">
            <span class="check-icon">✓</span>
            <div>
              <h4>No Server Uploads</h4>
              <p>Your files never leave your computer</p>
            </div>
          </div>

          <div class="privacy-item">
            <span class="check-icon">✓</span>
            <div>
              <h4>No Tracking</h4>
              <p>We don't collect or store your data</p>
            </div>
          </div>

          <div class="privacy-item">
            <span class="check-icon">✓</span>
            <div>
              <h4>Open Source</h4>
              <p>
                Inspect the code yourself on
                <a href="https://github.com/iirving/json-l10n-diff" target="_blank" rel="noopener noreferrer">GitHub</a>
              </p>
            </div>
          </div>
        </div>
      </section>

      <!-- Use Cases Section -->
      <section class="content-section">
        <h2>📝 Use Cases</h2>
        <div class="use-case">
          <h3>Finding Missing Translations</h3>
          <p>
            You've added new features to your app and need to ensure all
            languages are up to date.
          </p>
          <div class="example-box">
            <code>✅ Upload en.json (your main language file)<br />
              ✅ Upload fr.json (French translations)<br />
              🔴 Missing keys highlighted instantly<br />
              ➕ Add missing keys with one click<br />
              💾 Save updated fr.json</code>
          </div>
        </div>

        <div class="use-case">
          <h3>Catching Untranslated Placeholders</h3>
          <p>Sometimes placeholder text gets copied instead of translated.</p>
          <div class="example-box">
            <code>✅ Upload en.json: { "welcome": "Welcome" }<br />
              ✅ Upload fr.json: { "welcome": "Welcome" }<br />
              🟡 Identical values highlighted in yellow<br />
              ✏️ Edit "Welcome" → "Bienvenue"<br />
              💾 Save corrected fr.json</code>
          </div>
        </div>

        <div class="use-case">
          <h3>Team Synchronization</h3>
          <p>
            Multiple team members working on translations? Keep files in sync.
          </p>
          <div class="example-box">
            <code>✅ Compare your local changes against the main branch<br />
              🔴 See what others added that you're missing<br />
              ➕ Add new keys to your file<br />
              💾 Export and commit synchronized files</code>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<style scoped>
.about-page {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.page-header {
  padding: var(--spacing-xl) var(--spacing-lg);
  text-align: center;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  background: linear-gradient(135deg,
      rgba(100, 108, 255, 0.1) 0%,
      rgba(139, 92, 246, 0.1) 100%);
}

.page-header h1 {
  margin: 0;
  font-size: 2.5rem;
}

.subtitle {
  margin: var(--spacing-sm) 0 0 0;
  color: rgba(255, 255, 255, 0.6);
  font-size: 1.125rem;
}

.page-content {
  flex: 1;
  padding: var(--spacing-xl) var(--spacing-lg);
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
}

.content-section {
  margin-bottom: var(--spacing-xl);
}

.content-section h2 {
  font-size: 2rem;
  margin-bottom: var(--spacing-lg);
  border-bottom: 2px solid var(--color-primary);
  padding-bottom: var(--spacing-sm);
}

/* Feature Grid */
.feature-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: var(--spacing-lg);
}

.feature-card {
  padding: var(--spacing-lg);
  border-radius: var(--radius-md);
  background-color: rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition:
    transform 0.2s,
    border-color 0.2s;
}

.feature-card:hover {
  transform: translateY(-4px);
  border-color: var(--color-primary);
}

.feature-icon {
  font-size: 2.5rem;
  margin-bottom: var(--spacing-sm);
}

.feature-card h3 {
  margin: 0 0 var(--spacing-sm) 0;
  font-size: 1.25rem;
}

.feature-card p {
  margin: 0;
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.95rem;
  line-height: 1.6;
}

/* Steps Container */
.steps-container {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.step {
  display: flex;
  align-items: flex-start;
  gap: var(--spacing-md);
  padding: var(--spacing-md);
  border-radius: var(--radius-md);
  background-color: rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.step-number {
  flex-shrink: 0;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, var(--color-primary) 0%, #8b5cf6 100%);
  border-radius: 50%;
  font-weight: 600;
  font-size: 1.25rem;
}

.step-content h3 {
  margin: 0 0 var(--spacing-xs) 0;
}

.step-content p {
  margin: 0;
  color: rgba(255, 255, 255, 0.7);
}

.highlight-box {
  margin-top: var(--spacing-lg);
  padding: var(--spacing-md);
  border-radius: var(--radius-md);
  background-color: rgba(100, 108, 255, 0.1);
  border: 1px solid rgba(100, 108, 255, 0.3);
  text-align: center;
  font-weight: 500;
}

/* Tech Grid */
.tech-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: var(--spacing-md);
}

.tech-item {
  padding: var(--spacing-md);
  border-radius: var(--radius-md);
  background-color: rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.tech-item h4 {
  margin: 0 0 var(--spacing-xs) 0;
  color: var(--color-primary);
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.tech-item p {
  margin: 0;
  font-size: 1rem;
  font-weight: 500;
}

/* Privacy List */
.privacy-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.privacy-item {
  display: flex;
  align-items: flex-start;
  gap: var(--spacing-md);
  padding: var(--spacing-md);
  border-radius: var(--radius-md);
  background-color: rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.check-icon {
  flex-shrink: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--color-success);
  border-radius: 50%;
  font-weight: 600;
  color: white;
}

.privacy-item h4 {
  margin: 0 0 var(--spacing-xs) 0;
}

.privacy-item p {
  margin: 0;
  color: rgba(255, 255, 255, 0.7);
}

.privacy-item a {
  color: var(--color-primary);
  text-decoration: underline;
}

.privacy-item a:hover {
  color: #8b5cf6;
}

/* Use Cases */
.use-case {
  margin-bottom: var(--spacing-lg);
  padding: var(--spacing-lg);
  border-radius: var(--radius-md);
  background-color: rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.use-case h3 {
  margin: 0 0 var(--spacing-sm) 0;
  color: var(--color-primary);
}

.use-case p {
  margin: 0 0 var(--spacing-md) 0;
  color: rgba(255, 255, 255, 0.8);
}

.example-box {
  padding: var(--spacing-md);
  border-radius: var(--radius-sm);
  background-color: rgba(0, 0, 0, 0.4);
  border-left: 3px solid var(--color-primary);
}

.example-box code {
  font-family: 'Courier New', monospace;
  font-size: 0.9rem;
  line-height: 1.8;
  color: rgba(255, 255, 255, 0.9);
}

/* Responsive Design */
@media (max-width: 768px) {
  .page-header h1 {
    font-size: 2rem;
  }

  .subtitle {
    font-size: 1rem;
  }

  .content-section h2 {
    font-size: 1.5rem;
  }

  .feature-grid {
    grid-template-columns: 1fr;
  }

  .tech-grid {
    grid-template-columns: 1fr;
  }

  .page-content {
    padding: var(--spacing-lg) var(--spacing-md);
  }
}
</style>
