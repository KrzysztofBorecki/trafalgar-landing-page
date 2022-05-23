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
const CAROUSEL_ITEM_HIDDEN_CLASS = 'carousel__item--hidden';
const CAROUSEL_STOP_CLASS = 'carousel__stop';

const CAROUSEL_DOT_BTN_1_ID = 'carousel__dot-btn-01';
const CAROUSEL_DOT_BTN_2_ID = 'carousel__dot-btn-02';
const CAROUSEL_DOT_BTN_3_ID = 'carousel__dot-btn-03';
const CAROUSEL_DOT_BTN_4_ID = 'carousel__dot-btn-04';
const CAROUSEL_DOT_BTN_IDS = [CAROUSEL_DOT_BTN_1_ID, CAROUSEL_DOT_BTN_2_ID, CAROUSEL_DOT_BTN_3_ID, CAROUSEL_DOT_BTN_4_ID]

const PAGINATION_DOT_BTN_CLASS = 'pagination-dot-btn';
const PAGINATION_DOT_BTN_ACTIVE_CLASS = "pagination-dot-btn--active";

const timerId1 = [];

const FOOTER_NAVIGATION_BTN_CLASS = 'footer-navigation__btn';
const FOOTER_NAVIGATION_BTN_ACTIVE_CLASS = 'footer-navigation__btn--active';
const FOOTER_NAVIGATION_LIST_UNFOLDED_CLASS = 'footer-navigation__list--unfolded';

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

