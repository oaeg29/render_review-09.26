// Generated folder data is preferred. The inline data remains a safe fallback
// if generated-versions.js has not been generated yet.
const fallbackVersions = [
  {
    id: "version-01",
    name: "Version 01",
    description: ".",
    properties: [
      { label: "Light position", value: "Table" },
      { label: "Faceting Density Layout", value: "Low density / large faces (pavilion) → medium density / medium faces (girdle) → high density / small faces (crown) → highest density / smallest faces (table)" },
      { label: "Facets height / projection", value: "~14cm" }
    ],
    cover: "public/images/version-01/cover.webp",
    overview: {
      render: "public/images/version-01/overview/render.webp",
      geometry: "public/images/version-01/overview/geometry.webp"
    },
    views: [1, 2, 3, 4, 5].map((number) => ({
      id: `view-${String(number).padStart(2, "0")}`,
      name: `View ${String(number).padStart(2, "0")}`,
      render: `public/images/version-01/view-${String(number).padStart(2, "0")}/render.webp`,
      geometry: `public/images/version-01/view-${String(number).padStart(2, "0")}/geometry.webp`,
      guides: {
        top: `public/images/version-01/view-${String(number).padStart(2, "0")}/camera-top.webp`,
        front: `public/images/version-01/view-${String(number).padStart(2, "0")}/camera-front.webp`,
        side: `public/images/version-01/view-${String(number).padStart(2, "0")}/camera-side.webp`
      }
    }))
  },
  {
    id: "version-02",
    name: "Version 02",
    description: ".",
    properties: [
      { label: "Light position", value: "Crown (middle line)" },
      { label: "Faceting Density Layout", value: "Low density / large faces (pavilion) → medium density / medium faces (girdle) → high density / small faces (crown) → highest density / smallest faces (table)" },
      { label: "Facets height / projection", value: "~14cm" }
    ],
    cover: "public/images/version-02/cover.webp",
    overview: {
      render: "public/images/version-02/overview/render.webp",
      geometry: "public/images/version-02/overview/geometry.webp"
    },
    views: [1, 2, 3, 4, 5].map((number) => ({
      id: `view-${String(number).padStart(2, "0")}`,
      name: `View ${String(number).padStart(2, "0")}`,
      render: `public/images/version-02/view-${String(number).padStart(2, "0")}/render.webp`,
      geometry: `public/images/version-02/view-${String(number).padStart(2, "0")}/geometry.webp`,
      guides: {
        top: `public/images/version-02/view-${String(number).padStart(2, "0")}/camera-top.webp`,
        front: `public/images/version-02/view-${String(number).padStart(2, "0")}/camera-front.webp`,
        side: `public/images/version-02/view-${String(number).padStart(2, "0")}/camera-side.webp`
      }
    }))
  }
];

const versions = window.reviewVersions || fallbackVersions;

const exteriorFloorSwatchConfig = {
  "white-grey": [
    { id: "white", label: "White", color: "#f0f0ed" },
    { id: "grey", label: "Grey", color: "#8b8b87" },
    { id: "dark-grey", label: "Dark Grey", color: "#343434" },
    { id: "red", label: "Red", color: "#b83737" }
  ]
};

const fallbackExteriorFloorCards = [{
  id: "white-grey",
  name: "White → Grey comparison",
  description: "Compare exterior floor colours across six views.",
  cover: "public/images/exterior-floor/white-grey/swatches/white/view-01/render.webp",
  views: [1, 2, 3, 4, 5, 6].map((number) => ({
    id: `view-${String(number).padStart(2, "0")}`,
    name: `View ${String(number).padStart(2, "0")}`,
    geometry: `public/images/exterior-floor/white-grey/geometry/view-${String(number).padStart(2, "0")}.webp`
  })),
  swatches: ["white", "grey", "dark-grey"].map((id) => ({
    id,
    name: id === "dark-grey" ? "Dark Grey" : id[0].toUpperCase() + id.slice(1),
    views: [1, 2, 3, 4, 5, 6].map((number) => ({
      id: `view-${String(number).padStart(2, "0")}`,
      render: `public/images/exterior-floor/white-grey/swatches/${id}/view-${String(number).padStart(2, "0")}/render.webp`
    }))
  }))
}];

const exteriorFloorCards = (window.exteriorFloorCards && window.exteriorFloorCards.length)
  ? window.exteriorFloorCards
  : fallbackExteriorFloorCards;

const state = {
  crowdEnabled: false,
  viewerKind: null,
  selectedVersion: null,
  selectedExteriorCard: null,
  activeView: 0,
  wipePosition: 97,
  activeExteriorSwatch: null,
  exteriorCompareMode: false,
  exteriorCompareSelection: [],
  exteriorCompareSource: "render",
  compareMode: false,
  compareSelection: [],
  compareVersions: [],
  compareView: 0,
  compareWipePosition: 97,
  compareSource: "render"
};

