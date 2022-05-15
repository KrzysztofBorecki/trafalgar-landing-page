'use strict'

const PRIMARY_NAV_ID = 'primary-nav';
const PRIMARY_NAV_MENU_ID = 'primary-nav-menu';
const MOBILE_NAV_BUTTON_ID = 'mobile-nav-button';
const ELEMENT_IDS = [PRIMARY_NAV_ID, PRIMARY_NAV_MENU_ID, MOBILE_NAV_BUTTON_ID];
const ARIA_EXPANDED = 'aria-expanded';
const elements = getElements();

function getParsedElementId(elementId) {
    return elementId.split('-').map((word, idx) => {
        if (!idx) return word;

        return `${word[0].toUpperCase()}${word.slice(1)}`;
    }).join('');
}

function getElement(elementId) {
    return document.getElementById(elementId);
}

function getElements() {
    return ELEMENT_IDS.reduce((pageElements, elementId) => {
        const parsedElementId = getParsedElementId(elementId);

        pageElements[parsedElementId] = getElement(elementId);

        return pageElements;
    }, {});
}

function toggleClassActive(element) {
    element.classList.toggle('active');
}

function toggleAriaExpanded(element) {
    if (element.getAttribute(ARIA_EXPANDED)) {
        element.setAttribute(ARIA_EXPANDED, 'false');
    } else {
        console.log('x');
        element.setAttribute(ARIA_EXPANDED, 'true'); 
    }   
}

function handleMobileNav() {
    const elements = getElements();
    toggleClassActive(elements.primaryNav);
    toggleClassActive(elements.primaryNavMenu);
    toggleClassActive(elements.mobileNavButton);
    toggleAriaExpanded(elements.mobileNavButton);
}

getElement(MOBILE_NAV_BUTTON_ID).addEventListener('click', handleMobileNav);