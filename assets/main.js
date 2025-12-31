var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
document.addEventListener("DOMContentLoaded", () => {
  initializeMobileMenuButton();
  initializeCloseDrawerButtons();
});
document.addEventListener("cart:updated", () => {
  console.log("///// Cart updated event received //////");
});
function initializeMobileMenuButton() {
  const mobileMenuButton = document.getElementById("mobile-menu-button");
  if (!mobileMenuButton) return;
  mobileMenuButton.addEventListener("click", () => {
    toggleUnderlay();
    document.querySelector("#mobile-menu-drawer").classList.toggle("drawer-active");
  });
}
function initializeCloseDrawerButtons() {
  const closeDrawerButtons = document.querySelectorAll(".close-drawer-button");
  closeDrawerButtons.forEach((button) => {
    button.addEventListener("click", closeAllDrawers);
  });
}
function toggleUnderlay() {
  document.body.classList.toggle("underlay-active");
  document.querySelector("theme-underlay").classList.toggle("active");
}
function closeAllDrawers() {
  toggleUnderlay();
  document.querySelectorAll(".site-drawer").forEach((drawer) => {
    drawer.classList.remove("drawer-active");
  });
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
      toggleUnderlay();
      const cartDrawer = document.querySelector("#cart-drawer");
      const isOpen = cartDrawer.classList.toggle("drawer-active");
      this.setAttribute("aria-expanded", isOpen);
      if (isOpen) {
        cartDrawer.focus();
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZXMiOlsiLi4vc3JjL21haW4uanMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICcuL21haW4uY3NzJ1xuXG4vLyBpbml0aWFsaXplIGNvbXBvbmVudHMgYW5kIGV2ZW50IGxpc3RlbmVyc1xuXG5kb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdET01Db250ZW50TG9hZGVkJywgKCkgPT4ge1xuICAgIC8vIGluaXRpYWxpemUgZXZlbnQgbGlzdGVuZXJzXG4gICAgaW5pdGlhbGl6ZU1vYmlsZU1lbnVCdXR0b24oKVxuICAgIGluaXRpYWxpemVDbG9zZURyYXdlckJ1dHRvbnMoKVxufSlcblxuZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignY2FydDp1cGRhdGVkJywgKCkgPT4ge1xuICAgIGNvbnNvbGUubG9nKCcvLy8vLyBDYXJ0IHVwZGF0ZWQgZXZlbnQgcmVjZWl2ZWQgLy8vLy8vJylcbn0pXG5cbi8vIGluaXRpYWxpemF0aW9uIGZ1bmN0aW9uc1xuXG5mdW5jdGlvbiBpbml0aWFsaXplTW9iaWxlTWVudUJ1dHRvbigpIHtcbiAgICBjb25zdCBtb2JpbGVNZW51QnV0dG9uID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ21vYmlsZS1tZW51LWJ1dHRvbicpXG4gICAgaWYgKCFtb2JpbGVNZW51QnV0dG9uKSByZXR1cm5cbiAgICBtb2JpbGVNZW51QnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuICAgICAgICB0b2dnbGVVbmRlcmxheSgpXG4gICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNtb2JpbGUtbWVudS1kcmF3ZXInKS5jbGFzc0xpc3QudG9nZ2xlKCdkcmF3ZXItYWN0aXZlJylcbiAgICB9KVxufVxuXG5mdW5jdGlvbiBpbml0aWFsaXplQ2xvc2VEcmF3ZXJCdXR0b25zKCkge1xuICAgIGNvbnN0IGNsb3NlRHJhd2VyQnV0dG9ucyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5jbG9zZS1kcmF3ZXItYnV0dG9uJylcbiAgICBjbG9zZURyYXdlckJ1dHRvbnMuZm9yRWFjaCgoYnV0dG9uKSA9PiB7XG4gICAgICAgIGJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGNsb3NlQWxsRHJhd2VycylcbiAgICB9KVxufVxuXG4vLyB1dGlsaXR5IGZ1bmN0aW9uc1xuXG5mdW5jdGlvbiB0b2dnbGVVbmRlcmxheSgpIHtcbiAgICBkb2N1bWVudC5ib2R5LmNsYXNzTGlzdC50b2dnbGUoJ3VuZGVybGF5LWFjdGl2ZScpXG4gICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcigndGhlbWUtdW5kZXJsYXknKS5jbGFzc0xpc3QudG9nZ2xlKCdhY3RpdmUnKVxufVxuXG5mdW5jdGlvbiBjbG9zZUFsbERyYXdlcnMoKSB7XG4gICAgdG9nZ2xlVW5kZXJsYXkoKVxuICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5zaXRlLWRyYXdlcicpLmZvckVhY2goKGRyYXdlcikgPT4ge1xuICAgICAgICBkcmF3ZXIuY2xhc3NMaXN0LnJlbW92ZSgnZHJhd2VyLWFjdGl2ZScpXG4gICAgfSlcbn1cblxuLy8gY2xhc3NlcyBmb3Igd2ViIGNvbXBvbmVudHNcbmNsYXNzIFRoZW1lVW5kZXJsYXkgZXh0ZW5kcyBIVE1MRWxlbWVudCB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHN1cGVyKClcbiAgICAgICAgdGhpcy5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICBjbG9zZUFsbERyYXdlcnMpXG4gICAgfVxufVxuXG5jbGFzcyBDYXJ0RHJhd2VyVHJpZ2dlciBleHRlbmRzIEhUTUxFbGVtZW50IHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgc3VwZXIoKVxuICAgICAgICBcbiAgICAgICAgLy8gQWRkIGN1cnNvciBwb2ludGVyIHN0eWxlXG4gICAgICAgIHRoaXMuc3R5bGUuY3Vyc29yID0gJ3BvaW50ZXInXG4gICAgfVxuICAgIFxuICAgIGNvbm5lY3RlZENhbGxiYWNrKCkge1xuICAgICAgICAvLyBBZGQgY2xpY2sgaGFuZGxlclxuICAgICAgICB0aGlzLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgdGhpcy5oYW5kbGVDbGljaylcbiAgICAgICAgXG4gICAgICAgIC8vIEFkZCBrZXlib2FyZCBzdXBwb3J0IGZvciBhY2Nlc3NpYmlsaXR5XG4gICAgICAgIHRoaXMuYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIHRoaXMuaGFuZGxlS2V5ZG93bilcbiAgICB9XG4gICAgXG4gICAgaGFuZGxlQ2xpY2sgPSAoKSA9PiB7XG4gICAgICAgIHRvZ2dsZVVuZGVybGF5KClcbiAgICAgICAgY29uc3QgY2FydERyYXdlciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNjYXJ0LWRyYXdlcicpXG4gICAgICAgIGNvbnN0IGlzT3BlbiA9IGNhcnREcmF3ZXIuY2xhc3NMaXN0LnRvZ2dsZSgnZHJhd2VyLWFjdGl2ZScpXG4gICAgICAgIFxuICAgICAgICAvLyBVcGRhdGUgQVJJQSBzdGF0ZVxuICAgICAgICB0aGlzLnNldEF0dHJpYnV0ZSgnYXJpYS1leHBhbmRlZCcsIGlzT3BlbilcbiAgICAgICAgXG4gICAgICAgIC8vIE9wdGlvbmFsbHkgZm9jdXMgdGhlIGRyYXdlciB3aGVuIG9wZW5lZFxuICAgICAgICBpZiAoaXNPcGVuKSB7XG4gICAgICAgICAgICBjYXJ0RHJhd2VyLmZvY3VzKClcbiAgICAgICAgfVxuICAgIH1cbiAgICBcbiAgICBoYW5kbGVLZXlkb3duID0gKGUpID0+IHtcbiAgICAgICAgLy8gTWFrZSBFbnRlciBhbmQgU3BhY2Ugd29yayBsaWtlIGEgYnV0dG9uXG4gICAgICAgIGlmIChlLmtleSA9PT0gJ0VudGVyJyB8fCBlLmtleSA9PT0gJyAnKSB7XG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KClcbiAgICAgICAgICAgIHRoaXMuaGFuZGxlQ2xpY2soKVxuICAgICAgICB9XG4gICAgfVxufVxuXG5jbGFzcyBDYXJ0UmVtb3ZlTGluZUl0ZW1CdXR0b24gZXh0ZW5kcyBIVE1MRWxlbWVudCB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHN1cGVyKClcbiAgICAgICAgXG4gICAgICAgIC8vIEFkZCBidXR0b24gYmVoYXZpb3JcbiAgICAgICAgdGhpcy5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHRoaXMuaGFuZGxlQ2xpY2spXG4gICAgICAgIHRoaXMuYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIHRoaXMuaGFuZGxlS2V5ZG93bilcbiAgICB9XG4gICAgXG4gICAgaGFuZGxlQ2xpY2sgPSBhc3luYyAoZSkgPT4ge1xuICAgICAgICBjb25zdCBsaW5lS2V5ID0gdGhpcy5jbG9zZXN0KCcuY2FydC1kcmF3ZXItYm9keV9fbGluZS1pdGVtJykuZ2V0QXR0cmlidXRlKCdkYXRhLWxpbmUtaXRlbS1rZXknKVxuICAgICAgICBcbiAgICAgICAgdGhpcy5zZXRBdHRyaWJ1dGUoJ2FyaWEtYnVzeScsICd0cnVlJylcbiAgICAgICAgdGhpcy5zdHlsZS5wb2ludGVyRXZlbnRzID0gJ25vbmUnXG4gICAgICAgIFxuICAgICAgICB0cnkge1xuICAgICAgICAgICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaCgnL2NhcnQvdXBkYXRlLmpzJywge1xuICAgICAgICAgICAgICAgIG1ldGhvZDogJ1BPU1QnLFxuICAgICAgICAgICAgICAgIGhlYWRlcnM6IHsgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJyB9LFxuICAgICAgICAgICAgICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KHtcbiAgICAgICAgICAgICAgICAgICAgdXBkYXRlczogeyBbbGluZUtleV06IDAgfVxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgXG4gICAgICAgICAgICBpZiAocmVzcG9uc2Uub2spIHtcbiAgICAgICAgICAgICAgICAvLyByZXBsYWNlIHdpdGggdXBkYXRlIGZ1bmN0aW9uIHdpdGggZm9yIHNlY3Rpb24gcmVuZGVyaW5nIEFQSSBcbiAgICAgICAgICAgICAgICB3aW5kb3cubG9jYXRpb24ucmVsb2FkKClcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ1JlbW92ZSBmYWlsZWQ6JywgZXJyb3IpXG4gICAgICAgIH1cbiAgICB9XG4gICAgXG4gICAgaGFuZGxlS2V5ZG93biA9IChlKSA9PiB7XG4gICAgICAgIGlmIChlLmtleSA9PT0gJ0VudGVyJyB8fCBlLmtleSA9PT0gJyAnKSB7XG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KClcbiAgICAgICAgICAgIHRoaXMuaGFuZGxlQ2xpY2soZSlcbiAgICAgICAgfVxuICAgIH1cbn1cblxuY2xhc3MgQ2FydERlY3JlbWVudExpbmVJdGVtQnV0dG9uIGV4dGVuZHMgSFRNTEVsZW1lbnQge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICBzdXBlcigpXG4gICAgICAgIHRoaXMuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCB0aGlzLmhhbmRsZUNsaWNrKVxuICAgICAgICB0aGlzLmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCB0aGlzLmhhbmRsZUtleWRvd24pXG4gICAgfVxuICAgIFxuICAgIGhhbmRsZUNsaWNrID0gYXN5bmMgKCkgPT4ge1xuXG4gICAgICAgIGNvbnN0IGxpbmVLZXkgPSB0aGlzLmNsb3Nlc3QoJy5jYXJ0LWRyYXdlci1ib2R5X19saW5lLWl0ZW0nKS5nZXRBdHRyaWJ1dGUoJ2RhdGEtbGluZS1pdGVtLWtleScpXG4gICAgICAgIGNvbnN0IGN1cnJlbnRRdWFudGl0eSA9IHBhcnNlSW50KHRoaXMuZGF0YXNldC5jdXJyZW50TGluZVF1YW50aXR5KVxuICAgICAgICBjb25zdCBuZXdRdWFudGl0eSA9IE1hdGgubWF4KDAsIGN1cnJlbnRRdWFudGl0eSAtIDEpXG5cbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgZmV0Y2goJy9jYXJ0L3VwZGF0ZS5qcycsIHtcbiAgICAgICAgICAgICAgICBtZXRob2Q6ICdQT1NUJyxcbiAgICAgICAgICAgICAgICBoZWFkZXJzOiB7ICdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24vanNvbicgfSxcbiAgICAgICAgICAgICAgICBib2R5OiBKU09OLnN0cmluZ2lmeSh7XG4gICAgICAgICAgICAgICAgICAgIHVwZGF0ZXM6IHsgW2xpbmVLZXldOiBuZXdRdWFudGl0eSB9XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGlmIChyZXNwb25zZS5vaykge1xuICAgICAgICAgICAgICAgIC8vIHJlcGxhY2Ugd2l0aCB1cGRhdGUgZnVuY3Rpb24gd2l0aCBmb3Igc2VjdGlvbiByZW5kZXJpbmcgQVBJIFxuICAgICAgICAgICAgICAgIHdpbmRvdy5sb2NhdGlvbi5yZWxvYWQoKVxuICAgICAgICAgICAgfVxuICAgICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICAgICAgY29uc29sZS5lcnJvcignRGVjcmVtZW50IGZhaWxlZDonLCBlcnJvcilcbiAgICAgICAgfVxuICAgIH1cbiAgICBcbiAgICBoYW5kbGVLZXlkb3duID0gKGUpID0+IHtcbiAgICAgICAgaWYgKGUua2V5ID09PSAnRW50ZXInIHx8IGUua2V5ID09PSAnICcpIHtcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKVxuICAgICAgICAgICAgdGhpcy5oYW5kbGVDbGljayhlKVxuICAgICAgICB9XG4gICAgfVxufVxuXG5jbGFzcyBDYXJ0SW5jcmVtZW50TGluZUl0ZW1CdXR0b24gZXh0ZW5kcyBIVE1MRWxlbWVudCB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHN1cGVyKClcbiAgICAgICAgdGhpcy5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHRoaXMuaGFuZGxlQ2xpY2spXG4gICAgICAgIHRoaXMuYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIHRoaXMuaGFuZGxlS2V5ZG93bilcbiAgICB9XG4gICAgXG4gICAgaGFuZGxlQ2xpY2sgPSBhc3luYyAoKSA9PiB7XG5cbiAgICAgICAgY29uc3QgbGluZUtleSA9IHRoaXMuY2xvc2VzdCgnLmNhcnQtZHJhd2VyLWJvZHlfX2xpbmUtaXRlbScpLmdldEF0dHJpYnV0ZSgnZGF0YS1saW5lLWl0ZW0ta2V5JylcbiAgICAgICAgY29uc3QgY3VycmVudFF1YW50aXR5ID0gcGFyc2VJbnQodGhpcy5kYXRhc2V0LmN1cnJlbnRMaW5lUXVhbnRpdHkpXG4gICAgICAgIGNvbnN0IG5ld1F1YW50aXR5ID0gcGFyc2VJbnQoY3VycmVudFF1YW50aXR5KSArIDFcblxuICAgICAgICB0cnkge1xuICAgICAgICAgICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaCgnL2NhcnQvdXBkYXRlLmpzJywge1xuICAgICAgICAgICAgICAgIG1ldGhvZDogJ1BPU1QnLFxuICAgICAgICAgICAgICAgIGhlYWRlcnM6IHsgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJyB9LFxuICAgICAgICAgICAgICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KHtcbiAgICAgICAgICAgICAgICAgICAgdXBkYXRlczogeyBbbGluZUtleV06IG5ld1F1YW50aXR5IH1cbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgaWYgKHJlc3BvbnNlLm9rKSB7XG4gICAgICAgICAgICAgICAgLy8gcmVwbGFjZSB3aXRoIHVwZGF0ZSBmdW5jdGlvbiB3aXRoIGZvciBzZWN0aW9uIHJlbmRlcmluZyBBUEkgXG4gICAgICAgICAgICAgICAgd2luZG93LmxvY2F0aW9uLnJlbG9hZCgpXG4gICAgICAgICAgICB9XG4gICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKCdJbmNyZW1lbnQgZmFpbGVkOicsIGVycm9yKVxuICAgICAgICB9XG4gICAgfVxuICAgIFxuICAgIGhhbmRsZUtleWRvd24gPSAoZSkgPT4ge1xuICAgICAgICBpZiAoZS5rZXkgPT09ICdFbnRlcicgfHwgZS5rZXkgPT09ICcgJykge1xuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpXG4gICAgICAgICAgICB0aGlzLmhhbmRsZUNsaWNrKGUpXG4gICAgICAgIH1cbiAgICB9XG59XG5cbmN1c3RvbUVsZW1lbnRzLmRlZmluZSgndGhlbWUtdW5kZXJsYXknLCBUaGVtZVVuZGVybGF5KVxuY3VzdG9tRWxlbWVudHMuZGVmaW5lKCdjYXJ0LWRyYXdlci10cmlnZ2VyJywgQ2FydERyYXdlclRyaWdnZXIpXG5jdXN0b21FbGVtZW50cy5kZWZpbmUoJ2NhcnQtcmVtb3ZlLWxpbmUtaXRlbS1idXR0b24nLCBDYXJ0UmVtb3ZlTGluZUl0ZW1CdXR0b24pXG5jdXN0b21FbGVtZW50cy5kZWZpbmUoJ2NhcnQtZGVjcmVtZW50LWxpbmUtaXRlbS1idXR0b24nLCBDYXJ0RGVjcmVtZW50TGluZUl0ZW1CdXR0b24pXG5jdXN0b21FbGVtZW50cy5kZWZpbmUoJ2NhcnQtaW5jcmVtZW50LWxpbmUtaXRlbS1idXR0b24nLCBDYXJ0SW5jcmVtZW50TGluZUl0ZW1CdXR0b24pIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUlBLFNBQVMsaUJBQWlCLG9CQUFvQixNQUFNO0FBRWhELDZCQUEwQjtBQUMxQiwrQkFBNEI7QUFDaEMsQ0FBQztBQUVELFNBQVMsaUJBQWlCLGdCQUFnQixNQUFNO0FBQzVDLFVBQVEsSUFBSSwwQ0FBMEM7QUFDMUQsQ0FBQztBQUlELFNBQVMsNkJBQTZCO0FBQ2xDLFFBQU0sbUJBQW1CLFNBQVMsZUFBZSxvQkFBb0I7QUFDckUsTUFBSSxDQUFDLGlCQUFrQjtBQUN2QixtQkFBaUIsaUJBQWlCLFNBQVMsTUFBTTtBQUM3QyxtQkFBYztBQUNkLGFBQVMsY0FBYyxxQkFBcUIsRUFBRSxVQUFVLE9BQU8sZUFBZTtBQUFBLEVBQ2xGLENB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