const elements = {
  index: document.querySelector("#version-index"),
  grid: document.querySelector("#version-grid"),
  exteriorSection: document.querySelector("#exterior-floor-section"),
  exteriorGrid: document.querySelector("#exterior-floor-grid"),
  startCompare: document.querySelector("#start-compare"),
  compareToolbar: document.querySelector("#compare-toolbar"),
  confirmCompare: document.querySelector("#confirm-compare"),
  cancelCompare: document.querySelector("#cancel-compare"),
  viewer: document.querySelector("#viewer"),
  details: document.querySelector("#viewer-details"),
  expandViewer: document.querySelector("#expand-viewer"),
  closeViewer: document.querySelector("#close-viewer"),
  sideTitle: document.querySelector("#viewer-side-title"),
  frame: document.querySelector("#comparison-frame"),
  render: document.querySelector("#render-image"),
  geometry: document.querySelector("#geometry-image"),
  divider: document.querySelector("#wipe-divider"),
  loading: document.querySelector("#comparison-loading"),
  thumbnails: document.querySelector("#thumbnail-strip"),
  crowdToggle: document.querySelector("#crowd-toggle"),
  crowdToggleStatus: document.querySelector("#crowd-toggle-status"),
  guides: document.querySelector("#guide-grid"),
  swatchPanel: document.querySelector("#swatch-panel"),
  swatchInstructions: document.querySelector("#swatch-instructions"),
  swatches: document.querySelector("#swatch-list"),
  wipeSlider: document.querySelector("#wipe-slider"),
  wipeControl: document.querySelector("#wipe-control"),
  lightbox: document.querySelector("#lightbox"),
  lightboxImage: document.querySelector("#lightbox-image"),
  closeLightbox: document.querySelector("#close-lightbox"),
  compareViewer: document.querySelector("#compare-viewer"),
  closeCompareViewer: document.querySelector("#close-compare-viewer"),
  compareVersionAName: document.querySelector("#compare-version-a-name"),
  compareVersionBName: document.querySelector("#compare-version-b-name"),
  compareFrame: document.querySelector("#compare-frame"),
  compareLeftImage: document.querySelector("#compare-left-image"),
  compareRightImage: document.querySelector("#compare-right-image"),
  compareDivider: document.querySelector("#compare-divider"),
  compareLeftLabel: document.querySelector("#compare-left-label"),
  compareRightLabel: document.querySelector("#compare-right-label"),
  compareWipeSlider: document.querySelector("#compare-wipe-slider"),
  compareSourceToggle: document.querySelector("#compare-source-toggle"),
  compareThumbnails: document.querySelector("#compare-thumbnail-strip"),
  viewerSourceToggle: document.querySelector("#viewer-source-toggle"),
  leftLabel: document.querySelector("#comparison-left-label"),
  rightLabel: document.querySelector("#comparison-right-label")
};

class ImageLoadScheduler {
  constructor() {
    this.cache = new Map();
    this.queue = [];
    this.active = false;
  }

  load(path) {
    const cached = this.cache.get(path);
    if (cached) return cached.promise;

    let resolvePromise;
    const promise = new Promise((resolve) => { resolvePromise = resolve; });
    this.cache.set(path, { promise, status: "pending" });
    this.queue.push({ path, promise, resolve: resolvePromise });
    this.pump();
    return promise;
  }

  cancelQueued() {
    const queued = this.queue.splice(0);
    queued.forEach((entry) => {
      const cached = this.cache.get(entry.path);
      if (cached && cached.status === "pending") this.cache.delete(entry.path);
      entry.resolve(false);
    });
  }

  prioritize(paths) {
    const order = new Map(paths.map((path, index) => [path, index]));
    this.queue.sort((a, b) => {
      const aRank = order.has(a.path) ? order.get(a.path) : paths.length;
      const bRank = order.has(b.path) ? order.get(b.path) : paths.length;
      return aRank - bRank;
    });
  }

  pump() {
    if (this.active || !this.queue.length) return;
    const entry = this.queue.shift();
    this.active = true;
    const image = new Image();
    const finish = (loaded) => {
      this.cache.set(entry.path, { promise: entry.promise, status: loaded ? "loaded" : "failed" });
      entry.resolve(loaded);
      this.active = false;
      this.pump();
    };
    image.onload = () => finish(true);
    image.onerror = () => finish(false);
    image.src = entry.path;
  }
}

const imageScheduler = new ImageLoadScheduler();
let viewerLoadToken = 0;

function escapeHtml(value) {
  return String(value).replace(/[&<>'"]/g, (character) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;"
  }[character]));
}

function scheduleImageElement(image, path, token = null) {
  if (!image || !path) return Promise.resolve(false);
  image.dataset.imageSrc = path;
  image.removeAttribute("src");
  return imageScheduler.load(path).then((loaded) => {
    if (loaded && (token === null || token === viewerLoadToken) && image.dataset.imageSrc === path) {
      image.src = path;
    }
    return loaded;
  });
}

function imageMarkup(path, alt, className = "", extra = "") {
  if (!path) return "";
  return `<img class="${escapeHtml(className)}" data-image-src="${escapeHtml(path)}" alt="${escapeHtml(alt)}" ${extra}>`;
}

function propertyMarkup(properties) {
  return `<dl class="property-list">${properties.map(({ label, value }) => `
    <div class="property"><dt>${escapeHtml(label)}</dt><dd>${escapeHtml(value)}</dd></div>`).join("")}
  </dl>`;
}

function exteriorSwatches(card) {
  const configured = exteriorFloorSwatchConfig[card.id] || [];
  const source = card.swatches || [];
  const available = source.filter(swatch => swatch.views.some(view => view.render));
  const ordered = configured.filter(config => available.some(swatch => swatch.id === config.id)).map((config) => {
    const swatch = available.find((item) => item.id === config.id);
    return { ...swatch, ...config, name: config.label };
  });
  const configuredIds = new Set(ordered.map((swatch) => swatch.id));
  return [...ordered, ...available.filter((swatch) => !configuredIds.has(swatch.id)).map((swatch) => ({
    ...swatch,
    label: swatch.name || formatLabel(swatch.id),
    color: "#666666"
  }))];
}

