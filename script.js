window.goatcounter = window.goatcounter || {};

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
    label: 'Nature → Design',
    sublabel: 'Design transfer',
    caption: 'The same science and maths mapped to a useful designed system.'
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
    'Which natural principle transferred most directly into design?',
    'What extra systems did designers add, such as sensors, materials, control, or actuators?',
    'Can you think of a different product or robot that could use the same principle?'
  ]
};

const storySteps = [
  { key: 'observe', label: 'Observe', tab: 'secondary', title: 'Observe the scene', level: 'Original photo', levelDetail: 'Look first' },
  { key: 'decode', label: 'Decode', tab: 'secondary', title: 'Reveal the visible science', level: 'Secondary', levelDetail: '15-year-old level' },
  { key: 'model', label: 'Model', tab: 'university', title: 'Test a mathematical model', level: 'University', levelDetail: 'Sophomore level' },
  { key: 'transfer', label: 'Transfer', tab: 'engineering', title: 'Transfer the principle into design', level: 'Nature → Design', levelDetail: 'Design transfer' }
];

const labs = {
  osprey: {
    title: 'Talon pressure model',
    formula: 'Pressure = force / contact area',
    resultLabel: 'Estimated pressure',
    controls: [
      { id: 'force', label: 'Grip force', min: 5, max: 60, step: 1, value: 28, unit: 'N' },
      { id: 'area', label: 'Talon contact area', min: 0.2, max: 4, step: 0.1, value: 1.1, unit: 'cm²' }
    ],
    calculate: v => {
      const kPa = v.force / (v.area * 0.0001) / 1000;
      return {
        value: `${kPa.toFixed(0)} kPa`,
        insight: 'Smaller contact area concentrates the same force, which is why sharp talons grip so effectively.'
      };
    }
  },
  elephant: {
    title: 'Foot pressure and stability',
    formula: 'Pressure = weight / total foot area',
    resultLabel: 'Ground pressure',
    controls: [
      { id: 'mass', label: 'Body mass', min: 2000, max: 6000, step: 100, value: 3600, unit: 'kg' },
      { id: 'area', label: 'Area per foot', min: 0.15, max: 0.75, step: 0.01, value: 0.42, unit: 'm²' }
    ],
    calculate: v => {
      const kPa = (v.mass * 9.81) / (4 * v.area) / 1000;
      return {
        value: `${kPa.toFixed(1)} kPa`,
        insight: 'Large feet spread weight over more area, reducing pressure on soft ground.'
      };
    }
  },
  bird: {
    title: 'Perching friction check',
    formula: 'Grip holds when μ ≥ tan(θ)',
    resultLabel: 'Grip margin',
    controls: [
      { id: 'angle', label: 'Branch angle', min: 0, max: 55, step: 1, value: 24, unit: '°' },
      { id: 'friction', label: 'Claw friction coefficient', min: 0.2, max: 1.2, step: 0.05, value: 0.72, unit: 'μ' }
    ],
    calculate: v => {
      const needed = Math.tan(v.angle * Math.PI / 180);
      const margin = v.friction - needed;
      return {
        value: margin >= 0 ? `+${margin.toFixed(2)}` : margin.toFixed(2),
        insight: margin >= 0 ? 'The bird has enough frictional margin to perch without slipping.' : 'The branch is too steep for this friction value; stronger grip or a lower angle is needed.'
      };
    }
  },
  lemurs: {
    title: 'Branch bending moment',
    formula: 'Moment = load × distance',
    resultLabel: 'Bending moment',
    controls: [
      { id: 'load', label: 'Combined load', min: 20, max: 160, step: 5, value: 75, unit: 'N' },
      { id: 'distance', label: 'Distance from trunk', min: 0.1, max: 1.6, step: 0.05, value: 0.75, unit: 'm' }
    ],
    calculate: v => ({
      value: `${(v.load * v.distance).toFixed(1)} N·m`,
      insight: 'Moving the same load farther from the trunk increases the bending demand on the branch.'
    })
  },
  otter: {
    title: 'Buoyancy balance',
    formula: 'Buoyant force = ρgV',
    resultLabel: 'Net lift in water',
    controls: [
      { id: 'volume', label: 'Displaced volume', min: 4, max: 18, step: 0.5, value: 9, unit: 'L' },
      { id: 'mass', label: 'Otter mass', min: 4, max: 16, step: 0.5, value: 7, unit: 'kg' }
    ],
    calculate: v => {
      const net = (1000 * 9.81 * (v.volume / 1000)) - (v.mass * 9.81);
      return {
        value: `${net.toFixed(1)} N`,
        insight: net >= 0 ? 'Positive net lift helps the otter stay afloat while handling prey.' : 'Negative net lift means the animal must paddle or adjust posture to stay up.'
      };
    }
  },
  camel: {
    title: 'Sand pressure model',
    formula: 'Pressure = load / contact area',
    resultLabel: 'Pressure on sand',
    controls: [
      { id: 'mass', label: 'Camel plus load', min: 300, max: 900, step: 25, value: 550, unit: 'kg' },
      { id: 'area', label: 'Total foot contact area', min: 0.08, max: 0.45, step: 0.01, value: 0.22, unit: 'm²' }
    ],
    calculate: v => ({
      value: `${((v.mass * 9.81) / v.area / 1000).toFixed(1)} kPa`,
      insight: 'Wide feet lower pressure and help camels move across loose sand without sinking deeply.'
    })
  },
  tiger: {
    title: 'Snow traction and pressure',
    formula: 'Pressure = weight / paw area',
    resultLabel: 'Paw pressure',
    controls: [
      { id: 'mass', label: 'Tiger mass', min: 90, max: 280, step: 5, value: 180, unit: 'kg' },
      { id: 'area', label: 'Total paw area', min: 0.03, max: 0.18, step: 0.005, value: 0.095, unit: 'm²' }
    ],
    calculate: v => ({
      value: `${((v.mass * 9.81) / v.area / 1000).toFixed(1)} kPa`,
      insight: 'Lower pressure reduces sinking; traction then depends on claw contact and snow texture.'
    })
  },
  owl: {
    title: 'Binocular vision geometry',
    formula: 'Overlap grows as eye axes converge',
    resultLabel: 'Estimated overlap',
    controls: [
      { id: 'field', label: 'Field of view per eye', min: 80, max: 150, step: 1, value: 115, unit: '°' },
      { id: 'separation', label: 'Eye-axis separation', min: 10, max: 70, step: 1, value: 38, unit: '°' }
    ],
    calculate: v => {
      const overlap = Math.max(0, v.field - v.separation);
      return {
        value: `${overlap.toFixed(0)}°`,
        insight: 'More overlap supports depth judgment, useful for locating prey in low light.'
      };
    }
  }
};

