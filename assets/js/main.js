async function loadOthersCategories(categories) {
    await renderOthersCategorySection(categories)
}

async function loadBestMovie() {
    const bestMovie = await getBestMovie();
    renderBestMovie(bestMovie);
}

async function loadBestMoviesFromAllGenres() {
    const bestMoviesFromAllGenres = await getBestMoviesFromAllGenres();
    renderMoviesSection("bestMoviesSection", "Films les mieux notés", bestMoviesFromAllGenres);
}

async function loadMoviesFromCategory(section, category) {
    const moviesFromCategory = await getBestMoviesFromCategory(category);
    renderMoviesSection(section + "Section", category, moviesFromCategory);
}

async function loadAllOthersCategories() {
    const allCategories = await getAllCategories();
    await loadOthersCategories(allCategories);
}

async function loadHomePage() {
    await Promise.all([
        loadBestMovie(),
        loadBestMoviesFromAllGenres(),
        loadMoviesFromCategory("category1", "Thriller"),
        loadMoviesFromCategory("category2", "Animation"),
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