function formatLabel(value) {
  return String(value).replace(/[-_]+/g, " ").trim().replace(/\b\w/g, (character) => character.toUpperCase());
}

function exteriorView(card, index = state.activeView) {
  return card.views[index] || card.views[0];
}

function exteriorSwatchView(swatch, index = state.activeView) {
  const viewId = state.selectedExteriorCard?.views[index]?.id;
  return swatch?.views.find(view => view.id === viewId);
}

function availableExteriorViewIndexes(card) {
  const swatches = exteriorSwatches(card);
  const selected = state.exteriorCompareMode && state.exteriorCompareSelection.length === 2
    ? state.exteriorCompareSelection.map(id => swatches.find(swatch => swatch.id === id))
    : [swatches.find(swatch => swatch.id === state.activeExteriorSwatch) || swatches[0]];
  return card.views.flatMap((view, index) => selected.every(swatch =>
    swatch?.views.some(item => item.id === view.id && item.render)) ? [index] : []);
}

function scheduleIndexImages() {
  imageScheduler.cancelQueued();
  [...elements.index.querySelectorAll("img[data-image-src]")].forEach((image) => {
    scheduleImageElement(image, image.dataset.imageSrc);
  });
}

function viewerRenderPath(version, view) {
  return version.id === "version-06" && state.crowdEnabled ? (view.renderCrowd || view.render) : view.render;
}

function scheduleViewerAssets(version) {
  const token = ++viewerLoadToken;
  const currentIndex = state.activeView;
  const orderedIndexes = version.views.map((_, index) => (currentIndex + index) % version.views.length);
  const thumbnailImages = [...elements.thumbnails.querySelectorAll("img[data-image-src]")];
  const currentView = version.views[currentIndex];
  const currentGuideImages = [...elements.guides.querySelectorAll("img[data-image-src]")];
  const currentRender = viewerRenderPath(version, currentView);
  const priorityPaths = [currentRender, currentView.geometry, ...currentGuideImages.map((image) => image.dataset.imageSrc)].filter(Boolean);

  // Active view first: Render always precedes Geometry.
  scheduleImageElement(elements.render, currentRender, token);
  scheduleImageElement(elements.geometry, currentView.geometry, token);
  currentGuideImages.forEach((image) => scheduleImageElement(image, image.dataset.imageSrc, token));

  // Continue through the remaining views in order, Render before Geometry.
  orderedIndexes.slice(1).forEach((index) => {
    const view = version.views[index];
    scheduleImageElement(thumbnailImages[index], viewerRenderPath(version, view), token);
    if (view.geometry) imageScheduler.load(view.geometry);
  });
  scheduleImageElement(thumbnailImages[currentIndex], currentRender, token);
  imageScheduler.prioritize(priorityPaths);
}

function scheduleExteriorAssets(card) {
  const token = ++viewerLoadToken;
  const swatches = exteriorSwatches(card);
  const currentView = exteriorView(card);
  const activeSwatch = swatches.find((swatch) => swatch.id === state.activeExteriorSwatch) || swatches[0];
  const selectedSwatches = state.exteriorCompareSelection
    .map((id) => swatches.find((swatch) => swatch.id === id))
    .filter(Boolean);
  const leftSwatch = selectedSwatches[0] || activeSwatch;
  const rightSwatch = selectedSwatches[1] || activeSwatch;
  const leftRender = exteriorSwatchView(leftSwatch)?.render;
  const rightRender = exteriorSwatchView(rightSwatch)?.render;
  const isComparing = state.exteriorCompareMode && selectedSwatches.length === 2;
  const leftPath = isComparing && state.exteriorCompareSource === "geometry"
    ? currentView.geometry
    : isComparing ? leftRender : activeSwatch && exteriorSwatchView(activeSwatch)?.render;
  const rightPath = isComparing && state.exteriorCompareSource === "render"
    ? rightRender
    : currentView.geometry;
  const priorityPaths = [
    leftPath,
    rightPath
  ].filter(Boolean);
  const thumbnailImages = [...elements.thumbnails.querySelectorAll("img[data-image-src]")];

  scheduleImageElement(elements.render, leftPath, token);
  scheduleImageElement(elements.geometry, rightPath, token);

  const visibleIndexes = availableExteriorViewIndexes(card);
  visibleIndexes.forEach((index, thumbnailIndex) => {
    scheduleImageElement(thumbnailImages[thumbnailIndex], exteriorSwatchView(isComparing ? leftSwatch : activeSwatch, index)?.render, token);
  });
  const orderedIndexes = card.views.map((_, index) => (state.activeView + index) % card.views.length);
  orderedIndexes.forEach((index) => {
    const view = card.views[index];
    swatches.forEach((swatch) => {
      const render = exteriorSwatchView(swatch, index)?.render;
      if (render) imageScheduler.load(render);
    });
    if (view.geometry) imageScheduler.load(view.geometry);
  });

  imageScheduler.prioritize(priorityPaths);
}

