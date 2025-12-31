/**
 * Accessible Cart Drawer Trigger Web Component
 * Usage: <cart-drawer-trigger role="button" tabindex="0" aria-label="Open cart"></cart-drawer-trigger>
 */

class CartDrawerTrigger extends HTMLElement {
    constructor() {
        super()
        
        // Event listeners are set once and persist through DOM updates
        this.addEventListener('click', this.handleClick)
        this.addEventListener('keydown', this.handleKeydown)
        
        // Add cursor pointer style
        this.style.cursor = 'pointer'
    }
    
    handleClick = (e) => {
        // Your cart drawer logic here
        console.log('Cart drawer triggered via click')
        
        // Example: dispatch custom event for cart drawer to listen to
        this.dispatchEvent(new CustomEvent('cart-trigger-click', {
            bubbles: true,
            detail: { source: this }
        }))
        
        // Or directly open cart drawer:
        // document.querySelector('cart-drawer')?.open()
    }
    
    handleKeydown = (e) => {
        // Make Enter and Space work like a button (accessibility requirement)
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault() // Prevent page scroll on Space
            this.handleClick(e)
        }
        
        // Optional: Close on Escape
        if (e.key === 'Escape') {
            // document.querySelector('cart-drawer')?.close()
        }
    }
    
    /**
     * Update cart count without reinitializing listeners
     * Call this after AJAX cart updates
     */
    updateCount(count) {
        const countElement = this.querySelector('sup') || this.querySelector('.cart-count')
        if (countElement) {
            countElement.textContent = count
            
            // Hide if count is 0
            countElement.style.display = count > 0 ? '' : 'none'
        }
        
        // Update aria-label for screen readers
        const label = count > 0 
            ? `Open cart (${count} ${count === 1 ? 'item' : 'items'})` 
            : 'Open cart (empty)'
        this.setAttribute('aria-label', label)
    }
    
    /**
     * Update entire cart HTML without losing event listeners
     * This is the key benefit of web components!
     */
    updateContent(html) {
        this.innerHTML = html
        // Event listeners persist! No need to reattach.
    }
}

// Register the custom element
customElements.define('cart-drawer-trigger', CartDrawerTrigger)

export default CartDrawerTrigger
