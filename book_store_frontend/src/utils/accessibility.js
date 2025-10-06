//
// Accessibility utilities: focus trapping and aria helpers
//

/**
 * Returns a list of focusable elements within a container.
 * Based on common selectors and filters out disabled/hidden elements.
 */
function getFocusableElements(container) {
  if (!container) return [];
  const selectors = [
    'a[href]',
    'area[href]',
    'button:not([disabled])',
    'input:not([disabled]):not([type="hidden"])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    'iframe',
    'object',
    'embed',
    '[contenteditable="true"]',
    '[tabindex]:not([tabindex="-1"])',
  ];
  const elements = Array.from(container.querySelectorAll(selectors.join(',')));
  return elements.filter((el) => {
    const style = window.getComputedStyle(el);
    const isHidden = style.display === 'none' || style.visibility === 'hidden';
    const isDisabled = el.hasAttribute('disabled') || el.getAttribute('aria-disabled') === 'true';
    return !isHidden && !isDisabled && el.tabIndex !== -1;
  });
}

/**
 * Trap focus within a given element.
 * Returns a cleanup function to remove listeners.
 */
// PUBLIC_INTERFACE
export function trapFocus(container, initialFocusEl) {
  /** Trap keyboard focus within container and optionally move focus to initialFocusEl. */
  if (!container) return () => {};

  // store the previously focused element to restore on cleanup
  const previouslyFocused = document.activeElement;

  const focusables = () => getFocusableElements(container);
  const focusFirst = () => {
    const list = focusables();
    const el = initialFocusEl && container.contains(initialFocusEl) ? initialFocusEl : list[0];
    if (el && typeof el.focus === 'function') el.focus();
  };

  // focus on next/prev when tabbing
  const onKeyDown = (e) => {
    if (e.key !== 'Tab') return;
    const list = focusables();
    if (list.length === 0) {
      // If no focusable items, prevent tabbing away entirely
      e.preventDefault();
      container.focus();
      return;
    }
    const currentIndex = list.indexOf(document.activeElement);
    let nextIndex = currentIndex;

    if (e.shiftKey) {
      // backward
      nextIndex = currentIndex <= 0 ? list.length - 1 : currentIndex - 1;
    } else {
      // forward
      nextIndex = currentIndex === list.length - 1 ? 0 : currentIndex + 1;
    }

    e.preventDefault();
    list[nextIndex]?.focus?.();
  };

  // prevent focusing elements outside the trap
  const onFocus = (e) => {
    if (!container.contains(e.target)) {
      const list = focusables();
      if (list.length > 0) list[0].focus();
      else container.focus();
    }
  };

  document.addEventListener('keydown', onKeyDown);
  document.addEventListener('focusin', onFocus);

  // set initial focus
  setTimeout(focusFirst, 0);

  // Return cleanup
  return () => {
    document.removeEventListener('keydown', onKeyDown);
    document.removeEventListener('focusin', onFocus);
    // restore focus if possible
    if (previouslyFocused && typeof previouslyFocused.focus === 'function') {
      previouslyFocused.focus();
    }
  };
}

// PUBLIC_INTERFACE
export function setAriaHiddenOutside(container, hidden = true) {
  /** Set aria-hidden on all body children except container and its ancestors to hide background from AT. */
  if (!container) return () => {};
  const root = document.body;
  const keepSet = new Set();
  let node = container;
  while (node) {
    keepSet.add(node);
    node = node.parentElement;
  }

  const changed = [];
  Array.from(root.children).forEach((child) => {
    if (!keepSet.has(child)) {
      if (hidden) {
        if (child.getAttribute('aria-hidden') !== 'true') {
          child.setAttribute('aria-hidden', 'true');
          changed.push(child);
        }
      }
    }
  });

  // cleanup restores aria-hidden to previous state (removes ones we added)
  return () => {
    changed.forEach((el) => el.removeAttribute('aria-hidden'));
  };
}

// PUBLIC_INTERFACE
export function announceLiveMessage(node, message) {
  /** Utility to update an aria-live node text in a screen-reader-friendly way. */
  if (!node) return;
  node.textContent = '';
  setTimeout(() => {
    if (node) node.textContent = message;
  }, 30);
}
