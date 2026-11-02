/* Qudratik Herbal - shared data layer (seed + localStorage) */
(function () {
  /* Images are bundled locally in images/ (downloaded from Unsplash, unbranded) so the store never depends on a hotlink. */
  var LOCAL = {
    "1515823064-d6e0c04616a7": "images/moringa.jpg",
    "1615485500834-bc10199bc727": "images/ashwagandha.jpg",
    "1615485290382-441e4d049cb5": "images/turmeric.jpg",
    "1474979266404-7eaacbcd87c5": "images/oil-bottle.jpg",
    "1528750717929-32abb73d3bd9": "images/coconut-oil.jpg",
    "1506368249639-73a05d6f6488": "images/seeds.jpg",
    "1587049352846-4a222e784d38": "images/honey.jpg",
    "1558642452-9d2a7deb7f62": "images/honeycomb.jpg",
    "1556228453-efd6c1ff04f6": "images/aloe.jpg",
    "1570172619644-dfd03ed5d881": "images/face-cream.jpg",
    "1600857544200-b2f666a9a2ec": "images/soap.jpg",
    "1544787219-7f47ccb76574": "images/tea.jpg",
    "1471864190281-a93a3070b6de": "images/capsules.jpg",
    "1564890369478-c89ca6d9cde9": "images/qehwa.jpg",
    "1596591606975-97ee5cef3a1e": "images/dates.jpg",
    "1466692476868-aef1dfb1e735": "images/cat-herbs.jpg",
    "1508747703725-719777637510": "images/cat-seeds.jpg"
  };
  var U = function (id) { return LOCAL[id] || ("https://images.unsplash.com/photo-" + id + "?w=800&q=80&auto=format&fit=crop"); };

  var CATEGORIES = [
    "Herbs & Powders",
    "Herbal Oils",
    "Seeds & Grains",
    "Honey & Naturals",
    "Skin & Hair Care",
    "Wellness & Health",
    "Dates & Dry Fruits"
  ];

  var CAT_IMAGES = {
    "Herbs & Powders": U("1466692476868-aef1dfb1e735"),
    "Herbal Oils": U("1474979266404-7eaacbcd87c5"),
    "Seeds & Grains": U("1508747703725-719777637510"),
    "Honey & Naturals": U("1587049352846-4a222e784d38"),
    "Skin & Hair Care": "images/aloe-gel.png",
    "Wellness & Health": U("1544787219-7f47ccb76574"),
    "Dates & Dry Fruits": U("1596591606975-97ee5cef3a1e")
  };

  var P = 999; /* PLACEHOLDER price for every product. Client price list is awaited. Change from Admin > Products. */

  var SEED_PRODUCTS = [
    { id: "moringa-powder", name: "Moringa Powder", category: "Herbs & Powders", price: P, featured: true, hero: true, img: U("1515823064-d6e0c04616a7"), desc: "Finely ground moringa leaf powder with a fresh, earthy taste. Easy to mix into drinks, smoothies and everyday meals." },
    { id: "ashwagandha-powder", name: "Ashwagandha Powder", category: "Herbs & Powders", price: P, featured: true, hero: true, img: U("1615485500834-bc10199bc727"), desc: "Pure ashwagandha root powder, carefully dried and ground. A traditional herb powder for your daily routine." },
    { id: "turmeric-powder", name: "Turmeric Powder", category: "Herbs & Powders", price: P, featured: true, img: U("1615485290382-441e4d049cb5"), desc: "Bright, aromatic turmeric powder with a rich natural colour. A kitchen essential for cooking and warm drinks." },
    { id: "black-seed-oil", name: "Black Seed Oil", category: "Herbal Oils", price: P, featured: true, hero: true, img: U("1474979266404-7eaacbcd87c5"), desc: "Cold pressed black seed oil in a dark glass bottle to protect its quality. Strong, natural taste, a few drops at a time." },
    { id: "coconut-oil", name: "Coconut Oil", category: "Herbal Oils", price: P, featured: false, img: U("1528750717929-32abb73d3bd9"), desc: "Pure coconut oil for cooking, hair and skin care. Light texture with a mild, natural coconut aroma." },
    { id: "almond-oil", name: "Almond Oil", category: "Herbal Oils", price: P, featured: false, img: U("1474979266404-7eaacbcd87c5"), desc: "Cold pressed sweet almond oil, light and quick to absorb. Popular for skin and hair care routines." },
    { id: "chia-seeds", name: "Chia Seeds", category: "Seeds & Grains", price: P, featured: true, hero: true, img: "images/chia.jpg", desc: "Clean, whole chia seeds that soak up quickly in water and drinks. Simple to add to breakfasts and desserts." },
    { id: "pumpkin-seeds", name: "Pumpkin Seeds", category: "Seeds & Grains", price: P, featured: false, img: U("1506368249639-73a05d6f6488"), desc: "Crunchy, natural pumpkin seeds, ready to snack on or sprinkle over salads and meals." },
    { id: "flax-seeds", name: "Flax Seeds", category: "Seeds & Grains", price: P, featured: false, img: U("1506368249639-73a05d6f6488"), desc: "Whole flax seeds with a mild, nutty flavour. Grind fresh or add to drinks, baking and breakfast bowls." },
    { id: "pure-honey", name: "Pure Honey", category: "Honey & Naturals", price: P, featured: true, hero: true, img: U("1587049352846-4a222e784d38"), desc: "Natural, raw honey with a smooth golden pour. A simple everyday sweetener for tea, drinks and food." },
    { id: "wild-honey", name: "Wild Honey", category: "Honey & Naturals", price: P, featured: false, img: U("1558642452-9d2a7deb7f62"), desc: "Rich wild honey with a deep, floral taste. Collected and packed with care, nothing added." },
    { id: "organic-honeycomb", name: "Organic Honeycomb", category: "Honey & Naturals", price: P, featured: false, img: U("1558642452-9d2a7deb7f62"), desc: "Natural honeycomb pieces, just as they come from the hive. Enjoy with breakfast, cheese or on its own." },
    { id: "aloe-vera-gel", name: "Aloe Vera Gel", category: "Skin & Hair Care", price: P, featured: true, img: "images/aloe-gel.png", desc: "Light, clear aloe vera gel for everyday skin and hair care. Absorbs quickly and leaves no sticky feel." },
    { id: "herbal-face-cream", name: "Herbal Face Cream", category: "Skin & Hair Care", price: P, featured: false, img: U("1570172619644-dfd03ed5d881"), desc: "A soft, everyday face cream made with herbal extracts. Smooth texture for morning and night use." },
    { id: "neem-soap", name: "Neem Soap", category: "Skin & Hair Care", price: P, featured: false, img: U("1600857544200-b2f666a9a2ec"), desc: "Handmade style neem soap bar for daily washing. Gentle lather with a fresh, herbal scent." },
    { id: "herbal-green-tea", name: "Herbal Green Tea", category: "Wellness & Health", price: P, featured: false, img: U("1544787219-7f47ccb76574"), desc: "Loose herbal green tea leaves with a clean, light brew. A calm, natural drink for any time of day." },
    { id: "ashwagandha-capsules", name: "Ashwagandha Capsules", category: "Wellness & Health", price: P, featured: false, img: U("1471864190281-a93a3070b6de"), desc: "Ashwagandha root extract in easy daily capsules. A simple way to add this traditional herb to your routine." },
    { id: "desi-herbal-qehwa", name: "Desi Herbal Qehwa", category: "Wellness & Health", price: P, featured: false, img: U("1564890369478-c89ca6d9cde9"), desc: "A traditional style herbal qehwa blend with green tea and whole spices. Warm, aromatic and easy to brew." },
    { id: "ajwa-dates", name: "Ajwa Dates", category: "Dates & Dry Fruits", price: P, featured: true, img: U("1596591606975-97ee5cef3a1e"), desc: "Soft, dark Ajwa dates with a rich natural sweetness. Carefully selected and packed for freshness." },
    { id: "medjool-dates", name: "Medjool Dates", category: "Dates & Dry Fruits", price: P, featured: false, img: U("1596591606975-97ee5cef3a1e"), desc: "Large, soft Medjool dates with a caramel like taste. A natural sweet snack, straight from the pack." },
    { id: "sukkari-dates", name: "Sukkari Dates", category: "Dates & Dry Fruits", price: P, featured: false, img: U("1596591606975-97ee5cef3a1e"), desc: "Golden Sukkari dates, sweet and slightly crisp. Popular with tea and for everyday snacking." }
  ];

  var DEFAULT_SETTINGS = {
    phone: "+92 340 7838582",
    whatsapp: "923407838582",
    freeShipThreshold: 3000,
    shippingFee: 250,
    announcement: "Free Shipping on Orders Above Rs. 3,000"
  };

  function load(key, fallback) {
    try {
      var raw = localStorage.getItem(key);
      if (raw === null || raw === undefined) return JSON.parse(JSON.stringify(fallback));
      return JSON.parse(raw);
    } catch (e) { return JSON.parse(JSON.stringify(fallback)); }
  }
  function save(key, val) { try { localStorage.setItem(key, JSON.stringify(val)); } catch (e) {} }

  function getProducts() {
    var p = load("qh_products_v1", null);
    if (!Array.isArray(p) || !p.length) { p = SEED_PRODUCTS.slice(); save("qh_products_v1", p); }
    return p;
  }
  function setProducts(p) { save("qh_products_v1", p); }
  function getSettings() {
    var s = load("qh_settings_v1", null);
    if (!s || typeof s !== "object") { s = Object.assign({}, DEFAULT_SETTINGS); save("qh_settings_v1", s); }
    return Object.assign({}, DEFAULT_SETTINGS, s);
  }
  function setSettings(s) { save("qh_settings_v1", s); }
  function getOrders() { var o = load("qh_orders_v1", []); return Array.isArray(o) ? o : []; }
  function setOrders(o) { save("qh_orders_v1", o); }
  function getCart() { var c = load("qh_cart", []); return Array.isArray(c) ? c : []; }
  function setCart(c) { save("qh_cart", c); }
  function getWishlist() { var w = load("qh_wishlist", []); return Array.isArray(w) ? w : []; }
  function setWishlist(w) { save("qh_wishlist", w); }

  window.QH = {
    CATEGORIES: CATEGORIES,
    CAT_IMAGES: CAT_IMAGES,
    SEED_PRODUCTS: SEED_PRODUCTS,
    DEFAULT_SETTINGS: DEFAULT_SETTINGS,
    getProducts: getProducts, setProducts: setProducts,
    getSettings: getSettings, setSettings: setSettings,
    getOrders: getOrders, setOrders: setOrders,
    getCart: getCart, setCart: setCart,
    getWishlist: getWishlist, setWishlist: setWishlist,
    money: function (n) { return "Rs " + Number(n || 0).toLocaleString("en-PK"); }
  };
})();