let currentModule = null;
let currentTab = 'secondary';
let currentStoryStep = 0;
let storyActive = false;
let presenterOpen = false;
let lastFocusedElement = null;
let lastNoResultsState = false;
const labValues = {};

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
const storyCard = document.getElementById('storyCard');
const storyTitle = document.getElementById('storyTitle');
const storyPrompt = document.getElementById('storyPrompt');
const storyStepsList = document.getElementById('storySteps');
const labTitle = document.getElementById('labTitle');
const labFormula = document.getElementById('labFormula');
const labControls = document.getElementById('labControls');
const labResultLabel = document.getElementById('labResultLabel');
const labResult = document.getElementById('labResult');
const labInsight = document.getElementById('labInsight');
const presenter = document.getElementById('presenter');
const presenterImage = document.getElementById('presenterImage');
const presenterStepLabel = document.getElementById('presenterStepLabel');
const presenterLevel = document.getElementById('presenterLevel');
const presenterTitle = document.getElementById('presenterTitle');
const presenterPrompt = document.getElementById('presenterPrompt');
const improvementLog = document.getElementById('improvementLog');

function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>"']/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));
}

function trackEvent(name, details = {}) {
  const parts = ['event', name, details.module, details.tab, details.step].filter(Boolean);
  const path = parts.map(part => String(part).toLowerCase().replace(/[^a-z0-9-]+/g, '-')).join('/');
  if (window.goatcounter && typeof window.goatcounter.count === 'function') {
    window.goatcounter.count({
      path,
      title: `Event: ${name}`,
      event: true
    });
  }
}

