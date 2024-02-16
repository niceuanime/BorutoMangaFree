'use strict';


/**
 * Restrain user for inspecting
 */

// document.addEventListener('contextmenu', function (e) {
//   e.preventDefault();
// });

// document.onkeydown = function (e) {
//   if (e.key === "F12") {
//       e.preventDefault();
//   }
// };


/**
 * add PreLoader
 */

$(window).on("load", function(){
  // Nonaktifkan scroll
  $("body").css("overflow", "hidden");

  // Timer untuk mengaktifkan kembali scroll setelah 2 detik (2000 milidetik)
  setTimeout(function(){
      $("body").css("overflow", "auto");
      $(".loader-wrapper").hide(); // Menyembunyikan loader
  }, 1500);
});


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


/**
 * Add Search Button
 */

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


/**
 * Implementing Search Function ((MASIH ERROR)/ON PROGRESS)
 */

// Menambahkan event listener ke document untuk event 'click'
document.addEventListener('click', function(event) {
  // Memeriksa apakah yang diklik adalah tombol pencarian
  if (event.target.id === 'searchBtn') {
    var searchTerm = document.getElementById('searchInput').value.trim().toLowerCase();
    
    // Check if search term is not empty
    if (searchTerm !== '') {
      var items = document.querySelectorAll('li[id]'); // Mengambil semua elemen <li> yang memiliki ID
      var found = false;

      items.forEach(function(item) {
        // Normalize id attribute value for partial matching
        var itemIdNormalized = item.id.trim().toLowerCase();
        
        // Check if the id attribute value contains the search term
        if (itemIdNormalized.includes(searchTerm)) {
          found = true;
          item.scrollIntoView({behavior: "smooth", block: "center"});
          // Redirect user to index.html and set hash to the matching item's id
          window.location.href = './index.html#' + encodeURIComponent(searchTerm);
        }
      });

      if (!found) {
        // Jika data tidak ditemukan di halaman saat ini, arahkan pengguna ke halaman Index.html
        window.location.href = './index.html#' + encodeURIComponent(searchTerm);
      }

      // Reset search input
      document.getElementById('searchInput').value = '';
    }
  }
});



/**
 * Connecting The API
 */

document.addEventListener("DOMContentLoaded", function () {
  const urlParams = new URLSearchParams(window.location.search);
  const mangaId = urlParams.get('id');
  const imagePath = urlParams.get('image');

  // Check if mangaId exists before making API request
  if (mangaId) {
      // Fetch data from the first API endpoint using the mangaId
      fetch(`https://komiku-api.fly.dev/api/comic/search/${mangaId}`)
          .then(response => response.json())
          .then(data => {
              if (data.success && data.data && data.data.length > 0) {
                  // Ambil data manga paling bawah dari hasil pencarian
                  const manga = data.data[data.data.length - 1];

                  const mangaTitle = manga.title;
                  const mangaEndpoint = manga.endpoint;

                  // Display the fetched title
                  document.getElementById("TitleManga").innerText = mangaTitle;

                  // Set the manga cover image using the provided image path
                  document.getElementById("MangaCover").style.backgroundImage = `url('${imagePath}')`;

                  // Fetch data from the second API endpoint using the mangaEndpoint
                  fetch(`https://komiku-api.fly.dev/api/comic/info${mangaEndpoint}`)
                      .then(response => response.json())
                      .then(data => {
                          const chapterList = data.data.chapter_list;

                          const chapterContainer = document.getElementById("ChapterList");

                          chapterList.forEach(chapter => {
                              const listItem = document.createElement("li");
                              listItem.innerHTML = `<a class="chapter-link" href="Read.html?endpoint=${chapter.endpoint}">${chapter.name}<span id="TitleChapter"></span></a>`;
                              chapterContainer.appendChild(listItem);
                          });
                      })
                      .catch(error => console.error("Error fetching data from the second API:", error));
              } else {
                  console.error(`No manga found with the id '${mangaId}'.`);
              }
          })
          .catch(error => console.error("Error fetching data from the first API:", error));
  } else {
      console.error("No manga id provided in the URL.");
  }
});

function fetchChapterData() {
  // Mendapatkan nilai endpoint dari URL
  const urlParams = new URLSearchParams(window.location.search);
  const endpoint = urlParams.get('endpoint');

  // Fetch data for the selected chapter endpoint
  fetch(`https://komiku-api.fly.dev/api/comic/chapter${endpoint}`)
      .then(response => response.json())
      .then(data => {
          const titleChapter = document.getElementById("TitleChapter");
          titleChapter.textContent = data.data.title;

          const chapterImagesContainer = document.getElementById("chapterImages");
          chapterImagesContainer.innerHTML = ''; // Clear previous images

          data.data.image.forEach(imageUrl => {
              const imageElement = document.createElement("img");
              imageElement.src = imageUrl;
              chapterImagesContainer.appendChild(imageElement);
          });
      })
      .catch(error => console.error("Error fetching chapter data:", error));
}


