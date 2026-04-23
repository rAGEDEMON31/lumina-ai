# ✨ Lumina AI

### *Transform Ideas into Reality with AI & AR*

[![Node.js](https://img.shields.io/badge/Node.js-v14+-green.svg)](https://nodejs.org/)
[![Vite](https://img.shields.io/badge/Vite-React-blue.svg)](https://vitejs.dev/)
[![Gemini AI](https://img.shields.io/badge/Powered%20by-Gemini%20AI-orange.svg)](https://ai.google.dev/)

</div>

---

## 📖 About

Lumina AI is a cutting-edge AI-powered design and augmented reality platform designed to revolutionize how creators bring their visions to life. Leveraging advanced AI algorithms and immersive AR technology, Lumina AI empowers designers, artists, and creators to collaborate, innovate, and produce stunning visual content with unprecedented ease.

---

## 👥 Built by

<div align="center">

| **Kunal Sampat** | **Maithili Pawar** | **Zulfikar Parihar** |
|:---:|:---:|:---:|
| *Full Stack Developer* | *UI/UX Designer* | *AI Integration Specialist* |

</div>

---

## ✨ Key Features

<table>
<tr>
<td>🤖 <b>AI-Powered Design</b><br>Intelligent design suggestions powered by Gemini AI</td>
<td>🥽 <b>AR Visualization</b><br>Immersive augmented reality preview of designs</td>
</tr>
<tr>
<td>🎨 <b>Advanced Canvas Designer</b><br>Intuitive drag-and-drop design interface</td>
<td>💡 <b>Inspiration Hub</b><br>Curated design inspiration and references</td>
</tr>
<tr>
<td>🔗 <b>Seamless Sharing</b><br>Easy project sharing and collaboration</td>
<td>🔐 <b>Secure Authentication</b><br>Firebase-backed user authentication</td>
</tr>
</table>

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** v14.0 or higher
- **npm** or **yarn** package manager
- **Gemini API Key** ([Get one here](https://ai.google.dev/))

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd lumina-ai

# Install dependencies
npm install

# Configure environment variables
cp .env.local.example .env.local
```

### Environment Setup

Create a `.env.local` file in the root directory:

```env
VITE_GEMINI_API_KEY=your_api_key_here
```

### Development Server

```bash
npm run dev
```

The application will be available at **`http://localhost:5173`** (or your configured port)

### Production Build

```bash
npm run build
npm run preview
```

---

## 📁 Project Structure

```
lumina-ai/
├── src/
│   ├── pages/              # Application pages
│   ├── components/         # Reusable components
│   ├── context/            # React Context API
│   ├── services/           # External service integrations
│   ├── lib/                # Utility libraries
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── public/                 # Static assets
├── vite.config.js          # Vite configuration
├── tsconfig.json           # TypeScript configuration
└── package.json            # Project dependencies
```

---

## 🛠️ Technology Stack

| Category | Technologies |
|----------|--------------|
| **Frontend** | React.js, Vite, TailwindCSS |
| **Backend** | Firebase, Node.js |
| **AI/ML** | Google Gemini API |
| **AR** | Three.js, WebXR API |
| **Database** | Firestore |
| **Authentication** | Firebase Auth |

---

## 🔧 Available Scripts

```bash
# Start development server with hot reload
npm run dev

# Build for production
npm run build

# Preview production build locally
npm run preview

# Install dependencies
npm install

# Update dependencies
npm update
```

---

## 📚 Documentation

- **AI Integration**: See [services/gemini.js](services/gemini.js)
- **AR Features**: Check [pages/ARView.jsx](pages/ARView.jsx)
- **Authentication**: Review [context/AuthContext.jsx](context/AuthContext.jsx)
- **Firebase Setup**: Refer to [lib/firebase.js](lib/firebase.js)

---

<div align="center">

**Made with ❤️ by Kunal Sampat, Maithili Pawar, and Zulfikar Parihar**

⭐ If you find this project helpful, please consider giving it a star!

</div>