function sourceLine(m) {
  const s = m.source || {};
  return `"${s.caption || m.title}" · ${s.photographer || 'Unknown'} · Year taken: ${s.year || '—'} · ${s.photoLocation || 'Location not stated'}`;
}

function webpImage(path) {
  return path.replace('assets/images/', 'assets/webp/').replace(/\.(jpe?g|png)$/i, '.webp');
}

function plateImage(m) {
  return `assets/plates/${m.id}_plate.webp`;
}

function moduleCode(idx) {
  return `Field ${String(idx + 1).padStart(2, '0')}`;
}

function currentModuleData() {
  return currentModule === null ? null : MODULES[currentModule];
}

function storyPromptFor(m, stepIndex) {
  if (!m) return '';
  if (stepIndex === 0) return (m.original || [])[0] || 'Look closely before revealing the annotated explanation.';
  if (stepIndex === 1) return (m.secondary || [])[0] || prompts.secondary[0];
  if (stepIndex === 2) return (m.university || [])[0] || prompts.university[0];
  return (m.engineering || [])[0] || prompts.engineering[0];
}

function syncTabControls() {
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
}

function setTab(tab, source = 'manual') {
  currentTab = tab;
  if (source === 'manual') storyActive = false;
  renderGrid(searchInput.value);
  syncTabControls();
  updateViewer();
  trackEvent(`tab_${tab}`, { module: currentModuleData()?.id, tab });
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

    const article = document.createElement('article');
    article.className = 'module-card';
    article.tabIndex = 0;
    article.setAttribute('role', 'button');
    article.setAttribute('aria-label', `Open ${m.title} module`);

    const badges = (m.keywords || []).slice(0, 4).map(k => `<span class="keyword">${escapeHtml(k)}</span>`).join('');

    article.innerHTML = `
      <div class="cover-frame">
        <div class="thumb-stage" aria-hidden="true">
          <div class="thumb-layer thumb-base">
            <img src="${escapeHtml(plateImage(m))}" alt="" loading="lazy" decoding="async">
            <div class="thumb-gradient"></div>
            <div class="thumb-badge thumb-badge-right">Original</div>
          </div>
          <div class="thumb-layer thumb-overlay">
            <img src="${escapeHtml(webpImage(m.images[currentTab]))}" alt="" loading="lazy" decoding="async">
            <div class="thumb-gradient"></div>
            <div class="thumb-badge thumb-badge-left">${escapeHtml(tabs[currentTab].label)}</div>
          </div>
        </div>
      </div>
      <div class="module-card-body">
        <div class="module-title-row"><span class="module-emoji">${escapeHtml(moduleCode(idx))}</span><h3>${escapeHtml(m.title)}</h3></div>
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
  const noResultsActive = q && matches === 0;
  if (noResultsActive && !lastNoResultsState) trackEvent('search_no_results', { module: q.slice(0, 40) });
  lastNoResultsState = Boolean(noResultsActive);
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
    <p class="source-note"><strong>Exhibition:</strong> ${escapeHtml(s.exhibitionName || '')}${s.exhibitionTheme ? ` - ${escapeHtml(s.exhibitionTheme)}` : ''}. ${escapeHtml(s.exhibitionDates || '')}</p>
    <p class="source-note"><strong>Location note:</strong> ${escapeHtml(s.locationNote || 'No separate shooting location was listed in the catalogue.')}</p>
    <p class="source-note"><a class="source-link" href="${escapeHtml(s.sourceUrl || '#')}" target="_blank" rel="noopener">View source catalogue</a></p>
  `;

  const sourceLink = sourceCard.querySelector('.source-link');
  sourceLink?.addEventListener('click', () => trackEvent('source_catalogue_open', { module: m.id }));
}

