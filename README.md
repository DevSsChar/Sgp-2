<p align="center">
  <img src="./public/images/accessibilityguard_logo-removebg-preview.png" alt="AccessibilityGuard Logo" width="220" />
</p>

# 🛡️ AccessibilityGuard

### *Clinical Brutalist HUD Web Accessibility Audit & AI Remediation Platform*

Accessible web crawling, real-time accessibility scans (Axe-Core), deep WCAG audits, offline PDF generation, and automated AI code remedies—all packed into a highly polished, responsive HUD console.

---

## 🛠️ Tech Stack

[![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-20232a?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![NextAuth.js](https://img.shields.io/badge/NextAuth.js-0F172A?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://next-auth.js.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Puppeteer](https://img.shields.io/badge/Puppeteer-40B5A4?style=for-the-badge&logo=puppeteer&logoColor=white)](https://pptr.dev/)
[![Axe-Core](https://img.shields.io/badge/Axe--Core-5B2D90?style=for-the-badge&logo=accessibility&logoColor=white)](https://github.com/dequelabs/axe-core)
[![Chrome Extension](https://img.shields.io/badge/Chrome-Extension-4285F4?style=for-the-badge&logo=googlechrome&logoColor=white)](./browser-extension)

---

## 🎯 Key Capabilities

1. **Automated Multi-Page Crawler**
   - Crawls site structure starting from seed URLs via [actions/lib/crawler.js](file:///e:/SGP4/Sgp-2/actions/lib/crawler.js).
   - Supports glob pattern rules (`--include` / `--exclude`) for scoping audits.
   - Respects `robots.txt` directives (can be toggled).

2. **Puppeteer & Axe-Core Scanner**
   - Headless or headful browser scanning utilizing Axe-Core rulesets via [actions/lib/scanner.js](file:///e:/SGP4/Sgp-2/actions/lib/scanner.js).
   - Configurable selectors, timeouts, and page render delays.
   - Ignores SSL/TLS handshake certificates dynamically to prevent scan blocks on local staging sites.

3. **Advanced Session & Authentication Import**
   - Save credentials, login URLs, and custom DOM selectors (username, password, submit) for automated scanning of secured or paywalled pages using [components/ScannerAuthPanel.jsx](file:///e:/SGP4/Sgp-2/components/ScannerAuthPanel.jsx).
   - Dynamic **Browser Session Import Companion Extension** (located in [browser-extension/](file:///e:/SGP4/Sgp-2/browser-extension/)) intercepts target sites to grab cookies, localStorage, and sessionStorage, exporting them directly into the scanner to bypass multi-factor authentication (MFA) and single-sign-on (SSO) login loops.

4. **Enterprise-Grade Resilient Error Classification**
   - Detects and categorizes connection timeouts, 404/403/500 HTTP failures, DNS errors (`ERR_NAME_NOT_RESOLVED`), and certificate errors using [actions/lib/reporter.js](file:///e:/SGP4/Sgp-2/actions/lib/reporter.js).
   - Failed pages are recorded in reports with precise error metadata rather than being skipped silently, and they are highlighted in red on dashboard reports.

5. **AI Accessibility Remediation & Chatbot Companion**
   - AI remediation routes ([app/api/ai-fix/route.js](file:///e:/SGP4/Sgp-2/app/api/ai-fix/route.js)) analyze HTML snippets of Axe violations and suggest accessible replacement code.
   - Integrated chatbot ([components/AccessibilityChatbot.jsx](file:///e:/SGP4/Sgp-2/components/AccessibilityChatbot.jsx)) queries reports with natural language context to guide developers.

6. **Clinical Brutalist HUD Theme System**
   - Polished dark and light themes (based on [DESIGN-dark.md](file:///e:/SGP4/Sgp-2/DESIGN-dark.md) and [DESIGN-light.md](file:///e:/SGP4/Sgp-2/DESIGN-light.md)) implemented dynamically via [components/ThemeContext.js](file:///e:/SGP4/Sgp-2/components/ThemeContext.js).
   - All elements, including the recent reports list, status tags, charts, and progress bars, enforce high color-contrast ratio compliance (WCAG 2.1 AA/AAA guidelines) in both modes.

7. **PDF Audit Exporter**
   - Client-side offline PDF generation using `jspdf` and `jspdf-autotable` via [utils/pdfGenerator.js](file:///e:/SGP4/Sgp-2/utils/pdfGenerator.js).

---

## 🏗️ Architecture & Project Directory

### Data & Crawl Flow
```mermaid
graph TD
  A[Scanner Setup URL] --> B[Crawling Phase - crawler.js]
  B --> C[Auth Profile Injection - authSession.js]
  C --> D[Puppeteer Page Rendering]
  D --> E[Axe-Core Accessibility Run]
  E --> F[Error / Violation Classification - reporter.js]
  F --> G[Save Report to MongoDB]
  G --> H[Render UI - ScanResultScreen.jsx]
```

### Core Components & Pages
- **Auth Shell / Navigation**:
  - [components/navbar.jsx](file:///e:/SGP4/Sgp-2/components/navbar.jsx) – Global HUD navbar with links and Theme Toggle.
  - [components/footer.jsx](file:///e:/SGP4/Sgp-2/components/footer.jsx) – Global status footer (ping, node info).
  - [components/login.jsx](file:///e:/SGP4/Sgp-2/components/login.jsx) – Dual-theme login window with OAuth hooks.
- **Main Views**:
  - [components/dashboard.jsx](file:///e:/SGP4/Sgp-2/components/dashboard.jsx) – Comprehensive statistics, before/after compliance charts, and Legal Risk Mitigation logs.
  - [components/scanner.jsx](file:///e:/SGP4/Sgp-2/components/scanner.jsx) – Launch console showing real-time logs, scan phases, and current state metrics.
  - [components/ScanResultScreen.jsx](file:///e:/SGP4/Sgp-2/components/ScanResultScreen.jsx) – Separate audit ledger showcasing three detailed tabs: Summary, Pages (crawled status), and Violations (impact categories).
  - [components/history.jsx](file:///e:/SGP4/Sgp-2/components/history.jsx) – Grid view of previous scans.
- **Shared Contexts & Utilities**:
  - [components/ThemeContext.js](file:///e:/SGP4/Sgp-2/components/ThemeContext.js) – Global client context to manage dark mode status.
  - [utils/pdfGenerator.js](file:///e:/SGP4/Sgp-2/utils/pdfGenerator.js) – Converts reports to tabular print layouts.
  - [utils/secureStorage.js](file:///e:/SGP4/Sgp-2/utils/secureStorage.js) – AES-256-GCM encryption/decryption of scanning auth credentials.

---

## 💾 Database Schemas

### User Model ([models/user.js](file:///e:/SGP4/Sgp-2/models/user.js))
Tracks user details, roles, total scans counts, and last login timestamps:
```javascript
{
  fullName: String,
  email: String,
  imageUrl: String,
  role: { type: String, default: "user" },
  lastLoginAt: Date,
  scansCount: { type: Number, default: 0 },
  latestScan: { type: mongoose.Schema.Types.ObjectId, ref: "ScanReport" }
}
```

### ScanReport Model ([models/scanReport.js](file:///e:/SGP4/Sgp-2/models/scanReport.js))
Stores multi-page crawl lists, violation payloads, and overall health reports:
```javascript
{
  reportId: { type: String, required: true, unique: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  baseUrl: { type: String, required: true },
  startedAt: { type: Date, required: true },
  finishedAt: { type: Date },
  pages: [{
    url: String,
    violations: [ViolationItemSchema],
    meta: {
      passesCount: Number,
      incompleteCount: Number,
      inapplicableCount: Number,
      tags: [String],
      scanError: Boolean,
      errorMessage: String,
      originalError: String
    }
  }],
  summary: {
    pages: Number,
    totalNodes: Number,
    totalRules: Number,
    byImpactNodes: {
      minor: Number,
      moderate: Number,
      serious: Number,
      critical: Number,
      "needs-review": Number
    },
    byCategoryNodes: {
      perceivable: Number,
      operable: Number,
      understandable: Number,
      robust: Number
    },
    topRules: [{ rule: String, nodes: Number }]
  }
}
```

### ScanAuthProfile Model ([models/scanAuthProfile.js](file:///e:/SGP4/Sgp-2/models/scanAuthProfile.js))
Saves encrypted auth configurations per host domain origin:
```javascript
{
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  origin: { type: String, required: true },
  method: { type: String, required: true }, // "credentials" | "session"
  loginUrl: { type: String, default: "" },
  encryptedPayload: { type: String, required: true }, // AES-256-GCM
  lastUsedAt: { type: Date },
  lastAuthSuccessAt: { type: Date },
  lastAuthError: { type: String, default: "" }
}
```

---

## 🎨 Design Tokens & Color Systems

We use a **Clinical Brutalist HUD** styling strategy:

| Variable | Light Theme Value | Dark Theme Value | Purpose / Description |
| :--- | :--- | :--- | :--- |
| `--primary` | `#004d4b` | `#86d4d0` | Primary brand/heading color |
| `--secondary` | `#006d40` | `#ffffff` | Accent / Success state text |
| `--secondary-container` | `#00f999` | `#36ffc4` | Accent / Success state background |
| `--tertiary` | `#434545` | `#ffb693` | Legal Risk status labels |
| `--error` | `#ba1a1a` | `#ffb4ab` | High impact errors |
| `--error-container` | `#ffdad6` | `#93000a` | Background container for errors |
| `--surface` | `#f8fafa` | `#131313` | Main screen background |
| `--surface-container` | `#eceeee` | `#201f1f` | Card and component surfaces |

> [!NOTE]
> Theme colors should never be applied with standard Tailwind CSS prefix classes like `dark:bg-black`. Instead, read the reactive `darkMode` state using `useTheme()` to apply conditional templates: `className={darkMode ? "bg-cx-surface-container" : "bg-white"}`.

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** 18 or above.
- **MongoDB** (Atlas Cloud instance or a local daemon).

### Step-by-Step Installation

1. **Clone and Install dependencies**
   ```bash
   npm install
   ```

2. **Configure Environment Variables**
   Create a [.env.local](file:///e:/SGP4/Sgp-2/.env.local) file in the root directory:
   ```env
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=generate-a-random-base64-key-here
   GITHUB_ID=your-github-oauth-client-id
   GITHUB_SECRET=your-github-oauth-client-secret
   GOOGLE_ID=your-google-oauth-client-id
   GOOGLE_SECRET=your-google-oauth-client-secret
   MONGODB_URI="mongodb+srv://USER:PASS@cluster-url/dbname?retryWrites=true&w=majority"
   SCAN_AUTH_ENCRYPTION_KEY=your-aes-256-gcm-secret-key
   ```

   > [!TIP]
   > To generate a secure `NEXTAUTH_SECRET` on Windows PowerShell, run:
   > ```powershell
   > node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
   > ```

3. **Install Puppeteer Browsers**
   ```bash
   npx puppeteer install
   ```

4. **Launch Development Server**
   ```bash
   npm run dev
   ```
   Open `http://localhost:3000` in your web browser.

---

## 📟 Command Line Interface (CLI) Scan Utility

AccessibilityGuard includes a CLI scanner script ([actions/backend.js](file:///e:/SGP4/Sgp-2/actions/backend.js)) that runs outside of the Next.js web application. You can execute crawls directly from your terminal and save reports to MongoDB:

```bash
npm run scan -- --url https://your-site.com --max-pages 20 --concurrency 2 --json ./.scan-results
```

### CLI Parameters
- `--url`: (Required) The start URL to crawl.
- `--max-pages`: Maximum number of pages to discover (default: `50`).
- `--concurrency`: Number of concurrent Puppeteer page workers (default: `2`).
- `--delay`: Delay in milliseconds between page scans (default: `1000`).
- `--include`: Glob filter for page paths to include.
- `--exclude`: Glob filter for page paths to exclude.
- `--wait-ms`: Page loading settle timer in milliseconds (default: `4000`).
- `--json`: Local directory path to export report/summary JSON files.

---

## 🔌 Using the Browser Session Extension

To scan pages behind strict authentication walls:

1. Open Chrome and navigate to `chrome://extensions/`.
2. Toggle on **Developer mode** (top-right).
3. Click **Load unpacked** and select the [browser-extension](file:///e:/SGP4/Sgp-2/browser-extension) directory in this repo.
4. Go to the target site, log in manually using your browser.
5. In AccessibilityGuard Scanner setup, input the target URL, click **Import Session**, and the extension will securely synchronize active cookies and store sessions directly into your profile.

---

## 🩺 Resilient Error Classification Reference

When a crawl fails to open a page, [actions/lib/reporter.js](file:///e:/SGP4/Sgp-2/actions/lib/reporter.js) maps the internal Chrome exception to clean user notifications:

| Error Code | Classification | Trigger Pattern | UI Friendly Message |
| :--- | :--- | :--- | :--- |
| `AUTH_FAILED` | Authentication | Login failure / wrong credentials | Login failed - verify username or password fields |
| `SSL_ERROR` | SSL Certificate | `ERR_CERT_AUTHORITY_INVALID` | SSL certificate issue - website certificate could not be verified |
| `CONNECTION_REFUSED` | Network | `ERR_CONNECTION_REFUSED` | Connection refused - target website is offline or blocking requests |
| `URL_NOT_FOUND` | DNS | `ERR_NAME_NOT_RESOLVED` | Website not found - domain name could not be resolved |
| `TIMEOUT` | Performance | `Navigation timeout` | Connection timed out - website took too long to load |
| `PAGE_NOT_FOUND` | HTTP Status | `HTTP 404` | Page not found (404) - this URL does not exist |
| `ACCESS_FORBIDDEN` | Restriction | `HTTP 403` | Access forbidden (403) - page has scanning restrictions |

---

## ❓ Troubleshooting

* **Hydration Mismatch Warnings**
  * The custom brutality theme is loaded client-side via LocalStorage initialization. Avoid using Tailwind `dark:` selectors directly on root server components; verify component logic renders dynamically using the reactive `darkMode` boolean.
* **Scan fails due to certificate issues**
  * The crawler automatically passes flags like `--ignore-certificate-errors` inside Puppeteer initialization to bypass SSL errors, but logs a friendly warning flag in the pages list.
* **Encryption Key Error**
  * Make sure `SCAN_AUTH_ENCRYPTION_KEY` is configured in your `.env.local` to enable credential storage.

---

## 🗺️ Roadmap

- [ ] Timeline graph showing historical accessibility metrics on the Dashboard.
- [ ] Direct export to Excel and HTML formats.
- [ ] Advanced selector configuration to exclude specific DOM sub-sections from scans.
- [ ] Lighthouse integration to scan mobile viewport performance alongside accessibility audits.