function handleSetPreviousItem() {
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

function handleSetNextItem() {
    const elements = document.querySelectorAll(`.${CAROUSEL_ITEM_CLASS}`);

    if (document.querySelector(`.${CAROUSEL_STOP_CLASS}`)) {
        document.querySelector(`.${CAROUSEL_STOP_CLASS}`).classList.remove(CAROUSEL_STOP_CLASS);
    }

    Array.from(elements).forEach((element, idx, array) => {
        const isActive = element.classList.contains(CAROUSEL_ITEM_ACTIVE_CLASS);
        const isStopped = element.classList.contains(CAROUSEL_STOP_CLASS);

        if (isStopped) {
            element.classList.remove(CAROUSEL_STOP_CLASS);
            return;
        }

        if (isActive) {
            if (!(idx === array.length - 1)) {
                element.classList.remove(CAROUSEL_ITEM_ACTIVE_CLASS);
                element.classList.add(CAROUSEL_ITEM_PREVIOUS_CLASS);

                array[idx + 1].classList.remove(CAROUSEL_ITEM_NEXT_CLASS);
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

    removeIntermediateStyle()

    switch (e.currentTarget.id) {
        case CAROUSEL_BTN_PREVIOUS_ID:
                handleSetPreviousItem();
            break;

        case CAROUSEL_BTN_NEXT_ID:
                handleSetNextItem();
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

function getParsedElementValue(element) {
    return parseInt(element.value);
}

function getParsedCurrentTargetValue(e) {
    const currentTargetElement = e.currentTarget;

    return getParsedElementValue(currentTargetElement);
}

function getParsedActiveDotBtnIdx() {
    const activeDotBtn = document.querySelector(`.${PAGINATION_DOT_BTN_ACTIVE_CLASS}`);

    return getParsedElementValue(activeDotBtn);
}

function getAbsoluteDifferenceValue(firstValue, secondValue) {
    return Math.abs(firstValue - secondValue);
}

function removeIntermediateStyle() {
    Array.from(document.querySelectorAll('.carousel__item')).forEach((element) => {
        element.classList.remove(CAROUSEL_ITEM_HIDDEN_CLASS);
    });
}

function addIntermediateStyle(pressedDotBtn) {
    const endIdx = getParsedElementValue(pressedDotBtn);
    const startIdx = getParsedActiveDotBtnIdx(); 

    if ((Math.abs(endIdx - startIdx)) > 1) {
        Array.from(document.querySelectorAll('.carousel__item')).forEach((_,idx,array) => {
            if ((idx > (Math.min(endIdx, startIdx) - 1)) && (idx < (Math.max(endIdx, startIdx) - 1))) {
                array[idx].classList.add(CAROUSEL_ITEM_HIDDEN_CLASS);
            }
        }); 
    }
}

function handleCarouselDotBtn(e) {
    const pressedDotBtn = e.currentTarget;

    clearTimeout(timerId1.pop());
    removeIntermediateStyle();
    addIntermediateStyle(pressedDotBtn);

    let timerId = setTimeout(function callback() {

        const endIdx = getParsedElementValue(pressedDotBtn);
        const startIdx = getParsedActiveDotBtnIdx(); 

        if (endIdx === startIdx) {
            return;
        }

        if (startIdx > endIdx){
            handleSetPreviousItem();
        }

        if (startIdx < endIdx){
            handleSetNextItem();
        }

        resetCarouselDotBtns()
        setCarouselDotBtnActiveStatus();

        timerId = setTimeout(callback, 0);
    }, 0);

    timerId1.push(timerId);
}

CAROUSEL_DOT_BTN_IDS.forEach((elementId) => {
    const element = getElement(elementId);

    element.addEventListener('click', handleCarouselDotBtn);
});


function toggleClassOnElement(element, className) {
    element.classList.toggle(className);
}

function handleFooterNav() {

    if (this.classList.contains(FOOTER_NAVIGATION_BTN_ACTIVE_CLASS)){
        toggleClassOnElement(this, FOOTER_NAVIGATION_BTN_ACTIVE_CLASS);
        toggleClassOnElement(this.nextElementSibling, FOOTER_NAVIGATION_LIST_UNFOLDED_CLASS);
    
    } else if (document.querySelector(`.${FOOTER_NAVIGATION_BTN_ACTIVE_CLASS}`)) {
        const activeBtn = document.querySelector(`.${FOOTER_NAVIGATION_BTN_ACTIVE_CLASS}`);
        const unfoldedList = document.querySelector(`.${FOOTER_NAVIGATION_LIST_UNFOLDED_CLASS}`);
    
        toggleClassOnElement(activeBtn, FOOTER_NAVIGATION_BTN_ACTIVE_CLASS);
        toggleClassOnElement(unfoldedList, FOOTER_NAVIGATION_LIST_UNFOLDED_CLASS);
        toggleClassOnElement(this, FOOTER_NAVIGATION_BTN_ACTIVE_CLASS);
        toggleClassOnElement(this.nextElementSibling, FOOTER_NAVIGATION_LIST_UNFOLDED_CLASS);
    
    } else {
        toggleClassOnElement(this, FOOTER_NAVIGATION_BTN_ACTIVE_CLASS);
        toggleClassOnElement(this.nextElementSibling, FOOTER_NAVIGATION_LIST_UNFOLDED_CLASS);
    }

    // old working version
    // if (this.classList.contains(FOOTER_NAVIGATION_BTN_ACTIVE_CLASS)){
    //     this.classList.toggle(FOOTER_NAVIGATION_BTN_ACTIVE_CLASS);
    //     this.nextElementSibling.classList.toggle(FOOTER_NAVIGATION_LIST_UNFOLDED_CLASS);
    // } else if (document.querySelector(`.${FOOTER_NAVIGATION_BTN_ACTIVE_CLASS}`)) {
    //     document.querySelector(`.${FOOTER_NAVIGATION_BTN_ACTIVE_CLASS}`).classList.toggle(FOOTER_NAVIGATION_BTN_ACTIVE_CLASS);
    //     document.querySelector(`.${FOOTER_NAVIGATION_LIST_UNFOLDED_CLASS}`).classList.toggle(FOOTER_NAVIGATION_LIST_UNFOLDED_CLASS);
    //     this.classList.toggle(FOOTER_NAVIGATION_BTN_ACTIVE_CLASS);
    //     this.nextElementSibling.classList.toggle(FOOTER_NAVIGATION_LIST_UNFOLDED_CLASS);
    // } else {
    //     this.classList.toggle(FOOTER_NAVIGATION_BTN_ACTIVE_CLASS);
    //     this.nextElementSibling.classList.toggle(FOOTER_NAVIGATION_LIST_UNFOLDED_CLASS);
    // }
}

Array.from(document.querySelectorAll(`.${FOOTER_NAVIGATION_BTN_CLASS}`)).forEach((element) => {
    element.addEventListener('click', handleFooterNav);
})