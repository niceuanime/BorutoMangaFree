'use strict';



/**
 * add event on element
 */

const addEventOnElem = function (elem, type, callback) {
  if (elem.length > 1) {
    for (let i = 0; i < elem.length; i++) {
      elem[i].addEventListener(type, callback);
    }
  } else {
    elem.addEventListener(type, callback);
  }
}



/**
 * navbar toggle
 */

const navToggler = document.querySelector("[data-nav-toggler]");
const navbar = document.querySelector("[data-navbar]");
const navbarLinks = document.querySelectorAll("[data-nav-link]");

const toggleNavbar = function () {
  navbar.classList.toggle("active");
  navToggler.classList.toggle("active");
}

addEventOnElem(navToggler, "click", toggleNavbar);


const closeNavbar = function () {
  navbar.classList.remove("active");
  navToggler.classList.remove("active");
}

addEventOnElem(navbarLinks, "click", closeNavbar);



/**
 * active header when window scroll down to 100px
 */

const header = document.querySelector("[data-header]");
const backTopBtn = document.querySelector("[data-back-top-btn]");

const activeElemOnScroll = function () {
  if (window.scrollY > 100) {
    header.classList.add("active");
    backTopBtn.classList.add("active");
  } else {
    header.classList.remove("active");
    backTopBtn.classList.remove("active");
  }
}

addEventOnElem(window, "scroll", activeElemOnScroll);

var searchBtn = document.getElementById('searchBtn');
var searchBarContainer = document.getElementById('searchBarContainer');
var searchInput = document.getElementById('searchInput');

// Show search bar when searchBtn is clicked
searchBtn.addEventListener('click', function () {
  searchBarContainer.style.display = 'block';
  searchInput.focus();
});

// Hide search bar when clicking outside the search bar
document.addEventListener('click', function (event) {
  if (!searchBarContainer.contains(event.target) && event.target !== searchBtn) {
    searchBarContainer.style.display = 'none';
  }
});

// Prevent hiding the search bar when clicking inside the search bar
searchBarContainer.addEventListener('click', function (event) {
  event.stopPropagation();
});


// JavaScript Section
var currentChapter = 1; // Menyimpan informasi chapter saat ini

function previousChapter() {
  if (currentChapter > 1) {
    currentChapter--;
    updateChapterDropdown();
    alert('Go to previous chapter: ' + currentChapter);
  }
}

function nextChapter() {
  if (currentChapter < 5) { // Ubah sesuai dengan jumlah total chapter
    currentChapter++;
    updateChapterDropdown();
    alert('Go to next chapter: ' + currentChapter);
  }
}

function changeChapter() {
  var selectedChapter = document.getElementById('chapterDropdown').value;
  // Ganti halaman HTML berdasarkan pilihan chapter
  window.location.href = 'Read' + selectedChapter + '.html';
}

function updateChapterDropdown() {
  // Mengubah nilai dropdown berdasarkan chapter saat ini
  document.getElementById('chapterDropdown').value = currentChapter;
}