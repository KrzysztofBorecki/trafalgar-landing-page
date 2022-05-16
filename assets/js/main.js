'use strict'

const PAGE_ID = "page";
const PRIMARY_NAV_ID = 'primary-nav';
const NAV_BAR_MOBILE__BUTTON_ID = 'nav-bar-mobile__button';
const ELEMENT_IDS = [PAGE_ID, PRIMARY_NAV_ID, NAV_BAR_MOBILE__BUTTON_ID];
const ARIA_EXPANDED = 'aria-expanded';
const elements = getElements();

function getParsedElementId(elementId) {
    return elementId.split(/(?:--|-|__|_)/g).map((word, idx) => {
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


function toggleScrollLock(element) {
    element.classList.toggle('scroll-locked');
}

function toggleClassActive(element) {
    element.classList.toggle('active');
}

function toggleAriaExpanded(element) {
    if (element.getAttribute(ARIA_EXPANDED)) {
        element.setAttribute(ARIA_EXPANDED, 'false');
    } else {
        element.setAttribute(ARIA_EXPANDED, 'true'); 
    }   
}

function handleMobileNav() {
    const elements = getElements();
    toggleScrollLock(elements.page);
    toggleClassActive(elements.primaryNav);
    toggleClassActive(elements.navBarMobileButton);
    toggleAriaExpanded(elements.navBarMobileButton);
}

getElement(NAV_BAR_MOBILE__BUTTON_ID).addEventListener('click', handleMobileNav);