const API_URL ='https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=93bb3d275c72443a662d9a27eb74cefc&page=1'
const IMG_PATH ='https://image.tmdb.org/t/p/w1280'
const SEARCH_API ='https://api.themoviedb.org/3/search/movie?api_key=93bb3d275c72443a662d9a27eb74cefc&query=';

const main = document.getElementById('main')
const form = document.getElementById('form')
const search = document.getElementById('search')

// Variabel Pagination
let currentPage = 1;      // Halaman saat ini
const moviesPerPage = 8; // Jumlah film per halaman

getMovies(API_URL)

async function getMovies(url) {
    const res = await fetch(url)
    const data = await res.json()

    showMovies(data.results)
}

function showMovies(movies) {
    main.innerHTML = ''

    movies.forEach((movie) => {
        const {title, poster_path, vote_average, overview } = movie

        const movieEl = document.createElement('div')
        movieEl.classList.add('movie')

        movieEl.innerHTML =`
        <img src="${IMG_PATH + poster_path}" alt="${title}">
        <div class="movie-info">
    <h3>${title}</h3>
    <span class="${getClassByRate(vote_average)}">${vote_average}</span>
        </div>
        <div class="overview">
    <h3>Overview</h3>
    ${overview}
        </div>    
        `
        main.appendChild(movieEl)
    })
}

function getClassByRate(vote) {
    if(vote >= 8) {
        return 'green'
    } else if(vote >= 5) {
        return 'orange'
    }else {
        return 'red'
    }
}

form.addEventListener('submit', (e) => {
    e.preventDefault()

    const searchTerm = search.value
    
    if(searchTerm && searchTerm !== '') {
        getMovies(SEARCH_API + searchTerm);

        search.value = ''
    } else {
        window.location.reload()
    }
})

// Event listener untuk tombol Home
homeButton.addEventListener("click", () => {
    search.value = ""; // Kosongkan input search
    getMovies(API_URL); // Ambil ulang daftar film utama
});


//carousel section
document.addEventListener("DOMContentLoaded", async () => {
    await getCarouselMovies();
    initSwiper();
});

async function getCarouselMovies() {
    const res = await fetch(API_URL);
    const data = await res.json();
    const movies = data.results.slice(0, 5); // Ambil 5 film teratas

    const carousel = document.getElementById("carousel");
    carousel.innerHTML = ""; // Kosongkan carousel sebelum diisi ulang

    movies.forEach((movie) => {
        const { title, backdrop_path } = movie;

        const slide = document.createElement("div");
        slide.classList.add("swiper-slide");

        slide.innerHTML = `
            <img src="${IMG_PATH + backdrop_path}" alt="${title}" title="${title}">
            <div class="slide-overlay">
                <h2>${title}</h2>
            </div>
        `;

        carousel.appendChild(slide);
    });

    // Inisialisasi Swiper setelah carousel selesai dibuat
    initSwiper();
}


//inisialisasi swiper
function initSwiper() {
    const swiper = new Swiper(".mySwiper", {
        slidesPerView: 1,
        spaceBetween: 10,
        loop: true,
        autoplay: {
            delay: 1500, // Slide berganti setiap 2.5 detik
            disableOnInteraction: false, // Tetap autoplay meskipun dikontrol manual
        },
    });

    let lastMove = 0; // Untuk mencegah pergantian slide terlalu cepat
    const throttleTime = 800; // Waktu minimal antar pergantian (ms)

    document.querySelector(".carousel-container").addEventListener("mousemove", (e) => {
        const now = Date.now();
        if (now - lastMove < throttleTime) return; // Hindari slide terlalu cepat

        lastMove = now;

        const { clientX, target } = e;
        const width = target.offsetWidth;
        const position = clientX / width;

        if (position < 0.3) {
            swiper.slidePrev(); // Geser ke kiri
        } else if (position > 0.7) {
            swiper.slideNext(); // Geser ke kanan
        }
    });

    // Hentikan autoplay saat mouse berada di carousel
    document.querySelector(".swiper").addEventListener("mouseenter", () => {
        swiper.autoplay.stop();
    });

    // Lanjutkan autoplay saat mouse keluar dari carousel
    document.querySelector(".swiper").addEventListener("mouseleave", () => {
        swiper.autoplay.start();
    });
}

// Panggil fungsi initSwiper setelah halaman dimuat
document.addEventListener("DOMContentLoaded", () => {
    initSwiper();
});

const prevBtn = document.getElementById("prev");
const nextBtn = document.getElementById("next");
const pageNumber = document.getElementById("pageNumber");

// Event untuk tombol Next
nextBtn.addEventListener("click", () => {
    currentPage++;
    updateMovies();
});

// Event untuk tombol Previous
prevBtn.addEventListener("click", () => {
    if (currentPage > 1) {
        currentPage--;
        updateMovies();
    }
});

// Fungsi untuk update film berdasarkan halaman
function updateMovies() {
    const url = `https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=93bb3d275c72443a662d9a27eb74cefc&page=${currentPage}`;

    console.log("Current Page:", currentPage); // Debugging
    console.log("Page Number Element:", pageNumber); // Debugging

    pageNumber.innerText = currentPage; // Pastikan ini berjalan
    getMovies(url);

    // Hanya tampilkan angka halaman, tanpa tulisan "Page"
    pageNumber.innerText = currentPage;

    // Nonaktifkan tombol jika di halaman pertama
    prevBtn.disabled = currentPage === 1;
}

