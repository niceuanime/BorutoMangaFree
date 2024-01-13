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





// Fungsi untuk menampilkan konten chapter di halaman saat ini
function displayChapterContent(chapterNumber) {
  // Mendapatkan elemen container di Read.html
  var container = document.getElementById("chapterImages");

  if (!container) {
    console.error("Error: Element with id 'chapterImages' not found.");
    return;
  }

  console.log(`Selected chapter: ${chapterNumber}`);

  // Membersihkan container dari gambar-gambar sebelumnya
  container.innerHTML = "";

  // Menampilkan Cover.png terlebih dahulu
  var coverPath = `./assets/images/MangaCover/BorutoTBV/Chapter${chapterNumber}/Cover.png`;
  imageExists(coverPath, function (coverExists) {
    if (coverExists) {
      console.log(`Appending cover image: ${coverPath}`);

      var coverElement = new Image();
      coverElement.src = coverPath;
      container.appendChild(coverElement);
    } else {
      console.log("Cover image not found.");
    }

    var coverPath1 = `./assets/images/MangaCover/BorutoTBV/Chapter${chapterNumber}/Cover1.png`;
    imageExists(coverPath1, function (cover1Exists) {
      if (cover1Exists) {
        console.log(`Appending cover image: ${coverPath1}`);

        var cover1Element = new Image();
        cover1Element.src = coverPath1;
        container.appendChild(cover1Element);
      } else {
        console.log("Cover1 image not found.");
      }


      
      displayChapterImages();
    }); 
  });
  
  
  // Fungsi untuk menampilkan gambar-gambar chapter
  function displayChapterImages() {
    var i = 1;

    // Fungsi untuk menampilkan gambar
    function displayImage() {
      var imagePath = `./assets/images/MangaCover/BorutoTBV/Chapter${chapterNumber}/image${i}.png`;

      // Mengecek keberadaan gambar
      imageExists(imagePath, function (exists) {
        if (exists) {
          console.log(`Appending image: ${imagePath}`);

          var imageElement = new Image();
          imageElement.src = imagePath;
          container.appendChild(imageElement);

          // Melanjutkan untuk menampilkan gambar berikutnya
          i++;
          displayImage();
        } else {
          // Menghentikan rekursi jika tidak ada gambar lagi
          console.log("No more images found.");
        }
      });
    }

    // Memanggil fungsi untuk menampilkan gambar
    displayImage();
  }
}


// Fungsi untuk menambahkan event listener pada tombol "Close Chapter"
function addCloseChapterListener() {
  var closeChapterButton = document.querySelector("[data-chapter='0']");

  if (closeChapterButton) {
    closeChapterButton.addEventListener("click", closeChapter);
  }
}

// Fungsi untuk membersihkan container dari gambar-gambar sebelumnya
function closeChapter() {
  var container = document.getElementById("chapterImages");

  if (container) {
    // Membersihkan container
    container.innerHTML = "";
  }
}



// Fungsi untuk memeriksa keberadaan gambar
function imageExists(url, callback) {
  var img = new Image();
  img.onload = function () {
    callback(true);
  };
  img.onerror = function () {
    callback(false);
  };
  img.src = url;
}

window.addEventListener("load", function () {
  // Mendapatkan semua elemen link chapter di preview.html
  var chapterLinks = document.querySelectorAll(".chapter-link");

  if (!chapterLinks.length) {
    console.error("Error: No elements with class 'chapter-link' found.");
    return;
  }

  // Fungsi untuk menangani klik pada link chapter
  function handleChapterClick(event) {
    // Mencegah tindakan default dari link
    event.preventDefault();

    // Mendapatkan nomor chapter dari data-chapter atribut
    var chapterNumber = event.currentTarget.getAttribute("data-chapter");

    console.log(`Clicked on chapter ${chapterNumber}`);

    // Menyimpan nomor chapter yang dipilih ke sessionStorage
    sessionStorage.setItem("selectedChapter", chapterNumber);

    // Menampilkan konten chapter di halaman saat ini
    displayChapterContent(chapterNumber);
  }

  // Menambahkan event listener pada setiap link chapter
  chapterLinks.forEach(function (link) {
    link.addEventListener("click", handleChapterClick);
  });
});

document.addEventListener("DOMContentLoaded", function () {
  // Mendapatkan elemen container di Read.html
  var container = document.getElementById("chapterImages");

  if (!container) {
    console.error("Error: Element with id 'chapterImages' not found.");
    return;
  }

  // Mengambil nomor chapter dari sessionStorage
  var selectedChapter = sessionStorage.getItem("selectedChapter");

  if (selectedChapter) {
    console.log(`Selected chapter: ${selectedChapter}`);
  } else {
    console.error("Error: No selected chapter found.");
  }
});