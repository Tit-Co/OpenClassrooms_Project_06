function createImage(format, movie, target) {
    const img = document.createElement("img");

    img.src = movie.imageUrl;
    img.alt = `${movie.title} - image ${target}`;
    img.title = `${movie.title} - image ${target}`;
    let imgUrl = "";
    switch(format) {
        case "square" :
            imgUrl = "./assets/images/placeholder_square.png";
            break;
        case "portrait" :
            imgUrl = "./assets/images/placeholder.png";
            break;
    }
    img.onerror = () => {
        console.log(`IMG Loading Error : ${movie.imageUrl} replaced by ${imgUrl}`)
        img.src = imgUrl;
    };

    return img;
}

function loadMoviesContentSection(movies) {
    const movieContentDiv = document.createElement("div")
    movieContentDiv.classList.add("moviesContent");

    let i = 0;
    for(const movie of movies) {
        const imageBlockDiv = document.createElement("div");

        const img = createImage("square", movie, "");
        img.style.objectFit = "cover";
        img.style.width = "250px";
        imageBlockDiv.classList.add("moviesImageBlock");
        imageBlockDiv.appendChild(img);

        const buttonId = "bestMoviesDetailsButton" + i.toString();
        const detailsButton = document.createElement("a");
        detailsButton.innerText = "Détails";
        detailsButton.id = buttonId;
        detailsButton.href = "#";

        // Details Modal
        detailsButton.addEventListener("click", (event) => {
            event.preventDefault();
            const myModalContent = document.getElementById("modalContent");
            myModalContent.innerHTML = "";

            const divContent = loadInModal(movie) ;
            myModalContent.appendChild(divContent);

            registerModalEvents();
        });

        const infoBlockDiv = document.createElement("div");
        infoBlockDiv.innerHTML = `<p>${movie.title}</p>`;
        infoBlockDiv.appendChild(detailsButton)
        imageBlockDiv.appendChild(infoBlockDiv);
        movieContentDiv.appendChild(imageBlockDiv);

        i++;
    }

    const a = document.createElement("a")
    a.href = "#";
    a.innerText = "Voir plus";
    movieContentDiv.appendChild(a)

    return movieContentDiv;
}

function loadMoviesSection(section, category, moviesList) {
    const moviesSection = document.getElementById(section);
    moviesSection.innerHTML = "";

    const title = document.createElement("h1");
    title.innerText = computeCategory(category);
    moviesSection.appendChild(title);

    const movieContentDiv = loadMoviesContentSection(moviesList);

    moviesSection.appendChild(movieContentDiv);
}

function registerModalEvents() {
    const modal = document.getElementById("modal");
    modal.style.display = "block";

    const closeSelectors = ["#closeButton", "#closeCross"];
    closeSelectors.forEach(selector => {
        const btn = document.querySelector(selector);
        if (btn) {
            btn.addEventListener("click", event => {
                event.preventDefault();
                modal.style.display = "none";
            });
        }
    });
}