function renderStoryCard(m) {
  storyCard.hidden = !storyActive;
  viewer.classList.toggle('story-observe', storyActive && currentStoryStep === 0);
  if (!storyActive) return;

  const step = storySteps[currentStoryStep];
  storyTitle.textContent = step.title;
  storyPrompt.textContent = storyPromptFor(m, currentStoryStep);
  storyStepsList.innerHTML = storySteps.map((item, idx) => `<li class="${idx === currentStoryStep ? 'active' : ''}">${escapeHtml(item.label)}</li>`).join('');
  document.getElementById('storyPrev').disabled = currentStoryStep === 0 && currentModule === 0;
  document.getElementById('storyNext').textContent = currentStoryStep === storySteps.length - 1 ? 'Next field study' : 'Next reveal';
}

function getLabValues(m) {
  const lab = labs[m.id];
  if (!labValues[m.id]) {
    labValues[m.id] = Object.fromEntries(lab.controls.map(control => [control.id, control.value]));
  }
  return labValues[m.id];
}

function renderMathLab(m) {
  const lab = labs[m.id];
  if (!lab) return;
  const values = getLabValues(m);
  const result = lab.calculate(values);

  labTitle.textContent = lab.title;
  labFormula.textContent = lab.formula;
  labResultLabel.textContent = lab.resultLabel;
  labResult.textContent = result.value;
  labInsight.textContent = result.insight;
  labControls.innerHTML = lab.controls.map(control => `
    <div class="lab-control">
      <label for="lab-${escapeHtml(control.id)}">
        <span>${escapeHtml(control.label)}</span>
        <output id="lab-${escapeHtml(control.id)}-value">${escapeHtml(values[control.id])} ${escapeHtml(control.unit)}</output>
      </label>
      <input id="lab-${escapeHtml(control.id)}" data-control="${escapeHtml(control.id)}" type="range" min="${control.min}" max="${control.max}" step="${control.step}" value="${escapeHtml(values[control.id])}">
    </div>
  `).join('');

  labControls.querySelectorAll('input[type="range"]').forEach(input => {
    input.addEventListener('input', () => {
      values[input.dataset.control] = Number(input.value);
      renderMathLab(m);
    });
    input.addEventListener('change', () => trackEvent('math_lab_change', { module: m.id }));
  });
}

function updateViewer() {
  if (currentModule === null) return;
  const m = MODULES[currentModule];
  const s = m.source || {};

  moduleEmoji.textContent = moduleCode(currentModule);
  moduleTitle.textContent = m.title;
  moduleTagline.textContent = m.tagline;
  viewerCredit.textContent = sourceLine(m);

  syncTabControls();

  originalImage.src = webpImage(m.images.original);
  originalImage.alt = `Original photo: ${m.title}`;
  originalCaption.textContent = `Original exhibition photo - ${s.caption || m.title} · ${s.photographer || 'Unknown'}.`;
  downloadOriginal.href = m.images.original;
  downloadOriginal.setAttribute('download', `${m.id}_original.${m.images.original.split('.').pop()}`);

  explainerImage.src = webpImage(m.images[currentTab]);
  explainerImage.alt = `${tabs[currentTab].label} explainer: ${m.title}`;
  explainerPanelLabel.textContent = `${tabs[currentTab].label} explainer`;
  explainerCaption.textContent = `${tabs[currentTab].label} - ${tabs[currentTab].caption}`;
  downloadExplainer.href = m.images[currentTab];
  downloadExplainer.setAttribute('download', `${m.id}_${currentTab}.${m.images[currentTab].split('.').pop()}`);

  notesList.innerHTML = (m[currentTab] || []).map(item => `<li>${escapeHtml(item)}</li>`).join('');
  promptList.innerHTML = (prompts[currentTab] || []).map(item => `<li>${escapeHtml(item)}</li>`).join('');
  renderSourceCard(m);
  renderStoryCard(m);
  renderMathLab(m);
  renderPresenter();
  viewer.hidden = false;
}

