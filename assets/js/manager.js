function createMovie(movieId, title, genres, year, releaseDate, rating, imdbScore, directors, actors, writers, duration,
                     countries, boxOffice, url, imdbUrl, votes, imageUrl, description){
    return movie = {
    movieId: movieId,
    title: title,
    genres: genres,
    year: year,
    releaseDate: releaseDate,
    rating: rating,
    imdbScore: imdbScore,
    directors: directors,
    actors: actors,
    writers: writers,
    duration: duration,
    countries: countries,
    boxOffice: boxOffice,
    url: url,
    imdbUrl: imdbUrl,
    votes: votes,
    imageUrl: imageUrl,
    description: description
    }
}

function createCategory(catId, name){
    return category = {
        catId: catId,
        name: name
    }
}

function getMovieObject(movieDict){
    const movieId = movieDict["id"]
    const title = movieDict["title"]
    const genres = movieDict["genres"]
    const year = movieDict["year"]
    const releaseDate = movieDict["date_published"]
    const rating = movieDict["rated"]
    const imdbScore = movieDict["imdb_score"]
    const directors = movieDict["directors"]
    const actors = movieDict["actors"]
    const writers = movieDict["writers"]
    const duration = movieDict["duration"]
    const countries = movieDict["countries"]
    const boxOffice = movieDict["worldwide_gross_income"]
    const url = movieDict["url"]
    const imdbUrl = movieDict["imdb_url"]
    const votes = movieDict["votes"]
    const imageUrl = movieDict["image_url"]
    const description = movieDict["long_description"]
    return createMovie(movieId, title, genres, year, releaseDate, rating, imdbScore, directors, actors, writers,
        duration, countries, boxOffice, url, imdbUrl, votes, imageUrl, description)
}

function getMovieObjects(movieList) {
    let movies = [];

    for(let i=0; i < movieList.length; i++){
        const movieDict = movieList[i]
        movies.push(getMovieObject(movieDict))
    }
    return movies
}

function getCategoryObjects(categoryList) {
    const categories = []
    for(let i= 0; i < categoryList.length; i++) {
        const categoryDict = categoryList[i]

        const catId = categoryDict["id"]
        const name = categoryDict["name"]

        categories.push(createCategory(catId, name))
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

    for(let i=0; i < movieList.length; i++){
        const movieId = movieList[i].id
        const movieImdbUrl = movieList[i].imdb_url
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

async function getBestMoviesFromCategory(category="Thriller"){
    const movieList = await getMovies(6)

    return getMovieObjects(await computeMovieDetails(movieList))
}

async function getAllCategories() {
    const categoryList = await getGenres()
    return getCategoryObjects(categoryList)
}

