let currentView = 'peliculas'; // or 'pokemon'
let allData = [];

// DOM Elements
const navBtns = document.querySelectorAll('.nav-btn');
const inputSearch = document.getElementById('searchInput');
const resetBtn = document.getElementById('resetBtn');
const dataGrid = document.getElementById('dataGrid');
const resultsCount = document.getElementById('resultsCount');

// Movie specific filters
const movieFilters = document.getElementById('movieFilters');
const minYearInput = document.getElementById('minYear');
const maxYearInput = document.getElementById('maxYear');

// Event Listeners
navBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        navBtns.forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
        currentView = e.target.dataset.view;
        updateUIForView();
        fetchData();
    });
});

inputSearch.addEventListener('input', renderData);
minYearInput.addEventListener('input', renderData);
maxYearInput.addEventListener('input', renderData);
resetBtn.addEventListener('click', () => {
    inputSearch.value = '';
    minYearInput.value = '';
    maxYearInput.value = '';
    renderData();
});

function updateUIForView() {
    const title = document.getElementById('view-title');
    const subtitle = document.getElementById('view-subtitle');

    // Theme switching
    document.body.classList.remove('theme-peliculas', 'theme-pokemon');

    if (currentView === 'peliculas') {
        document.body.classList.add('theme-peliculas');
        title.innerText = 'Películas';
        subtitle.innerText = 'Explora y gestiona el catálogo cinematográfico.';
        movieFilters.style.display = 'flex';
        inputSearch.placeholder = 'Ej: Matrix, El Padrino...';
        if (window.location.pathname !== '/peliculas') {
            window.history.pushState({}, '', '/peliculas');
        }
    } else {
        document.body.classList.add('theme-pokemon');
        title.innerText = 'Pokémon';
        subtitle.innerText = 'Pokedex completa con estadísticas de combate.';
        movieFilters.style.display = 'none';
        inputSearch.placeholder = 'Ej: Pikachu, Charizard...';
        minYearInput.value = '';
        maxYearInput.value = '';
        if (window.location.pathname !== '/pokemon') {
            window.history.pushState({}, '', '/pokemon');
        }
    }
}

async function fetchData() {
    dataGrid.innerHTML = '';
    resultsCount.innerText = 'Cargando datos...';
    try {
        const response = await fetch(`/api/${currentView}`);
        if (!response.ok) throw new Error('Network error');
        allData = await response.json();

        // Load real movie posters asynchronously
        if (currentView === 'peliculas') {
            resultsCount.innerText = 'Cargando portadas de películas...';
            await Promise.all(allData.map(async (movie) => {
                try {
                    const searchUrl = `https://itunes.apple.com/search?term=${encodeURIComponent(movie.title)}&entity=movie&limit=1`;
                    const res = await fetch(searchUrl);
                    const data = await res.json();
                    if (data.results && data.results.length > 0) {
                        // Replace 100x100 with a larger resolution like 600x900
                        movie.posterUrl = data.results[0].artworkUrl100.replace('100x100bb', '600x900bb');
                    } else {
                        // Fallback image
                        movie.posterUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(movie.title)}&background=random&color=fff&size=400&font-size=0.33`;
                    }
                } catch (e) {
                    movie.posterUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(movie.title)}&background=random&color=fff&size=400&font-size=0.33`;
                }
            }));
        }

        renderData();
    } catch (error) {
        resultsCount.innerText = 'Error cargando los datos.';
        console.error('Fetch error:', error);
    }
}