function scheduleCompareAssets(versionA, versionB) {
  const token = ++viewerLoadToken;
  const viewCount = Math.min(versionA.views.length, versionB.views.length);
  const orderedIndexes = Array.from({ length: viewCount }, (_, index) => (state.compareView + index) % viewCount);
  const thumbnailImages = [...elements.compareThumbnails.querySelectorAll("img[data-image-src]")];
  const currentA = versionA.views[state.compareView];
  const currentB = versionB.views[state.compareView];

  orderedIndexes.forEach((index) => {
    const viewA = versionA.views[index];
    const viewB = versionB.views[index];
    if (index === state.compareView) {
      scheduleImageElement(thumbnailImages[index], viewA.render, token);
    } else {
      scheduleImageElement(thumbnailImages[index], viewA.render, token);
    }
    [viewA.render, viewB.render, viewA.geometry, viewB.geometry]
      .filter(Boolean)
      .forEach((path) => imageScheduler.load(path));
  });
  imageScheduler.prioritize([
    state.compareSource === "render" ? currentA.render : currentA.geometry,
    state.compareSource === "render" ? currentB.render : currentB.geometry
  ].filter(Boolean));
}

function guideMarkup(guide, className = "") {
  if (!guide.src) return "";
  const label = guide.label || "";
  return `<button class="guide ${className}" type="button" data-guide-src="${escapeHtml(guide.src)}" data-guide-label="${escapeHtml(label)}">
    ${imageMarkup(guide.src, label, "", "loading=\"lazy\"")}
    ${label ? `<span>${escapeHtml(label)}</span>` : ""}
  </button>`;
}

function guideSectionMarkup(section, extraClass = "") {
  const isCrowd = section.kind === "crowd" && state.selectedVersion?.id === "version-06";
  const images = isCrowd ? section.variants[state.crowdEnabled ? "on" : "off"].slice(0, 2) : section.images;
  return `<section class="guide-section ${extraClass} ${isCrowd ? "guide-section--crowd" : ""}">
    ${section.title ? `<h3 class="guide-section__title">${escapeHtml(section.title)}</h3>` : ""}
    <div class="guide-grid ${extraClass ? "guide-grid--extra" : ""}">${images.map((image) => guideMarkup(image, [image.className, extraClass ? "guide--extra" : ""].filter(Boolean).join(" "))).join("")}</div>
  </section>`;
}

function renderIndex() {
  elements.grid.innerHTML = versions.map((version) => `
    <button class="version-card version-card--${escapeHtml(version.id)} ${state.compareSelection.includes(version.id) ? "is-selected" : ""}" type="button" data-version-id="${escapeHtml(version.id)}" aria-pressed="${state.compareSelection.includes(version.id)}">
      ${imageMarkup(version.cover, `${version.name} cover`, "version-card__cover", "loading=\"lazy\"")}
      <span class="version-card__body">
        <h2>${escapeHtml(version.name)}</h2>
        <p>${escapeHtml(version.description || "")}</p>
        ${propertyMarkup(version.properties || [])}
      </span>
    </button>`).join("");
  elements.exteriorGrid.innerHTML = exteriorFloorCards.map((card) => `
    <button class="version-card exterior-floor-card" type="button" data-exterior-id="${escapeHtml(card.id)}">
      ${imageMarkup(card.cover, `${card.name} cover`, "version-card__cover", "loading=\"lazy\"")}
      <span class="version-card__body">
        <h2>${escapeHtml(card.name)}</h2>
        <p>${escapeHtml(card.description || "")}</p>
      </span>
    </button>`).join("");
  elements.index.classList.toggle("compare-selecting", state.compareMode);
  elements.compareToolbar.hidden = !state.compareMode;
  elements.startCompare.setAttribute("aria-pressed", String(state.compareMode));
  elements.startCompare.textContent = state.compareMode ? "Exit compare mode" : "Compare versions";
  elements.confirmCompare.disabled = state.compareSelection.length !== 2;
  scheduleIndexImages();
}

function renderViewer() {
  const version = state.selectedVersion;
  const view = version.views[state.activeView];
  elements.crowdToggle.hidden = version.id !== "version-06";
  elements.crowdToggleStatus.textContent = state.crowdEnabled ? "On" : "Off";
  elements.crowdToggle.setAttribute("aria-checked", String(state.crowdEnabled));
  elements.details.innerHTML = `<h1>${escapeHtml(version.name)}</h1>${propertyMarkup(version.properties || [])}`;

  elements.thumbnails.innerHTML = version.views.map((item, index) => `
    <button class="thumbnail ${index === state.activeView ? "is-active" : ""}" type="button" data-view-index="${index}" aria-label="Select ${escapeHtml(item.name)}" aria-pressed="${index === state.activeView}">
      ${imageMarkup(viewerRenderPath(version, item), "", "", "loading=\"lazy\"")}
      <span>${escapeHtml(item.name)}</span>
    </button>`).join("");

  const baseSection = {
    title: null,
    images: [
      { src: version.overview.render, label: "Overview — Render", className: "guide--overview" },
      { src: version.overview.geometry, label: "Overview — Geometry", className: "guide--overview" },
      { src: view.guides.top, label: "Top View", className: "guide--top" },
      { src: view.guides.front, label: "Front View", className: "guide--front" },
      { src: view.guides.side, label: "Side View", className: "guide--side" }
    ].filter((image) => image.src)
  };
  const sections = version.overview.sections || [];
  state.viewerKind = "version";
  elements.viewer.classList.remove("viewer--exterior");
  elements.sideTitle.textContent = "Guides";
  elements.sideTitle.closest("aside").setAttribute("aria-label", "Guide images");
  elements.guides.hidden = false;
  elements.swatchPanel.hidden = true;
  elements.expandViewer.hidden = false;
  elements.viewerSourceToggle.hidden = true;
  elements.expandViewer.textContent = elements.viewer.classList.contains("viewer--expanded") ? "Enlarge Guide Images" : "Minimise";
  elements.guides.innerHTML = [
    ...sections.filter((section) => section.position === 0).map((section) => guideSectionMarkup(section, "guide-section--extra")),
    guideSectionMarkup(baseSection),
    ...sections.filter((section) => section.position === 1).map((section) => guideSectionMarkup(section, "guide-section--extra"))
  ].join("");

  elements.loading.hidden = false;
  elements.loading.textContent = "Loading images…";
  elements.render.alt = `${version.name}, ${view.name}, final render`;
  elements.geometry.alt = `${version.name}, ${view.name}, geometry`;
  elements.render.onload = () => {
    elements.loading.hidden = true;
    if (elements.render.naturalWidth && elements.render.naturalHeight) {
      elements.frame.style.aspectRatio = `${elements.render.naturalWidth} / ${elements.render.naturalHeight}`;
    }
  };
  elements.render.removeAttribute("src");
  elements.geometry.removeAttribute("src");
  scheduleViewerAssets(version);
  updateComparison();
}

