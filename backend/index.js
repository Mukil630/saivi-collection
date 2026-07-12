import 'dotenv/config';
import dns from 'dns';
dns.setDefaultResultOrder('ipv4first');
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import { fileURLToPath } from 'url';
import { initDb, getProducts, addProduct, updateProduct, deleteProduct, addOrder, getOrders, updateOrderStatus, updateOrderPaymentStatus, deleteOrder, getUsers, addUser, getInquiries, addInquiry, deleteInquiry, updateProductStock, resetDatabase, getReviews, addReview, getCartActivity, addCartActivity, getHomepageSections, saveHomepageSections } from './db.js';
import { uploadImageToDrive } from './drive.js';
import { uploadImageToCloudinary, uploadLocalFileToCloudinary } from './cloudinary.js';
import { uploadToFirebaseStorage } from './firebase.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Custom request logger
app.use((req, res, next) => {
  console.log(`[API REQUEST] ${req.method} ${req.url} - ${new Date().toISOString()}`);
  next();
});

// --- Security Headers Middleware ---
app.use((req, res, next) => {
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  next();
});

// --- Health check endpoint (Railway / uptime monitors hit this) ---
// Placed BEFORE initDb() runs so it's registered immediately, and kept
// dependency-free so it responds even if the DB connection is slow/down.
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', uptime: process.uptime() });
});
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', uptime: process.uptime() });
});

// --- In-Memory Admin Login Rate Limiter (Brute-Force Protection) ---
const loginAttempts = new Map();
function adminLoginRateLimiter(req, res, next) {
  const ip = req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress;
  const now = Date.now();
  const attemptWindow = 15 * 60 * 1000; // 15 minutes
  const maxAttempts = 5;

  if (loginAttempts.has(ip)) {
    const attempts = loginAttempts.get(ip).filter(timestamp => now - timestamp < attemptWindow);
    if (attempts.length >= maxAttempts) {
      const waitTime = Math.ceil((attemptWindow - (now - attempts[0])) / 60000);
      return res.status(429).json({ 
        error: `Too many login attempts. Please try again in ${waitTime} minutes.` 
      });
    }
    attempts.push(now);
    loginAttempts.set(ip, attempts);
  } else {
    loginAttempts.set(ip, [now]);
  }
  next();
}

// --- Simple HTML Escaping for XSS Protection ---
function sanitizeInput(val) {
  if (typeof val === 'string') {
    return val
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }
  if (Array.isArray(val)) {
    return val.map(sanitizeInput);
  }
  if (val !== null && typeof val === 'object') {
    const sanitized = {};
    for (const key in val) {
      sanitized[key] = sanitizeInput(val[key]);
    }
    return sanitized;
  }
  return val;
}

// Serve static uploads
app.use('/uploads', express.static(path.join(__dirname, 'public', 'uploads')));

// Serve React production build statically if it exists
const distPath = path.join(__dirname, '..', 'frontend', 'dist');

if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));

  app.get('*', (req, res, next) => {
    if (req.url.startsWith('/api')) {
      return next();
    }
    res.sendFile(path.join(distPath, 'index.html'));
  });

} else {

  app.get('/', (req, res) => {
    res.send('Server is running');
  });

}

// --- Admin Authentication Middleware & Login ---
// In-memory active admin sessions
const activeSessions = new Set();

function requireAdminAuth(req, res, next) {
  const authHeader = req.headers['authorization'];
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    if (activeSessions.has(token)) {
      return next();
    }
  }
  res.status(401).json({ error: 'Unauthorized: Admin access required' });
}

app.post('/api/admin/login', adminLoginRateLimiter, (req, res) => {
  const { username, password } = req.body;
  const expectedUser = process.env.ADMIN_USERNAME || 'admin';
  const expectedPass = process.env.ADMIN_PASSWORD || 'siva@123';
  
  if (username === expectedUser && password === expectedPass) {
    const token = crypto.randomBytes(32).toString('hex');
    activeSessions.add(token);
    return res.json({ success: true, token });
  }
  res.status(401).json({ error: 'Invalid username or password' });
});

app.get('/api/admin/validate', requireAdminAuth, (req, res) => {
  res.json({ valid: true });
});

