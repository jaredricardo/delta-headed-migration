import './main.css'

document.addEventListener('DOMContentLoaded', () => {
    // initialize event listeners
    initializeMobileMenuButton()
})


class ThemeUnderlay extends HTMLElement {
    constructor() {
        super()
        this.addEventListener('click',  toggleUnderlay)
    }
}


function toggleUnderlay() {
    document.body.classList.remove('underlay-active')
    document.querySelector('theme-underlay').classList.remove('active' )
}

function initializeMobileMenuButton() {
    const mobileMenuButton = document.getElementById('mobile-menu-button')
    if (!mobileMenuButton) return
    mobileMenuButton.addEventListener('click', () => {
        document.body.classList.add('underlay-active')
        document.querySelector('theme-underlay').classList.add('active' )
    })
}


customElements.define('theme-underlay', ThemeUnderlay)