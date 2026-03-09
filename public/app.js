let currentView = 'monstruos'; // or 'pokemon'
let allData = [];

// DOM Elements
const navBtns = document.querySelectorAll('.nav-btn');
const inputSearch = document.getElementById('searchInput');
const resetBtn = document.getElementById('resetBtn');
const dataGrid = document.getElementById('dataGrid');
const resultsCount = document.getElementById('resultsCount');

// Monster specific filters
const movieFilters = document.getElementById('movieFilters');
const weaknessInput = document.getElementById('weaknessInput');

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
if(weaknessInput) weaknessInput.addEventListener('input', renderData);
resetBtn.addEventListener('click', () => {
    inputSearch.value = '';
    if(weaknessInput) weaknessInput.value = '';
    renderData();
});

function updateUIForView() {
    const title = document.getElementById('view-title');
    const subtitle = document.getElementById('view-subtitle');

    // Theme switching
    document.body.classList.remove('theme-monstruos', 'theme-pokemon');

    if (currentView === 'monstruos') {
        document.body.classList.add('theme-monstruos');
        title.innerText = 'Monster Hunter';
        subtitle.innerText = 'Explora y descubre debilidades del ecosistema.';
        movieFilters.style.display = 'flex';
        inputSearch.placeholder = 'Ej: Rathalos, Wyvern...';
        if (window.location.pathname !== '/monstruos') {
            window.history.pushState({}, '', '/monstruos');
        }
    } else {
        document.body.classList.add('theme-pokemon');
        title.innerText = 'Pokémon';
        subtitle.innerText = 'Pokedex completa con estadísticas de combate.';
        movieFilters.style.display = 'none';
        inputSearch.placeholder = 'Ej: Pikachu, Charizard...';
        if(weaknessInput) weaknessInput.value = '';
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

        // Load images for monsters
        if (currentView === 'monstruos') {
            resultsCount.innerText = 'Cargando ecosistema...';
            allData.forEach(monster => {
                // Placeholder images based on element/species if a real API isn't available
                monster.posterUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(monster.name)}&background=2b2b2b&color=f2e3c6&size=400&font-size=0.25&length=3`;
            });
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
        if (currentView === 'monstruos') {
            const matchesSearch = item.name.toLowerCase().includes(search) || item.species.toLowerCase().includes(search);
            const weakness = weaknessInput ? weaknessInput.value.toLowerCase() : '';
            const matchesWeakness = weakness ? item.weakness.toLowerCase().includes(weakness) : true;
            return matchesSearch && matchesWeakness;
        } else {
            return item.name.toLowerCase().includes(search) || item.type.toLowerCase().includes(search);
        }
    });

    resultsCount.innerText = `Mostrando ${filtered.length} ${currentView}`;

    dataGrid.innerHTML = filtered.map(item => {
        if (currentView === 'monstruos') {
            const monsterPoster = item.posterUrl;

            return `
                <div class="card card-with-image">
                    <div class="card-image-container">
                        <img src="${monsterPoster}" alt="${item.name}" class="card-image">
                    </div>
                    <div class="card-content">
                        <h3 class="card-title">${item.name}</h3>
                        <div class="card-info">
                            <div class="info-row">
                                <span class="info-label">Especie</span>
                                <span class="info-value">${item.species}</span>
                            </div>
                            <div class="info-row">
                                <span class="info-label">Elemento</span>
                                <span class="badge" style="background: var(--accent); color: #fff;">${item.element}</span>
                            </div>
                            <div class="info-row">
                                <span class="info-label">Debilidad</span>
                                <span class="info-value">💥 ${item.weakness}</span>
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