function openModule(idx, options = {}) {
  currentModule = idx;
  if (options.story) {
    storyActive = true;
    currentStoryStep = options.step || 0;
    currentTab = storySteps[currentStoryStep].tab;
  } else {
    storyActive = false;
    currentStoryStep = 0;
  }
  updateViewer();
  viewer.scrollIntoView({ behavior: 'smooth', block: 'start' });
  trackEvent('module_open', { module: MODULES[idx].id });
}

function closeViewer() {
  viewer.hidden = true;
  storyActive = false;
  viewer.classList.remove('story-observe');
}

function startStory(idx = 0) {
  openModule(idx, { story: true, step: 0 });
  trackEvent('story_start', { module: MODULES[idx].id, step: storySteps[0].key });
}

function advanceStory(delta) {
  if (currentModule === null) startStory(0);
  let nextStep = currentStoryStep + delta;
  let nextModule = currentModule;

  if (nextStep >= storySteps.length) {
    nextStep = 0;
    nextModule = (currentModule + 1) % MODULES.length;
  }
  if (nextStep < 0) {
    if (currentModule === 0) nextStep = 0;
    else {
      nextModule = currentModule - 1;
      nextStep = storySteps.length - 1;
    }
  }

  currentModule = nextModule;
  currentStoryStep = nextStep;
  currentTab = storySteps[currentStoryStep].tab;
  storyActive = true;
  updateViewer();
  trackEvent('story_step', { module: currentModuleData()?.id, step: storySteps[currentStoryStep].key });
}

function exitStory() {
  storyActive = false;
  viewer.classList.remove('story-observe');
  renderStoryCard(currentModuleData());
  trackEvent('story_exit', { module: currentModuleData()?.id });
}

function presenterImageFor(m) {
  if (!m) return '';
  if (currentStoryStep === 0) return webpImage(m.images.original);
  return webpImage(m.images[storySteps[currentStoryStep].tab]);
}

function renderPresenter() {
  if (!presenterOpen) return;
  const m = currentModuleData() || MODULES[0];
  const step = storySteps[currentStoryStep];
  presenterStepLabel.textContent = step.label;
  presenterLevel.textContent = `${step.level} · ${step.levelDetail}`;
  presenterTitle.textContent = m.title;
  presenterPrompt.textContent = storyPromptFor(m, currentStoryStep);
  presenterImage.src = presenterImageFor(m);
  presenterImage.alt = `${step.label}: ${m.title}`;
  document.getElementById('presenterNext').textContent = currentStoryStep === storySteps.length - 1 ? 'Next study' : 'Reveal';
}

function openPresenter() {
  if (currentModule === null) currentModule = 0;
  if (!storyActive) {
    storyActive = true;
    currentStoryStep = 0;
    currentTab = storySteps[0].tab;
  }
  presenterOpen = true;
  presenter.hidden = false;
  document.body.classList.add('presenter-open');
  updateViewer();
  presenter.focus({ preventScroll: true });
  trackEvent('presenter_open', { module: currentModuleData()?.id, step: storySteps[currentStoryStep].key });
}

function closePresenter() {
  presenterOpen = false;
  presenter.hidden = true;
  document.body.classList.remove('presenter-open');
  trackEvent('presenter_close', { module: currentModuleData()?.id });
}

