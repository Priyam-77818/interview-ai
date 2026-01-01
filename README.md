# InterviewAI 🚀

An AI-powered interview preparation platform that generates personalized interview strategies, technical & behavioral questions, skill gap analysis, and a day-by-day prep roadmap — all in under 30 seconds.

![InterviewAI](https://img.shields.io/badge/Powered%20by-Gemini%20AI-7c3aed?style=for-the-badge)
![Stack](https://img.shields.io/badge/Stack-React%20%2B%20Node.js%20%2B%20MongoDB-a855f7?style=for-the-badge)

---

## ✨ Features

| Feature | Description |
|---|---|
| 🎯 **AI Match Score** | 0–100 compatibility score between your profile and the job description |
| ❓ **Tailored Questions** | Technical & behavioral questions specific to the job role |
| 📅 **Day-by-Day Roadmap** | Personalized prep plan telling you exactly what to study each day |
| 🎤 **Mock Interview Mode** | Practice answers and get instant AI scoring with feedback |
| 📄 **Resume PDF Generator** | AI rewrites your resume tailored to the job — ATS-friendly |
| 🔍 **Skill Gap Analysis** | Identifies missing skills with severity levels (low / medium / high) |
| 🗑️ **Report Management** | Search, filter, and delete past interview plans |
| 🔔 **Toast Notifications** | Real-time feedback on all actions |

---

## 🛠️ Tech Stack

**Frontend**
- React 19 + React Router v7
- SCSS (custom design system)
- Axios
- Vite

**Backend**
- Node.js + Express 5
- MongoDB + Mongoose
- JWT Authentication (HTTP-only cookies)
- Multer (file uploads)
- pdf-parse (resume text extraction)
- Puppeteer (PDF generation)
- Google Gemini AI (`gemini-3-flash-preview`)
- Zod (schema validation)

---

## 📁 Project Structure

```
interview-ai/
├── Backend/
│   ├── src/
│   │   ├── controllers/     # auth & interview controllers
│   │   ├── middlewares/     # auth guard, file upload
│   │   ├── models/          # User, InterviewReport, Blacklist
│   │   ├── routes/          # auth & interview routes
│   │   ├── services/        # Gemini AI service
│   │   └── config/          # MongoDB connection
│   └── server.js
└── Frontend/
    └── src/
        ├── features/
        │   ├── auth/        # Login, Register, context, hooks
        │   └── interview/   # Home, Interview pages, hooks, services
        ├── components/      # Toast notifications
        └── App.jsx
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- MongoDB Atlas account
- Google Gemini API key ([get one here](https://aistudio.google.com/apikey))

### 1. Clone the repo
```bash
git clone https://github.com/Priyam-77818/interview-ai.git
cd interview-ai
```

### 2. Set up Backend
```bash
cd Backend
npm install
```

Create a `.env` file in the `Backend` folder:
```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
GOOGLE_GENAI_API_KEY=your_gemini_api_key
```

Start the backend:
```bash
npm run dev
```
> Runs on `http://localhost:3000`

### 3. Set up Frontend
```bash
cd Frontend
npm install
npm run dev
```
> Runs on `http://localhost:5173`

---

## 🔌 API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login |
| GET | `/api/auth/logout` | Logout |
| GET | `/api/auth/get-me` | Get current user |

### Interview
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/interview/` | Generate interview report |
| GET | `/api/interview/` | Get all reports |
| GET | `/api/interview/report/:id` | Get report by ID |
| DELETE | `/api/interview/:id` | Delete a report |
| POST | `/api/interview/resume/pdf/:id` | Generate resume PDF |
| POST | `/api/interview/score-answer` | Score a mock interview answer |

---

## 📸 Screenshots

### Home Page
- Two-column hero with live dashboard preview
- AI-powered feature cards
- Customer testimonials
- How it works section

### Interview Results Page
- SVG arc match score ring
- Tabbed view: Technical / Behavioral / Roadmap / Mock Interview
- Sidebar with skill gap tags and stats

---

## 🤝 Contributing

Pull requests are welcome. For major changes, please open an issue first.

---

## 📄 License

MIT © [Priyam-77818](https://github.com/Priyam-77818)