// API Routes
app.post('/api/users', async (req, res) => {
  try {
    const body = sanitizeInput(req.body);
    const { name, email, phone, address } = body;
    if (!email || !phone) {
      return res.status(400).json({ error: 'Email and phone number are required' });
    }
    const user = await addUser({ name, email, phone, address });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/users/login', async (req, res) => {
  try {
    const { emailOrPhone } = req.body;
    if (!emailOrPhone) {
      return res.status(400).json({ error: 'Email or phone number is required' });
    }
    const users = await getUsers();
    const query = emailOrPhone.trim().toLowerCase();
    const user = users.find(u => 
      (u.email && u.email.toLowerCase() === query) || 
      (u.phone && u.phone.replace(/\D/g, '') === query.replace(/\D/g, ''))
    );
    if (!user) {
      return res.status(404).json({ error: 'Account not found. Please register as a new customer!' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/users', requireAdminAuth, async (req, res) => {
  try {
    const users = await getUsers();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// --- Supabase Storage upload helper ---
async function uploadToSupabaseStorage(filename, buffer, mimeType) {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_KEY;
  if (!supabaseUrl || !supabaseKey) {
    return null;
  }
  const url = `${supabaseUrl}/storage/v1/object/savis-images/${filename}`;
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${supabaseKey}`,
        'Content-Type': mimeType,
        'x-upsert': 'true'
      },
      body: buffer
    });
    if (response.ok) {
      return `${supabaseUrl}/storage/v1/object/public/savis-images/${filename}`;
    } else {
      const errText = await response.text();
      console.error(`[SUPABASE UPLOAD] Failed to upload ${filename}:`, errText);
      return null;
    }
  } catch (err) {
    console.error(`[SUPABASE UPLOAD] Connection error:`, err.message);
    return null;
  }
}

// --- FIXED UPLOAD ROUTE ---
// Priority: Firebase -> Supabase -> Cloudinary -> Google Drive -> Local disk
// Local fallback now returns an ABSOLUTE url (backend domain), not a relative path,
// so images resolve correctly even when frontend is hosted on a different domain.
app.post('/api/upload', requireAdminAuth, async (req, res) => {
  try {
    const { imageBase64 } = req.body;
    if (!imageBase64) {
      return res.status(400).json({ error: 'No image data provided' });
    }

    // Parse Base64 to Buffer
    const matches = imageBase64.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    let base64Data = imageBase64;
    let extension = '.png';
    let mimeType = 'image/png';
    
    if (matches && matches.length === 3) {
      mimeType = matches[1];
      extension = '.' + mimeType.split('/')[1];
      if (extension === '.jpeg') extension = '.jpg';
      base64Data = matches[2];
    }
    
    const buffer = Buffer.from(base64Data, 'base64');
    const filename = `apparel_${Date.now()}${extension}`;

    // Read category/folder metadata if passed
    const reqFilename = req.body.filename;
    const folderId = req.body.folderId;

    // Try Google Drive Upload via Google Apps Script Web App
    const appsScriptUrl = process.env.GOOGLE_APPS_SCRIPT_URL || 'https://script.google.com/macros/s/AKfycbyNWy-gh3RJMjw9VJKgk1tSA2c_UV53pjFneSUb5aTLDFexRW5n1s7cCEoxNI1cW9gH8g/exec';
    if (appsScriptUrl) {
      try {
        console.log(`[UPLOAD] Sending image to Google Apps Script Web App (folder: ${folderId || 'default'})...`);
        const response = await fetch(appsScriptUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'text/plain;charset=utf-8'
          },
          body: JSON.stringify({
            imageBase64: imageBase64,
            filename: reqFilename || filename,
            folderId: folderId || '1w5gw8xvWBzXFBJyv366u3F1hEkLLpido'
          })
        });

        if (response.ok) {
          const data = await response.json();
          if (data.success && data.url) {
            console.log("[UPLOAD] ✅ Uploaded via Google Apps Script Web App directly to Google Drive:", data.url);
            return res.json({ success: true, imagePath: data.url });
          } else {
            console.warn("[UPLOAD] Google Apps Script Web App returned failure status:", data.error);
          }
        } else {
          console.warn("[UPLOAD] Google Apps Script Web App HTTP error:", response.status, response.statusText);
        }
      } catch (appsScriptErr) {
        console.warn("[UPLOAD] Google Apps Script upload failed, checking other methods...", appsScriptErr.message);
      }
    }

    // Try Supabase Storage Upload
    try {
      const supabaseURL = await uploadToSupabaseStorage(filename, buffer, mimeType);
      if (supabaseURL) {
        console.log("[UPLOAD] ✅ Uploaded via Supabase Storage:", supabaseURL);
        return res.json({ success: true, imagePath: supabaseURL });
      }
    } catch (supabaseErr) {
      console.warn("[UPLOAD] Supabase Storage upload failed, trying Firebase...", supabaseErr.message);
    }

    // Try Firebase Storage Upload (Only if FIREBASE_API_KEY is configured)
    if (process.env.FIREBASE_API_KEY && process.env.FIREBASE_API_KEY !== 'YOUR_FIREBASE_API_KEY') {
      try {
        const firebaseURL = await uploadToFirebaseStorage(filename, buffer, mimeType, 'products');
        if (firebaseURL) {
          console.log("[UPLOAD] ✅ Uploaded via Firebase Storage:", firebaseURL);
          return res.json({ success: true, imagePath: firebaseURL });
        }
      } catch (firebaseErr) {
        console.warn("[UPLOAD] Firebase Storage upload failed, trying Cloudinary...", firebaseErr.message);
      }
    }
    
    // Try Cloudinary Cloud Upload
    try {
      const cloudinaryUrl = await uploadImageToCloudinary(imageBase64);
      if (cloudinaryUrl) {
        console.log("[UPLOAD] ✅ Uploaded via Cloudinary:", cloudinaryUrl);
        return res.json({ success: true, imagePath: cloudinaryUrl });
      }
    } catch (cloudinaryErr) {
      console.warn("[UPLOAD] Cloudinary upload failed, trying Google Drive...", cloudinaryErr.message);
    }
    
    // Try Google Drive Cloud Upload
    try {
      const driveUrl = await uploadImageToDrive(filename, imageBase64);
      if (driveUrl) {
        console.log("[UPLOAD] ✅ Uploaded via Google Drive:", driveUrl);
        return res.json({ success: true, imagePath: driveUrl });
      }
    } catch (driveErr) {
      console.warn("[UPLOAD] Google Drive upload failed, falling back to local storage...", driveErr.message);
    }
    
    // Fallback: Local Server Storage
    const uploadsDir = path.join(__dirname, 'public', 'uploads');
    const uploadPath = path.join(uploadsDir, filename);
    
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }
    
    fs.writeFileSync(uploadPath, buffer);
    
    // Build an ABSOLUTE URL (backend domain), not a relative "/uploads/xxx.jpg" path.
    // Relative paths break when the frontend is on a different domain (Vercel/Netlify)
    // than the backend (Railway) — the browser resolves them against the frontend origin.
    const backendUrl = process.env.BACKEND_URL || `${req.protocol}://${req.get('host')}`;
    const absoluteImagePath = `${backendUrl}/uploads/${filename}`;
    
    console.warn(
      `[UPLOAD] ⚠️ Cloudinary, Google Drive & Firebase Storage all failed/unconfigured. ` +
      `Saved to LOCAL DISK (${absoluteImagePath}) — this file will be LOST on the next Railway redeploy. ` +
      `Fix your CLOUDINARY_* / GOOGLE_DRIVE_* env vars ASAP.`
    );
    
    res.json({ success: true, imagePath: absoluteImagePath });
  } catch (error) {
    console.error("[UPLOAD] Fatal upload error:", error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/outreach', requireAdminAuth, async (req, res) => {
  try {
    const { type, message, userId } = req.body;
    if (!message || !type) {
      return res.status(400).json({ error: 'Message and campaign type are required' });
    }
    
    let targetUsers = [];
    if (userId) {
      const allUsers = await getUsers();
      const u = allUsers.find(user => user.id === userId);
      if (u) targetUsers.push(u);
    } else {
      targetUsers = await getUsers();
    }
    
    if (targetUsers.length === 0) {
      return res.status(400).json({ error: 'No recipient users found' });
    }
    
    console.log(`[CAMPAIGN] Launching simulated ${type.toUpperCase()} campaign to ${targetUsers.length} users:`);
    targetUsers.forEach(u => {
      const personalized = message.replace(/\[Name\]/gi, u.name || 'Customer');
      if (type === 'email') {
        console.log(`  📧 Email sent to: ${u.name} <${u.email}> - Msg: "${personalized}"`);
      } else {
        console.log(`  💬 WhatsApp message sent to: ${u.name} (${u.phone}) - Msg: "${personalized}"`);
      }
    });
    
    res.json({ success: true, count: targetUsers.length });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/products', async (req, res) => {
  try {
    const products = await getProducts();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/products/:id', async (req, res) => {
  try {
    const products = await getProducts();
    const product = products.find(p => p.id === req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/products/:id/reviews', async (req, res) => {
  try {
    const reviews = await getReviews(req.params.id);
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/products/:id/reviews', async (req, res) => {
  try {
    const { author, rating, comment } = req.body;
    if (!author || !rating || !comment) {
      return res.status(400).json({ error: 'Missing review fields (author, rating, comment)' });
    }
    const newReview = await addReview(req.params.id, { author, rating, comment });
    res.json(newReview);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// Helper to notify admin via WhatsApp CallMeBot API
// Helper to notify admin via WhatsApp Twilio / CallMeBot API
async function sendWhatsAppAdminNotification(order) {
  const whatsappNumber = process.env.WHATSAPP_NUMBER || '919788633200';
  
  // Try Twilio first if configured
  const twilioSid = process.env.TWILIO_ACCOUNT_SID;
  const twilioToken = process.env.TWILIO_AUTH_TOKEN;
  const twilioFrom = process.env.TWILIO_SANDBOX_NUMBER || 'whatsapp:+14155238886';
  
  const itemsDesc = order.items.map(item => `• ${item.name} (x${item.quantity}) - Size: ${item.size || 'M'}`).join('\n');
  const message = `🔔 *NEW ORDER PLACED!*\n\n` +
    `*Order ID:* ${order.id}\n` +
    `*Customer:* ${order.customerName}\n` +
    `*Phone:* ${order.phone || 'N/A'}\n` +
    `*Email:* ${order.email || 'N/A'}\n` +
    `*Address:* ${order.address}\n\n` +
    `*Items Ordered:*\n${itemsDesc}\n\n` +
    `💰 *Total Paid:* Rs. ${order.totalAmount}\n` +
    `📦 *Shipping:* Free`;

  if (twilioSid && twilioToken && twilioSid !== 'YOUR_TWILIO_ACCOUNT_SID' && twilioSid.trim() !== '') {
    try {
      const cleanPhone = whatsappNumber.startsWith('+') ? whatsappNumber : '+' + whatsappNumber.replace(/\D/g, '');
      const to = `whatsapp:${cleanPhone}`;
      const from = twilioFrom.startsWith('whatsapp:') ? twilioFrom : `whatsapp:${twilioFrom}`;
      
      const url = `https://api.twilio.com/2010-04-01/Accounts/${twilioSid}/Messages.json`;
      const auth = Buffer.from(`${twilioSid}:${twilioToken}`).toString('base64');
      
      const params = new URLSearchParams();
      params.append('To', to);
      params.append('From', from);
      params.append('Body', message);
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${auth}`,
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: params.toString()
      });
      
      if (response.ok) {
        console.log("[TWILIO] Admin WhatsApp notification sent successfully.");
        return;
      } else {
        const errData = await response.json();
        console.error("[TWILIO] Failed to send WhatsApp notification via Twilio. Error:", errData);
      }
    } catch (error) {
      console.error("[TWILIO] Error sending WhatsApp notification:", error.message);
    }
  }

  // Fallback to CallMeBot API
  const apiKey = process.env.CALLMEBOT_API_KEY;
  if (!whatsappNumber || !apiKey || apiKey === 'YOUR_CALLMEBOT_API_KEY' || apiKey.trim() === '') {
    console.log("[WHATSAPP] WhatsApp admin notifications not configured (missing CALLMEBOT_API_KEY or Twilio config).");
    return;
  }
  
  try {
    const cleanPhone = whatsappNumber.startsWith('+') ? whatsappNumber : '+' + whatsappNumber.replace(/\D/g, '');
    const url = `https://api.callmebot.com/whatsapp.php?phone=${encodeURIComponent(cleanPhone)}&text=${encodeURIComponent(message)}&apikey=${encodeURIComponent(apiKey)}`;
    
    const response = await fetch(url);
    if (response.ok) {
      console.log("[WHATSAPP] Admin WhatsApp notification sent successfully.");
    } else {
      const errText = await response.text();
      console.error("[WHATSAPP] Failed to send WhatsApp notification. Status:", response.status, errText);
    }
  } catch (error) {
    console.error("[WHATSAPP] Error sending WhatsApp notification:", error.message);
  }
}

app.post('/api/orders', async (req, res) => {
  try {
    const body = sanitizeInput(req.body);
    const { customerName, email, address, phone, items, totalAmount, paymentMethod, paymentStatus, paymentDetails } = body;
    if (!customerName || !email || !address || !items || !totalAmount) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    const order = await addOrder({ 
      customerName, 
      email, 
      address, 
      phone, 
      items, 
      totalAmount, 
      paymentMethod, 
      paymentStatus, 
      paymentDetails 
    });

    // Notify admin via WhatsApp Bot
    try {
      await sendWhatsAppAdminNotification(order);
    } catch (waErr) {
      console.error("[WHATSAPP] Failed to send order notification:", waErr.message);
    }
    
    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get user specific orders
app.get('/api/users/orders', async (req, res) => {
  try {
    const { email, phone } = req.query;
    if (!email && !phone) {
      return res.status(400).json({ error: 'Email or phone query parameter is required' });
    }
    const orders = await getOrders();
    const userOrders = orders.filter(o => 
      (email && o.email.toLowerCase() === email.toLowerCase()) || 
      (phone && o.phone.replace(/\D/g, '') === phone.replace(/\D/g, ''))
    );
    res.json(userOrders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Cancel an order (Admin only)
app.post('/api/orders/:id/cancel', requireAdminAuth, async (req, res) => {
  try {
    const orders = await getOrders();
    const order = orders.find(o => o.id === req.params.id);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    if (order.status !== 'Pending') {
      return res.status(400).json({ error: 'Only pending orders can be cancelled' });
    }
    const updated = await updateOrderStatus(req.params.id, 'Cancelled');
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Track Order publicly by Order ID
app.get('/api/orders/track/:id', async (req, res) => {
  try {
    const orders = await getOrders();
    const order = orders.find(o => o.id === req.params.id);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all orders
app.get('/api/orders', requireAdminAuth, async (req, res) => {
  try {
    const orders = await getOrders();
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update order status
app.patch('/api/orders/:id/status', requireAdminAuth, async (req, res) => {
  try {
    const { status } = req.body;
    if (!status) {
      return res.status(400).json({ error: 'Status is required' });
    }
    const updated = await updateOrderStatus(req.params.id, status);
    if (!updated) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update order payment status
app.patch('/api/orders/:id/payment', requireAdminAuth, async (req, res) => {
  try {
    const { paymentStatus } = req.body;
    if (!paymentStatus) {
      return res.status(400).json({ error: 'Payment status is required' });
    }
    const updated = await updateOrderPaymentStatus(req.params.id, paymentStatus);
    if (!updated) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete an order
app.delete('/api/orders/:id', requireAdminAuth, async (req, res) => {
  try {
    const success = await deleteOrder(req.params.id);
    if (!success) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete a product
app.delete('/api/products/:id', requireAdminAuth, async (req, res) => {
  try {
    const success = await deleteProduct(req.params.id);
    if (!success) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update product stock
app.patch('/api/products/:id/stock', requireAdminAuth, async (req, res) => {
  try {
    const { stock } = req.body;
    if (stock === undefined) {
      return res.status(400).json({ error: 'Stock value is required' });
    }
    const updated = await updateProductStock(req.params.id, stock);
    if (!updated) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update product fields (name, price, oldPrice, category, description, etc.)
app.patch('/api/products/:id', requireAdminAuth, async (req, res) => {
  try {
    const body = sanitizeInput(req.body);
    const { name, price, oldPrice, category, description, stock } = body;
    
    const updated = await updateProduct(req.params.id, { 
      name, 
      price, 
      oldPrice, 
      category, 
      description, 
      stock 
    });
    
    if (!updated) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// --- Contact Inquiries APIs ---
app.post('/api/inquiries', async (req, res) => {
  try {
    const body = sanitizeInput(req.body);
    const { name, email, phone, subject, message } = body;
    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Name, email, and message are required.' });
    }
    const inquiry = await addInquiry({ name, email, phone, subject, message });
    res.status(201).json(inquiry);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/inquiries', requireAdminAuth, async (req, res) => {
  try {
    const inquiries = await getInquiries();
    res.json(inquiries);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/inquiries/:id', requireAdminAuth, async (req, res) => {
  try {
    const success = await deleteInquiry(req.params.id);
    if (!success) {
      return res.status(404).json({ error: 'Inquiry not found' });
    }
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// --- Cart Activity APIs ---
app.post('/api/cart/activity', async (req, res) => {
  try {
    const { email, phone, name, productId, productName, quantity } = req.body;
    if (!productId || !productName) {
      return res.status(400).json({ error: 'Product details required' });
    }
    const act = await addCartActivity({ email, phone, name, productId, productName, quantity });
    res.status(201).json(act);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/cart/activity', requireAdminAuth, async (req, res) => {
  try {
    const list = await getCartActivity();
    res.json(list);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add product (Web Admin panel)
app.post('/api/products', requireAdminAuth, async (req, res) => {
  try {
    const body = sanitizeInput(req.body);
    console.log("[API POST /api/products] Request received. Sanitized Body:", JSON.stringify(body));
    const { name, price, image, category, description, sizes, colors, colorImages, additionalImages, featured } = body;
    if (!name || !price || !category) {
      console.warn("[API POST /api/products] Missing required fields. Name:", name, ", Price:", price, ", Category:", category);
      return res.status(400).json({ error: 'Missing required fields (name, price, category)' });
    }
    const product = await addProduct({
      name,
      price: parseFloat(price),
      image: image || 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=500&auto=format&fit=crop',
      category,
      description: description || '',
      sizes: sizes || ["S", "M", "L", "XL"],
      colors: colors || ["Default"],
      colorImages: colorImages || {},
      additionalImages: additionalImages || [],
      featured: !!featured
    });
    console.log("[API POST /api/products] Product created successfully:", product.id);
    res.status(201).json(product);
  } catch (error) {
    console.error("[API POST /api/products] Error processing request:", error);
    res.status(500).json({ error: error.message });
  }
});

// Copywriting using Groq AI Llama3 model
app.post('/api/ai/generate-description', requireAdminAuth, async (req, res) => {
  try {
    const { productName, category, attributes } = req.body;
    if (!productName || !category) {
      return res.status(400).json({ error: 'Product name and category are required' });
    }

    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'Groq API Key is not configured on the backend.' });
    }

    const systemPrompt = `You are a premium fashion & clothing e-commerce copywriter.
Generate a highly descriptive, appealing, and concise product description (2 to 3 sentences max) for an online apparel storefront named "SAIVI'S Collection".
Focus on the elegance, comfort, and premium quality of the product. Do not use placeholders or generic tags. Keep it punchy and ready for customers.`;

    const userPrompt = `Product Name: ${productName}
Category: ${category}
Attributes/Features: ${attributes || 'Premium fabric, beautiful design, comfort fit'}`;

    const groqResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'llama3-8b-8192',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.7,
        max_tokens: 150
      })
    });

    if (!groqResponse.ok) {
      const errorText = await groqResponse.text();
      console.error("[GROQ API ERROR]", errorText);
      throw new Error(`Groq API returned error: ${groqResponse.status}`);
    }

    const data = await groqResponse.json();
    const description = data.choices?.[0]?.message?.content?.trim();
    
    if (!description) {
      throw new Error('No description was generated by the AI.');
    }

    res.json({ success: true, description });
  } catch (error) {
    console.error("[AI GENERATE ERROR]", error);
    res.status(500).json({ error: error.message || 'Failed to generate AI description.' });
  }
});

// Get dashboard statistics
app.get('/api/stats', requireAdminAuth, async (req, res) => {
  try {
    const products = await getProducts();
    const orders = await getOrders();
    const users = await getUsers();
    
    const totalSales = orders
      .filter(o => o.status !== 'Cancelled')
      .reduce((sum, o) => sum + (o.totalAmount || 0), 0);
      
    const totalOrders = orders.length;
    const totalProducts = products.length;
    const totalCustomers = users.length;
    
    res.json({
      totalSales,
      totalOrders,
      totalProducts,
      totalCustomers
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// --- HOMEPAGE SECTIONS ENDPOINTS ---
app.get('/api/homepage-sections', async (req, res) => {
  try {
    const sections = await getHomepageSections();
    res.json(sections);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/homepage-sections', requireAdminAuth, async (req, res) => {
  try {
    const body = sanitizeInput(req.body);
    const { sections } = body;
    if (!Array.isArray(sections)) {
      return res.status(400).json({ error: 'Sections must be an array' });
    }
    await saveHomepageSections(sections);
    res.json({ success: true, message: 'Homepage sections updated successfully.' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// --- PUBLIC CONFIGURATION ENDPOINT ---
app.get('/api/config/public', (req, res) => {
  res.json({
    merchantUpiId: process.env.MERCHANT_UPI_ID || '',
    merchantUpiName: process.env.MERCHANT_UPI_NAME || '',
    whatsappNumber: process.env.WHATSAPP_NUMBER || '',
    heroImage1: process.env.HERO_IMAGE_1 || '',
    heroImage2: process.env.HERO_IMAGE_2 || '',
    heroImage3: process.env.HERO_IMAGE_3 || ''
  });
});

// --- ADMIN SYSTEM CONFIGURATION & CLOUD SETUP ---
app.get('/api/test-supabase-direct', async (req, res) => {
  try {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_KEY;
    console.log(`[TEST] supabaseUrl: ${supabaseUrl ? "present" : "missing"}, supabaseKey: ${supabaseKey ? "present" : "missing"}`);
    
    if (!supabaseUrl || !supabaseKey) {
      return res.json({ success: false, error: 'Missing credentials in env' });
    }
    
    const filename = `test_live_${Date.now()}.txt`;
    const url = `${supabaseUrl}/storage/v1/object/savis-images/${filename}`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${supabaseKey}`,
        'Content-Type': 'text/plain',
        'x-upsert': 'true'
      },
      body: Buffer.from("test data")
    });
    
    const text = await response.text();
    console.log(`[TEST] Status: ${response.status}, Response: ${text}`);
    res.json({ status: response.status, body: text });
  } catch (err) {
    console.error(`[TEST] Connection error:`, err);
    res.json({ success: false, error: err.message });
  }
});

app.get('/api/admin/config', requireAdminAuth, (req, res) => {
  res.json({
    mongodbUri: process.env.MONGODB_URI || '',
    supabaseDbUrl: process.env.SUPABASE_DB_URL || '',
    googleDriveClientEmail: process.env.GOOGLE_DRIVE_CLIENT_EMAIL || '',
    googleDriveFolderId: process.env.GOOGLE_DRIVE_FOLDER_ID || '',
    hasPrivateKey: !!process.env.GOOGLE_DRIVE_PRIVATE_KEY,
    cloudinaryUrl: process.env.CLOUDINARY_URL || '',
    cloudinaryCloudName: process.env.CLOUDINARY_CLOUD_NAME || '',
    cloudinaryApiKey: process.env.CLOUDINARY_API_KEY || '',
    hasCloudinarySecret: !!process.env.CLOUDINARY_API_SECRET,
    adminUsername: process.env.ADMIN_USERNAME || 'admin',
    merchantUpiId: process.env.MERCHANT_UPI_ID || '',
    merchantUpiName: process.env.MERCHANT_UPI_NAME || '',
    whatsappNumber: process.env.WHATSAPP_NUMBER || '',
    callmebotApiKey: process.env.CALLMEBOT_API_KEY || '',
    heroImage1: process.env.HERO_IMAGE_1 || '',
    heroImage2: process.env.HERO_IMAGE_2 || '',
    heroImage3: process.env.HERO_IMAGE_3 || '',
    hasPassword: !!process.env.ADMIN_PASSWORD
  });
});

app.post('/api/admin/config', requireAdminAuth, async (req, res) => {
  try {
    const { 
      mongodbUri, 
      supabaseDbUrl,
      googleDriveClientEmail, 
      googleDriveFolderId, 
      googleDrivePrivateKey, 
      adminUsername, 
      adminPassword, 
      merchantUpiId, 
      merchantUpiName,
      whatsappNumber,
      callmebotApiKey,
      cloudinaryUrl,
      cloudinaryCloudName,
      cloudinaryApiKey,
      cloudinaryApiSecret
    } = req.body;
    
    // Read current .env content or build new
    const envPath = path.join(__dirname, '.env');
    let envContent = '';
    
    if (fs.existsSync(envPath)) {
      envContent = fs.readFileSync(envPath, 'utf8');
    }
    
    // Parse env file key-value pairs
    const envVars = {};
    envContent.split('\n').forEach(line => {
      const parts = line.split('=');
      if (parts.length >= 2) {
        const key = parts[0].trim();
        const value = parts.slice(1).join('=').trim();
        if (key) envVars[key] = value;
      }
    });
    
    // Update variables
    if (mongodbUri !== undefined) envVars['MONGODB_URI'] = mongodbUri;
    if (supabaseDbUrl !== undefined) envVars['SUPABASE_DB_URL'] = supabaseDbUrl;
    if (googleDriveClientEmail !== undefined) envVars['GOOGLE_DRIVE_CLIENT_EMAIL'] = googleDriveClientEmail;
    if (googleDriveFolderId !== undefined) envVars['GOOGLE_DRIVE_FOLDER_ID'] = googleDriveFolderId;
    if (adminUsername !== undefined) envVars['ADMIN_USERNAME'] = adminUsername;
    if (adminPassword !== undefined && adminPassword !== '' && adminPassword !== '********') envVars['ADMIN_PASSWORD'] = adminPassword;
    if (merchantUpiId !== undefined) envVars['MERCHANT_UPI_ID'] = merchantUpiId;
    if (merchantUpiName !== undefined) envVars['MERCHANT_UPI_NAME'] = merchantUpiName;
    if (whatsappNumber !== undefined) envVars['WHATSAPP_NUMBER'] = whatsappNumber;
    if (callmebotApiKey !== undefined) envVars['CALLMEBOT_API_KEY'] = callmebotApiKey;
    if (cloudinaryUrl !== undefined) envVars['CLOUDINARY_URL'] = cloudinaryUrl;
    if (cloudinaryCloudName !== undefined) envVars['CLOUDINARY_CLOUD_NAME'] = cloudinaryCloudName;
    if (cloudinaryApiKey !== undefined) envVars['CLOUDINARY_API_KEY'] = cloudinaryApiKey;
    if (cloudinaryApiSecret !== undefined && cloudinaryApiSecret !== '' && cloudinaryApiSecret !== '********') envVars['CLOUDINARY_API_SECRET'] = cloudinaryApiSecret;
    
    // Only update private key if provided
    if (googleDrivePrivateKey) {
      envVars['GOOGLE_DRIVE_PRIVATE_KEY'] = googleDrivePrivateKey.replace(/\n/g, '\\n');
    }
    
    // Default values if missing
    if (!envVars['PORT']) envVars['PORT'] = '5000';
    if (!envVars['ADMIN_USERNAME']) envVars['ADMIN_USERNAME'] = process.env.ADMIN_USERNAME || 'admin';
    if (!envVars['ADMIN_PASSWORD']) envVars['ADMIN_PASSWORD'] = process.env.ADMIN_PASSWORD || 'admin123';
    
    // Build new .env string
    const newEnvContent = Object.entries(envVars)
      .map(([k, v]) => `${k}=${v}`)
      .join('\n');
      
    fs.writeFileSync(envPath, newEnvContent, 'utf8');
    console.log("[CONFIG] Updated .env file successfully.");
    
    res.json({ success: true, message: 'Settings saved successfully! Restarting the server to apply changes...' });
    
    // Clean exit after response to let PM2 or nodemon reload
    setTimeout(() => {
      console.log("[CONFIG] Restarting server process...");
      process.exit(0);
    }, 1500);
    
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/admin/reset-database', requireAdminAuth, async (req, res) => {
  try {
    await resetDatabase();
    res.json({ success: true, message: 'Database reset successfully!' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// --- Start Express Server ---
// Bind explicitly to 0.0.0.0 so Railway's health check can reach the app
// regardless of which network interface it probes.
const server = app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});

// --- Initialize database AFTER the server is already listening ---
// This means Railway's health check (/health) will get a 200 response
// immediately, even if the DB connection is slow or briefly unavailable,
// instead of the whole process failing to bind if initDb() throws.
initDb().catch((err) => {
  console.error("[DATABASE] Failed to initialize database:", err);
});
