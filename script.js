function scrollToSection(e, id) {
  e.preventDefault();
  document.getElementById(id).scrollIntoView({ behavior: 'smooth', block: 'start' });
  document.querySelectorAll('.bottom-nav-item').forEach(b => b.classList.remove('active'));
  e.currentTarget.classList.add('active');
}

// Active section detection for bottom nav
const sections = ['new', 'stock', 'best'];
window.addEventListener('scroll', () => {
  const scrollY = window.scrollY + 200;
  let current = '';
  sections.forEach(id => {
    const el = document.getElementById(id);
    if (el && el.offsetTop <= scrollY) current = id;
  });
  document.querySelectorAll('.bottom-nav-item').forEach(b => {
    const href = b.getAttribute('href');
    b.classList.toggle('active', href === '#' + current);
  });
});

// ═══════════════════ SCROLL REVEAL ═══════════════════
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); } });
}, { threshold: 0.1 });
document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// ═══════════════════ STOCK DATA ═══════════════════
// Setiap varian punya stok (Kg) + daftar warna lengkap.
// Total stok produk dihitung otomatis dari jumlah stok semua varian.
// ═══════════════════ STOCK DATA ═══════════════════
// Katalog: kategori -> varian -> SEMUA warna.
// • Nama warna yg belum ada aslinya tampil sbg "Warna N" — silakan ganti.
// • stock (Kg) per varian masih PLACEHOLDER — ganti dgn angka stok asli.
function stkHslHex(i){
  var h=(i*47)%360, s=0.46, l=0.60, a=s*Math.min(l,1-l);
  function fn(n){var k=(n+h/30)%12;return Math.round(255*(l-a*Math.max(-1,Math.min(k-3,Math.min(9-k,1)))));}
  function hx(v){return ('0'+v.toString(16)).slice(-2);}
  return '#'+hx(fn(0))+hx(fn(8))+hx(fn(4));
}
var STK_PALETTE=[
  {name:"Putih",hex:"#F5F5F1"},{name:"Hitam",hex:"#23272E"},{name:"Abu",hex:"#9AA1A6"},
  {name:"Abu Muda",hex:"#C3C8CC"},{name:"Navy",hex:"#1F2A52"},{name:"Misty",hex:"#C6CBCE"},
  {name:"Maroon",hex:"#6E2230"},{name:"Mustard",hex:"#D1962A"},{name:"Army Green",hex:"#4B5320"},
  {name:"Biru Baby",hex:"#A9D3E8"},{name:"Tosca",hex:"#1FAE9A"},{name:"Mocca",hex:"#8A6A4F"},
  {name:"Dusty",hex:"#B79AA3"},{name:"Cream",hex:"#F1E9D2"},{name:"Olive",hex:"#6F7331"},
  {name:"Merah",hex:"#C33636"},{name:"Kuning",hex:"#F2C43D"},{name:"Orange",hex:"#E08535"},
  {name:"Peach",hex:"#F4C1A3"},{name:"Salem",hex:"#E9A58C"},{name:"Pink",hex:"#E79BB6"},
  {name:"Lavender",hex:"#C3B5E0"},{name:"Ungu",hex:"#7A4FAE"},{name:"Coklat",hex:"#6A4A34"},
  {name:"Sage",hex:"#9CAF88"},{name:"Beige",hex:"#E6D8BF"},{name:"Turkis",hex:"#16BFB0"},
  {name:"Hijau Botol",hex:"#1F5138"},{name:"Biru Benhur",hex:"#2A4A9C"},{name:"Gold",hex:"#C9A24B"}
];
// Hasilkan tepat "count" warna: pakai PALETTE dulu, sisanya placeholder "Warna N".
function stkFill(count){
  var a=[];
  for(var i=0;i<count;i++) a.push(i<STK_PALETTE.length ? STK_PALETTE[i] : {name:"Warna "+(i+1),hex:stkHslHex(i)});
  return a;
}
// Gabung daftar warna asli + placeholder sampai "total".
function stkPad(real,total){
  var a=real.slice();
  for(var i=real.length;i<total;i++) a.push({name:"Warna "+(i+1),hex:stkHslHex(i)});
  return a;
}
// 32 warna asli Cotton Combed 24s (dari katalog) — sisanya sampai 77 = placeholder.
var STK_COMBED24=[
  {name:"Abu",hex:"#9AA1A6"},{name:"Abu Muda",hex:"#C3C8CC"},{name:"Aqua Foam",hex:"#A9E5D0"},
  {name:"Army Green",hex:"#4B5320"},{name:"Banana Cream",hex:"#F4E6A1"},{name:"Beige",hex:"#E6D8BF"},
  {name:"Biru Baby",hex:"#A9D3E8"},{name:"Biru New",hex:"#20418C"},{name:"Biru Pon",hex:"#2F6FD0"},
  {name:"Biru Sedang",hex:"#3F78D6"},{name:"Coklat",hex:"#6A4A34"},{name:"Cream",hex:"#F1E9D2"},
  {name:"Dusty",hex:"#B79AA3"},{name:"Hijau Botol",hex:"#1F5138"},{name:"Hijau Tosca",hex:"#1FAE9A"},
  {name:"Hitam",hex:"#23272E"},{name:"Kuning",hex:"#F2C43D"},{name:"Lavender",hex:"#C3B5E0"},
  {name:"Maroon",hex:"#6E2230"},{name:"Merah",hex:"#C33636"},{name:"Merah Bata",hex:"#B25A3E"},
  {name:"Mocca",hex:"#8A6A4F"},{name:"Mustard",hex:"#D1962A"},{name:"Navy",hex:"#1F2A52"},
  {name:"Olive",hex:"#6F7331"},{name:"Orange",hex:"#E08535"},{name:"Peach",hex:"#F4C1A3"},
  {name:"Pink",hex:"#E79BB6"},{name:"Putih",hex:"#F5F5F1"},{name:"Salem",hex:"#E9A58C"},
  {name:"Tosca",hex:"#16BFB0"},{name:"Ungu",hex:"#7A4FAE"}
];

