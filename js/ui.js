import {
  howToLink,
  readmeDialog,
  readmeBody,
  readmeClose,
  readmeBackdrop,
  themeToggleButton,
  themeToggleLabel
} from './dom.js';

const activeDialogLocks = new Set();

export function getFocusableElements(container) {
  if (!container) {
    return [];
  }

  const selectors = [
    'a[href]',
    'button:not([disabled])',
    'input:not([disabled])',
    'textarea:not([disabled])',
    'select:not([disabled])',
    'details summary',
    '[tabindex]:not([tabindex="-1"])'
  ];

  return Array.from(container.querySelectorAll(selectors)).filter(element => {
    if (!(element instanceof HTMLElement)) {
      return false;
    }
    const computed = window.getComputedStyle(element);
    return computed.display !== 'none' && computed.visibility !== 'hidden';
  });
}

export function setBodyScrollLock(source, locked) {
  if (!source) {
    return;
  }

  if (locked) {
    activeDialogLocks.add(source);
  } else {
    activeDialogLocks.delete(source);
  }

  const body = document.body;
  if (!body) {
    return;
  }

  if (activeDialogLocks.size > 0) {
    body.classList.add('dialog-open');
  } else {
    body.classList.remove('dialog-open');
  }
}

function parseMarkdown(text) {
  if (window.marked && typeof window.marked.parse === 'function') {
    return window.marked.parse(text);
  }
  const escaped = text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
  return `<pre>${escaped}</pre>`;
}

const README_SOURCES = [
  new URL('README.md', document.baseURI).toString(),
  'https://raw.githubusercontent.com/jd-d/course-pricing-calculator/main/README.md'
];

function fetchReadmeFromSources(sources, index = 0) {
  if (!Array.isArray(sources) || index >= sources.length) {
    return Promise.reject(new Error('No README sources available'));
  }

  const source = sources[index];

  return fetch(source)
    .then(response => {
      if (!response || !response.ok) {
        throw new Error(`Failed to load README from ${source} (status ${response ? response.status : 'unknown'})`);
      }
      return response.text();
    })
    .catch(error => {
      if (index < sources.length - 1) {
        if (console && typeof console.warn === 'function') {
          console.warn(error);
        }

        if (readmeBody) {
          readmeBody.innerHTML = '<p class="readme-status">Retrying with a backup instructions source…</p>';
        }

        return fetchReadmeFromSources(sources, index + 1);
      }

      throw error;
    });
}

let readmeLoaded = false;
let readmeLoading = false;
let previouslyFocusedElement = null;

function loadReadme() {
  if (readmeLoaded || readmeLoading || !readmeBody) {
    return;
  }

  readmeLoading = true;

  fetchReadmeFromSources(README_SOURCES)
    .then(text => {
      readmeBody.innerHTML = parseMarkdown(text);
      readmeLoaded = true;
    })
    .catch(() => {
      readmeBody.innerHTML = '<p class="readme-status readme-status--error">Unable to load instructions. Please check the README file directly.</p>';
    })
    .finally(() => {
      readmeLoading = false;
    });
}

function handleReadmeKeydown(event) {
  if (event.key === 'Escape') {
    closeReadme();
    return;
  }

  if (!readmeDialog || !readmeDialog.contains(event.target)) {
    return;
  }

  if (event.key !== 'Tab') {
    return;
  }

  const focusable = getFocusableElements(readmeDialog);
  if (focusable.length === 0) {
    event.preventDefault();
    return;
  }

  const first = focusable[0];
  const last = focusable[focusable.length - 1];
  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
}

function openReadme(event) {
  if (event) {
    event.preventDefault();
  }

  if (!readmeDialog || !readmeBody) {
    return;
  }

  previouslyFocusedElement = document.activeElement instanceof HTMLElement ? document.activeElement : null;
  readmeDialog.hidden = false;
  setBodyScrollLock('readme', true);

  if (!readmeLoaded) {
    readmeBody.innerHTML = '<p class="readme-status">Loading instructions…</p>';
    loadReadme();
  }

  window.requestAnimationFrame(() => {
    if (readmeClose) {
      readmeClose.focus();
    }
  });

  document.addEventListener('keydown', handleReadmeKeydown);
}

function closeReadme() {
  if (!readmeDialog) {
    return;
  }

  readmeDialog.hidden = true;
  setBodyScrollLock('readme', false);
  document.removeEventListener('keydown', handleReadmeKeydown);

  if (previouslyFocusedElement && typeof previouslyFocusedElement.focus === 'function') {
    previouslyFocusedElement.focus();
  }
}

