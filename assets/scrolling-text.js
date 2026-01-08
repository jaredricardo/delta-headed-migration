// Prevent multiple script loads 
 
// Could have written a web component but I wanted to make sure that, if the section does not exist on the page,
// we dont have the relevant javascript loading

if (!window.ScrollingTextMarqueeLoaded) {
    window.ScrollingTextMarqueeLoaded = true;

    class ScrollingTextMarquee {
        constructor(container) {
            this.container = container
            this.track = container.querySelector('.scrolling-text-track')
            this.scrollSpeed = parseFloat(container.dataset.scrollSpeed) || 20
            this.position = 0
            this.isPaused = false
            this.animationId = null
            
            this.init()
        }
        
        init() {
            if (!this.track) return
            
            const trackWidth = this.track.offsetWidth
            const containerWidth = this.container.offsetWidth
            const clonesNeeded = Math.ceil(containerWidth / trackWidth) + 2
            
            for (let i = 0; i < clonesNeeded; i++) {
                const clone = this.track.cloneNode(true)
                clone.setAttribute('aria-hidden', 'true')
                this.container.appendChild(clone)
            }
            
            this.trackWidth = trackWidth
            this.actualSpeed = (this.scrollSpeed / 50) * 1.4
            
            this.animate()
            
            this.container.addEventListener('mouseenter', () => this.pause())
            this.container.addEventListener('mouseleave', () => this.resume())
            
            if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
                this.pause()
            }
        }
        
        animate = () => {
            if (!this.isPaused) {
                this.position -= this.actualSpeed
                
                if (Math.abs(this.position) >= this.trackWidth) {
                    this.position = 0
                }
                
                const tracks = this.container.querySelectorAll('.scrolling-text-track')
                tracks.forEach(track => {
                    track.style.transform = `translateX(${this.position}px)`
                })
            }
            
            this.animationId = requestAnimationFrame(this.animate)
        }
        
        pause() {
            this.isPaused = true
        }
        
        resume() {
            this.isPaused = false
        }
        
        destroy() {
            if (this.animationId) {
                cancelAnimationFrame(this.animationId)
            }
        }
    }

    function initScrollingTextSections() {
        const containers = document.querySelectorAll('[data-scrolling-text]')
        const instances = []
        
        containers.forEach(container => {
            if (!container.dataset.initialized) {
                const instance = new ScrollingTextMarquee(container)
                container.dataset.initialized = 'true'
                instances.push({
                    container,
                    instance,
                    sectionId: container.dataset.sectionId
                })
            }
        })
        
        return instances
    }

    window.scrollingTextInstances = window.scrollingTextInstances || []

    document.addEventListener('DOMContentLoaded', () => {
        const newInstances = initScrollingTextSections()
        window.scrollingTextInstances.push(...newInstances)
    })

    document.addEventListener('shopify:section:load', (event) => {
        const container = document.querySelector(`[data-section-id="${event.detail.sectionId}"][data-scrolling-text]`)
        if (container) {
            const existingIndex = window.scrollingTextInstances.findIndex(item => item.container === container)
            if (existingIndex !== -1) {
                window.scrollingTextInstances[existingIndex].instance.destroy()
                window.scrollingTextInstances.splice(existingIndex, 1)
            }
            
            delete container.dataset.initialized
            const instance = new ScrollingTextMarquee(container)
            container.dataset.initialized = 'true'
            window.scrollingTextInstances.push({
                container,
                instance,
                sectionId: event.detail.sectionId
            })
        }
    })

    document.addEventListener('shopify:section:unload', (event) => {
        const indicesToRemove = []
        window.scrollingTextInstances.forEach((item, index) => {
            if (item.sectionId === event.detail.sectionId) {
                item.instance.destroy()
                delete item.container.dataset.initialized
                indicesToRemove.push(index)
            }
        })
        indicesToRemove.reverse().forEach(index => {
            window.scrollingTextInstances.splice(index, 1)
        })
    })
}