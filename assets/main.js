var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
const FOCUSABLE_ELEMENTS = 'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';
let activeDrawer = null;
let lastFocusedElement = null;
document.addEventListener("DOMContentLoaded", () => {
  initializeMobileMenuButton();
  initializeCloseDrawerButtons();
  initializeEscapeKeyListener();
});
document.addEventListener("cart:updated", () => {
  console.log("///// Cart updated event received //////");
});
function initializeEscapeKeyListener() {
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && activeDrawer && activeDrawer.classList.contains("drawer-active")) {
      closeAllDrawers();
    }
  });
}
function initializeMobileMenuButton() {
  const mobileMenuButton = document.getElementById("mobile-menu-button");
  if (!mobileMenuButton) return;
  mobileMenuButton.addEventListener("click", () => {
    lastFocusedElement = document.activeElement;
    toggleUnderlay();
    const drawer = document.querySelector("#mobile-menu-drawer");
    drawer.classList.toggle("drawer-active");
    if (drawer.classList.contains("drawer-active")) {
      activeDrawer = drawer;
      trapFocus(drawer);
    } else {
      removeFocusTrap(drawer);
      if (lastFocusedElement) {
        lastFocusedElement.focus();
        lastFocusedElement = null;
      }
    }
  });
}
function initializeCloseDrawerButtons() {
  const closeDrawerButtons = document.querySelectorAll(".close-drawer-button");
  closeDrawerButtons.forEach((button) => {
    button.addEventListener("click", closeAllDrawers);
  });
}
function trapFocus(element) {
  const focusableElements = element.querySelectorAll(FOCUSABLE_ELEMENTS);
  const firstFocusable = focusableElements[0];
  const lastFocusable = focusableElements[focusableElements.length - 1];
  element.addEventListener("keydown", handleFocusTrap);
  function handleFocusTrap(e) {
    if (e.key !== "Tab") return;
    if (e.shiftKey) {
      if (document.activeElement === firstFocusable) {
        e.preventDefault();
        lastFocusable.focus();
      }
    } else {
      if (document.activeElement === lastFocusable) {
        e.preventDefault();
        firstFocusable.focus();
      }
    }
  }
  element._focusTrapHandler = handleFocusTrap;
  if (firstFocusable) {
    firstFocusable.focus();
  }
}
function removeFocusTrap(element) {
  if (element._focusTrapHandler) {
    element.removeEventListener("keydown", element._focusTrapHandler);
    delete element._focusTrapHandler;
  }
}
function toggleUnderlay() {
  document.body.classList.toggle("underlay-active");
  document.querySelector("theme-underlay").classList.toggle("active");
}
function closeAllDrawers() {
  toggleUnderlay();
  document.querySelectorAll(".site-drawer").forEach((drawer) => {
    drawer.classList.remove("drawer-active");
    removeFocusTrap(drawer);
  });
  if (lastFocusedElement) {
    lastFocusedElement.focus();
    lastFocusedElement = null;
  }
  activeDrawer = null;
}
class ThemeUnderlay extends HTMLElement {
  constructor() {
    super();
    this.addEventListener("click", closeAllDrawers);
  }
}
class CartDrawerTrigger extends HTMLElement {
  constructor() {
    super();
    __publicField(this, "handleClick", () => {
      lastFocusedElement = document.activeElement;
      toggleUnderlay();
      const cartDrawer = document.querySelector("#cart-drawer");
      const isOpen = cartDrawer.classList.toggle("drawer-active");
      this.setAttribute("aria-expanded", isOpen);
      if (isOpen) {
        activeDrawer = cartDrawer;
        trapFocus(cartDrawer);
      } else {
        removeFocusTrap(cartDrawer);
        if (lastFocusedElement) {
          lastFocusedElement.focus();
          lastFocusedElement = null;
        }
      }
    });
    __publicField(this, "handleKeydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        this.handleClick();
      }
    });
    this.style.cursor = "pointer";
  }
  connectedCallback() {
    this.addEventListener("click", this.handleClick);
    this.addEventListener("keydown", this.handleKeydown);
  }
}
class CartRemoveLineItemButton extends HTMLElement {
  constructor() {
    super();
    __publicField(this, "handleClick", async (e) => {
      const lineKey = this.closest(".cart-drawer-body__line-item").getAttribute("data-line-item-key");
      this.setAttribute("aria-busy", "true");
      this.style.pointerEvents = "none";
      try {
        const response = await fetch("/cart/update.js", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            updates: { [lineKey]: 0 }
          })
        });
        if (response.ok) {
          window.location.reload();
        }
      } catch (error) {
        console.error("Remove failed:", error);
      }
    });
    __publicField(this, "handleKeydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        this.handleClick(e);
      }
    });
    this.addEventListener("click", this.handleClick);
    this.addEventListener("keydown", this.handleKeydown);
  }
}
class CartDecrementLineItemButton extends HTMLElement {
  constructor() {
    super();
    __publicField(this, "handleClick", async () => {
      const lineKey = this.closest(".cart-drawer-body__line-item").getAttribute("data-line-item-key");
      const currentQuantity = parseInt(this.dataset.currentLineQuantity);
      const newQuantity = Math.max(0, currentQuantity - 1);
      try {
        const response = await fetch("/cart/update.js", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            updates: { [lineKey]: newQuantity }
          })
        });
        if (response.ok) {
          window.location.reload();
        }
      } catch (error) {
        console.error("Decrement failed:", error);
      }
    });
    __publicField(this, "handleKeydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        this.handleClick(e);
      }
    });
    this.addEventListener("click", this.handleClick);
    this.addEventListener("keydown", this.handleKeydown);
  }
}
class CartIncrementLineItemButton extends HTMLElement {
  constructor() {
    super();
    __publicField(this, "handleClick", async () => {
      const lineKey = this.closest(".cart-drawer-body__line-item").getAttribute("data-line-item-key");
      const currentQuantity = parseInt(this.dataset.currentLineQuantity);
      const newQuantity = parseInt(currentQuantity) + 1;
      try {
        const response = await fetch("/cart/update.js", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            updates: { [lineKey]: newQuantity }
          })
        });
        if (response.ok) {
          window.location.reload();
        }
      } catch (error) {
        console.error("Increment failed:", error);
      }
    });
    __publicField(this, "handleKeydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        this.handleClick(e);
      }
    });
    this.addEventListener("click", this.handleClick);
    this.addEventListener("keydown", this.handleKeydown);
  }
}
customElements.define("theme-underlay", ThemeUnderlay);
customElements.define("cart-drawer-trigger", CartDrawerTrigger);
customElements.define("cart-remove-line-item-button", CartRemoveLineItemButton);
customElements.define("cart-decrement-line-item-button", CartDecrementLineItemButton);
customElements.define("cart-increment-line-item-button", CartIncrementLineItemButton);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZXMiOlsiLi4vc3JjL21haW4uanMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICcuL21haW4uY3NzJ1xuXG5jb25zdCBGT0NVU0FCTEVfRUxFTUVOVFMgPSAnYVtocmVmXSwgYnV0dG9uOm5vdChbZGlzYWJsZWRdKSwgdGV4dGFyZWE6bm90KFtkaXNhYmxlZF0pLCBpbnB1dDpub3QoW2Rpc2FibGVkXSksIHNlbGVjdDpub3QoW2Rpc2FibGVkXSksIFt0YWJpbmRleF06bm90KFt0YWJpbmRleD1cIi0xXCJdKSdcblxubGV0IGFjdGl2ZURyYXdlciA9IG51bGxcbmxldCBsYXN0Rm9jdXNlZEVsZW1lbnQgPSBudWxsXG5cbi8vIGluaXRpYWxpemUgY29tcG9uZW50cyBhbmQgZXZlbnQgbGlzdGVuZXJzXG5cbmRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ0RPTUNvbnRlbnRMb2FkZWQnLCAoKSA9PiB7XG4gICAgaW5pdGlhbGl6ZU1vYmlsZU1lbnVCdXR0b24oKVxuICAgIGluaXRpYWxpemVDbG9zZURyYXdlckJ1dHRvbnMoKVxuICAgIGluaXRpYWxpemVFc2NhcGVLZXlMaXN0ZW5lcigpXG59KVxuXG5kb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdjYXJ0OnVwZGF0ZWQnLCAoKSA9PiB7XG4gICAgY29uc29sZS5sb2coJy8vLy8vIENhcnQgdXBkYXRlZCBldmVudCByZWNlaXZlZCAvLy8vLy8nKVxufSlcblxuLy8gaW5pdGlhbGl6YXRpb24gZnVuY3Rpb25zXG5cbmZ1bmN0aW9uIGluaXRpYWxpemVFc2NhcGVLZXlMaXN0ZW5lcigpIHtcbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJywgKGUpID0+IHtcbiAgICAgICAgaWYgKGUua2V5ID09PSAnRXNjYXBlJyAmJiBhY3RpdmVEcmF3ZXIgJiYgYWN0aXZlRHJhd2VyLmNsYXNzTGlzdC5jb250YWlucygnZHJhd2VyLWFjdGl2ZScpKSB7XG4gICAgICAgICAgICBjbG9zZUFsbERyYXdlcnMoKVxuICAgICAgICB9XG4gICAgfSlcbn1cblxuZnVuY3Rpb24gaW5pdGlhbGl6ZU1vYmlsZU1lbnVCdXR0b24oKSB7XG4gICAgY29uc3QgbW9iaWxlTWVudUJ1dHRvbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdtb2JpbGUtbWVudS1idXR0b24nKVxuICAgIGlmICghbW9iaWxlTWVudUJ1dHRvbikgcmV0dXJuXG4gICAgbW9iaWxlTWVudUJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcbiAgICAgICAgbGFzdEZvY3VzZWRFbGVtZW50ID0gZG9jdW1lbnQuYWN0aXZlRWxlbWVudFxuICAgICAgICB0b2dnbGVVbmRlcmxheSgpXG4gICAgICAgIGNvbnN0IGRyYXdlciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNtb2JpbGUtbWVudS1kcmF3ZXInKVxuICAgICAgICBkcmF3ZXIuY2xhc3NMaXN0LnRvZ2dsZSgnZHJhd2VyLWFjdGl2ZScpXG4gICAgICAgIFxuICAgICAgICBpZiAoZHJhd2VyLmNsYXNzTGlzdC5jb250YWlucygnZHJhd2VyLWFjdGl2ZScpKSB7XG4gICAgICAgICAgICBhY3RpdmVEcmF3ZXIgPSBkcmF3ZXJcbiAgICAgICAgICAgIHRyYXBGb2N1cyhkcmF3ZXIpXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZW1vdmVGb2N1c1RyYXAoZHJhd2VyKVxuICAgICAgICAgICAgaWYgKGxhc3RGb2N1c2VkRWxlbWVudCkge1xuICAgICAgICAgICAgICAgIGxhc3RGb2N1c2VkRWxlbWVudC5mb2N1cygpXG4gICAgICAgICAgICAgICAgbGFzdEZvY3VzZWRFbGVtZW50ID0gbnVsbFxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSlcbn1cblxuZnVuY3Rpb24gaW5pdGlhbGl6ZUNsb3NlRHJhd2VyQnV0dG9ucygpIHtcbiAgICBjb25zdCBjbG9zZURyYXdlckJ1dHRvbnMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuY2xvc2UtZHJhd2VyLWJ1dHRvbicpXG4gICAgY2xvc2VEcmF3ZXJCdXR0b25zLmZvckVhY2goKGJ1dHRvbikgPT4ge1xuICAgICAgICBidXR0b24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBjbG9zZUFsbERyYXdlcnMpXG4gICAgfSlcbn1cblxuLy8gdXRpbGl0eSBmdW5jdGlvbnNcblxuZnVuY3Rpb24gdHJhcEZvY3VzKGVsZW1lbnQpIHtcbiAgICBjb25zdCBmb2N1c2FibGVFbGVtZW50cyA9IGVsZW1lbnQucXVlcnlTZWxlY3RvckFsbChGT0NVU0FCTEVfRUxFTUVOVFMpXG4gICAgY29uc3QgZmlyc3RGb2N1c2FibGUgPSBmb2N1c2FibGVFbGVtZW50c1swXVxuICAgIGNvbnN0IGxhc3RGb2N1c2FibGUgPSBmb2N1c2FibGVFbGVtZW50c1tmb2N1c2FibGVFbGVtZW50cy5sZW5ndGggLSAxXVxuICAgIFxuICAgIGVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIGhhbmRsZUZvY3VzVHJhcClcbiAgICBcbiAgICBmdW5jdGlvbiBoYW5kbGVGb2N1c1RyYXAoZSkge1xuICAgICAgICBpZiAoZS5rZXkgIT09ICdUYWInKSByZXR1cm5cbiAgICAgICAgXG4gICAgICAgIGlmIChlLnNoaWZ0S2V5KSB7XG4gICAgICAgICAgICBpZiAoZG9jdW1lbnQuYWN0aXZlRWxlbWVudCA9PT0gZmlyc3RGb2N1c2FibGUpIHtcbiAgICAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KClcbiAgICAgICAgICAgICAgICBsYXN0Rm9jdXNhYmxlLmZvY3VzKClcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGlmIChkb2N1bWVudC5hY3RpdmVFbGVtZW50ID09PSBsYXN0Rm9jdXNhYmxlKSB7XG4gICAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpXG4gICAgICAgICAgICAgICAgZmlyc3RGb2N1c2FibGUuZm9jdXMoKVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIFxuICAgIGVsZW1lbnQuX2ZvY3VzVHJhcEhhbmRsZXIgPSBoYW5kbGVGb2N1c1RyYXBcbiAgICBcbiAgICBpZiAoZmlyc3RGb2N1c2FibGUpIHtcbiAgICAgICAgZmlyc3RGb2N1c2FibGUuZm9jdXMoKVxuICAgIH1cbn1cblxuZnVuY3Rpb24gcmVtb3ZlRm9jdXNUcmFwKGVsZW1lbnQpIHtcbiAgICBpZiAoZWxlbWVudC5fZm9jdXNUcmFwSGFuZGxlcikge1xuICAgICAgICBlbGVtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCBlbGVtZW50Ll9mb2N1c1RyYXBIYW5kbGVyKVxuICAgICAgICBkZWxldGUgZWxlbWVudC5fZm9jdXNUcmFwSGFuZGxlclxuICAgIH1cbn1cblxuZnVuY3Rpb24gdG9nZ2xlVW5kZXJsYXkoKSB7XG4gICAgZG9jdW1lbnQuYm9keS5jbGFzc0xpc3QudG9nZ2xlKCd1bmRlcmxheS1hY3RpdmUnKVxuICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ3RoZW1lLXVuZGVybGF5JykuY2xhc3NMaXN0LnRvZ2dsZSgnYWN0aXZlJylcbn1cblxuZnVuY3Rpb24gY2xvc2VBbGxEcmF3ZXJzKCkge1xuICAgIHRvZ2dsZVVuZGVybGF5KClcbiAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuc2l0ZS1kcmF3ZXInKS5mb3JFYWNoKChkcmF3ZXIpID0+IHtcbiAgICAgICAgZHJhd2VyLmNsYXNzTGlzdC5yZW1vdmUoJ2RyYXdlci1hY3RpdmUnKVxuICAgICAgICByZW1vdmVGb2N1c1RyYXAoZHJhd2VyKVxuICAgIH0pXG4gICAgXG4gICAgaWYgKGxhc3RGb2N1c2VkRWxlbWVudCkge1xuICAgICAgICBsYXN0Rm9jdXNlZEVsZW1lbnQuZm9jdXMoKVxuICAgICAgICBsYXN0Rm9jdXNlZEVsZW1lbnQgPSBudWxsXG4gICAgfVxuICAgIFxuICAgIGFjdGl2ZURyYXdlciA9IG51bGxcbn1cblxuLy8gY2xhc3NlcyBmb3Igd2ViIGNvbXBvbmVudHNcbmNsYXNzIFRoZW1lVW5kZXJsYXkgZXh0ZW5kcyBIVE1MRWxlbWVudCB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHN1cGVyKClcbiAgICAgICAgdGhpcy5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICBjbG9zZUFsbERyYXdlcnMpXG4gICAgfVxufVxuXG5jbGFzcyBDYXJ0RHJhd2VyVHJpZ2dlciBleHRlbmRzIEhUTUxFbGVtZW50IHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgc3VwZXIoKVxuICAgICAgICBcbiAgICAgICAgLy8gQWRkIGN1cnNvciBwb2ludGVyIHN0eWxlXG4gICAgICAgIHRoaXMuc3R5bGUuY3Vyc29yID0gJ3BvaW50ZXInXG4gICAgfVxuICAgIFxuICAgIGNvbm5lY3RlZENhbGxiYWNrKCkge1xuICAgICAgICAvLyBBZGQgY2xpY2sgaGFuZGxlclxuICAgICAgICB0aGlzLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgdGhpcy5oYW5kbGVDbGljaylcbiAgICAgICAgXG4gICAgICAgIC8vIEFkZCBrZXlib2FyZCBzdXBwb3J0IGZvciBhY2Nlc3NpYmlsaXR5XG4gICAgICAgIHRoaXMuYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIHRoaXMuaGFuZGxlS2V5ZG93bilcbiAgICB9XG4gICAgXG4gICAgaGFuZGxlQ2xpY2sgPSAoKSA9PiB7XG4gICAgICAgIGxhc3RGb2N1c2VkRWxlbWVudCA9IGRvY3VtZW50LmFjdGl2ZUVsZW1lbnRcbiAgICAgICAgdG9nZ2xlVW5kZXJsYXkoKVxuICAgICAgICBjb25zdCBjYXJ0RHJhd2VyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2NhcnQtZHJhd2VyJylcbiAgICAgICAgY29uc3QgaXNPcGVuID0gY2FydERyYXdlci5jbGFzc0xpc3QudG9nZ2xlKCdkcmF3ZXItYWN0aXZlJylcbiAgICAgICAgXG4gICAgICAgIHRoaXMuc2V0QXR0cmlidXRlKCdhcmlhLWV4cGFuZGVkJywgaXNPcGVuKVxuICAgICAgICBcbiAgICAgICAgaWYgKGlzT3Blbikge1xuICAgICAgICAgICAgYWN0aXZlRHJhd2VyID0gY2FydERyYXdlclxuICAgICAgICAgICAgdHJhcEZvY3VzKGNhcnREcmF3ZXIpXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZW1vdmVGb2N1c1RyYXAoY2FydERyYXdlcilcbiAgICAgICAgICAgIGlmIChsYXN0Rm9jdXNlZEVsZW1lbnQpIHtcbiAgICAgICAgICAgICAgICBsYXN0Rm9jdXNlZEVsZW1lbnQuZm9jdXMoKVxuICAgICAgICAgICAgICAgIGxhc3RGb2N1c2VkRWxlbWVudCA9IG51bGxcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICBcbiAgICBoYW5kbGVLZXlkb3duID0gKGUpID0+IHtcbiAgICAgICAgLy8gTWFrZSBFbnRlciBhbmQgU3BhY2Ugd29yayBsaWtlIGEgYnV0dG9uXG4gICAgICAgIGlmIChlLmtleSA9PT0gJ0VudGVyJyB8fCBlLmtleSA9PT0gJyAnKSB7XG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KClcbiAgICAgICAgICAgIHRoaXMuaGFuZGxlQ2xpY2soKVxuICAgICAgICB9XG4gICAgfVxufVxuXG5jbGFzcyBDYXJ0UmVtb3ZlTGluZUl0ZW1CdXR0b24gZXh0ZW5kcyBIVE1MRWxlbWVudCB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHN1cGVyKClcbiAgICAgICAgXG4gICAgICAgIC8vIEFkZCBidXR0b24gYmVoYXZpb3JcbiAgICAgICAgdGhpcy5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHRoaXMuaGFuZGxlQ2xpY2spXG4gICAgICAgIHRoaXMuYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIHRoaXMuaGFuZGxlS2V5ZG93bilcbiAgICB9XG4gICAgXG4gICAgaGFuZGxlQ2xpY2sgPSBhc3luYyAoZSkgPT4ge1xuICAgICAgICBjb25zdCBsaW5lS2V5ID0gdGhpcy5jbG9zZXN0KCcuY2FydC1kcmF3ZXItYm9keV9fbGluZS1pdGVtJykuZ2V0QXR0cmlidXRlKCdkYXRhLWxpbmUtaXRlbS1rZXknKVxuICAgICAgICBcbiAgICAgICAgdGhpcy5zZXRBdHRyaWJ1dGUoJ2FyaWEtYnVzeScsICd0cnVlJylcbiAgICAgICAgdGhpcy5zdHlsZS5wb2ludGVyRXZlbnRzID0gJ25vbmUnXG4gICAgICAgIFxuICAgICAgICB0cnkge1xuICAgICAgICAgICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaCgnL2NhcnQvdXBkYXRlLmpzJywge1xuICAgICAgICAgICAgICAgIG1ldGhvZDogJ1BPU1QnLFxuICAgICAgICAgICAgICAgIGhlYWRlcnM6IHsgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJyB9LFxuICAgICAgICAgICAgICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KHtcbiAgICAgICAgICAgICAgICAgICAgdXBkYXRlczogeyBbbGluZUtleV06IDAgfVxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgXG4gICAgICAgICAgICBpZiAocmVzcG9uc2Uub2spIHtcbiAgICAgICAgICAgICAgICAvLyByZXBsYWNlIHdpdGggdXBkYXRlIGZ1bmN0aW9uIHdpdGggZm9yIHNlY3Rpb24gcmVuZGVyaW5nIEFQSSBcbiAgICAgICAgICAgICAgICB3aW5kb3cubG9jYXRpb24ucmVsb2FkKClcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ1JlbW92ZSBmYWlsZWQ6JywgZXJyb3IpXG4gICAgICAgIH1cbiAgICB9XG4gICAgXG4gICAgaGFuZGxlS2V5ZG93biA9IChlKSA9PiB7XG4gICAgICAgIGlmIChlLmtleSA9PT0gJ0VudGVyJyB8fCBlLmtleSA9PT0gJyAnKSB7XG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KClcbiAgICAgICAgICAgIHRoaXMuaGFuZGxlQ2xpY2soZSlcbiAgICAgICAgfVxuICAgIH1cbn1cblxuY2xhc3MgQ2FydERlY3JlbWVudExpbmVJdGVtQnV0dG9uIGV4dGVuZHMgSFRNTEVsZW1lbnQge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICBzdXBlcigpXG4gICAgICAgIHRoaXMuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCB0aGlzLmhhbmRsZUNsaWNrKVxuICAgICAgICB0aGlzLmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCB0aGlzLmhhbmRsZUtleWRvd24pXG4gICAgfVxuICAgIFxuICAgIGhhbmRsZUNsaWNrID0gYXN5bmMgKCkgPT4ge1xuXG4gICAgICAgIGNvbnN0IGxpbmVLZXkgPSB0aGlzLmNsb3Nlc3QoJy5jYXJ0LWRyYXdlci1ib2R5X19saW5lLWl0ZW0nKS5nZXRBdHRyaWJ1dGUoJ2RhdGEtbGluZS1pdGVtLWtleScpXG4gICAgICAgIGNvbnN0IGN1cnJlbnRRdWFudGl0eSA9IHBhcnNlSW50KHRoaXMuZGF0YXNldC5jdXJyZW50TGluZVF1YW50aXR5KVxuICAgICAgICBjb25zdCBuZXdRdWFudGl0eSA9IE1hdGgubWF4KDAsIGN1cnJlbnRRdWFudGl0eSAtIDEpXG5cbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgZmV0Y2goJy9jYXJ0L3VwZGF0ZS5qcycsIHtcbiAgICAgICAgICAgICAgICBtZXRob2Q6ICdQT1NUJyxcbiAgICAgICAgICAgICAgICBoZWFkZXJzOiB7ICdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24vanNvbicgfSxcbiAgICAgICAgICAgICAgICBib2R5OiBKU09OLnN0cmluZ2lmeSh7XG4gICAgICAgICAgICAgICAgICAgIHVwZGF0ZXM6IHsgW2xpbmVLZXldOiBuZXdRdWFudGl0eSB9XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGlmIChyZXNwb25zZS5vaykge1xuICAgICAgICAgICAgICAgIC8vIHJlcGxhY2Ugd2l0aCB1cGRhdGUgZnVuY3Rpb24gd2l0aCBmb3Igc2VjdGlvbiByZW5kZXJpbmcgQVBJIFxuICAgICAgICAgICAgICAgIHdpbmRvdy5sb2NhdGlvbi5yZWxvYWQoKVxuICAgICAgICAgICAgfVxuICAgICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICAgICAgY29uc29sZS5lcnJvcignRGVjcmVtZW50IGZhaWxlZDonLCBlcnJvcilcbiAgICAgICAgfVxuICAgIH1cbiAgICBcbiAgICBoYW5kbGVLZXlkb3duID0gKGUpID0+IHtcbiAgICAgICAgaWYgKGUua2V5ID09PSAnRW50ZXInIHx8IGUua2V5ID09PSAnICcpIHtcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKVxuICAgICAgICAgICAgdGhpcy5oYW5kbGVDbGljayhlKVxuICAgICAgICB9XG4gICAgfVxufVxuXG5jbGFzcyBDYXJ0SW5jcmVtZW50TGluZUl0ZW1CdXR0b24gZXh0ZW5kcyBIVE1MRWxlbWVudCB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHN1cGVyKClcbiAgICAgICAgdGhpcy5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHRoaXMuaGFuZGxlQ2xpY2spXG4gICAgICAgIHRoaXMuYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIHRoaXMuaGFuZGxlS2V5ZG93bilcbiAgICB9XG4gICAgXG4gICAgaGFuZGxlQ2xpY2sgPSBhc3luYyAoKSA9PiB7XG5cbiAgICAgICAgY29uc3QgbGluZUtleSA9IHRoaXMuY2xvc2VzdCgnLmNhcnQtZHJhd2VyLWJvZHlfX2xpbmUtaXRlbScpLmdldEF0dHJpYnV0ZSgnZGF0YS1saW5lLWl0ZW0ta2V5JylcbiAgICAgICAgY29uc3QgY3VycmVudFF1YW50aXR5ID0gcGFyc2VJbnQodGhpcy5kYXRhc2V0LmN1cnJlbnRMaW5lUXVhbnRpdHkpXG4gICAgICAgIGNvbnN0IG5ld1F1YW50aXR5ID0gcGFyc2VJbnQoY3VycmVudFF1YW50aXR5KSArIDFcblxuICAgICAgICB0cnkge1xuICAgICAgICAgICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaCgnL2NhcnQvdXBkYXRlLmpzJywge1xuICAgICAgICAgICAgICAgIG1ldGhvZDogJ1BPU1QnLFxuICAgICAgICAgICAgICAgIGhlYWRlcnM6IHsgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJyB9LFxuICAgICAgICAgICAgICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KHtcbiAgICAgICAgICAgICAgICAgICAgdXBkYXRlczogeyBbbGluZUtleV06IG5ld1F1YW50aXR5IH1cbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgaWYgKHJlc3BvbnNlLm9rKSB7XG4gICAgICAgICAgICAgICAgLy8gcmVwbGFjZSB3aXRoIHVwZGF0ZSBmdW5jdGlvbiB3aXRoIGZvciBzZWN0aW9uIHJlbmRlcmluZyBBUEkgXG4gICAgICAgICAgICAgICAgd2luZG93LmxvY2F0aW9uLnJlbG9hZCgpXG4gICAgICAgICAgICB9XG4gICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKCdJbmNyZW1lbnQgZmFpbGVkOicsIGVycm9yKVxuICAgICAgICB9XG4gICAgfVxuICAgIFxuICAgIGhhbmRsZUtleWRvd24gPSAoZSkgPT4ge1xuICAgICAgICBpZiAoZS5rZXkgPT09ICdFbnRlcicgfHwgZS5rZXkgPT09ICcgJykge1xuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpXG4gICAgICAgICAgICB0aGlzLmhhbmRsZUNsaWNrKGUpXG4gICAgICAgIH1cbiAgICB9XG59XG5cbmN1c3RvbUVsZW1lbnRzLmRlZmluZSgndGhlbWUtdW5kZXJsYXknLCBUaGVtZVVuZGVybGF5KVxuY3VzdG9tRWxlbWVudHMuZGVmaW5lKCdjYXJ0LWRyYXdlci10cmlnZ2VyJywgQ2FydERyYXdlclRyaWdnZXIpXG5jdXN0b21FbGVtZW50cy5kZWZpbmUoJ2NhcnQtcmVtb3ZlLWxpbmUtaXRlbS1idXR0b24nLCBDYXJ0UmVtb3ZlTGluZUl0ZW1CdXR0b24pXG5jdXN0b21FbGVtZW50cy5kZWZpbmUoJ2NhcnQtZGVjcmVtZW50LWxpbmUtaXRlbS1idXR0b24nLCBDYXJ0RGVjcmVtZW50TGluZUl0ZW1CdXR0b24pXG5jdXN0b21FbGVtZW50cy5kZWZpbmUoJ2NhcnQtaW5jcmVtZW50LWxpbmUtaXRlbS1idXR0b24nLCBDYXJ0SW5jcmVtZW50TGluZUl0ZW1CdXR0b24pIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUVBLE1BQU0scUJBQXFCO0FBRTNCLElBQUksZUFBZTtBQUNuQixJQUFJLHFCQUFxQjtBQUl6QixTQUFTLGlCQUFpQixvQkFBb0IsTUFBTTtBQUNoRCw2QkFBMEI7QUFDMUIsK0JBQTRCO0FBQzVCLDhCQUEyQjtBQUMvQixDQUFDO0FBRUQsU0FBUyxpQkFBaUIsZ0JBQWdCLE1BQU07QUFDNUMsVUFBUSxJQUFJLDBDQUEwQztBQUMxRCxDQUFDO0FBSUQsU0FBUyw4QkFBOEI7QUFDbkMsV0FBUyxpQkFBaUIsV0FBVyxDQUFDLE1BQU07QUFDeEMsUUFBSSxFQUFFLFFBQVEsWUFBWSxnQkFBZ0IsYUFBYSxVQUFVLFNBQVMsZUFBZSxHQUFHO0FBQ3hGLHNCQUFlO0FBQUEsSUFDbkI7QUFBQSxFQUNKLENBQUM7QUFDTDtBQUVBLFNBQVMsNkJBQTZCO0FBQ2xDLFFBQU0sbUJBQW1CLFNBQVMsZUFBZSxvQkFBb0I7QUFDckUsTUFBSSxDQUFDLGlCQUFrQjtBQUN2QixtQkFBaUIsaUJBQWlCLFNBQVMsTUFBTTtBQUM3Qyx5QkFBcUIsU0FBUztBQUM5QixtQkFBYztBQUNkLFVBQU0sU0FBUyxTQUFTLGNBQWMscUJBQXFCO0FBQzNELFdBQU8sVUFBVSxPQUFPLGVBQWU7QUFFdkMsUUFBSSxPQUFPLFVBQVUsU0FBUyxlQUFlLEdBQUc7QUFDNUMscUJBQWU7QUFDZixnQkFBVSxNQUFNO0FBQUEsSUFDcEIsT0FB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
