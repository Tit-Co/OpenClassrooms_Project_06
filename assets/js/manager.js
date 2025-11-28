function createCategory(categoryDict){
    return category = {
        catId: categoryDict["id"],
        name: categoryDict["name"]
    }
}

function getMovieObject(movieDict){
    return movie = {
    movieId: movieDict["id"],
    title: movieDict["title"],
    genres: movieDict["genres"],
    year: movieDict["year"],
    releaseDate: movieDict["date_published"],
    rating: movieDict["rated"],
    imdbScore: movieDict["imdb_score"],
    directors: movieDict["directors"],
    actors: movieDict["actors"],
    writers: movieDict["writers"],
    duration: movieDict["duration"],
    countries: movieDict["countries"],
    boxOffice: movieDict["worldwide_gross_income"],
    url: movieDict["url"],
    imdbUrl: movieDict["imdb_url"],
    votes: movieDict["votes"],
    imageUrl: movieDict["image_url"],
    description: movieDict["long_description"]
    }
}

function computeRating(rating) {
    const UNRATED = new Set(["Not rated or unkown rating", "PG", "R", "", null, undefined]);

    function extractNumberFromString(str) {
        const match = str.match(/(\d{1,3})/);
        return match ? Number(match[1]) : null;
    }

    function toInteger(value) {
        const num = Number(value);
        return Number.isInteger(num) ? num : null;
    }

    if (typeof rating === "string") {
        const trimmed = rating.trim();

        if (UNRATED.has(trimmed) || UNRATED.has(trimmed.toUpperCase())) {
          return "PG-Non évalué";
        }

        const extractedNum = extractNumberFromString(trimmed);
        if (extractedNum !== null) return `PG-${extractedNum}`;

        const directNum = toInteger(trimmed);
        if (directNum !== null) return `PG-${directNum}`;

        return "PG-Non évalué";

    } else if (typeof rating === "number" && Number.isInteger(rating)) {
        return `PG-${rating}`;
    }

    return "PG-Non évalué";
}

function computeCategory(category) {
   let categoryList = {
        "Action": "Films d'action",
        "Adult": "Adulte",
        "Adventure": "Films d'aventures",
        "Animation": "Films d'animation",
        "Biography": "Biographies",
        "Comedy": "Comedies",
        "Documentary": "Documentaires",
        "Drama": "Drames",
        "Family": "Famille",
        "Fantasy": "Films fantastiques",
        "Film-noir": "Films Noirs",
        "History": "Histoire",
        "Horror": "Films d'horreur",
        "Music": "Musique",
        "Musical": "Comédies musicales",
        "Mystery": "Mystères",
        "News": "Informations",
        "Reality-TV": "Télé Réalité",
        "Sci-Fi": "Science-Fiction",
        "War": "Films de guerre",
        "Western": "Westerns"
    }

    const cat = categoryList[category];

    return cat ? cat : category;
}

function getMovieObjects(movieList) {
    let movies = [];

    for(let movie of movieList){
        movies.push(getMovieObject(movie))
    }
    return movies
}

function getCategoryObjects(categoryList) {
    const categories = []
    for(let category of categoryList) {
        categories.push(createCategory(category))
    }
    return categories
}

async function getBestMovie(){
    const movieList = await getMovies(1)
    const movieId = movieList[0].id
    const movieImdbUrl = movieList[0].imdb_url

    let movieDict = await getMovieDetails(movieId)
    movieDict.imdb_url = movieImdbUrl

    return getMovieObject(movieDict)
}

async function computeMovieDetails(movieList){
    let movieDictList= []

    for(let movie of movieList){
        const movieId = movie.id
        const movieImdbUrl = movie.imdb_url
        let movieDict = await getMovieDetails(movieId)
        movieDict.imdb_url = movieImdbUrl
        movieDictList.push(movieDict)
    }
    return movieDictList
}

async function getBestMoviesFromAllGenres() {
    const movieList = await getMovies(6)

    return getMovieObjects(await computeMovieDetails(movieList))
}

async function getBestMoviesFromCategory(category){
    const movieList = await getMovies(6, category)

    return getMovieObjects(await computeMovieDetails(movieList))
}

async function getAllCategories() {
    const categoryList = await getGenres()
    return getCategoryObjects(categoryList)
}