/**
 * Manually Added The Chapter Image
 */

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
  var coverPath = `./assets/images/MangaCover/Minato/Chapter${chapterNumber}/Cover.png`;
  imageExists(coverPath, function (coverExists) {
    if (coverExists) {
      console.log(`Appending cover image: ${coverPath}`);

      var coverElement = new Image();
      coverElement.src = coverPath;
      container.appendChild(coverElement);
    } else {
      console.log("Cover image not found.");
    }

    var coverPath1 = `./assets/images/MangaCover/Minato/Chapter${chapterNumber}/Cover1.png`;
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
      var imagePath = `./assets/images/MangaCover/Minato/Chapter${chapterNumber}/image${i}.png`;

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


/**
 * Pagination Function & Popular API
 */

document.addEventListener("DOMContentLoaded", function() {
  const pagination = document.getElementById("Pagination");
  const pageNumbers = pagination.getElementsByClassName("pageNumber");
  const prevButton = document.getElementById("prev");
  const nextButton = document.getElementById("next");
  const mangaList = document.querySelector(".manga-container");

  let currentPage = 1;
  showPage(currentPage);

  // Function to show the selected page
  function showPage(page) {
    // Remove active class from all page numbers
    for (let i = 0; i < pageNumbers.length; i++) {
      pageNumbers[i].classList.remove("active");
    }
    // Add active class to the selected page number
    pageNumbers[page - 1].classList.add("active");
    currentPage = page;

    // Fetch data from the API based on the selected page number
    fetch(`https://komiku-api.fly.dev/api/comic/popular/page/${currentPage}`)
      .then(response => response.json())
      .then(data => {
        if (data.success && data.data && data.data.length > 0) {
          // Clear existing manga list
          mangaList.innerHTML = "";
          // Loop through each manga item from the API data
          data.data.forEach(manga => {
            // Create an element for each manga item
            const mangaItem = document.createElement("li");
            mangaItem.className = "scrollbar-item";
            mangaItem.innerHTML = `
              <div class="category-card">
                <figure class="manga-image img-holder" style="--width: 350; --height: 212;">
                  <a href="./Preview.html?id1=${manga.endpoint}&image=${manga.image}"><img src="${manga.image}" loading="lazy" alt="Cover Picture"></a>
                </figure>
                <h4 class="h4">
                  <a href="./Preview.html?id1=${manga.endpoint}&image=${manga.image}" class="card-title" style="font-size: 12px;">${manga.title}</a>
                </h4>
              </div>
            `;
            // Add manga item to the manga list
            mangaList.appendChild(mangaItem);
          });
        } else {
          console.error("No manga data found.");
        }
      })
      .catch(error => console.error("Error fetching manga data:", error));
  }

  // Event listener for page numbers
  for (let i = 0; i < pageNumbers.length; i++) {
    pageNumbers[i].addEventListener("click", function() {
      const pageNumber = parseInt(this.innerText);
      showPage(pageNumber);
    });
  }

  // Event listener for Previous button
  prevButton.addEventListener("click", function() {
    if (currentPage === 1) {
      showPage(5);
    } else {
      showPage(currentPage - 1);
    }
  });

  // Event listener for Next button
  nextButton.addEventListener("click", function() {
    if (currentPage === 5) {
      showPage(1);
    } else {
      showPage(currentPage + 1);
    }
  });
});

if (window.location.pathname === '/Preview.html') {
  const urlParams = new URLSearchParams(window.location.search);
  const mangaId1 = urlParams.get('id1');

  // Check if mangaId exists before making API request
  if (mangaId1) {
    // Fetch data from the fourth API endpoint using the mangaId
    fetch(`https://komiku-api.fly.dev/api/comic/info/${mangaId1}`)
      .then(response => response.json())
      .then(data => {
        if (data.success && data.data) {
          const mangaTitle = data.data.title;
          const thumbnail = data.data.thumbnail;
          const chapterList = data.data.chapter_list;

          // Display the fetched title and thumbnail
          document.getElementById("TitleManga").innerText = mangaTitle;
          document.getElementById("MangaCover").style.backgroundImage = `url('${thumbnail}')`;

          // Display the chapter list
          const chapterContainer = document.getElementById("ChapterList");
          chapterContainer.innerHTML = ''; // Clear previous chapters
          chapterList.forEach(chapter => {
            const listItem = document.createElement("li");
            listItem.innerHTML = `<a class="chapter-link" href="Read.html?endpoint=${chapter.endpoint}">${chapter.name}<span id="TitleChapter"></span></a>`;
            chapterContainer.appendChild(listItem);
          });
        } else {
          console.error(`No manga found with the id '${mangaId1}'.`);
        }
      })
      .catch(error => console.error("Error fetching data from the fourth API:", error));
  } else {
    console.error("No manga id provided in the URL.");
  }
}



/**
 * Pagination Function & Recomended API
 */



/**
 * Chapter Dropdown
 */



/**
 * Expand
 */



/**
 * Spoiler
 */