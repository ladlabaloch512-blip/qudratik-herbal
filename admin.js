/* Qudratik Herbal - admin panel */
(function () {
  var USER = "admin", PASS = "qudratik2026";
  var main = document.getElementById("admin-main");
  var tab = "dashboard";
  var editId = null;

  function toast(msg) {
    var t = document.getElementById("toast"); t.textContent = msg; t.hidden = false;
    setTimeout(function () { t.hidden = true; }, 2200);
  }
  function loggedIn() { try { return sessionStorage.getItem("qh_admin") === "1"; } catch (e) { return false; } }
  function show() {
    document.getElementById("login-view").hidden = loggedIn();
    document.getElementById("admin-view").hidden = !loggedIn();
    if (loggedIn()) render();
  }
  document.getElementById("login-form").addEventListener("submit", function (e) {
    e.preventDefault();
    var u = document.getElementById("li-user").value.trim();
    var p = document.getElementById("li-pass").value;
    if (u === USER && p === PASS) {
      try { sessionStorage.setItem("qh_admin", "1"); } catch (err) {}
      document.getElementById("login-err").hidden = true; show(); toast("Welcome back");
    } else {
      document.getElementById("login-err").hidden = false;
    }
  });
  document.getElementById("logout-btn").addEventListener("click", function () {
    try { sessionStorage.removeItem("qh_admin"); } catch (e) {}
    show();
  });
  document.querySelectorAll(".side-link").forEach(function (b) {
    b.addEventListener("click", function () {
      tab = b.getAttribute("data-tab"); editId = null;
      document.querySelectorAll(".side-link").forEach(function (x) { x.classList.toggle("on", x === b); });
      render();
    });
  });

  function render() {
    if (tab === "dashboard") return renderDashboard();
    if (tab === "products") return renderProducts();
    if (tab === "categories") return renderCategories();
    if (tab === "orders") return renderOrders();
    if (tab === "settings") return renderSettings();
  }

  function renderDashboard() {
    var prods = QH.getProducts(), orders = QH.getOrders(), s = QH.getSettings();
    var revenue = orders.reduce(function (sum, o) { return sum + (o.total || 0); }, 0);
    var pending = orders.filter(function (o) { return o.status === "Pending"; }).length;
    main.innerHTML = "<h1>Dashboard</h1><p class='sub'>Store overview. Changes made here apply to the storefront on this device and browser.</p>" +
      "<div class='stat-grid'>" +
      "<div class='stat'><b>" + prods.length + "</b><span>Total Products</span></div>" +
      "<div class='stat'><b>" + QH.CATEGORIES.length + "</b><span>Categories</span></div>" +
      "<div class='stat'><b>" + orders.length + "</b><span>Total Orders (" + pending + " pending)</span></div>" +
      "<div class='stat'><b>" + QH.money(revenue) + "</b><span>Order Revenue</span></div></div>" +
      "<div class='note-box'><b>Placeholder prices:</b> all products are currently priced at Rs 999 as placeholders. The client's real price list has not been received yet. Update each price from Products when the list arrives. Store contact in use: " + s.phone + " (client WhatsApp, to be confirmed as the store number).</div>" +
      "<p class='sub'>Quick actions</p><p><button class='btn small' id='d-add'>Add New Product</button> &nbsp; <a class='btn small ghost' href='index.html#/shop' target='_blank'>Open Shop</a></p>";
    document.getElementById("d-add").addEventListener("click", function () {
      tab = "products";
      document.querySelectorAll(".side-link").forEach(function (x) { x.classList.toggle("on", x.getAttribute("data-tab") === "products"); });
      renderProducts(true);
    });
  }

  function slugify(name) {
    var base = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "product";
    var prods = QH.getProducts(), id = base, n = 2;
    while (prods.some(function (p) { return p.id === id && p.id !== editId; })) { id = base + "-" + n; n++; }
    return id;
  }

  function renderProducts(openForm) {
    var prods = QH.getProducts();
    var editing = editId ? prods.filter(function (p) { return p.id === editId; })[0] : null;
    var showForm = openForm || editing;
    var f = editing || { name: "", category: QH.CATEGORIES[0], price: 999, img: "", desc: "", featured: false };
    var form = "";
    if (showForm) {
      form = "<form class='pform' id='p-form'>" +
        "<div><label class='fl'>Product Name *</label><input class='fi' id='pf-name' required value='" + esc(f.name) + "'></div>" +
        "<div><label class='fl'>Category *</label><select class='fi' id='pf-cat'>" + QH.CATEGORIES.map(function (c) { return "<option" + (c === f.category ? " selected" : "") + ">" + c + "</option>"; }).join("") + "</select></div>" +
        "<div><label class='fl'>Price (Rs) *</label><input class='fi' id='pf-price' type='number' min='0' required value='" + f.price + "'></div>" +
        "<div><label class='fl'>Featured on Homepage</label><select class='fi' id='pf-feat'><option value='0'" + (!f.featured ? " selected" : "") + ">No</option><option value='1'" + (f.featured ? " selected" : "") + ">Yes</option></select></div>" +
        "<div class='full'><label class='fl'>Image URL *</label><input class='fi' id='pf-img' required value='" + esc(f.img) + "' placeholder='images/product.jpg or https://...'></div>" +
        "<div class='full'><label class='fl'>Description</label><textarea class='fi' id='pf-desc' rows='3'>" + esc(f.desc) + "</textarea></div>" +
        "<div class='full'><button class='btn small' type='submit'>" + (editing ? "Save Changes" : "Add Product") + "</button> <button class='btn small ghost' type='button' id='pf-cancel'>Cancel</button></div></form>";
    }
    main.innerHTML = "<h1>Products</h1><p class='sub'>" + prods.length + " products. Prices are placeholders (Rs 999) until the client price list arrives.</p>" +
      "<div class='note-box'>Placeholder price note: do not treat Rs 999 as a real price. Replace prices here as soon as the client confirms them. Storefront updates immediately.</div>" +
      (showForm ? form : "<p style='margin-bottom:18px'><button class='btn small' id='add-btn'>Add New Product</button></p>") +
      "<div style='overflow-x:auto'><table class='atab'><thead><tr><th>Photo</th><th>Name</th><th>Category</th><th>Price</th><th>Featured</th><th>Actions</th></tr></thead><tbody>" +
      prods.map(function (p) {
        return "<tr><td><img src='" + p.img + "' alt=''></td><td><b>" + esc(p.name) + "</b></td><td>" + p.category + "</td><td>" + QH.money(p.price) + "</td><td>" + (p.featured ? "Yes" : "No") + "</td>" +
          "<td><span class='rowbtns'><button class='mini-btn' data-edit='" + p.id + "'>Edit</button><button class='mini-btn danger' data-del='" + p.id + "'>Delete</button></span></td></tr>";
      }).join("") + "</tbody></table></div>";
    var addBtn = document.getElementById("add-btn");
    if (addBtn) addBtn.addEventListener("click", function () { renderProducts(true); });
    var cancel = document.getElementById("pf-cancel");
    if (cancel) cancel.addEventListener("click", function () { editId = null; renderProducts(); });
    var pf = document.getElementById("p-form");
    if (pf) pf.addEventListener("submit", function (e) {
      e.preventDefault();
      var name = document.getElementById("pf-name").value.trim();
      var data = {
        name: name,
        category: document.getElementById("pf-cat").value,
        price: Math.max(0, parseInt(document.getElementById("pf-price").value, 10) || 0),
        img: document.getElementById("pf-img").value.trim(),
        desc: document.getElementById("pf-desc").value.trim(),
        featured: document.getElementById("pf-feat").value === "1"
      };
      var list = QH.getProducts();
      if (editId) {
        list = list.map(function (p) { return p.id === editId ? Object.assign({}, p, data) : p; });
        toast("Product updated");
      } else {
        data.id = slugify(name); data.hero = false;
        list.push(data); toast("Product added");
      }
      QH.setProducts(list); editId = null; renderProducts();
    });
    main.querySelectorAll("[data-edit]").forEach(function (b) { b.addEventListener("click", function () { editId = b.getAttribute("data-edit"); renderProducts(); window.scrollTo(0, 0); }); });
    main.querySelectorAll("[data-del]").forEach(function (b) {
      b.addEventListener("click", function () {
        var id = b.getAttribute("data-del");
        if (!window.confirm("Delete this product?")) return;
        QH.setProducts(QH.getProducts().filter(function (p) { return p.id !== id; }));
        toast("Product deleted"); renderProducts();
      });
    });
  }

  function renderCategories() {
    var prods = QH.getProducts();
    main.innerHTML = "<h1>Categories</h1><p class='sub'>The 7 store categories from the approved design. Product counts update automatically.</p>" +
      "<table class='atab'><thead><tr><th>Photo</th><th>Category</th><th>Products</th><th>Storefront</th></tr></thead><tbody>" +
      QH.CATEGORIES.map(function (c) {
        var n = prods.filter(function (p) { return p.category === c; }).length;
        return "<tr><td><img src='" + QH.CAT_IMAGES[c] + "' alt=''></td><td><b>" + c + "</b></td><td>" + n + "</td><td><a href='index.html#/shop?cat=" + encodeURIComponent(c) + "' target='_blank'>View in Shop</a></td></tr>";
      }).join("") + "</tbody></table>";
  }

  function renderOrders() {
    var orders = QH.getOrders().slice().reverse();
    var statuses = ["Pending", "Confirmed", "Dispatched", "Delivered"];
    main.innerHTML = "<h1>Orders</h1><p class='sub'>" + orders.length + " order(s) placed from the storefront checkout.</p>" +
      (orders.length ? "<div style='overflow-x:auto'><table class='atab'><thead><tr><th>Order</th><th>Customer</th><th>Items</th><th>Total</th><th>Payment</th><th>Status</th></tr></thead><tbody>" +
        orders.map(function (o) {
          return "<tr><td><b>" + o.id + "</b><br><span class='order-items'>" + new Date(o.date).toLocaleString() + "</span></td>" +
            "<td>" + esc(o.name) + "<br><span class='order-items'>" + esc(o.phone) + ", " + esc(o.city) + "</span></td>" +
            "<td class='order-items'>" + o.items.map(function (i) { return esc(i.name) + " x " + i.qty; }).join("<br>") + "</td>" +
            "<td><b>" + QH.money(o.total) + "</b></td><td>" + o.payment + "</td>" +
            "<td><select class='status-sel' data-status='" + o.id + "'>" + statuses.map(function (s) { return "<option" + (s === o.status ? " selected" : "") + ">" + s + "</option>"; }).join("") + "</select></td></tr>";
        }).join("") + "</tbody></table></div>"
        : "<div class='note-box'>No orders yet. Place a test order from the storefront checkout and it will appear here.</div>");
    main.querySelectorAll("[data-status]").forEach(function (sel) {
      sel.addEventListener("change", function () {
        var list = QH.getOrders().map(function (o) { return o.id === sel.getAttribute("data-status") ? Object.assign({}, o, { status: sel.value }) : o; });
        QH.setOrders(list); toast("Order " + sel.getAttribute("data-status") + " marked " + sel.value);
      });
    });
  }

  function renderSettings() {
    var s = QH.getSettings();
    main.innerHTML = "<h1>Settings</h1><p class='sub'>These settings apply to the storefront: top bar, footer contact, shipping logic and WhatsApp links.</p>" +
      "<form class='sform' id='s-form'>" +
      "<div><label class='fl'>Store Phone (display)</label><input class='fi' id='sf-phone' value='" + esc(s.phone) + "'></div>" +
      "<div><label class='fl'>WhatsApp Number (digits with country code, e.g. 923407838582)</label><input class='fi' id='sf-wa' value='" + esc(s.whatsapp) + "'></div>" +
      "<div><label class='fl'>Free Shipping Threshold (Rs)</label><input class='fi' id='sf-thr' type='number' min='0' value='" + s.freeShipThreshold + "'></div>" +
      "<div><label class='fl'>Shipping Fee (Rs, below threshold)</label><input class='fi' id='sf-fee' type='number' min='0' value='" + s.shippingFee + "'></div>" +
      "<div><label class='fl'>Top Bar Announcement</label><input class='fi' id='sf-ann' value='" + esc(s.announcement) + "'></div>" +
      "<div><button class='btn small' type='submit'>Save Settings</button></div></form>" +
      "<div class='note-box' style='margin-top:20px'>Current store number is the client's WhatsApp number. Confirm with the client if the store will use a separate number or email before production launch.</div>";
    document.getElementById("s-form").addEventListener("submit", function (e) {
      e.preventDefault();
      QH.setSettings({
        phone: document.getElementById("sf-phone").value.trim(),
        whatsapp: document.getElementById("sf-wa").value.replace(/[^0-9]/g, ""),
        freeShipThreshold: Math.max(0, parseInt(document.getElementById("sf-thr").value, 10) || 0),
        shippingFee: Math.max(0, parseInt(document.getElementById("sf-fee").value, 10) || 0),
        announcement: document.getElementById("sf-ann").value.trim()
      });
      toast("Settings saved. Storefront updated.");
    });
  }

  function esc(s) { return String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/"/g, "&quot;"); }

  show();
})();
