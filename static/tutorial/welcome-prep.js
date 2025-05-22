'use strict';

// click listeners for buttons
function optionsClick(e) {
    chrome.tabs.create({
        url: 'chrome://extensions/?options=' + chrome.runtime.id
    });
}

// Removed unused handlers for Chrome shortcut and settings pages
document.querySelector('#ext-options').addEventListener('click', optionsClick);
