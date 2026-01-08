import './main.css'

const FOCUSABLE_ELEMENTS = 'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'

let activeDrawer = null
let lastFocusedElement = null

// initialize components and event listeners

document.addEventListener('DOMContentLoaded', () => {
    initializeMobileMenuButton()
    initializeCloseDrawerButtons()
    initializeEscapeKeyListener()
})

document.addEventListener('cart:updated', () => {
    console.log('///// Cart updated event received //////')
})

// initialization functions

function initializeEscapeKeyListener() {
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && activeDrawer && activeDrawer.classList.contains('drawer-active')) {
            closeAllDrawers()
        }
    })
}

function initializeMobileMenuButton() {
    const mobileMenuButton = document.getElementById('mobile-menu-button')
    if (!mobileMenuButton) return
    mobileMenuButton.addEventListener('click', () => {
        lastFocusedElement = document.activeElement
        toggleUnderlay()
        const drawer = document.querySelector('#mobile-menu-drawer')
        drawer.classList.toggle('drawer-active')
        
        if (drawer.classList.contains('drawer-active')) {
            activeDrawer = drawer
            trapFocus(drawer)
        } else {
            removeFocusTrap(drawer)
            if (lastFocusedElement) {
                lastFocusedElement.focus()
                lastFocusedElement = null
            }
        }
    })
}

function initializeCloseDrawerButtons() {
    const closeDrawerButtons = document.querySelectorAll('.close-drawer-button')
    closeDrawerButtons.forEach((button) => {
        button.addEventListener('click', closeAllDrawers)
    })
}

// utility functions

function trapFocus(element) {
    const focusableElements = element.querySelectorAll(FOCUSABLE_ELEMENTS)
    const firstFocusable = focusableElements[0]
    const lastFocusable = focusableElements[focusableElements.length - 1]
    
    element.addEventListener('keydown', handleFocusTrap)
    
    function handleFocusTrap(e) {
        if (e.key !== 'Tab') return
        
        if (e.shiftKey) {
            if (document.activeElement === firstFocusable) {
                e.preventDefault()
                lastFocusable.focus()
            }
        } else {
            if (document.activeElement === lastFocusable) {
                e.preventDefault()
                firstFocusable.focus()
            }
        }
    }
    
    element._focusTrapHandler = handleFocusTrap
    
    if (firstFocusable) {
        firstFocusable.focus()
    }
}

function removeFocusTrap(element) {
    if (element._focusTrapHandler) {
        element.removeEventListener('keydown', element._focusTrapHandler)
        delete element._focusTrapHandler
    }
}

function toggleUnderlay() {
    document.body.classList.toggle('underlay-active')
    document.querySelector('theme-underlay').classList.toggle('active')
}

function closeAllDrawers() {
    toggleUnderlay()
    document.querySelectorAll('.site-drawer').forEach((drawer) => {
        drawer.classList.remove('drawer-active')
        removeFocusTrap(drawer)
    })
    
    if (lastFocusedElement) {
        lastFocusedElement.focus()
        lastFocusedElement = null
    }
    
    activeDrawer = null
}

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
        
        // Add cursor pointer style
        this.style.cursor = 'pointer'
    }
    
    connectedCallback() {
        // Add click handler
        this.addEventListener('click', this.handleClick)
        
        // Add keyboard support for accessibility
        this.addEventListener('keydown', this.handleKeydown)
    }
    
    handleClick = () => {
        lastFocusedElement = document.activeElement
        toggleUnderlay()
        const cartDrawer = document.querySelector('#cart-drawer')
        const isOpen = cartDrawer.classList.toggle('drawer-active')
        
        this.setAttribute('aria-expanded', isOpen)
        
        if (isOpen) {
            activeDrawer = cartDrawer
            trapFocus(cartDrawer)
        } else {
            removeFocusTrap(cartDrawer)
            if (lastFocusedElement) {
                lastFocusedElement.focus()
                lastFocusedElement = null
            }
        }
    }
    
    handleKeydown = (e) => {
        // Make Enter and Space work like a button
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            this.handleClick()
        }
    }
}

class CartRemoveLineItemButton extends HTMLElement {
    constructor() {
        super()
        
        // Add button behavior
        this.addEventListener('click', this.handleClick)
        this.addEventListener('keydown', this.handleKeydown)
    }
    
    handleClick = async (e) => {
        const lineKey = this.closest('.cart-drawer-body__line-item').getAttribute('data-line-item-key')
        
        this.setAttribute('aria-busy', 'true')
        this.style.pointerEvents = 'none'
        
        try {
            const response = await fetch('/cart/update.js', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    updates: { [lineKey]: 0 }
                })
            })
            
            if (response.ok) {
                // replace with update function with for section rendering API 
                window.location.reload()
            }
        } catch (error) {
            console.error('Remove failed:', error)
        }
    }
    
    handleKeydown = (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            this.handleClick(e)
        }
    }
}

class CartDecrementLineItemButton extends HTMLElement {
    constructor() {
        super()
        this.addEventListener('click', this.handleClick)
        this.addEventListener('keydown', this.handleKeydown)
    }
    
    handleClick = async () => {

        const lineKey = this.closest('.cart-drawer-body__line-item').getAttribute('data-line-item-key')
        const currentQuantity = parseInt(this.dataset.currentLineQuantity)
        const newQuantity = Math.max(0, currentQuantity - 1)

        try {
            const response = await fetch('/cart/update.js', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    updates: { [lineKey]: newQuantity }
                })
            })
            
            if (response.ok) {
                // replace with update function with for section rendering API 
                window.location.reload()
            }
        } catch (error) {
            console.error('Decrement failed:', error)
        }
    }
    
    handleKeydown = (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            this.handleClick(e)
        }
    }
}

class CartIncrementLineItemButton extends HTMLElement {
    constructor() {
        super()
        this.addEventListener('click', this.handleClick)
        this.addEventListener('keydown', this.handleKeydown)
    }
    
    handleClick = async () => {

        const lineKey = this.closest('.cart-drawer-body__line-item').getAttribute('data-line-item-key')
        const currentQuantity = parseInt(this.dataset.currentLineQuantity)
        const newQuantity = parseInt(currentQuantity) + 1

        try {
            const response = await fetch('/cart/update.js', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    updates: { [lineKey]: newQuantity }
                })
            })
            
            if (response.ok) {
                // replace with update function with for section rendering API 
                window.location.reload()
            }
        } catch (error) {
            console.error('Increment failed:', error)
        }
    }
    
    handleKeydown = (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            this.handleClick(e)
        }
    }
}

customElements.define('theme-underlay', ThemeUnderlay)
customElements.define('cart-drawer-trigger', CartDrawerTrigger)
customElements.define('cart-remove-line-item-button', CartRemoveLineItemButton)
customElements.define('cart-decrement-line-item-button', CartDecrementLineItemButton)
customElements.define('cart-increment-line-item-button', CartIncrementLineItemButton)