function loadInModal(movie) {
    const div = document.createElement("div");

    const table = document.createElement("table");

    const tr1 = document.createElement("tr");

    const td1 = document.createElement("td");
    td1.innerHTML = `<h1>${movie.title}</h1>`
    tr1.appendChild(td1);

    const td2 = document.createElement("td");
    td2.rowSpan = "6";
    const td2Div = document.createElement("div");

    const img = createImage("portrait", movie, "Desktop");
    img.style.width = "227px";
    img.style.height = "334px";
    td2Div.appendChild(img);
    td2.appendChild(td2Div);
    tr1.appendChild(td2);

    const td3 = document.createElement("td");
    td3.innerHTML = `
        <div class="close">
            <a href="#" id="closeCross"><span>&times;</span></a>
        </div>
    `;
    tr1.appendChild(td3);

    table.appendChild(tr1);

    const tr2 = document.createElement("tr");
    const allMovieGenres = movie.genres.join(", ");
    tr2.innerHTML = `
        <td class="subtitle">${movie.year} - ${allMovieGenres}</td>
        <td></td>
    `;
    table.appendChild(tr2);

    const tr3 = document.createElement("tr");
    const allMovieCountries = movie.countries.join("/ ");
    let rating = ""
    if(Number.isInteger(movie.rating)) {
        rating = "PG-" + movie.rating
    }else{
        rating = "PG- Non évalué"
    }
    tr3.innerHTML = `
        <td class="subtitle">${rating} - ${movie.duration} minutes (${allMovieCountries})</td>
        <td></td>
    `;
    table.appendChild(tr3);

    const tr4 = document.createElement("tr");
    tr4.innerHTML = `
        <td class="subtitle">IMDB score: ${movie.imdbScore}/10</td>
        <td></td>
    `;
    table.appendChild(tr4);

    const tr5 = document.createElement("tr");
    const amount = movie.boxOffice ? new Intl.NumberFormat("en",
        {
            notation: "compact",
            compactDisplay: "short",
            style: "currency",
            currency: "USD"
        }).format(movie.boxOffice) : "inconnues";

    tr5.innerHTML = `
        <td class="subtitle">Recettes au box-office: ${amount}</td>
        <td></td>
    `;
    table.appendChild(tr5);

    const tr6 = document.createElement("tr");
    const allMovieDirectors = movie.directors.join(", ");
    tr6.innerHTML = `
        <td>
            <p class="directed-by">Réalisé par:</p>
            <p class="directors">${allMovieDirectors}</p>
        </td>
        <td></td>
    `;
    table.appendChild(tr6);

    div.appendChild(table);

    const descriptionDiv = document.createElement("div");
    descriptionDiv.innerHTML = `
        <p class="description">${movie.description}</p>
    `;
    div.appendChild(descriptionDiv);

    const imgDiv = document.createElement("div");
    imgDiv.classList.add("tablet-mobile-image");

    const imageMobile = createImage("portrait", movie, "mobile");
    imgDiv.appendChild(imageMobile);

    div.appendChild(imgDiv);

    const castDiv = document.createElement("div");
    const allMovieActors = movie.actors.join(", ");
    castDiv.innerHTML = `
        <p class="with">Avec:</p>
        <p class="actors">${allMovieActors}</p>    
    `;
    div.appendChild(castDiv);

    const closeDiv = document.createElement("div");
    closeDiv.classList.add("closeButton")
    closeDiv.innerHTML = `
        <a href="#" id="closeButton">Fermer</a>
    `;
    div.appendChild(closeDiv);

    return div
}

function renderMoviesSection(section, category, movies) {
    loadMoviesSection(section, category, movies);
}

function renderBestMovie(bestMovie) {
    const divBestMovieContent = document.getElementById("bestMovieContent");
    divBestMovieContent.innerHTML = "";

    const img = createImage("portrait", bestMovie, "")

    const divInfo = document.createElement("div");
    divInfo.innerHTML = `
        <h2>${bestMovie.title}</h2>
        <p>${bestMovie.description}</p>
    `;

    divBestMovieContent.appendChild(img);
    divBestMovieContent.appendChild(divInfo);

    // Details Modal
    let detailsButton = document.getElementById("bestMovieDetails")
    detailsButton.addEventListener("click", (event) => {
        event.preventDefault();
        const myModalContent = document.getElementById("modalContent");
        myModalContent.innerHTML = "";

        const divContent = loadInModal(bestMovie) ;
        myModalContent.appendChild(divContent);

        registerModalEvents();
    });
}

async function renderOthersCategorySection(categories) {
    const section = document.getElementById("othersCategorySection");
    section.innerHTML = "";

    const headerDiv = document.createElement("div");
    headerDiv.classList.add("othersCategoryTitle");
    headerDiv.id = "othersCategoryTitle";
    const h1 = document.createElement("h1");
    h1.innerText = "Autres:";
    headerDiv.appendChild(h1);

    const selectComponent = document.createElement("select");
    selectComponent.name="othersCategoryList";
    selectComponent.id="othersCategoryTitle";

    for(const category of categories) {
        const optionElement = document.createElement("option");
        optionElement.value = category.name;
        optionElement.innerText = computeCategory(category.name);
        if (category.name === "Action") {
            optionElement.selected = true;
        }
        selectComponent.appendChild(optionElement);

        optionElement.addEventListener("click", async(event) => {
            event.preventDefault();
            const moviesFromNewCategory = await getBestMoviesFromCategory(category.name);
            const newMovieContentDiv = loadMoviesContentSection(moviesFromNewCategory);
            section.childNodes[1].replaceWith(newMovieContentDiv);
        });

    }
    headerDiv.appendChild(selectComponent);
    section.appendChild(headerDiv);
    const moviesFromCategory = await getBestMoviesFromCategory("Action");
    const movieContentDiv = loadMoviesContentSection(moviesFromCategory);
    section.appendChild(movieContentDiv);
}