function renderExteriorViewer() {
  elements.crowdToggle.hidden = true;
  const card = state.selectedExteriorCard;
  const swatches = exteriorSwatches(card);
  const activeSwatch = swatches.find((swatch) => swatch.id === state.activeExteriorSwatch) || swatches[0];
  if (!activeSwatch) return;
  state.activeExteriorSwatch = activeSwatch.id;
  const availableIndexes = availableExteriorViewIndexes(card);
  if (!availableIndexes.includes(state.activeView)) state.activeView = availableIndexes[0] ?? 0;
  const view = exteriorView(card);
  state.activeExteriorSwatch = activeSwatch.id;
  state.viewerKind = "exterior";
  elements.viewer.classList.add("viewer--exterior");
  elements.sideTitle.textContent = "Floor colours";
  elements.sideTitle.closest("aside").setAttribute("aria-label", "Exterior floor colours");
  elements.details.innerHTML = `<h1>${escapeHtml(card.name)}</h1><p class="viewer-description">${escapeHtml(card.description || "")}</p>`;
  elements.guides.hidden = true;
  elements.swatchPanel.hidden = false;
  elements.swatchInstructions.textContent = state.exteriorCompareMode
    ? state.exteriorCompareSelection.length === 2 && !availableIndexes.length
      ? "These colours have no shared views. Select a different pair."
      : "Select two colours to compare."
    : "Select a floor colour.";
  elements.swatches.innerHTML = swatches.map((swatch) => {
    const isActive = swatch.id === activeSwatch.id;
    const isSelected = state.exteriorCompareSelection.includes(swatch.id);
    return `<button class="swatch ${isActive ? "is-active" : ""} ${isSelected ? "is-compare-selected" : ""}" type="button" data-swatch-id="${escapeHtml(swatch.id)}" style="--swatch-color: ${escapeHtml(swatch.color || "#666")}" aria-pressed="${state.exteriorCompareMode ? isSelected : isActive}">
      <span class="swatch__sample" aria-hidden="true"></span><span class="swatch__label">${escapeHtml(swatch.label || swatch.name || formatLabel(swatch.id))}</span>
    </button>`;
  }).join("");
  elements.expandViewer.hidden = false;
  elements.expandViewer.textContent = state.exteriorCompareMode ? "Exit Comparison" : "Comparison";
  elements.expandViewer.setAttribute("aria-pressed", String(state.exteriorCompareMode));
  elements.viewerSourceToggle.hidden = !state.exteriorCompareMode;
  const thumbnailSwatch = state.exteriorCompareMode && state.exteriorCompareSelection.length === 2
    ? swatches.find(swatch => swatch.id === state.exteriorCompareSelection[0]) : activeSwatch;
  elements.thumbnails.innerHTML = availableIndexes.map((index) => {
    const item = card.views[index];
    const render = exteriorSwatchView(thumbnailSwatch, index)?.render;
    return `<button class="thumbnail ${index === state.activeView ? "is-active" : ""}" type="button" data-view-index="${index}" aria-label="Select ${escapeHtml(item.name)}" aria-pressed="${index === state.activeView}">
      ${imageMarkup(render, "", "", "loading=\"lazy\"")}
      <span>${escapeHtml(item.name)}</span>
    </button>`;
  }).join("");
  elements.loading.hidden = false;
  elements.render.alt = `${card.name}, ${activeSwatch.label}, ${view.name}`;
  elements.geometry.alt = `${card.name}, ${view.name}, geometry`;
  elements.render.onload = () => {
    elements.loading.hidden = true;
    if (elements.render.naturalWidth && elements.render.naturalHeight) {
      elements.frame.style.aspectRatio = `${elements.render.naturalWidth} / ${elements.render.naturalHeight}`;
    }
  };
  elements.render.removeAttribute("src");
  elements.geometry.removeAttribute("src");
  if (!availableIndexes.length) {
    ++viewerLoadToken;
    delete elements.render.dataset.imageSrc;
    delete elements.geometry.dataset.imageSrc;
    elements.loading.textContent = "No shared views available";
    elements.divider.hidden = true;
    elements.wipeControl.hidden = true;
    elements.viewerSourceToggle.hidden = true;
    return;
  }
  elements.loading.textContent = "Loading images…";
  scheduleExteriorAssets(card);
  updateComparison();
}