function openModal(src, alt) {
  lastFocusedElement = document.activeElement;
  modalImage.src = src;
  modalImage.alt = alt || 'Image preview';
  modal.hidden = false;
  modal.querySelector('.modal-close').focus();
  trackEvent('image_zoom', { module: currentModuleData()?.id, tab: currentTab });
}

function closeModal() {
  modal.hidden = true;
  modalImage.removeAttribute('src');
  if (lastFocusedElement && typeof lastFocusedElement.focus === 'function') {
    lastFocusedElement.focus();
  }
}

document.querySelectorAll('.chip').forEach(btn => {
  btn.addEventListener('click', () => setTab(btn.dataset.tab));
});

document.querySelectorAll('.viewer-tab').forEach(btn => {
  btn.addEventListener('click', () => setTab(btn.dataset.tab));
});

searchInput.addEventListener('input', e => renderGrid(e.target.value));
searchInput.addEventListener('change', e => {
  if (e.target.value.trim()) trackEvent('search', { module: e.target.value.trim().slice(0, 40) });
});

document.getElementById('backToGallery').addEventListener('click', () => {
  closeViewer();
  document.getElementById('modules').scrollIntoView({ behavior: 'smooth', block: 'start' });
});

document.getElementById('prevModule').addEventListener('click', () => {
  if (currentModule === null) return;
  currentModule = (currentModule - 1 + MODULES.length) % MODULES.length;
  updateViewer();
  trackEvent('module_previous', { module: currentModuleData()?.id });
});

document.getElementById('nextModule').addEventListener('click', () => {
  if (currentModule === null) return;
  currentModule = (currentModule + 1) % MODULES.length;
  updateViewer();
  trackEvent('module_next', { module: currentModuleData()?.id });
});

document.getElementById('storyStart').addEventListener('click', () => startStory(0));
document.getElementById('episodeStart').addEventListener('click', () => startStory(0));
document.getElementById('episodePresenter').addEventListener('click', openPresenter);
document.getElementById('presenterToggle').addEventListener('click', openPresenter);
document.getElementById('viewerPresenter').addEventListener('click', openPresenter);
document.getElementById('storyPrev').addEventListener('click', () => advanceStory(-1));
document.getElementById('storyNext').addEventListener('click', () => advanceStory(1));
document.getElementById('storyExit').addEventListener('click', exitStory);
document.getElementById('presenterPrev').addEventListener('click', () => advanceStory(-1));
document.getElementById('presenterNext').addEventListener('click', () => advanceStory(1));
document.getElementById('presenterClose').addEventListener('click', closePresenter);
improvementLog.addEventListener('toggle', () => {
  if (improvementLog.open) trackEvent('improvement_log_open');
});

downloadOriginal.addEventListener('click', () => trackEvent('download_original', { module: currentModuleData()?.id }));
downloadExplainer.addEventListener('click', () => trackEvent('download_explainer', { module: currentModuleData()?.id, tab: currentTab }));

document.getElementById('zoomOriginal').addEventListener('click', () => openModal(originalImage.src, originalImage.alt));
document.getElementById('zoomExplainer').addEventListener('click', () => openModal(explainerImage.src, explainerImage.alt));
originalImage.addEventListener('click', () => openModal(originalImage.src, originalImage.alt));
explainerImage.addEventListener('click', () => openModal(explainerImage.src, explainerImage.alt));

modal.addEventListener('click', e => {
  if (e.target.dataset.close !== undefined) closeModal();
});

document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && !modal.hidden) {
    closeModal();
    return;
  }
  if (e.key === 'Escape' && presenterOpen) {
    closePresenter();
    return;
  }
  if (presenterOpen) {
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      advanceStory(1);
    }
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      advanceStory(-1);
    }
    return;
  }
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
  trackEvent('theme_toggle', { tab: document.documentElement.classList.contains('dark') ? 'dark' : 'light' });
});

syncThemeToggle();
renderGrid();
