'use strict'

const PAGE_ID = "page";
const NAVBAR_NAVIGATION_ID = 'navbar-navigation';
const NAVBAR_MOBILE__BUTTON_ID = 'navbar-mobile__button';
const ELEMENT_IDS = [PAGE_ID, NAVBAR_NAVIGATION_ID, NAVBAR_MOBILE__BUTTON_ID];
const ARIA_EXPANDED = 'aria-expanded';

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
    element.classList.toggle('noscroll');
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
    toggleClassActive(elements.navbarNavigation);
    toggleClassActive(elements.navbarMobileButton);
    toggleAriaExpanded(elements.navbarMobileButton);
}

getElement(NAVBAR_MOBILE__BUTTON_ID).addEventListener('click', handleMobileNav);