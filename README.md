# Secret Sharer

A secure, client-side web application for sharing confidential information using split QR codes. The application encrypts sensitive data and splits it across two QR codes, ensuring that both are required to access the information.

**[Live Demo →](https://robinweitzel.github.io/secret_sharer/)**

---

## ⚠️ Important Disclaimer

**This project was developed with the assistance of AI (Claude Code).** While the code has been tested and follows security best practices, users should thoroughly review and audit the code themselves before using it for sensitive information. This is open-source software provided as-is, and you use it at your own risk.

---

## Why This Exists

Imagine you need to leave important passwords or confidential information with family members for emergencies—like bank account access if you're unavailable or incapacitated. Simply printing passwords on paper creates a significant security risk: anyone who finds it could access your accounts.

Secret Sharer solves this problem by splitting your information into two parts:
- **Part 1**: The encrypted data (QR code)
- **Part 2**: The decryption key (QR code)

Store these in two different physical locations (e.g., one at home, one with family). Without both parts, the information is completely unusable and secure.

## How It Works

### High-Level Process

1. **Encryption**: Enter your confidential information on the website
2. **Generation**: The app encrypts and compresses the data, then generates two QR codes
3. **Printing**: Print both QR codes on separate pages with clear instructions
4. **Storage**: Store each page in a different physical location
5. **Recovery**: When needed, scan both QR codes to decrypt and view the information

### Technical Implementation

- **Client-side only**: All encryption/decryption happens in your browser—no data is ever sent to a server
- **Split architecture**: One QR code contains the encrypted data, the other contains the encryption key
- **Service Worker**: Temporarily stores scanned data during the two-step scanning process
- **Automatic cleanup**: All stored data is cleared after successful decryption or errors

The website is completely static with no backend, making it transparent and trustworthy.

## Security Features

- **AES-256-GCM encryption**: Industry-standard symmetric encryption
- **Client-side processing**: Your data never leaves your device
- **Compression**: Data is compressed before encryption to minimize QR code size
- **Two-factor security**: Both QR codes are required; one alone reveals nothing
- **Automatic cleanup**: Temporary data is cleared after use

### Technical Details

- Encryption: AES-256-GCM with random IV (first 12 bytes)
- Compression: gzip compression before encryption
- Encoding: Base64 encoding for QR code compatibility
- QR Codes: One contains encrypted data, the other contains the encryption key

## Technologies Used

### Core Stack
- **TypeScript**: Type-safe application code
- **HTML/CSS**: Structure and styling
- **Tailwind CSS**: Modern, utility-first styling
- **Vite**: Fast build tool and dev server

### Libraries
- **qrcode**: QR code generation
- **jsPDF**: PDF generation for printable documents
- **Web Crypto API**: Browser-native encryption (AES-256-GCM)
- **Compression Streams API**: Browser-native gzip compression

### Hosting
- **GitHub Pages**: Free, reliable static hosting

## Features

### Encryption Page
- User-friendly interface for entering confidential information
- Real-time QR code generation
- Downloadable PDF with both QR codes and instructions
- Print-optimized layouts

### Decryption Page
- Step-by-step visual progress indicator
- Mobile-friendly QR code scanning
- Clear instructions for non-technical users
- Error handling with automatic state reset
- Copy-to-clipboard functionality

### Generated PDFs
- Two-page document with clear separation
- User instructions on each page
- Space to note the location of the other document
- Professional, easy-to-follow layout
- Neutral language (doesn't assume scanner created the document)

## Development Setup

### Prerequisites
- Node.js (v18 or higher recommended)
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/robinweitzel/secret_sharer.git
cd secret_sharer

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

The development server will start at `http://localhost:5173` (default Vite port).

## Project Structure

```
secret_sharer/
├── src/
│   ├── pages/
│   │   ├── decrypt.ts       # Decryption page logic
│   │   └── encrypt.ts       # Encryption page logic
│   ├── crypto.ts            # Encryption/decryption utilities
│   ├── compression.ts       # Compression/decompression
│   ├── qrcode.ts           # QR code generation
│   ├── pdf.ts              # PDF generation
│   ├── utils.ts            # Utility functions
│   ├── serviceWorker.ts    # Service worker for data storage
│   └── style.css           # Global styles
├── index.html              # Landing page
├── encrypt.html            # Encryption interface
├── decrypt.html            # Decryption interface
└── public/                 # Static assets
```

## Building and Deployment

### Build

```bash
npm run build
```

This compiles TypeScript and bundles the application into the `dist/` directory.

### Deploy to GitHub Pages

1. Build the project: `npm run build`
2. Commit the `dist/` directory
3. Configure GitHub Pages to serve from the `dist/` folder (or use a GitHub Action)

Alternatively, use the `gh-pages` package:

```bash
npm install -D gh-pages
npx gh-pages -d dist
```

## Browser Compatibility

Requires a modern browser with support for:
- Web Crypto API (AES-GCM)
- Compression Streams API
- Service Workers
- ES6+ JavaScript

Tested on:
- Chrome/Edge 90+
- Firefox 90+
- Safari 15+
- Mobile browsers (iOS Safari, Chrome Android)

## Privacy & Security Considerations

- **No telemetry**: The application doesn't collect any data
- **No external requests**: All processing happens locally
- **Open source**: The code is fully transparent and auditable
- **No dependencies at runtime**: All libraries are bundled at build time

### Recommendations

- Print QR codes immediately after generation
- Store printed documents in secure, separate locations
- Delete digital copies of the encrypted data after printing
- Test the recovery process to ensure both QR codes work
- Keep printed documents in fire-proof/water-proof containers if possible

## License

This project is open source and available under the MIT License.
