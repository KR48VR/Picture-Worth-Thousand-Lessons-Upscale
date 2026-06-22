const tabs = {
  secondary: {
    label: 'Secondary',
    sublabel: '15-year-old level',
    caption: 'Accessible explanations, visible concepts, and simple quantitative prompts.'
  },
  university: {
    label: 'University',
    sublabel: 'Sophomore level',
    caption: 'More rigorous modeling, equations, and quantitative reasoning.'
  },
  engineering: {
    label: 'Nature → Engineering',
    sublabel: 'Design transfer',
    caption: 'The same science and maths mapped to a useful engineered system.'
  }
};

const prompts = {
  secondary: [
    'Which part of the original photo becomes easiest to explain after you compare it with the annotated version?',
    'What force, angle, pressure idea, or biological adaptation can you point to directly?',
    'What simple measurement or ratio could students estimate from the scene?'
  ],
  university: [
    'What assumptions would you make before turning this scene into a model?',
    'Which variables could be measured from the image, and which would need external data?',
    'What is one limitation of the model or equation shown in the explainer?'
  ],
  engineering: [
    'Which natural principle transferred most directly into engineering?',
    'What extra systems did engineers add, such as sensors, materials, control, or actuators?',
    'Can you think of a different product or robot that could use the same principle?'
  ]
};

let currentModule = null;
let currentTab = 'secondary';

const grid = document.getElementById('moduleGrid');
const noResults = document.getElementById('noResults');
const searchInput = document.getElementById('searchInput');
const viewer = document.getElementById('viewer');
const moduleTitle = document.getElementById('moduleTitle');
const moduleEmoji = document.getElementById('moduleEmoji');
const moduleTagline = document.getElementById('moduleTagline');
const viewerCredit = document.getElementById('viewerCredit');
const originalImage = document.getElementById('originalImage');
const explainerImage = document.getElementById('explainerImage');
const originalCaption = document.getElementById('originalCaption');
const explainerCaption = document.getElementById('explainerCaption');
const explainerPanelLabel = document.getElementById('explainerPanelLabel');
const notesList = document.getElementById('notesList');
const promptList = document.getElementById('promptList');
const sourceCard = document.getElementById('sourceCard');
const modal = document.getElementById('modal');
const modalImage = document.getElementById('modalImage');
const downloadOriginal = document.getElementById('downloadOriginal');
const downloadExplainer = document.getElementById('downloadExplainer');
const themeToggle = document.getElementById('themeToggle');
let lastFocusedElement = null;

function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>"']/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));
}

function sourceLine(m) {
  const s = m.source || {};
  return `“${s.caption || m.title}” · ${s.photographer || 'Unknown'} · Year taken: ${s.year || '—'} · ${s.photoLocation || 'Location not stated'}`;
}

function renderGrid(filter = '') {
  const q = filter.trim().toLowerCase();
  grid.innerHTML = '';
  let matches = 0;

  MODULES.forEach((m, idx) => {
    const s = m.source || {};
    const haystack = [
      m.title,
      m.tagline,
      s.caption,
      s.photographer,
      s.entry,
      s.catalogNo,
      s.year,
      s.size,
      s.salePrice,
      s.photoLocation,
      ...(m.keywords || []),
      ...(m.secondary || []),
      ...(m.university || []),
      ...(m.engineering || [])
    ].join(' ').toLowerCase();

    if (q && !haystack.includes(q)) return;
    matches += 1;

    const moduleCode = `Field ${String(idx + 1).padStart(2, '0')}`;
    const article = document.createElement('article');
    article.className = 'module-card';
    article.tabIndex = 0;
    article.setAttribute('role', 'button');
    article.setAttribute('aria-label', `Open ${m.title} module`);

    const badges = (m.keywords || []).slice(0, 4).map(k => `<span class="keyword">${escapeHtml(k)}</span>`).join('');

    article.innerHTML = `
      <div class="cover-frame">
        <div class="thumb-stage" aria-hidden="true">
          <img class="thumb-base" src="${escapeHtml(m.images.original)}" alt="" loading="lazy" decoding="async">
          <img class="thumb-overlay" src="${escapeHtml(m.images[currentTab])}" alt="" loading="lazy" decoding="async">
          <div class="thumb-gradient"></div>
          <div class="thumb-badge thumb-badge-left">${escapeHtml(tabs[currentTab].label)}</div>
          <div class="thumb-badge thumb-badge-right">Original</div>
        </div>
      </div>
      <div class="module-card-body">
        <div class="module-title-row"><span class="module-emoji">${escapeHtml(moduleCode)}</span><h3>${escapeHtml(m.title)}</h3></div>
        <p class="module-tagline-small">${escapeHtml(m.tagline)}</p>
        <p class="source-line">${escapeHtml(sourceLine(m))}</p>
        <div class="keyword-row">${badges}</div>
        <div class="card-actions">
          <span class="button primary open-btn" aria-hidden="true">Open module</span>
        </div>
      </div>
    `;

    const open = () => openModule(idx);
    article.addEventListener('click', open);
    article.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        open();
      }
    });
    grid.appendChild(article);
  });

  noResults.hidden = matches !== 0;
}