// image: "" -> URL foto kategori (landscape, mis. 1200x675 / 16:9). Kosong = pakai tekstur default.
var stockProducts = [
  { name: "Cotton", image: "Image/cotton stock.png", varian: [
    { name: 'Cotton Combed 20s 42"', stock: 3200, colors: stkFill(4) },
    { name: 'Cotton Combed 24s 42"', stock: 5200, colors: stkPad(STK_COMBED24, 77) },
    { name: 'Cotton Combed 30s 42"', stock: 4800, colors: stkFill(75) }
  ]},
  { name: "CVC", image: "Image/cvc stock.png", varian: [
    { name: 'CVC 20s Lacoste 36"', stock: 2400, colors: stkFill(31) },
    { name: 'CVC 24s Lacoste 36"', stock: 3600, colors: stkFill(67) },
    { name: 'CVC 24s Lacoste 42"', stock: 300, colors: stkFill(2) }
  ]},
  { name: "Cotton Special", image: "Image/cotton special stock.png", varian: [
    { name: "Rocky Cotton", stock: 2450, colors: stkFill(13) },
    { name: 'Versa Heavy Weight Rocky Hard 36"', stock: 800, colors: stkFill(1) },
    { name: 'Cotton Elastech 30s 72"', stock: 1900, colors: stkFill(4) }
  ]},
  { name: "Bamboo Cotton", image: "Image/bamboo stock.png", varian: [
    { name: 'Bamboo Cotton 30s 42"', stock: 4320, colors: stkFill(8) }
  ]},
  { name: "Knitease Danball", image: "Image/danball stock.png", varian: [
    { name: 'Knitease Danball 200 64"', stock: 1850, colors: stkFill(6) }
  ]},
  { name: "STARTER PACK", image: "Image/starterpack stock.png", varian: [
    { name: 'Starter Versa Cotton 24s 42"', stock: 400, colors: stkFill(1) }
  ]}
];

// Derive per-product stock total from variants (status labels removed by request)
stockProducts.forEach(function(p) {
  p.stock = p.varian.reduce(function(a, v) { return a + v.stock; }, 0);
});

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, function(c) {
    return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];
  });
}

// ═══════════════════ STOCK: state for search + filter ═══════════════════
var stockState = {
  query: '',
  filter: 'all'
};

var STK_COVER_TINTS = [
  'linear-gradient(150deg,#0e7d6c,#0a5249)','linear-gradient(150deg,#3a6ea5,#274b73)',
  'linear-gradient(150deg,#6b7a3a,#47531f)','linear-gradient(150deg,#8a5a3c,#5e3a26)',
  'linear-gradient(150deg,#7a4f8a,#4f2f5e)','linear-gradient(150deg,#b08428,#7a5a17)',
  'linear-gradient(150deg,#2f8f7a,#1f5f52)','linear-gradient(150deg,#a85a5a,#6e2f2f)',
  'linear-gradient(150deg,#4a5568,#2d3444)','linear-gradient(150deg,#2f8fb0,#1f6076)'
];
var STK_ICONS = {
  "Cotton":          '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="2.3"/><circle cx="8.5" cy="10.5" r="2.3"/><circle cx="15.5" cy="10.5" r="2.3"/><circle cx="12" cy="12" r="2.6"/><path d="M12 14.5V20M9.5 20h5"/></svg>',
  "CVC":             '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 4v16M11 4v16M17 4v16M5 8h14M5 14h14"/></svg>',
  "Cotton Special":  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3s6 6.5 6 11a6 6 0 11-12 0c0-4.5 6-11 6-11z"/></svg>',
  "Bamboo Cotton":   '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 20C4 9 20 4 20 4s-1 16-12 16c-3 0-4-2-4-2z"/><path d="M8 16l7-7"/></svg>',
  "Knitease Danball":'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3l8 4v10l-8 4-8-4V7l8-4z"/><path d="M4 7l8 4 8-4M12 11v10"/></svg>',
  "STARTER PACK":    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-5 9 5-9 5-9-5z"/><path d="M3 9v6l9 5 9-5V9"/></svg>',
  _default:          '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="7" y="4" width="10" height="16" rx="2"/><path d="M10 4v16M14 4v16"/></svg>'
};

// Build ONE category accordion: category bar -> variants -> color swatch grid.
function buildStockCardHTML(p, pi) {
  var catIcon = STK_ICONS[p.name] || STK_ICONS._default;
  var coverImg = p.image ? '<img src="' + escapeHtml(p.image) + '" alt="' + escapeHtml(p.name) + '" loading="lazy" onerror="this.remove()">' : '';
  var variantsHTML = p.varian.map(function(v) {
    var colorTiles = v.colors.map(function(c) {
      return '<div class="stk-color" title="' + escapeHtml(c.name) + '">' +
        '<span class="stk-sw woven" style="--c:' + c.hex + '"></span>' +
        '<span class="stk-cn">' + escapeHtml(c.name) + '</span>' +
      '</div>';
    }).join('');
    return '<div class="stk-var" data-vname="' + escapeHtml(v.name.toLowerCase()) + '">' +
      '<button class="stk-var-head" type="button" data-toggle="var">' +
        '<span class="stk-var-name">' + escapeHtml(v.name) + '</span>' +
        '<span class="stk-var-kg">' + v.stock.toLocaleString('id-ID') + '<i>Kg</i></span>' +
        '<span class="stk-warna">' + v.colors.length + ' warna</span>' +
        '<svg class="stk-chev sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"/></svg>' +
      '</button>' +
      '<div class="stk-var-body"><div><div class="stk-colors">' + colorTiles + '</div></div></div>' +
    '</div>';
  }).join('');
  return '<div class="stk-cat" data-cat="' + escapeHtml(p.name) + '">' +
    '<button class="stk-cat-head" type="button" data-toggle="cat">' +
      '<span class="stk-cat-cover"><span class="cover-bg"></span>' + coverImg + '</span>' +
      '<span class="stk-cat-title"><b>' + escapeHtml(p.name) + '</b>' + catIcon + '</span>' +
      '<span class="stk-cat-variants">' + p.varian.length + ' varian</span>' +
      '<span class="stk-cat-spacer"></span>' +
      '<span class="stk-cat-kg">' + p.stock.toLocaleString('id-ID') + '<i>Kg</i></span>' +
      '<svg class="stk-chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"/></svg>' +
    '</button>' +
    '<div class="stk-cat-body"><div><div class="stk-cat-inner">' + variantsHTML + '</div></div></div>' +
  '</div>';
}

