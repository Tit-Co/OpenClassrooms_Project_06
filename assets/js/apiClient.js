const baseUrl = "http://localhost:8000/api/v1/";
const titlesUrl = baseUrl + "titles/";
const genresUrl = baseUrl + "genres/";

async function getMovies(limit, genre="", sortBy="imdb_score", desc=true) {
    const order = desc ? "-" : "";

    let response = await fetch(`${titlesUrl}?sort_by=${order}${sortBy}&genre=${genre}&page_size=6`);

    let data = await response.json();

    const movieList = [...data.results];

    return movieList.slice(0, limit)
}

async function getMovieDetails(movieId){
    let response = await fetch(`${titlesUrl}${movieId}`);

    return await response.json()
}

async function getGenres() {
    let response = await fetch(`${genresUrl}?page_size=25`);
    let data = await response.json();

    return [...data.results]
}
