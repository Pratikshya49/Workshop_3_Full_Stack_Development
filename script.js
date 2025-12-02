const API_URL = 'http://localhost:3000/movies';

const movieListDiv = document.getElementById('movie-list');
const searchInput = document.getElementById('search-input');
const form = document.getElementById('add-movie-form');
let allMovies = []; // Stores the full, unfiltered list of movies

// Function to render movies
function renderMovies(moviesToDisplay) {
    movieListDiv.innerHTML = '';
    if (moviesToDisplay.length === 0) {
        movieListDiv.innerHTML = '<p>No movies found matching your criteria.</p>';
        return;
    }
    moviesToDisplay.forEach(movie => {
        const movieElement = document.createElement('div');
        movieElement.classList.add('movie-item');
        movieElement.innerHTML = `
            <p><strong>${movie.title}</strong> (${movie.year}) - ${movie.genre}</p>
            <button onclick="editMoviePrompt('${movie.id}', '${movie.title}', ${movie.year}, '${movie.genre}')">Edit</button>
            <button onclick="deleteMovie('${movie.id}')">Delete</button>
        `;
        movieListDiv.appendChild(movieElement);
    });
}

// Function to fetch all movies (READ)
function fetchMovies() {
    fetch(API_URL)
        .then(response => response.json())
        .then(movies => {
            allMovies = movies; // Store full list
            renderMovies(allMovies); // Display movies
        })
        .catch(error => console.error('Error fetching movies:', error));
}

// Search Functionality
searchInput.addEventListener('input', function() {
    const searchTerm = searchInput.value.toLowerCase();

    const filteredMovies = allMovies.filter(movie => {
        const titleMatch = movie.title.toLowerCase().includes(searchTerm);
        const genreMatch = movie.genre.toLowerCase().includes(searchTerm);
        return titleMatch || genreMatch;
    });

    renderMovies(filteredMovies); // Display filtered results
});

// CREATE Operation (POST)
form.addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent page reload

    const newMovie = {
        title: document.getElementById('title').value,
        genre: document.getElementById('genre').value,
        year: parseInt(document.getElementById('year').value)
    };

    fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newMovie),
    })
    .then(response => {
        if (!response.ok) throw new Error('Failed to add movie');
        return response.json();
    })
    .then(() => {
        this.reset();     // Clear the form
        fetchMovies();    // Refresh the movie list
    })
    .catch(error => console.error('Error adding movie:', error));
});

// UPDATE Operation (PUT)
function editMoviePrompt(id, currentTitle, currentYear, currentGenre) {
    const newTitle = prompt('Enter new Title:', currentTitle);
    const newYearStr = prompt('Enter new Year:', currentYear);
    const newGenre = prompt('Enter new Genre:', currentGenre);

    if (newTitle && newYearStr && newGenre) {
        const updatedMovie = {
            id: id,
            title: newTitle,
            year: parseInt(newYearStr),
            genre: newGenre
        };
        updateMovie(id, updatedMovie);
    }
}

//Function to send PUT request 
function updateMovie(movieId, updatedMovieData) {
    fetch(`${API_URL}/${movieId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedMovieData),
    })
    .then(response => {
        if (!response.ok) throw new Error('Failed to update movie');
        return response.json();
    })
    .then(() => {
        fetchMovies(); // Refresh the list after update
    })
    .catch(error => console.error('Error updating movie:', error));
}

// DELETE Operation (DELETE)
function deleteMovie(movieId) {
    fetch(`${API_URL}/${movieId}`, {
        method: 'DELETE',
    })
    .then(response => {
        if (!response.ok) throw new Error('Failed to delete movie');
        fetchMovies(); // Refresh list after deletion
    })
    .catch(error => console.error('Error deleting movie:', error));
}

// Initial load
fetchMovies();