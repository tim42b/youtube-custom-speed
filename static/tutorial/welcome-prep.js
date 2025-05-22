"use strict";

/* global chrome */

// click listeners for buttons
function optionsClick() {
  chrome.tabs.create({
    url: "chrome://extensions/?options=" + chrome.runtime.id,
  });
}

document.querySelector("#ext-options").addEventListener("click", optionsClick);