function filterStock() {
  var q = stockState.query.trim().toLowerCase();
  var f = stockState.filter;
  return stockProducts.map(function(p, pi) { return { p: p, pi: pi }; }).filter(function(item) {
    var p = item.p;
    if (f !== 'all' && p.name !== f) return false;
    if (!q) return true;
    if (p.name.toLowerCase().indexOf(q) !== -1) return true;
    // also match variant names
    return p.varian.some(function(v) { return v.name.toLowerCase().indexOf(q) !== -1; });
  });
}

function renderStockGrid() {
  var grid = document.getElementById('stockGrid');
  var info = document.getElementById('stockResultInfo');
  var results = filterStock();

  // Result info line
  var totalCount = stockProducts.length;
  if (stockState.query || stockState.filter !== 'all') {
    info.innerHTML = 'Menampilkan <strong>' + results.length + '</strong> dari <strong>' + totalCount + '</strong> kategori kain';
    info.style.display = 'block';
  } else {
    info.style.display = 'none';
  }

  if (results.length === 0) {
    grid.innerHTML =
      '<div class="stock-empty">' +
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/><path d="M8 11h6"/></svg>' +
        '<h4>Kain tidak ditemukan</h4>' +
        '<p>Coba kata kunci lain atau pilih kategori berbeda.</p>' +
        '<button type="button" id="stockResetBtn">Reset Pencarian</button>' +
      '</div>';
    var resetBtn = document.getElementById('stockResetBtn');
    if (resetBtn) resetBtn.addEventListener('click', resetStockFilters);
    return;
  }
  grid.innerHTML = results.map(function(item) {
    return buildStockCardHTML(item.p, item.pi);
  }).join('');

  // Auto-open when searching so results are visible; otherwise open the first category.
  if (stockState.query) {
    var qq = stockState.query.trim().toLowerCase();
    grid.querySelectorAll('.stk-cat').forEach(function(cat){ cat.classList.add('open'); });
    grid.querySelectorAll('.stk-var').forEach(function(vr){
      if (vr.getAttribute('data-vname').indexOf(qq) !== -1) vr.classList.add('open');
    });
  } else {
    var firstCat = grid.querySelector('.stk-cat');
    if (firstCat) firstCat.classList.add('open');
  }
}

// Build category (fabric-type) filter pills from the product data.
// Each pill shows how many variants that category holds.
function renderStockFilters() {
  var wrap = document.getElementById('stockFilters');
  if (!wrap) return;
  var totalVarian = stockProducts.reduce(function(a, p) { return a + p.varian.length; }, 0);
  var html = '<button class="stock-filter active" data-filter="all" type="button">' +
      'Semua<span class="stock-filter-count">' + totalVarian + '</span>' +
    '</button>';
  html += stockProducts.map(function(p) {
    return '<button class="stock-filter" data-filter="' + escapeHtml(p.name) + '" type="button">' +
      escapeHtml(p.name) +
      '<span class="stock-filter-count">' + p.varian.length + '</span>' +
    '</button>';
  }).join('');
  wrap.innerHTML = html;
}

function setActiveFilterPill() {
  document.querySelectorAll('.stock-filter').forEach(function(b) {
    b.classList.toggle('active', b.getAttribute('data-filter') === stockState.filter);
  });
}

function resetStockFilters() {
  stockState.query = '';
  stockState.filter = 'all';
  var input = document.getElementById('stockSearch');
  if (input) input.value = '';
  var wrap = document.getElementById('stockSearchWrap');
  if (wrap) wrap.classList.remove('has-value');
  setActiveFilterPill();
  renderStockGrid();
}

function initStockControls() {
  var input = document.getElementById('stockSearch');
  var wrap = document.getElementById('stockSearchWrap');
  var clearBtn = document.getElementById('stockSearchClear');

  input.addEventListener('input', function() {
    stockState.query = input.value;
    wrap.classList.toggle('has-value', input.value.length > 0);
    renderStockGrid();
  });

  clearBtn.addEventListener('click', function() {
    input.value = '';
    stockState.query = '';
    wrap.classList.remove('has-value');
    input.focus();
    renderStockGrid();
  });

  var filters = document.getElementById('stockFilters');
  if (filters) {
    filters.addEventListener('click', function(e) {
      var btn = e.target.closest('.stock-filter');
      if (!btn) return;
      stockState.filter = btn.getAttribute('data-filter');
      setActiveFilterPill();
      btn.scrollIntoView({ inline: 'center', block: 'nearest', behavior: 'smooth' });
      renderStockGrid();
    });
  }
}

function initFilterSlider() {
  var wrap  = document.querySelector('.stock-filters-wrap');
  var track = document.getElementById('stockFilters');
  if (!wrap || !track) return;
  function update() {
    var max = track.scrollWidth - track.clientWidth - 1;
    wrap.classList.toggle('can-left',  track.scrollLeft > 2);
    wrap.classList.toggle('can-right', track.scrollLeft < max);
  }
  var L = wrap.querySelector('.stock-filters-arrow.left');
  var R = wrap.querySelector('.stock-filters-arrow.right');
  if (L) L.addEventListener('click', function () { track.scrollBy({ left: -220, behavior: 'smooth' }); });
  if (R) R.addEventListener('click', function () { track.scrollBy({ left:  220, behavior: 'smooth' }); });
  track.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update);
  update();
}

function renderStockCards() {
  renderStockFilters();
  initStockControls();
  initFilterSlider();
  renderStockGrid();

  // Single "Lihat Varian" accordion per card (colors now shown inline — no 2nd level)
  var grid = document.getElementById('stockGrid');
  grid.addEventListener('click', function(e) {
    var catToggle = e.target.closest('[data-toggle="cat"]');
    if (catToggle) { var cat = catToggle.closest('.stk-cat'); if (cat) cat.classList.toggle('open'); return; }
    var varToggle = e.target.closest('[data-toggle="var"]');
    if (varToggle) { var vr = varToggle.closest('.stk-var'); if (vr) vr.classList.toggle('open'); }
  });
}