function renderSourceCard(m) {
  const s = m.source || {};
  const compactVenue = s.exhibitionVenue ? s.exhibitionVenue.split(', Basement')[0].replace(', Singapore 187940','') : '—';
  const items = [
    ['Photographer', s.photographer || 'Unknown'],
    ['Catalogue title / caption', s.caption || m.title],
    ['Photo location', s.photoLocation || 'Not stated'],
    ['Year taken', s.year || '—'],
    ['Print size', s.size || '—'],
    ['Sale price / status', s.salePrice || '—'],
    ['Serial number', s.entry || '—'],
    ['Catalogue no.', s.catalogNo || '—'],
    ['Category', s.category || '—'],
    ['Exhibition venue', compactVenue]
  ];

  sourceCard.innerHTML = `
    <h3>${escapeHtml(s.caption || m.title)}</h3>
    <dl class="source-meta-grid">
      ${items.map(([label, value]) => `<div><dt>${escapeHtml(label)}</dt><dd>${escapeHtml(value)}</dd></div>`).join('')}
    </dl>
    <p class="source-note"><strong>Exhibition:</strong> ${escapeHtml(s.exhibitionName || '')}${s.exhibitionTheme ? ` — ${escapeHtml(s.exhibitionTheme)}` : ''}. ${escapeHtml(s.exhibitionDates || '')}</p>
    <p class="source-note"><strong>Location note:</strong> ${escapeHtml(s.locationNote || 'No separate shooting location was listed in the catalogue.')}</p>
    <p class="source-note"><a class="source-link" href="${escapeHtml(s.sourceUrl || '#')}" target="_blank" rel="noopener">View source catalogue</a></p>
  `;
}

function updateViewer() {
  if (currentModule === null) return;
  const m = MODULES[currentModule];
  const s = m.source || {};
  const moduleCode = `Field ${String(currentModule + 1).padStart(2, '0')}`;

  moduleEmoji.textContent = moduleCode;
  moduleTitle.textContent = m.title;
  moduleTagline.textContent = m.tagline;
  viewerCredit.textContent = sourceLine(m);

  document.querySelectorAll('.viewer-tab').forEach(btn => {
    const isActive = btn.dataset.tab === currentTab;
    btn.classList.toggle('active', isActive);
    btn.setAttribute('aria-selected', String(isActive));
  });
  document.querySelectorAll('.chip').forEach(btn => {
    const isActive = btn.dataset.tab === currentTab;
    btn.classList.toggle('active', isActive);
    btn.setAttribute('aria-pressed', String(isActive));
  });

  originalImage.src = m.images.original;
  originalImage.alt = `Original photo: ${m.title}`;
  originalCaption.textContent = `Original exhibition photo — ${s.caption || m.title} · ${s.photographer || 'Unknown'}.`;
  downloadOriginal.href = m.images.original;
  downloadOriginal.setAttribute('download', `${m.id}_original.${m.images.original.split('.').pop()}`);

  explainerImage.src = m.images[currentTab];
  explainerImage.alt = `${tabs[currentTab].label} explainer: ${m.title}`;
  explainerPanelLabel.textContent = `${tabs[currentTab].label} explainer`;
  explainerCaption.textContent = `${tabs[currentTab].label} — ${tabs[currentTab].caption}`;
  downloadExplainer.href = m.images[currentTab];
  downloadExplainer.setAttribute('download', `${m.id}_${currentTab}.${m.images[currentTab].split('.').pop()}`);

  notesList.innerHTML = (m[currentTab] || []).map(item => `<li>${escapeHtml(item)}</li>`).join('');
  promptList.innerHTML = (prompts[currentTab] || []).map(item => `<li>${escapeHtml(item)}</li>`).join('');
  renderSourceCard(m);
  viewer.hidden = false;
}

