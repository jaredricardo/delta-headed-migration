import './main.css'

// initialize components and event listeners

document.addEventListener('DOMContentLoaded', () => {
    // initialize event listeners
    initializeMobileMenuButton()
    initializeCloseDrawerButtons()
})

// classes for web components
class ThemeUnderlay extends HTMLElement {
    constructor() {
        super()
        this.addEventListener('click',  closeAllDrawers)
    }
}

class CartDrawerTrigger extends HTMLElement {
    constructor() {
        super()
    }
    connectedCallback() {
        this.addEventListener('click', this.handleClick)
    }
    handleClick() {
        toggleUnderlay()
        document.querySelector('#cart-drawer').classList.toggle('drawer-active')
    }
}

function initializeMobileMenuButton() {
    const mobileMenuButton = document.getElementById('mobile-menu-button')
    if (!mobileMenuButton) return
    mobileMenuButton.addEventListener('click', () => {
        toggleUnderlay()
        document.querySelector('#mobile-menu-drawer').classList.toggle('drawer-active')
    })
}

function initializeCloseDrawerButtons() {
    const closeDrawerButtons = document.querySelectorAll('.close-drawer-button')
    closeDrawerButtons.forEach((button) => {
        button.addEventListener('click', closeAllDrawers)
    })
}

// utility functions

function toggleUnderlay() {
    document.body.classList.toggle('underlay-active')
    document.querySelector('theme-underlay').classList.toggle('active')
}

function closeAllDrawers() {
    toggleUnderlay()
    document.querySelectorAll('.site-drawer').forEach((drawer) => {
        drawer.classList.remove('drawer-active')
    })
}

customElements.define('theme-underlay', ThemeUnderlay)
customElements.define('cart-drawer-trigger', CartDrawerTrigger)