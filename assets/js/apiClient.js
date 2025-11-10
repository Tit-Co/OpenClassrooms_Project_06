const baseUrl = "http://localhost:8000/api/v1/";
const titlesUrl = baseUrl + "titles/";
const genresUrl = baseUrl + "genres/";

async function getMovies(limit, genre="", sortBy="imdb_score", desc=true) {
    const order = desc ? "-" : "";

    let response = await fetch(`${titlesUrl}?sort_by=${order}${sortBy}&genre=${genre}`);

    let data = await response.json();

    let movieList = [...data.results];

    while(data.next && movieList.length < limit){
        response = await fetch(data.next);
        data = await response.json();
        movieList.push(...data.results);
    }

    return movieList.slice(0, limit)
}

async function getMovieDetails(movieId){
    let response = await fetch(`${titlesUrl}${movieId}`);

    return await response.json()
}

async function getGenres() {
    let response = await fetch(`${genresUrl}`);
    let data = await response.json();

    let genreList = [...data.results];

    while(data.next){
        response = await fetch(data.next);
        data = await response.json();
        genreList.push(...data.results);
    }
    return genreList
}