function initReadme() {
  if (!readmeDialog) {
    return;
  }

  if (howToLink) {
    howToLink.addEventListener('click', openReadme);
  }

  if (readmeClose) {
    readmeClose.addEventListener('click', closeReadme);
  }

  if (readmeBackdrop) {
    readmeBackdrop.addEventListener('click', closeReadme);
  }

  readmeDialog.addEventListener('click', event => {
    if (event.target === readmeDialog) {
      closeReadme();
    }
  });
}

const THEME_STORAGE_KEY = 'course-pricing-theme';
const prefersDarkScheme = typeof window.matchMedia === 'function'
  ? window.matchMedia('(prefers-color-scheme: dark)')
  : { matches: true };
let respectSystemPreference = true;
let themeInitialized = false;

function getStoredTheme() {
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    if (stored === 'light' || stored === 'dark') {
      return stored;
    }
  } catch (error) {
    // Ignore storage access errors (e.g. private browsing restrictions)
  }
  return null;
}

function applyThemePreference(theme, { save = true } = {}) {
  const normalized = theme === 'light' ? 'light' : 'dark';
  document.body.dataset.theme = normalized;

  if (save) {
    try {
      localStorage.setItem(THEME_STORAGE_KEY, normalized);
    } catch (error) {
      // Ignore storage access errors
    }
  }

  if (themeToggleButton && themeToggleLabel) {
    const isDark = normalized === 'dark';
    const actionLabel = `Switch to ${isDark ? 'light' : 'dark'} mode`;
    themeToggleButton.setAttribute('aria-pressed', String(isDark));
    themeToggleButton.setAttribute('aria-label', actionLabel);
    themeToggleButton.setAttribute('title', actionLabel);
    themeToggleLabel.textContent = isDark ? 'Dark mode' : 'Light mode';
  }

  document.dispatchEvent(new CustomEvent('themechange', { detail: normalized }));
}

function handlePreferenceChange(event) {
  if (respectSystemPreference) {
    applyThemePreference(event.matches ? 'dark' : 'light', { save: false });
  }
}

function initTheme() {
  if (themeInitialized) {
    return;
  }
  themeInitialized = true;

  const storedTheme = getStoredTheme();
  respectSystemPreference = !storedTheme;

  applyThemePreference(storedTheme || (prefersDarkScheme.matches ? 'dark' : 'light'), {
    save: Boolean(storedTheme)
  });

  if (typeof prefersDarkScheme.addEventListener === 'function') {
    prefersDarkScheme.addEventListener('change', handlePreferenceChange);
  } else if (typeof prefersDarkScheme.addListener === 'function') {
    prefersDarkScheme.addListener(handlePreferenceChange);
  }

  if (themeToggleButton) {
    themeToggleButton.addEventListener('click', () => {
      const nextTheme = document.body.dataset.theme === 'dark' ? 'light' : 'dark';
      respectSystemPreference = false;
      applyThemePreference(nextTheme);
    });
  }
}

const INFO_ICON_ACTIVE_CLASS = 'is-active';
const TOOLTIP_VIEWPORT_PADDING = 16;
let activeInfoIcon = null;
let infoIconTooltipId = 0;
let infoIconsInitialized = false;

function isInfoIcon(element) {
  return element instanceof HTMLElement && element.classList.contains('info-icon');
}

export function ensureInfoIconTooltip(icon) {
  if (!isInfoIcon(icon)) {
    return null;
  }

  let tooltip = icon.querySelector('.info-icon__tooltip');
  if (!(tooltip instanceof HTMLElement)) {
    tooltip = document.createElement('span');
    tooltip.className = 'info-icon__tooltip';
    tooltip.setAttribute('role', 'tooltip');
    icon.append(tooltip);
  }

  let arrow = icon.querySelector('.info-icon__arrow');
  if (!(arrow instanceof HTMLElement)) {
    arrow = document.createElement('span');
    arrow.className = 'info-icon__arrow';
    arrow.setAttribute('aria-hidden', 'true');
    icon.append(arrow);
  }

  const tooltipText = icon.dataset.tooltip || icon.getAttribute('aria-label') || '';
  tooltip.textContent = tooltipText;

  if (!tooltip.id) {
    infoIconTooltipId += 1;
    tooltip.id = `info-icon-tooltip-${infoIconTooltipId}`;
  }

  if (!icon.hasAttribute('aria-describedby')) {
    icon.setAttribute('aria-describedby', tooltip.id);
  }

  return { tooltip, arrow };
}

