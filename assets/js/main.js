async function loadOthersCategories(categories) {
    await renderOthersCategorySection(categories);
}

async function loadBestMovie() {
    const bestMovie = await getBestMovie();
    await renderBestMovie(bestMovie);
}

async function loadBestMoviesFromAllGenres() {
    const bestMoviesFromAllGenres = await getBestMoviesFromAllGenres();
    await renderMoviesSection("bestMoviesSection", "Films les mieux notés", bestMoviesFromAllGenres, "best");
}

async function loadMoviesFromCategory(section, category) {
    const moviesFromCategory = await getBestMoviesFromCategory(category);
    let className = "";
    if(section === "category1") {
        className = "cat1";
    }else {
        className = "cat2";
    }
    await renderMoviesSection(section + "Section", category, moviesFromCategory, className);
}

async function loadAllOthersCategories() {
    const allCategories = await getAllCategories();
    await loadOthersCategories(allCategories);
}

async function loadHomePage() {
    await Promise.all([
        loadBestMovie(),
        loadBestMoviesFromAllGenres(),
        loadMoviesFromCategory("category1", "Adventure"),
        loadMoviesFromCategory("category2", "Sci-Fi"),
        loadAllOthersCategories()
    ]);
}

async function safeLoad(fn) {
    try {
        await fn();
    } catch (e) {
        console.error("LOADING ERROR:", e);
    }
}

window.addEventListener("load", async () => {
    await safeLoad(loadHomePage);
    document.body.style.visibility = "visible";
});
