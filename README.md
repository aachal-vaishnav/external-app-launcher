
# External App Launcher Widget

Nextcloud Dashboard Widget to launch external apps from a centralized interface

---

## 📌 Project Overview

Modern teams use multiple SaaS tools like Google Meet, Zoom, Trello, GitHub, etc. Switching between platforms is time-consuming. This widget consolidates all external apps into a single dashboard, reducing context-switching and improving productivity.

**Key Features:**

- Add app name, URL, icon, and category  
- Remove or edit existing apps  
- Launch apps in sandboxed iframe or new tab  
- Track app usage counts  
- Optional OAuth credentials for private apps  

---

## 🛠️ Technology Stack

| Layer      | Technology           | Purpose                                |
|-----------|--------------------|----------------------------------------|
| Frontend  | Vue.js 3           | UI framework & components               |
| Backend   | Node.js + Express  | API endpoints, authentication           |
| Database  | JSON files          | Simple storage (users.json, apps.json) |
| Build Tool| Vite                | Modern frontend build system            |
| Styling   | TailwindCSS / CSS   | Responsive UI design                    |
| Security  | iFrame sandbox, JWT | Secure app access & authentication      |

---

## 🏗 System Architecture & Flow

**Architecture Flow:**  

```

User Dashboard (Nextcloud)
↓
Vue.js Frontend Widget
(AddAppForm, AppItem, PreviewOverlay)
↓
Node.js Backend API
(/api/apps, /api/auth, /api/apps/\:id/usage, /api/oauth)
↓
JSON Storage Files (users.json, apps.json)

````

**Operations Flow:**

1. User registers or logs in  
2. Frontend fetches apps from backend  
3. User adds a new app → frontend validates URL → backend stores data  
4. User clicks an app → opens in sandboxed iframe or new tab  
5. Usage count updated via API  
6. Import/export app packs in JSON  
7. Optional: OAuth credentials stored securely  

---

## ⚙️ Setup Guide 

### Prerequisites

- Node.js v20.x recommended  
- npm 10.x or compatible  
- Git installed  

> ⚠️ Different Node versions may show warnings; safe to ignore.

### Git Clone

```bash
git clone https://github.com/aachal-vaishnav/external-app-launcher.git
cd external-app-launcher
````

### Backend Setup

```bash
cd backend
npm install
npm start
```

* Default backend runs at: [http://localhost:5000](http://localhost:5000)

### Frontend Setup

Open a new terminal:

```bash
cd frontend
npm install
npm run dev
```

* Vite dev server runs at: [http://localhost:5173](http://localhost:5173)

### Access App

1. Open browser → [http://localhost:5173](http://localhost:5173)
2. Register a user → login
3. Add, edit, remove apps
4. Preview apps in iframe or new tab

### Common Warnings

* LF → CRLF (Windows only): safe to ignore
* npm peer dependency warnings: app works fine

### Optional Production Build

```bash
cd frontend
npm run build
```

* Built files go to `/frontend/dist`
* Can serve with any static server

**Notes:**

* Backend must run before frontend
* Ensure port 5000 is free
* All frontend API calls point to [http://localhost:5000](http://localhost:5000)

---

## 🎨 User Interface

* Clean dashboard showing apps with icons & categories
* Buttons: Open, Preview, Edit, Delete
* Add apps via simple form
* Suggestions panel for popular apps
* Resizable iframe previews

---

## ✅ Advantages

* Centralized app management
* Secure integration via sandbox
* Customizable with categories and icons
* Track usage of apps
* Future-proof: easy OAuth/API integration
* Offline safe: local icons

---

## ⚠️ Challenges & Solutions

| Challenge                         | Solution                               |
| --------------------------------- | -------------------------------------- |
| Embedding external sites securely | Sandboxed iframes, validate HTTPS URLs |
| Handling missing icons            | Default local placeholder icons        |
| OAuth integration                 | Dedicated popup, store encrypted token |
| Offline access                    | Cache apps locally via localStorage    |

---

## 🔮 Future Improvements

* OAuth integration for private SaaS apps
* Drag-and-drop app arrangement
* App category filters and search
* Real database integration (PostgreSQL/MySQL)
* Notifications for app updates

---

## 🖥️ PPT
https://docs.google.com/presentation/d/1rJshNU9z90KRlO3MfIOUX_fFTJrhIYvc/edit?usp=drivesdk&ouid=102920655261926211027&rtpof=true&sd=true
---

## 📚 References

* Nextcloud Developer Documentation
* Vue.js Official Guide
* iFrame Security
* OAuth 2.0 Documentation

---

This repository contains both frontend and backend for the External App Launcher Widget.
Follow the setup guide above to run the app locally.


