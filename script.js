// Add versions and views here. The UI is generated from this data only.
const versions = [
  {
    id: "version-01",
    name: "Version 01",
    description: ".",
    properties: [
      { label: "Light position", value: "Table" },
      { label: "Faceting layout", value: "Low (pavilion) → medium (girdle) → high (crown) → highest (table)" },
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
      { label: "Faceting layout", value: "Low (pavilion) → medium (girdle) → high (crown) → highest (table)" },
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

const state = {
  selectedVersion: null,
  activeView: 0,
  wipePosition: 97,
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
  startCompare: document.querySelector("#start-compare"),
  compareToolbar: document.querySelector("#compare-toolbar"),
  confirmCompare: document.querySelector("#confirm-compare"),
  cancelCompare: document.querySelector("#cancel-compare"),
  viewer: document.querySelector("#viewer"),
  details: document.querySelector("#viewer-details"),
  expandViewer: document.querySelector("#expand-viewer"),
  closeViewer: document.querySelector("#close-viewer"),
  frame: document.querySelector("#comparison-frame"),
  render: document.querySelector("#render-image"),
  geometry: document.querySelector("#geometry-image"),
  divider: document.querySelector("#wipe-divider"),
  loading: document.querySelector("#comparison-loading"),
  thumbnails: document.querySelector("#thumbnail-strip"),
  guides: document.querySelector("#guide-grid"),
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
  compareThumbnails: document.querySelector("#compare-thumbnail-strip")
};

function escapeHtml(value) {
  return String(value).replace(/[&<>'"]/g, (character) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;"
  }[character]));
}

function setImageSource(image, path) {
  image.onerror = null;
  image.src = path;
}

function imageMarkup(path, alt, className = "", extra = "") {
  return `<img class="${escapeHtml(className)}" src="${escapeHtml(path)}" alt="${escapeHtml(alt)}" ${extra}>`;
}

function propertyMarkup(properties) {
  return `<dl class="property-list">${properties.map(({ label, value }) => `
    <div class="property"><dt>${escapeHtml(label)}</dt><dd>${escapeHtml(value)}</dd></div>`).join("")}
  </dl>`;
}

function renderIndex() {
  elements.grid.innerHTML = versions.map((version) => `
    <button class="version-card ${state.compareSelection.includes(version.id) ? "is-selected" : ""}" type="button" data-version-id="${escapeHtml(version.id)}" aria-pressed="${state.compareSelection.includes(version.id)}">
      ${imageMarkup(version.cover, `${version.name} cover`, "version-card__cover", "loading=\"lazy\"")}
      <span class="version-card__body">
        <h2>${escapeHtml(version.name)}</h2>
        <p>${escapeHtml(version.description || "")}</p>
        ${propertyMarkup(version.properties || [])}
      </span>
    </button>`).join("");
  elements.index.classList.toggle("compare-selecting", state.compareMode);
  elements.compareToolbar.hidden = !state.compareMode;
  elements.startCompare.setAttribute("aria-pressed", String(state.compareMode));
  elements.startCompare.textContent = state.compareMode ? "Exit compare mode" : "Compare versions";
  elements.confirmCompare.disabled = state.compareSelection.length !== 2;
}

function renderViewer() {
  const version = state.selectedVersion;
  const view = version.views[state.activeView];
  elements.details.innerHTML = `<h1>${escapeHtml(version.name)}</h1>${propertyMarkup(version.properties || [])}`;

  elements.thumbnails.innerHTML = version.views.map((item, index) => `
    <button class="thumbnail ${index === state.activeView ? "is-active" : ""}" type="button" data-view-index="${index}" aria-label="Select ${escapeHtml(item.name)}" aria-pressed="${index === state.activeView}">
      ${imageMarkup(item.render, "", "", "loading=\"lazy\"")}
      <span>${escapeHtml(item.name)}</span>
    </button>`).join("");

  elements.guides.innerHTML = [
    { src: version.overview.render, label: "Overview — Render", className: "guide--overview" },
    { src: version.overview.geometry, label: "Overview — Geometry", className: "guide--overview" },
    { src: view.guides.top, label: "Top View", className: "guide--top" },
    { src: view.guides.front, label: "Front View", className: "guide--front" },
    { src: view.guides.side, label: "Side View", className: "guide--side" }
  ].map((guide) => `
    <button class="guide ${guide.className}" type="button" data-guide-src="${escapeHtml(guide.src)}" data-guide-label="${escapeHtml(guide.label)}">
      ${imageMarkup(guide.src, guide.label, "", "loading=\"lazy\"")}
      <span>${escapeHtml(guide.label)}</span>
    </button>`).join("");

  elements.loading.hidden = false;
  elements.render.alt = `${version.name}, ${view.name}, final render`;
  elements.geometry.alt = `${version.name}, ${view.name}, geometry`;
  elements.render.onload = () => {
    elements.loading.hidden = true;
    if (elements.render.naturalWidth && elements.render.naturalHeight) {
      elements.frame.style.aspectRatio = `${elements.render.naturalWidth} / ${elements.render.naturalHeight}`;
    }
  };
  setImageSource(elements.render, view.render);
  setImageSource(elements.geometry, view.geometry);
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
  if (elements.compareLeftImage.getAttribute("src") !== leftPath) {
    elements.compareFrame.style.aspectRatio = "16 / 9";
    elements.compareLeftImage.onload = () => {
      if (elements.compareLeftImage.naturalWidth && elements.compareLeftImage.naturalHeight) {
        elements.compareFrame.style.aspectRatio = `${elements.compareLeftImage.naturalWidth} / ${elements.compareLeftImage.naturalHeight}`;
      }
    };
    setImageSource(elements.compareLeftImage, leftPath);
  }
  if (elements.compareRightImage.getAttribute("src") !== rightPath) {
    setImageSource(elements.compareRightImage, rightPath);
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
  state.selectedVersion = versions.find((version) => version.id === versionId);
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

function closeVersion() {
  state.selectedVersion = null;
  elements.viewer.hidden = true;
  elements.viewer.setAttribute("aria-hidden", "true");
  elements.index.hidden = false;
}

function updateComparison() {
  const wipe = state.wipePosition;
  elements.render.style.clipPath = `inset(0 ${100 - wipe}% 0 0)`;
  elements.divider.style.left = `${wipe}%`;
  elements.render.style.opacity = 1;
  elements.divider.hidden = false;
  elements.wipeControl.hidden = false;
  elements.wipeSlider.value = wipe;
}

function setView(index) {
  const version = state.selectedVersion;
  state.activeView = (index + version.views.length) % version.views.length;
  renderViewer();
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

elements.startCompare.addEventListener("click", () => {
  if (state.compareMode) exitCompareMode();
  else enterCompareMode();
});
elements.confirmCompare.addEventListener("click", openCompareViewer);
elements.cancelCompare.addEventListener("click", exitCompareMode);
elements.closeViewer.addEventListener("click", closeVersion);
elements.expandViewer.addEventListener("click", () => {
  const expanded = elements.viewer.classList.toggle("viewer--expanded");
  elements.expandViewer.setAttribute("aria-pressed", String(expanded));
  elements.expandViewer.textContent = expanded ? "Enlarge Guide Images" : "Minimise";
});
elements.thumbnails.addEventListener("click", (event) => {
  const thumbnail = event.target.closest("[data-view-index]");
  if (thumbnail) setView(Number(thumbnail.dataset.viewIndex));
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
  if (!state.selectedVersion) return;
  if (event.key === "ArrowLeft") { event.preventDefault(); setView(state.activeView - 1); }
  if (event.key === "ArrowRight") { event.preventDefault(); setView(state.activeView + 1); }
  if (event.key === "Escape") closeVersion();
});

renderIndex();