function updateCompareComparison() {
  const [versionA, versionB] = state.compareVersions;
  if (!versionA || !versionB) return;
  const viewA = versionA.views[state.compareView];
  const viewB = versionB.views[state.compareView];
  const source = state.compareSource;
  const wipe = state.compareWipePosition;
  const leftPath = viewA[source];
  const rightPath = viewB[source];

  elements.compareLeftImage.alt = `${versionA.name}, ${viewA.name}, ${source}`;
  elements.compareRightImage.alt = `${versionB.name}, ${viewB.name}, ${source}`;
  elements.compareLeftLabel.textContent = `${versionA.name} — ${source}`;
  elements.compareRightLabel.textContent = `${versionB.name} — ${source}`;
  elements.compareLeftImage.style.clipPath = `inset(0 ${100 - wipe}% 0 0)`;
  elements.compareDivider.style.left = `${wipe}%`;
  elements.compareWipeSlider.value = wipe;
  elements.compareSourceToggle.textContent = source === "render" ? "Show Geometry" : "Show Render";
  elements.compareSourceToggle.setAttribute("aria-pressed", String(source === "geometry"));
  if (elements.compareLeftImage.dataset.imageSrc !== leftPath) {
    elements.compareFrame.style.aspectRatio = "16 / 9";
    elements.compareLeftImage.onload = () => {
      if (elements.compareLeftImage.naturalWidth && elements.compareLeftImage.naturalHeight) {
        elements.compareFrame.style.aspectRatio = `${elements.compareLeftImage.naturalWidth} / ${elements.compareLeftImage.naturalHeight}`;
      }
    };
    scheduleImageElement(elements.compareLeftImage, leftPath, viewerLoadToken);
  }
  if (elements.compareRightImage.dataset.imageSrc !== rightPath) {
    scheduleImageElement(elements.compareRightImage, rightPath, viewerLoadToken);
  }
}

function renderCompareViewer() {
  const [versionA, versionB] = state.compareVersions;
  const viewCount = Math.min(versionA.views.length, versionB.views.length);
  state.compareView = (state.compareView + viewCount) % viewCount;
  elements.compareVersionAName.textContent = versionA.name;
  elements.compareVersionBName.textContent = versionB.name;
  elements.compareThumbnails.innerHTML = versionA.views.slice(0, viewCount).map((view, index) => `
    <button class="thumbnail ${index === state.compareView ? "is-active" : ""}" type="button" data-compare-view-index="${index}" aria-label="Select ${escapeHtml(view.name)}" aria-pressed="${index === state.compareView}">
      ${imageMarkup(view.render, "", "", "loading=\"lazy\"")}
      <span>${escapeHtml(view.name)}</span>
    </button>`).join("");
  scheduleCompareAssets(versionA, versionB);
  updateCompareComparison();
}

function setCompareView(index) {
  const [versionA, versionB] = state.compareVersions;
  const viewCount = Math.min(versionA.views.length, versionB.views.length);
  state.compareView = (index + viewCount) % viewCount;
  renderCompareViewer();
}

function setCompareWipeFromPointer(event) {
  const bounds = elements.compareFrame.getBoundingClientRect();
  const position = ((event.clientX - bounds.left) / bounds.width) * 100;
  state.compareWipePosition = Math.max(0, Math.min(100, position));
  updateCompareComparison();
}

function enterCompareMode() {
  state.compareMode = true;
  state.compareSelection = [];
  renderIndex();
  elements.startCompare.focus();
}

function exitCompareMode() {
  state.compareMode = false;
  state.compareSelection = [];
  renderIndex();
}

function openCompareViewer() {
  if (state.compareSelection.length !== 2) return;
  state.compareVersions = state.compareSelection.map((id) => versions.find((version) => version.id === id));
  state.compareView = 0;
  state.compareWipePosition = 97;
  state.compareSource = "render";
  renderCompareViewer();
  elements.index.hidden = true;
  elements.compareViewer.hidden = false;
  elements.compareViewer.setAttribute("aria-hidden", "false");
  elements.closeCompareViewer.focus();
}

function closeCompareViewer() {
  state.compareVersions = [];
  elements.compareViewer.hidden = true;
  elements.compareViewer.setAttribute("aria-hidden", "true");
  elements.index.hidden = false;
  exitCompareMode();
  elements.startCompare.focus();
}

function openVersion(versionId) {
  state.crowdEnabled = false;
  state.viewerKind = "version";
  state.selectedVersion = versions.find((version) => version.id === versionId);
  state.selectedExteriorCard = null;
  state.exteriorCompareMode = false;
  state.exteriorCompareSelection = [];
  state.activeView = 0;
  state.wipePosition = 97;
  elements.viewer.classList.add("viewer--expanded");
  elements.expandViewer.setAttribute("aria-pressed", "true");
  elements.expandViewer.textContent = "Enlarge Guide Images";
  renderViewer();
  elements.index.hidden = true;
  elements.viewer.hidden = false;
  elements.viewer.setAttribute("aria-hidden", "false");
  elements.closeViewer.focus();
}

function openExteriorCard(cardId) {
  state.viewerKind = "exterior";
  state.selectedVersion = null;
  state.selectedExteriorCard = exteriorFloorCards.find((card) => card.id === cardId);
  if (!state.selectedExteriorCard) return;
  state.activeView = 0;
  state.wipePosition = 97;
  state.activeExteriorSwatch = exteriorSwatches(state.selectedExteriorCard)[0]?.id || null;
  state.exteriorCompareMode = false;
  state.exteriorCompareSelection = [];
  state.exteriorCompareSource = "render";
  elements.viewer.classList.add("viewer--expanded");
  renderExteriorViewer();
  elements.index.hidden = true;
  elements.viewer.hidden = false;
  elements.viewer.setAttribute("aria-hidden", "false");
  elements.closeViewer.focus();
}

