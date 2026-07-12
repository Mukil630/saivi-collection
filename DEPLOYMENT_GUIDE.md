# 🚀 SAVI'S Collection Deployment & Hosting Guide (Frontend Only)

This document contains the step-by-step instructions to deploy and host the SAVI'S Collection clothing store app completely on **Vercel** as a 100% frontend-only static web application.

---

## 📋 Current Project Status
- **Architecture:** 100% Frontend-only.
- **API Simulation:** The application runs an in-browser mock API using `localStorage` to simulate the backend. Orders, inquiries, and customer registries are stored directly in the user's browser, making the site fully operational without needing a backend server!
- **Data Source:** Initial products catalog is read from [products.json](file:///E:/nama%20startups/frontend/src/products.json).
- **GitHub Repository:** Pushed to `https://github.com/Mukil630/saivi-collection.git`

---

## 💻 Step 1: Deploy on Vercel

Vercel hosts the React client app and builds the static assets.

### Vercel Configuration Settings:
1. **Import Project:** Select the `saivi-collection` repository on Vercel.
2. **Settings:**
   - **Project Name:** `saivi-collection`
   - **Framework Preset:** `Vite` (Auto-detected)
   - **Root Directory:** Leave as the root directory (do not change it, Vercel will build from the root using our modified [vercel.json](file:///E:/nama%20startups/vercel.json)).
   - **Build and Output Settings:** Keeping the defaults is fine because they are handled by the [vercel.json](file:///E:/nama%20startups/vercel.json) in the root.

Click **Deploy**!

---

## 💾 Data Persistence & Mock API Details
* **Mock DB Initialization:** On first load, the app automatically seeds `localStorage` with products from [products.json](file:///E:/nama%20startups/frontend/src/products.json).
* **State Preservation:** Cart, orders, user accounts, and inquiries persist in the browser's `localStorage` across page reloads.
* **Images:** Product images are loaded directly from the `public/uploads` directory.

---
*Updated on 2026-07-09.*
