/* app.js - FULL (FIXED)
 * Fixes:
 * 1) SHOP click works in all modes (including list)
 * 2) Catalog config respects each category (major / contemporary / zero-base)
 */

/* ====== Minimal scaffolding (keep your existing top variables if you have them) ====== */
const app = document.getElementById("app") || document.body;
const q = document.getElementById("q") || { value: "" };

/* ====== Sample data (replace with your real data if needed) ====== */
const data = [
  { category: "봉투", items: [
    { id:"env-big", name:"대봉투", size:"210*297mm" },
    { id:"env-letter", name:"편지봉투", size:"390*140*300mm" },
  ]},
  { category: "기타", items: [
    { id:"etc-shirt-black", name:"조지몰튼 티셔츠(B)", price:"35,700원" },
    { id:"etc-shirt-white", name:"조지몰튼 티셔츠(W)", price:"35,700원" },
  ]}
];

/* ====== Catalog config ====== */
const CATALOG_PAGE_CONFIG = {
  "offline-auction": {
    title: "도록 | Major Auction",
    galleryImages: [],
    data: { "2026": ["191회", "190회", "189회"] },
    currentStock: 10
  },
  "contemporary-art-auction": {
    title: "도록 | Contemporary Art Sale",
    galleryImages: [],
    data: { "2026": ["3월 컨템", "6월 컨템"] },
    currentStock: 0
  },
  "zero-base": {
    title: "도록 | Zero Base",
    galleryImages: [],
    data: { "2026": ["5월 화성"] },
    currentStock: 0
  }
};

function getCatalogDisplayTitle(id){
  if(id==="offline-auction") return "도록 | Major Auction";
  if(id==="contemporary-art-auction") return "도록 | Contemporary Art Sale";
  if(id==="zero-base") return "도록 | Zero Base";
  return "도록 | Major Auction";
}
function getCatalogTypeLabel(id){
  if(id==="offline-auction") return "Major Auction";
  if(id==="contemporary-art-auction") return "Contemporary Art Sale";
  if(id==="zero-base") return "Zero Base";
  return "Major Auction";
}
function getUnifiedCatalogOptions(){
  return [
    { id:"offline-auction", label:"Major Auction" },
    { id:"contemporary-art-auction", label:"Contemporary Art Sale" },
    { id:"zero-base", label:"Zero Base" }
  ];
}

/* ====== FIX #1: correct catalog mapping ====== */
function getUnifiedCatalogConfig(catalogId){
  const id = String(catalogId || "offline-auction");
  const base = CATALOG_PAGE_CONFIG[id] || CATALOG_PAGE_CONFIG["offline-auction"];
  return {
    ...base,
    id,
    title: getCatalogDisplayTitle(id),
    typeLabel: getCatalogTypeLabel(id),
    typeOptions: getUnifiedCatalogOptions(),
    galleryImages: Array.isArray(base.galleryImages) ? [...base.galleryImages] : [],
    data: base.data || {},
    currentStock: Number(base.currentStock || 0)
  };
}

/* ====== Rendering ====== */
function renderShopSection(section){
  return `
    <section class="shopSection">
      <h2>SHOP</h2>
      <div class="shopGrid">
        ${(section.items||[]).map(it => `
          <button class="shopCard" data-open="${it.id}">
            <div>${it.name}</div>
            ${it.price ? `<div>${it.price}</div>` : ``}
          </button>
        `).join("")}
      </div>
    </section>
  `;
}

function renderHome(mode="request"){
  const keyword = (q.value || "").trim().toLowerCase();

  const sectionsHtml = data.map(section => {
    const filtered = (section.items||[]).filter(it => {
      const hay = `${it.name||""} ${it.size||""}`.toLowerCase();
      return keyword ? hay.includes(keyword) : true;
    });
    if(!filtered.length) return "";

    if(section.category === "기타"){
      return renderShopSection({ ...section, items: filtered });
    }

    return `
      <div class="section">
        <h3>${section.category}</h3>
        <div class="list">
          ${filtered.map(it => `
            <div class="row">
              <button class="card" data-open="${it.id}">
                <div>${it.name}</div>
                <small>${it.size||""}</small>
              </button>
            </div>
          `).join("")}
        </div>
      </div>
    `;
  }).join("");

  app.innerHTML = sectionsHtml || `<div>데이터 없음</div>`;

  bindItemClick(mode); /* attach after render */
}

/* ====== FIX #2: SHOP click works in list mode too ====== */
function bindItemClick(mode){
  document.querySelectorAll("[data-open]").forEach(el => {
    const go = () => {
      const itemId = el.dataset.open;
      if(mode === "list"){
        location.hash = `#/list/item/${itemId}`;
      }else{
        location.hash = `#/${mode}/item/${itemId}`;
      }
    };
    el.addEventListener("click", go);
    el.addEventListener("keydown", (e) => {
      if(e.key === "Enter" || e.key === " "){
        e.preventDefault();
        go();
      }
    });
  });
}

/* ====== Simple router (demo) ====== */
function router(){
  const hash = location.hash || "#/request";
  if(hash.startsWith("#/list")){
    renderHome("list");
  }else{
    renderHome("request");
  }
}

window.addEventListener("hashchange", router);
window.addEventListener("load", router);