// ═══════════════════ ANIMATED COUNTERS ═══════════════════
function animateCounter(el, target, duration) {
  duration = duration || 1200;
  var start = performance.now();
  function step(now) {
    var progress = Math.min((now - start) / duration, 1);
    var eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.floor(eased * target).toLocaleString('id-ID');
    if (progress < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}
function initCounters() {
  var totalStock = stockProducts.reduce(function(a, b) { return a + b.stock; }, 0);
  var totalKategori = stockProducts.length;
  var totalVarian = stockProducts.reduce(function(a, b) { return a + b.varian.length; }, 0);
  var obs = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        animateCounter(document.getElementById('totalStockNum'), totalStock);
        animateCounter(document.getElementById('totalKategori'), totalKategori);
        animateCounter(document.getElementById('totalVarian'), totalVarian);
        obs.disconnect();
      }
    });
  }, { threshold: 0.2 });
  obs.observe(document.querySelector('.stock-summary'));
}

function updateSyncTime() {
  var now = new Date();
  var opts = { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' };
  document.getElementById('syncTime').textContent = 'Sync terakhir: ' + now.toLocaleString('id-ID', opts);
}

// Smooth nav links
document.querySelectorAll('.nav-link[href^="#"]').forEach(function(link) {
  link.addEventListener('click', function(e) {
    e.preventDefault();
    var target = document.querySelector(this.getAttribute('href'));
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    document.querySelectorAll('.nav-link').forEach(function(l) { l.classList.remove('active'); });
    this.classList.add('active');
    closeMobileMenu();
  });
});

// ═══════════════════ ANIMATED COUNTERS ═══════════════════
function animateCounter(el, target, duration) {
  duration = duration || 1200;
  var start = performance.now();
  function step(now) {
    var progress = Math.min((now - start) / duration, 1);
    var eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.floor(eased * target).toLocaleString('id-ID');
    if (progress < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}
function initCounters() {
  var totalStock = stockProducts.reduce(function(a, b) { return a + b.stock; }, 0);
  var totalKategori = stockProducts.length;
  var totalVarian = stockProducts.reduce(function(a, b) { return a + b.varian.length; }, 0);
  var obs = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        animateCounter(document.getElementById('totalStockNum'), totalStock);
        animateCounter(document.getElementById('totalKategori'), totalKategori);
        animateCounter(document.getElementById('totalVarian'), totalVarian);
        obs.disconnect();
      }
    });
  }, { threshold: 0.2 });
  obs.observe(document.querySelector('.stock-summary'));
}

