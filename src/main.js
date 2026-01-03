import './main.css'

// initialize components and event listeners

document.addEventListener('DOMContentLoaded', () => {
    initializeMobileMenuButton()
    initializeCloseDrawerButtons()
})

document.addEventListener('cart:updated', () => {
    console.log('///// Cart updated event received //////')
})

// initialization functions

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
        toggleUnderlay()
        const cartDrawer = document.querySelector('#cart-drawer')
        const isOpen = cartDrawer.classList.toggle('drawer-active')
        
        // Update ARIA state
        this.setAttribute('aria-expanded', isOpen)
        
        // Optionally focus the drawer when opened
        if (isOpen) {
            cartDrawer.focus()
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