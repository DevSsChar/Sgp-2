# AccessibilityGuard Session Import Extension

Helper add-on for authenticated scans. End users download it from the live Scanner page — they do not need the project source code.

## For end users (after the site is deployed)

1. On the Scanner page, open **With Login** → **Import Browser Session**.
2. Click **Download extension (ZIP)**.
3. Unzip the file on your computer.
4. Open `chrome://extensions` (Chrome) or `edge://extensions` (Edge).
5. Enable **Developer mode**.
6. Click **Load unpacked** and select the **unzipped folder** (the one containing `manifest.json`).
7. Log into the target website in another tab, enter that URL in Scanner, then click **Import Current Session**.

Download URL on a deployed site:

`https://YOUR-DOMAIN/extensions/accessibilityguard-session-import.zip`

## For developers

Source lives in `browser-extension/`. Packing for the website:

```bash
npm run pack:extension
```

This copies files into `public/extensions/session-import/` and builds the ZIP users download. `npm run build` runs packing automatically.
