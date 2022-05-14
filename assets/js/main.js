'use strict'

const MOBILE_NAV_BUTTON_ID = 'mobile-nav-button';
const mobileNavButton = document.getElementById(MOBILE_NAV_BUTTON_ID);

function toggleClassActive() {
    this.classList.toggle('active');
}

mobileNavButton.addEventListener('click', toggleClassActive);