function renderData() {
    const search = inputSearch.value.toLowerCase();

    let filtered = allData.filter(item => {
        if (currentView === 'peliculas') {
            const matchesSearch = item.title.toLowerCase().includes(search) || item.director.toLowerCase().includes(search);
            const minYear = minYearInput.value ? parseInt(minYearInput.value) : 0;
            const maxYear = maxYearInput.value ? parseInt(maxYearInput.value) : 9999;
            const matchesYear = item.year >= minYear && item.year <= maxYear;
            return matchesSearch && matchesYear;
        } else {
            return item.name.toLowerCase().includes(search) || item.type.toLowerCase().includes(search);
        }
    });

    resultsCount.innerText = `Mostrando ${filtered.length} ${currentView}`;

    dataGrid.innerHTML = filtered.map(item => {
        if (currentView === 'peliculas') {
            // Using the real poster URL fetched during load
            const moviePoster = item.posterUrl;

            return `
                <div class="card card-with-image">
                    <div class="card-image-container">
                        <img src="${moviePoster}" alt="Poster de ${item.title}" class="card-image">
                    </div>
                    <div class="card-content">
                        <h3 class="card-title">${item.title}</h3>
                        <div class="card-info">
                            <div class="info-row">
                                <span class="info-label">Director</span>
                                <span class="info-value">${item.director}</span>
                            </div>
                            <div class="info-row">
                                <span class="info-label">Estreno</span>
                                <span class="info-value">${item.year}</span>
                            </div>
                            <div class="info-row">
                                <span class="info-label">Duración</span>
                                <span class="info-value">${item.length_minutes} min</span>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        } else {
            // Pokémon Card with official artwork from PokeAPI
            const pokemonNameLower = item.name.toLowerCase();
            const pokemonImage = `https://img.pokemondb.net/sprites/home/normal/${pokemonNameLower}.png`;

            const maxStat = 255; // For progress bars
            return `
                <div class="card card-with-image">
                    <div class="pokemon-image-container" style="background: ${getPokemonColor(item.type).split(';')[0]}">
                        <img src="${pokemonImage}" alt="${item.name}" class="pokemon-image" onerror="this.src='https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/0.png'">
                    </div>
                    <div class="card-content">
                        <div class="info-row" style="margin-bottom: 1.25rem;">
                            <h3 class="card-title" style="margin-bottom:0; border:none; padding:0;">${item.name}</h3>
                            <span class="badge" style="background: ${getPokemonColor(item.type)}">${item.type}</span>
                        </div>
                        <div class="pokemon-stats">
                            <div class="stat-item">
                                <span class="stat-label">HP (${item.hp})</span>
                                <div class="stat-bar"><div class="stat-fill" style="width: ${(item.hp / maxStat) * 100}%; background: #10B981;"></div></div>
                            </div>
                            <div class="stat-item">
                                <span class="stat-label">SPD (${item.speed})</span>
                                <div class="stat-bar"><div class="stat-fill" style="width: ${(item.speed / maxStat) * 100}%; background: #F59E0B;"></div></div>
                            </div>
                            <div class="stat-item">
                                <span class="stat-label">ATK (${item.attack})</span>
                                <div class="stat-bar"><div class="stat-fill" style="width: ${(item.attack / maxStat) * 100}%; background: #EF4444;"></div></div>
                            </div>
                            <div class="stat-item">
                                <span class="stat-label">DEF (${item.defense})</span>
                                <div class="stat-bar"><div class="stat-fill" style="width: ${(item.defense / maxStat) * 100}%; background: #3B82F6;"></div></div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }
    }).join('');
}

function getPokemonColor(type) {
    const colors = {
        'Fuego': '#fee2e2; color: #ef4444',
        'Agua': '#dbeafe; color: #3b82f6',
        'Planta': '#d1fae5; color: #10b981',
        'Eléctrico': '#fef3c7; color: #d97706',
        'Normal': '#f1f5f9; color: #64748b'
    };
    // Default or matched color
    return colors[type] || '#e0e7ff; color: #4f46e5';
}

// Initial load
if (window.location.pathname === '/pokemon') {
    currentView = 'pokemon';
    navBtns[1].classList.remove('active'); // Monstruos
    navBtns[0].classList.add('active');    // Pokémon
}
updateUIForView();
fetchData();