function positionInfoIconTooltip(icon) {
  if (!isInfoIcon(icon)) {
    return;
  }

  const parts = ensureInfoIconTooltip(icon);
  if (!parts || !(parts.tooltip instanceof HTMLElement)) {
    return;
  }

  icon.style.setProperty('--tooltip-shift', '0px');
  const tooltipRect = parts.tooltip.getBoundingClientRect();
  const viewportWidth = window.innerWidth || document.documentElement.clientWidth || 0;
  const padding = TOOLTIP_VIEWPORT_PADDING;
  let shift = 0;

  if (tooltipRect.left < padding) {
    shift = padding - tooltipRect.left;
  } else if (tooltipRect.right > viewportWidth - padding) {
    shift = -(tooltipRect.right - (viewportWidth - padding));
  }

  icon.style.setProperty('--tooltip-shift', `${shift}px`);
}

function enhanceInfoIcon(icon) {
  if (!isInfoIcon(icon)) {
    return;
  }

  if (!icon.hasAttribute('tabindex')) {
    icon.setAttribute('tabindex', '0');
  }

  icon.setAttribute('role', 'button');
  icon.setAttribute('aria-expanded', icon.classList.contains(INFO_ICON_ACTIVE_CLASS) ? 'true' : 'false');

  if (!icon.hasAttribute('aria-label') && icon.dataset.tooltip) {
    icon.setAttribute('aria-label', icon.dataset.tooltip);
  }

  ensureInfoIconTooltip(icon);
}

function enhanceAllInfoIcons() {
  document.querySelectorAll('.info-icon').forEach(enhanceInfoIcon);
}

function closeActiveInfoIcon() {
  if (activeInfoIcon instanceof HTMLElement) {
    activeInfoIcon.classList.remove(INFO_ICON_ACTIVE_CLASS);
    activeInfoIcon.setAttribute('aria-expanded', 'false');
  }
  activeInfoIcon = null;
}

function openInfoIcon(icon) {
  if (!isInfoIcon(icon)) {
    return;
  }

  if (activeInfoIcon && activeInfoIcon !== icon) {
    closeActiveInfoIcon();
  }

  icon.classList.add(INFO_ICON_ACTIVE_CLASS);
  icon.setAttribute('aria-expanded', 'true');
  activeInfoIcon = icon;
  positionInfoIconTooltip(icon);
}

function toggleInfoIcon(icon) {
  if (!isInfoIcon(icon)) {
    return;
  }

  if (icon.classList.contains(INFO_ICON_ACTIVE_CLASS)) {
    if (activeInfoIcon === icon) {
      closeActiveInfoIcon();
    } else {
      icon.classList.remove(INFO_ICON_ACTIVE_CLASS);
      icon.setAttribute('aria-expanded', 'false');
    }
  } else {
    openInfoIcon(icon);
  }
}

function initInfoIcons() {
  if (infoIconsInitialized) {
    return;
  }
  infoIconsInitialized = true;

  document.addEventListener('click', event => {
    const target = event.target instanceof HTMLElement ? event.target.closest('.info-icon') : null;
    if (!isInfoIcon(target)) {
      closeActiveInfoIcon();
      return;
    }
    event.preventDefault();
    enhanceInfoIcon(target);
    toggleInfoIcon(target);
    positionInfoIconTooltip(target);
    if (typeof target.focus === 'function') {
      target.focus();
    }
  });

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') {
      if (activeInfoIcon) {
        event.preventDefault();
        const current = activeInfoIcon;
        closeActiveInfoIcon();
        if (current instanceof HTMLElement && typeof current.focus === 'function') {
          current.focus();
        }
      }
      return;
    }

    const target = event.target instanceof HTMLElement ? event.target.closest('.info-icon') : null;
    if (!isInfoIcon(target)) {
      return;
    }

    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      enhanceInfoIcon(target);
      toggleInfoIcon(target);
      positionInfoIconTooltip(target);
    }
  });

  document.addEventListener('focusin', event => {
    const target = event.target instanceof HTMLElement ? event.target.closest('.info-icon') : null;
    if (!isInfoIcon(target)) {
      closeActiveInfoIcon();
      return;
    }
    enhanceInfoIcon(target);
    positionInfoIconTooltip(target);
  });

  enhanceAllInfoIcons();

  document.addEventListener('mouseover', event => {
    const target = event.target instanceof HTMLElement ? event.target.closest('.info-icon') : null;
    if (!isInfoIcon(target)) {
      return;
    }
    positionInfoIconTooltip(target);
  });

  window.addEventListener('resize', () => {
    if (activeInfoIcon) {
      positionInfoIconTooltip(activeInfoIcon);
    }
  });
}

export function initUi() {
  initReadme();
  initTheme();
  initInfoIcons();
}
