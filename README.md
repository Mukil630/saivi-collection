# 🛍️ SAVI'S COLLECTION | Premium E-Commerce Store
id=file_00000000156c71fabda8df29092cbbb4&ts=495561&p=fs&cid=1&sig=1b1f02f8a43b711f549dfedd7f966c70cfeab48c3472f1e7c657bbc6996bb266&v=0
**SAVI'S COLLECTION** is an ultra-modern, glassmorphic clothing and jewellery catalog website built using **Vite + React (Frontend)** and **Node.js Express (Backend)**, connected in real-time with **Supabase PostgreSQL** and **Supabase Storage**.

### 🔗 Live Production Links
- **Storefront Website (Vercel):** [https://savis-collection-bice.vercel.app](https://savis-collection-bice.vercel.app)
- **Backend API Server (Render):** [https://savis-collection-backend.onrender.com](https://savis-collection-backend.onrender.com)

## 🏗️ Architecture Design

- **Vite + React Frontend:** Premium glassmorphic storefront featuring a catalog, categories, product details modal, cart drawer, checkout forms, and WhatsApp notification integration.
- **Express.js API Backend:** Exposes REST routes for products, categories, orders, and inquiries, connected to Supabase.
- **Supabase Cloud Integration:** Uses Supabase PostgreSQL for persistent database storage and Supabase Storage for fast CDN-delivered product images.

---

## ⚡ Quick Start (Windows)

We have provided an automated launcher script `run.bat` at the root of the project. 

1. Double-click **`run.bat`** (or execute it in your terminal):
   ```cmd
   .\run.bat
   ```
2. Two command shell windows will spawn:
   - One running the **Express API & Telegram Bot** at `http://localhost:5000`
   - One running the **Vite React Web Server** at `http://localhost:5173`
3. Open `http://localhost:5173` in your browser to view the premium storefront.

---

## 🤖 Telegram Bot Configuration (Owner Guide)

To manage your clothing catalog and receive notifications when orders are placed, connect your custom Telegram Bot:

### Step 1: Create a Bot
1. Open Telegram and search for `@BotFather`.
2. Send the command `/newbot` and follow the instructions.
3. Copy the **API Token** provided (looks like `123456789:ABCdefGhIJKlmNoPQRsTUVwxyZ`).

### Step 2: Configure Environment Variables
1. Open `backend/.env` in your editor.
2. Replace `YOUR_TELEGRAM_BOT_TOKEN` with your copied token:
   ```env
   PORT=5000
   TELEGRAM_BOT_TOKEN=123456789:ABCdefGhIJKlmNoPQRsTUVwxyZ
   ```
3. Restart the backend server. The console monitor will log:
   `[BOT] Telegram Bot polling active. Listening for commands.`

### Step 3: Register as Store Administrator
1. Search for your bot in Telegram and click **Start** or send `/start`.
2. Send the command `/auth`.
3. The bot will respond:
   `👑 Authorized! You are now registered as a store administrator.`

---

## 📱 Bot Commands for Catalog Management

Once authorized, you can manage the store directly from your phone:

- **`/addproduct`**: Triggers a guided multi-step configuration:
  1. *Send Photo:* Upload the clothing image. The backend downloads it directly to server storage.
  2. *Set Name:* Input product name (e.g. *Retro Varsity Bomber*).
  3. *Set Description:* Input copy text.
  4. *Set Price:* Input numerical price (e.g. *149.00*).
  5. *Set Category:* Input category (e.g. *Outerwear*).
  - *The item is immediately visible on the website!*
- **`/list`**: View all listed items with their unique IDs and prices.
- **`/delete <product_id>`**: Remove a product from the database and clean up the image file.
- **`/orders`**: Review the 10 most recent customer checkout logs.
- **`Order Alerts`**: When a buyer fills out the checkout drawer and clicks "Confirm & Place Order", the bot instantly messages all authorized administrators with the customer details, shipping address, and itemized checkout receipt!