function closeVersion() {
  state.selectedVersion = null;
  state.selectedExteriorCard = null;
  state.viewerKind = null;
  state.exteriorCompareMode = false;
  state.exteriorCompareSelection = [];
  elements.viewer.hidden = true;
  elements.viewer.setAttribute("aria-hidden", "true");
  elements.index.hidden = false;
}

function updateComparison() {
  if (state.viewerKind === "exterior") {
    const card = state.selectedExteriorCard;
    if (!availableExteriorViewIndexes(card).length) return;
    const swatches = exteriorSwatches(card);
    const activeSwatch = swatches.find((swatch) => swatch.id === state.activeExteriorSwatch) || swatches[0];
    const view = exteriorView(card);
    const selected = state.exteriorCompareSelection.map((id) => swatches.find((swatch) => swatch.id === id)).filter(Boolean);
    const leftSwatch = selected[0] || activeSwatch;
    const rightSwatch = selected[1] || activeSwatch;
    const leftView = exteriorSwatchView(leftSwatch);
    const rightView = exteriorSwatchView(rightSwatch);
    const isComparing = state.exteriorCompareMode && selected.length === 2;
    const leftPath = isComparing && state.exteriorCompareSource === "render" ? leftView?.render : isComparing ? view.geometry : leftView?.render;
    const rightPath = isComparing && state.exteriorCompareSource === "render" ? rightView?.render : view.geometry;
    const wipe = state.wipePosition;

    elements.leftLabel.textContent = isComparing
      ? `${leftSwatch.label || leftSwatch.name} — ${state.exteriorCompareSource}`
      : "Render";
    elements.rightLabel.textContent = isComparing
      ? `${rightSwatch.label || rightSwatch.name} — ${state.exteriorCompareSource}`
      : "Geometry";
    elements.render.alt = elements.leftLabel.textContent;
    elements.geometry.alt = elements.rightLabel.textContent;
    elements.render.style.clipPath = `inset(0 ${100 - wipe}% 0 0)`;
    elements.divider.style.left = `${wipe}%`;
    elements.render.style.opacity = 1;
    elements.divider.hidden = false;
    elements.wipeControl.hidden = false;
    elements.wipeSlider.value = wipe;
    elements.viewerSourceToggle.hidden = !isComparing;
    elements.viewerSourceToggle.textContent = state.exteriorCompareSource === "render" ? "Show Geometry" : "Show Render";
    elements.viewerSourceToggle.setAttribute("aria-pressed", String(state.exteriorCompareSource === "geometry"));
    if (elements.render.dataset.imageSrc !== leftPath) {
      elements.frame.style.aspectRatio = "16 / 9";
      scheduleImageElement(elements.render, leftPath, viewerLoadToken);
    }
    if (elements.geometry.dataset.imageSrc !== rightPath) {
      scheduleImageElement(elements.geometry, rightPath, viewerLoadToken);
    }
    return;
  }
  const wipe = state.wipePosition;
  elements.leftLabel.textContent = "Render";
  elements.rightLabel.textContent = "Geometry";
  elements.render.style.clipPath = `inset(0 ${100 - wipe}% 0 0)`;
  elements.divider.style.left = `${wipe}%`;
  elements.render.style.opacity = 1;
  elements.divider.hidden = false;
  elements.wipeControl.hidden = false;
  elements.viewerSourceToggle.hidden = true;
  elements.wipeSlider.value = wipe;
}

function setView(index) {
  const source = state.viewerKind === "exterior" ? state.selectedExteriorCard : state.selectedVersion;
  if (!source) return;
  if (state.viewerKind === "exterior") {
    const indexes = availableExteriorViewIndexes(source);
    if (!indexes.length) return;
    if (indexes.includes(index)) state.activeView = index;
    else {
      const position = indexes.indexOf(state.activeView);
      const direction = index < state.activeView ? -1 : 1;
      state.activeView = indexes[(position + direction + indexes.length) % indexes.length];
    }
    renderExteriorViewer();
  } else {
    state.activeView = (index + source.views.length) % source.views.length;
    renderViewer();
  }
}

function setWipeFromPointer(event) {
  const bounds = elements.frame.getBoundingClientRect();
  const position = ((event.clientX - bounds.left) / bounds.width) * 100;
  state.wipePosition = Math.max(0, Math.min(100, position));
  updateComparison();
}

elements.grid.addEventListener("click", (event) => {
  const card = event.target.closest("[data-version-id]");
  if (!card) return;
  if (!state.compareMode) {
    openVersion(card.dataset.versionId);
    return;
  }
  const versionId = card.dataset.versionId;
  if (state.compareSelection.includes(versionId)) {
    state.compareSelection = state.compareSelection.filter((id) => id !== versionId);
  } else if (state.compareSelection.length < 2) {
    state.compareSelection = [...state.compareSelection, versionId];
  }
  renderIndex();
});

elements.exteriorGrid.addEventListener("click", (event) => {
  const card = event.target.closest("[data-exterior-id]");
  if (card && !state.compareMode) openExteriorCard(card.dataset.exteriorId);
});

