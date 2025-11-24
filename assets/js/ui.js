const imageCache = new Map();

function preloadImage(url) {
  return new Promise((resolve, reject) => {
    if (!url) return reject(new Error("No url"));

    const cached = imageCache.get(url);
    if (cached) {
      return cached.ok ? resolve(true) : reject(new Error("caching error"));
    }

    const img = new Image();

    img.onload = () => {

      img.onload = img.onerror = null;
      imageCache.set(url, { ok: true });
      resolve(true);
    };
    img.onerror = () => {

      img.onload = img.onerror = null;
      imageCache.set(url, { ok: false });
      reject(new Error("loading error"));
    };

    img.src = url;
  });
}

async function createImage(movie, target) {
  const placeholderUrl = "./assets/images/placeholder.png";
  const img = document.createElement("img");
  img.alt = `${movie.title} - image ${target}`;
  img.title = `${movie.title} - image ${target}`;

  const url = movie && movie.imageUrl ? movie.imageUrl : null;

  try {
    if (url) {
      await preloadImage(url);
      img.src = url;
    } else {
      img.src = placeholderUrl;
    }
  } catch (err) {
    img.src = placeholderUrl;
  }

  img.onerror = () => {
    img.onerror = null;
    img.src = placeholderUrl;
  };

  return img;
}

