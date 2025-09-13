# 🚀 External App Launcher Widget

A Nextcloud Dashboard Widget to launch external apps from a centralized interface.

---

## 📌 Overview

Modern teams use multiple SaaS tools like Google Meet, Zoom, Trello, GitHub, etc. Constantly switching between these platforms is time-consuming.
This widget consolidates all external apps into a single dashboard, reducing context-switching and improving team productivity.

---

### 🔑 Key Features

* Add app name, URL, icon, and category
* Edit or remove existing apps
* Launch apps in a sandboxed iframe or a new browser tab
* Track app usage counts
* Optional OAuth credentials for private apps

---

## 🛠️ Technology Stack

| Layer      | Technology          | Purpose                            |
| ---------- | ------------------- | ---------------------------------- |
| Frontend   | Vue.js 3            | UI components & reactive interface |
| Backend    | Node.js + Express   | RESTful API & authentication       |
| Database   | JSON files          | Simple local storage               |
| Build Tool | Vite                | Frontend bundling & dev server     |
| Styling    | Tailwind CSS / CSS  | Modern, responsive design          |
| Security   | iFrame sandbox, JWT | Secure app access & user sessions  |

---

## 🧩 System Architecture & Flow

### ⚙ Architecture Flow

```
User Dashboard (Nextcloud)
        ↓
Vue.js Frontend Widget  
(AddAppForm, AppItem, PreviewOverlay)
        ↓
Node.js Backend API  
(/api/apps, /api/auth, /api/apps/:id/usage, /api/oauth)
        ↓
JSON Storage Files  
(users.json, apps.json)
```

---

### 🔄 Operations Flow

1. User registers or logs in
2. Frontend fetches app list from backend
3. User adds an app → frontend validates → backend stores
4. Clicking an app opens it in iframe/new tab
5. Usage count is updated via API
6. Import/export app collections as JSON
7. OAuth credentials securely stored (optional)

---

## ⚙️ Setup Guide

### ✅ Prerequisites

* Node.js v20.x recommended
* npm v10.x or compatible
* Git installed

> ⚠️ Some warnings may appear for different Node versions — safe to ignore.

---

### 📁 Clone the Repository

```bash
git clone https://github.com/aachal-vaishnav/external-app-launcher.git
cd external-app-launcher
```

---

### 🖥 Backend Setup

```bash
cd backend
npm install
npm start
```

> Server runs at: [http://localhost:5000](http://localhost:5000)

---

### 🌐 Frontend Setup

Open a new terminal:

```bash
cd frontend
npm install
npm run dev
```

> Dev server runs at: [http://localhost:5173](http://localhost:5173)

---

### 🚀 Access the App

1. Visit: [http://localhost:5173](http://localhost:5173)
2. Register a user and log in
3. Add/edit/remove apps
4. Preview apps in iframe or new tab

---

### ⚠️ Common Warnings

* `LF → CRLF` line-ending warnings on Windows — safe to ignore
* npm peer dependency warnings — app works fine

---

### 🏁 Optional: Production Build

```bash
cd frontend
npm run build
```

> Files generated in `/frontend/dist` — serve using any static server

---

## 🎨 User Interface

* Clean dashboard with app icons and categories
* Action buttons: Open, Preview, Edit, Delete
* Add apps via user-friendly form
* Suggestions panel for popular tools
* Resizable iframe previews

---

## ✅ Benefits

* Centralized access to all external apps
* Secure sandboxed iframe integration
* Usage tracking for each app
* Fully customizable (icons, categories)
* Future-ready (OAuth, API tokens)
* Offline-safe (local icon support)

---

## ⚠️ Challenges & Solutions

| Challenge                         | Solution                             |
| --------------------------------- | ------------------------------------ |
| Securely embedding external sites | Sandboxed iframes & HTTPS validation |
| Missing app icons                 | Default fallback icons               |
| OAuth integration                 | Dedicated popup flow with encryption |
| Offline support                   | Cached apps via localStorage         |

---

## 🔮 Future Enhancements

* OAuth login for private SaaS apps
* Drag-and-drop app rearrangement
* Filter apps by category
* Real DB integration (PostgreSQL/MySQL)
* Push notifications or app updates

---

## 📽️ Presentation (PPT)

👉 [View the Presentation](https://docs.google.com/presentation/d/1rJshNU9z90KRlO3MfIOUX_fFTJrhIYvc/edit?usp=drivesdk&ouid=102920655261926211027&rtpof=true&sd=true)

---

## 📚 References

* [Nextcloud Developer Docs](https://docs.nextcloud.com/)
* [Vue.js Guide](https://vuejs.org/guide/)
* [iFrame Security](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/iframe)
* [OAuth 2.0 Docs](https://oauth.net/2/)

---

## 👩‍💻 Contributing

Want to contribute?
Fork the repo, make your changes, and submit a Pull Request.

---

This repository contains both the frontend and backend for the External App Launcher Widget.
Follow the setup guide above to run the app locally.

