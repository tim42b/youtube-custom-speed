"use strict";

/* global chrome */

// click listeners for buttons
function optionsClick() {
  chrome.tabs.create({
    url: "chrome://extensions/?options=" + chrome.runtime.id,
  });
}

function shortcutOptionsClick() {
  chrome.tabs.create({
    url: "chrome://extensions/shortcuts",
  });
}

function settingsClick() {
  chrome.tabs.create({
    url: "chrome://extensions/?id=" + chrome.runtime.id,
  });
}

document
  .querySelector("#ext-options")
  .addEventListener("click", optionsClick);
// document
//   .querySelector('#chrome-settings')
//   .addEventListener('click', settingsClick);

