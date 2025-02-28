const API_URL = 'https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=93bb3d275c72443a662d9a27eb74cefc';
const IMG_PATH = 'https://image.tmdb.org/t/p/w1280';
const SEARCH_API = 'https://api.themoviedb.org/3/search/movie?api_key=93bb3d275c72443a662d9a27eb74cefc&query=';

async function fetchMovies(url) {
    const res = await fetch(url);
    const data = await res.json();
    return data;
}