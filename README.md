# VoxEcho

**Truth. Community. Signal over noise. VoxEcho is real‑time incident reporting, reimagined.**

---

## 📌 Overview

VoxEcho is a web platform to **report, verify, and track** local incidents—accidents, protests, traffic jams, or community events—in real time. Leveraging community voting and media uploads, VoxEcho delivers trusted, geo‑tagged updates.

This app is built to **empower communities**, **disrupt misinformation**, and **speed up awareness** through a participatory trust mechanism.

---

## 🚀 Core Features

- 📍 **Geo‑tagged incident reporting**  
- 🗳️ **Voting system for verification**  
- 💬 **Threaded comments**  
- 🖼️ **Media uploads (photos/videos)**  
- 🔁 **Live map & feed**  
- 🧠 **User reputation/trust scoring**  
- 🧪 **Mobile‑first responsive UI**  

---

## 🧱 Tech Stack

**Frontend**  
- React · Tailwind CSS · shadcn/ui · TypeScript

**Backend**  
- NestJS · PostgreSQL · WebSockets/Firebase

**DevOps**  
- GitHub Actions · Vercel/Railway · ESLint/Prettier · Jest  

---

## 🛠️ Getting Started

1. **Clone**  
   ```bash
   git clone https://github.com/DevMatrix/VoxEcho.git
   cd VoxEcho
   ```

2. **Env Setup**  
   ```bash
   cp .env.example backend/.env
   cp .env.example frontend/.env
   ```
   Fill in your secrets (DB, Firebase, etc.).

3. **Install & Run**  
   - Backend  
     ```bash
     cd backend
     npm install
     npm run start:dev
     ```
   - Frontend  
     ```bash
     cd frontend
     npm install
     npm run dev
     ```

---

## 👥 Contributing

We welcome all contributions! Please read [CONTRIBUTING.md](./CONTRIBUTING.md) before submitting.

---

## 📄 License

This project is licensed under the MIT License — see [LICENSE](./LICENSE).

---