elements.startCompare.addEventListener("click", () => {
  if (state.compareMode) exitCompareMode();
  else enterCompareMode();
});
elements.confirmCompare.addEventListener("click", openCompareViewer);
elements.cancelCompare.addEventListener("click", exitCompareMode);
elements.closeViewer.addEventListener("click", closeVersion);
elements.expandViewer.addEventListener("click", () => {
  if (state.viewerKind === "exterior") {
    state.exteriorCompareMode = !state.exteriorCompareMode;
    if (!state.exteriorCompareMode) state.exteriorCompareSelection = [];
    renderExteriorViewer();
    return;
  }
  const expanded = elements.viewer.classList.toggle("viewer--expanded");
  elements.expandViewer.setAttribute("aria-pressed", String(expanded));
  elements.expandViewer.textContent = expanded ? "Enlarge Guide Images" : "Minimise";
});
elements.thumbnails.addEventListener("click", (event) => {
  const thumbnail = event.target.closest("[data-view-index]");
  if (thumbnail) setView(Number(thumbnail.dataset.viewIndex));
});

elements.crowdToggle.addEventListener("click", () => {
  if (state.viewerKind !== "version" || state.selectedVersion?.id !== "version-06") return;
  state.crowdEnabled = !state.crowdEnabled;
  renderViewer();
});

elements.swatches.addEventListener("click", (event) => {
  const swatchButton = event.target.closest("[data-swatch-id]");
  if (!swatchButton || state.viewerKind !== "exterior") return;
  const swatchId = swatchButton.dataset.swatchId;
  if (!state.exteriorCompareMode) {
    state.activeExteriorSwatch = swatchId;
    renderExteriorViewer();
    return;
  }
  if (state.exteriorCompareSelection.includes(swatchId)) {
    state.exteriorCompareSelection = state.exteriorCompareSelection.filter((id) => id !== swatchId);
  } else if (state.exteriorCompareSelection.length < 2) {
    state.exteriorCompareSelection = [...state.exteriorCompareSelection, swatchId];
  }
  renderExteriorViewer();
});

elements.closeCompareViewer.addEventListener("click", closeCompareViewer);
elements.compareThumbnails.addEventListener("click", (event) => {
  const thumbnail = event.target.closest("[data-compare-view-index]");
  if (thumbnail) setCompareView(Number(thumbnail.dataset.compareViewIndex));
});
elements.compareSourceToggle.addEventListener("click", () => {
  state.compareSource = state.compareSource === "render" ? "geometry" : "render";
  renderCompareViewer();
});
elements.viewerSourceToggle.addEventListener("click", () => {
  if (state.viewerKind !== "exterior" || !state.exteriorCompareMode) return;
  state.exteriorCompareSource = state.exteriorCompareSource === "render" ? "geometry" : "render";
  renderExteriorViewer();
});

elements.guides.addEventListener("click", (event) => {
  const guide = event.target.closest("[data-guide-src]");
  if (!guide) return;
  elements.lightboxImage.src = guide.dataset.guideSrc;
  elements.lightboxImage.alt = guide.dataset.guideLabel;
  elements.lightbox.hidden = false;
  elements.closeLightbox.focus();
});

elements.closeLightbox.addEventListener("click", () => { elements.lightbox.hidden = true; });
elements.lightbox.addEventListener("click", (event) => {
  if (event.target === elements.lightbox) elements.lightbox.hidden = true;
});

elements.wipeSlider.addEventListener("input", (event) => {
  state.wipePosition = Number(event.target.value);
  updateComparison();
});

let draggingWipe = false;
elements.divider.addEventListener("pointerdown", (event) => {
  draggingWipe = true;
  elements.divider.setPointerCapture(event.pointerId);
  setWipeFromPointer(event);
});
elements.divider.addEventListener("pointermove", (event) => {
  if (draggingWipe) setWipeFromPointer(event);
});
elements.divider.addEventListener("pointerup", () => { draggingWipe = false; });
elements.divider.addEventListener("pointercancel", () => { draggingWipe = false; });

let draggingCompareWipe = false;
elements.compareDivider.addEventListener("pointerdown", (event) => {
  draggingCompareWipe = true;
  elements.compareDivider.setPointerCapture(event.pointerId);
  setCompareWipeFromPointer(event);
});
elements.compareDivider.addEventListener("pointermove", (event) => {
  if (draggingCompareWipe) setCompareWipeFromPointer(event);
});
elements.compareDivider.addEventListener("pointerup", () => { draggingCompareWipe = false; });
elements.compareDivider.addEventListener("pointercancel", () => { draggingCompareWipe = false; });

elements.compareWipeSlider.addEventListener("input", (event) => {
  state.compareWipePosition = Number(event.target.value);
  updateCompareComparison();
});

document.addEventListener("keydown", (event) => {
  const tag = event.target.tagName;
  const inputType = tag === "INPUT" ? event.target.type : "";
  // Range inputs are controls, not text entry: arrow keys should still change views
  // when the wipe slider or comparison frame has focus.
  const isTextEntry = tag === "TEXTAREA" || tag === "SELECT" || event.target.isContentEditable ||
    (tag === "INPUT" && inputType !== "range");
  if (!elements.lightbox.hidden && event.key === "Escape") {
    elements.lightbox.hidden = true;
    return;
  }
  if (isTextEntry) return;
  if (state.compareVersions.length === 2) {
    if (event.key === "ArrowLeft") { event.preventDefault(); setCompareView(state.compareView - 1); }
    if (event.key === "ArrowRight") { event.preventDefault(); setCompareView(state.compareView + 1); }
    if (event.key === "Escape") closeCompareViewer();
    return;
  }
  if (!state.selectedVersion && !state.selectedExteriorCard) return;
  if (event.key === "ArrowLeft") { event.preventDefault(); setView(state.activeView - 1); }
  if (event.key === "ArrowRight") { event.preventDefault(); setView(state.activeView + 1); }
  if (event.key === "Escape") closeVersion();
});

renderIndex();