function openModule(idx) {
  currentModule = idx;
  updateViewer();
  viewer.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function closeViewer() {
  viewer.hidden = true;
}

function openModal(src, alt) {
  lastFocusedElement = document.activeElement;
  modalImage.src = src;
  modalImage.alt = alt || 'Image preview';
  modal.hidden = false;
  modal.querySelector('.modal-close').focus();
}

function closeModal() {
  modal.hidden = true;
  modalImage.removeAttribute('src');
  if (lastFocusedElement && typeof lastFocusedElement.focus === 'function') {
    lastFocusedElement.focus();
  }
}

document.querySelectorAll('.chip').forEach(btn => {
  btn.addEventListener('click', () => {
    currentTab = btn.dataset.tab;
    renderGrid(searchInput.value);
    updateViewer();
  });
});

document.querySelectorAll('.viewer-tab').forEach(btn => {
  btn.addEventListener('click', () => {
    currentTab = btn.dataset.tab;
    renderGrid(searchInput.value);
    updateViewer();
  });
});

searchInput.addEventListener('input', e => renderGrid(e.target.value));

document.getElementById('backToGallery').addEventListener('click', () => {
  closeViewer();
  document.getElementById('modules').scrollIntoView({ behavior: 'smooth', block: 'start' });
});

document.getElementById('prevModule').addEventListener('click', () => {
  if (currentModule === null) return;
  currentModule = (currentModule - 1 + MODULES.length) % MODULES.length;
  updateViewer();
});

document.getElementById('nextModule').addEventListener('click', () => {
  if (currentModule === null) return;
  currentModule = (currentModule + 1) % MODULES.length;
  updateViewer();
});

document.getElementById('zoomOriginal').addEventListener('click', () => openModal(originalImage.src, originalImage.alt));
document.getElementById('zoomExplainer').addEventListener('click', () => openModal(explainerImage.src, explainerImage.alt));
originalImage.addEventListener('click', () => openModal(originalImage.src, originalImage.alt));
explainerImage.addEventListener('click', () => openModal(explainerImage.src, explainerImage.alt));

modal.addEventListener('click', e => {
  if (e.target.dataset.close !== undefined) closeModal();
});

document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && !modal.hidden) closeModal();
  if (viewer.hidden || currentModule === null) return;
  if (e.key === 'ArrowRight') {
    e.preventDefault();
    currentModule = (currentModule + 1) % MODULES.length;
    updateViewer();
  }
  if (e.key === 'ArrowLeft') {
    e.preventDefault();
    currentModule = (currentModule - 1 + MODULES.length) % MODULES.length;
    updateViewer();
  }
});

function syncThemeToggle() {
  const isDark = document.documentElement.classList.contains('dark');
  themeToggle.textContent = isDark ? '☼' : '◐';
  themeToggle.setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode');
}

themeToggle.addEventListener('click', () => {
  document.documentElement.classList.toggle('dark');
  syncThemeToggle();
});

syncThemeToggle();
renderGrid();
