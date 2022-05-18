'use strict'

const PAGE_ID = "page";
const NAVBAR_NAVIGATION_ID = 'navbar-navigation';
const NAVBAR_MOBILE__BUTTON_ID = 'navbar-mobile__button';
const NAVIGATION_ELEMENT_IDS = [PAGE_ID, NAVBAR_NAVIGATION_ID, NAVBAR_MOBILE__BUTTON_ID];
const ARIA_EXPANDED = 'aria-expanded';

const CAROUSEL_BTN_NEXT_ID = 'carousel__btn--next';
const CAROUSEL_BTN_PREVIOUS_ID = 'carousel__btn--previous';
const CAROUSEL_BTN_IDS = [CAROUSEL_BTN_NEXT_ID, CAROUSEL_BTN_PREVIOUS_ID];
const CAROUSEL_ITEM_CLASS = 'carousel__item';
const CAROUSEL_ITEM_PREVIOUS_CLASS = 'carousel__item--previous';
const CAROUSEL_ITEM_ACTIVE_CLASS = 'carousel__item--active';
const CAROUSEL_ITEM_NEXT_CLASS = 'carousel__item--next';
const CAROUSEL_STOP_CLASS = 'carousel__stop';

const CAROUSEL_DOT_BTN_1_ID = 'carousel__dot-btn-01';
const CAROUSEL_DOT_BTN_2_ID = 'carousel__dot-btn-02';
const CAROUSEL_DOT_BTN_3_ID = 'carousel__dot-btn-03';
const CAROUSEL_DOT_BTN_4_ID = 'carousel__dot-btn-04';
const CAROUSEL_DOT_BTN_IDS = [CAROUSEL_DOT_BTN_1_ID, CAROUSEL_DOT_BTN_2_ID, CAROUSEL_DOT_BTN_3_ID, CAROUSEL_DOT_BTN_4_ID]

const PAGINATION_DOT_BTN_CLASS = 'pagination-dot-btn';
const PAGINATION_DOT_BTN_ACTIVE_CLASS = "pagination-dot-btn--active";

function getParsedElementId(elementId) {
    return elementId.split(/(?:--|-|__|_)/g).map((word, idx) => {
        if (!idx) return word;

        return `${word[0].toUpperCase()}${word.slice(1)}`;
    }).join('');
}

function getElement(elementId) {
    return document.getElementById(elementId);
}

function getElements(elementIds) {
    return elementIds.reduce((elements, elementId) => {
        const parsedElementId = getParsedElementId(elementId);

        elements[parsedElementId] = getElement(elementId);

        return elements;
    }, {});
}

function getNavigationElements() {
    return getElements(NAVIGATION_ELEMENT_IDS)
}

function getCarouselButtons() {
    return getElements(CAROUSEL_BTN_IDS)
}

function getAllElementByClass(elementClass) {
    return document.querySelectorAll(`.${elementClass}`);
}

function getCarouselItems() {
    return getAllElementByClass(CAROUSEL_ITEM_CLASS)
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
    const elements = getNavigationElements();
    toggleScrollLock(elements.page);
    toggleClassActive(elements.navbarNavigation);
    toggleClassActive(elements.navbarMobileButton);
    toggleAriaExpanded(elements.navbarMobileButton);
}

function setPreviousStatus() {
    const elements = document.getElementsByClassName(CAROUSEL_ITEM_CLASS);

    Array.from(elements).forEach((element, idx, array) => {
        const isActive = element.classList.contains(CAROUSEL_ITEM_ACTIVE_CLASS);

        if (isActive) {
            if (!(idx === 0)) {
                element.classList.remove(CAROUSEL_ITEM_ACTIVE_CLASS);
                element.classList.add(CAROUSEL_ITEM_NEXT_CLASS);
                array[idx - 1].classList.remove(CAROUSEL_ITEM_PREVIOUS_CLASS);
                array[idx - 1].classList.add(CAROUSEL_ITEM_ACTIVE_CLASS);
            }
        }

    });
}

function setNextStatus() {
    const elements = document.getElementsByClassName(CAROUSEL_ITEM_CLASS);

    if (document.querySelector(`.${CAROUSEL_STOP_CLASS}`)) {
        document.querySelector(`.${CAROUSEL_STOP_CLASS}`).classList.remove(CAROUSEL_STOP_CLASS);
    }

    Array.from(elements).forEach((element, idx, array) => {
        const isActive = element.classList.contains(CAROUSEL_ITEM_ACTIVE_CLASS);
        const isStopped = element.classList.contains(CAROUSEL_STOP_CLASS);

        if (isStopped) {
            return;
        }

        if (isActive) {
            if (!(idx === array.length - 1)) {
                element.classList.remove(CAROUSEL_ITEM_ACTIVE_CLASS);
                element.classList.add(CAROUSEL_ITEM_PREVIOUS_CLASS);
                array[idx + 1].classList.add(CAROUSEL_ITEM_ACTIVE_CLASS);
                array[idx + 1].classList.add(CAROUSEL_STOP_CLASS);
            }
        }
    });
}


function resetCarouselDotBtns() {
    const paginationBtns = document.querySelectorAll(`.${PAGINATION_DOT_BTN_CLASS}`);

    Array.from(paginationBtns).forEach((element) => {
        element.classList.remove(PAGINATION_DOT_BTN_ACTIVE_CLASS);
    });
}

function setCarouselDotBtnActiveStatus() {
    const carouselItems = document.querySelectorAll(`.${CAROUSEL_ITEM_CLASS}`);

    Array.from(carouselItems).forEach((element, idx) => {
        const activeElement = element.classList.contains(CAROUSEL_ITEM_ACTIVE_CLASS);

        if (activeElement) {
            const paginationBtns = document.querySelectorAll(`.${PAGINATION_DOT_BTN_CLASS}`);

            Array.from(paginationBtns)[idx].classList.add(PAGINATION_DOT_BTN_ACTIVE_CLASS);
        }
    })
}

function handleCarouselMainBtn(e) {
    switch (e.currentTarget.id) {
        case CAROUSEL_BTN_PREVIOUS_ID:
                setPreviousStatus();
            break;

        case CAROUSEL_BTN_NEXT_ID:
                setNextStatus();
            break;

        default:
            return;
    }

    resetCarouselDotBtns()
    setCarouselDotBtnActiveStatus();
}

getElement(NAVBAR_MOBILE__BUTTON_ID).addEventListener('click', handleMobileNav);

CAROUSEL_BTN_IDS.forEach((elementId) => {
    const element = getElement(elementId);
    element.addEventListener('click', handleCarouselMainBtn);
});