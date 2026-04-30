
/* PATCHED renderCatalogMenu */

async function renderCatalogMenu(){
  const isAdmin = await isAdminUser();

  if(isAdmin){
    return renderAdminCatalogSummary();
  }

  return `
    <div class="catalogMenuSection">
      <div class="catalogMenuInner">

        <div class="catalogMenuHead">
          <div class="catalogMenuTitleGroup">
            <h3 class="catalogMenuTitle">도록</h3>
            <span class="catalogMenuDivider">|</span>
            <div class="catalogMenuTitleSub">Catalogue</div>
          </div>
          <button class="catalogMenuAction" data-catalog-open="offline-auction">
            신청하기 ▶
          </button>
        </div>

        <div class="catalogUserGrid">
          ${getUnifiedCatalogOptions().map((item, i) => `
            <button class="catalogUserCard" data-catalog-open="${item.id}">
              <div class="catalogUserIcon">
                ${renderCatalogMenuImage(item)}
              </div>

              <div class="catalogUserLabel">
                ${item.id === "zero-base" ? "ZEROBASE" : item.label}
              </div>

              ${i !== 2 ? `<div class="catalogUserDivider"></div>` : ``}
            </button>
          `).join("")}
        </div>

      </div>
    </div>
  `;
}
