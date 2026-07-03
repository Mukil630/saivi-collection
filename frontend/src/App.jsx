import React, { useState, useEffect, useRef } from 'react';
import './App.css';

// Fallback products data matching the SAVI'S collection storefront HTML structure
const fallbackProducts = [];

const API_BASE_URL = import.meta.env.VITE_API_URL || (
  window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'
    : `http://${window.location.hostname}:5000`
);

const COLLECTIONS = [
  { name: '🔥 BIG COMBO SALE', img: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=500&q=80', href: '#new-arrivals' },
  { name: 'Palazzo Set', img: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=500&q=80', href: '#sarees' },
  { name: 'Georgette Frock', img: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=500&q=80', href: '#cotton' },
  { name: 'Stylish Co-Ords', img: 'https://images.unsplash.com/photo-1608748010899-18f300247112?w=500&q=80', href: '#coords' },
  { name: 'Elegant Sarees', img: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=500&q=80', href: '#sarees' },
  { name: 'Night Gowns', img: 'https://images.unsplash.com/photo-1596783074918-c84cb06531ca?w=500&q=80', href: '#nightgown' },
  { name: 'Trendy Kurtis', img: 'https://images.unsplash.com/photo-1608963503735-ee1b5852ea6e?w=500&q=80', href: '#kurtis' },
  { name: 'Feeding Dresses', img: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=500&q=80', href: '#feeding' },
  { name: 'Cotton Collection', img: 'https://images.unsplash.com/photo-1621184455862-c163dfb30e0f?w=500&q=80', href: '#cotton' },
  { name: 'Kids Collections', img: `${API_BASE_URL}/uploads/kids_frock.png`, href: '#kids' },
  { name: 'Jewellery', img: `${API_BASE_URL}/uploads/gold_choker.png`, href: '#jewels' },
  { name: 'Home Essentials', img: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80', href: '#collections' }
];

const HERO_SLIDES_DATA = [
  {
    tag: "🔥 Big Combo Sale is Live",
    title: "Premium Fabrics Made in India",
    desc: "Your favourite styles are now in combo offers at unbelievable prices. More styles, more savings, more reasons to shop.",
    img: "https://i.pinimg.com/736x/6f/4a/d7/6f4ad730cb70aaf13c1d9863e3ba190b.jpg",
    link: "#new-arrivals"
  },
  {
    tag: "New Arrival",
    title: "Elegant Cotton Co-ords You'll Love",
    desc: "Effortlessly chic cotton co-ord sets in fresh shades. Comfort meets style for every occasion.",
    img: "https://i.pinimg.com/736x/27/c4/e9/27c4e9597a6f632a9d1187fb70460253.jpg",
    link: "#coords"
  },
  {
    tag: "Trending",
    title: "Breathable Night Gowns for Restful Nights",
    desc: "Soft fabrics, easy fits, and soothing styles designed for total comfort and relaxed evenings.",
    img: "https://i.pinimg.com/736x/52/16/bd/5216bd2870f712836a68986f56d61458.jpg",
    link: "#nightgown"
  },
  {
    tag: "Exclusive",
    title: "Handcrafted Elegant Silk Sarees",
    desc: "Timeless heritage weaves with rich borders and intricate embroidery. Perfect for special occasions.",
    img: "https://i.pinimg.com/736x/aa/b7/af/aab7af1e913313eb7bdde5a99564ad84.jpg",
    link: "#sarees"
  }
];

const TESTIMONIALS_DATA = [
  {
    name: "Ananya Iyer",
    rating: 5,
    text: "The quality of the silk sarees from SAVI's Collection is absolutely stunning! The gold embroidery and texture feels extremely premium. Customer service was very prompt with delivery details.",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80"
  },
  {
    name: "Meera Deshmukh",
    rating: 5,
    text: "I bought three kids frocks and a palazzo set. The cotton fabric is so soft and perfect for Bengaluru weather. They wash really well without shrinking or color fading. Will buy again!",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&q=80"
  },
  {
    name: "Priyanka Sharma",
    rating: 5,
    text: "Absolutely love their covering ornament sets! The micro-gold finish looks exactly like real gold and doesn't tarnish. Perfect match for the designer sarees.",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&q=80"
  }
];

const INSTAGRAM_GALLERY_DATA = [
  "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400&q=80",
  "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400&q=80",
  "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&q=80",
  "https://images.unsplash.com/photo-1596783074918-c84cb06531ca?w=400&q=80",
  "https://images.unsplash.com/photo-1519457431-44ccd64a579b?w=400&q=80",
  "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&q=80"
];


// ==========================================
// INTELLIGENT SEARCH ENGINE HELPER UTILITIES
// ==========================================

const SYNONYMS = {
  'dress': ['frock', 'dresses', 'dress material', 'dress set'],
  'dresses': ['dress', 'frock'],
  'frock': ['dress', 'dresses'],
  'frocks': ['dress', 'dresses'],
  'kids': ['children', 'kid', 'kidwear', 'kids collection', 'kids collections'],
  'kid': ['kids', 'children', 'kidwear', 'kids collection', 'kids collections'],
  'children': ['kids', 'kid', 'kidwear'],
  'kidwear': ['kids', 'kid', 'children'],
  'cotton': ['cotton wear', 'cotton collection', 'cotton collections', 'cot'],
  'cot': ['cotton', 'cotton wear', 'cotton collection'],
  'night dress': ['night wear', 'nightwear', 'nightgown'],
  'nightwear': ['night dress', 'night wear', 'nightgown'],
  'nightgown': ['night dress', 'night wear', 'nightwear'],
  'co ord': ['co-ords', 'coords', 'co-ord'],
  'co-ord': ['co ord', 'coords', 'co-ords'],
  'co-ords': ['co ord', 'coords', 'co-ord'],
  'coords': ['co ord', 'co-ords', 'co-ord'],
  'saree': ['sarees', 'sari', 'saris'],
  'sarees': ['saree', 'sari', 'saris'],
  'sari': ['saree', 'sarees'],
  'kurti': ['kurtis', 'kurtii'],
  'kurtis': ['kurti', 'kurtii'],
  'jewellery': ['jewel', 'jewelry', 'jewels'],
  'jewels': ['jewellery', 'jewel', 'jewelry'],
  'jewel': ['jewellery', 'jewels', 'jewelry']
};

const CATEGORY_MAP = {
  'kids': 'Kids',
  'children': 'Kids',
  'kid': 'Kids',
  'kidwear': 'Kids',
  
  'cotton': 'Cotton',
  'cot': 'Cotton',
  
  'kurti': 'Kurtis',
  'kurtis': 'Kurtis',
  'kurtii': 'Kurtis',
  
  'nightwear': 'Nightgown',
  'night wear': 'Nightgown',
  'night dress': 'Nightgown',
  'nightgown': 'Nightgown',
  
  'co-ords': 'Co-ords',
  'co ord': 'Co-ords',
  'coords': 'Co-ords',
  
  'jewellery': 'Jewels',
  'jewel': 'Jewels',
  'jewelry': 'Jewels',
  'jewels': 'Jewels',
  
  'saree': 'Sarees',
  'sarees': 'Sarees',
  'sari': 'Sarees',
  
  'women': 'Women'
};

function tokenize(text) {
  if (!text) return [];
  return text.toLowerCase()
    .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, ' ')
    .split(/\s+/)
    .filter(t => t.length > 0);
}

function getSearchTokens(token) {
  const variations = [{ token, weight: 1.0 }];
  const syns = SYNONYMS[token];
  if (syns) {
    for (const syn of syns) {
      variations.push({ token: syn, weight: 0.8 });
    }
  }
  return variations;
}

function levenshtein(a, b) {
  const tmp = [];
  for (let i = 0; i <= a.length; i++) {
    tmp[i] = [i];
  }
  for (let j = 0; j <= b.length; j++) {
    tmp[0][j] = j;
  }
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      tmp[i][j] = b[j - 1] === a[i - 1] 
        ? tmp[i - 1][j - 1] 
        : Math.min(tmp[i - 1][j - 1] + 1, tmp[i][j - 1] + 1, tmp[i - 1][j] + 1);
    }
  }
  return tmp[a.length][b.length];
}

function matchToken(token, targetWord) {
  const t = token.toLowerCase();
  const w = targetWord.toLowerCase();

  // 1. Exact match
  if (t === w) {
    return { matchType: 'exact', scoreBoost: 1.0 };
  }

  // 2. Partial match
  if (w.startsWith(t)) {
    const ratio = t.length / w.length;
    return { matchType: 'partial', scoreBoost: 0.8 * ratio };
  }
  if (w.includes(t)) {
    const ratio = t.length / w.length;
    return { matchType: 'partial', scoreBoost: 0.6 * ratio };
  }

  // 3. Fuzzy match
  if (t.length >= 3) {
    const maxDist = t.length >= 5 ? 2 : 1;
    const dist = levenshtein(t, w);
    if (dist <= maxDist) {
      const scoreBoost = 0.5 * (1 - dist / (t.length + 1));
      return { matchType: 'fuzzy', scoreBoost };
    }
  }

  return { matchType: 'none', scoreBoost: 0 };
}

function matchTokenAgainstIndexedField(token, words) {
  if (!words || words.length === 0) return { matchType: 'none', scoreBoost: 0 };
  let bestMatch = { matchType: 'none', scoreBoost: 0 };
  for (const word of words) {
    const result = matchToken(token, word);
    if (result.scoreBoost > bestMatch.scoreBoost) {
      bestMatch = result;
    }
  }
  return bestMatch;
}

function matchCategory(productCategory, targetCategoryFilter) {
  if (!productCategory || !targetCategoryFilter) return false;
  const pCat = productCategory.toLowerCase().replace(/[\s-]/g, '');
  const target = targetCategoryFilter.toLowerCase().replace(/[\s-]/g, '');

  if (target === 'women') {
    return pCat !== 'kids' && pCat !== 'kidscollections' && pCat !== 'jewels' && pCat !== 'jewellery';
  }
  if (target === 'cotton') {
    return pCat === 'cotton' || pCat === 'cottoncollections' || pCat === 'frocks';
  }
  if (target === 'nightgown' || target === 'nightwear') {
    return pCat === 'nightgown' || pCat === 'nightwear';
  }
  if (target === 'kids') {
    return pCat === 'kids' || pCat === 'kidscollections';
  }
  if (target === 'jewels' || target === 'jewellery') {
    return pCat === 'jewels' || pCat === 'jewellery';
  }
  return pCat === target;
}

function parseQuery(queryStr) {
  let textQuery = queryStr.toLowerCase().trim();
  let priceFilter = null;
  let discountFilter = null;
  let categoryFilter = null;
  let ageFilter = null;

  // 1. Parse discount: e.g. "30%", "20 off"
  const discountRegex = /\b(\d+)\s*(?:%|percent|off)\b/i;
  const discountMatch = textQuery.match(discountRegex);
  if (discountMatch) {
    discountFilter = parseInt(discountMatch[1], 10);
    textQuery = textQuery.replace(discountRegex, ' ');
  }

  // 2. Parse age filters: e.g. "2-4 years", "5 y", "kids 6 years"
  const ageRangeRegex = /\b(\d+)\s*(?:-|to)\s*(\d+)\s*(?:years|year|yrs|yr|y|age)\b/i;
  const ageRangeMatch = textQuery.match(ageRangeRegex);
  if (ageRangeMatch) {
    const min = parseInt(ageRangeMatch[1], 10);
    const max = parseInt(ageRangeMatch[2], 10);
    ageFilter = { min, max };
    textQuery = textQuery.replace(ageRangeRegex, ' ');
  } else {
    const ageRegex = /\b(\d+)\s*(?:years|year|yrs|yr|y|age)\b/i;
    const ageMatch = textQuery.match(ageRegex);
    if (ageMatch) {
      ageFilter = parseInt(ageMatch[1], 10);
      textQuery = textQuery.replace(ageRegex, ' ');
    } else if (/\b(?:kids|kid|child|children|baby|boys|girls)\b/i.test(queryStr)) {
      // If keyword kids/baby is present and there's a standalone small number <= 15
      const smallNumRegex = /\b([1-9]|1[0-5])\b/;
      const smallNumMatch = textQuery.match(smallNumRegex);
      if (smallNumMatch) {
        ageFilter = parseInt(smallNumMatch[1], 10);
        textQuery = textQuery.replace(smallNumRegex, ' ');
      }
    }
  }

  // 3. Parse price filters (ranges and limits)
  const rangeRegex = /\b(\d+)\s*(?:-|to)\s*(\d+)\b/i;
  const rangeMatch = textQuery.match(rangeRegex);
  if (rangeMatch) {
    const min = parseInt(rangeMatch[1], 10);
    const max = parseInt(rangeMatch[2], 10);
    // Treat as price range only if min/max are realistic prices (>= 100) or explicit price keywords are present
    const isPrice = min >= 100 || max >= 100 || /\b(?:rs|rupees|rupee|price|amount|cost)\b/i.test(queryStr);
    if (isPrice) {
      priceFilter = { type: 'range', min, max };
      textQuery = textQuery.replace(rangeRegex, ' ');
    }
  } else {
    const underRegex = /\b(?:under|below|less\s+than|<)\s*(\d+)\b/i;
    const underMatch = textQuery.match(underRegex);
    if (underMatch) {
      const max = parseInt(underMatch[1], 10);
      if (max >= 100) {
        priceFilter = { type: 'under', max };
        textQuery = textQuery.replace(underRegex, ' ');
      }
    } else {
      const aboveRegex = /\b(?:above|over|more\s+than|>)\s*(\d+)\b/i;
      const aboveMatch = textQuery.match(aboveRegex);
      if (aboveMatch) {
        const min = parseInt(aboveMatch[1], 10);
        if (min >= 100) {
          priceFilter = { type: 'above', min };
          textQuery = textQuery.replace(aboveRegex, ' ');
        }
      } else {
        const exactPriceRegex = /\b(\d{2,5})\b/;
        const exactPriceMatch = textQuery.match(exactPriceRegex);
        if (exactPriceMatch) {
          const price = parseInt(exactPriceMatch[1], 10);
          const isPrice = price >= 100 || /\b(?:rs|rupees|rupee|price|amount|cost)\b/i.test(queryStr);
          if (isPrice) {
            priceFilter = { type: 'exact', price };
            textQuery = textQuery.replace(exactPriceRegex, ' ');
          }
        }
      }
    }
  }

  // 4. Parse category recognition (multi-word first)
  const multiWordCategories = ['night wear', 'night dress', 'co ord', 'cotton wear', 'kids wear'];
  for (const phrase of multiWordCategories) {
    if (textQuery.includes(phrase)) {
      categoryFilter = CATEGORY_MAP[phrase];
      textQuery = textQuery.replace(phrase, ' ');
    }
  }

  // Now single word categories
  const words = textQuery.split(/\s+/);
  for (const word of words) {
    const cleanWord = word.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, '');
    if (CATEGORY_MAP[cleanWord]) {
      categoryFilter = CATEGORY_MAP[cleanWord];
      textQuery = textQuery.replace(new RegExp(`\\b${cleanWord}\\b`, 'gi'), ' ');
    }
  }

  textQuery = textQuery.replace(/\s+/g, ' ').trim();
  return { textQuery, priceFilter, discountFilter, categoryFilter, ageFilter };
}

function computeProductScoreIndexed(item, queryInfo) {
  const { textQuery, priceFilter, discountFilter, categoryFilter, ageFilter } = queryInfo;
  const p = item.product;

  // 1. Check category filter
  if (categoryFilter) {
    if (!matchCategory(p.category, categoryFilter)) {
      return 0;
    }
  }

  // 2. Check price filter
  if (priceFilter) {
    const price = p.price;
    if (priceFilter.type === 'exact' && price !== priceFilter.price) return 0;
    if (priceFilter.type === 'under' && price >= priceFilter.max) return 0;
    if (priceFilter.type === 'above' && price <= priceFilter.min) return 0;
    if (priceFilter.type === 'range' && (price < priceFilter.min || price > priceFilter.max)) return 0;
  }

  // 3. Check discount filter
  if (discountFilter !== null) {
    const oldPrice = p.oldPrice || 0;
    const price = p.price;
    const discount = oldPrice > price ? Math.round((oldPrice - price) / oldPrice * 100) : 0;
    if (Math.abs(discount - discountFilter) > 5) return 0;
  }

  let totalScore = 0;
  let matchesAnyToken = false;

  // 4. Check age filter (kids sizes match)
  if (ageFilter !== null) {
    let matchesAge = false;
    const pSizes = p.sizes || [];
    for (const size of pSizes) {
      const sizeClean = size.toLowerCase();
      const rangeMatch = sizeClean.match(/(\d+)\s*-\s*(\d+)/);
      if (rangeMatch) {
        const minAge = parseInt(rangeMatch[1], 10);
        const maxAge = parseInt(rangeMatch[2], 10);
        if (typeof ageFilter === 'number') {
          if (ageFilter >= minAge && ageFilter <= maxAge) {
            matchesAge = true;
            break;
          }
        } else if (typeof ageFilter === 'object') {
          if (ageFilter.min <= maxAge && ageFilter.max >= minAge) {
            matchesAge = true;
            break;
          }
        }
      } else {
        const singleMatch = sizeClean.match(/\b(\d+)\b/);
        if (singleMatch) {
          const sizeAge = parseInt(singleMatch[1], 10);
          if (typeof ageFilter === 'number') {
            if (sizeAge === ageFilter) {
              matchesAge = true;
              break;
            }
          } else if (typeof ageFilter === 'object') {
            if (sizeAge >= ageFilter.min && sizeAge <= ageFilter.max) {
              matchesAge = true;
              break;
            }
          }
        }
      }
    }
    if (matchesAge) {
      totalScore += 2000;
      matchesAnyToken = true;
    }
  }

  // Size Match Boost
  if (p.sizes && Array.isArray(p.sizes)) {
    const queryTokens = tokenize(textQuery);
    const hasSizeMatch = queryTokens.some(token => {
      const tClean = token.toLowerCase().trim();
      return p.sizes.some(size => {
        const sClean = size.toLowerCase().replace(/[\s-]/g, '').trim();
        return sClean === tClean || sClean === `${tClean}y` || sClean === `${tClean}years`;
      });
    });
    if (hasSizeMatch) {
      totalScore += 1200;
      matchesAnyToken = true;
    }
  }

  // If no text query but passed filters
  if (!textQuery && !ageFilter) {
    return matchesAnyToken ? totalScore : 100;
  }

  const queryTokens = tokenize(textQuery);
  if (queryTokens.length === 0) return matchesAnyToken ? totalScore : 100;

  // Exact full query matches
  if (item.nameLower.includes(textQuery)) {
    totalScore += 2000;
    matchesAnyToken = true;
  }
  if (item.categoryLower.includes(textQuery)) {
    totalScore += 1000;
    matchesAnyToken = true;
  }

  // Match individual tokens
  for (const token of queryTokens) {
    const variations = getSearchTokens(token);
    let bestTokenScore = 0;
    let tokenMatched = false;

    for (const { token: searchToken, weight } of variations) {
      // 1. Name Match (Highest priority)
      const nameMatch = matchTokenAgainstIndexedField(searchToken, item.nameTokens);
      if (nameMatch.matchType !== 'none') {
        const base = nameMatch.matchType === 'exact' ? 800 : (nameMatch.matchType === 'partial' ? 500 : 250);
        const score = base * nameMatch.scoreBoost * weight;
        if (score > bestTokenScore) { bestTokenScore = score; tokenMatched = true; }
      }

      // 2. Category Match (Second priority)
      const categoryMatch = matchTokenAgainstIndexedField(searchToken, item.categoryTokens);
      if (categoryMatch.matchType !== 'none') {
        const base = categoryMatch.matchType === 'exact' ? 600 : (categoryMatch.matchType === 'partial' ? 400 : 200);
        const score = base * categoryMatch.scoreBoost * weight;
        if (score > bestTokenScore) { bestTokenScore = score; tokenMatched = true; }
      }

      // 3. Tags Match (Third priority)
      const tagsMatch = matchTokenAgainstIndexedField(searchToken, item.tagsTokens);
      if (tagsMatch.matchType !== 'none') {
        const base = tagsMatch.matchType === 'exact' ? 500 : (tagsMatch.matchType === 'partial' ? 300 : 150);
        const score = base * tagsMatch.scoreBoost * weight;
        if (score > bestTokenScore) { bestTokenScore = score; tokenMatched = true; }
      }

      // 4. Description Match (Fourth priority)
      const descMatch = matchTokenAgainstIndexedField(searchToken, item.descriptionTokens);
      if (descMatch.matchType !== 'none') {
        const base = descMatch.matchType === 'exact' ? 300 : (descMatch.matchType === 'partial' ? 200 : 100);
        const score = base * descMatch.scoreBoost * weight;
        if (score > bestTokenScore) { bestTokenScore = score; tokenMatched = true; }
      }

      // 5. Brand Match
      const brandMatch = matchTokenAgainstIndexedField(searchToken, item.brandTokens);
      if (brandMatch.matchType !== 'none') {
        const score = 250 * brandMatch.scoreBoost * weight;
        if (score > bestTokenScore) { bestTokenScore = score; tokenMatched = true; }
      }

      // 6. SKU Match
      const skuMatch = matchTokenAgainstIndexedField(searchToken, item.skuTokens);
      if (skuMatch.matchType !== 'none') {
        const score = 200 * skuMatch.scoreBoost * weight;
        if (score > bestTokenScore) { bestTokenScore = score; tokenMatched = true; }
      }

      // 7. ID Match
      const idMatch = matchTokenAgainstIndexedField(searchToken, item.idTokens);
      if (idMatch.matchType !== 'none') {
        const score = 200 * idMatch.scoreBoost * weight;
        if (score > bestTokenScore) { bestTokenScore = score; tokenMatched = true; }
      }
    }

    if (tokenMatched) {
      totalScore += bestTokenScore;
      matchesAnyToken = true;
    }
  }

  if (!matchesAnyToken) return 0;

  return totalScore;
}

function highlightText(text, textQuery) {
  if (!text || !textQuery) return text;
  const queryTokens = tokenize(textQuery);
  if (queryTokens.length === 0) return text;

  const parts = text.split(/(\s+)/);
  
  return parts.map((part, index) => {
    if (/\s+/.test(part)) return part;

    const cleanWord = part.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, '');
    if (!cleanWord) return part;

    let isMatch = false;
    for (const token of queryTokens) {
      const variations = getSearchTokens(token);
      for (const { token: searchToken } of variations) {
        const matchRes = matchToken(searchToken, cleanWord);
        if (matchRes.matchType !== 'none') {
          isMatch = true;
          break;
        }
      }
      if (isMatch) break;
    }

    if (isMatch) {
      return <mark key={index} className="search-highlight">{part}</mark>;
    }
    return part;
  });
}


function App() {
  const [activeTab, setActiveTab] = useState('shop'); // 'shop' | 'admin'
  const [adminSubTab, setAdminSubTab] = useState('dashboard'); // 'dashboard' | 'orders' | 'products' | 'customers' | 'inquiries'
  const [products, setProducts] = useState(fallbackProducts);
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState({ totalSales: 0, totalOrders: 0, totalProducts: 0, totalCustomers: 0 });
  const [inquiries, setInquiries] = useState([]);
  const [contactForm, setContactForm] = useState({ name: '', email: '', phone: '', subject: 'General Inquiry', message: '' });

  // Admin Security & Session States
  const [adminToken, setAdminToken] = useState(localStorage.getItem('adminToken') || '');
  const [adminUsername, setAdminUsername] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [adminLoginError, setAdminLoginError] = useState('');

  // User Session & Registration State
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [loginForm, setLoginForm] = useState({ name: '', email: '', confirmEmail: '', phone: '', address: '' });
  const [loginTab, setLoginTab] = useState('login'); // 'login' | 'register'
  const [emailOrPhoneInput, setEmailOrPhoneInput] = useState('');
  const [pendingAction, setPendingAction] = useState(null);

  // Outreach & Marketing Campaigns State
  const [customers, setCustomers] = useState([]);
  const [outreachForm, setOutreachForm] = useState({ type: 'whatsapp', message: 'Hi [Name]! Check out our new premium combo offers at SAVI\'S! ✨' });
  const [campaignProgress, setCampaignProgress] = useState(false);
  const [campaignStatus, setCampaignStatus] = useState('');

  // Image Upload indicator
  const [imageUploading, setImageUploading] = useState(false);
  const [cart, setCart] = useState([]);
  const [checkoutItems, setCheckoutItems] = useState([]);
  const getCheckoutTotal = () => {
    return checkoutItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState(localStorage.getItem('selected-theme') || 'light');
  
  // Wishlist state
  const [wishlist, setWishlist] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('wishlist') || '[]');
    } catch {
      return [];
    }
  });
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  
  // Sort and Filter state
  const [sortBy, setSortBy] = useState('default'); // 'default' | 'low-high' | 'high-low' | 'alphabetical' | 'newest'
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('All');
  
  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  // Search indexing reference
  const searchIndexRef = useRef([]);

  // Build the search index whenever the products list changes
  useEffect(() => {
    searchIndexRef.current = products.map(p => {
      // Collect tags if present, or infer from category/name/sizes/colors
      const inferredTags = [];
      if (p.name) inferredTags.push(...tokenize(p.name));
      if (p.category) inferredTags.push(...tokenize(p.category));
      if (p.sizes && Array.isArray(p.sizes)) {
        p.sizes.forEach(sz => inferredTags.push(...tokenize(sz)));
      }
      if (p.colors && Array.isArray(p.colors)) {
        p.colors.forEach(col => inferredTags.push(...tokenize(col)));
      }
      const tagsList = p.tags ? (Array.isArray(p.tags) ? p.tags : [p.tags]) : [];
      const allTags = [...tagsList, ...inferredTags].join(' ');

      return {
        product: p,
        nameTokens: tokenize(p.name),
        categoryTokens: tokenize(p.category),
        descriptionTokens: tokenize(p.description),
        tagsTokens: tokenize(allTags),
        brandTokens: tokenize(p.brand || ''),
        skuTokens: tokenize(p.sku || ''),
        idTokens: tokenize(p.id || ''),
        nameLower: (p.name || '').toLowerCase(),
        categoryLower: (p.category || '').toLowerCase(),
        descriptionLower: (p.description || '').toLowerCase(),
        tagsLower: allTags.toLowerCase(),
        brandLower: (p.brand || '').toLowerCase(),
        skuLower: (p.sku || '').toLowerCase()
      };
    });
  }, [products]);

  // Debounce the search input by 250ms
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 250);

    return () => {
      clearTimeout(handler);
    };
  }, [searchQuery]);
  
  // Toast notifications state
  const [toastMessage, setToastMessage] = useState('');
  const [toastShow, setToastShow] = useState(false);
  const toastTimeoutRef = useRef(null);

  // Hero Slider Index
  const [heroIndex, setHeroIndex] = useState(0);

  // Checkout Form State
  const [customerName, setCustomerName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');

  // Amazon/Flipkart checkout & profile states
  const [isCheckoutWizardOpen, setIsCheckoutWizardOpen] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState(1); // 1 = Shipping, 2 = Payment, 3 = Review, 4 = Success
  const [paymentMethod, setPaymentMethod] = useState('COD'); // 'COD' | 'UPI' | 'CARD'
  const [cardDetails, setCardDetails] = useState({ number: '', expiry: '', cvv: '' });
  const [upiVerified, setUpiVerified] = useState(false);
  const [upiTxnId, setUpiTxnId] = useState('');
  const [checkoutOrderId, setCheckoutOrderId] = useState('');
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [userOrders, setUserOrders] = useState([]);

  // Track Order states
  const [isTrackModalOpen, setIsTrackModalOpen] = useState(false);
  const [trackOrderIdInput, setTrackOrderIdInput] = useState('');
  const [trackedOrder, setTrackedOrder] = useState(null);
  const [trackError, setTrackError] = useState('');

  // Selected details sizes and colors
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');

  // Get product image matching selected color by checking explicit mappings or searching siblings in the same category
  const getProductImageForColor = (product, color) => {
    if (!product || !color) return product?.image || '';
    
    // Check if there is an explicit color-image mapping in the product
    if (product.colorImages && product.colorImages[color]) {
      return product.colorImages[color];
    }
    
    return product.image;
  };



  // Admin Product Adding Form State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '',
    price: '',
    oldPrice: '',
    image: '',
    category: 'Co-ords',
    description: '',
    sizes: 'S, M, L, XL',
    colors: 'Default',
    stock: 20,
    featured: false,
    colorImages: {}
  });

  // Order List filter status
  const [orderFilter, setOrderFilter] = useState('All');

  // Billing states
  const [billingCustomer, setBillingCustomer] = useState('new');
  const [billingNewCustName, setBillingNewCustName] = useState('');
  const [billingNewCustPhone, setBillingNewCustPhone] = useState('');
  const [billingNewCustEmail, setBillingNewCustEmail] = useState('');
  const [billingNewCustAddress, setBillingNewCustAddress] = useState('');
  
  const [billingSelectedProdId, setBillingSelectedProdId] = useState('');
  const [billingSelectedSize, setBillingSelectedSize] = useState('');
  const [billingSelectedColor, setBillingSelectedColor] = useState('');
  const [billingSelectedQty, setBillingSelectedQty] = useState(1);
  const [billingDiscount, setBillingDiscount] = useState(0);
  const [billingTaxRate, setBillingTaxRate] = useState(18); // Default 18% GST
  const [billingInvoiceItems, setBillingInvoiceItems] = useState([]);
  const [generatedInvoice, setGeneratedInvoice] = useState(null);

  // Sync selected billing product swatches
  useEffect(() => {
    if (billingSelectedProdId) {
      const prod = products.find(p => p.id === billingSelectedProdId);
      if (prod) {
        setBillingSelectedSize(prod.sizes?.[0] || 'M');
        setBillingSelectedColor(prod.colors?.[0] || 'Default');
        setBillingSelectedQty(1);
      }
    } else {
      setBillingSelectedSize('');
      setBillingSelectedColor('');
      setBillingSelectedQty(1);
    }
  }, [billingSelectedProdId, products]);


  // Trigger Toast Alert
  const triggerToast = (msg) => {
    if (toastTimeoutRef.current) {
      clearTimeout(toastTimeoutRef.current);
    }
    setToastMessage(msg);
    setToastShow(true);
    toastTimeoutRef.current = setTimeout(() => {
      setToastShow(false);
    }, 2600);
  };

  // Sync Wishlist to local storage
  useEffect(() => {
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  // Toggle Wishlist handler
  const toggleWishlist = (productId) => {
    setWishlist(prev => {
      const exists = prev.includes(productId);
      if (exists) {
        triggerToast("Removed from Wishlist ♡");
        return prev.filter(id => id !== productId);
      } else {
        triggerToast("Added to Wishlist ❤️");
        return [...prev, productId];
      }
    });
  };

  // Set html page title & theme
  useEffect(() => {
    document.title = activeTab === 'shop' 
      ? "SAVI'S collection — Premium Fabrics, Made in India" 
      : "Admin Dashboard — SAVI'S collection";
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('selected-theme', theme);
  }, [theme, activeTab]);

  // Sync Products & Stats
  const fetchStoreData = async () => {
    try {
      const pRes = await fetch(`${API_BASE_URL}/api/products`);
      if (pRes.ok) {
        const pData = await pRes.json();
        const updated = pData.map(p => {
          let resolvedImage = p.image || '';
          if (resolvedImage.startsWith('/uploads')) {
            resolvedImage = `${API_BASE_URL}${resolvedImage}`;
          } else if (resolvedImage.startsWith('uploads/')) {
            resolvedImage = `${API_BASE_URL}/${resolvedImage}`;
          }

          let resolvedImageHover = p.imageHover || '';
          if (resolvedImageHover.startsWith('/uploads')) {
            resolvedImageHover = `${API_BASE_URL}${resolvedImageHover}`;
          } else if (resolvedImageHover.startsWith('uploads/')) {
            resolvedImageHover = `${API_BASE_URL}/${resolvedImageHover}`;
          }

          const resolvedColorImages = {};
          if (p.colorImages) {
            for (const col in p.colorImages) {
              let img = p.colorImages[col];
              if (img && img.startsWith('/uploads')) {
                resolvedColorImages[col] = `${API_BASE_URL}${img}`;
              } else if (img && img.startsWith('uploads/')) {
                resolvedColorImages[col] = `${API_BASE_URL}/${img}`;
              } else {
                resolvedColorImages[col] = img;
              }
            }
          }

          const resolvedAdditionalImages = (p.additionalImages || []).map(img => {
            if (img && img.startsWith('/uploads')) {
              return `${API_BASE_URL}${img}`;
            } else if (img && img.startsWith('uploads/')) {
              return `${API_BASE_URL}/${img}`;
            }
            return img;
          });

          return {
            ...p,
            image: resolvedImage,
            imageHover: resolvedImageHover,
            colorImages: resolvedColorImages,
            additionalImages: resolvedAdditionalImages
          };
        });
        setProducts(updated.length > 0 ? updated : fallbackProducts);
      }
    } catch (err) {
      console.warn("Could not fetch live products. Using pre-loaded products.");
    } finally {
      setLoading(false);
    }
  };

    const handleAdminPanelAccess = async () => {
    // If already authorized, just toggle
    if (adminToken) {
      setActiveTab(activeTab === 'admin' ? 'shop' : 'admin');
      return;
    }

    const username = prompt("Enter Admin Username:");
    if (username === null) return; // cancelled
    
    const password = prompt("Enter Admin Password:");
    if (password === null) return; // cancelled

    if (!username || !password) {
      alert("Access Denied: Credentials required!");
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
      });
      if (res.ok) {
        const data = await res.json();
        localStorage.setItem('adminToken', data.token);
        setAdminToken(data.token);
        setActiveTab('admin');
        triggerToast("Admin authorized successfully!");
      } else {
        alert("Access Denied: Invalid username or password!");
      }
    } catch (err) {
      // Offline fallback
      if (username === 'admin' && (password === 'siva@123' || password === 'admin123')) {
        const mockToken = "savi-admin-secure-token-2026";
        localStorage.setItem('adminToken', mockToken);
        setAdminToken(mockToken);
        setActiveTab('admin');
        triggerToast("Offline Mode: Admin authorized!");
      } else {
        alert("Access Denied: Unable to connect to authorization server.");
      }
    }
  };

  const handleAdminLogout = () => {
    localStorage.removeItem('adminToken');
    setAdminToken('');
    setActiveTab('shop');
    triggerToast("Session expired or logged out.");
  };

  const handleAdminLoginSubmit = async (e) => {
    e.preventDefault();
    setAdminLoginError('');
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username: adminUsername, password: adminPassword })
      });
      if (res.ok) {
        const data = await res.json();
        localStorage.setItem('adminToken', data.token);
        setAdminToken(data.token);
        setAdminUsername('');
        setAdminPassword('');
        triggerToast("Admin authorized successfully!");
      } else {
        const data = await res.json();
        setAdminLoginError(data.error || "Invalid username or password");
      }
    } catch (err) {
      // Offline fallback
      if (adminUsername === 'admin' && adminPassword === 'admin123') {
        const mockToken = "savi-admin-secure-token-2026";
        localStorage.setItem('adminToken', mockToken);
        setAdminToken(mockToken);
        setAdminUsername('');
        setAdminPassword('');
        triggerToast("Offline Mode: Admin authorized successfully!");
      } else {
        setAdminLoginError("Unable to connect to backend server.");
      }
    }
  };

  const fetchAdminData = async () => {
    if (activeTab !== 'admin') return;
    if (!adminToken) return;
    try {
      // Orders
      const oRes = await fetch(`${API_BASE_URL}/api/orders`, {
        headers: { 'Authorization': `Bearer ${adminToken}` }
      });
      if (oRes.status === 401) {
        handleAdminLogout();
        return;
      }
      if (oRes.ok) {
        const oData = await oRes.json();
        setOrders(oData);
      }
      
      // Stats
      const sRes = await fetch(`${API_BASE_URL}/api/stats`, {
        headers: { 'Authorization': `Bearer ${adminToken}` }
      });
      if (sRes.status === 401) {
        handleAdminLogout();
        return;
      }
      if (sRes.ok) {
        const sData = await sRes.json();
        setStats(sData);
      }

      // Customers
      const cRes = await fetch(`${API_BASE_URL}/api/users`, {
        headers: { 'Authorization': `Bearer ${adminToken}` }
      });
      if (cRes.status === 401) {
        handleAdminLogout();
        return;
      }
      if (cRes.ok) {
        const cData = await cRes.json();
        setCustomers(cData);
      }

      // Inquiries
      const iRes = await fetch(`${API_BASE_URL}/api/inquiries`, {
        headers: { 'Authorization': `Bearer ${adminToken}` }
      });
      if (iRes.status === 401) {
        handleAdminLogout();
        return;
      }
      if (iRes.ok) {
        const iData = await iRes.json();
        setInquiries(iData);
      }
    } catch (err) {
      console.warn("Could not sync live admin analytics.");
    }
  };

  const handleDeleteInquiry = async (id) => {
    if (!window.confirm("Are you sure you want to delete this message?")) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/inquiries/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${adminToken}` }
      });
      if (res.status === 401) {
        handleAdminLogout();
        return;
      }
      if (res.ok) {
        triggerToast("Message deleted successfully.");
        fetchAdminData();
      } else {
        const err = await res.json();
        alert(err.error || "Failed to delete message.");
      }
    } catch (error) {
      console.error("Error deleting inquiry:", error);
      setInquiries(prev => prev.filter(i => i.id !== id));
      triggerToast("Offline Mode: Message deleted locally.");
    }
  };

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    if (!contactForm.name || !contactForm.email || !contactForm.message) {
      triggerToast("Please fill in all required fields.");
      return;
    }
    try {
      const res = await fetch(`${API_BASE_URL}/api/inquiries`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(contactForm)
      });
      if (res.ok) {
        triggerToast("Thank you! Your message has been sent successfully. We will get back to you soon.");
        setContactForm({ name: '', email: '', phone: '', subject: 'General Inquiry', message: '' });
      } else {
        const err = await res.json();
        triggerToast(err.error || "Failed to send message. Please try again.");
      }
    } catch (error) {
      console.warn("Offline Contact Form Simulation");
      triggerToast("Thank you! Your message was submitted successfully.");
      setContactForm({ name: '', email: '', phone: '', subject: 'General Inquiry', message: '' });
    }
  };

  const fetchUserOrders = async () => {
    if (!currentUser) return;
    try {
      const emailQuery = currentUser.email || '';
      const phoneQuery = currentUser.phone || '';
      const res = await fetch(`${API_BASE_URL}/api/users/orders?email=${encodeURIComponent(emailQuery)}&phone=${encodeURIComponent(phoneQuery)}`);
      if (res.ok) {
        const data = await res.json();
        setUserOrders(data);
      }
    } catch (err) {
      console.warn("Offline Mode: Simulating user order fetch.");
      const simulated = orders.filter(o => 
        o.email?.toLowerCase() === currentUser.email?.toLowerCase() ||
        o.phone === currentUser.phone
      );
      setUserOrders(simulated.length > 0 ? simulated : []);
    }
  };

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm("Are you sure you want to cancel this order?")) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/orders/${orderId}/cancel`, {
        method: 'POST'
      });
      if (res.ok) {
        triggerToast("Order Cancelled Successfully");
        fetchUserOrders();
        fetchAdminData();
      } else {
        alert("Failed to cancel order.");
      }
    } catch (err) {
      setUserOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: 'Cancelled' } : o));
      triggerToast("Offline Mode: Order Cancelled.");
    }
  };

  useEffect(() => {
    if (currentUser) {
      fetchUserOrders();
    } else {
      setUserOrders([]);
    }
  }, [currentUser]);

  // Restores user session from localStorage
  useEffect(() => {
    const savedUser = localStorage.getItem('savi_user');
    if (savedUser) {
      try {
        const user = JSON.parse(savedUser);
        setCurrentUser(user);
        // Pre-fill checkout form details
        setCustomerName(user.name || '');
        setEmail(user.email || '');
        setPhone(user.phone || '');
        setAddress(user.address || '');
      } catch (e) {
        console.error("Error loading saved user session:", e);
      }
    }
  }, []);

  useEffect(() => {
    fetchStoreData();
    const storeInterval = setInterval(fetchStoreData, 10000);
    return () => clearInterval(storeInterval);
  }, []);

  useEffect(() => {
    fetchAdminData();
  }, [activeTab, adminSubTab]);

  // Default Size/Color Swatch Selection
  useEffect(() => {
    if (selectedProduct) {
      setSelectedSize(selectedProduct.sizes?.[0] || 'M');
      setSelectedColor(selectedProduct.colors?.[0] || 'Default');
    }
  }, [selectedProduct]);

  // Hero Auto Slider Loop
  useEffect(() => {
    const slideTimer = setInterval(() => {
      setHeroIndex(prev => (prev + 1) % HERO_SLIDES_DATA.length);
    }, 5000);
    return () => clearInterval(slideTimer);
  }, []);



  // Cart operations
  const addToCart = (product, size, color) => {
    // Intercept if customer is not logged in
    if (!currentUser) {
      setPendingAction({ type: 'add_to_cart', payload: { product, size, color } });
      setIsLoginModalOpen(true);
      triggerToast("Please login or register to add items to your cart!");
      return;
    }

    const cartItemId = `${product.id}-${size}-${color}`;
    const existingIndex = cart.findIndex(item => item.cartItemId === cartItemId);
    
    if (existingIndex > -1) {
      const newCart = [...cart];
      newCart[existingIndex].quantity += 1;
      setCart(newCart);
    } else {
      setCart([...cart, {
        cartItemId,
        id: product.id,
        name: product.name,
        price: product.price,
        image: getProductImageForColor(product, color),
        size,
        color,
        quantity: 1
      }]);
    }
    setIsCartOpen(true);
    setSelectedProduct(null);
    triggerToast(`Added ${product.name} to cart`);
  };

  const startBuyNow = (product, size, color) => {
    const item = {
      cartItemId: `${product.id}-${size}-${color}`,
      id: product.id,
      name: product.name,
      price: product.price,
      image: getProductImageForColor(product, color),
      size,
      color,
      quantity: 1
    };
    setCheckoutItems([item]);
    addToCart(product, size, color);
    setSelectedProduct(null);
    setIsCartOpen(false);
    setCheckoutStep(1);
    setCardDetails({ number: '', expiry: '', cvv: '' });
    setUpiVerified(false);
    setIsCheckoutWizardOpen(true);
  };

  const updateCartQty = (cartItemId, change) => {
    const updated = cart.map(item => {
      if (item.cartItemId === cartItemId) {
        const newQty = item.quantity + change;
        return newQty > 0 ? { ...item, quantity: newQty } : null;
      }
      return item;
    }).filter(Boolean);
    setCart(updated);
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const handleCheckout = (e) => {
    if (e) e.preventDefault();
    if (cart.length === 0) return;
    setIsCartOpen(false);
    setCheckoutItems(cart);
    setCheckoutStep(1);
    setCardDetails({ number: '', expiry: '', cvv: '' });
    setUpiVerified(false);
    setUpiTxnId('');
    setIsCheckoutWizardOpen(true);
  };

  const submitOrder = async () => {
    if (checkoutItems.length === 0) return;
    const subtotal = getCheckoutTotal();
    const deliveryCost = subtotal >= 599 ? 0 : 50;
    const finalTotal = subtotal + deliveryCost;

    const paymentDetails = {};
    if (paymentMethod === 'CARD') {
      const cardNum = cardDetails.number || '';
      paymentDetails.cardLast4 = cardNum.trim().slice(-4) || 'XXXX';
    } else if (paymentMethod === 'UPI') {
      paymentDetails.upiTxnId = upiTxnId;
    }

    const orderData = {
      customerName,
      email,
      phone,
      address,
      items: checkoutItems.map(item => ({
        id: item.id,
        name: item.name,
        price: item.price,
        size: item.size,
        color: item.color,
        image: item.image,
        quantity: item.quantity
      })),
      totalAmount: finalTotal,
      paymentMethod,
      paymentStatus: paymentMethod === 'COD' ? 'Pending' : 'Completed',
      paymentDetails
    };

    try {
      const res = await fetch(`${API_BASE_URL}/api/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      });
      
      if (res.ok) {
        const order = await res.json();
        setCheckoutOrderId(order.id);
        setCheckoutStep(4);
        const remainingCart = cart.filter(cItem => !checkoutItems.some(oItem => oItem.cartItemId === cItem.cartItemId));
        setCart(remainingCart);
        triggerToast("Order placed successfully!");
        fetchUserOrders();
        fetchAdminData();

        // Auto-trigger WhatsApp message from customer to admin (includes product image URLs)
        const placedTotal = order.totalAmount || finalTotal;
        const itemsWithImages = order.items.map(item => {
          const itemImg = item.image || '';
          const fullImgUrl = itemImg.startsWith('http') ? itemImg : `${API_BASE_URL}${itemImg}`;
          return `- ${item.name} (${item.size || 'M'}) x${item.quantity}\n  Link to image: ${fullImgUrl}`;
        }).join('\n');
        
        const msg = `Hi SAVI'S collection! I just placed an order on your website.\n\n*Order ID:* ${order.id}\n*Total Amount:* Rs ${placedTotal.toLocaleString('en-IN')}\n*Payment Method:* ${order.paymentMethod || paymentMethod}\n\n*Customer Details:*\nName: ${customerName}\nPhone: ${phone}\nAddress: ${address}\n\n*Items Ordered:*\n${itemsWithImages}`;
        const waLink = `https://api.whatsapp.com/send?phone=919788633200&text=${encodeURIComponent(msg)}`;
        window.open(waLink, '_blank');
      } else {
        alert("Failed to submit order. Please check connection.");
      }
    } catch (err) {
      console.warn("Checkout connection offline. Simulating order placement.");
      const mockId = 'ORD-' + Math.floor(100000 + Math.random() * 900000);
      setCheckoutOrderId(mockId);
      const newMockOrder = {
        id: mockId,
        createdAt: new Date().toISOString(),
        status: 'Pending',
        paymentStatus: paymentMethod === 'COD' ? 'Pending' : 'Completed',
        ...orderData
      };
      setOrders(prev => [newMockOrder, ...prev]);
      setUserOrders(prev => [newMockOrder, ...prev]);
      setCheckoutStep(4);
      const remainingCart = cart.filter(cItem => !checkoutItems.some(oItem => oItem.cartItemId === cItem.cartItemId));
      setCart(remainingCart);
      triggerToast("Offline Mode: Order simulated!");

      // Auto-trigger WhatsApp message (Offline Mode, includes product image URLs)
      const offlineItemsWithImages = checkoutItems.map(item => {
        const itemImg = item.image || '';
        const fullImgUrl = itemImg.startsWith('http') ? itemImg : `${API_BASE_URL}${itemImg}`;
        return `- ${item.name} (${item.size || 'M'}) x${item.quantity}\n  Link to image: ${fullImgUrl}`;
      }).join('\n');

      const msg = `Hi SAVI'S collection! I just placed an order on your website (Offline).\n\n*Order ID:* ${mockId}\n*Total Amount:* Rs ${finalTotal.toLocaleString('en-IN')}\n*Payment Method:* ${paymentMethod}\n\n*Customer Details:*\nName: ${customerName}\nPhone: ${phone}\nAddress: ${address}\n\n*Items Ordered:*\n${offlineItemsWithImages}`;
      const waLink = `https://api.whatsapp.com/send?phone=919788633200&text=${encodeURIComponent(msg)}`;
      window.open(waLink, '_blank');
    }
  };

  // Add product from Admin panel
  const handleAddProduct = async (e) => {
    e.preventDefault();
    
    const formattedProduct = {
      ...newProduct,
      price: parseFloat(newProduct.price),
      oldPrice: newProduct.oldPrice ? parseFloat(newProduct.oldPrice) : null,
      sizes: newProduct.sizes.split(',').map(s => s.trim()),
      colors: newProduct.colors.split(',').map(c => c.trim()),
    };

    try {
      const res = await fetch(`${API_BASE_URL}/api/products`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`
        },
        body: JSON.stringify(formattedProduct)
      });
      
      if (res.status === 401) {
        handleAdminLogout();
        return;
      }
      if (res.ok) {
        triggerToast(`Added product "${formattedProduct.name}"`);
        setIsAddModalOpen(false);
        setNewProduct({
          name: '',
          price: '',
          oldPrice: '',
          image: '',
          category: 'Co-ords',
          description: '',
          sizes: 'S, M, L, XL',
          colors: 'Default',
          stock: 20,
          featured: false,
          colorImages: {}
        });
        fetchStoreData();
        fetchAdminData();
      } else {
        alert("Failed to add product. Ensure fields are correct.");
      }
    } catch (err) {
      // Offline simulation
      const mockProduct = {
        ...formattedProduct,
        id: 'mock-' + Date.now()
      };
      setProducts([mockProduct, ...products]);
      triggerToast("Offline Mode: Simulated adding product.");
      setIsAddModalOpen(false);
    }
  };

  // Delete product from Admin panel
  const handleDeleteProduct = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/products/${id}`, {
        method: 'DELETE',
        headers: { 
          'Authorization': `Bearer ${adminToken}`
        }
      });
      if (res.status === 401) {
        handleAdminLogout();
        return;
      }
      if (res.ok) {
        triggerToast("Product deleted successfully.");
        fetchStoreData();
        fetchAdminData();
      } else {
        alert("Failed to delete product.");
      }
    } catch (err) {
      setProducts(products.filter(p => p.id !== id));
      triggerToast("Offline Mode: Deleted product.");
    }
  };

  // Billing & Restocking Operations
  const handleAddBillingItem = () => {
    if (!billingSelectedProdId) {
      triggerToast("Please select a product first.");
      return;
    }
    const prod = products.find(p => p.id === billingSelectedProdId);
    if (!prod) return;

    const availableStock = prod.stock !== undefined ? prod.stock : 20;
    if (billingSelectedQty > availableStock) {
      triggerToast(`Only ${availableStock} units of this product are in stock!`);
      return;
    }

    const itemKey = `${billingSelectedProdId}-${billingSelectedSize}-${billingSelectedColor}`;
    const existingIdx = billingInvoiceItems.findIndex(i => i.itemKey === itemKey);

    if (existingIdx > -1) {
      const updated = [...billingInvoiceItems];
      const newQty = updated[existingIdx].quantity + parseInt(billingSelectedQty);
      if (newQty > availableStock) {
        triggerToast(`Cannot exceed available stock of ${availableStock} units.`);
        return;
      }
      updated[existingIdx].quantity = newQty;
      setBillingInvoiceItems(updated);
    } else {
      setBillingInvoiceItems([...billingInvoiceItems, {
        itemKey,
        id: prod.id,
        name: prod.name,
        price: prod.price,
        size: billingSelectedSize || 'M',
        color: billingSelectedColor || 'Default',
        quantity: parseInt(billingSelectedQty)
      }]);
    }
    triggerToast(`Added ${prod.name} to invoice items.`);
  };

  const handleRemoveBillingItem = (itemKey) => {
    setBillingInvoiceItems(billingInvoiceItems.filter(item => item.itemKey !== itemKey));
  };

  const handleCreateBill = async (e) => {
    e.preventDefault();
    if (billingInvoiceItems.length === 0) {
      alert("Please add at least one item to generate a bill.");
      return;
    }

    let customerDetails = {};
    if (billingCustomer === 'new') {
      if (!billingNewCustName || !billingNewCustPhone || !billingNewCustEmail) {
        alert("Please enter customer name, phone, and email.");
        return;
      }
      customerDetails = {
        customerName: billingNewCustName,
        phone: billingNewCustPhone,
        email: billingNewCustEmail,
        address: billingNewCustAddress || 'Boutique POS'
      };
    } else {
      const cust = customers.find(c => c.id === billingCustomer);
      if (!cust) return;
      customerDetails = {
        customerName: cust.name,
        phone: cust.phone,
        email: cust.email,
        address: cust.address || 'Boutique POS'
      };
    }

    const subtotal = billingInvoiceItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const discountAmt = parseFloat(billingDiscount) || 0;
    const taxAmt = Math.round((subtotal - discountAmt) * (parseFloat(billingTaxRate) / 100));
    const finalAmount = Math.max(0, subtotal - discountAmt + taxAmt);

    const orderData = {
      ...customerDetails,
      items: billingInvoiceItems.map(item => ({
        id: item.id,
        name: item.name,
        price: item.price,
        size: item.size,
        color: item.color,
        quantity: item.quantity
      })),
      totalAmount: finalAmount,
      paymentMethod: 'UPI',
      paymentStatus: 'Completed',
      status: 'Delivered', // POS orders are completed instantly
      invoiceSource: 'Admin POS System',
      taxRate: billingTaxRate,
      taxAmount: taxAmt,
      discountAmount: discountAmt,
      subtotalAmount: subtotal
    };

    try {
      const res = await fetch(`${API_BASE_URL}/api/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      });
      if (res.ok) {
        const order = await res.json();
        setGeneratedInvoice(order);
        setBillingInvoiceItems([]);
        setBillingNewCustName('');
        setBillingNewCustPhone('');
        setBillingNewCustEmail('');
        setBillingNewCustAddress('');
        setBillingDiscount(0);
        triggerToast("Invoice generated and stock updated successfully!");
        fetchStoreData();
        fetchAdminData();
      } else {
        alert("Failed to create invoice.");
      }
    } catch (err) {
      console.warn("Offline invoice generation.");
      const mockId = 'ORD-' + Math.floor(100000 + Math.random() * 900000);
      const simulatedOrder = {
        id: mockId,
        createdAt: new Date().toISOString(),
        ...orderData
      };
      setOrders(prev => [simulatedOrder, ...prev]);
      setGeneratedInvoice(simulatedOrder);
      setBillingInvoiceItems([]);
      setBillingNewCustName('');
      setBillingNewCustPhone('');
      setBillingNewCustEmail('');
      setBillingNewCustAddress('');
      setBillingDiscount(0);
      triggerToast("Offline Mode: Invoice generated locally!");
    }
  };

  const handleRestockProduct = async (id, newStock) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/products/${id}/stock`, {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`
        },
        body: JSON.stringify({ stock: parseInt(newStock) })
      });
      if (res.ok) {
        triggerToast("Stock updated successfully!");
        fetchStoreData();
      } else {
        alert("Failed to update stock.");
      }
    } catch (err) {
      setProducts(products.map(p => p.id === id ? { ...p, stock: parseInt(newStock) } : p));
      triggerToast("Offline Mode: Stock updated locally.");
    }
  };

  // Update order status from Admin panel
  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.status === 401) {
        handleAdminLogout();
        return;
      }
      if (res.ok) {
        triggerToast(`Order status updated to: ${newStatus}`);
        fetchAdminData();
      }
    } catch (err) {
      setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
      triggerToast("Offline Mode: Updated order status.");
    }
  };

  // Update order payment status from Admin panel
  const handleUpdateOrderPayment = async (orderId, newPayment) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/orders/${orderId}/payment`, {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`
        },
        body: JSON.stringify({ paymentStatus: newPayment })
      });
      if (res.status === 401) {
        handleAdminLogout();
        return;
      }
      if (res.ok) {
        triggerToast(`Payment updated to: ${newPayment}`);
        fetchAdminData();
      }
    } catch (err) {
      setOrders(orders.map(o => o.id === orderId ? { ...o, paymentStatus: newPayment } : o));
      triggerToast("Offline Mode: Updated order payment.");
    }
  };

  // Delete order
  const handleDeleteOrder = async (orderId) => {
    if (!window.confirm("Delete this order log permanently?")) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/orders/${orderId}`, {
        method: 'DELETE',
        headers: { 
          'Authorization': `Bearer ${adminToken}`
        }
      });
      if (res.status === 401) {
        handleAdminLogout();
        return;
      }
      if (res.ok) {
        triggerToast("Order deleted successfully.");
        fetchAdminData();
      }
    } catch (err) {
      setOrders(orders.filter(o => o.id !== orderId));
      triggerToast("Offline Mode: Deleted order.");
    }
  };

  // outreach marketing campaign
  const handleBulkOutreach = async (e) => {
    e.preventDefault();
    if (!outreachForm.message.trim()) return;
    setCampaignProgress(true);
    setCampaignStatus('Launching Broadcast Campaign...');
    try {
      const res = await fetch(`${API_BASE_URL}/api/outreach`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`
        },
        body: JSON.stringify({
          type: outreachForm.type,
          message: outreachForm.message
        })
      });
      if (res.status === 401) {
        handleAdminLogout();
        return;
      }
      if (res.ok) {
        const data = await res.json();
        setCampaignStatus(`Successfully launched simulated ${outreachForm.type.toUpperCase()} broadcast to ${data.count} customers! Check backend console for delivery trace logs.`);
        triggerToast(`Campaign Broadcast completed!`);
      } else {
        const err = await res.json();
        setCampaignStatus(`Outreach failed: ${err.error || 'Server error'}`);
      }
    } catch (e) {
      setCampaignStatus(`Offline Mode: Broadcast campaign simulated successfully for ${customers.length} registered customers!`);
      triggerToast(`Campaign simulated!`);
    } finally {
      setCampaignProgress(false);
    }
  };

  // trigger individual outreach messaging
  const handleIndividualOutreach = (userId, type, userEmail, userPhone, userName) => {
    let message = outreachForm.message.replace(/\[Name\]/gi, userName || 'Customer');
    if (type === 'whatsapp') {
      const cleanPhone = userPhone.replace(/\D/g, '');
      const waLink = `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encodeURIComponent(message)}`;
      window.open(waLink, '_blank');
      triggerToast(`WhatsApp message generated!`);
    } else {
      const mailLink = `mailto:${userEmail}?subject=${encodeURIComponent("Exclusive Offer — SAVI'S collection")}&body=${encodeURIComponent(message)}`;
      window.open(mailLink, '_blank');
      triggerToast(`Simulating Email link generation!`);
    }
  };

  // handle image upload from file selector
  const handleProductImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      alert("Please upload an image smaller than 5MB.");
      return;
    }
    setImageUploading(true);
    triggerToast("Uploading product image...");
    const reader = new FileReader();
    reader.onloadend = async () => {
      try {
        const base64Data = reader.result;
        const res = await fetch(`${API_BASE_URL}/api/upload`, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${adminToken}`
          },
          body: JSON.stringify({ imageBase64: base64Data })
        });
        if (res.status === 401) {
          handleAdminLogout();
          return;
        }
        if (res.ok) {
          const data = await res.json();
          const imageUrl = data.imagePath.startsWith('http') ? data.imagePath : `${API_BASE_URL}${data.imagePath}`;
          setNewProduct(prev => ({ ...prev, image: imageUrl }));
          triggerToast("Image file uploaded successfully!");
        } else {
          const err = await res.json();
          alert(`Image upload failed: ${err.error || 'Unknown error'}`);
        }
      } catch (err) {
        console.error("Upload failed", err);
        alert("Upload failed. Using a local file path mock URL.");
        setNewProduct(prev => ({ ...prev, image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=500&auto=format&fit=crop' }));
      } finally {
        setImageUploading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  // handle image upload for a specific color swatch
  const handleColorImageUpload = async (color, e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      alert("Please upload an image smaller than 5MB.");
      return;
    }
    triggerToast(`Uploading image for ${color}...`);
    const reader = new FileReader();
    reader.onloadend = async () => {
      try {
        const base64Data = reader.result;
        const res = await fetch(`${API_BASE_URL}/api/upload`, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${adminToken}`
          },
          body: JSON.stringify({ imageBase64: base64Data })
        });
        if (res.status === 401) {
          handleAdminLogout();
          return;
        }
        if (res.ok) {
          const data = await res.json();
          const imageUrl = data.imagePath.startsWith('http') ? data.imagePath : `${API_BASE_URL}${data.imagePath}`;
          setNewProduct(prev => ({
            ...prev,
            colorImages: {
              ...prev.colorImages,
              [color]: imageUrl
            }
          }));
          triggerToast(`Uploaded image for ${color}!`);
        } else {
          const err = await res.json();
          alert(`Image upload failed: ${err.error || 'Unknown error'}`);
        }
      } catch (err) {
        console.error("Upload failed", err);
      }
    };
    reader.readAsDataURL(file);
  };

  // User auth login submit
  const handleUserLoginOnly = async (e) => {
    e.preventDefault();
    if (!emailOrPhoneInput.trim()) {
      alert("Please enter your email or phone number!");
      return;
    }
    try {
      const res = await fetch(`${API_BASE_URL}/api/users/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ emailOrPhone: emailOrPhoneInput })
      });
      if (res.ok) {
        const uData = await res.json();
        setCurrentUser(uData);
        localStorage.setItem('savi_user', JSON.stringify(uData));
        setCustomerName(uData.name || '');
        setEmail(uData.email || '');
        setPhone(uData.phone || '');
        setAddress(uData.address || '');
        setIsLoginModalOpen(false);
        setEmailOrPhoneInput('');
        triggerToast(`Welcome back, ${uData.name || uData.email}!`);
        if (pendingAction) {
          if (pendingAction.type === 'add_to_cart') {
            addToCart(pendingAction.payload.product, pendingAction.payload.size, pendingAction.payload.color);
          } else if (pendingAction.type === 'buy_now') {
            startBuyNow(pendingAction.payload.product, pendingAction.payload.size, pendingAction.payload.color);
          } else if (pendingAction.type === 'open_checkout') {
            setIsCartOpen(false);
            setCheckoutItems(cart);
            setCheckoutStep(1);
            setCardDetails({ number: '', expiry: '', cvv: '' });
            setUpiVerified(false);
            setIsCheckoutWizardOpen(true);
          } else if (pendingAction.type === 'open_cart') {
            setIsCartOpen(true);
          }
          setPendingAction(null);
        }
      } else {
        const err = await res.json();
        alert(err.error || "Login failed.");
      }
    } catch (err) {
      console.warn("Offline Login Simulation");
      const query = emailOrPhoneInput.trim().toLowerCase();
      const existing = customers.find(u => 
        (u.email && u.email.toLowerCase() === query) ||
        (u.phone && u.phone.includes(query))
      );
      if (existing) {
        setCurrentUser(existing);
        localStorage.setItem('savi_user', JSON.stringify(existing));
        setCustomerName(existing.name || '');
        setEmail(existing.email || '');
        setPhone(existing.phone || '');
        setAddress(existing.address || '');
        setIsLoginModalOpen(false);
        setEmailOrPhoneInput('');
        triggerToast(`Offline Mode: Logged in as ${existing.name}`);
        if (pendingAction) {
          if (pendingAction.type === 'add_to_cart') {
            addToCart(pendingAction.payload.product, pendingAction.payload.size, pendingAction.payload.color);
          } else if (pendingAction.type === 'buy_now') {
            startBuyNow(pendingAction.payload.product, pendingAction.payload.size, pendingAction.payload.color);
          } else if (pendingAction.type === 'open_checkout') {
            setIsCartOpen(false);
            setCheckoutItems(cart);
            setCheckoutStep(1);
            setCardDetails({ number: '', expiry: '', cvv: '' });
            setUpiVerified(false);
            setIsCheckoutWizardOpen(true);
          } else if (pendingAction.type === 'open_cart') {
            setIsCartOpen(true);
          }
          setPendingAction(null);
        }
      } else {
        alert("Account not found. Please click the 'Register' tab to create a new account!");
      }
    }
  };

  // User registration submit logic
  const handleUserRegisterSubmit = async (e) => {
    e.preventDefault();
    if (!loginForm.email || !loginForm.phone || !loginForm.name) {
      alert("Name, email, and phone number are required for registration!");
      return;
    }
    if (loginForm.email.trim().toLowerCase() !== loginForm.confirmEmail.trim().toLowerCase()) {
      alert("Email verification mismatch! Please ensure both email fields match.");
      return;
    }
    try {
      const res = await fetch(`${API_BASE_URL}/api/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginForm)
      });
      if (res.ok) {
        const uData = await res.json();
        setCurrentUser(uData);
        localStorage.setItem('savi_user', JSON.stringify(uData));
        setCustomerName(uData.name || '');
        setEmail(uData.email || '');
        setPhone(uData.phone || '');
        setAddress(uData.address || '');
        setIsLoginModalOpen(false);
        triggerToast(`Registered successfully as ${uData.name}`);
        if (pendingAction) {
          if (pendingAction.type === 'add_to_cart') {
            addToCart(pendingAction.payload.product, pendingAction.payload.size, pendingAction.payload.color);
          } else if (pendingAction.type === 'buy_now') {
            startBuyNow(pendingAction.payload.product, pendingAction.payload.size, pendingAction.payload.color);
          } else if (pendingAction.type === 'open_checkout') {
            setIsCartOpen(false);
            setCheckoutItems(cart);
            setCheckoutStep(1);
            setCardDetails({ number: '', expiry: '', cvv: '' });
            setUpiVerified(false);
            setIsCheckoutWizardOpen(true);
          } else if (pendingAction.type === 'open_cart') {
            setIsCartOpen(true);
          }
          setPendingAction(null);
        }
      } else {
        alert("Registration failed.");
      }
    } catch (err) {
      const mockUser = {
        id: 'USR-' + Math.floor(100000 + Math.random() * 900000),
        createdAt: new Date().toISOString(),
        ...loginForm
      };
      setCurrentUser(mockUser);
      localStorage.setItem('savi_user', JSON.stringify(mockUser));
      setCustomerName(mockUser.name || '');
      setEmail(mockUser.email || '');
      setPhone(mockUser.phone || '');
      setAddress(mockUser.address || '');
      setIsLoginModalOpen(false);
      triggerToast(`Offline Mode: Registered successfully!`);
      if (pendingAction) {
        if (pendingAction.type === 'add_to_cart') {
          addToCart(pendingAction.payload.product, pendingAction.payload.size, pendingAction.payload.color);
        } else if (pendingAction.type === 'buy_now') {
          startBuyNow(pendingAction.payload.product, pendingAction.payload.size, pendingAction.payload.color);
        } else if (pendingAction.type === 'open_checkout') {
          setIsCartOpen(false);
          setCheckoutItems(cart);
          setCheckoutStep(1);
          setCardDetails({ number: '', expiry: '', cvv: '' });
          setUpiVerified(false);
          setIsCheckoutWizardOpen(true);
        } else if (pendingAction.type === 'open_cart') {
          setIsCartOpen(true);
        }
        setPendingAction(null);
      }
    }
  };

  const handleUserLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('savi_user');
    setCustomerName('');
    setEmail('');
    setPhone('');
    setAddress('');
    triggerToast("Logged out successfully");
  };

  const handleConfirmOnWhatsApp = () => {
    const placedOrder = userOrders.find(o => o.id === checkoutOrderId) || orders.find(o => o.id === checkoutOrderId);
    const placedTotal = placedOrder ? placedOrder.totalAmount : 0;
    const msg = `Hi SAVI'S collection! I just placed order ${checkoutOrderId} for ₹${placedTotal.toLocaleString('en-IN')} on your website. Please confirm my order!`;
    const cleanPhone = "919788633200";
    const waLink = `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encodeURIComponent(msg)}`;
    window.open(waLink, '_blank');
  };

  const handleTrackOrder = async (e) => {
    if (e) e.preventDefault();
    setTrackError('');
    setTrackedOrder(null);
    if (!trackOrderIdInput.trim()) return;

    try {
      const res = await fetch(`${API_BASE_URL}/api/orders/track/${trackOrderIdInput.trim()}`);
      if (res.ok) {
        const order = await res.json();
        setTrackedOrder(order);
      } else {
        setTrackError("Order not found. Please double-check the Order ID (e.g. ORD-123456).");
      }
    } catch (err) {
      console.warn("Offline Track Order Simulation");
      const localMatch = orders.find(o => o.id === trackOrderIdInput.trim());
      if (localMatch) {
        setTrackedOrder(localMatch);
      } else {
        setTrackError("Offline Mode: Order not found in local cache.");
      }
    }
  };

  // Filter helper functions for storefront
  const getNewArrivals = () => products.slice(0, 10);
  const getByCategory = (categoryName) => products.filter(p => {
    const pCat = p.category.toLowerCase().replace(/[\s-]/g, '');
    const target = categoryName.toLowerCase().replace(/[\s-]/g, '');
    
    if (target === 'cotton') {
      return pCat === 'cotton' || pCat === 'frocks';
    }
    if (target === 'nightgown' || target === 'nightwear') {
      return pCat === 'nightgown' || pCat === 'nightwear';
    }
    if (target === 'jewellery' || target === 'jewels') {
      return pCat === 'coveringornaments' || pCat === 'goldornaments' || pCat === 'jewellery' || pCat === 'jewelry';
    }
    if (target === 'kids') {
      return pCat === 'kids' || pCat === 'kidscollections';
    }
    return pCat === target;
  });

  // Hover image helper
  const getHoverImage = (product, idx, list) => {
    return product.image;
  };

  // Smooth scroll
  const scrollTo = (id) => {
    if (activeTab !== 'shop') {
      setActiveTab('shop');
      setTimeout(() => {
        const element = document.querySelector(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 150);
    } else {
      const element = document.querySelector(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  // Search logic
  const handleSearchChange = (e) => {
    const val = e.target.value;
    setSearchQuery(val);
  };

  const handleVoiceSearch = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      triggerToast("Voice search is not supported in this browser.");
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.start();
    triggerToast("Listening... Speak now 🎤");
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setSearchQuery(transcript);
      setDebouncedSearchQuery(transcript); // Immediate search execution on voice input
      triggerToast(`Search: "${transcript}"`);
      setTimeout(() => {
        scrollTo('#catalog-browser');
      }, 100);
    };
    recognition.onerror = () => {
      triggerToast("Voice recognition error.");
    };
  };

  const getFilteredSearchProducts = () => {
    const query = debouncedSearchQuery.trim();
    if (!query) return [];

    const queryInfo = parseQuery(query);
    const scoredList = searchIndexRef.current
      .map(item => {
        const score = computeProductScoreIndexed(item, queryInfo);
        return { product: item.product, score };
      })
      .filter(item => item.score > 0);

    scoredList.sort((a, b) => b.score - a.score);
    return scoredList.slice(0, 8).map(item => item.product);
  };

  const searchResults = getFilteredSearchProducts();

  const handleSearchResultClick = (product) => {
    setSelectedProduct(product);
    setSearchQuery('');
    setDebouncedSearchQuery('');
    setIsSearchFocused(false);
  };

  // Immediate search execution (Enter key / Search button click)
  const handleImmediateSearch = () => {
    setDebouncedSearchQuery(searchQuery);
    setIsSearchFocused(false);
    scrollTo('#catalog-browser');
  };

  // Get dynamic filtered and sorted catalog products
  const getFilteredAndSortedProducts = () => {
    let list = [...products];

    // 1. Filter by category
    if (selectedCategoryFilter !== 'All') {
      list = list.filter(p => {
        const pCat = p.category.toLowerCase().replace(/[\s-]/g, '');
        const target = selectedCategoryFilter.toLowerCase().replace(/[\s-]/g, '');
        if (target === 'jewellery' || target === 'jewels') {
          return pCat === 'coveringornaments' || pCat === 'goldornaments' || pCat === 'jewellery' || pCat === 'jewelry';
        }
        if (target === 'kids') {
          return pCat === 'kids' || pCat === 'kidscollections' || pCat === 'kidscollection';
        }
        if (target === 'cotton') {
          return pCat === 'cotton' || pCat === 'frock' || pCat === 'frocks';
        }
        if (target === 'nightgown' || target === 'nightwear') {
          return pCat === 'nightgown' || pCat === 'nightwear' || pCat === 'nightgowns';
        }
        return pCat === target;
      });
    }

    // 2. Filter by search query (intelligent search scoring & ranking)
    const query = debouncedSearchQuery.trim();
    if (query) {
      const queryInfo = parseQuery(query);
      const scoredList = searchIndexRef.current
        .map(item => {
          const score = computeProductScoreIndexed(item, queryInfo);
          return { product: item.product, score };
        })
        .filter(item => item.score > 0);

      if (scoredList.length > 0) {
        scoredList.sort((a, b) => b.score - a.score);
        list = scoredList.map(item => item.product);
      } else {
        list = [];
      }
    }

    // 3. Sort
    if (sortBy === 'low-high') {
      list.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'high-low') {
      list.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'alphabetical') {
      list.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === 'newest') {
      list.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
    }

    return list;
  };

  return (
    <div className="app-container">

      {/* Header */}
      <header className="glass main-header-redesign">
        <div className="header-container-inner">
          {/* Left: Brand Name / Logo */}
          <div className="logo-area">
            <a 
              href="#" 
              className="logo" 
              onClick={(e) => { e.preventDefault(); setActiveTab('shop'); setSelectedCategoryFilter('All'); }}
              onDoubleClick={() => handleAdminPanelAccess()}
              style={{ display: 'flex', alignItems: 'center', gap: '10px' }}
            >
              <img 
                src="https://lh3.googleusercontent.com/d/1GcwTv0EvQPSpJqwA6gQ0SDsIPh9XlI-q" 
                alt="saivi collection" 
                style={{ height: '54px', width: 'auto', objectFit: 'contain' }} 
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                <span className="logo-saivi">saivi</span>
                <span className="logo-collection">collection</span>
              </div>
            </a>
          </div>
          
          {/* Center: Large Rounded Search Box */}
          <div className="search-bar-wrap-new">
            <div className="search-bar-new">
              <span className="search-icon-left">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
              </span>
              <input 
                type="text" 
                placeholder="Search for products, categories..." 
                value={searchQuery}
                onChange={handleSearchChange}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleImmediateSearch();
                  }
                }}
              />
              <button className="voice-search-btn" type="button" onClick={handleVoiceSearch} title="Voice Search">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"></path><path d="M19 10v2a7 7 0 0 1-14 0v-2"></path><line x1="12" y1="19" x2="12" y2="22"></line></svg>
              </button>
              <button className="search-btn" type="button" onClick={handleImmediateSearch}>Search</button>
            </div>
            {isSearchFocused && searchResults.length > 0 && (
              <div className="search-results-dropdown-new glass">
                {searchResults.map(p => (
                  <div 
                    key={p.id} 
                    className="search-result-item-new" 
                    onClick={() => handleSearchResultClick(p)}
                  >
                    <img src={p.image} alt={p.name} />
                    <div className="search-result-info">
                      <div className="search-result-name">{highlightText(p.name, debouncedSearchQuery)}</div>
                      <div className="search-result-cat">{highlightText(p.category, debouncedSearchQuery)} · ₹{p.price}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right: Actions Menu */}
          <div className="header-actions-row">
            {/* Dark Mode */}
            <button className="header-action-btn" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} title="Toggle Theme">
              <span className="action-icon">
                {theme === 'dark' ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>
                )}
              </span>
              <span className="action-label">{theme === 'dark' ? 'Light' : 'Dark'}</span>
            </button>

            {/* Profile / Account */}
            <button 
              className="header-action-btn" 
              title="Account Settings"
              onClick={() => {
                if (currentUser) {
                  setIsProfileOpen(true);
                  fetchUserOrders();
                } else {
                  setPendingAction(null);
                  setIsLoginModalOpen(true);
                }
              }}
            >
              <span className="action-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
              </span>
              <span className="action-label">{currentUser ? (currentUser.name?.split(' ')[0] || 'Profile') : 'Login'}</span>
            </button>

            {/* Settings */}
            <button 
              className="header-action-btn" 
              title="Preferences"
              onClick={() => {
                if (currentUser) {
                  setIsProfileOpen(true);
                  fetchUserOrders();
                } else {
                  setPendingAction(null);
                  setIsLoginModalOpen(true);
                }
              }}
            >
              <span className="action-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
              </span>
              <span className="action-label">Config</span>
            </button>

            {/* Wishlist */}
            <button className="header-action-btn" onClick={() => setIsWishlistOpen(true)} title="Wishlist">
              <span className="action-icon relative">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path></svg>
                {wishlist.length > 0 && <span className="action-badge">{wishlist.length}</span>}
              </span>
              <span className="action-label">Wishlist</span>
            </button>

            {/* Cart */}
            <button 
              className="header-action-btn" 
              title="Shopping Cart"
              onClick={() => {
                if (!currentUser) {
                  setPendingAction({ type: 'open_cart' });
                  setIsLoginModalOpen(true);
                  triggerToast("Please login or register to view your cart!");
                } else {
                  setIsCartOpen(true);
                }
              }}
            >
              <span className="action-icon relative">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>
                {cart.length > 0 && <span className="action-badge">{cart.reduce((s, i) => s + i.quantity, 0)}</span>}
              </span>
              <span className="action-label">Bag</span>
            </button>

            {/* Admin Portal Button */}
            <button 
              className="header-action-btn" 
              title="Admin Panel"
              onClick={() => handleAdminPanelAccess()}
              style={{ borderStyle: activeTab === 'admin' ? 'solid' : 'dashed', borderColor: activeTab === 'admin' ? 'var(--primary)' : 'var(--border-color)' }}
            >
              <span className="action-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
              </span>
              <span className="action-label" style={{ color: activeTab === 'admin' ? 'var(--primary)' : 'inherit' }}>Admin</span>
            </button>
          </div>
        </div>
      </header>

      {/* Navbar Tabs */}
      {activeTab === 'shop' && (
        <div className="category-menu-bar">
          <div className="category-menu-container">
            {[
              { id: 'All', label: 'All Items' },
              { id: 'Sarees', label: 'Sarees' },
              { id: 'Kurtis', label: 'Kurtis' },
              { id: 'Cotton', label: 'Cotton Collection' },
              { id: 'Kids', label: 'Kids' },
              { id: 'Jewels', label: 'Jewellery' }
            ].map(cat => (
              <button
                key={cat.id}
                className={`category-menu-btn ${selectedCategoryFilter === cat.id ? 'active' : ''}`}
                onClick={() => {
                  setSelectedCategoryFilter(cat.id);
                  setSearchQuery('');
                  scrollTo('#top');
                }}
              >
                {cat.label}
              </button>
            ))}
            
            <button 
              className="category-menu-btn link-btn"
              onClick={() => {
                setTrackOrderIdInput('');
                setTrackedOrder(null);
                setTrackError('');
                setIsTrackModalOpen(true);
              }}
            >
              🔍 Track Order
            </button>
            <button 
              className="category-menu-btn link-btn"
              onClick={() => scrollTo('#contact-section')}
            >
              📞 Contact Us
            </button>
            <button 
              className="category-menu-btn link-btn"
              onClick={() => handleAdminPanelAccess()}
            >
              ⚙️ Admin Panel
            </button>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main style={{ padding: activeTab === 'shop' ? '0' : '2.5rem 0' }}>
        
        {/* TAB 1: SHOP STOREFRONT */}
        {activeTab === 'shop' && (
          <div className="storefront-page">
            
            {(selectedCategoryFilter !== 'All' || searchQuery.trim() !== '') ? (
              /* Dynamic Catalog Browser Grid */
              <section className="section" id="catalog-browser" style={{ padding: '3rem 1.5rem', background: 'var(--bg-dark)' }}>
                <div className="section-inner" style={{ maxWidth: '1200px', margin: '0 auto' }}>
                  
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center', 
                    marginBottom: '2rem', 
                    flexWrap: 'wrap', 
                    gap: '15px', 
                    borderBottom: '1px solid var(--border-color)', 
                    paddingBottom: '1.5rem' 
                  }}>
                    <div>
                      <h2 style={{ fontSize: '24px', fontWeight: '600', fontFamily: "'Playfair Display', serif", textTransform: 'capitalize' }}>
                        {selectedCategoryFilter !== 'All' ? `${selectedCategoryFilter} Collection` : `Search Results for "${searchQuery}"`}
                      </h2>
                      <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                        Showing {getFilteredAndSortedProducts().length} items
                      </p>
                    </div>
                    
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '11px', fontWeight: '600', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '.5px' }}>Sort By:</span>
                        <select
                          value={sortBy}
                          onChange={(e) => setSortBy(e.target.value)}
                          style={{
                            padding: '8px 16px',
                            borderRadius: '20px',
                            border: '1px solid var(--border-color)',
                            background: 'var(--bg-card)',
                            color: 'var(--text-primary)',
                            fontSize: '12px',
                            fontWeight: '600',
                            outline: 'none',
                            cursor: 'pointer'
                          }}
                        >
                          <option value="default">Featured</option>
                          <option value="low-high">Price: Low to High</option>
                          <option value="high-low">Price: High to Low</option>
                          <option value="alphabetical">Alphabetical (A-Z)</option>
                          <option value="newest">Newest Arrivals</option>
                        </select>
                      </div>
                      
                      <button
                        onClick={() => {
                          setSelectedCategoryFilter('All');
                          setSearchQuery('');
                          setSortBy('default');
                        }}
                        style={{
                          padding: '8px 16px',
                          borderRadius: '20px',
                          border: 'none',
                          background: 'var(--primary)',
                          color: '#fff',
                          fontSize: '11px',
                          fontWeight: '600',
                          cursor: 'pointer',
                          textTransform: 'uppercase',
                          letterSpacing: '.5px'
                        }}
                      >
                        Reset Filters
                      </button>
                    </div>
                  </div>

                  {getFilteredAndSortedProducts().length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '80px 10px', color: 'var(--text-secondary)' }}>
                      <div style={{ fontSize: '64px', marginBottom: '20px' }}>🔍</div>
                      <h4 style={{ fontSize: '18px', fontWeight: '600', fontFamily: "'Playfair Display', serif" }}>No Apparel Found</h4>
                      <p style={{ fontSize: '13px', marginTop: '6px' }}>We couldn't find any items matching your criteria. Try adjusting your filter tags or search text.</p>
                      <button 
                        className="btn btn-secondary"
                        onClick={() => {
                          setSelectedCategoryFilter('All');
                          setSearchQuery('');
                          setSortBy('default');
                        }}
                        style={{ marginTop: '20px', padding: '10px 20px', fontSize: '12px' }}
                      >
                        Back to Shop
                      </button>
                    </div>
                  ) : (
                    <div className="products-grid-catalog" style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
                      gap: '30px 20px',
                      padding: '10px 0'
                    }}>
                      {getFilteredAndSortedProducts().map((p, idx, arr) => (
                        <ProductCard 
                          key={p.id} 
                          product={p} 
                          hoverImage={getHoverImage(p, idx, arr)} 
                          onOpen={() => setSelectedProduct(p)} 
                          onAddCart={() => addToCart(p, p.sizes?.[0] || 'M', p.colors?.[0] || 'Default')} 
                          onWishlist={() => toggleWishlist(p.id)}
                          isWishlisted={wishlist.includes(p.id)}
 
                          onBuyNow={() => startBuyNow(p, p.sizes?.[0] || 'M', p.colors?.[0] || 'Default')}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </section>
            ) : (
              <>
                {/* Redesigned Premium Homepage Layout */}
                
                {/* 1. Hero Section (Split Layout) */}
                <div className="hero-section">
                  <div className="hero-left" key={heroIndex} style={{ animation: 'fadeInUp 0.6s ease' }}>
                    <span className="hero-small-heading">{HERO_SLIDES_DATA[heroIndex].tag}</span>
                    <h1 className="hero-headline" dangerouslySetInnerHTML={{ __html: HERO_SLIDES_DATA[heroIndex].title.replace("Made in India,", "<em>Made in India,</em>") }}></h1>
                    <p className="hero-desc">{HERO_SLIDES_DATA[heroIndex].desc}</p>
                    <div className="hero-buttons">
                      <a href="#new-arrivals" className="btn-premium btn-premium-primary" onClick={(e) => { e.preventDefault(); scrollTo('#new-arrivals'); }}>Shop Now</a>
                      <a href="#collections" className="btn-premium btn-premium-secondary" onClick={(e) => { e.preventDefault(); scrollTo('#collections'); }}>Explore More</a>
                    </div>
                    <div className="hero-trust-badges">
                      <span>🚚 Free Shipping</span>
                      <span>💎 Premium</span>
                      <span>↩ Easy Returns</span>
                    </div>
                  </div>
                  <div className="hero-right">
                    <img 
                      src={HERO_SLIDES_DATA[heroIndex].img} 
                      alt="Lifestyle Premium" 
                      className="hero-lifestyle-img" 
                      key={heroIndex}
                      style={{ animation: 'scaleUp 0.8s cubic-bezier(0.16, 1, 0.3, 1)' }}
                    />
                    <div className="hero-dots-desktop">
                      {HERO_SLIDES_DATA.map((_, i) => (
                        <button 
                          key={i} 
                          className={`hero-dot-desktop ${heroIndex === i ? 'active' : ''}`}
                          onClick={() => setHeroIndex(i)}
                          aria-label={`Go to slide ${i + 1}`}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                {/* 2. Shop by Category */}
                <section className="category-section" id="collections">
                  <div className="section-head" style={{ marginBottom: '2.5rem' }}>
                    <span style={{ fontSize: '13px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '2px', color: 'var(--primary)' }}>Premium Selection</span>
                    <h2 className="section-title" style={{ marginTop: '5px' }}>Shop By Category</h2>
                  </div>
                  <div className="category-grid">
                    {COLLECTIONS.map((c, i) => (
                      <a 
                        href={c.href} 
                        key={i} 
                        className="category-card"
                        onClick={(e) => {
                          if (c.href.startsWith('#')) {
                            e.preventDefault();
                            scrollTo(c.href);
                          }
                        }}
                      >
                        <img src={c.img} alt={c.name} loading="lazy" />
                        <div className="category-card-title">{c.name}</div>
                      </a>
                    ))}
                  </div>
                </section>

                {/* 3. New Arrivals */}
                <section className="section new-arrivals-section" id="new-arrivals" style={{ background: 'var(--bg-dark)' }}>
                  <div className="section-head" style={{ marginBottom: '2.5rem' }}>
                    <span style={{ fontSize: '13px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '2px', color: 'var(--primary)' }}>Weekly Releases</span>
                    <h2 className="section-title" style={{ marginTop: '5px' }}>New Arrivals</h2>
                  </div>
                  
                  {/* Desktop Grid (4 cols) */}
                  <div className="products-grid-desktop">
                    {getNewArrivals().slice(0, 8).map((p, idx, arr) => (
                      <ProductCard 
                        key={p.id} 
                        product={p} 
                        hoverImage={getHoverImage(p, idx, arr)} 
                        onOpen={() => setSelectedProduct(p)} 
                        onAddCart={() => addToCart(p, p.sizes?.[0] || 'M', p.colors?.[0] || 'Default')} 
                        onWishlist={() => toggleWishlist(p.id)}
                        isWishlisted={wishlist.includes(p.id)}
 
                        onBuyNow={() => startBuyNow(p, p.sizes?.[0] || 'M', p.colors?.[0] || 'Default')}
                      />
                    ))}
                  </div>

                  {/* Mobile Horizontal Scroll */}
                  <div className="products-scroll">
                    {getNewArrivals().map((p, idx, arr) => (
                      <ProductCard 
                        key={p.id} 
                        product={p} 
                        hoverImage={getHoverImage(p, idx, arr)} 
                        onOpen={() => setSelectedProduct(p)} 
                        onAddCart={() => addToCart(p, p.sizes?.[0] || 'M', p.colors?.[0] || 'Default')} 
                        onWishlist={() => toggleWishlist(p.id)}
                        isWishlisted={wishlist.includes(p.id)}
 
                        onBuyNow={() => startBuyNow(p, p.sizes?.[0] || 'M', p.colors?.[0] || 'Default')}
                      />
                    ))}
                  </div>
                </section>

                {/* 4. Featured Collections */}
                <section className="section collections-section">
                  <div className="section-head" style={{ marginBottom: '2.5rem' }}>
                    <span style={{ fontSize: '13px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '2px', color: 'var(--primary)' }}>Lookbooks</span>
                    <h2 className="section-title" style={{ marginTop: '5px' }}>Featured Collections</h2>
                  </div>
                  <div className="featured-banners-grid">
                    <a href="#sarees" className="featured-banner-card" onClick={(e) => { e.preventDefault(); scrollTo('#sarees'); }}>
                      <img src="https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&q=80" alt="Wedding Collection" />
                      <div className="featured-banner-content">
                        <span className="featured-banner-tag">Bridal Gold & Silk</span>
                        <h3 className="featured-banner-title">The Wedding Collection</h3>
                        <p className="featured-banner-subtitle">Exquisite Kanjeevaram and Banarasi sarees designed for luxury weddings.</p>
                        <span className="featured-banner-cta">Explore Collection &rarr;</span>
                      </div>
                    </a>
                    <a href="#kurtis" className="featured-banner-card" onClick={(e) => { e.preventDefault(); scrollTo('#kurtis'); }}>
                      <img src="https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600&q=80" alt="Festival Collection" />
                      <div className="featured-banner-content">
                        <span className="featured-banner-tag">Vibrant Georgette</span>
                        <h3 className="featured-banner-title">The Festival Collection</h3>
                        <p className="featured-banner-subtitle">Celebrate in style with premium, color-matched festive ensembles.</p>
                        <span className="featured-banner-cta">Explore Collection &rarr;</span>
                      </div>
                    </a>
                    <a href="#cotton" className="featured-banner-card" onClick={(e) => { e.preventDefault(); scrollTo('#cotton'); }}>
                      <img src="https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=600&q=80" alt="Cotton Collection" />
                      <div className="featured-banner-content">
                        <span className="featured-banner-tag">Breathable Chic</span>
                        <h3 className="featured-banner-title">The Cotton Collection</h3>
                        <p className="featured-banner-subtitle">Premium soft cotton co-ords and frocks crafted for daily comfort.</p>
                        <span className="featured-banner-cta">Explore Collection &rarr;</span>
                      </div>
                    </a>
                    <a href="#coords" className="featured-banner-card" onClick={(e) => { e.preventDefault(); scrollTo('#coords'); }}>
                      <img src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600&q=80" alt="Designer Collection" />
                      <div className="featured-banner-content">
                        <span className="featured-banner-tag">Modern Silhouette</span>
                        <h3 className="featured-banner-title">The Designer Collection</h3>
                        <p className="featured-banner-subtitle">Contemporary fusion wear blending traditional arts with modern silhouettes.</p>
                        <span className="featured-banner-cta">Explore Collection &rarr;</span>
                      </div>
                    </a>
                  </div>
                </section>

                {/* 5. Best Sellers Section */}
                <section className="section bestsellers-section" id="bestsellers">
                  <div className="section-head" style={{ marginBottom: '2.5rem' }}>
                    <span style={{ fontSize: '13px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '2px', color: 'var(--primary)' }}>Customer Favorites</span>
                    <h2 className="section-title" style={{ marginTop: '5px' }}>Best Sellers</h2>
                  </div>
                  
                  {/* Desktop Grid */}
                  <div className="products-grid-desktop">
                    {products.filter(p => p.featured).slice(0, 8).map((p, idx, arr) => (
                      <ProductCard 
                        key={p.id} 
                        product={p} 
                        hoverImage={getHoverImage(p, idx, arr)} 
                        onOpen={() => setSelectedProduct(p)} 
                        onAddCart={() => addToCart(p, p.sizes?.[0] || 'M', p.colors?.[0] || 'Default')} 
                        onWishlist={() => toggleWishlist(p.id)}
                        isWishlisted={wishlist.includes(p.id)}
 
                        onBuyNow={() => startBuyNow(p, p.sizes?.[0] || 'M', p.colors?.[0] || 'Default')}
                      />
                    ))}
                  </div>

                  {/* Mobile Horizontal Scroll */}
                  <div className="products-scroll">
                    {products.filter(p => p.featured).slice(0, 10).map((p, idx, arr) => (
                      <ProductCard 
                        key={p.id} 
                        product={p} 
                        hoverImage={getHoverImage(p, idx, arr)} 
                        onOpen={() => setSelectedProduct(p)} 
                        onAddCart={() => addToCart(p, p.sizes?.[0] || 'M', p.colors?.[0] || 'Default')} 
                        onWishlist={() => toggleWishlist(p.id)}
                        isWishlisted={wishlist.includes(p.id)}
 
                        onBuyNow={() => startBuyNow(p, p.sizes?.[0] || 'M', p.colors?.[0] || 'Default')}
                      />
                    ))}
                  </div>
                </section>

                {/* 6. Why Choose Us */}
                <section className="section why-us-section">
                  <div className="why-us-grid">
                    <div className="why-us-card">
                      <span className="why-us-icon">🚚</span>
                      <h4 className="why-us-title">Free Shipping</h4>
                      <p className="why-us-desc">Complimentary shipping on all premium domestic orders above ₹599.</p>
                    </div>
                    <div className="why-us-card">
                      <span className="why-us-icon">🔄</span>
                      <h4 className="why-us-title">Easy Returns</h4>
                      <p className="why-us-desc">Hassle-free 7-day return and exchange policy on all purchases.</p>
                    </div>
                    <div className="why-us-card">
                      <span className="why-us-icon">🔒</span>
                      <h4 className="why-us-title">Secure Payments</h4>
                      <p className="why-us-desc">100% encrypted safe payment gateway with support for cards & UPI.</p>
                    </div>
                    <div className="why-us-card">
                      <span className="why-us-icon">🇮🇳</span>
                      <h4 className="why-us-title">Premium Quality</h4>
                      <p className="why-us-desc">Ethically sourced materials handcrafted by skilled Indian artisans.</p>
                    </div>
                  </div>
                </section>



                {/* 8. Instagram Gallery */}
                <section className="section insta-section">
                  <div className="section-head" style={{ marginBottom: '2.5rem', textAlign: 'center' }}>
                    <span style={{ fontSize: '13px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '2px', color: 'var(--primary)' }}>Social Catalog</span>
                    <h2 className="section-title" style={{ marginTop: '5px' }}>Shop From Instagram</h2>
                  </div>
                  <div className="insta-grid">
                    {INSTAGRAM_GALLERY_DATA.map((url, i) => (
                      <div className="insta-card" key={i}>
                        <img src={url} alt={`Insta post ${i + 1}`} loading="lazy" />
                        <div className="insta-overlay">❤️</div>
                      </div>
                    ))}
                  </div>
                </section>

                {/* 9. Newsletter Subscription */}
                <section className="section newsletter-section">
                  <div className="newsletter-card">
                    <h2 className="newsletter-title">Join the SAVI'S Privilege Club</h2>
                    <p className="newsletter-desc">Subscribe to receive exclusive access to private weekly collections, flash combo sales, and custom sizing previews.</p>
                    <form className="newsletter-form" onSubmit={(e) => { e.preventDefault(); triggerToast("Thank you for subscribing to our newsletter! ✨"); e.target.reset(); }}>
                      <input type="email" required placeholder="Enter your email address" className="newsletter-input" />
                      <button type="submit" className="btn-premium btn-premium-primary newsletter-btn">Subscribe</button>
                    </form>
                  </div>
                </section>

                {/* Dynamic Category Sections for Navigation Smooth Scroll anchors */}
                {/* Cotton section */}
                <section className="section" id="cotton" style={{ background: 'var(--bg-dark)' }}>
                  <div className="section-head" style={{ marginBottom: '2.5rem' }}>
                    <span style={{ fontSize: '13px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '2px', color: 'var(--primary)' }}>Pure Comfort</span>
                    <h2 className="section-title" style={{ marginTop: '5px' }}>Cotton Collection</h2>
                  </div>
                  <div className="products-grid-desktop">
                    {getByCategory('Cotton').slice(0, 8).map((p, idx, arr) => (
                      <ProductCard 
                        key={p.id} 
                        product={p} 
                        hoverImage={getHoverImage(p, idx, arr)} 
                        onOpen={() => setSelectedProduct(p)} 
                        onAddCart={() => addToCart(p, p.sizes?.[0] || 'M', p.colors?.[0] || 'Default')} 
                        onWishlist={() => toggleWishlist(p.id)}
                        isWishlisted={wishlist.includes(p.id)}
 
                        onBuyNow={() => startBuyNow(p, p.sizes?.[0] || 'M', p.colors?.[0] || 'Default')}
                      />
                    ))}
                  </div>
                  <div className="products-scroll">
                    {getByCategory('Cotton').map((p, idx, arr) => (
                      <ProductCard 
                        key={p.id} 
                        product={p} 
                        hoverImage={getHoverImage(p, idx, arr)} 
                        onOpen={() => setSelectedProduct(p)} 
                        onAddCart={() => addToCart(p, p.sizes?.[0] || 'M', p.colors?.[0] || 'Default')} 
                        onWishlist={() => toggleWishlist(p.id)}
                        isWishlisted={wishlist.includes(p.id)}
 
                        onBuyNow={() => startBuyNow(p, p.sizes?.[0] || 'M', p.colors?.[0] || 'Default')}
                      />
                    ))}
                  </div>
                </section>

                {/* Co-ords Section */}
                <section className="section" id="coords" style={{ background: 'var(--bg-dark)' }}>
                  <div className="section-head" style={{ marginBottom: '2.5rem' }}>
                    <span style={{ fontSize: '13px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '2px', color: 'var(--primary)' }}>Chic Combos</span>
                    <h2 className="section-title" style={{ marginTop: '5px' }}>Co-ords</h2>
                  </div>
                  <div className="products-grid-desktop">
                    {getByCategory('Co-ords').slice(0, 8).map((p, idx, arr) => (
                      <ProductCard 
                        key={p.id} 
                        product={p} 
                        hoverImage={getHoverImage(p, idx, arr)} 
                        onOpen={() => setSelectedProduct(p)} 
                        onAddCart={() => addToCart(p, p.sizes?.[0] || 'M', p.colors?.[0] || 'Default')} 
                        onWishlist={() => toggleWishlist(p.id)}
                        isWishlisted={wishlist.includes(p.id)}
 
                        onBuyNow={() => startBuyNow(p, p.sizes?.[0] || 'M', p.colors?.[0] || 'Default')}
                      />
                    ))}
                  </div>
                  <div className="products-scroll">
                    {getByCategory('Co-ords').map((p, idx, arr) => (
                      <ProductCard 
                        key={p.id} 
                        product={p} 
                        hoverImage={getHoverImage(p, idx, arr)} 
                        onOpen={() => setSelectedProduct(p)} 
                        onAddCart={() => addToCart(p, p.sizes?.[0] || 'M', p.colors?.[0] || 'Default')} 
                        onWishlist={() => toggleWishlist(p.id)}
                        isWishlisted={wishlist.includes(p.id)}
 
                        onBuyNow={() => startBuyNow(p, p.sizes?.[0] || 'M', p.colors?.[0] || 'Default')}
                      />
                    ))}
                  </div>
                </section>

                {/* Kurtis Section */}
                <section className="section" id="kurtis" style={{ background: 'var(--bg-dark)' }}>
                  <div className="section-head" style={{ marginBottom: '2.5rem' }}>
                    <span style={{ fontSize: '13px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '2px', color: 'var(--primary)' }}>Ethnic Elegance</span>
                    <h2 className="section-title" style={{ marginTop: '5px' }}>Kurtis</h2>
                  </div>
                  <div className="products-grid-desktop">
                    {getByCategory('Kurtis').slice(0, 8).map((p, idx, arr) => (
                      <ProductCard 
                        key={p.id} 
                        product={p} 
                        hoverImage={getHoverImage(p, idx, arr)} 
                        onOpen={() => setSelectedProduct(p)} 
                        onAddCart={() => addToCart(p, p.sizes?.[0] || 'M', p.colors?.[0] || 'Default')} 
                        onWishlist={() => toggleWishlist(p.id)}
                        isWishlisted={wishlist.includes(p.id)}
 
                        onBuyNow={() => startBuyNow(p, p.sizes?.[0] || 'M', p.colors?.[0] || 'Default')}
                      />
                    ))}
                  </div>
                  <div className="products-scroll">
                    {getByCategory('Kurtis').map((p, idx, arr) => (
                      <ProductCard 
                        key={p.id} 
                        product={p} 
                        hoverImage={getHoverImage(p, idx, arr)} 
                        onOpen={() => setSelectedProduct(p)} 
                        onAddCart={() => addToCart(p, p.sizes?.[0] || 'M', p.colors?.[0] || 'Default')} 
                        onWishlist={() => toggleWishlist(p.id)}
                        isWishlisted={wishlist.includes(p.id)}
 
                        onBuyNow={() => startBuyNow(p, p.sizes?.[0] || 'M', p.colors?.[0] || 'Default')}
                      />
                    ))}
                  </div>
                </section>

                {/* Night Gown Section */}
                <section className="section" id="nightgown" style={{ background: 'var(--bg-dark)' }}>
                  <div className="section-head" style={{ marginBottom: '2.5rem' }}>
                    <span style={{ fontSize: '13px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '2px', color: 'var(--primary)' }}>Relaxed Fit</span>
                    <h2 className="section-title" style={{ marginTop: '5px' }}>Night Wear</h2>
                  </div>
                  <div className="products-grid-desktop">
                    {getByCategory('Nightgown').slice(0, 8).map((p, idx, arr) => (
                      <ProductCard 
                        key={p.id} 
                        product={p} 
                        hoverImage={getHoverImage(p, idx, arr)} 
                        onOpen={() => setSelectedProduct(p)} 
                        onAddCart={() => addToCart(p, p.sizes?.[0] || 'M', p.colors?.[0] || 'Default')} 
                        onWishlist={() => toggleWishlist(p.id)}
                        isWishlisted={wishlist.includes(p.id)}
 
                        onBuyNow={() => startBuyNow(p, p.sizes?.[0] || 'M', p.colors?.[0] || 'Default')}
                      />
                    ))}
                  </div>
                  <div className="products-scroll">
                    {getByCategory('Nightgown').map((p, idx, arr) => (
                      <ProductCard 
                        key={p.id} 
                        product={p} 
                        hoverImage={getHoverImage(p, idx, arr)} 
                        onOpen={() => setSelectedProduct(p)} 
                        onAddCart={() => addToCart(p, p.sizes?.[0] || 'M', p.colors?.[0] || 'Default')} 
                        onWishlist={() => toggleWishlist(p.id)}
                        isWishlisted={wishlist.includes(p.id)}
 
                        onBuyNow={() => startBuyNow(p, p.sizes?.[0] || 'M', p.colors?.[0] || 'Default')}
                      />
                    ))}
                  </div>
                </section>

                {/* Kids Collections Section */}
                <section className="section" id="kids" style={{ background: 'var(--bg-dark)' }}>
                  <div className="section-head" style={{ marginBottom: '2.5rem' }}>
                    <span style={{ fontSize: '13px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '2px', color: 'var(--primary)' }}>Charming Styles</span>
                    <h2 className="section-title" style={{ marginTop: '5px' }}>Kids Collections</h2>
                  </div>
                  <div className="products-grid-desktop">
                    {getByCategory('Kids').slice(0, 8).map((p, idx, arr) => (
                      <ProductCard 
                        key={p.id} 
                        product={p} 
                        hoverImage={getHoverImage(p, idx, arr)} 
                        onOpen={() => setSelectedProduct(p)} 
                        onAddCart={() => addToCart(p, p.sizes?.[0] || '2-4 Y', p.colors?.[0] || 'Default')} 
                        onWishlist={() => toggleWishlist(p.id)}
                        isWishlisted={wishlist.includes(p.id)}
 
                        onBuyNow={() => startBuyNow(p, p.sizes?.[0] || 'M', p.colors?.[0] || 'Default')}
                      />
                    ))}
                  </div>
                  <div className="products-scroll">
                    {getByCategory('Kids').map((p, idx, arr) => (
                      <ProductCard 
                        key={p.id} 
                        product={p} 
                        hoverImage={getHoverImage(p, idx, arr)} 
                        onOpen={() => setSelectedProduct(p)} 
                        onAddCart={() => addToCart(p, p.sizes?.[0] || '2-4 Y', p.colors?.[0] || 'Default')} 
                        onWishlist={() => toggleWishlist(p.id)}
                        isWishlisted={wishlist.includes(p.id)}
 
                        onBuyNow={() => startBuyNow(p, p.sizes?.[0] || 'M', p.colors?.[0] || 'Default')}
                      />
                    ))}
                  </div>
                </section>

                {/* Jewellery Section */}
                <section className="section" id="jewels" style={{ background: 'var(--bg-dark)' }}>
                  <div className="section-head" style={{ marginBottom: '2.5rem' }}>
                    <span style={{ fontSize: '13px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '2px', color: 'var(--primary)' }}>Fine Craftsmanship</span>
                    <h2 className="section-title" style={{ marginTop: '5px' }}>Jewellery Collection</h2>
                  </div>
                  <div className="products-grid-desktop">
                    {getByCategory('Jewels').slice(0, 8).map((p, idx, arr) => (
                      <ProductCard 
                        key={p.id} 
                        product={p} 
                        hoverImage={getHoverImage(p, idx, arr)} 
                        onOpen={() => setSelectedProduct(p)} 
                        onAddCart={() => addToCart(p, p.sizes?.[0] || 'Free Size', p.colors?.[0] || 'Default')} 
                        onWishlist={() => toggleWishlist(p.id)}
                        isWishlisted={wishlist.includes(p.id)}
 
                        onBuyNow={() => startBuyNow(p, p.sizes?.[0] || 'M', p.colors?.[0] || 'Default')}
                      />
                    ))}
                  </div>
                  <div className="products-scroll">
                    {getByCategory('Jewels').map((p, idx, arr) => (
                      <ProductCard 
                        key={p.id} 
                        product={p} 
                        hoverImage={getHoverImage(p, idx, arr)} 
                        onOpen={() => setSelectedProduct(p)} 
                        onAddCart={() => addToCart(p, p.sizes?.[0] || 'Free Size', p.colors?.[0] || 'Default')} 
                        onWishlist={() => toggleWishlist(p.id)}
                        isWishlisted={wishlist.includes(p.id)}
 
                        onBuyNow={() => startBuyNow(p, p.sizes?.[0] || 'M', p.colors?.[0] || 'Default')}
                      />
                    ))}
                  </div>
                </section>

                {/* Sarees Section */}
                <section className="section" id="sarees" style={{ background: 'var(--bg-dark)' }}>
                  <div className="section-head" style={{ marginBottom: '2.5rem' }}>
                    <span style={{ fontSize: '13px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '2px', color: 'var(--primary)' }}>Heritage Weaves</span>
                    <h2 className="section-title" style={{ marginTop: '5px' }}>Sarees</h2>
                  </div>
                  <div className="products-grid-desktop">
                    {getByCategory('Sarees').slice(0, 8).map((p, idx, arr) => (
                      <ProductCard 
                        key={p.id} 
                        product={p} 
                        hoverImage={getHoverImage(p, idx, arr)} 
                        onOpen={() => setSelectedProduct(p)} 
                        onAddCart={() => addToCart(p, p.sizes?.[0] || 'M', p.colors?.[0] || 'Default')} 
                        onWishlist={() => toggleWishlist(p.id)}
                        isWishlisted={wishlist.includes(p.id)}
 
                        onBuyNow={() => startBuyNow(p, p.sizes?.[0] || 'M', p.colors?.[0] || 'Default')}
                      />
                    ))}
                  </div>
                  <div className="products-scroll">
                    {getByCategory('Sarees').map((p, idx, arr) => (
                      <ProductCard 
                        key={p.id} 
                        product={p} 
                        hoverImage={getHoverImage(p, idx, arr)} 
                        onOpen={() => setSelectedProduct(p)} 
                        onAddCart={() => addToCart(p, p.sizes?.[0] || 'M', p.colors?.[0] || 'Default')} 
                        onWishlist={() => toggleWishlist(p.id)}
                        isWishlisted={wishlist.includes(p.id)}
 
                        onBuyNow={() => startBuyNow(p, p.sizes?.[0] || 'M', p.colors?.[0] || 'Default')}
                      />
                    ))}
                  </div>
                </section>
              </>
            )}

            {/* CONTACT US SECTION */}
            <section id="contact-section" className="contact-section glass" style={{ marginTop: '4rem', padding: '3rem 2rem', borderRadius: '12px', background: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
              <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                  <span style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '2px', color: 'var(--primary)', fontWeight: '600' }}>Get In Touch</span>
                  <h2 style={{ fontSize: '2.5rem', fontFamily: "'Playfair Display', serif", fontWeight: '700', marginTop: '0.5rem', color: 'var(--text-primary)' }}>We'd Love to Hear From You</h2>
                  <p style={{ color: 'var(--text-secondary)', maxWidth: '600px', margin: '0.5rem auto 0' }}>Have questions about our premium fabrics, sizes, custom fits, or an existing order? Drop us a message below or contact us directly.</p>
                </div>
                
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '3rem', alignItems: 'stretch' }}>
                  {/* Column 1: Store Information */}
                  <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '2rem' }}>
                    <div>
                      <h3 style={{ fontSize: '1.5rem', fontFamily: "'Playfair Display', serif", fontWeight: '600', marginBottom: '1.5rem', color: 'var(--text-primary)' }}>SAVI'S Collection</h3>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        
                        {/* Address */}
                        <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                          <span style={{ fontSize: '1.5rem', color: 'var(--primary)' }}>📍</span>
                          <div>
                            <h4 style={{ fontSize: '1rem', fontWeight: '600', margin: '0 0 4px 0', color: 'var(--text-primary)' }}>Our Boutique Store</h4>
                            <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
                              SAVI'S Collection, 12, Ground Floor,<br />
                              Gandhi Nagar Main Road, Bengaluru,<br />
                              Karnataka 560009
                            </p>
                          </div>
                        </div>

                        {/* Phone/WhatsApp */}
                        <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                          <span style={{ fontSize: '1.5rem', color: 'var(--primary)' }}>📞</span>
                          <div>
                            <h4 style={{ fontSize: '1rem', fontWeight: '600', margin: '0 0 4px 0', color: 'var(--text-primary)' }}>Phone & WhatsApp</h4>
                            <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                              <a href="tel:+919788633200" style={{ color: 'inherit', textDecoration: 'none' }}>+91 97886 33200</a>
                            </p>
                            <a href="https://wa.me/919788633200" target="_blank" rel="noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', color: '#25D366', fontWeight: '600', textDecoration: 'none', marginTop: '4px' }}>
                              💬 Chat with us on WhatsApp
                            </a>
                          </div>
                        </div>

                        {/* Email */}
                        <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                          <span style={{ fontSize: '1.5rem', color: 'var(--primary)' }}>✉️</span>
                          <div>
                            <h4 style={{ fontSize: '1rem', fontWeight: '600', margin: '0 0 4px 0', color: 'var(--text-primary)' }}>Email Inquiries</h4>
                            <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                              <a href="mailto:support@saviscollection.com" style={{ color: 'inherit', textDecoration: 'none' }}>support@saviscollection.com</a>
                            </p>
                          </div>
                        </div>

                        {/* Hours */}
                        <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                          <span style={{ fontSize: '1.5rem', color: 'var(--primary)' }}>⏰</span>
                          <div>
                            <h4 style={{ fontSize: '1rem', fontWeight: '600', margin: '0 0 4px 0', color: 'var(--text-primary)' }}>Business Hours</h4>
                            <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
                              Monday - Saturday: 10:00 AM - 8:30 PM<br />
                              Sunday: 11:00 AM - 6:00 PM
                            </p>
                          </div>
                        </div>

                      </div>
                    </div>

                    {/* Map mockup */}
                    <div className="map-mockup" style={{ height: '180px', borderRadius: '8px', overflow: 'hidden', position: 'relative', border: '1px solid var(--border-color)', background: 'var(--bg-dark)' }}>
                      <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)', textDecoration: 'none' }}>
                        <span style={{ fontSize: '2.5rem', marginBottom: '8px' }}>🗺️</span>
                        <span style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-primary)' }}>Bengaluru Boutique Store Map</span>
                        <span style={{ fontSize: '0.75rem', marginTop: '4px' }}>Click to view directions</span>
                        <a 
                          href="https://maps.google.com/?q=Gandhi+Nagar+Bengaluru" 
                          target="_blank" 
                          rel="noreferrer" 
                          className="btn btn-secondary" 
                          style={{ position: 'absolute', bottom: '10px', right: '10px', fontSize: '0.75rem', padding: '4px 10px' }}
                        >
                          Open Maps
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* Column 2: Contact Form */}
                  <div style={{ background: 'var(--bg-dark)', padding: '2rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                    <h3 style={{ fontSize: '1.3rem', fontWeight: '600', marginBottom: '1.5rem', color: 'var(--text-primary)' }}>Send a Message</h3>
                    <form onSubmit={handleContactSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                      
                      <div className="responsive-grid-2col">
                        <div className="form-group" style={{ margin: 0 }}>
                          <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', marginBottom: '6px', color: 'var(--text-primary)' }}>Full Name *</label>
                          <input 
                            type="text" 
                            required 
                            placeholder="Your Name"
                            value={contactForm.name}
                            onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                            style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid var(--border-color)', background: 'var(--bg-card)', color: 'var(--text-primary)' }}
                          />
                        </div>
                        <div className="form-group" style={{ margin: 0 }}>
                          <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', marginBottom: '6px', color: 'var(--text-primary)' }}>Email Address *</label>
                          <input 
                            type="email" 
                            required 
                            placeholder="your@email.com"
                            value={contactForm.email}
                            onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                            style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid var(--border-color)', background: 'var(--bg-card)', color: 'var(--text-primary)' }}
                          />
                        </div>
                      </div>

                      <div className="responsive-grid-2col">
                        <div className="form-group" style={{ margin: 0 }}>
                          <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', marginBottom: '6px', color: 'var(--text-primary)' }}>Phone Number</label>
                          <input 
                            type="tel" 
                            placeholder="e.g. +91 97886 33200"
                            value={contactForm.phone}
                            onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                            style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid var(--border-color)', background: 'var(--bg-card)', color: 'var(--text-primary)' }}
                          />
                        </div>
                        <div className="form-group" style={{ margin: 0 }}>
                          <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', marginBottom: '6px', color: 'var(--text-primary)' }}>Subject *</label>
                          <select 
                            value={contactForm.subject}
                            onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                            style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid var(--border-color)', background: 'var(--bg-card)', color: 'var(--text-primary)' }}
                          >
                            <option value="General Inquiry">General Inquiry</option>
                            <option value="Order Status">Order Status / Tracking</option>
                            <option value="Custom Fit">Custom Sizing / Fitting</option>
                            <option value="Wholesale">Wholesale & Bulk Orders</option>
                            <option value="Feedback">Suggestions & Feedback</option>
                          </select>
                        </div>
                      </div>

                      <div className="form-group" style={{ margin: 0 }}>
                        <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', marginBottom: '6px', color: 'var(--text-primary)' }}>Message *</label>
                        <textarea 
                          rows="4" 
                          required 
                          placeholder="Tell us what you're looking for..."
                          value={contactForm.message}
                          onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                          style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid var(--border-color)', background: 'var(--bg-card)', color: 'var(--text-primary)', resize: 'vertical', fontFamily: 'inherit' }}
                        />
                      </div>

                      <button 
                        type="submit" 
                        className="btn btn-primary" 
                        style={{ width: '100%', padding: '12px', fontSize: '1rem', fontWeight: '600', border: 'none', borderRadius: '4px', background: 'var(--primary)', color: '#fff', cursor: 'pointer', transition: 'transform 0.2s' }}
                      >
                        Submit Message
                      </button>
                    </form>
                  </div>

                </div>
              </div>
            </section>

          </div>
        )}

        {/* TAB 2: ADMIN ANALYTICS DASHBOARD */}
        {activeTab === 'admin' && !adminToken && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '75vh',
            padding: '2rem 1.5rem',
            animation: 'fadeInUp 0.6s ease'
          }}>
            <div className="glass" style={{
              width: '100%',
              maxWidth: '420px',
              padding: '2.5rem',
              borderRadius: '16px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              background: 'rgba(26, 26, 26, 0.65)',
              backdropFilter: 'blur(20px)',
              boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)'
            }}>
              <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                <h2 style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: '2rem',
                  fontWeight: '600',
                  color: '#fff',
                  marginBottom: '0.5rem'
                }}>
                  SAVI'S <span style={{ color: 'var(--primary)', fontWeight: '700' }}>Admin</span>
                </h2>
                <p style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '0.9rem' }}>
                  Please enter credentials to access dashboard
                </p>
              </div>

              {adminLoginError && (
                <div style={{
                  background: 'rgba(244, 67, 54, 0.15)',
                  borderLeft: '4px solid var(--danger)',
                  color: '#ff8a80',
                  padding: '12px',
                  borderRadius: '6px',
                  fontSize: '0.85rem',
                  marginBottom: '1.5rem',
                  textAlign: 'left'
                }}>
                  ⚠️ {adminLoginError}
                </div>
              )}

              <form onSubmit={handleAdminLoginSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '0.8rem', fontWeight: '600', color: 'rgba(255, 255, 255, 0.8)' }}>Username</label>
                  <input
                    type="text"
                    required
                    placeholder="Enter Admin Username"
                    value={adminUsername}
                    onChange={(e) => setAdminUsername(e.target.value)}
                    style={{
                      padding: '12px',
                      borderRadius: '8px',
                      border: '1px solid rgba(255,255,255,0.15)',
                      background: 'rgba(255,255,255,0.05)',
                      color: '#fff',
                      outline: 'none',
                      fontSize: '0.95rem'
                    }}
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '0.8rem', fontWeight: '600', color: 'rgba(255, 255, 255, 0.8)' }}>Password</label>
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    style={{
                      padding: '12px',
                      borderRadius: '8px',
                      border: '1px solid rgba(255,255,255,0.15)',
                      background: 'rgba(255,255,255,0.05)',
                      color: '#fff',
                      outline: 'none',
                      fontSize: '0.95rem'
                    }}
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{
                    padding: '12px',
                    fontSize: '1rem',
                    fontWeight: '600',
                    borderRadius: '8px',
                    border: 'none',
                    background: 'var(--primary)',
                    color: '#fff',
                    cursor: 'pointer',
                    marginTop: '0.5rem',
                    transition: 'all 0.2s'
                  }}
                >
                  Authorized Login
                </button>
              </form>

              <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
                <a
                  href="#back"
                  onClick={(e) => { e.preventDefault(); setActiveTab('shop'); }}
                  style={{
                    color: 'rgba(255, 255, 255, 0.6)',
                    fontSize: '0.85rem',
                    textDecoration: 'none',
                    borderBottom: '1px dotted rgba(255,255,255,0.4)',
                    paddingBottom: '2px',
                    transition: 'color 0.2s'
                  }}
                  onMouseOver={(e) => e.target.style.color = '#fff'}
                  onMouseOut={(e) => e.target.style.color = 'rgba(255, 255, 255, 0.6)'}
                >
                  ← Return to Storefront
                </a>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'admin' && adminToken && (
          <div className="admin-container" style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1.5rem' }}>
            <div style={{ display: 'flex', gap: '2rem', minHeight: '80vh' }}>
              
              {/* ADMIN SIDEBAR */}
              <div className="sidebar" style={{ flexShrink: 0 }}>
                <div className="logo" style={{ color: '#fff', fontSize: '20px', fontWeight: '600', marginBottom: '2rem', fontFamily: "'Playfair Display', serif" }}>
                  SAVI'S <span style={{ fontWeight: '400', color: 'rgba(255,255,255,0.6)' }}>admin</span>
                </div>
                <ul className="nav-menu">
                  <li className="nav-item">
                    <button 
                      className={`nav-link ${adminSubTab === 'dashboard' ? 'active' : ''}`}
                      onClick={() => setAdminSubTab('dashboard')}
                      style={{ background: 'none', border: 'none', width: '100%', textAlign: 'left', font: 'inherit' }}
                    >
                      <span className="icon">📊</span> Dashboard
                    </button>
                  </li>
                  <li className="nav-item">
                    <button 
                      className={`nav-link ${adminSubTab === 'orders' ? 'active' : ''}`}
                      onClick={() => setAdminSubTab('orders')}
                      style={{ background: 'none', border: 'none', width: '100%', textAlign: 'left', font: 'inherit' }}
                    >
                      <span className="icon">📦</span> Orders ({orders.length})
                    </button>
                  </li>
                  <li className="nav-item">
                    <button 
                      className={`nav-link ${adminSubTab === 'products' ? 'active' : ''}`}
                      onClick={() => setAdminSubTab('products')}
                      style={{ background: 'none', border: 'none', width: '100%', textAlign: 'left', font: 'inherit' }}
                    >
                      <span className="icon">👕</span> Products ({products.length})
                    </button>
                  </li>
                  <li className="nav-item">
                    <button 
                      className={`nav-link ${adminSubTab === 'customers' ? 'active' : ''}`}
                      onClick={() => setAdminSubTab('customers')}
                      style={{ background: 'none', border: 'none', width: '100%', textAlign: 'left', font: 'inherit' }}
                    >
                      <span className="icon">👥</span> Customers & Outreach ({customers.length})
                    </button>
                  </li>
                  <li className="nav-item">
                    <button 
                      className={`nav-link ${adminSubTab === 'inquiries' ? 'active' : ''}`}
                      onClick={() => setAdminSubTab('inquiries')}
                      style={{ background: 'none', border: 'none', width: '100%', textAlign: 'left', font: 'inherit' }}
                    >
                      <span className="icon">✉️</span> Contact Messages ({inquiries.length})
                    </button>
                  </li>
                  <li className="nav-item">
                    <button 
                      className={`nav-link ${adminSubTab === 'billing' ? 'active' : ''}`}
                      onClick={() => setAdminSubTab('billing')}
                      style={{ background: 'none', border: 'none', width: '100%', textAlign: 'left', font: 'inherit' }}
                    >
                      <span className="icon">📄</span> Invoicing & Billing
                    </button>
                  </li>
                  <li className="nav-item" style={{ marginTop: '2rem' }}>
                    <button 
                      className="nav-link"
                      onClick={() => setActiveTab('shop')}
                      style={{ background: 'none', border: 'none', width: '100%', textAlign: 'left', font: 'inherit', color: 'rgba(255,255,255,0.7)' }}
                    >
                      <span className="icon">🛒</span> Return to Shop
                    </button>
                  </li>
                  <li className="nav-item">
                    <button 
                      className="nav-link"
                      onClick={handleAdminLogout}
                      style={{ background: 'none', border: 'none', width: '100%', textAlign: 'left', font: 'inherit', color: 'var(--danger)' }}
                    >
                      <span className="icon">🚪</span> Logout
                    </button>
                  </li>
                </ul>
              </div>

              {/* ADMIN SUB TAB CONTENT */}
              <div style={{ flex: 1 }}>
                
                {/* ADMIN HEADER */}
                <div className="admin-header glass" style={{ marginBottom: '2rem', padding: '1.5rem', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h1 style={{ fontSize: '24px', fontWeight: '600', fontFamily: "'Playfair Display', serif", margin: 0 }}>
                    {adminSubTab === 'dashboard' && "Analytics Dashboard"}
                    {adminSubTab === 'orders' && "Manage Client Orders"}
                    {adminSubTab === 'products' && "Manage Catalog Items"}
                    {adminSubTab === 'customers' && "Customer Database & Outreach Hub"}
                    {adminSubTab === 'inquiries' && "Contact Messages & Inquiries"}
                    {adminSubTab === 'billing' && "Boutique Invoicing & POS Billing"}
                  </h1>
                  <div className="admin-actions" style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                    {adminSubTab === 'products' && (
                      <button className="btn btn-primary" onClick={() => setIsAddModalOpen(true)}>＋ Add New Product</button>
                    )}
                    <button 
                      onClick={() => setActiveTab('shop')} 
                      className="btn btn-secondary" 
                      style={{ 
                        padding: '6px 14px', 
                        borderRadius: '20px', 
                        fontSize: '12px', 
                        fontWeight: '600', 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '6px', 
                        cursor: 'pointer',
                        border: '1px solid var(--primary)',
                        color: 'var(--primary)',
                        background: 'none'
                      }}
                    >
                      🏠 Back to Website
                    </button>
                    <span className="user-badge">👑 Admin Active</span>
                  </div>
                </div>

                {/* STATS ANALYTICS GRID */}
                {adminSubTab === 'dashboard' && (
                  <>
                    <div className="stats-grid">
                      <div className="stat-card glass">
                        <div className="label">Total Revenue</div>
                        <div className="value">₹{stats.totalSales.toLocaleString('en-IN')}</div>
                        <div className="change">Live updates active</div>
                      </div>
                      <div className="stat-card glass">
                        <div className="label">Total Orders</div>
                        <div className="value">{stats.totalOrders}</div>
                        <div className="change">Customer checkouts</div>
                      </div>
                      <div className="stat-card glass">
                        <div className="label">Active Products</div>
                        <div className="value">{stats.totalProducts}</div>
                        <div className="change">Web storefront catalog</div>
                      </div>
                      <div className="stat-card glass">
                        <div className="label">Registered Customers</div>
                        <div className="value">{stats.totalCustomers}</div>
                        <div className="change">In database registry</div>
                      </div>
                    </div>

                    {/* RECENT ORDERS ON DASHBOARD */}
                    <div className="section glass" style={{ padding: '1.5rem', borderRadius: '8px' }}>
                      <h2 className="section-title">Recent Client Orders</h2>
                      <div className="table-wrapper">
                        {orders.length === 0 ? (
                          <p style={{ textAlign: 'center', padding: '20px', color: 'var(--text-secondary)' }}>No orders registered in the system yet.</p>
                        ) : (
                          <table>
                            <thead>
                              <tr>
                                <th>Order ID</th>
                                <th>Customer</th>
                                <th>Items</th>
                                <th>Total Amount</th>
                                <th>Order Status</th>
                                <th>Payment</th>
                              </tr>
                            </thead>
                            <tbody>
                              {orders.slice(0, 5).map(o => (
                                <tr key={o.id}>
                                  <td style={{ fontWeight: '600' }}>{o.id}</td>
                                  <td>
                                    <div>{o.customerName}</div>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{o.phone || o.email}</div>
                                  </td>
                                  <td style={{ fontSize: '0.85rem' }}>
                                    {o.items.map(i => `${i.name} (x${i.quantity})`).join(', ')}
                                  </td>
                                  <td style={{ fontWeight: '600' }}>₹{o.totalAmount.toLocaleString('en-IN')}</td>
                                  <td>
                                    <span className={`status-badge status-${o.status.toLowerCase()}`}>{o.status}</span>
                                  </td>
                                  <td>
                                    <span className={`payment-badge payment-${(o.paymentStatus || 'Pending').toLowerCase()}`}>
                                      {o.paymentStatus || 'Pending'}
                                    </span>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        )}
                      </div>
                      {orders.length > 5 && (
                        <button 
                          className="btn btn-secondary" 
                          onClick={() => setAdminSubTab('orders')} 
                          style={{ marginTop: '1rem', width: '100%' }}
                        >
                          View All Orders
                        </button>
                      )}
                    </div>
                  </>
                )}

                {/* ORDERS MANAGEMENT TAB */}
                {adminSubTab === 'orders' && (
                  <div className="section glass" style={{ padding: '1.5rem', borderRadius: '8px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '10px' }}>
                      <h2 className="section-title" style={{ margin: 0 }}>All Orders Log</h2>
                      <div style={{ display: 'flex', gap: '10px' }}>
                        {['All', 'Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered', 'Cancelled'].map(status => (
                          <button 
                            key={status}
                            onClick={() => setOrderFilter(status)}
                            className={`btn ${orderFilter === status ? 'btn-primary' : 'btn-secondary'}`}
                            style={{ padding: '6px 12px', borderRadius: '4px', fontSize: '0.75rem' }}
                          >
                            {status}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginTop: '1rem' }}>
                      {orders.filter(o => orderFilter === 'All' || o.status === orderFilter).length === 0 ? (
                        <p style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)', background: 'var(--bg-card)', borderRadius: '8px' }}>No orders match this filter.</p>
                      ) : (
                        orders.filter(o => orderFilter === 'All' || o.status === orderFilter).map(o => (
                          <div key={o.id} className="glass" style={{
                            borderRadius: '12px',
                            border: '1px solid var(--border-color)',
                            overflow: 'hidden',
                            background: 'var(--bg-card)',
                            boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)'
                          }}>
                            {/* Card Header (Amazon Style) */}
                            <div style={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              padding: '12px 20px',
                              background: 'rgba(0,0,0,0.15)',
                              borderBottom: '1px solid var(--border-color)',
                              fontSize: '0.85rem',
                              flexWrap: 'wrap',
                              gap: '15px'
                            }}>
                              <div style={{ display: 'flex', gap: '30px', flexWrap: 'wrap' }}>
                                <div>
                                  <span style={{ color: 'var(--text-secondary)', textTransform: 'uppercase', fontSize: '0.7rem', display: 'block', marginBottom: '2px' }}>Order Placed</span>
                                  <strong style={{ color: 'var(--text-primary)' }}>{new Date(o.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</strong>
                                </div>
                                <div>
                                  <span style={{ color: 'var(--text-secondary)', textTransform: 'uppercase', fontSize: '0.7rem', display: 'block', marginBottom: '2px' }}>Total Amount</span>
                                  <strong style={{ color: 'var(--primary)', fontWeight: '600' }}>₹{o.totalAmount.toLocaleString('en-IN')}</strong>
                                </div>
                                <div>
                                  <span style={{ color: 'var(--text-secondary)', textTransform: 'uppercase', fontSize: '0.7rem', display: 'block', marginBottom: '2px' }}>Deliver To</span>
                                  <strong style={{ color: 'var(--text-primary)' }}>{o.customerName}</strong>
                                </div>
                              </div>
                              <div style={{ textAlign: 'right' }}>
                                <span style={{ color: 'var(--text-secondary)', fontSize: '0.7rem', display: 'block', marginBottom: '2px' }}>ORDER # {o.id}</span>
                                <span style={{ 
                                  fontSize: '0.8rem', 
                                  fontWeight: '600', 
                                  padding: '3px 8px', 
                                  borderRadius: '4px',
                                  background: o.status === 'Delivered' ? 'rgba(45, 140, 78, 0.15)' : o.status === 'Cancelled' ? 'rgba(244, 67, 54, 0.15)' : 'rgba(255, 152, 0, 0.15)',
                                  color: o.status === 'Delivered' ? '#2d8c4e' : o.status === 'Cancelled' ? '#f44336' : '#ff9800'
                                }}>
                                  {o.status}
                                </span>
                              </div>
                            </div>

                            {/* Card Body */}
                            <div style={{ padding: '20px', display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '20px', flexWrap: 'wrap' }}>
                              
                              {/* Left Side: Order Items */}
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                                {o.items.map((item, idx) => {
                                  const itemImg = item.image || (products.find(p => p.id === item.id)?.image) || 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=100&auto=format&fit=crop';
                                  return (
                                    <div key={idx} style={{ display: 'flex', gap: '15px', alignItems: 'center', borderBottom: idx < o.items.length - 1 ? '1px dotted var(--border-color)' : 'none', paddingBottom: idx < o.items.length - 1 ? '15px' : '0' }}>
                                      <img 
                                        src={itemImg} 
                                        alt={item.name} 
                                        style={{ 
                                          width: '70px', 
                                          height: '85px', 
                                          objectFit: 'cover', 
                                          borderRadius: '6px', 
                                          border: '1px solid var(--border-color)',
                                          background: '#fff'
                                        }} 
                                      />
                                      <div>
                                        <h4 style={{ fontSize: '0.95rem', fontWeight: '600', margin: '0 0 5px 0', color: 'var(--text-primary)' }}>{item.name}</h4>
                                        <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                                          Size: <strong style={{ color: 'var(--text-primary)' }}>{item.size || 'M'}</strong> | Color: <strong style={{ color: 'var(--text-primary)' }}>{item.color || 'Default'}</strong>
                                        </div>
                                        <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                                          Qty: <strong style={{ color: 'var(--text-primary)' }}>{item.quantity}</strong> | Price: <strong style={{ color: 'var(--text-primary)' }}>₹{item.price}</strong>
                                        </div>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>

                              {/* Right Side: Shipping Details & Quick Actions */}
                              <div style={{ borderLeft: '1px solid var(--border-color)', paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '15px', justifyContent: 'space-between' }}>
                                <div>
                                  <h4 style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--text-secondary)', margin: '0 0 8px 0' }}>Shipping Destination</h4>
                                  <div style={{ fontSize: '0.85rem', lineHeight: '1.4' }}>
                                    <strong style={{ color: 'var(--text-primary)' }}>{o.customerName}</strong><br/>
                                    <span style={{ color: 'var(--text-secondary)' }}>📞 {o.phone}</span><br/>
                                    <span style={{ color: 'var(--text-secondary)' }}>✉️ {o.email}</span><br/>
                                    <span style={{ color: 'var(--text-primary)', display: 'block', marginTop: '6px', fontSize: '0.8rem' }}>📍 {o.address}</span>
                                    
                                    {/* Payment Details Section */}
                                    <div style={{ marginTop: '10px', paddingTop: '8px', borderTop: '1px dotted var(--border-color)', fontSize: '0.8rem' }}>
                                      <div><strong>Payment Method:</strong> <span style={{ color: 'var(--primary)', fontWeight: '600' }}>{o.paymentMethod || 'COD'}</span></div>
                                      {o.paymentDetails && o.paymentDetails.upiTxnId && (
                                        <div style={{ marginTop: '2px' }}><strong>UPI Ref ID:</strong> <code style={{ color: 'var(--green)', fontWeight: '600' }}>{o.paymentDetails.upiTxnId}</code></div>
                                      )}
                                      {o.paymentDetails && o.paymentDetails.cardLast4 && (
                                        <div style={{ marginTop: '2px' }}><strong>Card Last 4:</strong> <code>{o.paymentDetails.cardLast4}</code></div>
                                      )}
                                    </div>
                                  </div>
                                </div>

                                <div style={{ background: 'rgba(0,0,0,0.1)', padding: '10px 15px', borderRadius: '6px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Update Status</span>
                                    <select 
                                      value={o.status}
                                      onChange={(e) => handleUpdateOrderStatus(o.id, e.target.value)}
                                      style={{ padding: '4px 8px', borderRadius: '4px', border: '1px solid var(--border-color)', background: 'var(--bg-card)', color: 'var(--text-primary)', fontSize: '0.75rem' }}
                                    >
                                      <option value="Pending">Pending</option>
                                      <option value="Confirmed">Confirmed</option>
                                      <option value="Processing">Processing</option>
                                      <option value="Shipped">Shipped</option>
                                      <option value="Delivered">Delivered</option>
                                      <option value="Cancelled">Cancelled</option>
                                    </select>
                                  </div>
                                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Payment</span>
                                    <select 
                                      value={o.paymentStatus || 'Pending'}
                                      onChange={(e) => handleUpdateOrderPayment(o.id, e.target.value)}
                                      style={{ padding: '4px 8px', borderRadius: '4px', border: '1px solid var(--border-color)', background: 'var(--bg-card)', color: 'var(--text-primary)', fontSize: '0.75rem' }}
                                    >
                                      <option value="Pending">Pending</option>
                                      <option value="Completed">Completed</option>
                                      <option value="Failed">Failed</option>
                                    </select>
                                  </div>
                                </div>

                                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '5px' }}>
                                  <button 
                                    onClick={() => handleDeleteOrder(o.id)}
                                    className="btn btn-secondary"
                                    style={{ 
                                      padding: '6px 12px', 
                                      fontSize: '0.75rem', 
                                      borderRadius: '4px', 
                                      background: 'rgba(244, 67, 54, 0.1)', 
                                      color: '#ff8a80', 
                                      border: '1px solid rgba(244, 67, 54, 0.2)',
                                      cursor: 'pointer'
                                    }}
                                  >
                                    🗑️ Delete Order Record
                                  </button>
                                </div>

                              </div>

                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}

                {/* PRODUCTS CATALOG MANAGEMENT TAB */}
                {adminSubTab === 'products' && (
                  <div className="section glass" style={{ padding: '1.5rem', borderRadius: '8px' }}>
                    <div className="table-wrapper">
                      <table>
                        <thead>
                          <tr>
                            <th>Image</th>
                            <th>Product Name</th>
                            <th>Category</th>
                            <th>Price</th>
                            <th>Stock / Options</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {products.map(p => (
                            <tr key={p.id}>
                              <td>
                                <img src={p.image} alt={p.name} style={{ width: '45px', height: '55px', objectFit: 'cover', borderRadius: '4px', background: 'var(--light)' }} />
                              </td>
                              <td style={{ fontWeight: '500', maxWidth: '280px', whiteSpace: 'normal' }}>
                                {p.name}
                                {p.featured && <span className="badge badge-primary" style={{ marginLeft: '8px', fontSize: '8px' }}>Featured</span>}
                              </td>
                              <td>{p.category}</td>
                              <td style={{ fontWeight: '600' }}>₹{p.price.toLocaleString('en-IN')}</td>
                               <td style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                                <div style={{ marginBottom: '6px' }}>
                                  Sizes: {p.sizes ? p.sizes.join(', ') : 'Default'} · Colors: {p.colors ? p.colors.join(', ') : 'Default'}
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '8px' }}>
                                  <span style={{ 
                                    padding: '2px 6px', 
                                    borderRadius: '4px', 
                                    fontSize: '10px', 
                                    fontWeight: '700',
                                    background: (p.stock === undefined || p.stock > 5) ? 'rgba(45, 140, 78, 0.15)' : (p.stock === 0 ? 'rgba(244, 67, 54, 0.15)' : 'rgba(255, 152, 0, 0.15)'),
                                    color: (p.stock === undefined || p.stock > 5) ? '#2d8c4e' : (p.stock === 0 ? '#f44336' : '#ff9800')
                                  }}>
                                    Stock: {p.stock !== undefined ? p.stock : 20}
                                  </span>
                                  <input 
                                    type="number" 
                                    id={`restock-${p.id}`}
                                    defaultValue={p.stock !== undefined ? p.stock : 20}
                                    style={{ width: '60px', padding: '4px', border: '1px solid var(--border-color)', borderRadius: '4px', background: 'var(--bg-dark)', color: 'var(--text-primary)', fontSize: '11px' }}
                                  />
                                  <button 
                                    onClick={() => {
                                      const newVal = document.getElementById(`restock-${p.id}`).value;
                                      handleRestockProduct(p.id, newVal);
                                    }}
                                    className="btn btn-secondary"
                                    style={{ padding: '4px 8px', fontSize: '10px', borderRadius: '4px' }}
                                  >
                                    Update Stock
                                  </button>
                                </div>
                              </td>
                              <td>
                                <button 
                                  onClick={() => handleDeleteProduct(p.id)}
                                  className="btn btn-danger"
                                  style={{ padding: '6px 12px', fontSize: '12px', borderRadius: '4px' }}
                                >
                                  Delete
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}



                {/* CUSTOMERS & OUTREACH MARKETING TAB */}
                {adminSubTab === 'customers' && (
                  <div className="section glass" style={{ padding: '1.5rem', borderRadius: '8px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '30px', alignItems: 'flex-start' }}>
                      
                      {/* Customer list table */}
                      <div className="section" style={{ padding: 0 }}>
                        <h2 className="section-title" style={{ marginBottom: '1.5rem' }}>Registered Customers ({customers.length})</h2>
                        <div className="table-wrapper">
                          {customers.length === 0 ? (
                            <p style={{ padding: '20px', color: 'var(--text-secondary)', textAlign: 'center' }}>No registered customers found.</p>
                          ) : (
                            <table>
                              <thead>
                                <tr>
                                  <th>Customer Details</th>
                                  <th>Address</th>
                                  <th>Marketing Outreach Actions</th>
                                </tr>
                              </thead>
                              <tbody>
                                {customers.map(c => (
                                  <tr key={c.id}>
                                    <td>
                                      <strong>{c.name || 'Unnamed User'}</strong><br/>
                                      <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>🆔 {c.id}</span><br/>
                                      <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>✉️ {c.email}</span><br/>
                                      <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>📞 {c.phone}</span>
                                    </td>
                                    <td style={{ fontSize: '0.8rem', maxWidth: '180px', whiteSpace: 'normal', wordBreak: 'break-word' }}>
                                      {c.address || 'No address saved'}
                                    </td>
                                    <td>
                                      <div style={{ display: 'flex', gap: '8px' }}>
                                        <button 
                                          className="btn btn-secondary"
                                          onClick={() => handleIndividualOutreach(c.id, 'whatsapp', c.email, c.phone, c.name)}
                                          style={{ padding: '6px 12px', fontSize: '0.75rem', background: '#25D366', color: '#fff', border: 'none' }}
                                        >
                                          💬 WhatsApp
                                        </button>
                                        <button 
                                          className="btn btn-secondary"
                                          onClick={() => handleIndividualOutreach(c.id, 'email', c.email, c.phone, c.name)}
                                          style={{ padding: '6px 12px', fontSize: '0.75rem', background: 'var(--accent)', color: '#fff', border: 'none' }}
                                        >
                                          ✉️ Email
                                        </button>
                                      </div>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          )}
                        </div>
                      </div>

                      {/* Bulk campaign outreach card */}
                      <div className="guide-card" style={{ padding: '1.5rem', borderRadius: '8px', background: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
                        <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '15px' }}>📢 Launch Outreach Campaign</h3>
                        <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
                          Draft a personalized campaign message. Use the placeholder <code>[Name]</code> to dynamically insert each customer's name.
                        </p>
                        <form onSubmit={handleBulkOutreach} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                          <div className="form-group">
                            <label style={{ display: 'block', fontSize: '11px', fontWeight: '600', marginBottom: '6px', textTransform: 'uppercase' }}>Campaign Channel</label>
                            <select
                              value={outreachForm.type}
                              onChange={(e) => setOutreachForm({ ...outreachForm, type: e.target.value })}
                              style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid var(--border-color)', background: 'var(--bg-dark)', color: 'var(--text-primary)' }}
                            >
                              <option value="whatsapp">WhatsApp Broadcast (api.whatsapp.com)</option>
                              <option value="email">Email Broadcast (Simulated Mailer & Mailto Logs)</option>
                            </select>
                          </div>
                          
                          <div className="form-group">
                            <label style={{ display: 'block', fontSize: '11px', fontWeight: '600', marginBottom: '6px', textTransform: 'uppercase' }}>Message Template</label>
                            <textarea
                              rows="5"
                              required
                              value={outreachForm.message}
                              onChange={(e) => setOutreachForm({ ...outreachForm, message: e.target.value })}
                              placeholder="e.g. Hi [Name], premium fabrics combo offers are live at SAVI'S! Get 20% discount."
                              style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid var(--border-color)', background: 'var(--bg-dark)', color: 'var(--text-primary)', fontFamily: 'inherit', resize: 'vertical' }}
                            />
                          </div>

                          <button 
                            type="submit" 
                            className="btn btn-primary"
                            disabled={campaignProgress}
                            style={{ padding: '12px', borderRadius: '4px', cursor: 'pointer', fontWeight: '600' }}
                          >
                            {campaignProgress ? 'Launching Broadcast...' : 'Launch Broadcast Campaign'}
                          </button>
                        </form>
                        
                        {campaignStatus && (
                          <div style={{ marginTop: '1.5rem', padding: '12px', borderRadius: '6px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-color)', fontSize: '0.8rem', color: outreachForm.type === 'whatsapp' ? '#25D366' : 'var(--text-primary)', lineHeight: '1.4' }}>
                            ℹ️ <b>Campaign Log:</b><br/>{campaignStatus}
                          </div>
                        )}
                      </div>

                    </div>
                  </div>
                )}

                {/* CONTACT MESSAGES / INQUIRIES SUBTAB */}
                {adminSubTab === 'inquiries' && (
                  <div className="section glass" style={{ padding: '1.5rem', borderRadius: '8px' }}>
                    <h2 className="section-title" style={{ marginBottom: '1.5rem' }}>Client Messages & Inquiries ({inquiries.length})</h2>
                    
                    <div className="table-wrapper">
                      {inquiries.length === 0 ? (
                        <div style={{ padding: '40px 20px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                          <span style={{ fontSize: '3rem', display: 'block', marginBottom: '10px' }}>✉️</span>
                          <p style={{ margin: 0, fontSize: '1.1rem', fontWeight: '500', color: 'var(--text-primary)' }}>No messages received yet.</p>
                          <p style={{ margin: '5px 0 0 0', fontSize: '0.85rem' }}>Messages submitted through the contact form will appear here.</p>
                        </div>
                      ) : (
                        <table>
                          <thead>
                            <tr>
                              <th>Sender Details</th>
                              <th>Subject</th>
                              <th>Message Content</th>
                              <th>Submitted At</th>
                              <th>Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            {inquiries.map(inq => (
                              <tr key={inq.id}>
                                <td>
                                  <strong>{inq.name}</strong><br/>
                                  <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>🆔 {inq.id}</span><br/>
                                  <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>✉️ <a href={`mailto:${inq.email}`} style={{ color: 'inherit' }}>{inq.email}</a></span>
                                  {inq.phone && (
                                    <>
                                      <br/>
                                      <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>📞 <a href={`tel:${inq.phone}`} style={{ color: 'inherit' }}>{inq.phone}</a></span>
                                    </>
                                  )}
                                </td>
                                <td>
                                  <span style={{ 
                                    padding: '3px 8px', 
                                    borderRadius: '12px', 
                                    fontSize: '0.75rem', 
                                    fontWeight: '600', 
                                    background: inq.subject === 'Wholesale' ? 'rgba(218, 165, 32, 0.15)' : inq.subject === 'Order Status' ? 'rgba(30, 144, 255, 0.15)' : 'rgba(255, 255, 255, 0.05)',
                                    color: inq.subject === 'Wholesale' ? '#daa520' : inq.subject === 'Order Status' ? '#1e90ff' : 'var(--text-primary)',
                                    border: '1px solid currentColor'
                                  }}>
                                    {inq.subject}
                                  </span>
                                </td>
                                <td style={{ fontSize: '0.85rem', maxWidth: '300px', whiteSpace: 'normal', wordBreak: 'break-word', lineHeight: '1.4' }}>
                                  {inq.message}
                                </td>
                                <td style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                                  {new Date(inq.createdAt).toLocaleString()}
                                </td>
                                <td>
                                  <div style={{ display: 'flex', gap: '8px' }}>
                                    <a 
                                      className="btn btn-primary"
                                      href={`mailto:${inq.email}?subject=Re: SAVI'S Collection Inquiry [${inq.id}] - ${inq.subject}&body=Hi ${inq.name},%0D%0A%0D%0AThank you for contacting SAVI'S Collection.%0D%0A%0D%0ARegarding your query: "${inq.message}"%0D%0A%0D%0A`}
                                      style={{ padding: '6px 12px', fontSize: '0.75rem', textDecoration: 'none', display: 'inline-flex', alignItems: 'center' }}
                                    >
                                      ✉️ Reply
                                    </a>
                                    {inq.phone && (
                                      <a 
                                        className="btn btn-secondary"
                                        href={`https://wa.me/${inq.phone.replace(/\D/g, '')}?text=Hi%20${encodeURIComponent(inq.name)},%20this%20is%20SAVI'S%20Collection%20responding%20to%20your%20message%20regarding%20${encodeURIComponent(inq.subject)}.`}
                                        target="_blank"
                                        rel="noreferrer"
                                        style={{ padding: '6px 12px', fontSize: '0.75rem', background: '#25D366', color: '#fff', border: 'none', display: 'inline-flex', alignItems: 'center', textDecoration: 'none' }}
                                      >
                                        💬 WhatsApp
                                      </a>
                                    )}
                                    <button 
                                      className="btn btn-secondary"
                                      onClick={() => handleDeleteInquiry(inq.id)}
                                      style={{ padding: '6px 12px', fontSize: '0.75rem', background: 'var(--danger)', color: '#fff', border: 'none' }}
                                    >
                                      🗑️ Delete
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      )}
                    </div>
                  </div>
                )}

                {/* BILLING & INVOICING SUBTAB */}
                {adminSubTab === 'billing' && (
                  <div className="section glass" style={{ padding: '1.5rem', borderRadius: '8px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '30px', alignItems: 'flex-start' }}>
                      
                      {/* Left Side: Invoice Creation Form */}
                      <div style={{ background: 'var(--bg-dark)', padding: '1.5rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                        <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                          📄 Generate Customer Bill / Invoice
                        </h3>
                        
                        <form onSubmit={handleCreateBill} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                          
                          {/* Customer Selection */}
                          <div className="form-group">
                            <label style={{ display: 'block', fontSize: '11px', fontWeight: '600', marginBottom: '6px', textTransform: 'uppercase' }}>Select Customer Registry</label>
                            <select
                              value={billingCustomer}
                              onChange={(e) => setBillingCustomer(e.target.value)}
                              style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid var(--border-color)', background: 'var(--bg-card)', color: 'var(--text-primary)' }}
                            >
                              <option value="new">🆕 Register & Bill New Customer</option>
                              {customers.map(c => (
                                <option key={c.id} value={c.id}>👤 {c.name} ({c.phone})</option>
                              ))}
                            </select>
                          </div>

                          {/* New Customer Info Input */}
                          {billingCustomer === 'new' && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', padding: '12px', border: '1px dashed var(--border-color)', borderRadius: '6px' }}>
                              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                                <div className="form-group">
                                  <input 
                                    type="text" 
                                    placeholder="Customer Full Name" 
                                    required={billingCustomer === 'new'}
                                    value={billingNewCustName}
                                    onChange={(e) => setBillingNewCustName(e.target.value)}
                                    style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid var(--border-color)', background: 'var(--bg-dark)', color: 'var(--text-primary)', fontSize: '13px' }}
                                  />
                                </div>
                                <div className="form-group">
                                  <input 
                                    type="tel" 
                                    placeholder="Phone Number" 
                                    required={billingCustomer === 'new'}
                                    value={billingNewCustPhone}
                                    onChange={(e) => setBillingNewCustPhone(e.target.value)}
                                    style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid var(--border-color)', background: 'var(--bg-dark)', color: 'var(--text-primary)', fontSize: '13px' }}
                                  />
                                </div>
                              </div>
                              <div className="form-group">
                                  <input 
                                    type="email" 
                                    placeholder="Email Address" 
                                    required={billingCustomer === 'new'}
                                    value={billingNewCustEmail}
                                    onChange={(e) => setBillingNewCustEmail(e.target.value)}
                                    style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid var(--border-color)', background: 'var(--bg-dark)', color: 'var(--text-primary)', fontSize: '13px' }}
                                  />
                              </div>
                              <div className="form-group">
                                <textarea 
                                  placeholder="Shipping/Billing Address" 
                                  rows="2"
                                  value={billingNewCustAddress}
                                  onChange={(e) => setBillingNewCustAddress(e.target.value)}
                                  style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid var(--border-color)', background: 'var(--bg-dark)', color: 'var(--text-primary)', fontSize: '13px', fontFamily: 'inherit', resize: 'vertical' }}
                                />
                              </div>
                            </div>
                          )}

                          <hr style={{ border: '0', borderTop: '1px solid var(--border-color)', margin: '5px 0' }} />

                          {/* Product Selection */}
                          <div className="form-group">
                            <label style={{ display: 'block', fontSize: '11px', fontWeight: '600', marginBottom: '6px', textTransform: 'uppercase' }}>Select Product to Add</label>
                            <select
                              value={billingSelectedProdId}
                              onChange={(e) => setBillingSelectedProdId(e.target.value)}
                              style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid var(--border-color)', background: 'var(--bg-card)', color: 'var(--text-primary)' }}
                            >
                              <option value="">-- Choose apparel item --</option>
                              {products.map(p => (
                                <option key={p.id} value={p.id}>
                                  👕 {p.name} (Stock: {p.stock !== undefined ? p.stock : 20} | Price: ₹{p.price})
                                </option>
                              ))}
                            </select>
                          </div>

                          {/* Selected Product swatch options */}
                          {billingSelectedProdId && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', padding: '12px', background: 'rgba(255,255,255,0.02)', borderRadius: '6px' }}>
                              
                              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                                {/* Size swatch select */}
                                <div className="form-group">
                                  <label style={{ display: 'block', fontSize: '10px', fontWeight: '600', marginBottom: '4px', textTransform: 'uppercase' }}>Size</label>
                                  <select 
                                    value={billingSelectedSize}
                                    onChange={(e) => setBillingSelectedSize(e.target.value)}
                                    style={{ width: '100%', padding: '6px', borderRadius: '4px', border: '1px solid var(--border-color)', background: 'var(--bg-dark)', color: 'var(--text-primary)', fontSize: '12px' }}
                                  >
                                    {(products.find(p => p.id === billingSelectedProdId)?.sizes || ['S', 'M', 'L', 'XL']).map(s => (
                                      <option key={s} value={s}>{s}</option>
                                    ))}
                                  </select>
                                </div>

                                {/* Color swatch select */}
                                <div className="form-group">
                                  <label style={{ display: 'block', fontSize: '10px', fontWeight: '600', marginBottom: '4px', textTransform: 'uppercase' }}>Color</label>
                                  <select 
                                    value={billingSelectedColor}
                                    onChange={(e) => setBillingSelectedColor(e.target.value)}
                                    style={{ width: '100%', padding: '6px', borderRadius: '4px', border: '1px solid var(--border-color)', background: 'var(--bg-dark)', color: 'var(--text-primary)', fontSize: '12px' }}
                                  >
                                    {(products.find(p => p.id === billingSelectedProdId)?.colors || ['Default']).map(c => (
                                      <option key={c} value={c}>{c}</option>
                                    ))}
                                  </select>
                                </div>
                              </div>

                              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '10px', alignItems: 'flex-end' }}>
                                {/* Quantity */}
                                <div className="form-group">
                                  <label style={{ display: 'block', fontSize: '10px', fontWeight: '600', marginBottom: '4px', textTransform: 'uppercase' }}>Quantity</label>
                                  <input 
                                    type="number" 
                                    min="1"
                                    max={products.find(p => p.id === billingSelectedProdId)?.stock || 20}
                                    value={billingSelectedQty}
                                    onChange={(e) => setBillingSelectedQty(Math.max(1, parseInt(e.target.value) || 1))}
                                    style={{ width: '100%', padding: '6px', borderRadius: '4px', border: '1px solid var(--border-color)', background: 'var(--bg-dark)', color: 'var(--text-primary)', fontSize: '12px' }}
                                  />
                                </div>
                                <button
                                  type="button"
                                  onClick={handleAddBillingItem}
                                  className="btn btn-secondary"
                                  style={{ padding: '8px', fontSize: '0.8rem', width: '100%' }}
                                >
                                  📥 Add Item to Bill
                                </button>
                              </div>

                            </div>
                          )}

                          <hr style={{ border: '0', borderTop: '1px solid var(--border-color)', margin: '5px 0' }} />

                          {/* Taxes and Discounting */}
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                            <div className="form-group">
                              <label style={{ display: 'block', fontSize: '11px', fontWeight: '600', marginBottom: '6px', textTransform: 'uppercase' }}>Tax Rate (GST)</label>
                              <select
                                value={billingTaxRate}
                                onChange={(e) => setBillingTaxRate(parseInt(e.target.value))}
                                style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid var(--border-color)', background: 'var(--bg-card)', color: 'var(--text-primary)', fontSize: '13px' }}
                              >
                                <option value="0">0% (GST Exempted)</option>
                                <option value="5">5% (Apparel below ₹1000)</option>
                                <option value="12">12% (Standard Fabric)</option>
                                <option value="18">18% (Luxury Designer Goods)</option>
                              </select>
                            </div>
                            <div className="form-group">
                              <label style={{ display: 'block', fontSize: '11px', fontWeight: '600', marginBottom: '6px', textTransform: 'uppercase' }}>Discount (₹)</label>
                              <input 
                                type="number" 
                                min="0"
                                value={billingDiscount}
                                onChange={(e) => setBillingDiscount(Math.max(0, parseFloat(e.target.value) || 0))}
                                style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid var(--border-color)', background: 'var(--bg-dark)', color: 'var(--text-primary)', fontSize: '13px' }}
                              />
                            </div>
                          </div>

                          <button 
                            type="submit" 
                            className="btn btn-primary"
                            style={{ padding: '14px', borderRadius: '4px', fontWeight: '700', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '0.5px', marginTop: '10px' }}
                          >
                            💾 Generate Invoice & Update Stocks
                          </button>

                        </form>
                      </div>

                      {/* Right Side: Invoice Items Preview list */}
                      <div className="guide-card" style={{ padding: '1.5rem', borderRadius: '8px', background: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
                        <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                          🧾 Invoice Items List
                        </h3>

                        {billingInvoiceItems.length === 0 ? (
                          <div style={{ textAlign: 'center', padding: '60px 10px', color: 'var(--text-secondary)' }}>
                            <span style={{ fontSize: '3rem', display: 'block', marginBottom: '10px' }}>🧾</span>
                            <p style={{ margin: 0, fontSize: '0.95rem', fontWeight: '600', color: 'var(--text-primary)' }}>Invoice is currently empty.</p>
                            <p style={{ margin: '5px 0 0 0', fontSize: '0.75rem' }}>Select products on the left and click "Add Item" to draft the bill.</p>
                          </div>
                        ) : (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                            
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '250px', overflowY: 'auto', paddingRight: '5px' }}>
                              {billingInvoiceItems.map(item => (
                                <div key={item.itemKey} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '10px', borderBottom: '1px dotted var(--border-color)' }}>
                                  <div style={{ fontSize: '13px' }}>
                                    <strong style={{ color: 'var(--text-primary)' }}>{item.name}</strong>
                                    <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                                      Size: {item.size} | Color: {item.color} · Qty: {item.quantity} · @ ₹{item.price} each
                                    </div>
                                  </div>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <span style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-primary)' }}>₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
                                    <button 
                                      type="button" 
                                      onClick={() => handleRemoveBillingItem(item.itemKey)}
                                      style={{ background: 'none', border: 'none', color: 'var(--error)', cursor: 'pointer', fontSize: '16px' }}
                                    >
                                      ✕
                                    </button>
                                  </div>
                                </div>
                              ))}
                            </div>

                            {/* Summary Math Block */}
                            <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '15px', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px' }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                                <span>Subtotal</span>
                                <span>₹{billingInvoiceItems.reduce((acc, i) => acc + i.price * i.quantity, 0).toLocaleString('en-IN')}</span>
                              </div>
                              {billingDiscount > 0 && (
                                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--success)' }}>
                                  <span>Discount Applied</span>
                                  <span>- ₹{parseFloat(billingDiscount).toLocaleString('en-IN')}</span>
                                </div>
                              )}
                              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                                <span>Estimated Tax ({billingTaxRate}%)</span>
                                <span>
                                  ₹{Math.round(
                                    (billingInvoiceItems.reduce((acc, i) => acc + i.price * i.quantity, 0) - billingDiscount) * (billingTaxRate / 100)
                                  ).toLocaleString('en-IN')}
                                </span>
                              </div>
                              
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px dashed var(--border-color)', paddingTop: '10px', marginTop: '5px' }}>
                                <strong style={{ fontSize: '15px', color: 'var(--text-primary)' }}>Grand Total</strong>
                                <strong style={{ fontSize: '20px', color: 'var(--primary)' }}>
                                  ₹{Math.max(
                                    0,
                                    billingInvoiceItems.reduce((acc, i) => acc + i.price * i.quantity, 0) - billingDiscount + Math.round((billingInvoiceItems.reduce((acc, i) => acc + i.price * i.quantity, 0) - billingDiscount) * (billingTaxRate / 100))
                                  ).toLocaleString('en-IN')}
                                </strong>
                              </div>

                            </div>

                          </div>
                        )}

                      </div>

                    </div>
                  </div>
                )}

              </div>
            </div>
          </div>
        )}

      </main>

      {/* FOOTER */}
      <footer>
        <div className="footer-grid">
          <div className="footer-brand">
            <a 
              href="#" 
              className="logo" 
              style={{ color: '#fff', display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none', marginBottom: '15px' }} 
              onClick={(e) => { e.preventDefault(); setActiveTab('shop'); }}
              onDoubleClick={() => handleAdminPanelAccess()}
            >
              <img 
                src="https://lh3.googleusercontent.com/d/1GcwTv0EvQPSpJqwA6gQ0SDsIPh9XlI-q" 
                alt="SAVI'S collection" 
                style={{ height: '36px', width: 'auto', objectFit: 'contain', filter: 'brightness(0) invert(1)' }} 
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
              <span style={{ fontSize: '20px', fontWeight: '700', letterSpacing: '1px' }}>
                SAVI'S <span style={{ color: 'rgba(255,255,255,.5)', fontWeight: '300', fontSize: '13px' }}>collection</span>
              </span>
            </a>
            <p className="footer-about">Premium fabrics, Made in India, Made for you. Quality materials ethically sourced and crafted with love.</p>
            <div className="footer-socials">
              <a href="#" className="social" onClick={(e) => e.preventDefault()}>f</a>
              <a href="#" className="social" onClick={(e) => e.preventDefault()}>in</a>
              <a href="#" className="social" onClick={(e) => e.preventDefault()}>📸</a>
              <a href="#" className="social" onClick={(e) => e.preventDefault()}>▶</a>
            </div>
          </div>
          <div className="footer-col">
            <h4>Collections</h4>
            <ul>
              <li><a href="#kids" onClick={(e) => { e.preventDefault(); scrollTo('#kids'); }}>Kids Collections</a></li>
              <li><a href="#collections" onClick={(e) => { e.preventDefault(); scrollTo('#collections'); }}>Home Essentials</a></li>
              <li><a href="#coords" onClick={(e) => { e.preventDefault(); scrollTo('#coords'); }}>Co Ords</a></li>
              <li><a href="#cotton" onClick={(e) => { e.preventDefault(); scrollTo('#cotton'); }}>Cotton Collection</a></li>
              <li><a href="#feeding" onClick={(e) => { e.preventDefault(); scrollTo('#feeding'); }}>Feeding Dress</a></li>
              <li><a href="#kurtis" onClick={(e) => { e.preventDefault(); scrollTo('#kurtis'); }}>Kurtis</a></li>
              <li><a href="#nightgown" onClick={(e) => { e.preventDefault(); scrollTo('#nightgown'); }}>Night Gown</a></li>
              <li><a href="#sarees" onClick={(e) => { e.preventDefault(); scrollTo('#sarees'); }}>Sarees</a></li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>Customer Help</h4>
            <ul>
              <li><a href="#" onClick={(e) => e.preventDefault()}>Track Your Order</a></li>
              <li><a href="#" onClick={(e) => e.preventDefault()}>Return & Exchange</a></li>
              <li><a href="#" onClick={(e) => e.preventDefault()}>Size Guide</a></li>
              <li><a href="#" onClick={(e) => e.preventDefault()}>Shipping Policy</a></li>
              <li><a href="#" onClick={(e) => e.preventDefault()}>FAQ</a></li>
              <li><a href="#contact" onClick={(e) => { e.preventDefault(); setActiveTab('shop'); setTimeout(() => scrollTo('#contact-section'), 100); }}>Contact Us</a></li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>Company</h4>
            <ul>
              <li><a href="#" onClick={(e) => e.preventDefault()}>About Us</a></li>
              <li><a href="#" onClick={(e) => e.preventDefault()}>Privacy Policy</a></li>
              <li><a href="#" onClick={(e) => e.preventDefault()}>Terms of Service</a></li>
              <li><a href="#" onClick={(e) => e.preventDefault()}>Refund Policy</a></li>
              <li><a href="#" onClick={(e) => e.preventDefault()}>Blog</a></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© 2025 SAVI'S collection — All rights reserved.</span>
          <span style={{ cursor: 'pointer', opacity: 0.15, fontSize: '10px' }} onClick={() => handleAdminPanelAccess()}>Admin Portal</span>
          <span>Made with ❤️ in India</span>
        </div>
      </footer>

      {/* WHATSAPP FLOATING BUTTON */}
      <a href="https://wa.me/919788633200" target="_blank" rel="noreferrer" className="wa-btn" title="Chat on WhatsApp">💬</a>

      {/* TOAST NOTIFICATION POPUP */}
      <div className={`toast ${toastShow ? 'show' : ''}`} id="toast">
        {toastMessage}
      </div>

      {/* BILLING INVOICE RECEIPT MODAL */}
      {generatedInvoice && (
        <div className="modal-overlay" style={{ zIndex: 1005 }} onClick={() => setGeneratedInvoice(null)}>
          <div className="modal-content glass" onClick={(e) => e.stopPropagation()} style={{ background: 'var(--surface)', color: 'var(--text-primary)', maxWidth: '550px', width: '95%', padding: '2.5rem' }}>
            
            {/* Invoice Branding Header */}
            <div style={{ textAlign: 'center', borderBottom: '2px solid var(--border)', paddingBottom: '1.5rem', marginBottom: '1.5rem' }}>
              <h1 style={{ fontSize: '24px', fontFamily: "'Playfair Display', serif", fontWeight: '700', color: 'var(--primary)', margin: '0 0 5px 0' }}>SAVI'S COLLECTION</h1>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>Premium Fabric Store & Boutique</span>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '5px' }}>Bengaluru Boutique Store · Phone: +91 98765 43210</div>
            </div>

            {/* Invoice Meta Detail */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
              <div>
                <strong>BILL TO:</strong>
                <div style={{ fontWeight: '600', marginTop: '4px', fontSize: '14px' }}>{generatedInvoice.customerName}</div>
                <div style={{ marginTop: '2px' }}>📞 {generatedInvoice.phone}</div>
                <div>✉️ {generatedInvoice.email}</div>
                <div style={{ marginTop: '4px', color: 'var(--text-secondary)' }}>📍 {generatedInvoice.address}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <strong>INVOICE DETAIL:</strong>
                <div style={{ fontWeight: '600', marginTop: '4px', color: 'var(--primary)' }}>Receipt #: {generatedInvoice.id}</div>
                <div>Date: {new Date(generatedInvoice.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</div>
                <div>Payment Method: <strong>UPI / POS Receipt</strong></div>
                <div>Status: <span style={{ color: 'var(--green)', fontWeight: '700' }}>PAID</span></div>
              </div>
            </div>

            {/* Items Table */}
            <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '1.5rem', fontSize: '12px' }}>
              <thead>
                <tr style={{ borderBottom: '1.5px solid var(--border)', textAlign: 'left', background: 'var(--bg-card-hover)' }}>
                  <th style={{ padding: '8px', color: 'var(--text-primary)', background: 'transparent' }}>Item Details</th>
                  <th style={{ padding: '8px', color: 'var(--text-primary)', background: 'transparent', textAlign: 'center' }}>Qty</th>
                  <th style={{ padding: '8px', color: 'var(--text-primary)', background: 'transparent', textAlign: 'right' }}>Unit Price</th>
                  <th style={{ padding: '8px', color: 'var(--text-primary)', background: 'transparent', textAlign: 'right' }}>Total</th>
                </tr>
              </thead>
              <tbody>
                {generatedInvoice.items.map((item, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '8px' }}>
                      <strong>{item.name}</strong>
                      <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '2px' }}>Size: {item.size} | Color: {item.color}</div>
                    </td>
                    <td style={{ padding: '8px', textAlign: 'center' }}>{item.quantity}</td>
                    <td style={{ padding: '8px', textAlign: 'right' }}>₹{item.price.toLocaleString('en-IN')}</td>
                    <td style={{ padding: '8px', textAlign: 'right', fontWeight: '600' }}>₹{(item.price * item.quantity).toLocaleString('en-IN')}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Invoice Total Calculation */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '12px', alignItems: 'flex-end', borderTop: '1.5px solid var(--border)', paddingTop: '1rem', marginBottom: '2rem' }}>
              <div style={{ display: 'flex', width: '220px', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Subtotal:</span>
                <strong>₹{(generatedInvoice.subtotalAmount || generatedInvoice.totalAmount).toLocaleString('en-IN')}</strong>
              </div>
              {generatedInvoice.discountAmount > 0 && (
                <div style={{ display: 'flex', width: '220px', justifyContent: 'space-between', color: 'var(--green)' }}>
                  <span>Discount Applied:</span>
                  <strong>- ₹{generatedInvoice.discountAmount.toLocaleString('en-IN')}</strong>
                </div>
              )}
              {generatedInvoice.taxAmount > 0 && (
                <div style={{ display: 'flex', width: '220px', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>GST Tax ({generatedInvoice.taxRate || 18}%):</span>
                  <strong>₹{generatedInvoice.taxAmount.toLocaleString('en-IN')}</strong>
                </div>
              )}
              <div style={{ display: 'flex', width: '220px', justifyContent: 'space-between', borderTop: '1px dashed var(--border)', paddingTop: '6px', marginTop: '4px', fontSize: '14px' }}>
                <strong style={{ color: 'var(--text-primary)' }}>Total Amount Paid:</strong>
                <strong style={{ color: 'var(--primary)' }}>₹{generatedInvoice.totalAmount.toLocaleString('en-IN')}</strong>
              </div>
            </div>

            {/* Print or Send Invoice Button Footer */}
            <div style={{ display: 'flex', gap: '10px' }}>
              <button 
                onClick={() => window.print()} 
                className="btn btn-primary" 
                style={{ flex: 1, padding: '10px', fontSize: '12px' }}
              >
                🖨️ Print Invoice Receipt
              </button>
              <button 
                onClick={() => {
                  const itemsDesc = generatedInvoice.items.map(item => `• ${item.name} (${item.size}/${item.color}) x${item.quantity}`).join('%0D%0A');
                  const message = `Hi ${generatedInvoice.customerName}! Here is your invoice receipt from SAVI'S Collection.%0D%0A%0D%0A*Receipt #:* ${generatedInvoice.id}%0D%0A*Items Purchased:*%0D%0A${itemsDesc}%0D%0A%0D%0A*Discount:* -₹${generatedInvoice.discountAmount || 0}%0D%0A*GST Tax:* ₹${generatedInvoice.taxAmount || 0}%0D%0A*Total Amount Paid:* ₹${generatedInvoice.totalAmount.toLocaleString('en-IN')}%0D%0A%0D%0AThank you for shopping with us! ✨`;
                  const waUrl = `https://api.whatsapp.com/send?phone=${generatedInvoice.phone.replace(/\D/g, '')}&text=${message}`;
                  window.open(waUrl, '_blank');
                }} 
                className="btn btn-secondary" 
                style={{ flex: 1.2, padding: '10px', fontSize: '12px', background: '#25D366', color: '#fff', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                💬 Share via WhatsApp
              </button>
              <button 
                onClick={() => setGeneratedInvoice(null)} 
                className="btn btn-secondary" 
                style={{ padding: '10px', fontSize: '12px' }}
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}


      {/* PRODUCT DETAILS MODAL */}
      {selectedProduct && (
        <div className="modal-overlay" onClick={() => setSelectedProduct(null)}>
          <div className="modal-content product-details glass" onClick={(e) => e.stopPropagation()} style={{ background: 'var(--surface)', color: 'var(--text-primary)' }}>
            <button className="modal-close" onClick={() => setSelectedProduct(null)} aria-label="Close Details">✕</button>
            <div className="modal-img-container">
              <img 
                src={getProductImageForColor(selectedProduct, selectedColor)} 
                alt={selectedProduct.name} 
                onError={(e) => {
                  e.target.src = 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=500&auto=format&fit=crop';
                }}
              />
            </div>
            <div className="modal-details" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <div className="modal-header" style={{ marginBottom: '10px' }}>
                <span className="modal-category" style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: '600' }}>{selectedProduct.category}</span>
                <h2 className="modal-title" style={{ fontSize: '20px', fontFamily: "'Playfair Display', serif", fontWeight: '600', marginTop: '4px' }}>{selectedProduct.name}</h2>
              </div>
              <div className="modal-price" style={{ fontSize: '22px', fontWeight: '700', color: 'var(--primary)', marginBottom: '15px' }}>
                ₹{selectedProduct.price.toLocaleString('en-IN')}
                {selectedProduct.oldPrice && (
                  <span style={{ fontSize: '14px', textDecoration: 'line-through', color: 'var(--text-muted)', marginLeft: '10px', fontWeight: '400' }}>
                    ₹{selectedProduct.oldPrice.toLocaleString('en-IN')}
                  </span>
                )}
              </div>
              <p className="modal-desc" style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.6', marginBottom: '20px' }}>
                {selectedProduct.description || "Premium high-quality fabric, crafted with comfort and elegance in mind."}
              </p>
              
              <div className="option-select" style={{ marginBottom: '15px' }}>
                <span className="option-label" style={{ display: 'block', fontSize: '12px', fontWeight: '600', marginBottom: '8px' }}>Select Size</span>
                <div className="size-swatches" style={{ display: 'flex', gap: '8px' }}>
                  {(selectedProduct.sizes || ['S', 'M', 'L', 'XL']).map(size => (
                    <button
                      key={size}
                      className={`size-swatch ${selectedSize === size ? 'active' : ''}`}
                      onClick={() => setSelectedSize(size)}
                      style={{ padding: '6px 12px', border: '1px solid var(--border)', background: selectedSize === size ? 'var(--primary)' : 'var(--surface)', color: selectedSize === size ? '#fff' : 'var(--text-primary)', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', fontWeight: '600' }}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              <div className="option-select" style={{ marginBottom: '20px' }}>
                <span className="option-label" style={{ display: 'block', fontSize: '12px', fontWeight: '600', marginBottom: '8px' }}>Select Color</span>
                <div className="color-swatches" style={{ display: 'flex', gap: '8px' }}>
                  {(selectedProduct.colors || ['Mustard', 'Indigo', 'Sage']).map(color => (
                    <button
                      key={color}
                      className={`color-swatch ${selectedColor === color ? 'active' : ''}`}
                      onClick={() => setSelectedColor(color)}
                      style={{ padding: '6px 12px', border: '1px solid var(--border)', background: selectedColor === color ? 'var(--primary)' : 'var(--surface)', color: selectedColor === color ? '#fff' : 'var(--text-primary)', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', fontWeight: '600' }}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <button 
                  className="btn btn-primary"
                  onClick={() => addToCart(selectedProduct, selectedSize, selectedColor)}
                  style={{ flex: 1, padding: '12px', borderRadius: '4px', fontSize: '13px', fontWeight: '600' }}
                >
                  Add to Bag
                </button>
                <button 
                  className="btn"
                  onClick={() => {
                    if (!currentUser) {
                      setPendingAction({ 
                        type: 'buy_now', 
                        payload: { product: selectedProduct, size: selectedSize, color: selectedColor } 
                      });
                      setIsLoginModalOpen(true);
                      triggerToast("Please login or register to checkout!");
                      return;
                    }
                    startBuyNow(selectedProduct, selectedSize, selectedColor);
                  }}
                  style={{ flex: 1, padding: '12px', borderRadius: '4px', fontSize: '13px', fontWeight: '600', background: 'linear-gradient(135deg, #ff9900 0%, #ff5500 100%)', border: 'none', color: '#fff', cursor: 'pointer' }}
                >
                  Buy Now
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SHOPPING CART DRAWER */}
      {isCartOpen && (
        <>
          <div className="overlay open" onClick={() => setIsCartOpen(false)}></div>
          <div className="cart-drawer open" style={{ background: 'var(--surface)', color: 'var(--text-primary)' }}>
            <div className="cart-head" style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '600', margin: 0 }}>Your Cart ({cart.reduce((sum, item) => sum + item.quantity, 0)})</h3>
              <button className="close-btn" onClick={() => setIsCartOpen(false)} style={{ background: 'none', border: 'none', fontSize: '22px', cursor: 'pointer', color: 'var(--gray)' }}>✕</button>
            </div>

            <div className="cart-body" style={{ flex: 1, overflowY: 'auto', padding: '1.25rem 1.5rem' }}>
              {checkoutSuccess ? (
                <div className="cart-empty-msg" style={{ padding: '40px 10px', textAlign: 'center' }}>
                  <div className="empty-icon" style={{ fontSize: '50px', color: 'var(--success)' }}>🎉</div>
                  <h4 style={{ fontSize: '16px', fontWeight: '600', margin: '15px 0 8px 0' }}>Order Placed Successfully!</h4>
                  <p style={{ fontSize: '13px', color: 'var(--gray)', lineHeight: '1.5' }}>Your purchase request has been submitted. The store owner will receive your order and connect with you shortly.</p>
                  <button className="btn btn-primary" onClick={() => setCheckoutSuccess(false)} style={{ marginTop: '1.5rem', padding: '10px 20px', fontSize: '12px', width: '100%' }}>
                    Continue Shopping
                  </button>
                </div>
              ) : cart.length === 0 ? (
                <div className="cart-empty-msg" style={{ textAlign: 'center', color: 'var(--gray)', padding: '50px 10px' }}>
                  <div className="empty-icon" style={{ fontSize: '52px', opacity: '0.3', marginBottom: '15px' }}>🛒</div>
                  <h4 style={{ fontSize: '15px', fontWeight: '600', marginBottom: '8px' }}>Your cart is empty</h4>
                  <p style={{ fontSize: '12px' }}>Add some products to get started!</p>
                </div>
              ) : (
                <>
                  <div className="cart-items" style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginBottom: '2rem' }}>
                    {cart.map((c, i) => (
                      <div key={c.cartItemId} className="cart-item" style={{ display: 'flex', gap: '12px', borderBottom: '1px solid var(--border)', paddingBottom: '12px' }}>
                        <img src={c.image} alt={c.name} className="ci-img" style={{ width: '64px', height: '80px', objectFit: 'cover', borderRadius: '4px', background: 'var(--light)' }} />
                        <div className="ci-info" style={{ flex: 1 }}>
                          <div className="ci-name" style={{ fontSize: '13px', fontWeight: '500', lineHeight: '1.3', marginBottom: '4px' }}>{c.name}</div>
                          <div className="ci-meta" style={{ fontSize: '11px', color: 'var(--gray)', marginBottom: '8px' }}>{c.size} / {c.color} · ₹{c.price}</div>
                          <div className="ci-qty" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <button className="qty-btn" onClick={() => updateCartQty(c.cartItemId, -1)} style={{ width: '24px', height: '24px', border: '1px solid var(--border)', background: 'none', cursor: 'pointer', borderRadius: '3px' }}>−</button>
                            <span style={{ fontSize: '13px', fontWeight: '600' }}>{c.quantity}</span>
                            <button className="qty-btn" onClick={() => updateCartQty(c.cartItemId, 1)} style={{ width: '24px', height: '24px', border: '1px solid var(--border)', background: 'none', cursor: 'pointer', borderRadius: '3px' }}>+</button>
                          </div>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'space-between' }}>
                          <span className="ci-price" style={{ fontSize: '13px', fontWeight: '600' }}>₹{(c.price * c.quantity).toLocaleString('en-IN')}</span>
                          <button className="ci-remove" onClick={() => updateCartQty(c.cartItemId, -c.quantity)} style={{ background: 'none', border: 'none', color: 'var(--gray)', cursor: 'pointer', fontSize: '16px' }}>✕</button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="cart-foot-summary" style={{ borderTop: '1.5px solid var(--border)', paddingTop: '1.5rem', marginTop: '1.5rem' }}>
                    <div className="summary-row" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '13px', color: 'var(--gray)' }}>
                      <span>Subtotal ({cart.reduce((sum, item) => sum + item.quantity, 0)} items)</span>
                      <span>₹{getCartTotal().toLocaleString('en-IN')}</span>
                    </div>
                    <div className="summary-row" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', fontSize: '13px', color: 'var(--gray)' }}>
                      <span>Delivery Charge</span>
                      <span>{getCartTotal() >= 599 ? <strong style={{ color: 'var(--green)' }}>FREE</strong> : '₹50'}</span>
                    </div>
                    
                    {getCartTotal() < 599 && (
                      <div className="free-shipping-tip" style={{ fontSize: '11px', color: 'var(--primary)', marginBottom: '12px', background: 'rgba(200, 16, 46, 0.05)', padding: '6px 10px', borderRadius: '4px', textAlign: 'center' }}>
                        💡 Add <strong>₹{(599 - getCartTotal()).toLocaleString('en-IN')}</strong> more for <strong>FREE Shipping</strong>!
                      </div>
                    )}

                    <div className="cart-subtotal" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', paddingTop: '10px', borderTop: '1px dashed var(--border)' }}>
                      <span style={{ fontSize: '14px', fontWeight: '600' }}>Order Estimate</span>
                      <strong style={{ fontSize: '18px', fontWeight: '700', color: 'var(--primary)' }}>
                        ₹{(getCartTotal() >= 599 ? getCartTotal() : getCartTotal() + 50).toLocaleString('en-IN')}
                      </strong>
                    </div>

                    <button 
                      onClick={handleCheckout} 
                      className="checkout-btn" 
                      style={{ width: '100%', padding: '14px', border: 'none', borderRadius: '4px', background: 'var(--primary)', color: '#fff', cursor: 'pointer', fontWeight: '600', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '.5px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}
                    >
                      Proceed to Checkout ➔
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </>
      )}

      {/* WISHLIST DRAWER */}
      {isWishlistOpen && (
        <>
          <div className="overlay open" onClick={() => setIsWishlistOpen(false)}></div>
          <div className="cart-drawer open" style={{ background: 'var(--bg-dark)', color: 'var(--text-primary)', borderLeft: '1px solid var(--border-color)' }}>
            <div className="cart-head" style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '600', margin: 0, fontFamily: "'Playfair Display', serif" }}>❤️ Your Wishlist ({wishlist.length})</h3>
              <button className="close-btn" onClick={() => setIsWishlistOpen(false)} style={{ background: 'none', border: 'none', fontSize: '22px', cursor: 'pointer', color: 'var(--text-secondary)' }}>✕</button>
            </div>

            <div className="cart-body" style={{ flex: 1, overflowY: 'auto', padding: '1.25rem 1.5rem' }}>
              {wishlist.length === 0 ? (
                <div className="cart-empty-msg" style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '50px 10px' }}>
                  <div className="empty-icon" style={{ fontSize: '52px', opacity: '0.3', marginBottom: '15px' }}>❤️</div>
                  <h4 style={{ fontSize: '15px', fontWeight: '600', marginBottom: '8px' }}>Your wishlist is empty</h4>
                  <p style={{ fontSize: '12px' }}>Save your favorite items here!</p>
                </div>
              ) : (
                <div className="cart-items" style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginBottom: '2rem' }}>
                  {wishlist.map(id => {
                    const item = products.find(p => p.id === id);
                    if (!item) return null;
                    return (
                      <div key={item.id} className="cart-item" style={{ display: 'flex', gap: '12px', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
                        <img src={item.image} alt={item.name} className="ci-img" style={{ width: '64px', height: '80px', objectFit: 'cover', borderRadius: '4px', background: 'var(--bg-card)' }} />
                        <div className="ci-info" style={{ flex: 1 }}>
                          <div className="ci-name" style={{ fontSize: '13px', fontWeight: '500', lineHeight: '1.3', marginBottom: '4px', color: 'var(--text-primary)' }}>{item.name}</div>
                          <div className="ci-meta" style={{ fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '8px' }}>₹{item.price}</div>
                          <button 
                            className="btn btn-primary"
                            onClick={() => {
                              setSelectedProduct(item);
                              setIsWishlistOpen(false);
                            }}
                            style={{ padding: '6px 12px', fontSize: '11px', borderRadius: '4px', cursor: 'pointer' }}
                          >
                            Select Options & Buy
                          </button>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'space-between' }}>
                          <button onClick={() => toggleWishlist(item.id)} style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', fontSize: '16px' }}>✕</button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {/* ADMIN ADD PRODUCT MODAL */}
      {isAddModalOpen && (
        <div className="modal-overlay" style={{ zIndex: 1001 }} onClick={() => setIsAddModalOpen(false)}>
          <div className="modal-content glass" onClick={(e) => e.stopPropagation()} style={{ background: 'var(--surface)', color: 'var(--text-primary)', maxWidth: '500px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '18px', fontWeight: '600', fontFamily: "'Playfair Display', serif" }}>Add New Apparel Product</h2>
              <button onClick={() => setIsAddModalOpen(false)} style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer' }}>✕</button>
            </div>
            
            <form onSubmit={handleAddProduct} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div className="form-group">
                <label style={{ display: 'block', fontSize: '11px', fontWeight: '600', marginBottom: '4px' }}>Product Name</label>
                <input 
                  type="text" 
                  required 
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                  placeholder="e.g. Cambric Cotton Frock"
                  style={{ width: '100%', padding: '8px', border: '1px solid var(--border)', borderRadius: '4px' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div className="form-group">
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: '600', marginBottom: '4px' }}>Price (INR)</label>
                  <input 
                    type="number" 
                    required 
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                    placeholder="999"
                    style={{ width: '100%', padding: '8px', border: '1px solid var(--border)', borderRadius: '4px' }}
                  />
                </div>
                <div className="form-group">
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: '600', marginBottom: '4px' }}>Compare Price (Old Price)</label>
                  <input 
                    type="number" 
                    value={newProduct.oldPrice}
                    onChange={(e) => setNewProduct({ ...newProduct, oldPrice: e.target.value })}
                    placeholder="1299"
                    style={{ width: '100%', padding: '8px', border: '1px solid var(--border)', borderRadius: '4px' }}
                  />
                </div>
              </div>

              <div className="form-group">
                <label style={{ display: 'block', fontSize: '11px', fontWeight: '600', marginBottom: '4px' }}>Category</label>
                <select
                  value={newProduct.category}
                  onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                  style={{ width: '100%', padding: '8px', border: '1px solid var(--border)', borderRadius: '4px' }}
                >
                  <option value="Kids">Kids Collections</option>
                  <option value="Home Essentials">Home Essentials</option>
                  <option value="Co-ords">Co Ords</option>
                  <option value="Cotton">Cotton Collection</option>
                  <option value="Feeding">Feeding Dress</option>
                  <option value="Kurtis">Kurtis</option>
                  <option value="Nightwear">Night Gown</option>
                  <option value="Sarees">Sarees</option>
                  <option value="Short Tops">Short Tops</option>
                </select>
              </div>

              <div className="form-group" style={{ border: '1px dashed var(--border)', padding: '10px', borderRadius: '6px', background: 'rgba(0,0,0,0.02)' }}>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: '600', marginBottom: '4px' }}>Product Image (Main)</label>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '6px' }}>
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={handleProductImageUpload}
                    style={{ fontSize: '11px', flex: 1 }}
                  />
                  {imageUploading && <span style={{ fontSize: '11px', color: 'var(--primary)' }}>Uploading...</span>}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>OR</span>
                  <input 
                    type="text" 
                    value={newProduct.image}
                    onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value })}
                    placeholder="https://images.unsplash.com/... or paste image URL"
                    style={{ flex: 1, padding: '6px', border: '1px solid var(--border)', borderRadius: '4px', fontSize: '11px' }}
                  />
                </div>
                {newProduct.image && (
                  <div style={{ marginTop: '8px', textAlign: 'center' }}>
                    <img src={newProduct.image} alt="Main Preview" style={{ height: '60px', objectFit: 'cover', borderRadius: '4px' }} />
                  </div>
                )}
              </div>

              <div className="form-group">
                <label style={{ display: 'block', fontSize: '11px', fontWeight: '600', marginBottom: '4px' }}>Description</label>
                <textarea 
                  rows="2"
                  value={newProduct.description}
                  onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                  placeholder="Apparel description here..."
                  style={{ width: '100%', padding: '8px', border: '1px solid var(--border)', borderRadius: '4px', fontFamily: 'inherit' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div className="form-group">
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: '600', marginBottom: '4px' }}>Sizes (comma-separated)</label>
                  <input 
                    type="text" 
                    value={newProduct.sizes}
                    onChange={(e) => setNewProduct({ ...newProduct, sizes: e.target.value })}
                    placeholder="S, M, L, XL"
                    style={{ width: '100%', padding: '8px', border: '1px solid var(--border)', borderRadius: '4px' }}
                  />
                </div>
                <div className="form-group">
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: '600', marginBottom: '4px' }}>Colors (comma-separated)</label>
                  <input 
                    type="text" 
                    value={newProduct.colors}
                    onChange={(e) => setNewProduct({ ...newProduct, colors: e.target.value })}
                    placeholder="Mustard, Sage"
                    style={{ width: '100%', padding: '8px', border: '1px solid var(--border)', borderRadius: '4px' }}
                  />
                </div>
              </div>

              {/* DYNAMIC COLOR IMAGE MAPPING */}
              {newProduct.colors && newProduct.colors.split(',').map(c => c.trim()).filter(Boolean).length > 0 && (
                <div style={{ border: '1px dashed var(--border)', padding: '10px', borderRadius: '6px', background: 'rgba(0,0,0,0.01)', maxHeight: '180px', overflowY: 'auto' }}>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', marginBottom: '8px', color: 'var(--primary)' }}>🎨 Color-Specific Images (Optional)</label>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {newProduct.colors.split(',').map(c => c.trim()).filter(Boolean).map(color => (
                      <div key={color} style={{ display: 'flex', flexDirection: 'column', gap: '4px', borderBottom: '1px solid #eee', paddingBottom: '8px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontSize: '11px', fontWeight: '600' }}>Color: <span style={{ color: 'var(--accent)' }}>{color}</span></span>
                          {newProduct.colorImages?.[color] && (
                            <img src={newProduct.colorImages[color]} alt={color} style={{ height: '30px', width: '30px', objectFit: 'cover', borderRadius: '4px' }} />
                          )}
                        </div>
                        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                          <input 
                            type="file" 
                            accept="image/*"
                            onChange={(e) => handleColorImageUpload(color, e)}
                            style={{ fontSize: '10px', width: '150px' }}
                          />
                          <input 
                            type="text" 
                            value={newProduct.colorImages?.[color] || ''}
                            onChange={(e) => setNewProduct({
                              ...newProduct,
                              colorImages: {
                                ...newProduct.colorImages,
                                [color]: e.target.value
                              }
                            })}
                            placeholder="Or paste image URL"
                            style={{ flex: 1, padding: '4px', border: '1px solid var(--border)', borderRadius: '4px', fontSize: '10px' }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              <div className="form-group">
                <label style={{ display: 'block', fontSize: '11px', fontWeight: '600', marginBottom: '4px' }}>Initial Stock Inventory</label>
                <input 
                  type="number" 
                  min="0"
                  required
                  value={newProduct.stock !== undefined ? newProduct.stock : 20}
                  onChange={(e) => setNewProduct({ ...newProduct, stock: Math.max(0, parseInt(e.target.value) || 0) })}
                  placeholder="20"
                  style={{ width: '100%', padding: '8px', border: '1px solid var(--border)', borderRadius: '4px' }}
                />
              </div>

              <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '5px' }}>
                <input 
                  type="checkbox" 
                  id="p-feat" 
                  checked={newProduct.featured}
                  onChange={(e) => setNewProduct({ ...newProduct, featured: e.target.checked })}
                />
                <label htmlFor="p-feat" style={{ fontSize: '12px', fontWeight: '600' }}>Feature this product on homepage banner</label>
              </div>

              <button type="submit" className="btn btn-primary" style={{ padding: '12px', marginTop: '10px', borderRadius: '4px' }}>
                Create Product Listing
              </button>
            </form>
          </div>
        </div>
      )}
      {isLoginModalOpen && (
        <div className="modal-overlay" style={{ zIndex: 1002 }} onClick={() => setIsLoginModalOpen(false)}>
          <div className="auth-modal-content" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setIsLoginModalOpen(false)} className="auth-close-btn" aria-label="Close authentication modal">✕</button>
            
            {/* Modal tabs */}
            <div className="auth-tabs">
              <button 
                onClick={() => setLoginTab('login')} 
                className={`auth-tab-btn ${loginTab === 'login' ? 'active' : ''}`}
              >
                Log In
              </button>
              <button 
                onClick={() => setLoginTab('register')} 
                className={`auth-tab-btn ${loginTab === 'register' ? 'active' : ''}`}
              >
                Register
              </button>
            </div>

            {/* TAB 1: LOGIN */}
            {loginTab === 'login' && (
              <div>
                <p className="auth-helper-text">
                  Welcome back! Enter your registered Email or Phone number to access your account instantly.
                </p>
                <form onSubmit={handleUserLoginOnly} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div className="auth-form-group">
                    <label className="auth-label">Email or Phone Number</label>
                    <input 
                      type="text" 
                      required 
                      value={emailOrPhoneInput}
                      onChange={(e) => setEmailOrPhoneInput(e.target.value)}
                      placeholder="e.g. customer@example.com or 9788633200"
                      className="auth-input"
                    />
                  </div>
                  <button type="submit" className="auth-submit-btn">
                    Access Account ➔
                  </button>
                </form>
              </div>
            )}

            {/* TAB 2: REGISTER */}
            {loginTab === 'register' && (
              <div>
                <p className="auth-helper-text">
                  New to SAVI'S? Create a customer profile to place orders and manage your deliveries.
                </p>
                <form onSubmit={handleUserRegisterSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div className="auth-form-group">
                    <label className="auth-label">Full Name</label>
                    <input 
                      type="text" 
                      required 
                      value={loginForm.name}
                      onChange={(e) => setLoginForm({ ...loginForm, name: e.target.value })}
                      placeholder="e.g. Mukil Kumar"
                      className="auth-input"
                    />
                  </div>
                  <div className="auth-form-group">
                    <label className="auth-label">Email Address</label>
                    <input 
                      type="email" 
                      required 
                      value={loginForm.email}
                      onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                      placeholder="e.g. customer@example.com"
                      className="auth-input"
                    />
                  </div>
                  <div className="auth-form-group">
                    <label className="auth-label">Confirm Email Address</label>
                    <input 
                      type="email" 
                      required 
                      value={loginForm.confirmEmail}
                      onChange={(e) => setLoginForm({ ...loginForm, confirmEmail: e.target.value })}
                      placeholder="Re-enter email address"
                      className="auth-input"
                    />
                  </div>
                  <div className="auth-form-group">
                    <label className="auth-label">Phone Number</label>
                    <input 
                      type="tel" 
                      required 
                      value={loginForm.phone}
                      onChange={(e) => setLoginForm({ ...loginForm, phone: e.target.value })}
                      placeholder="e.g. +91 98765 43210"
                      className="auth-input"
                    />
                  </div>
                  <div className="auth-form-group">
                    <label className="auth-label">Default Delivery Address</label>
                    <textarea 
                      rows="2"
                      required 
                      value={loginForm.address}
                      onChange={(e) => setLoginForm({ ...loginForm, address: e.target.value })}
                      placeholder="e.g. 45 Palace Road, Bengaluru, KA"
                      className="auth-input"
                      style={{ fontFamily: 'inherit', resize: 'vertical' }}
                    />
                  </div>
                  <button type="submit" className="auth-submit-btn">
                    Create Profile ➔
                  </button>
                </form>
              </div>
            )}

          </div>
        </div>
      )}

      {isProfileOpen && currentUser && (
        <div className="modal-overlay" style={{ zIndex: 1002 }} onClick={() => setIsProfileOpen(false)}>
          <div className="modal-content glass" onClick={(e) => e.stopPropagation()} style={{ background: 'var(--surface)', color: 'var(--text-primary)', maxWidth: '650px', width: '90%', maxHeight: '85vh', overflowY: 'auto', padding: '2rem', borderRadius: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid var(--border)', paddingBottom: '1rem' }}>
              <h2 style={{ fontSize: '20px', fontWeight: '700', fontFamily: "'Playfair Display', serif", margin: 0 }}>👤 My Account Profile</h2>
              <button onClick={() => setIsProfileOpen(false)} style={{ background: 'none', border: 'none', fontSize: '22px', cursor: 'pointer', color: 'var(--gray)' }}>✕</button>
            </div>

            <div className="profile-details-grid" style={{ marginBottom: '2rem', background: 'var(--light)', padding: '15px', borderRadius: '8px', fontSize: '13px' }}>
              <div>
                <strong style={{ color: 'var(--gray)' }}>Name:</strong>
                <div style={{ fontWeight: '600', fontSize: '15px', marginTop: '4px' }}>{currentUser.name || 'N/A'}</div>
              </div>
              <div>
                <strong style={{ color: 'var(--gray)' }}>Email:</strong>
                <div style={{ fontWeight: '600', fontSize: '15px', marginTop: '4px' }}>{currentUser.email || 'N/A'}</div>
              </div>
              <div>
                <strong style={{ color: 'var(--gray)' }}>Phone:</strong>
                <div style={{ fontWeight: '600', fontSize: '15px', marginTop: '4px' }}>{currentUser.phone || 'N/A'}</div>
              </div>
              <div>
                <strong style={{ color: 'var(--gray)' }}>Default Shipping Address:</strong>
                <div style={{ fontWeight: '600', marginTop: '4px', lineHeight: '1.4' }}>{currentUser.address || 'No address saved.'}</div>
              </div>
            </div>

            <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '1rem', fontFamily: "'Playfair Display', serif" }}>📦 Order History & Status Tracking</h3>

            {userOrders.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px 10px', background: 'rgba(0,0,0,0.02)', borderRadius: '8px', color: 'var(--gray)', fontSize: '13px' }}>
                <div style={{ fontSize: '40px', marginBottom: '10px' }}>📦</div>
                No orders placed yet. Add items to cart to start shopping!
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {userOrders.map(order => {
                  return (
                    <div key={order.id} style={{ border: '1px solid var(--border)', borderRadius: '8px', padding: '15px', background: 'var(--surface)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px dashed var(--border)', paddingBottom: '10px', marginBottom: '12px', flexWrap: 'wrap', gap: '8px', fontSize: '12px' }}>
                        <div>
                          <strong>Order ID:</strong> <span style={{ color: 'var(--primary)', fontWeight: '600' }}>{order.id}</span>
                        </div>
                        <div style={{ color: 'var(--gray)' }}>
                          Placed on: {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </div>
                        <div style={{ fontWeight: '600' }}>
                          Total: ₹{order.totalAmount.toLocaleString('en-IN')} ({order.paymentMethod || 'COD'})
                        </div>
                      </div>

                      {/* Items details */}
                      <div style={{ marginBottom: '15px' }}>
                        {order.items.map((item, idx) => (
                          <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', margin: '4px 0', color: 'var(--text-secondary)' }}>
                            <span>• {item.name} ({item.size} / {item.color}) x{item.quantity}</span>
                            <strong>₹{(item.price * item.quantity).toLocaleString('en-IN')}</strong>
                          </div>
                        ))}
                      </div>

                      {/* Flipkart tracker style progress bar */}
                      <div style={{ padding: '15px 0', margin: '10px 0' }}>
                        {order.status === 'Cancelled' ? (
                          <div style={{ background: 'rgba(220,38,38,0.05)', border: '1px solid rgba(220,38,38,0.15)', color: '#dc2626', padding: '8px 12px', borderRadius: '6px', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '500' }}>
                            <span>❌</span> This order was <strong>Cancelled</strong>.
                          </div>
                        ) : (
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative' }}>
                            {/* Line connecting the steps */}
                            <div style={{ position: 'absolute', top: '10px', left: '10%', right: '10%', height: '4px', background: '#e0e0e0', zIndex: 1 }}>
                              <div style={{ 
                                height: '100%', 
                                background: 'var(--primary)', 
                                transition: 'width 0.4s ease',
                                width: 
                                  order.status === 'Delivered' ? '100%' :
                                  order.status === 'Shipped' ? '66%' :
                                  order.status === 'Confirmed' || order.status === 'Processing' ? '33%' : '0%'
                              }}></div>
                            </div>

                            {/* Steps */}
                            {['Ordered', 'Confirmed', 'Shipped', 'Delivered'].map((step, stepIdx) => {
                              const isCompleted = 
                                (step === 'Ordered') ||
                                (step === 'Confirmed' && (order.status === 'Confirmed' || order.status === 'Processing' || order.status === 'Shipped' || order.status === 'Delivered')) ||
                                (step === 'Shipped' && (order.status === 'Shipped' || order.status === 'Delivered')) ||
                                (step === 'Delivered' && (order.status === 'Delivered'));

                              return (
                                <div key={step} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 2, position: 'relative', width: '20%' }}>
                                  <div style={{ 
                                    width: '24px', 
                                    height: '24px', 
                                    borderRadius: '50%', 
                                    background: isCompleted ? 'var(--primary)' : '#fff', 
                                    border: isCompleted ? '2px solid var(--primary)' : '2px solid #ccc', 
                                    display: 'flex', 
                                    justifyContent: 'center', 
                                    alignItems: 'center',
                                    color: isCompleted ? '#fff' : '#ccc',
                                    fontSize: '11px',
                                    fontWeight: '700'
                                  }}>
                                    {isCompleted ? '✓' : stepIdx + 1}
                                  </div>
                                  <span style={{ fontSize: '11px', fontWeight: '600', marginTop: '6px', color: isCompleted ? 'var(--black)' : 'var(--gray)' }}>{step}</span>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>

                      {order.status === 'Pending' && (
                        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '12px' }}>
                          <button 
                            className="btn btn-danger" 
                            onClick={() => handleCancelOrder(order.id)}
                            style={{ padding: '6px 12px', fontSize: '12px', borderRadius: '4px' }}
                          >
                            Cancel Order
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1.5rem', marginTop: '2rem', display: 'flex', justifyContent: 'space-between' }}>
              <button 
                className="btn btn-danger" 
                onClick={() => { handleUserLogout(); setIsProfileOpen(false); }}
                style={{ padding: '10px 20px', borderRadius: '4px', fontWeight: '600' }}
              >
                Logout Account
              </button>
              <button 
                className="btn btn-secondary" 
                onClick={() => setIsProfileOpen(false)}
                style={{ padding: '10px 20px', borderRadius: '4px' }}
              >
                Close Window
              </button>
            </div>

          </div>
        </div>
      )}

      {isCheckoutWizardOpen && (
        <div className="modal-overlay" style={{ zIndex: 1002 }} onClick={() => setIsCheckoutWizardOpen(false)}>
          <div className="modal-content glass" onClick={(e) => e.stopPropagation()} style={{ background: 'var(--surface)', color: 'var(--text-primary)', maxWidth: '600px', width: '90%', maxHeight: '90vh', overflowY: 'auto', padding: '2rem', borderRadius: '12px' }}>
            
            {checkoutStep < 4 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', borderBottom: '1px solid var(--border)', paddingBottom: '1rem' }}>
                {['1. Delivery', '2. Payment', '3. Review'].map((stepName, idx) => {
                  const stepNum = idx + 1;
                  const isActive = checkoutStep === stepNum;
                  const isPast = checkoutStep > stepNum;
                  return (
                    <div key={stepName} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ 
                        width: '24px', 
                        height: '24px', 
                        borderRadius: '50%', 
                        background: isActive ? 'var(--primary)' : (isPast ? 'var(--green)' : '#ccc'), 
                        color: '#fff', 
                        display: 'flex', 
                        justifyContent: 'center', 
                        alignItems: 'center', 
                        fontWeight: '600', 
                        fontSize: '12px' 
                      }}>
                        {isPast ? '✓' : stepNum}
                      </span>
                      <strong style={{ fontSize: '13px', color: isActive ? 'var(--primary)' : 'var(--gray)' }}>{stepName}</strong>
                    </div>
                  );
                })}
              </div>
            )}

            {checkoutStep === 1 && (
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: '700', fontFamily: "'Playfair Display', serif", marginBottom: '1.25rem' }}>📍 Delivery Address</h3>
                <form onSubmit={(e) => { e.preventDefault(); setCheckoutStep(2); }}>
                  <div className="form-group" style={{ marginBottom: '12px' }}>
                    <label style={{ display: 'block', fontSize: '11px', fontWeight: '600', marginBottom: '4px', textTransform: 'uppercase' }}>Full Name</label>
                    <input 
                      type="text" 
                      required 
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="e.g. Mukil Kumar"
                      style={{ width: '100%', padding: '10px', border: '1.5px solid var(--border)', borderRadius: '4px', fontSize: '13px' }}
                    />
                  </div>
                  <div className="form-group" style={{ marginBottom: '12px' }}>
                    <label style={{ display: 'block', fontSize: '11px', fontWeight: '600', marginBottom: '4px', textTransform: 'uppercase' }}>Email Address</label>
                    <input 
                      type="email" 
                      required 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. customer@example.com"
                      style={{ width: '100%', padding: '10px', border: '1.5px solid var(--border)', borderRadius: '4px', fontSize: '13px' }}
                    />
                  </div>
                  <div className="form-group" style={{ marginBottom: '12px' }}>
                    <label style={{ display: 'block', fontSize: '11px', fontWeight: '600', marginBottom: '4px', textTransform: 'uppercase' }}>Phone Number</label>
                    <input 
                      type="tel" 
                      required 
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="e.g. +91 97886 33200"
                      style={{ width: '100%', padding: '10px', border: '1.5px solid var(--border)', borderRadius: '4px', fontSize: '13px' }}
                    />
                  </div>
                  <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                    <label style={{ display: 'block', fontSize: '11px', fontWeight: '600', marginBottom: '4px', textTransform: 'uppercase' }}>Shipping Address</label>
                    <textarea 
                      required 
                      rows="3"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="e.g. 45 Palace Road, Bengaluru, KA"
                      style={{ width: '100%', padding: '10px', border: '1.5px solid var(--border)', borderRadius: '4px', fontSize: '13px', fontFamily: 'inherit', resize: 'vertical' }}
                    />
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2rem' }}>
                    <button type="button" className="btn btn-secondary" onClick={() => setIsCheckoutWizardOpen(false)}>Cancel</button>
                    <button type="submit" className="btn btn-primary" style={{ padding: '10px 20px', borderRadius: '4px' }}>Continue to Payment ➔</button>
                  </div>
                </form>
              </div>
            )}

            {checkoutStep === 2 && (
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: '700', fontFamily: "'Playfair Display', serif", marginBottom: '1.25rem' }}>💳 Select Payment Option</h3>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '2rem' }}>
                  
                  <label style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', border: '1px solid var(--border)', borderRadius: '6px', cursor: 'pointer', background: paymentMethod === 'COD' ? 'rgba(200, 16, 46, 0.03)' : '#fff', borderColor: paymentMethod === 'COD' ? 'var(--primary)' : 'var(--border)' }}>
                    <input type="radio" checked={paymentMethod === 'COD'} onChange={() => setPaymentMethod('COD')} />
                    <div>
                      <strong style={{ fontSize: '14px' }}>Cash on Delivery (COD)</strong>
                      <div style={{ fontSize: '11px', color: 'var(--gray)' }}>Pay at your doorstep after delivery.</div>
                    </div>
                  </label>

                  <label style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', border: '1px solid var(--border)', borderRadius: '6px', cursor: 'pointer', background: paymentMethod === 'UPI' ? 'rgba(200, 16, 46, 0.03)' : '#fff', borderColor: paymentMethod === 'UPI' ? 'var(--primary)' : 'var(--border)' }}>
                    <input type="radio" checked={paymentMethod === 'UPI'} onChange={() => setPaymentMethod('UPI')} />
                    <div>
                      <strong style={{ fontSize: '14px' }}>UPI Transfer (QR Scan)</strong>
                      <div style={{ fontSize: '11px', color: 'var(--gray)' }}>Scan Google Pay/PhonePe QR code instantly.</div>
                    </div>
                  </label>

                  <label style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', border: '1px solid var(--border)', borderRadius: '6px', cursor: 'pointer', background: paymentMethod === 'CARD' ? 'rgba(200, 16, 46, 0.03)' : '#fff', borderColor: paymentMethod === 'CARD' ? 'var(--primary)' : 'var(--border)' }}>
                    <input type="radio" checked={paymentMethod === 'CARD'} onChange={() => setPaymentMethod('CARD')} />
                    <div>
                      <strong style={{ fontSize: '14px' }}>Credit / Debit Card</strong>
                      <div style={{ fontSize: '11px', color: 'var(--gray)' }}>Secure checkout via MasterCard, Visa, RuPay.</div>
                    </div>
                  </label>

                </div>

                {paymentMethod === 'CARD' && (
                  <div style={{ border: '1px solid var(--border)', padding: '15px', borderRadius: '6px', background: 'var(--light)', marginBottom: '2rem' }}>
                    <h4 style={{ fontSize: '12px', fontWeight: '600', marginBottom: '10px' }}>Enter Card Details:</h4>
                    <div className="form-group" style={{ marginBottom: '10px' }}>
                      <input 
                        type="text" 
                        placeholder="Card Number (e.g. 4111 2222 3333 4444)" 
                        value={cardDetails.number}
                        onChange={(e) => setCardDetails({ ...cardDetails, number: e.target.value })}
                        style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid var(--border)', fontSize: '13px' }}
                      />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                      <input 
                        type="text" 
                        placeholder="MM/YY" 
                        value={cardDetails.expiry}
                        onChange={(e) => setCardDetails({ ...cardDetails, expiry: e.target.value })}
                        style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid var(--border)', fontSize: '13px' }}
                      />
                      <input 
                        type="password" 
                        placeholder="CVV" 
                        maxLength="3"
                        value={cardDetails.cvv}
                        onChange={(e) => setCardDetails({ ...cardDetails, cvv: e.target.value })}
                        style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid var(--border)', fontSize: '13px' }}
                      />
                    </div>
                  </div>
                )}

                {paymentMethod === 'UPI' && (() => {
                  const subtotal = getCheckoutTotal();
                  const deliveryCost = subtotal >= 599 ? 0 : 50;
                  const finalTotal = subtotal + deliveryCost;
                  const upiToUse = 'sathya3772-2@okicici';
                  const upiName = encodeURIComponent('saivi collection');
                  const upiPayload = `upi://pay?pa=${upiToUse}&pn=${upiName}&am=${finalTotal}&cu=INR`;
                  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(upiPayload)}`;
                  return (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', padding: '20px', border: '1px solid var(--border)', borderRadius: '8px', background: 'var(--light)', marginBottom: '2rem', textAlign: 'center' }}>
                      <div style={{ fontSize: '14px', fontWeight: '700', color: 'var(--primary)' }}>Total Amount to Pay: ₹{finalTotal.toLocaleString('en-IN')}</div>
                      
                      <a 
                        href={upiPayload} 
                        className="btn btn-primary" 
                        onClick={() => {
                          setUpiVerified(true);
                          triggerToast("UPI App Launched! Please complete payment.");
                        }}
                        style={{ padding: '10px 16px', fontSize: '12px', borderRadius: '6px', textDecoration: 'none', fontWeight: '600', width: '100%', maxWidth: '280px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
                      >
                        📲 Pay via UPI App
                      </a>

                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', marginTop: '6px' }}>
                        <span style={{ fontSize: '10px', color: 'var(--gray)', textTransform: 'uppercase', letterSpacing: '1px' }}>— OR SCAN QR CODE —</span>
                        <div style={{ padding: '8px', background: '#fff', borderRadius: '8px', border: '1px solid #ccc', display: 'inline-flex' }}>
                          <img 
                            src={qrCodeUrl} 
                            alt="UPI QR Code" 
                            style={{ width: '150px', height: '150px', display: 'block' }}
                          />
                        </div>
                      </div>

                      <div style={{ width: '100%', marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <label style={{ display: 'block', fontSize: '11px', fontWeight: '600', color: 'var(--text-secondary)', textAlign: 'left' }}>
                          Enter 12-Digit UPI Ref / UTR Transaction ID:
                        </label>
                        <input 
                          type="text" 
                          placeholder="e.g. 302918273645"
                          maxLength="12"
                          value={upiTxnId}
                          onChange={(e) => {
                            const val = e.target.value.replace(/\D/g, ''); // only digits
                            setUpiTxnId(val);
                            setUpiVerified(val.length === 12);
                          }}
                          style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid var(--border-color)', fontSize: '13px', background: 'var(--bg-card)', color: 'var(--text-primary)' }}
                        />
                        {upiVerified ? (
                          <div style={{ color: 'var(--green)', fontSize: '11px', fontWeight: '600', textAlign: 'left' }}>
                            ✓ Transaction ID verified (12 digits)
                          </div>
                        ) : (
                          <div style={{ color: 'var(--text-muted)', fontSize: '10px', textAlign: 'left' }}>
                            Enter the 12-digit transaction number from your GPay/PhonePe transfer to confirm payment.
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })()}

                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2rem' }}>
                  <button type="button" className="btn btn-secondary" onClick={() => setCheckoutStep(1)}>⬅ Back to Address</button>
                  <button 
                    type="button" 
                    className="btn btn-primary" 
                    disabled={
                      (paymentMethod === 'CARD' && (!cardDetails.number || !cardDetails.expiry || !cardDetails.cvv)) ||
                      (paymentMethod === 'UPI' && !upiVerified)
                    }
                    onClick={() => setCheckoutStep(3)}
                    style={{ padding: '10px 20px', borderRadius: '4px' }}
                  >
                    Go to Final Review ➔
                  </button>
                </div>
              </div>
            )}

            {checkoutStep === 3 && (
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: '700', fontFamily: "'Playfair Display', serif", marginBottom: '1.25rem' }}>📝 Review & Confirm Order</h3>
                
                <div style={{ border: '1px solid var(--border)', padding: '15px', borderRadius: '8px', background: 'var(--light)', marginBottom: '1.5rem', fontSize: '13px' }}>
                  <div style={{ marginBottom: '8px' }}><strong>Deliver to:</strong> {customerName} ({phone})</div>
                  <div style={{ marginBottom: '8px', color: '#555' }}><strong>Address:</strong> {address}</div>
                  <div><strong>Payment Method:</strong> {paymentMethod === 'COD' ? "Cash on Delivery" : (paymentMethod === 'UPI' ? "UPI Mobile Transfer" : "Credit/Debit Card")}</div>
                  {paymentMethod === 'UPI' && upiTxnId && (
                    <div style={{ marginTop: '6px', color: 'var(--primary)', fontWeight: '600' }}>
                      🔗 UPI Transaction Ref: <code style={{ fontSize: '13px', background: 'rgba(0,0,0,0.05)', padding: '2px 6px', borderRadius: '4px' }}>{upiTxnId}</code>
                    </div>
                  )}
                  {paymentMethod === 'CARD' && cardDetails.number && (
                    <div style={{ marginTop: '6px', color: 'var(--primary)', fontWeight: '600' }}>
                      💳 Card Number: <code style={{ fontSize: '13px', background: 'rgba(0,0,0,0.05)', padding: '2px 6px', borderRadius: '4px' }}>**** **** **** {cardDetails.number.trim().slice(-4)}</code>
                    </div>
                  )}
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                  <strong style={{ fontSize: '12px', textTransform: 'uppercase', color: 'var(--gray)' }}>Your Checkout Items:</strong>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '8px' }}>
                    {checkoutItems.map(item => (
                      <div key={item.cartItemId} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                        <span>{item.name} ({item.size}/{item.color}) x{item.quantity}</span>
                        <strong>₹{(item.price * item.quantity).toLocaleString('en-IN')}</strong>
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{ borderTop: '1px solid var(--border)', paddingTop: '12px', fontSize: '13px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Subtotal:</span>
                    <span>₹{getCheckoutTotal().toLocaleString('en-IN')}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Delivery Charges:</span>
                    <span>{getCheckoutTotal() >= 599 ? <strong style={{ color: '#27ae60' }}>FREE</strong> : '₹50'}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '16px', fontWeight: '700', borderTop: '1px dashed var(--border)', paddingTop: '8px', marginTop: '4px', color: 'var(--primary)' }}>
                    <span>Final Amount:</span>
                    <span>₹{(getCheckoutTotal() >= 599 ? getCheckoutTotal() : getCheckoutTotal() + 50).toLocaleString('en-IN')}</span>
                  </div>
                </div>

                <div style={{ 
                  position: 'sticky', 
                  bottom: 0, 
                  background: 'var(--bg-card)', 
                  borderTop: '1px solid var(--border-color)', 
                  padding: '12px 0 0 0', 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  marginTop: '2rem',
                  zIndex: 99
                }}>
                  <button type="button" className="btn btn-secondary" onClick={() => setCheckoutStep(2)}>⬅ Back to Payment</button>
                  <button 
                    type="button" 
                    className="btn btn-primary" 
                    onClick={submitOrder}
                    style={{ padding: '12px 28px', borderRadius: '8px', background: '#27ae60', color: '#ffffff', border: '1px solid #27ae60', fontWeight: '700', cursor: 'pointer', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.5px', boxShadow: '0 4px 15px rgba(39, 174, 96, 0.35)' }}
                  >
                    PLACE ORDER NOW ➔
                  </button>
                </div>
              </div>
            )}

            {checkoutStep === 4 && (
              <div style={{ textAlign: 'center', padding: '1.5rem 0' }}>
                <div style={{ fontSize: '60px', marginBottom: '15px' }}>🎉</div>
                <h2 style={{ fontSize: '22px', fontWeight: '700', color: '#27ae60', fontFamily: "'Playfair Display', serif", marginBottom: '8px' }}>Congratulations!</h2>
                <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '15px' }}>Your Order Has Been Successfully Placed!</h3>
                
                <div style={{ border: '1px solid var(--border)', padding: '15px', borderRadius: '8px', background: 'var(--light)', maxWidth: '400px', margin: '0 auto 2rem auto', fontSize: '13px', textAlign: 'left' }}>
                  <div style={{ marginBottom: '6px' }}><strong>Order Number:</strong> <span style={{ color: 'var(--primary)', fontWeight: '600' }}>{checkoutOrderId}</span></div>
                  <div style={{ marginBottom: '6px' }}><strong>Shipped to:</strong> {customerName}</div>
                  <div style={{ marginBottom: '6px' }}><strong>Estimated Delivery:</strong> {new Date(Date.now() + 4 * 86400000).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })} (Approx. 4 days)</div>
                  <div><strong>Payment Mode:</strong> {paymentMethod === 'COD' ? "Cash on Delivery" : "Prepaid Secure Payment"}</div>
                </div>

                <p style={{ fontSize: '12px', color: 'var(--gray)', maxWidth: '450px', margin: '0 auto 2rem auto', lineHeight: '1.5' }}>
                  Your order has been registered in our system. You can view or cancel this order status anytime by clicking on your <strong>Account Details</strong>.
                </p>

                <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', marginTop: '1.5rem' }}>
                  <button 
                    type="button" 
                    className="btn btn-secondary" 
                    onClick={() => setIsCheckoutWizardOpen(false)}
                    style={{ padding: '12px 24px', borderRadius: '4px' }}
                  >
                    Continue Shopping
                  </button>
                  <button 
                    type="button" 
                    className="btn" 
                    onClick={handleConfirmOnWhatsApp}
                    style={{ padding: '12px 24px', borderRadius: '4px', background: '#25D366', color: '#fff', fontWeight: '700', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
                  >
                    Confirm on WhatsApp 💬
                  </button>
                </div>
              </div>
            )}

        </div>
      </div>
    )}

      {isTrackModalOpen && (
        <div className="modal-overlay" style={{ zIndex: 1002 }} onClick={() => setIsTrackModalOpen(false)}>
          <div className="modal-content glass" onClick={(e) => e.stopPropagation()} style={{ background: 'var(--surface)', color: 'var(--text-primary)', maxWidth: '500px', width: '90%', padding: '2rem', borderRadius: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid var(--border)', paddingBottom: '10px' }}>
              <h2 style={{ fontSize: '18px', fontWeight: '700', fontFamily: "'Playfair Display', serif", margin: 0 }}>🔍 Public Order Tracker</h2>
              <button onClick={() => setIsTrackModalOpen(false)} style={{ background: 'none', border: 'none', fontSize: '22px', cursor: 'pointer', color: 'var(--gray)' }}>✕</button>
            </div>

            <p style={{ fontSize: '12px', color: 'var(--gray)', marginBottom: '1.25rem', lineHeight: '1.5' }}>
              Enter your unique 6-digit Order ID (e.g. <code>ORD-123456</code>) to verify shipping progress and active tracking status.
            </p>

            <form onSubmit={handleTrackOrder} style={{ display: 'flex', gap: '10px', marginBottom: '1.5rem' }}>
              <input 
                type="text" 
                required
                placeholder="e.g. ORD-786118"
                value={trackOrderIdInput}
                onChange={(e) => setTrackOrderIdInput(e.target.value)}
                style={{ flex: 1, padding: '10px', border: '1.5px solid var(--border)', borderRadius: '4px', fontSize: '13px' }}
              />
              <button type="submit" className="btn btn-primary" style={{ padding: '10px 20px', borderRadius: '4px', fontWeight: '600' }}>
                Track
              </button>
            </form>

            {trackError && (
              <div style={{ padding: '10px', background: 'rgba(220,38,38,0.05)', border: '1px solid rgba(220,38,38,0.15)', borderRadius: '6px', color: '#dc2626', fontSize: '12px', marginBottom: '1rem', textAlign: 'center' }}>
                ⚠️ {trackError}
              </div>
            )}

            {trackedOrder && (
              <div style={{ border: '1px solid var(--border)', borderRadius: '8px', padding: '15px', background: 'var(--light)', animation: 'fadeIn 0.4s ease' }}>
                <div style={{ fontSize: '13px', marginBottom: '8px' }}>
                  <strong>Status:</strong> <span style={{ 
                    fontWeight: '700', 
                    color: 
                      trackedOrder.status === 'Delivered' ? 'var(--green)' :
                      (trackedOrder.status === 'Cancelled' ? '#dc2626' : 'var(--primary)')
                  }}>{trackedOrder.status}</span>
                </div>
                <div style={{ fontSize: '12px', color: 'var(--gray)', marginBottom: '8px' }}>
                  <strong>Deliver to:</strong> {trackedOrder.customerName}
                </div>
                <div style={{ fontSize: '12px', color: 'var(--gray)', marginBottom: '12px' }}>
                  <strong>Amount:</strong> ₹{trackedOrder.totalAmount.toLocaleString('en-IN')}
                </div>

                <div style={{ margin: '15px 0' }}>
                  {trackedOrder.status === 'Cancelled' ? (
                    <div style={{ color: '#dc2626', fontSize: '12px', fontWeight: '600' }}>
                      ❌ This order was cancelled.
                    </div>
                  ) : (
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative' }}>
                      <div style={{ position: 'absolute', top: '8px', left: '10%', right: '10%', height: '3px', background: '#ccc', zIndex: 1 }}>
                        <div style={{ 
                          height: '100%', 
                          background: 'var(--primary)', 
                          width: 
                            trackedOrder.status === 'Delivered' ? '100%' :
                            trackedOrder.status === 'Shipped' ? '66%' :
                            trackedOrder.status === 'Confirmed' || trackedOrder.status === 'Processing' ? '33%' : '0%'
                        }}></div>
                      </div>

                      {['Ordered', 'Confirmed', 'Shipped', 'Delivered'].map((step, stepIdx) => {
                        const isCompleted = 
                          (step === 'Ordered') ||
                          (step === 'Confirmed' && (trackedOrder.status === 'Confirmed' || trackedOrder.status === 'Processing' || trackedOrder.status === 'Shipped' || trackedOrder.status === 'Delivered')) ||
                          (step === 'Shipped' && (trackedOrder.status === 'Shipped' || trackedOrder.status === 'Delivered')) ||
                          (step === 'Delivered' && (trackedOrder.status === 'Delivered'));

                        return (
                          <div key={step} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 2, position: 'relative', width: '20%' }}>
                            <div style={{ 
                              width: '18px', 
                              height: '18px', 
                              borderRadius: '50%', 
                              background: isCompleted ? 'var(--primary)' : '#fff', 
                              border: isCompleted ? '2px solid var(--primary)' : '2px solid #ccc', 
                              display: 'flex', 
                              justifyContent: 'center', 
                              alignItems: 'center',
                              color: isCompleted ? '#fff' : '#ccc',
                              fontSize: '9px',
                              fontWeight: '700'
                            }}>
                              {isCompleted ? '✓' : stepIdx + 1}
                            </div>
                            <span style={{ fontSize: '9px', fontWeight: '600', marginTop: '4px', color: isCompleted ? 'var(--black)' : 'var(--gray)' }}>{step}</span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {trackedOrder.status === 'Pending' && (
                  <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
                    <button 
                      className="btn btn-danger" 
                      onClick={() => { handleCancelOrder(trackedOrder.id); setIsTrackModalOpen(false); }}
                      style={{ padding: '5px 10px', fontSize: '11px', borderRadius: '4px' }}
                    >
                      Cancel Order
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
}

// Reusable Product Card Component
function ProductCard({ product, hoverImage, onOpen, onAddCart, onWishlist, isWishlisted, onBuyNow }) {
  const discount = product.oldPrice ? Math.round((1 - product.price / product.oldPrice) * 100) : 0;
  const hash = product.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const rating = 4.0 + (hash % 11) / 10;
  const reviewsCount = (hash % 150) + 12;
  const stars = Math.round(rating);

  return (
    <div className="premium-product-card">
      {/* Image container */}
      <div className="ppc-img-container">
        {/* Discount Badge */}
        {discount > 0 && <span className="ppc-discount-badge">{discount}% OFF</span>}
        {product.badge === 'new' && <span className="ppc-new-badge">NEW</span>}

        {/* Wishlist Icon */}
        <button 
          className={`ppc-wishlist-btn ${isWishlisted ? 'active' : ''}`}
          onClick={(e) => {
            e.stopPropagation();
            onWishlist();
          }}
          aria-label="Add to wishlist"
        >
          {isWishlisted ? '❤️' : '♡'}
        </button>

        {/* Images */}
        <div className="ppc-image-wrapper" onClick={onOpen}>
          <img 
            src={product.image} 
            alt={product.name} 
            className="ppc-img primary-img" 
            loading="lazy" 
            onError={(e) => {
              e.target.src = 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=300&q=80';
            }}
          />
          <img 
            src={hoverImage} 
            alt={product.name} 
            className="ppc-img hover-img" 
            loading="lazy" 
            onError={(e) => {
              e.target.src = product.image;
            }}
          />
          {/* Quick View Overlay Button */}
          <div className="ppc-quick-view-overlay">
            <span className="quick-view-text">Quick View</span>
          </div>
        </div>
      </div>

      {/* Info container */}
      <div className="ppc-info" onClick={onOpen}>
        <div className="ppc-category">{product.category}</div>
        <h3 className="ppc-name">{product.name}</h3>
        
        {/* Rating Row */}
        <div className="ppc-rating-row">
          <div className="ppc-stars">
            {Array.from({ length: 5 }).map((_, i) => (
              <span key={i} className={i < stars ? "star-filled" : "star-empty"}>★</span>
            ))}
          </div>
          <span className="ppc-reviews">({reviewsCount})</span>
        </div>

        {/* Price Row */}
        <div className="ppc-price-row">
          <span className="ppc-current-price">₹{product.price.toLocaleString('en-IN')}</span>
          {product.oldPrice && (
            <>
              <span className="ppc-old-price">₹{product.oldPrice.toLocaleString('en-IN')}</span>
              <span className="ppc-discount-pct">({discount}% off)</span>
            </>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="ppc-actions">
        <button 
          className="ppc-add-to-cart-btn" 
          onClick={(e) => {
            e.stopPropagation();
            onAddCart();
          }}
        >
          Add to Cart
        </button>
        <button 
          className="ppc-buy-now-btn" 
          onClick={(e) => {
            e.stopPropagation();
            if (onBuyNow) {
              onBuyNow();
            } else {
              onAddCart();
            }
          }}
        >
          Buy Now
        </button>
      </div>
    </div>
  );
}

export default App;