function updateSyncTime() {
  var now = new Date();
  var opts = { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' };
  document.getElementById('syncTime').textContent = 'Sync terakhir: ' + now.toLocaleString('id-ID', opts);
}

// ═══════════════════ ARTIKEL / BLOG ═══════════════════
// Data manual — update array ini untuk mengganti artikel yang tampil di homepage.
// Ambil 4 artikel terbaru dari https://fabriku.com/blog secara manual.
var artikelData = [
  {
    title: "Kenapa Kaos Warna Hitam Populer? Simak 7 Alasan di Baliknya",
    url: "https://fabriku.com/blog/kenapa-kaos-warna-hitam-populer",
    image: "https://fabriku.com/storage/uploads/YbXEnM6ZD0iV4FiGdORGhojPyW7syHBXrFPKEGLS.png",
    date: "15 Jul 2025",
    category: "Umum"
  },
  {
    title: "CVC Lacoste Dusty Rose: Bahan Premium untuk Fashion Elegan",
    url: "https://fabriku.com/blog/kain-cvc-lacoste-fabric-dusty-rose",
    image: "https://fabriku.com/storage/uploads/ERiLmr9JbzzAVCGkYSZuUgWV5KFiqrBv5NhFMKNK.png",
    date: "13 Jul 2025",
    category: "Umum"
  },
  {
    title: "Kenali Apa itu Bahan Oxford: Pengertian, Kelebihan, Kekurangan, dan Kegunaannya",
    url: "https://fabriku.com/blog/apa-itu-bahan-oxford",
    image: "https://fabriku.com/storage/uploads/WIPM27qqY4vMxnrWIK6B7MdqfolhRww4vyugkJIV.webp",
    date: "08 Jul 2025",
    category: "Umum"
  },
  {
    title: "Bahan Katun Mikro: Kenapa Banyak Brand Memilih Kain Ini?",
    url: "https://fabriku.com/blog/bahan-katun-mikro-kenapa-banyak-brand-memilih-kain-ini",
    image: "https://fabriku.com/storage/uploads/aJ8SjiFHqTAXrjq6KLMibBimttfo6lkkTa9tk3E4.png",
    date: "30 Jun 2025",
    category: "Bahan"
  }
];

function renderArtikelCards() {
  var grid = document.getElementById('artikelGrid');
  grid.innerHTML = artikelData.map(function(a) {
    var img = a.image
      ? '<img src="' + a.image + '" alt="' + a.title.replace(/"/g,'&quot;') + '" loading="lazy" onerror="this.style.display=\'none\'">'
      : '';
    var cat = a.category
      ? '<span class="artikel-category">' + a.category + '</span>'
      : '';
    var date = a.date
      ? '<span class="artikel-date">' +
          '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>' +
          a.date +
        '</span>'
      : '';
    return '<a class="artikel-card" href="' + a.url + '" target="_blank" rel="noopener">' +
      '<div class="artikel-card-img">' + cat + img + '</div>' +
      '<div class="artikel-card-body">' +
        date +
        '<h3>' + a.title + '</h3>' +
        '<span class="artikel-cta">Baca Selengkapnya ' +
          '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>' +
        '</span>' +
      '</div>' +
    '</a>';
  }).join('');
}

// ═══════════════════ FASHION INSPO TAB SWITCHER ═══════════════════
function initInspoTabs() {
  var tabs = document.querySelectorAll('.inspo-tab');
  var panels = document.querySelectorAll('.inspo-panel');
  tabs.forEach(function(tab) {
    tab.addEventListener('click', function() {
      var target = tab.getAttribute('data-tab');
      tabs.forEach(function(t) { t.classList.toggle('active', t === tab); });
      panels.forEach(function(p) { p.classList.toggle('active', p.getAttribute('data-panel') === target); });
      // Scroll tab yang aktif ke tengah viewport tab bar (untuk mobile)
      tab.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      // Newly-visible carousel needs its arrow states recalculated
      setTimeout(refreshInspoNav, 60);
    });
  });
}

// ═══════════════════ FASHION INSPO: product carousels ═══════════════════
var inspoNavUpdaters = [];
function refreshInspoNav() { inspoNavUpdaters.forEach(function(fn) { fn(); }); }
function initInspoCarousels() {
  inspoNavUpdaters = [];
  document.querySelectorAll('.inspo-carousel').forEach(function(car) {
    var track = car.querySelector('.inspo-carousel-track');
    var prev = car.querySelector('.inspo-carousel-nav.prev');
    var next = car.querySelector('.inspo-carousel-nav.next');
    if (!track) return;

    function step() {
      var card = track.querySelector('.inspo-pcard');
      var gap = 14;
      return card ? (card.offsetWidth + gap) * 1.5 : 300;
    }
    function update() {
      var max = track.scrollWidth - track.clientWidth - 2;
      if (prev) prev.toggleAttribute('disabled', track.scrollLeft <= 2);
      if (next) next.toggleAttribute('disabled', track.scrollLeft >= max);
    }
    if (prev) prev.addEventListener('click', function() { track.scrollBy({ left: -step(), behavior: 'smooth' }); });
    if (next) next.addEventListener('click', function() { track.scrollBy({ left: step(), behavior: 'smooth' }); });
    track.addEventListener('scroll', update, { passive: true });

    inspoNavUpdaters.push(update);
    update();
  });
  window.addEventListener('resize', refreshInspoNav);
}

// ═══════════════════ NEW PRODUCTS: whole-card tap target ═══════════════════
// Adds a stretched link over each product card so the entire card is clickable
// (bigger, more mobile-friendly hit area), while the favorite button and
// "Lihat" CTA stay on top and clickable.
function initProductCardLinks() {
  document.querySelectorAll('.product-card').forEach(function(card) {
    if (card.querySelector('.product-card-link')) return;
    var cta = card.querySelector('.product-cta');
    var title = card.querySelector('h3');
    var a = document.createElement('a');
    a.className = 'product-card-link';
    a.href = (cta && cta.getAttribute('href')) || '#';
    a.setAttribute('aria-label', 'Lihat ' + (title ? title.textContent.trim() : 'produk'));
    card.insertBefore(a, card.firstChild);
  });
}

// ═══════════════════ MEMBER GREETING (personalized) ═══════════════════
// ▼▼▼ EDIT / WIRE THIS TO YOUR BACKEND ▼▼▼
// Replace these values with the logged-in member's real data (e.g. from your
// login session / API). Only `name`, `tier`, and `points` are required — the
// rest have sensible defaults.
var memberData = {
  name: "Budi Santoso",      // full name of the logged-in member
  phone: "082123456789",     // member's phone — last 4 digits become their Member ID (#6789)
  logoUrl: "",               // Fabriku logo for the card. Empty = use the embedded logo.
                             //   Set a path/URL (e.g. "Image/logo.png") to override it.
  tier: "Gold",              // one of: Bronze, Silver, Gold, Platinum, Diamond
  points: 20000,             // current loyalty points (dihitung dari total belanja tahun ini)
  lastYearSpend: 2400000000, // total belanja (Rp) tahun lalu — dasar penentuan tier aktif saat ini
  totalOrderKg: 1240,        // total kain yang dipesan tahun ini (dalam KG)
  totalSaved: 3000000000,    // total belanja (Rp) tahun ini
  expiryDate: "",            // status expiry, e.g. "31 Des 2026". Leave "" to auto-use
                             //   31 Des of the current year (aligns with New Year renewal).
  voucher: {
    title: "Diskon 15%",
    desc: "Min. belanja Rp 500.000 · berlaku untuk semua kain",
    code: "MEMBERHEMAT15",
    expiry: "31 Agu 2026"
  },
  // Diisi otomatis dari hasil lookup Supabase (RPC get_my_loyalty). Saat null,
  // progress bar & proyeksi tahun depan pakai kalkulasi lokal (mode demo/preview).
  real: null // { nextTier, amountToNext, progressPercent, projectedTier }
};

// Points needed to REACH each tier. Progress bar fills toward the next one up.
// Disesuaikan dengan loyalty_settings di Supabase: Silver Rp500jt, Gold Rp2M,
// Platinum Rp5M, Diamond Rp10M — dikonversi ke poin (1 poin = Rp150.000 belanja).
var tierThresholds = { Bronze: 0, Silver: 3333, Gold: 13333, Platinum: 33333, Diamond: 66667 };
var tierOrder = ["Bronze", "Silver", "Gold", "Platinum", "Diamond"];
// Small badge-pill palette class
var tierClass     = { Bronze: "tier-bronze", Silver: "tier-silver", Gold: "tier-gold", Platinum: "tier-platinum", Diamond: "tier-diamond" };
// Card-finish class (green base + metallic tier sheen)
var tierCardClass = { Bronze: "tier-card-bronze", Silver: "tier-card-silver", Gold: "tier-card-gold", Platinum: "tier-card-platinum", Diamond: "tier-card-diamond" };
// ▲▲▲ END EDITABLE CONFIG ▲▲▲

// ── Sample member directory — HANYA untuk tombol preview tier di admin/demo. ──
// Pencarian member yang SEBENARNYA (form di bawah) sudah pakai Supabase Edge
// Function `member-lookup`, bukan object ini. Aman dihapus bersama initTierPreview()
// dan blok .tier-preview di HTML kalau sudah tidak dibutuhkan.
var memberDirectory = {
  "081311111111": { name:"Rina Wijaya",  phone:"081311111111", tier:"Bronze",   points:1200,  lastYearSpend:150000000,   totalOrderKg:85,   totalSaved:180000000,   voucher:{ title:"Diskon 5%",  desc:"Min. belanja Rp 250.000 · khusus member",        code:"WELCOME5",     expiry:"31 Agu 2026" } },
  "081322222222": { name:"Andi Pratama", phone:"081322222222", tier:"Silver",   points:6000,  lastYearSpend:620000000,   totalOrderKg:430,  totalSaved:900000000,   voucher:{ title:"Diskon 10%", desc:"Min. belanja Rp 400.000 · semua kain",           code:"SILVER10",     expiry:"31 Agu 2026" } },
  "081333333333": { name:"Budi Santoso", phone:"081333333333", tier:"Gold",     points:20000, lastYearSpend:2400000000,  totalOrderKg:1240, totalSaved:3000000000,  voucher:{ title:"Diskon 15%", desc:"Min. belanja Rp 500.000 · berlaku untuk semua kain", code:"MEMBERHEMAT15", expiry:"31 Agu 2026" } },
  "081344444444": { name:"Dewi Lestari", phone:"081344444444", tier:"Platinum", points:45000, lastYearSpend:5800000000,  totalOrderKg:3200, totalSaved:6750000000,  voucher:{ title:"Diskon 20%", desc:"Min. belanja Rp 750.000 · + gratis ongkir",        code:"PLATINUM20",   expiry:"31 Agu 2026" } },
  "081355555555": { name:"Siti Rahayu",  phone:"081355555555", tier:"Diamond",  points:90000, lastYearSpend:12000000000, totalOrderKg:6100, totalSaved:13500000000, voucher:{ title:"Diskon 25%", desc:"Tanpa min. belanja · + prioritas restok",          code:"DIAMOND25",    expiry:"31 Agu 2026" } }
};
var tierSamplePhone = { Bronze:"081311111111", Silver:"081322222222", Gold:"081333333333", Platinum:"081344444444", Diamond:"081355555555" };

// Voucher per tier — dipakai untuk hasil lookup Supabase (yang tidak mengembalikan
// voucher, hanya data poin/tier). Sesuaikan sesuai promo yang berlaku.
var voucherByTier = {
  Bronze:   { title:"Diskon 5%",  desc:"Min. belanja Rp 250.000 · khusus member",            code:"WELCOME5",      expiry:"31 Des 2026" },
  Silver:   { title:"Diskon 10%", desc:"Min. belanja Rp 400.000 · semua kain",                code:"SILVER10",      expiry:"31 Des 2026" },
  Gold:     { title:"Diskon 15%", desc:"Min. belanja Rp 500.000 · berlaku untuk semua kain",  code:"MEMBERHEMAT15", expiry:"31 Des 2026" },
  Platinum: { title:"Diskon 20%", desc:"Min. belanja Rp 750.000 · + gratis ongkir",           code:"PLATINUM20",    expiry:"31 Des 2026" },
  Diamond:  { title:"Diskon 25%", desc:"Tanpa min. belanja · + prioritas restok",             code:"DIAMOND25",     expiry:"31 Des 2026" }
};

// ── Konfigurasi Supabase (project egarfabrikudatanalyst) ──
var SUPABASE_FN_URL = "https://rdwnrmxheknfjmmdwlvc.supabase.co/functions/v1/member-lookup";
var SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJkd25ybXhoZWtuZmptbWR3bHZjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ1OTE4NjAsImV4cCI6MjEwMDE2Nzg2MH0.9Vnn1c79af0JypfRMnd-HjTj0jM-skLXUXHJWMmC1Jg";

function greetingForHour(h) {
  if (h >= 4 && h < 11)  return "Selamat pagi";
  if (h >= 11 && h < 15) return "Selamat siang";
  if (h >= 15 && h < 18) return "Selamat sore";
  return "Selamat malam";
}
// Last 4 digits of a phone number -> used as the short Member ID
function last4(phone) {
  var digits = (phone || "").replace(/\D/g, "");
  return digits.length >= 4 ? digits.slice(-4) : (digits || "0000");
}
// Which tier a points total qualifies for (highest threshold <= points)
function tierForPoints(points) {
  var t = tierOrder[0];
  for (var i = 0; i < tierOrder.length; i++) {
    if (points >= tierThresholds[tierOrder[i]]) t = tierOrder[i];
  }
  return t;
}

var _memberBound = false;

function renderMemberGreeting() {
  var d = memberData;

  // Identity + greeting
  document.getElementById('memberGreetTime').textContent = greetingForHour(new Date().getHours());
  document.getElementById('memberName').textContent = d.name || "Member";
  document.getElementById('memberSince').textContent = (d.lastYearSpend || 0).toLocaleString('id-ID');
  document.getElementById('memberIdShort').textContent = "#" + last4(d.phone);
  document.getElementById('memberExpiry').textContent = d.expiryDate || ("31 Des " + new Date().getFullYear());

  // Logo: show the full Fabriku logo; fall back to a text mark only if it fails to load.
  var avatar = document.getElementById('memberAvatar');
  var logo = document.getElementById('memberLogo');
  var src = d.logoUrl || logo.getAttribute('src') || "";
  logo.onerror = function() { avatar.classList.add('logo-failed'); };
  if (src && logo.getAttribute('src') !== src) logo.src = src;
  if (logo.complete && logo.naturalWidth === 0 && logo.getAttribute('src')) avatar.classList.add('logo-failed');

  // Voucher
  var v = d.voucher || {};
  document.getElementById('voucherTitle').innerHTML = (v.title || 'Voucher').replace(/(\d+%?)/, '<span>$1</span>');
  document.getElementById('voucherDesc').textContent = v.desc || '';
  document.getElementById('voucherCode').textContent = v.code || '—';
  document.getElementById('voucherExp').textContent = v.expiry || '';

  // One-time bindings (copy button, counter animation, preview switcher)
  if (!_memberBound) {
    _memberBound = true;

    var copyBtn = document.getElementById('voucherCopyBtn');
    var copyLabel = copyBtn.querySelector('span');
    copyBtn.addEventListener('click', function() {
      var code = ((memberData.voucher && memberData.voucher.code) || '').trim();
      var done = function() {
        copyBtn.classList.add('copied');
        copyLabel.textContent = 'Tersalin';
        setTimeout(function() { copyBtn.classList.remove('copied'); copyLabel.textContent = 'Salin'; }, 1800);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(code).then(done).catch(function() { fallbackCopy(code); done(); });
      } else { fallbackCopy(code); done(); }
    });

    // Counters animate when the membership is revealed (see showMemberReveal), not on scroll.
    initTierPreview();
    initMemberGate();
  }

  function fallbackCopy(text) {
    var ta = document.createElement('textarea');
    ta.value = text; ta.style.position = 'fixed'; ta.style.opacity = '0';
    document.body.appendChild(ta); ta.select();
    try { document.execCommand('copy'); } catch (e) {}
    document.body.removeChild(ta);
  }

  // Tier-dependent visuals (card finish, badges, ladder, progress, next-year)
  updateMemberTierUI(false);
}

// Everything that changes with tier/points. Called on load and by the preview switcher.
function updateMemberTierUI(animatePoints) {
  var d = memberData;
  var tier = tierOrder.indexOf(d.tier) === -1 ? "Bronze" : d.tier;
  var idx = tierOrder.indexOf(tier);

  // Card finish
  var card = document.getElementById('memberCard');
  if (card) {
    card.className = card.className.replace(/tier-card-(bronze|silver|gold|platinum|diamond)/g, '').replace(/\s+/g, ' ').trim() + ' ' + tierCardClass[tier];
  }

  // Tier badges (hero pill + membership-progress pill)
  [['memberTierBadge', 'memberTierName'], ['memberTierBadge2', 'memberTierName2']].forEach(function(ids) {
    var badge = document.getElementById(ids[0]);
    badge.className = badge.className.replace(/tier-(bronze|silver|gold|platinum|diamond)/g, '').replace(/\s+/g, ' ').trim() + ' ' + tierClass[tier];
    document.getElementById(ids[1]).textContent = tier;
  });

  // Re-count the stat numbers when switching preview tiers
  if (animatePoints) {
    animateCounter(document.getElementById('memberPoints'), d.points || 0, 700);
    animateCounter(document.getElementById('memberOrderKg'), d.totalOrderKg || 0, 700);
    animateCounter(document.getElementById('memberSaved'), d.totalSaved || 0, 700);
  }

  // Tier ladder
  var steps = document.querySelectorAll('#memberLadder .member-tier-step');
  steps.forEach(function(step, i) {
    step.classList.remove('reached', 'current');
    if (i < idx) step.classList.add('reached');
    if (i === idx) step.classList.add('current');
  });

  // Progress toward the next tier
  var fill = document.getElementById('memberProgressFill');
  var text = document.getElementById('memberProgressText');
  if (d.real) {
    // Data asli dari Supabase: pakai progress & target yang sudah dihitung backend.
    var progressed = !d.real.nextTier ? 1 : Math.min(Math.max((d.real.progressPercent || 0) / 100, 0), 1);
    setTimeout(function() { fill.style.width = (progressed * 100).toFixed(1) + '%'; }, 200);
    if (!d.real.nextTier) {
      text.innerHTML = 'Kamu sudah di tier tertinggi, <b>' + tier + '</b>. Terima kasih! 🎉';
    } else {
      text.innerHTML = '<b>Rp' + (d.real.amountToNext || 0).toLocaleString('id-ID') + '</b> lagi belanja tahun ini menuju <b>' + d.real.nextTier + '</b>.';
    }
  } else if (idx >= tierOrder.length - 1) {
    fill.style.width = '100%';
    text.innerHTML = 'Kamu sudah di tier tertinggi, <b>' + tier + '</b>. Terima kasih! 🎉';
  } else {
    var nextTier = tierOrder[idx + 1];
    var base = tierThresholds[tier];
    var need = tierThresholds[nextTier];
    var span = Math.max(need - base, 1);
    var progressed2 = Math.min(Math.max((d.points - base) / span, 0), 1);
    var remaining = Math.max(need - d.points, 0);
    setTimeout(function() { fill.style.width = (progressed2 * 100).toFixed(1) + '%'; }, 200);
    text.innerHTML = '<b>' + remaining.toLocaleString('id-ID') + ' poin</b> lagi menuju <b>' + nextTier + '</b>.';
  }

  updateNextYearStatus(tier);
}

// Projects the member's status for 1 Jan next year, based purely on current points.
function updateNextYearStatus(currentTier) {
  var d = memberData;
  var nextYear = new Date().getFullYear() + 1;
  var box = document.getElementById('memberNextYear');
  var headline = document.getElementById('memberNextYearHeadline');
  var sub = document.getElementById('memberNextYearSub');
  var yEl = document.getElementById('memberNextYearY');
  if (yEl) yEl.textContent = nextYear;
  if (!box) return;

  var projected = d.real ? (d.real.projectedTier || currentTier) : tierForPoints(d.points || 0);
  var ci = tierOrder.indexOf(currentTier);
  var pi = tierOrder.indexOf(projected);
  box.classList.remove('is-up', 'is-hold', 'is-down');

  if (pi > ci) {
    box.classList.add('is-up');
    headline.innerHTML = 'Naik ke <span class="up">' + projected + '</span> 🎉';
  } else if (pi === ci) {
    box.classList.add('is-hold');
    headline.innerHTML = 'Bertahan di <span class="up">' + projected + '</span>';
  } else {
    box.classList.add('is-down');
    headline.innerHTML = 'Turun ke <span class="up">' + projected + '</span>';
  }

  if (d.real) {
    if (!d.real.nextTier) {
      sub.innerHTML = 'Dengan belanja Rp' + (d.totalSaved || 0).toLocaleString('id-ID') + ' tahun ini, kamu sudah mengunci tier tertinggi untuk ' + nextYear + '.';
    } else {
      sub.innerHTML = 'Dari Rp' + (d.totalSaved || 0).toLocaleString('id-ID') + ' belanja tahun ini · <b>Rp' + (d.real.amountToNext || 0).toLocaleString('id-ID') + '</b> lagi untuk membuka <b>' + d.real.nextTier + '</b> di ' + nextYear + '.';
    }
    return;
  }

  if (pi >= tierOrder.length - 1) {
    sub.innerHTML = 'Dengan ' + (d.points || 0).toLocaleString('id-ID') + ' poin, kamu sudah mengunci tier tertinggi untuk ' + nextYear + '.';
  } else {
    var upNext = tierOrder[pi + 1];
    var gap = Math.max(tierThresholds[upNext] - (d.points || 0), 0);
    sub.innerHTML = 'Dari ' + (d.points || 0).toLocaleString('id-ID') + ' poin tahun ini · <b>' + gap.toLocaleString('id-ID') + ' poin</b> lagi untuk membuka <b>' + upNext + '</b> di ' + nextYear + '.';
  }
}

// ─── TIER PREVIEW SWITCHER (demo only) ───────────────────────────────────────
// Lets you see all five card finishes without editing code. To remove it later,
// delete this function, the initTierPreview() call above, and the .tier-preview
// block in the HTML. Representative points keep the projection coherent per tier.
function initTierPreview() {
  var wrap = document.getElementById('tierPreview');
  if (!wrap) return;
  wrap.querySelectorAll('button').forEach(function(btn) {
    btn.addEventListener('click', function() {
      var t = btn.getAttribute('data-tier');
      wrap.querySelectorAll('button').forEach(function(b) { b.classList.toggle('active', b === btn); });
      var rec = memberDirectory[tierSamplePhone[t]];
      if (rec) showMemberReveal(rec);   // reveal the card populated with that tier's sample member
    });
  });
}

// ── Access-gate logic (phone check → reveal membership) ─────────────────────
function normalizePhone(raw) {
  var d = (raw || '').replace(/\D/g, '');
  if (d.indexOf('62') === 0) d = '0' + d.slice(2);      // +62 / 62 -> 0
  else if (d.charAt(0) !== '0' && d.length >= 9) d = '0' + d;
  return d;
}
function isValidPhoneFormat(d) { return /^08\d{7,12}$/.test(d); }

function animateMemberCounters() {
  animateCounter(document.getElementById('memberPoints'), memberData.points || 0);
  animateCounter(document.getElementById('memberOrderKg'), memberData.totalOrderKg || 0);
  animateCounter(document.getElementById('memberSaved'), memberData.totalSaved || 0);
}

function showMemberReveal(record) {
  memberData.real = null;                 // reset dulu — diisi lagi kalau record berasal dari lookup asli
  Object.assign(memberData, record);
  renderMemberGreeting();                 // refresh identity, voucher, tier visuals (bindings are guarded)
  var gate = document.getElementById('memberGate');
  var reveal = document.getElementById('memberReveal');
  if (gate) gate.setAttribute('hidden', '');
  if (reveal) {
    reveal.removeAttribute('hidden');
    reveal.classList.remove('member-reveal--in'); void reveal.offsetWidth; reveal.classList.add('member-reveal--in');
  }
  animateMemberCounters();
  if (reveal && reveal.scrollIntoView) reveal.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

function hideMemberReveal() {
  var gate = document.getElementById('memberGate');
  var reveal = document.getElementById('memberReveal');
  if (reveal) reveal.setAttribute('hidden', '');
  if (gate) {
    gate.removeAttribute('hidden');
    gate.classList.remove('is-invalid', 'is-notfound', 'is-loading');
    gate.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
  var msg = document.getElementById('memberGateMsg'); if (msg) msg.textContent = '';
  var input = document.getElementById('memberPhoneInput'); if (input) { input.value = ''; input.focus(); }
}

function initMemberGate() {
  var form = document.getElementById('memberGateForm');
  var input = document.getElementById('memberPhoneInput');
  var gate = document.getElementById('memberGate');
  var msg = document.getElementById('memberGateMsg');
  var honeypot = document.getElementById('memberGateHoneypot');
  if (!form || !input || !gate) return;

  var pageLoadedAt = Date.now(); // dipakai untuk anti-bot elapsed_ms (backend menolak submit < 2.5 detik)

  function clearError() { gate.classList.remove('is-invalid', 'is-notfound'); if (msg) msg.textContent = ''; }
  function fail(cls, text) { gate.classList.remove('is-invalid', 'is-notfound'); gate.classList.add(cls); if (msg) msg.textContent = text; }

  // Ubah hasil RPC get_my_loyalty (Supabase) jadi bentuk yang dipakai memberData/showMemberReveal.
  function mapLookupRow(row, phoneDisplay) {
    var tier = row.active_tier || 'Bronze';
    return {
      name: row.customer_name || 'Member',
      phone: phoneDisplay,
      tier: tier,
      points: row.poin || 0,
      lastYearSpend: row.active_tier_based_on_total || 0,
      totalOrderKg: row.current_year_qty || 0,
      totalSaved: row.current_year_total || 0,
      voucher: row.voucher || voucherByTier[tier] || voucherByTier.Bronze, // fallback lokal kalau tabel voucher kosong
      real: {
        nextTier: row.next_tier || null,
        amountToNext: row.amount_to_next_tier || 0,
        progressPercent: row.progress_percent || 0,
        projectedTier: row.projected_tier || tier
      }
    };
  }

  function runCheck() {
    var norm = normalizePhone(input.value);
    if (!isValidPhoneFormat(norm)) { fail('is-invalid', 'Nomor HP belum valid. Contoh format: 08xxxxxxxxxx.'); input.focus(); return; }
    clearError(); gate.classList.add('is-loading');

    fetch(SUPABASE_FN_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + SUPABASE_ANON_KEY,
        'apikey': SUPABASE_ANON_KEY
      },
      body: JSON.stringify({
        phone: norm,
        honeypot: honeypot ? honeypot.value : '',
        elapsedMs: Date.now() - pageLoadedAt
      })
    })
      .then(function (res) { return res.json().then(function (body) { return { ok: res.ok, status: res.status, body: body }; }); })
      .then(function (result) {
        gate.classList.remove('is-loading');
        if (result.ok && result.body && result.body.data) {
          var row = result.body.data;
          if (row.status === 'ok') {
            showMemberReveal(mapLookupRow(row, norm));
          } else {
            fail('is-notfound', 'Nomor ' + norm + ' belum terdaftar sebagai member. Coba nomor lain ya.');
          }
        } else if (result.status === 429) {
          fail('is-notfound', 'Nomor ini sudah 10x cek hari ini. Coba lagi besok ya, mulai jam 00:00.');
        } else if (result.status === 403) {
          fail('is-notfound', 'Permintaan tidak dapat diproses saat ini. Coba lagi nanti.');
        } else {
          fail('is-notfound', 'Gagal mengambil data. Cek koneksi internet kamu dan coba lagi.');
        }
      })
      .catch(function () {
        gate.classList.remove('is-loading');
        fail('is-notfound', 'Gagal terhubung ke server. Cek koneksi internet kamu dan coba lagi.');
      });
  }

  form.addEventListener('submit', function (e) { e.preventDefault(); runCheck(); });
  input.addEventListener('input', clearError);
  var changeBtn = document.getElementById('memberChangeBtn');
  if (changeBtn) changeBtn.addEventListener('click', hideMemberReveal);
}

// Init
renderMemberGreeting();
renderStockCards();
initCounters();
updateSyncTime();
renderArtikelCards();
initInspoTabs();
initInspoCarousels();
initProductCardLinks();
