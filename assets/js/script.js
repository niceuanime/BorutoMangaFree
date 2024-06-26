'use strict';


/**
 * Restrain user for inspecting
 */

document.addEventListener('contextmenu', function (e) {
  e.preventDefault();
});

document.onkeydown = function (e) {
  if (e.key === "F12") {
      e.preventDefault();
  }
};


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
var isSearchBarVisible = false; // Variabel untuk melacak apakah search bar ditampilkan

// Show search bar when searchBtn is clicked
searchBtn.addEventListener('click', function (event) {
  event.preventDefault(); // Mencegah perilaku default jika searchBtn adalah bagian dari form
  if (!isSearchBarVisible) {
    searchBarContainer.style.display = 'block';
    searchInput.focus();
    isSearchBarVisible = true; // Perbarui status karena search bar sekarang ditampilkan
  }
});

// Hide search bar when clicking outside the search bar
document.addEventListener('click', function (event) {
  if (isSearchBarVisible && !searchBarContainer.contains(event.target) && event.target !== searchBtn) {
    searchBarContainer.style.display = 'none';
    isSearchBarVisible = false; // Perbarui status karena search bar sekarang disembunyikan
  }
});

// Prevent hiding the search bar when clicking inside the search bar
searchBarContainer.addEventListener('click', function (event) {
  event.stopPropagation();
});


/**
 * Implementing Search Function ((MASIH ERROR)/ON PROGRESS)
 */

var idMap = {};

document.addEventListener("DOMContentLoaded", function() {
  // Fungsi untuk menampilkan halaman Popular dan Recommended
  // Pastikan untuk memanggil fungsi ini setelah data berhasil diambil dari API
  function updateIdMap() {
    var elementsWithId = document.querySelectorAll('[id]');
    elementsWithId.forEach(function(elem) {
      var normalizedId = elem.id.replace(/[^a-zA-Z0-9 \-]/g, '').toLowerCase();
      idMap[normalizedId] = elem;
      console.log("Added to idMap:", normalizedId); // Debugging: Log setiap id yang ditambahkan
    });
  }


  // Event listener untuk pencarian
  document.addEventListener('click', function(event) {
    if (event.target.id === 'searchBtn' && isSearchBarVisible && searchInput.value.trim() !== '') {
      search();
      isSearchBarVisible = false;
    }
  });
  
  // Tambahkan pendengar acara untuk kejadian "keypress" pada input pencarian
  document.getElementById('searchInput').addEventListener('keypress', function(event) {
    if (event.key === 'Enter' && isSearchBarVisible && searchInput.value.trim() !== '') {
      search();
      isSearchBarVisible = false;
    }
  });
  
  function search() {
    isSearchBarVisible = false;
    var searchTerm = document.getElementById('searchInput').value.trim().toLowerCase();
    var formattedSearchTerm = searchTerm.replace(/[^a-zA-Z0-9 \-]/g, '').toLowerCase();
    console.log("Searching for:", formattedSearchTerm); // Debugging: Log searchTerm
  
    var targetElement = idMap[formattedSearchTerm];
    if (!targetElement) {
      // Jika tidak ditemukan berdasarkan manga.title, coba cari berdasarkan id secara eksplisit
      var allLinks = document.querySelectorAll('[id]');
      for (var i = 0; i < allLinks.length; i++) {
        var id = allLinks[i].id.replace(/[^a-zA-Z0-9 \-]/g, '').toLowerCase();
        if (id.includes(formattedSearchTerm)) {
          targetElement = allLinks[i];
          break;
        }
      }
    }
  
    if (!targetElement) {
      // Jika masih tidak ditemukan, coba cari kecocokan parsial
      for (var key in idMap) {
        if (key.includes(formattedSearchTerm)) {
          targetElement = idMap[key];
          break; // Keluar dari loop setelah menemukan elemen pertama yang cocok
        }
      }
    }
  
    console.log("Found element:", targetElement); // Debugging: Log elemen yang ditemukan
  
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      console.log("Element not found for:", formattedSearchTerm); // Debugging: Log jika tidak ditemukan
    }
    document.getElementById('searchInput').value = '';
  }
  
});