function openModal() {
    document.body.style.overflow = 'hidden';
    document.getElementById('modal').style.display = 'block';
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function closeModal() {
    document.body.style.overflow = 'auto';
    document.getElementById('modal').style.display = 'none';
}

function showMore(elementId) {
  const container = document.getElementById(elementId);
  container.querySelectorAll('.moviesImageBlock').forEach(card => {
    card.classList.remove('hidden');
  });

  toggleButtons(elementId, true);
}

function showLess(elementId) {
  const container = document.getElementById(elementId);
  container.querySelectorAll('.moviesImageBlock').forEach((card, index) => {
    if (index >= 2) card.classList.add('hidden');
  });

  toggleButtons(elementId, false);
}

function toggleButtons(elementId, isExpanded) {
  const container = document.getElementById(elementId);

  const showMoreBtn = container.querySelector(".seeMore");
  const showLessBtn = container.querySelector(".seeLess");

  showMoreBtn.style.display = isExpanded ? 'none' : 'flex';
  showLessBtn.style.display = isExpanded ? 'flex' : 'none';
}

async function loadMoviesContentSection(movies, className) {
    const movieContentDiv = document.createElement("div")
    const name = className + "MoviesContent";
    movieContentDiv.classList.add(name);
    movieContentDiv.id = name

    let i = 1;
    for(const movie of movies) {
        const imageBlockDiv = document.createElement("div");

        const img = await createImage(movie, "");
        img.style.objectFit = "cover";
        imageBlockDiv.classList.add("moviesImageBlock");
        if (i >= 3) {
            imageBlockDiv.classList.add("hidden");
        }
        imageBlockDiv.appendChild(img);

        const buttonId = "bestMoviesDetailsButton" + i.toString();
        const detailsButton = document.createElement("a");
        detailsButton.innerText = "Détails";
        detailsButton.id = buttonId;
        detailsButton.href = "#";

        // Details Modal
        detailsButton.addEventListener("click", async (event) => {
            event.preventDefault();
            const myModalContent = document.getElementById("modalContent");
            myModalContent.innerHTML = "";

            const divContent = await loadInModal(movie);
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

    const aSeeMore = document.createElement("a")
    aSeeMore.href = "#" + className + "MoviesContent";
    aSeeMore.innerText = "Voir plus";
    aSeeMore.classList.add("seeMore");
    aSeeMore.id = "SeeMore";
    aSeeMore.addEventListener("click", () => {
        switch(className) {
            case "best" :
                showMore("bestMoviesContent");
                break;
            case "cat1" :
                showMore("cat1MoviesContent");
                break;
            case "cat2" :
                showMore("cat2MoviesContent");
                break;
            case "others" :
                showMore("othersMoviesContent");
                break;
        }
    });
    movieContentDiv.appendChild(aSeeMore)

    const aSeeLess = document.createElement("a")
    aSeeLess.href = "#" + className + "MoviesContent";
    aSeeLess.innerText = "Voir moins";
    aSeeLess.classList.add("seeLess");
    aSeeLess.id = "seeLess";
    aSeeLess.addEventListener("click", () => {
        switch(className) {
            case "best" :
                showLess("bestMoviesContent");
                break;
            case "cat1" :
                showLess("cat1MoviesContent");
                break;
            case "cat2" :
                showLess("cat2MoviesContent");
                break;
            case "others" :
                showLess("othersMoviesContent");
                break;
        }
    });
    movieContentDiv.appendChild(aSeeLess)

    return movieContentDiv;
}

async function loadMoviesSection(section, category, moviesList, className) {
    const moviesSection = document.getElementById(section);
    moviesSection.innerHTML = "";

    const title = document.createElement("h1");
    title.innerText = computeCategory(category);
    moviesSection.appendChild(title);

    const movieContentDiv = await loadMoviesContentSection(moviesList, className);

    moviesSection.appendChild(movieContentDiv);
}

function registerModalEvents() {
    const modal = document.getElementById("modal");
    openModal();

    const closeSelectors = ["#closeButton", "#closeCross"];
    closeSelectors.forEach(selector => {
        const btn = document.querySelector(selector);
        if (btn) {
            btn.addEventListener("click", event => {
                event.preventDefault();
                closeModal();
            });
        }
    });
}

async function loadInModal(movie) {
    const div = document.createElement("div");

    const table = document.createElement("table");

    const tr1 = document.createElement("tr");

    const td1 = document.createElement("td");
    td1.innerHTML = `<h1>${movie.title}</h1>`
    tr1.appendChild(td1);

    const td2 = document.createElement("td");
    td2.rowSpan = 6;
    const td2Div = document.createElement("div");
    td2Div.classList.add("desktopImage");

    const img = await createImage(movie, "Desktop");
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
    const rating = computeRating(movie.rating);

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
    const amount = movie.boxOffice ? new Intl.NumberFormat("fr",
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

    const imageMobile = await createImage(movie, "mobile");
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

async function renderMoviesSection(section, category, movies, className) {
    await loadMoviesSection(section, category, movies, className);
}

async function renderBestMovie(bestMovie) {
    const divBestMovieContent = document.getElementById("bestMovieContent");
    divBestMovieContent.innerHTML = "";

    const cropDiv = document.createElement("div");
    cropDiv.classList.add("crop")

    const img = await createImage(bestMovie, "")

    cropDiv.appendChild(img)

    const divInfo = document.createElement("div");
    divInfo.classList.add("infos");
    divInfo.innerHTML = `
        <h2>${bestMovie.title}</h2>
        <p>${bestMovie.description}</p>
    `;

    divBestMovieContent.appendChild(cropDiv);


    const detailsDiv = document.createElement("div");
    // Details Modal
    detailsDiv.classList.add("bestMovieDetails");
    let detailsButtonA = document.createElement("a");
    detailsButtonA.id = "bestMovieDetails";
    detailsButtonA.innerText = "Details"
    detailsButtonA.addEventListener("click", async (event) => {
        event.preventDefault();
        const myModalContent = document.getElementById("modalContent");
        myModalContent.innerHTML = "";

        const divContent = await loadInModal(bestMovie);
        myModalContent.appendChild(divContent);

        registerModalEvents();
    });
    detailsDiv.appendChild(detailsButtonA);
    divInfo.appendChild(detailsDiv);
    divBestMovieContent.appendChild(divInfo);

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
    selectComponent.id="othersCategoryList";

    for(const category of categories) {
        const optionElement = document.createElement("option");
        optionElement.value = category.name;
        optionElement.innerText = computeCategory(category.name);
        if (category.name === "Action") {
            optionElement.selected = true;
            optionElement.style.fontFamily = "Oswald, sans-serif;";
        }
        selectComponent.appendChild(optionElement);

        selectComponent.addEventListener("change", async (event) => {
        event.preventDefault();
        const selectedCategory = event.target.value;
        const moviesFromNewCategory = await getBestMoviesFromCategory(selectedCategory);
        const movieContentDiv = section.querySelector(".othersMoviesContent");

        if (movieContentDiv) {
            const updatedMoviesDiv = await loadMoviesContentSection(moviesFromNewCategory, "others");
            movieContentDiv.innerHTML="";
            movieContentDiv.append(...updatedMoviesDiv.childNodes);
        } else {
            section.appendChild(await loadMoviesContentSection(moviesFromNewCategory, "others"));
        }
    });

    }
    headerDiv.appendChild(selectComponent);
    section.appendChild(headerDiv);
    const moviesFromCategory = await getBestMoviesFromCategory("Action");
    const movieContentDiv = await loadMoviesContentSection(moviesFromCategory, "others");
    section.appendChild(movieContentDiv);
}
