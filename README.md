# 🖥️ SoulSync Y2K Edition

> Your personal space for emotional reflection and growth, with a nostalgic Windows 95 twist.

SoulSync is a modern mood journaling application that helps you track and understand your emotional journey, wrapped in a delightfully retro interface. With its thoughtfully designed Windows 95-inspired UI, it transforms daily reflections into meaningful insights while taking you back to simpler times.

![Made with React](https://img.shields.io/badge/Made_with-React-61DAFB.svg?style=flat&logo=react)
![Powered by Node.js](https://img.shields.io/badge/Powered_by-Node.js-339933.svg?style=flat&logo=node.js)
![Styled with Material-UI](https://img.shields.io/badge/Styled_with-MUI-007FFF.svg?style=flat&logo=mui)
![PostgreSQL Database](https://img.shields.io/badge/Database-PostgreSQL-336791.svg?style=flat&logo=postgresql)

## Demo
- Email: testuser789@example.com
- Password: TestPassword789!

## ✨ Features

### 🎨 Expressive Mood Tracking
- Seven distinct mood states in classic emoticon style
- Rich text journaling with titles and custom tags
- Intuitive interface with retro window design

### 🖼️ Retro-Inspired Design
- Authentic Windows 95 aesthetic
- Classic window frames and buttons
- CRT screen effects and scanlines
- Pixel-perfect icons and typography
- Nostalgic color palette

### 🎭 Personalized Experience
- Light and dark themes inspired by classic OS color schemes
- Custom-styled components with retro shadows and borders
- Responsive design that maintains the vintage feel across devices

### 🔒 Privacy First
- Secure user authentication
- Personal data encryption
- Private journal entries

## 🚀 Getting Started

### Prerequisites
- Node.js 16.x or higher
- PostgreSQL 13.x or higher
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone https://github.com/ReplicantCoder9000/projectSoulSync.git
cd projectSoulSync
```

2. Install dependencies for both client and server
```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

3. Set up environment variables
```bash
# Server (.env)
PORT=3001
DATABASE_URL=postgresql://username:password@localhost:5432/soulsync
JWT_SECRET=your_jwt_secret

# Client (.env)
VITE_API_URL=http://localhost:3001
```

4. Initialize the database
```bash
cd ../server
npx sequelize-cli db:migrate
```

5. Start the development servers
```bash
# Start the server (from server directory)
npm run dev

# Start the client (from client directory)
npm run dev
```

## 🛠️ Tech Stack

### Frontend
- **React** with Vite for lightning-fast development
- **Redux Toolkit** for state management
- **Material-UI** with custom Windows 95 theme system
- **Custom CSS** for authentic retro styling

### Backend
- **Node.js** with Express
- **PostgreSQL** with Sequelize ORM
- **JWT** for secure authentication
- **RESTful API** architecture

## 📁 Project Structure

```
soulsync/
├── client/                # Frontend React application
│   ├── src/
│   │   ├── components/   # Reusable UI components
│   │   ├── hooks/       # Custom React hooks
│   │   ├── pages/       # Main application pages
│   │   ├── services/    # API service layer
│   │   ├── store/       # Redux store configuration
│   │   └── styles/      # Retro theme and styling
│   
└── server/               # Backend Node.js application
    ├── src/
    │   ├── config/      # Configuration files
    │   ├── controllers/ # Route controllers
    │   ├── middleware/  # Custom middleware
    │   ├── models/      # Sequelize models
    │   └── routes/      # API routes
```

## 🎯 Core Features

### Mood Tracking
- Quick-select from seven carefully chosen moods with retro emoticons
- Add context with journal entries in classic window frames
- Tag system for better organization

### Retro Theme System
- Authentic Windows 95 color schemes
- Pixel-perfect component styling
- CRT and scanline effects for immersion
- Classic window decorations and controls

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details on how to:
- Submit bug reports
- Request features
- Submit pull requests

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

<p align="center">Made with ❤️ for better emotional awareness, powered by nostalgia</p>