/**
 * Connecting The API
 */

document.addEventListener("DOMContentLoaded", function () {
  // Inisialisasi peta ID

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
 * Pagination Function & Popular and Recommended API
 */

document.addEventListener("DOMContentLoaded", function() {
  // Inisialisasi peta ID


  // Pagination untuk Popular
  const pagination = document.getElementById("Pagination");
  const pageNumbers = pagination.getElementsByClassName("pageNumber");
  const prevButton = document.getElementById("prev");
  const nextButton = document.getElementById("next");
  const popularMangaList = document.getElementById("popular");

  popularMangaList.innerHTML = "";

  let currentPopularPage = 1;
  showPopularPage(currentPopularPage);

  // Pagination untuk Recommended
  const pagination2 = document.getElementById("RecommendedPagination");
  const pageNumbers2 = pagination2.getElementsByClassName("recommendedPageNumber");
  const prevButton2 = document.getElementById("prev2");
  const nextButton2 = document.getElementById("next2");
  const recommendedMangaList = document.getElementById("recommend");

  recommendedMangaList.innerHTML = "";

  let currentRecommendedPage = 1;
  showRecommendedPage(currentRecommendedPage);
  
  let totalPages = 8; // Gantilah dengan jumlah total halaman untuk kategori Popular
  let totalRecommendedPages = 20; // Gantilah dengan jumlah total halaman untuk kategori Recommended

  function showPopularPage(page) {
    // Remove active class from all page numbers
    for (let i = 0; i < pageNumbers.length; i++) {
      pageNumbers[i].classList.remove("active");
    }
    // Add active class to the selected page number
    pageNumbers[page - 1].classList.add("active");
    currentPopularPage = page;
  
    // Fetch data from the API based on the selected page number
    fetch(`https://komiku-api.fly.dev/api/comic/popular/page/${currentPopularPage}`)
    .then(response => response.json())
    .then(data => {
      if (data.success && data.data && data.data.length > 0) {
        // Clear existing manga list
        popularMangaList.innerHTML = "";
        // Loop through each manga item from the API data
        data.data.forEach(manga => {
          // Create an element for each manga item
          const mangaItem = document.createElement("li");
          mangaItem.className = "scrollbar-item";
          mangaItem.innerHTML = `
            <div class="category-card" id="${manga.title}">
              <figure class="manga-image img-holder" style="--width: 350; --height: 212;">
                <a href="./Preview.html?id1=${manga.endpoint}"><img src="${manga.image}" loading="lazy" alt="Cover Picture"></a>
              </figure>
              <h4 class="h4">
                <a href="./Preview.html?id1=${manga.endpoint}" class="card-title" style="font-size: 12px;">${manga.title}</a>
              </h4>
            </div>
          `;
          // Add manga item to the manga list
          popularMangaList.appendChild(mangaItem);
          // Tambahkan id manga.title ke dalam peta idMap
          var normalizedId = manga.title.replace(/[^a-zA-Z0-9 \-]/g, '').toLowerCase();
          idMap[normalizedId] = document.getElementById(manga.title); // Simpan referensi ke id
          console.log("Added to idMap:", normalizedId); // Debugging: Log setiap id yang ditambahkan
        });
      } else {
        console.error("No manga data found.");
      }
    })
    .catch(error => console.error("Error fetching manga data:", error));
  }

  function showRecommendedPage(page) {
    // Remove active class from all page numbers
    for (let i = 0; i < pageNumbers2.length; i++) {
      pageNumbers2[i].classList.remove("active");
    }
    // Add active class to the selected page number
    pageNumbers2[page - 1].classList.add("active");
    currentRecommendedPage = page;

    // Fetch data from the API based on the selected page number
    fetch(`https://komiku-api.fly.dev/api/comic/recommended/page/${currentRecommendedPage}`)
    .then(response => response.json())
    .then(data => {
      if (data.success && data.data && data.data.length > 0) {
        // Clear existing manga list
        recommendedMangaList.innerHTML = "";
        // Loop through each manga item from the API data
        data.data.forEach(manga => {
          // Create an element for each manga item
          const mangaItem2 = document.createElement("li");
          mangaItem2.className = "scrollbar-item";
          mangaItem2.innerHTML = `
            <div class="category-card" id="${manga.title}">
              <figure class="manga-image img-holder" style="--width: 350px; --height: 212px;"> <!-- Add px here -->
                <a href="./Preview.html?id1=${manga.endpoint}"><img src="${manga.image}" loading="lazy" alt="Cover Picture"></a>
              </figure>
              <h4 class="h4">
                <a href="./Preview.html?id1=${manga.endpoint}" class="card-title" style="font-size: 12px;">${manga.title}</a>
              </h4>
            </div>
          `;
          // Add manga item to the manga list
          recommendedMangaList.appendChild(mangaItem2);
          // Tambahkan id manga.title ke dalam peta idMap
          var normalizedId2 = manga.title.replace(/[^a-zA-Z0-9 \-]/g, '').toLowerCase();
          idMap[normalizedId2] = document.getElementById(manga.title); // Simpan referensi ke id
          console.log("Added to idMap:", normalizedId2); // Debugging: Log setiap id yang ditambahkan
        });
      } else {
        console.error("No manga data found.");
      }
    })
    .catch(error => console.error("Error fetching manga data:", error));
  }
  function updatePageNumbersVisibility() {
    // Update visibility and set active state for Popular
    const startingPagePopular = Math.max(1, Math.min(currentPopularPage - 2, totalPages - 5));
  
    for (let i = 0; i < pageNumbers.length; i++) {
      const pageNumber = startingPagePopular + i;
      const pageNumberElement = pageNumbers[i];
  
      if (pageNumber <= totalPages) {
        pageNumberElement.style.display = "block";
        pageNumberElement.getElementsByTagName("a")[0].innerText = pageNumber;
  
        if (pageNumber === currentPopularPage) {
          pageNumberElement.classList.add("active");
        } else {
          pageNumberElement.classList.remove("active");
        }
      } else {
        pageNumberElement.style.display = "none";
      }
    }
  
    // Update visibility and set active state for Recommended
    const startingPageRecommended = Math.max(1, Math.min(currentRecommendedPage - 2, totalRecommendedPages - 4));
  
    for (let i = 0; i < pageNumbers2.length; i++) {
      const pageNumber = startingPageRecommended + i;
      const pageNumberElement = pageNumbers2[i];
  
      if (pageNumber <= totalRecommendedPages) {
        pageNumberElement.style.display = "block";
        pageNumberElement.getElementsByTagName("a")[0].innerText = pageNumber;
  
        if (pageNumber === currentRecommendedPage) {
          pageNumberElement.classList.add("active");
        } else {
          pageNumberElement.classList.remove("active");
        }
      } else {
        pageNumberElement.style.display = "none";
      }
    }
  }
  
  
  // Initialize visibility
  updatePageNumbersVisibility();

  // Event listener for Popular page numbers
  for (let i = 0; i < pageNumbers.length; i++) {
    pageNumbers[i].addEventListener("click", function () {
      const pageNumber = parseInt(this.innerText);
      showPopularPage(pageNumber);
      updatePageNumbersVisibility(); // Tambahkan ini
    });
  }

  // Event listener for Popular Previous button
  prevButton.addEventListener("click", function() {
    if (currentPopularPage === 1) {
      showPopularPage(5);
    } else {
      showPopularPage(currentPopularPage - 1);
    }
    updatePageNumbersVisibility();
  });

  // Event listener for Popular Next button
  nextButton.addEventListener("click", function() {
    if (currentPopularPage === totalPages) {
      // Jika sudah di halaman terakhir, kembali ke halaman pertama
      showPopularPage(1);
    } else {
      showPopularPage(currentPopularPage + 1);
    }
    updatePageNumbersVisibility();
  });

  // Event listener for Recommended page numbers
  for (let i = 0; i < pageNumbers2.length; i++) {
    pageNumbers2[i].addEventListener("click", function () {
      const pageNumber2 = parseInt(this.innerText);
      showRecommendedPage(pageNumber2);
      updatePageNumbersVisibility(); // Tambahkan ini
    });
  }

  // Event listener for Recommended Previous button
  prevButton2.addEventListener("click", function() {
    if (currentRecommendedPage === 1) {
      showRecommendedPage(5);
    } else {
      showRecommendedPage(currentRecommendedPage - 1);
    }
    updatePageNumbersVisibility();
  });

  // Event listener for Recommended Next button
  nextButton2.addEventListener("click", function() {
    if (currentRecommendedPage === totalRecommendedPages) {
      // Jika sudah di halaman terakhir, kembali ke halaman pertama
      showRecommendedPage(1);
    } else {
      showRecommendedPage(currentRecommendedPage + 1);
    }
    updatePageNumbersVisibility();
  });
});

document.addEventListener("DOMContentLoaded", function() {
  // Tangkap parameter id1 dari URL
  const urlParams = new URLSearchParams(window.location.search);
  const mangaId = urlParams.get('id1');
  
  // Periksa apakah mangaId ada sebelum membuat permintaan API
  if (mangaId) {
    // Gabungkan endpoint manga dengan URL API
    const apiUrl = `https://komiku-api.fly.dev/api/comic/info/${mangaId}`;
    
    // Lakukan permintaan HTTP GET ke URL API
    fetch(apiUrl)
      .then(response => response.json())
      .then(data => {
        // Ambil data title dari respons
        const mangaTitle = data.data.title;
        const thumbnailUrl = data.data.thumbnail;
        const chapterList = data.data.chapter_list;
        
        // Setel teks dari elemen dengan ID TitleManga
        document.getElementById("TitleManga").textContent = mangaTitle;
        document.getElementById("MangaCover").style.backgroundImage = `url('${thumbnailUrl}')`;
        
        // Tambahkan daftar chapter ke dalam elemen dengan ID ChapterList
        const chapterContainer = document.getElementById("ChapterList");
        chapterList.forEach(chapter => {
          const listItem = document.createElement("li");
          listItem.innerHTML = `<a class="chapter-link" href="Read.html?endpoint=${chapter.endpoint}">${chapter.name}<span id="TitleChapter"></span></a>`;
          chapterContainer.appendChild(listItem);
        });
      })
      .catch(error => console.error("Error fetching manga info:", error));
  } else {
    console.error("No manga ID provided in the URL.");
  }
});

document.addEventListener("DOMContentLoaded", function() {
  // Tangkap parameter endpoint dari URL
  const urlParams = new URLSearchParams(window.location.search);
  const endpoint = urlParams.get('endpoint');
  
  // Periksa apakah endpoint ada sebelum membuat permintaan API
  if (endpoint) {
    // Gabungkan endpoint dengan URL API
    const apiUrl = `https://komiku-api.fly.dev/api/comic/chapter${endpoint}`;
    
    // Lakukan permintaan HTTP GET ke URL API
    fetch(apiUrl)
      .then(response => response.json())
      .then(data => {
        // Ambil data title dan image dari respons
        const chapterTitle = data.data.title;
        const chapterImages = data.data.image;
        
        // Setel teks dari elemen dengan ID TitleChapter
        document.getElementById("TitleChapter").textContent = chapterTitle;
        
        // Tambahkan gambar chapter ke dalam elemen dengan ID chapterImages
        const chapterImagesContainer = document.getElementById("chapterImages");
        chapterImages.forEach(imageUrl => {
          const imageElement = document.createElement("img");
          imageElement.src = imageUrl;
          chapterImagesContainer.appendChild(imageElement);
        });
      })
      .catch(error => console.error("Error fetching chapter detail:", error));
  } else {
    console.error("No endpoint provided in the URL.");
  }
});


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
 * Chapter Dropdown
 */



/**
 * Expand
 */



/**
 * Spoiler
 */