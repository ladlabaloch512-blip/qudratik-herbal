/* Qudratik Herbal - storefront app */
(function () {
  var app = document.getElementById("app");
  var settings = QH.getSettings();

  var ICONS = {
    leaf: '<svg viewBox="0 0 24 24" fill="none" stroke="#2e7d32" stroke-width="1.7"><path d="M12 21c-4-3.5-6-7-6-11a6 6 0 0 1 12 0c0 4-2 7.5-6 11z"/><path d="M12 21V9"/></svg>',
    flask: '<svg viewBox="0 0 24 24" fill="none" stroke="#2e7d32" stroke-width="1.7"><path d="M10 3h4M11 3v5l-4.5 8.5A2.4 2.4 0 0 0 8.6 20h6.8a2.4 2.4 0 0 0 2.1-3.5L13 8V3"/></svg>',
    shield: '<svg viewBox="0 0 24 24" fill="none" stroke="#2e7d32" stroke-width="1.7"><path d="M12 3l7 3v5c0 5-3 8-7 10-4-2-7-5-7-10V6z"/><path d="M9 12l2 2 4-4"/></svg>',
    sprout: '<svg viewBox="0 0 24 24" fill="none" stroke="#2e7d32" stroke-width="1.7"><path d="M12 21v-8"/><path d="M12 13c0-3-2.5-5-6-5 0 3.5 2.5 5 6 5zM12 10c0-3 2.5-5 6-5 0 3.5-2.5 5-6 5z"/></svg>',
    truck: '<svg viewBox="0 0 24 24" fill="none" stroke="#2e7d32" stroke-width="1.7"><path d="M3 7h11v8H3zM14 10h4l3 3v2h-7z"/><circle cx="7" cy="17.5" r="1.8"/><circle cx="17" cy="17.5" r="1.8"/></svg>',
    box: '<svg viewBox="0 0 24 24" fill="none" stroke="#2e7d32" stroke-width="1.7"><path d="M3 8l9-5 9 5v8l-9 5-9-5z"/><path d="M3 8l9 5 9-5M12 13v8"/></svg>',
    headset: '<svg viewBox="0 0 24 24" fill="none" stroke="#2e7d32" stroke-width="1.7"><path d="M4 13a8 8 0 0 1 16 0"/><rect x="3" y="13" width="4" height="6" rx="2"/><rect x="17" y="13" width="4" height="6" rx="2"/><path d="M19 19a4 4 0 0 1-4 3h-2"/></svg>',
    ret: '<svg viewBox="0 0 24 24" fill="none" stroke="#2e7d32" stroke-width="1.7"><path d="M4 9a8 8 0 0 1 14-3l2 2M20 15a8 8 0 0 1-14 3l-2-2"/><path d="M20 3v5h-5M4 21v-5h5"/></svg>',
    heart: '<svg viewBox="0 0 24 24"><path d="M12 20.5C7 16.5 3.5 13.3 3.5 9.6A4.6 4.6 0 0 1 12 7a4.6 4.6 0 0 1 8.5 2.6c0 3.7-3.5 6.9-8.5 10.9z" fill="none" stroke="#2e7d32" stroke-width="1.8"/></svg>',
    wa: '<svg viewBox="0 0 24 24"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm5.2 14.2c-.2.6-1.3 1.2-1.8 1.2-.5.1-1 .2-3.4-.7-2.9-1.2-4.7-4.1-4.9-4.3-.1-.2-1.1-1.5-1.1-2.9s.7-2 1-2.3c.2-.3.5-.3.7-.3h.5c.2 0 .4 0 .6.5l.9 2.1c.1.2.1.4 0 .6l-.4.6-.4.5c-.1.1-.3.3-.1.6.2.3.8 1.4 1.8 2.2 1.2 1.1 2.3 1.5 2.6 1.6.3.1.5.1.7-.1l1-1.2c.2-.3.4-.2.7-.1l2.1 1c.3.2.5.3.6.4 0 .1 0 .7-.2 1.2z" fill="#fff"/></svg>'
  };

  function products() { return QH.getProducts(); }
  function byId(id) { var p = products(); for (var i = 0; i < p.length; i++) if (p[i].id === id) return p[i]; return null; }
  function toast(msg) {
    var t = document.getElementById("toast"); t.textContent = msg; t.hidden = false;
    setTimeout(function () { t.hidden = true; }, 2200);
  }
  function refreshBadges() {
    var c = QH.getCart().reduce(function (s, i) { return s + i.qty; }, 0);
    document.getElementById("cart-count").textContent = c;
    document.getElementById("wish-count").textContent = QH.getWishlist().length;
  }
  function applySettings() {
    settings = QH.getSettings();
    document.getElementById("announce-text").textContent = settings.announcement;
    document.getElementById("top-phone-text").textContent = settings.phone;
    document.getElementById("top-phone").href = "tel:+" + settings.whatsapp;
    document.getElementById("top-wa").href = "https://wa.me/" + settings.whatsapp;
    document.getElementById("wa-float").href = "https://wa.me/" + settings.whatsapp;
    var fp = document.getElementById("footer-phone");
    fp.textContent = settings.phone; fp.href = "https://wa.me/" + settings.whatsapp;
    var dp = document.getElementById("drawer-phone-text");
    if (dp) dp.textContent = settings.phone;
    var dw = document.getElementById("drawer-wa");
    if (dw) dw.href = "https://wa.me/" + settings.whatsapp;
  }
  var lastAddedId = null;
  function addToCart(id, qty, sourceImg) {
    var cart = QH.getCart(); var found = null;
    cart.forEach(function (i) { if (i.id === id) found = i; });
    if (found) found.qty += qty; else cart.push({ id: id, qty: qty });
    QH.setCart(cart); refreshBadges(); lastAddedId = id;
    if (sourceImg) flyToCart(sourceImg); else popBadge();
    toast("Added to cart");
  }
  /* Fly-to-cart (Noor style): product image ~700ms quadratic-bezier arc me header cart tak,
     phir badge pop. ROUND 4: reduced-motion par bhi fly chalta hai (Ibrar ki demand). */
  function popBadge() {
    var b = document.getElementById("cart-count");
    if (!b) return;
    b.classList.remove("pop"); void b.offsetWidth; b.classList.add("pop");
    setTimeout(function () { b.classList.remove("pop"); }, 600);
  }
  function flyToCart(img) {
    var target = document.querySelector('.hact[href="#/cart"]');
    if (!target || !img || !img.getBoundingClientRect) { popBadge(); return; }
    try {
      var r1 = img.getBoundingClientRect(), r2 = target.getBoundingClientRect();
      if (!r1.width || !r2.width) { popBadge(); return; }
      var sx = r1.left + r1.width / 2, sy = r1.top + r1.height / 2;
      var ex = r2.left + r2.width / 2, ey = r2.top + r2.height / 2;
      var cx = (sx + ex) / 2, cy = Math.min(sy, ey) - 130;
      var clone = img.cloneNode();
      clone.classList.add("fly-img");
      clone.style.left = r1.left + "px"; clone.style.top = r1.top + "px";
      clone.style.width = r1.width + "px"; clone.style.height = r1.height + "px";
      document.body.appendChild(clone);
      var frames = [], N = 22;
      for (var i = 0; i <= N; i++) {
        var t = i / N, u = 1 - t;
        var x = u * u * sx + 2 * u * t * cx + t * t * ex - sx;
        var y = u * u * sy + 2 * u * t * cy + t * t * ey - sy;
        var s = 1 - 0.88 * t;
        frames.push({ transform: "translate(" + x.toFixed(1) + "px," + y.toFixed(1) + "px) scale(" + s.toFixed(3) + ")", opacity: t > 0.75 ? String(1 - (t - 0.75) * 2.4) : "1" });
      }
      var anim = clone.animate(frames, { duration: 700, easing: "ease-in-out", fill: "forwards" });
      var done = function () { if (clone.parentNode) clone.parentNode.removeChild(clone); popBadge(); };
      if (anim && anim.finished) anim.finished.then(done).catch(done); else setTimeout(done, 730);
    } catch (e) { popBadge(); }
  }
  /* Chhota particle burst (wishlist heart + success leaves ke liye shared helper) */
  function spawnBurst(host, count, colors, sizePx, distMin, distMax, dur) {
    if (!host) return;
    try {
      for (var i = 0; i < count; i++) {
        var s = document.createElement("span");
        s.className = "burst-p";
        var sz = sizePx * (0.7 + Math.random() * 0.7);
        s.style.width = sz + "px"; s.style.height = sz + "px";
        s.style.background = colors[i % colors.length];
        host.appendChild(s);
        var ang = (Math.PI * 2 * i) / count + Math.random() * 0.5;
        var dist = distMin + Math.random() * (distMax - distMin);
        var dx = Math.cos(ang) * dist, dy = Math.sin(ang) * dist - 8;
        var a = s.animate([
          { transform: "translate(0,0) rotate(0deg)", opacity: "1" },
          { transform: "translate(" + dx.toFixed(0) + "px," + dy.toFixed(0) + "px) rotate(" + (120 + Math.random() * 160).toFixed(0) + "deg)", opacity: "0" }
        ], { duration: dur, easing: "cubic-bezier(.17,.67,.35,1)" });
        (function (node, anim) {
          var rm = function () { if (node.parentNode) node.parentNode.removeChild(node); };
          if (anim && anim.finished) anim.finished.then(rm).catch(rm); else setTimeout(rm, dur + 60);
        })(s, a);
      }
    } catch (e) {}
  }
  function toggleWish(id, btn) {
    var w = QH.getWishlist(); var ix = w.indexOf(id);
    if (ix >= 0) { w.splice(ix, 1); toast("Removed from wishlist"); } else { w.push(id); toast("Added to wishlist"); }
    QH.setWishlist(w); refreshBadges();
    if (btn) {
      btn.classList.toggle("on", ix < 0);
      btn.classList.remove("pop"); void btn.offsetWidth; btn.classList.add("pop");
      setTimeout(function () { btn.classList.remove("pop"); }, 500);
      if (ix < 0) spawnBurst(btn, 6, ["#43a047", "#c9a227", "#81c784"], 7, 20, 38, 620);
    }
  }
  function inWish(id) { return QH.getWishlist().indexOf(id) >= 0; }
  function shipFor(subtotal) { return subtotal >= settings.freeShipThreshold || subtotal === 0 ? 0 : settings.shippingFee; }

  /* ---------- REVEAL ANIMATIONS - ROUND 5 (Noor Wave Cascade, scroll-triggered) ----------
     Ibrar ki demand (round 5): cards PEHLE hidden hon, aur JAISE JAISE SCROLL DOWN ho
     waise waise har card reveal ho. Round 3/4 ka 1.8s failsafe + 2s sweep below-fold
     cards ko bhi 2s me khol deta tha, is liye scroll tak kuch hidden nahi rehta tha.
     Ab: viewport ke andar wale load par stagger se reveal, below-fold HIDDEN rehte
     hain jab tak viewport ke qareeb na ayen (IO threshold 0.1, rootMargin +10%
     pre-trigger). Reveal wahi rvIn bounce (cubic-bezier(.34,1.56,.64,1), .68s) +
     row ke andar ~110ms stagger.
     SAFETY (scroll behavior ko mare baghair): dual trigger - IO ke sath scroll/resize
     listener bhi har unrevealed element ki position check karta hai; jiska top
     viewport bottom se upar agaya ho (user use cross kar chuka ho, fast scroll ya
     anchor jump ki surat me bhi) wo reveal ho jata hai, koi card peeche hidden
     nahi rehta. IO available hi na ho to sab foran visible (kuch hide nahi hota).
     Koi timed force-reveal NAHI hai.
     ROUND 4 barqarar: prefers-reduced-motion par koi gate nahi, animations chalti hain.
     .rv-now elements (PDP main block, cart/checkout/success, page headings) view
     khulte hi foran reveal hote hain, scroll reveal par NAHI. */
  var rvIO = null;
  function doReveal(el) {
    if (el.classList.contains("rv-shown")) return;
    el.classList.add("rv-shown");
    if (rvIO) rvIO.unobserve(el);
    var d = parseInt(el.getAttribute("data-rv-delay") || "0", 10) || 0;
    el.style.animationDelay = d + "ms";
    el.classList.remove("rv-hidden");
    el.classList.add("rv-anim");
    setTimeout(function () { el.classList.remove("rv-anim"); el.style.animationDelay = ""; }, 760 + d);
  }
  function ensureRvIO() {
    if (rvIO || !("IntersectionObserver" in window)) return rvIO;
    rvIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) doReveal(en.target); });
    }, { rootMargin: "0px 0px 10% 0px", threshold: 0.1 });
    return rvIO;
  }
  /* Dual trigger (safety): scroll/resize par unrevealed elements ki position check.
     Jiska top viewport bottom se upar agaya ho use reveal kar do, taake fast scroll,
     anchor jump ya IO miss ki surat me koi card peeche hidden na reh jaye. Neeche
     wale elements ko ye kabhi nahi kholta, is liye scroll reveal barqarar rehta hai. */
  var rvScrollBound = false, rvTicking = false;
  function rvScrollCheck() {
    rvTicking = false;
    var vh = window.innerHeight || document.documentElement.clientHeight;
    document.querySelectorAll(".rv-hidden").forEach(function (el) {
      var r = el.getBoundingClientRect();
      if (r.top < vh) doReveal(el);
    });
  }
  function bindRvScroll() {
    if (rvScrollBound) return;
    rvScrollBound = true;
    function onScroll() {
      if (rvTicking) return;
      rvTicking = true;
      requestAnimationFrame(rvScrollCheck);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
  }
  function initReveal(scope) {
    var els = Array.prototype.slice.call((scope || document).querySelectorAll(".rv:not(.rv-armed)"));
    if (!els.length) return;
    if (!("IntersectionObserver" in window)) {
      els.forEach(function (el) { el.classList.add("rv-armed", "rv-shown"); });
      return;
    }
    ensureRvIO();
    /* sibling stagger: har parent ke andar .rv bachon ka apna index (row-wise wave) */
    var perParent = {};
    els.forEach(function (el) {
      el.classList.add("rv-armed");
      var key = el.parentNode ? (el.parentNode.className || "p") + "_" + (el.parentNode.id || "") : "root";
      perParent[key] = (perParent[key] || 0) + 1;
      var sibIx = perParent[key] - 1;
      el.setAttribute("data-rv-delay", String(Math.min(sibIx * 110, 660)));
      el.classList.add("rv-hidden");
      /* Round 5: koi timed failsafe NAHI. Below-fold hidden rahe ga jab tak
         IO ya scroll-check use viewport ke qareeb na le aye. */
      if (el.classList.contains("rv-now")) {
        requestAnimationFrame(function () { requestAnimationFrame(function () { doReveal(el); }); });
      } else {
        rvIO.observe(el);
      }
    });
    bindRvScroll();
    /* jo elements pehle se viewport me hain wo IO ke sath sath scroll-check se bhi
       foran (stagger ke sath) reveal hon */
    requestAnimationFrame(function () { requestAnimationFrame(rvScrollCheck); });
  }

  function cardHTML(p) {
    return '<article class="card rv">' +
      '<div class="card-img" data-open="' + p.id + '"><img src="' + p.img + '" alt="' + p.name + '" loading="lazy">' +
      '<button class="heart' + (inWish(p.id) ? " on" : "") + '" data-wish="' + p.id + '" aria-label="Toggle wishlist">' + ICONS.heart + '</button></div>' +
      '<div class="card-body"><span class="card-cat">' + p.category + '</span>' +
      '<span class="card-name" data-open="' + p.id + '">' + p.name + '</span>' +
      '<span class="card-price">' + QH.money(p.price) + '</span>' +
      '<div class="card-actions"><button class="btn small" data-add="' + p.id + '">Add to Cart</button>' +
      '<a class="wa-mini" target="_blank" rel="noopener" href="https://wa.me/' + settings.whatsapp + '?text=' + encodeURIComponent("Assalam-o-Alaikum, I want to order: " + p.name + " (" + QH.money(p.price) + ")") + '" aria-label="Order on WhatsApp">' + ICONS.wa + '</a></div>' +
      '</div></article>';
  }
  function bindCards(root) {
    root.querySelectorAll("[data-open]").forEach(function (el) {
      el.addEventListener("click", function (e) { if (e.target.closest("[data-wish]")) return; location.hash = "#/product/" + el.getAttribute("data-open"); });
    });
    root.querySelectorAll("[data-add]").forEach(function (el) {
      el.addEventListener("click", function () {
        var card = el.closest(".card");
        var img = card ? card.querySelector(".card-img img") : null;
        addToCart(el.getAttribute("data-add"), 1, img);
      });
    });
    root.querySelectorAll("[data-wish]").forEach(function (el) {
      el.addEventListener("click", function (e) { e.stopPropagation(); toggleWish(el.getAttribute("data-wish"), el); });
    });
  }

  /* ---------- HOME ---------- */
  var slideIx = 0, slideTimer = null;
  /* Hero: har slide par EK single unbranded image. Text har slide par constant hai. */
  var HERO_SLIDES = [
    { img: "images/honey.jpg", alt: "Pure Honey" },
    { img: "images/moringa.jpg", alt: "Moringa Powder" },
    { img: "images/oil-bottle.jpg", alt: "Black Seed Oil" }
  ];
  function viewHome() {
    var feat = products().filter(function (p) { return p.featured; });
    var heroImgs = HERO_SLIDES.map(function (s, i) {
      return '<img class="hero-img' + (i === 0 ? " on" : "") + '" src="' + s.img + '" alt="' + s.alt + '"' + (i === 0 ? "" : ' loading="lazy"') + '>';
    }).join("");

    var LEAF = '<svg viewBox="0 0 24 24" fill="#2e7d32"><path d="M12 22c-4.5-4-7-8.5-7-13a7 7 0 0 1 14 0c0 4.5-2.5 9-7 13z"/><path d="M12 22V10" stroke="#e9f1de" stroke-width="1.2" fill="none"/></svg>';
    var heroLeaves = '<div class="hero-leaves" aria-hidden="true">' +
      '<span class="hleaf" style="left:4%;top:16%;width:34px;animation-duration:12s">' + LEAF + '</span>' +
      '<span class="hleaf" style="left:44%;top:8%;width:24px;animation-duration:10s;animation-delay:-3s;opacity:.2">' + LEAF + '</span>' +
      '<span class="hleaf" style="left:58%;top:64%;width:40px;animation-duration:14s;animation-delay:-6s;opacity:.16">' + LEAF + '</span>' +
      '<span class="hleaf" style="left:88%;top:12%;width:28px;animation-duration:11s;animation-delay:-2s;opacity:.22">' + LEAF + '</span>' +
      '<span class="hleaf" style="left:26%;top:70%;width:22px;animation-duration:9s;animation-delay:-5s;opacity:.18">' + LEAF + '</span>' +
      '<span class="hleaf" style="left:76%;top:78%;width:26px;animation-duration:13s;animation-delay:-8s;opacity:.2">' + LEAF + '</span>' +
      '</div>';

    app.innerHTML =
      '<section class="hero">' + heroLeaves + '<button class="hero-arrow prev" id="h-prev" aria-label="Previous slide">&lsaquo;</button>' +
      '<div class="wrap hero-grid">' +
      '<div class="hero-text">' +
        '<div class="hero-eyebrow">Pure &bull; Natural &bull; Effective</div>' +
        '<h1>Qudratik Herbal</h1><div class="hero-sub">Premium Herbal &amp; Natural Products</div>' +
        '<p class="lead">Herbs, Oils, Seeds, Honey, and Wellness Essentials, all in one place for a healthier, more natural lifestyle.</p>' +
        '<div class="hero-trust">' +
        '<div>' + ICONS.leaf + '<span>100%<br>Natural</span></div>' +
        '<div>' + ICONS.flask + '<span>No Harmful<br>Chemicals</span></div>' +
        '<div>' + ICONS.shield + '<span>Lab<br>Tested</span></div>' +
        '<div>' + ICONS.sprout + '<span>Trusted<br>Quality</span></div></div>' +
        '<a class="btn" href="#/shop">Shop Now <span aria-hidden="true">&rarr;</span></a></div>' +
      '<div class="hero-visual"><div class="hero-slider" id="hero-slider">' + heroImgs + '</div>' +
      '<div class="hero-badge"><span>100%</span><span>NATURAL</span><small>PRODUCTS</small></div></div>' +
      '</div>' +
      '<button class="hero-arrow next" id="h-next" aria-label="Next slide">&rsaquo;</button>' +
      '<div class="hero-dots" id="hero-dots">' + HERO_SLIDES.map(function (_, i) { return '<button data-dot="' + i + '" aria-label="Slide ' + (i + 1) + '"></button>'; }).join("") + '</div></section>' +

      '<section class="truststrip"><div class="wrap truststrip-in">' +
      '<div class="ts-item rv">' + ICONS.truck + '<div><b>Free Shipping</b><span>Above Rs. 3,000</span></div></div>' +
      '<div class="ts-item rv">' + ICONS.leaf + '<div><b>100% Natural</b><span>&amp; Herbal</span></div></div>' +
      '<div class="ts-item rv">' + ICONS.shield + '<div><b>Authentic</b><span>&amp; Lab Tested</span></div></div>' +
      '<div class="ts-item rv">' + ICONS.box + '<div><b>Easy Returns</b><span>&amp; Exchanges</span></div></div>' +
      '<div class="ts-item rv">' + ICONS.headset + '<div><b>Customer Support</b><span>7 Days a Week</span></div></div>' +
      '</div></section>' +

      '<section class="section"><div class="wrap">' +
      '<div class="sec-head rv"><h2><svg class="leaf" viewBox="0 0 24 24" fill="#2e7d32"><path d="M12 21c-4-3.5-6-7-6-11a6 6 0 0 1 12 0c0 4-2 7.5-6 11z"/></svg> Shop by Category <svg class="leaf" viewBox="0 0 24 24" fill="#2e7d32"><path d="M12 21c-4-3.5-6-7-6-11a6 6 0 0 1 12 0c0 4-2 7.5-6 11z"/></svg></h2></div>' +
      '<div class="cat-grid">' + QH.CATEGORIES.map(function (c) {
        return '<a class="cat-tile rv" href="#/shop?cat=' + encodeURIComponent(c) + '"><img src="' + QH.CAT_IMAGES[c] + '" alt="' + c + '" loading="lazy"><span>' + c + '</span></a>';
      }).join("") + '</div></div></section>' +

      '<section class="section" style="padding-top:6px"><div class="wrap">' +
      '<div class="sec-head rv"><h2>Featured Products</h2></div>' +
      '<div class="prod-grid" id="feat-grid">' + feat.map(cardHTML).join("") + '</div>' +
      '<div style="text-align:center;margin-top:28px"><a class="btn ghost" href="#/shop">View All Products</a></div>' +
      '</div></section>' +

      '<div class="banner-strip rv">Free Shipping on Orders Above <b>Rs. 3,000</b> &nbsp;|&nbsp; 100% Natural and Herbal</div>' +

      '<section class="section benefits"><div class="wrap">' +
      '<div class="sec-head rv"><h2>Why Qudratik Herbal</h2></div>' +
      '<div class="ben-grid">' +
      '<div class="ben rv">' + ICONS.leaf + '<b>100% Natural</b><p>Herbal and natural products, carefully selected for everyday use.</p></div>' +
      '<div class="ben rv">' + ICONS.flask + '<b>No Harmful Chemicals</b><p>Clean product choices without harmful chemical additives.</p></div>' +
      '<div class="ben rv">' + ICONS.shield + '<b>Lab Tested</b><p>Authentic products, checked for quality before they reach you.</p></div>' +
      '<div class="ben rv">' + ICONS.sprout + '<b>Trusted Quality</b><p>Consistent quality across herbs, oils, seeds, honey and more.</p></div>' +
      '<div class="ben rv">' + ICONS.ret + '<b>Easy Returns</b><p>Simple returns and exchanges if something is not right.</p></div>' +
      '</div></div></section>';

    bindCards(app);
    initReveal(app);
    var imgs = Array.prototype.slice.call(document.querySelectorAll("#hero-slider .hero-img"));
    function go(i) {
      slideIx = (i + imgs.length) % imgs.length;
      imgs.forEach(function (im, j) { im.classList.toggle("on", j === slideIx); });
      document.querySelectorAll("#hero-dots button").forEach(function (d, j) { d.classList.toggle("on", j === slideIx); });
    }
    document.getElementById("h-prev").addEventListener("click", function () { go(slideIx - 1); restart(); });
    document.getElementById("h-next").addEventListener("click", function () { go(slideIx + 1); restart(); });
    document.querySelectorAll("#hero-dots button").forEach(function (d) {
      d.addEventListener("click", function () { go(Number(d.getAttribute("data-dot"))); restart(); });
    });
    function restart() { clearInterval(slideTimer); slideTimer = setInterval(function () { go(slideIx + 1); }, 5000); }
    go(0); restart();
  }

  /* ---------- SHOP ---------- */
  function viewShop(params) {
    clearInterval(slideTimer);
    var cat = params.get("cat") || "All";
    var q = (params.get("q") || "").toLowerCase();
    var deals = params.get("deals") === "1";
    var sort = params.get("sort") || "featured";
    var list = products().slice();
    if (deals) list = list.filter(function (p) { return p.featured; });
    if (cat !== "All") list = list.filter(function (p) { return p.category === cat; });
    if (q) list = list.filter(function (p) { return (p.name + " " + p.category).toLowerCase().indexOf(q) >= 0; });
    if (sort === "name") list.sort(function (a, b) { return a.name.localeCompare(b.name); });
    if (sort === "price-low") list.sort(function (a, b) { return a.price - b.price; });
    if (sort === "price-high") list.sort(function (a, b) { return b.price - a.price; });

    var chips = ["All"].concat(QH.CATEGORIES).map(function (c) {
      return '<button class="chip' + (c === cat && !deals ? " on" : "") + '" data-chip="' + c + '">' + c + '</button>';
    }).join("");

    app.innerHTML = '<section class="page"><div class="wrap">' +
      '<h1 class="ptitle rv rv-now">' + (deals ? "Deals" : (cat === "All" ? "Shop" : cat)) + '</h1>' +
      '<p class="psub rv rv-now">' + (deals ? 'Our featured picks from across the store. ' : "") + list.length + ' product' + (list.length === 1 ? "" : "s") + (q ? ' for "' + q + '"' : "") + '. Free shipping on orders above ' + QH.money(settings.freeShipThreshold) + '.</p>' +
      '<div class="shop-tools rv rv-now"><div class="chips" style="margin:0">' + chips + '</div>' +
      '<span style="flex:1"></span><label for="sort-sel" style="font-size:14px;font-weight:600">Sort</label>' +
      '<select id="sort-sel"><option value="featured"' + (sort === "featured" ? " selected" : "") + '>Featured</option><option value="name"' + (sort === "name" ? " selected" : "") + '>Name A to Z</option><option value="price-low"' + (sort === "price-low" ? " selected" : "") + '>Price: Low to High</option><option value="price-high"' + (sort === "price-high" ? " selected" : "") + '>Price: High to Low</option></select></div>' +
      (list.length ? '<div class="prod-grid">' + list.map(cardHTML).join("") + '</div>' : '<div class="empty">No products found. Try a different search or category.</div>') +
      '</div></section>';
    bindCards(app);
    initReveal(app);
    app.querySelectorAll("[data-chip]").forEach(function (ch) {
      ch.addEventListener("click", function () {
        var c = ch.getAttribute("data-chip");
        location.hash = c === "All" ? "#/shop" : "#/shop?cat=" + encodeURIComponent(c);
      });
    });
    document.getElementById("sort-sel").addEventListener("change", function (e) {
      var u = new URLSearchParams(); if (cat !== "All") u.set("cat", cat); if (q) u.set("q", q); if (deals) u.set("deals", "1"); u.set("sort", e.target.value);
      location.hash = "#/shop?" + u.toString();
    });
  }

  /* ---------- PRODUCT ---------- */
  function viewProduct(id) {
    clearInterval(slideTimer);
    var p = byId(id);
    if (!p) { app.innerHTML = '<section class="page"><div class="wrap"><div class="empty">Product not found. <a href="#/shop">Back to shop</a></div></div></section>'; return; }
    var rel = products().filter(function (x) { return x.category === p.category && x.id !== p.id; }).slice(0, 4);
    app.innerHTML = '<section class="page"><div class="wrap">' +
      '<p class="psub"><a href="#/">Home</a> / <a href="#/shop">Shop</a> / <a href="#/shop?cat=' + encodeURIComponent(p.category) + '">' + p.category + '</a> / ' + p.name + '</p>' +
      '<div class="pd"><div class="rv rv-now"><img class="main" src="' + p.img + '" alt="' + p.name + '"></div>' +
      '<div class="rv rv-now"><span class="card-cat">' + p.category + '</span><h1>' + p.name + '</h1>' +
      '<div class="price">' + QH.money(p.price) + '</div>' +
      '<p class="desc">' + p.desc + '</p>' +
      '<div style="display:flex;gap:12px;align-items:center"><span style="font-weight:600">Quantity</span>' +
      '<span class="qty"><button id="q-minus" aria-label="Decrease">-</button><input id="q-val" value="1" inputmode="numeric"><button id="q-plus" aria-label="Increase">+</button></span></div>' +
      '<div class="pd-actions"><button class="btn" id="pd-add">Add to Cart</button>' +
      '<a class="btn ghost" target="_blank" rel="noopener" id="pd-wa" href="#">Buy on WhatsApp</a>' +
      '<button class="btn ghost" id="pd-wish">' + (inWish(p.id) ? "In Wishlist" : "Add to Wishlist") + '</button></div>' +
      '<div class="pd-meta"><span>100% Natural and Herbal</span><span>Authentic and Lab Tested</span><span>Free shipping on orders above ' + QH.money(settings.freeShipThreshold) + ', otherwise ' + QH.money(settings.shippingFee) + '</span><span>Easy returns and exchanges</span></div>' +
      '</div></div>' +
      (rel.length ? '<div class="sec-head rv" style="margin-top:48px"><h2>Related Products</h2></div><div class="prod-grid">' + rel.map(cardHTML).join("") + '</div>' : "") +
      '</div></section>';
    bindCards(app);
    initReveal(app);
    var qv = document.getElementById("q-val");
    function qty() { return Math.max(1, parseInt(qv.value, 10) || 1); }
    document.getElementById("q-minus").addEventListener("click", function () { qv.value = Math.max(1, qty() - 1); });
    document.getElementById("q-plus").addEventListener("click", function () { qv.value = qty() + 1; });
    document.getElementById("pd-add").addEventListener("click", function () { addToCart(p.id, qty(), document.querySelector(".pd img.main")); });
    document.getElementById("pd-wa").addEventListener("click", function () {
      this.href = "https://wa.me/" + settings.whatsapp + "?text=" + encodeURIComponent("Assalam-o-Alaikum, I want to order: " + p.name + " x " + qty() + " (" + QH.money(p.price * qty()) + ")");
    });
    document.getElementById("pd-wish").addEventListener("click", function () { toggleWish(p.id); this.textContent = inWish(p.id) ? "In Wishlist" : "Add to Wishlist"; });
  }

  /* ---------- CART ---------- */
  function cartRows() {
    return QH.getCart().map(function (i) { var p = byId(i.id); return p ? { p: p, qty: i.qty } : null; }).filter(Boolean);
  }
  function viewCart() {
    clearInterval(slideTimer);
    var rows = cartRows();
    var sub = rows.reduce(function (s, r) { return s + r.p.price * r.qty; }, 0);
    var ship = shipFor(sub);
    if (!rows.length) {
      app.innerHTML = '<section class="page"><div class="wrap"><h1 class="ptitle">Your Cart</h1><div class="empty">Your cart is empty. <a href="#/shop">Continue shopping</a></div></div></section>'; return;
    }
    var highlightId = lastAddedId; lastAddedId = null;
    app.innerHTML = '<section class="page"><div class="wrap"><h1 class="ptitle rv rv-now">Your Cart</h1><p class="psub rv rv-now">' + rows.length + ' item(s) in your cart.</p>' +
      '<div class="rv rv-now" style="overflow-x:auto"><table class="carttab"><thead><tr><th>Product</th><th>Price</th><th>Quantity</th><th>Total</th><th></th></tr></thead><tbody>' +
      rows.map(function (r) {
        return '<tr' + (r.p.id === highlightId ? ' class="row-new"' : "") + '><td><div style="display:flex;gap:12px;align-items:center"><img src="' + r.p.img + '" alt="' + r.p.name + '"><b>' + r.p.name + '</b></div></td>' +
          '<td>' + QH.money(r.p.price) + '</td>' +
          '<td><span class="qty"><button data-dec="' + r.p.id + '">-</button><input value="' + r.qty + '" data-qty="' + r.p.id + '"><button data-inc="' + r.p.id + '">+</button></span></td>' +
          '<td><b>' + QH.money(r.p.price * r.qty) + '</b></td>' +
          '<td><button class="link-btn" data-remove="' + r.p.id + '">Remove</button></td></tr>';
      }).join("") + '</tbody></table></div>' +
      '<div class="summary rv rv-now" style="margin-top:26px"><div class="row"><span>Subtotal</span><b>' + QH.money(sub) + '</b></div>' +
      '<div class="row"><span>Shipping</span>' + (ship === 0 ? '<span class="free-note">FREE</span>' : '<b>' + QH.money(ship) + '</b>') + '</div>' +
      (ship > 0 ? '<p style="font-size:13.5px;color:var(--muted)">Add ' + QH.money(settings.freeShipThreshold - sub) + ' more for free shipping.</p>' : '') +
      '<div class="row total"><span>Total</span><span>' + QH.money(sub + ship) + '</span></div>' +
      '<a class="btn block" href="#/checkout" style="margin-top:14px">Proceed to Checkout</a>' +
      '<a class="btn ghost block" href="#/shop" style="margin-top:10px">Continue Shopping</a></div>' +
      '</div></section>';
    initReveal(app);
    function setQty(id, qty) {
      var cart = QH.getCart().filter(function (i) { return i.id !== id || qty > 0; });
      cart.forEach(function (i) { if (i.id === id) i.qty = qty; });
      QH.setCart(cart); refreshBadges(); viewCart();
    }
    app.querySelectorAll("[data-inc]").forEach(function (b) { b.addEventListener("click", function () { var r = cartRows().filter(function (x) { return x.p.id === b.getAttribute("data-inc"); })[0]; setQty(r.p.id, r.qty + 1); }); });
    app.querySelectorAll("[data-dec]").forEach(function (b) { b.addEventListener("click", function () { var r = cartRows().filter(function (x) { return x.p.id === b.getAttribute("data-dec"); })[0]; setQty(r.p.id, r.qty - 1); }); });
    app.querySelectorAll("[data-remove]").forEach(function (b) { b.addEventListener("click", function () { setQty(b.getAttribute("data-remove"), 0); }); });
    app.querySelectorAll("[data-qty]").forEach(function (inp) { inp.addEventListener("change", function () { setQty(inp.getAttribute("data-qty"), Math.max(1, parseInt(inp.value, 10) || 1)); }); });
  }

  /* ---------- CHECKOUT ---------- */
  function viewCheckout() {
    clearInterval(slideTimer);
    var rows = cartRows();
    if (!rows.length) { location.hash = "#/cart"; return; }
    var sub = rows.reduce(function (s, r) { return s + r.p.price * r.qty; }, 0);
    var ship = shipFor(sub);
    app.innerHTML = '<section class="page"><div class="wrap"><h1 class="ptitle rv rv-now">Checkout</h1><p class="psub rv rv-now">Cash on Delivery and WhatsApp ordering available.</p>' +
      '<form id="co-form"><div class="form-grid rv rv-now">' +
      '<div><label class="fl" for="co-name">Full Name *</label><input class="fi" id="co-name" required></div>' +
      '<div><label class="fl" for="co-phone">Phone / WhatsApp *</label><input class="fi" id="co-phone" required></div>' +
      '<div><label class="fl" for="co-city">City *</label><input class="fi" id="co-city" required></div>' +
      '<div><label class="fl" for="co-pay">Payment Method *</label><select class="fi" id="co-pay"><option value="COD">Cash on Delivery</option><option value="WhatsApp">WhatsApp Order</option></select></div>' +
      '<div class="full"><label class="fl" for="co-address">Complete Address *</label><textarea class="fi" id="co-address" rows="3" required></textarea></div>' +
      '<div class="full"><label class="fl" for="co-note">Order Notes (optional)</label><input class="fi" id="co-note"></div>' +
      '</div>' +
      '<div class="summary rv rv-now" style="margin:24px 0 0;max-width:520px"><h3 style="margin-bottom:8px">Order Summary</h3>' +
      rows.map(function (r) { return '<div class="row"><span>' + r.p.name + ' x ' + r.qty + '</span><b>' + QH.money(r.p.price * r.qty) + '</b></div>'; }).join("") +
      '<div class="row"><span>Shipping</span>' + (ship === 0 ? '<span class="free-note">FREE</span>' : '<b>' + QH.money(ship) + '</b>') + '</div>' +
      '<div class="row total"><span>Total</span><span>' + QH.money(sub + ship) + '</span></div></div>' +
      '<button class="btn" type="submit" id="co-submit" style="margin-top:22px">Place Order</button></form>' +
      '</div></section>';
    initReveal(app);
    document.getElementById("co-form").addEventListener("submit", function (e) {
      e.preventDefault();
      var btn = document.getElementById("co-submit");
      if (btn.classList.contains("loading")) return;
      /* Place order animation: pehle button loading state (spinner), phir order place */
      var payEarly = document.getElementById("co-pay").value;
      btn.disabled = true;
      btn.classList.add("loading");
      btn.innerHTML = '<span class="spinner"></span> ' + (payEarly === "WhatsApp" ? "Opening WhatsApp..." : "Placing your order...");
      setTimeout(placeOrder, 900);
    });
    function placeOrder() {
      var orders = QH.getOrders();
      var num = 1001 + orders.length;
      var pay = document.getElementById("co-pay").value;
      var order = {
        id: "QH-" + num,
        date: new Date().toISOString(),
        name: document.getElementById("co-name").value.trim(),
        phone: document.getElementById("co-phone").value.trim(),
        city: document.getElementById("co-city").value.trim(),
        address: document.getElementById("co-address").value.trim(),
        note: document.getElementById("co-note").value.trim(),
        payment: pay,
        items: rows.map(function (r) { return { id: r.p.id, name: r.p.name, price: r.p.price, qty: r.qty }; }),
        subtotal: sub, shipping: ship, total: sub + ship,
        status: "Pending"
      };
      orders.push(order); QH.setOrders(orders); QH.setCart([]); refreshBadges();
      if (pay === "WhatsApp") {
        var lines = order.items.map(function (i) { return i.name + " x " + i.qty + " = " + QH.money(i.price * i.qty); }).join("\n");
        var msg = "Assalam-o-Alaikum, my order " + order.id + ":\n" + lines + "\nTotal: " + QH.money(order.total) + "\nName: " + order.name + "\nCity: " + order.city + "\nAddress: " + order.address;
        window.open("https://wa.me/" + settings.whatsapp + "?text=" + encodeURIComponent(msg), "_blank");
      }
      location.hash = "#/success/" + order.id;
    }
  }

  function viewSuccess(id) {
    var o = QH.getOrders().filter(function (x) { return x.id === id; })[0];
    if (!o) { app.innerHTML = '<section class="page"><div class="wrap"><div class="empty">Order not found.</div></div></section>'; return; }
    var steps = ["Order Placed", "Packed", "Out for Delivery", "Delivered"];
    var tracker = '<div class="tracker">' + steps.map(function (s, i) {
      var d = (1.0 + i * 0.35).toFixed(2) + "s";
      return (i > 0 ? '<div class="tline" style="--d:' + (0.85 + i * 0.35).toFixed(2) + 's"></div>' : "") +
        '<div class="tstep' + (i === 0 ? " now" : "") + '" style="--d:' + d + '"><span class="tdot"></span><span class="tlabel">' + s + '</span></div>';
    }).join("") + '</div>';
    app.innerHTML = '<section class="page"><div class="wrap"><div class="success-box">' +
      '<div class="check-wrap"><svg class="check-svg" viewBox="0 0 52 52" aria-hidden="true"><circle cx="26" cy="26" r="24"></circle><path d="M15 27l7.5 7.5L37 19"></path></svg><div class="leaf-burst" id="leaf-burst"></div></div>' +
      '<h1>Order Placed. Thank You!</h1><p>Your order number is <b class="order-id">' + o.id + '</b>.</p>' +
      '<p style="margin-top:8px">Total: <b>' + QH.money(o.total) + '</b> &nbsp;|&nbsp; Payment: <b>' + (o.payment === "COD" ? "Cash on Delivery" : "WhatsApp Order") + '</b></p>' +
      '<p style="color:var(--muted);margin-top:8px">We will contact you on ' + o.phone + ' to confirm your order.</p>' +
      tracker +
      '<a class="btn" href="#/shop" style="margin-top:18px">Continue Shopping</a></div></div></section>';
    /* Qudratik dedicated: checkmark ke gird leaf burst */
    var burstHost = document.getElementById("leaf-burst");
    if (burstHost) {
      var leafWrap = document.createElement("div");
      leafWrap.style.cssText = "position:absolute;left:50%;top:50%;width:0;height:0";
      burstHost.appendChild(leafWrap);
      setTimeout(function () { spawnBurst(leafWrap, 12, ["#43a047", "#2e7d32", "#c9a227", "#81c784"], 12, 48, 88, 950); }, 620);
    }
  }

  /* ---------- WISHLIST ---------- */
  function viewWishlist() {
    clearInterval(slideTimer);
    var list = QH.getWishlist().map(byId).filter(Boolean);
    app.innerHTML = '<section class="page"><div class="wrap"><h1 class="ptitle rv rv-now">My Wishlist</h1><p class="psub rv rv-now">' + list.length + ' saved product(s).</p>' +
      (list.length ? '<div class="prod-grid">' + list.map(cardHTML).join("") + '</div>' : '<div class="empty">Your wishlist is empty. Tap the heart on any product to save it here.</div>') +
      '</div></section>';
    bindCards(app);
    initReveal(app);
  }

  /* ---------- ACCOUNT ---------- */
  function viewAccount() {
    clearInterval(slideTimer);
    var rows = cartRows();
    var cartQty = rows.reduce(function (s, r) { return s + r.qty; }, 0);
    var cartTotal = rows.reduce(function (s, r) { return s + r.p.price * r.qty; }, 0);
    var wishN = QH.getWishlist().length;
    var orders = QH.getOrders();
    app.innerHTML = '<section class="page"><div class="wrap"><h1 class="ptitle rv rv-now">My Account</h1>' +
      '<p class="psub rv rv-now">You are shopping as a guest, no sign up is needed to order. Your cart, wishlist and orders are saved on this device and shown here.</p>' +
      '<div class="acct-grid">' +
      '<div class="acct-box rv"><b>' + cartQty + '</b><span>Items in Cart</span><small>' + QH.money(cartTotal) + '</small><p style="margin-top:10px"><a class="btn small ghost" href="#/cart">View Cart</a></p></div>' +
      '<div class="acct-box rv"><b>' + wishN + '</b><span>Saved in Wishlist</span><small>&nbsp;</small><p style="margin-top:10px"><a class="btn small ghost" href="#/wishlist">View Wishlist</a></p></div>' +
      '<div class="acct-box rv"><b>' + orders.length + '</b><span>Orders on This Device</span><small>&nbsp;</small><p style="margin-top:10px"><a class="btn small ghost" href="#/shop">Continue Shopping</a></p></div>' +
      '</div>' +
      '<div class="rich rv"><h3 style="margin-top:0">Find Your Order</h3>' +
      '<p>Enter the phone number you used at checkout to see the orders placed with it on this device.</p></div>' +
      '<form id="lookup-form" class="form-grid rv" style="grid-template-columns:1fr auto;max-width:560px;align-items:end">' +
      '<div><label class="fl" for="lk-phone">Phone / WhatsApp Number</label><input class="fi" id="lk-phone" inputmode="tel" placeholder="03xx xxxxxxx" required></div>' +
      '<div><button class="btn" type="submit">Find Orders</button></div></form>' +
      '<div id="lookup-result" style="margin-top:22px;max-width:760px"></div>' +
      '</div></section>';
    initReveal(app);
    document.getElementById("lookup-form").addEventListener("submit", function (e) {
      e.preventDefault();
      var digits = document.getElementById("lk-phone").value.replace(/[^0-9]/g, "");
      var box = document.getElementById("lookup-result");
      if (digits.length < 7) { box.innerHTML = '<div class="empty">Please enter a complete phone number.</div>'; return; }
      var norm = function (s) { var d = String(s || "").replace(/[^0-9]/g, ""); return d.length > 10 ? d.slice(-10) : d; };
      var mine = QH.getOrders().filter(function (o) { return norm(o.phone) === norm(digits); }).slice().reverse();
      if (!mine.length) {
        box.innerHTML = '<div class="empty">No orders found for this number on this device yet. If you ordered from another device or browser, message us on WhatsApp at ' + settings.phone + ' with your order number.</div>';
        return;
      }
      box.innerHTML = mine.map(function (o) {
        return '<div class="lookup-row"><div><b>' + o.id + '</b> &nbsp;<span class="li-items">' + new Date(o.date).toLocaleDateString() + '</span>' +
          '<div class="li-items">' + o.items.map(function (i) { return i.name + " x " + i.qty; }).join(", ") + '</div>' +
          '<div>Total: <b>' + QH.money(o.total) + '</b> &nbsp;|&nbsp; ' + (o.payment === "COD" ? "Cash on Delivery" : "WhatsApp Order") + '</div></div>' +
          '<span class="status-pill">' + o.status + '</span></div>';
      }).join("");
    });
  }

  /* ---------- ABOUT ---------- */
  function viewAbout() {
    clearInterval(slideTimer);
    var catList = {
      "Herbs & Powders": "Moringa, ashwagandha and turmeric powders, finely ground and ready to use.",
      "Herbal Oils": "Cold pressed oils including black seed oil, coconut oil and almond oil.",
      "Seeds & Grains": "Chia seeds, pumpkin seeds and flax seeds for everyday meals and drinks.",
      "Honey & Naturals": "Pure honey, wild honey and natural honeycomb.",
      "Skin & Hair Care": "Aloe vera gel, herbal face cream and neem soap for daily care.",
      "Wellness & Health": "Herbal green tea, ashwagandha capsules and desi herbal qehwa.",
      "Dates & Dry Fruits": "Ajwa, Medjool and Sukkari dates, carefully selected and packed."
    };
    app.innerHTML = '<section class="page"><div class="wrap"><h1 class="ptitle rv rv-now">About Qudratik Herbal</h1>' +
      '<p class="psub rv rv-now">Nature\'s Care for a Healthier You.</p>' +
      '<div class="rich rv">' +
      '<p>Qudratik Herbal offers premium herbal and natural products. Herbs, oils, seeds, honey, and wellness essentials, all in one place for a healthier, more natural lifestyle.</p>' +
      '<p>Every product on this store is 100% natural and herbal, authentic and lab tested, and selected for trusted quality with no harmful chemicals.</p>' +
      '<h3>What We Offer</h3><ul>' +
      QH.CATEGORIES.map(function (c) { return '<li><a href="#/shop?cat=' + encodeURIComponent(c) + '"><b>' + c + '</b></a>: ' + catList[c] + '</li>'; }).join("") +
      '</ul>' +
      '<h3>Shopping With Us</h3>' +
      '<p>Shipping is free on orders above ' + QH.money(settings.freeShipThreshold) + '; below that, a shipping fee of ' + QH.money(settings.shippingFee) + ' applies. Cash on Delivery is available at checkout, and you can also place your order on WhatsApp. Returns and exchanges are easy if something is not right.</p>' +
      '<p>Customer support is available 7 days a week on WhatsApp at ' + settings.phone + '. See our <a href="#/faq">FAQ page</a> for quick answers, or <a href="#/contact">contact us</a> any time.</p>' +
      '<p style="margin-top:18px"><a class="btn" href="#/shop">Shop Now</a> &nbsp;<a class="btn ghost" target="_blank" rel="noopener" href="https://wa.me/' + settings.whatsapp + '">Chat on WhatsApp</a></p>' +
      '</div></div></section>';
    initReveal(app);
  }

  /* ---------- CONTACT ---------- */
  function viewContact() {
    clearInterval(slideTimer);
    app.innerHTML = '<section class="page"><div class="wrap"><h1 class="ptitle rv rv-now">Contact Us</h1>' +
      '<p class="psub rv rv-now">Customer support is available 7 days a week. The fastest way to reach us is WhatsApp.</p>' +
      '<div class="acct-grid" style="max-width:860px">' +
      '<div class="acct-box rv"><b style="font-size:22px">' + settings.phone + '</b><span>WhatsApp</span><p style="margin-top:10px"><a class="btn small" target="_blank" rel="noopener" href="https://wa.me/' + settings.whatsapp + '">Chat Now</a></p></div>' +
      '<div class="acct-box rv"><b style="font-size:22px">7 Days</b><span>Customer Support, 7 Days a Week</span><p style="margin-top:10px"><a class="btn small ghost" href="#/faq">Read FAQ</a></p></div>' +
      '<div class="acct-box rv"><b style="font-size:22px">Orders</b><span>Order Help and Tracking</span><p style="margin-top:10px"><a class="btn small ghost" href="#/account">Find Your Order</a></p></div>' +
      '</div>' +
      '<div class="rich rv"><h3 style="margin-top:0">Send a Message</h3>' +
      '<p>Fill in this form and it will open WhatsApp with your message ready to send to ' + settings.phone + '.</p></div>' +
      '<form id="ct-form" class="form-grid rv">' +
      '<div><label class="fl" for="ct-name">Your Name *</label><input class="fi" id="ct-name" required></div>' +
      '<div><label class="fl" for="ct-phone">Your Phone (optional)</label><input class="fi" id="ct-phone" inputmode="tel"></div>' +
      '<div class="full"><label class="fl" for="ct-msg">Message *</label><textarea class="fi" id="ct-msg" rows="4" required placeholder="How can we help?"></textarea></div>' +
      '<div class="full"><button class="btn" type="submit">Send on WhatsApp</button></div></form>' +
      '</div></section>';
    initReveal(app);
    document.getElementById("ct-form").addEventListener("submit", function (e) {
      e.preventDefault();
      var name = document.getElementById("ct-name").value.trim();
      var phone = document.getElementById("ct-phone").value.trim();
      var msg = document.getElementById("ct-msg").value.trim();
      var text = "Assalam-o-Alaikum, I am " + name + "." + (phone ? " My phone is " + phone + "." : "") + "\n" + msg;
      window.open("https://wa.me/" + settings.whatsapp + "?text=" + encodeURIComponent(text), "_blank");
    });
  }

  /* ---------- FAQ ---------- */
  function viewFaq() {
    clearInterval(slideTimer);
    var qa = [
      ["How do I place an order?", "Add products to your cart and complete the checkout, or tap the WhatsApp button on any product page to order on WhatsApp instead."],
      ["Which payment methods do you accept?", "Cash on Delivery is available at checkout. You can also place and confirm your order on WhatsApp."],
      ["What are the shipping charges?", "Shipping is FREE on orders above " + QH.money(settings.freeShipThreshold) + ". For orders below this amount, a shipping fee of " + QH.money(settings.shippingFee) + " applies."],
      ["Can I return or exchange a product?", "Yes. Returns and exchanges are easy. If a product arrives damaged or incorrect, contact us on WhatsApp within 7 days of delivery with your order number, and our team will guide you through the simple process. Products should be unused and in their original packing. See the <a href='#/policy/returns'>Returns and Exchanges policy</a> for details."],
      ["Are your products natural and tested?", "Yes. Our products are 100% Natural and Herbal, Authentic and Lab Tested, and selected for trusted quality with no harmful chemicals."],
      ["How can I check my order?", "Go to <a href='#/account'>My Account</a> and enter the phone number you used at checkout to see orders placed from this device. You can also message us on WhatsApp with your order number."],
      ["How do I contact customer support?", "Message us on WhatsApp at " + settings.phone + ". Customer support is available 7 days a week. Visit the <a href='#/contact'>Contact page</a> to send a message."]
    ];
    app.innerHTML = '<section class="page"><div class="wrap"><h1 class="ptitle rv rv-now">FAQ / Help</h1>' +
      '<p class="psub rv rv-now">Quick answers about ordering, payment, shipping and returns.</p>' +
      qa.map(function (x) { return '<div class="faq-item rv"><b>' + x[0] + '</b><p>' + x[1] + '</p></div>'; }).join("") +
      '<p class="rv" style="margin-top:16px">Still need help? <a href="#/contact">Contact us on WhatsApp</a>.</p>' +
      '</div></section>';
    initReveal(app);
  }

  /* ---------- POLICIES ---------- */
  function viewPolicy(kind) {
    clearInterval(slideTimer);
    var bodies = {
      shipping: { t: "Shipping Policy", b: "<p>Orders are packed and dispatched with care across Pakistan.</p><p style='margin-top:10px'>Shipping is <b>FREE on orders above " + QH.money(settings.freeShipThreshold) + "</b>. For orders below this amount, a shipping fee of <b>" + QH.money(settings.shippingFee) + "</b> applies. This fee is a placeholder and will be confirmed with the final price list.</p><p style='margin-top:10px'>Customer support is available 7 days a week on WhatsApp at " + settings.phone + ".</p>" },
      returns: { t: "Returns and Exchanges", b: "<p>Easy returns and exchanges. If a product arrives damaged or incorrect, contact us on WhatsApp within 7 days of delivery with your order number.</p><p style='margin-top:10px'>Products should be unused and in their original packing for a return or exchange. Our team will guide you through the simple process.</p>" },
      privacy: { t: "Privacy Policy", b: "<p>We collect only the information needed to process your order: your name, phone number, city and delivery address.</p><p style='margin-top:10px'>Your details are used for order delivery and support only, and are never sold to third parties.</p>" }
    };
    var d = bodies[kind] || bodies.shipping;
    app.innerHTML = '<section class="page"><div class="wrap" style="max-width:820px"><h1 class="ptitle rv rv-now">' + d.t + '</h1><div class="rv rv-now" style="font-size:16px;color:#33402f">' + d.b + '</div></div></section>';
    initReveal(app);
  }

  /* ---------- ROUTER ---------- */
  function route() {
    applySettings(); refreshBadges();
    var hash = location.hash.replace(/^#\/?/, "");
    var parts = hash.split("?");
    var path = parts[0]; var params = new URLSearchParams(parts[1] || "");
    document.querySelectorAll(".nav-link").forEach(function (a) { a.classList.remove("active"); });
    /* Round 5 fix: view change par scroll FORAN top par (instant). CSS ka
       scroll-behavior:smooth pehle is scroll ko animated bana deta tha, view
       purani scroll position par render hota tha aur reveal system tamam cards
       ko "crossed" samajh kar ek sath khol deta tha. */
    try { window.scrollTo({ top: 0, left: 0, behavior: "instant" }); }
    catch (e) { window.scrollTo(0, 0); }
    if (path === "" ) { document.querySelector('.nav-link[href="#/"]').classList.add("active"); viewHome(); }
    else if (path === "shop") viewShop(params);
    else if (path.indexOf("product/") === 0) viewProduct(decodeURIComponent(path.slice(8)));
    else if (path === "cart") viewCart();
    else if (path === "checkout") viewCheckout();
    else if (path.indexOf("success/") === 0) viewSuccess(path.slice(8));
    else if (path === "wishlist") viewWishlist();
    else if (path === "account") viewAccount();
    else if (path === "about") viewAbout();
    else if (path === "contact") viewContact();
    else if (path === "faq") viewFaq();
    else if (path.indexOf("policy/") === 0) viewPolicy(path.slice(7));
    else viewHome();
    /* view transition: halka fade + rise har view khulne par */
    app.classList.remove("view-in"); void app.offsetWidth; app.classList.add("view-in");
    /* footer blocks bhi reveal system me (sirf pehli dafa arm honge) */
    var fg = document.querySelector(".footer-grid");
    if (fg) initReveal(fg);
  }

  /* header wiring */
  var menu = document.getElementById("allcat-menu");
  menu.innerHTML = QH.CATEGORIES.map(function (c) {
    return '<a href="#/shop?cat=' + encodeURIComponent(c) + '">' + c + ' <span>' + QH.getProducts().filter(function (p) { return p.category === c; }).length + ' items</span></a>';
  }).join("") + '<a href="#/shop">All Products <span>Shop</span></a>';
  var ab = document.getElementById("allcat-btn");
  ab.addEventListener("click", function (e) {
    e.stopPropagation();
    var open = menu.hidden; menu.hidden = !open; ab.setAttribute("aria-expanded", String(open));
  });
  document.addEventListener("click", function (e) { if (!e.target.closest(".allcat")) menu.hidden = true; });
  menu.addEventListener("click", function () { menu.hidden = true; });

  document.getElementById("footer-cats").innerHTML = QH.CATEGORIES.map(function (c) {
    return '<li><a href="#/shop?cat=' + encodeURIComponent(c) + '">' + c + '</a></li>';
  }).join("");

  /* ---------- MOBILE DRAWER (ROUND 4) ----------
     Left se animated sidebar: slide-in ~380ms smooth easing + overlay fade-in.
     Links staggered fade/slide-in (har link par --i delay index).
     Close: X button, overlay click, kisi bhi link par click, Escape. Body scroll lock. */
  var drawer = document.getElementById("drawer");
  var drawerOverlay = document.getElementById("drawer-overlay");
  var drawerBtn = document.getElementById("drawer-btn");
  document.getElementById("drawer-cats").innerHTML = QH.CATEGORIES.map(function (c) {
    return '<a class="dlink dcat" href="#/shop?cat=' + encodeURIComponent(c) + '">' + c + ' <span>' + QH.getProducts().filter(function (p) { return p.category === c; }).length + ' items</span></a>';
  }).join("");
  (function assignDrawerIx() {
    var items = drawer.querySelectorAll(".drawer-nav .dlink, .drawer-nav .dlabel, .drawer-contact");
    items.forEach(function (el, i) { el.style.setProperty("--i", i); });
  })();
  var drawerOpen = false, drawerHideTimer = null;
  function openDrawer() {
    if (drawerOpen) return; drawerOpen = true;
    clearTimeout(drawerHideTimer);
    drawerOverlay.hidden = false;
    /* overlay fade ke liye ek frame baad .show */
    requestAnimationFrame(function () { requestAnimationFrame(function () { drawerOverlay.classList.add("show"); }); });
    drawer.classList.add("open");
    drawer.setAttribute("aria-hidden", "false");
    drawerBtn.setAttribute("aria-expanded", "true");
    document.body.classList.add("locked");
  }
  function closeDrawer() {
    if (!drawerOpen) return; drawerOpen = false;
    drawerOverlay.classList.remove("show");
    drawer.classList.remove("open");
    drawer.setAttribute("aria-hidden", "true");
    drawerBtn.setAttribute("aria-expanded", "false");
    document.body.classList.remove("locked");
    drawerHideTimer = setTimeout(function () { drawerOverlay.hidden = true; }, 340);
  }
  drawerBtn.addEventListener("click", openDrawer);
  document.getElementById("drawer-close").addEventListener("click", closeDrawer);
  drawerOverlay.addEventListener("click", closeDrawer);
  drawer.addEventListener("click", function (e) { if (e.target.closest("a")) closeDrawer(); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") closeDrawer(); });

  document.getElementById("search-form").addEventListener("submit", function (e) {
    e.preventDefault();
    var q = document.getElementById("search-input").value.trim();
    location.hash = "#/shop" + (q ? "?q=" + encodeURIComponent(q) : "");
    if ((location.hash || "").indexOf("shop") >= 0) route();
  });

  window.addEventListener("hashchange", route);
  route();
})();
