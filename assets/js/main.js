function displayItems(itemList){
    for(let i=0; i < itemList.length; i++){
            console.log(`       - ${itemList[i]}`);
        }
}

function displayCategory(categoryObject) {
    console.log(`   ID : ${categoryObject.catId}`);
    console.log(`   Name : ${categoryObject.name}`);
}

function displayMovie(movieObject) {
    console.log(`   ID : ${movieObject.movieId}`);
    console.log(`   Title : ${movieObject.title}`);

    if(movieObject.genres.length===1){
        console.log(`   Genre : ${movieObject.genres}`);
    }
    else{
        console.log("   Genres : ");
        displayItems(movieObject.genres);
    }

    console.log(`   Year : ${movieObject.year}`);
    console.log(`   Release Date : ${movieObject.releaseDate}`);
    console.log(`   Rated : ${movieObject.rating}`);
    console.log(`   IMDB Score : ${movieObject.imdbScore}`);

    if(movieObject.directors.length===1){
        console.log(`   Director : ${movieObject.directors}`);
    }
    else{
        console.log("   Directors : ");
        displayItems(movieObject.directors);
    }

    if(movieObject.actors.length===1){
        console.log(`   Actor : ${movieObject.actors}`);
    }
    else{
        console.log("   Actors : ");
        displayItems(movieObject.actors);
    }

    if(movieObject.writers.length===1){
        console.log(`   Writer : ${movieObject.writers}`);
    }
    else{
        console.log("   Writers : ");
        displayItems(movieObject.writers);
    }

    console.log(`   Duration : ${movieObject.duration}`);

    if(movieObject.countries.length===1){
        console.log(`   Country : ${movieObject.countries}`);
    }
    else{
        console.log("   Countries : ");
        displayItems(movieObject.countries);
    }

    console.log(`   WorldWide Box Office ($) : ${movieObject.boxOffice}`);
    console.log(`   URL : ${movieObject.url}`);
    console.log(`   IMDB URL : ${movieObject.imdbUrl}`);
    console.log(`   Votes : ${movieObject.votes}`);
    console.log(`   Image URL : ${movieObject.imageUrl}`);
    console.log(`   Pitch : ${movieObject.description}`);
}

function displayMovies(movieList) {
    for(let i = 0; i < movieList.length; i++) {
        console.log(`N°${i+1}.`);
        displayMovie(movieList[i]);
    }
}

function displayCategories(categoryList) {
    for(let i = 0; i < categoryList.length; i++) {
        console.log(`N°${i+1}.`);
        displayCategory(categoryList[i]);
    }
}

window.addEventListener("load", async () => {
  const bestMovie = await getBestMovie();

  const container = document.getElementById("bestMovieContent");
  container.innerHTML = "";

  const img = document.createElement("img");
  img.src = bestMovie.imageUrl;
  img.alt = `${bestMovie.title} - image`;
  img.title = `${bestMovie.title} - image`;
  img.onerror = () => {
    img.src = "./assets/images/placeholder.png"; // ton placeholder
  };

  const infoDiv = document.createElement("div");
  infoDiv.innerHTML = `
    <h2>${bestMovie.title}</h2>
    <p>${bestMovie.description}</p>
    <a href="#">Détails</a>
  `;

  container.appendChild(img);
  container.appendChild(infoDiv);
});

getBestMoviesFromAllGenres().then(bestMoviesFromAllGenres => {
    console.log("\n• The best movies from all genres are :");
    displayMovies(bestMoviesFromAllGenres);
})

getBestMoviesFromCategory().then(bestMoviesFromCategory => {
    console.log(`\n• The best movies from thriller category are :`);
    displayMovies(bestMoviesFromCategory);
})

getAllCategories().then(allCategories => {
    console.log(`\n• Here are all categories :`);
    displayCategories(allCategories);
})