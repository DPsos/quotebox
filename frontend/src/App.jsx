import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [movies, setMovies] = useState([]);
  const [title, setTitle] = useState('');
  const [genre, setGenre] = useState('Драма');
  const [rating, setRating] = useState(5);

  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    const res = await fetch('http://localhost:5000/api/movies');
    const data = await res.json();
    setMovies(data);
  };

  const addMovie = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    await fetch('http://localhost:5000/api/movies', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, genre, rating: Number(rating) }),
    });

    setTitle('');
    setGenre('Драма');
    setRating(5);
    fetchMovies();
  };

  const updateStatus = async (id, status) => {
    const newStatus = status === 'want_to_watch' ? 'watched' : 'want_to_watch';
    await fetch(`http://localhost:5000/api/movies/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus }),
    });
    fetchMovies();
  };

  const deleteMovie = async (id) => {
    await fetch(`http://localhost:5000/api/movies/${id}`, {
      method: 'DELETE',
    });
    fetchMovies();
  };

  const getStatusText = (status) => {
    return status === 'watched' ? '✅ Просмотрено' : '🎬 Хочу посмотреть';
  };

  const getStatusColor = (status) => {
    return status === 'watched' ? '#4ade80' : '#f59e0b';
  };

  return (
    <div className="app">
      <h1> MovieTracker</h1>
      <p className="subtitle">Список просмотренных фильмов</p>

      <form onSubmit={addMovie} className="form">
        <input
          type="text"
          placeholder="Название фильма..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        
        <div className="form-row">
          <select value={genre} onChange={(e) => setGenre(e.target.value)}>
            <option value="Драма">🎭 Драма</option>
            <option value="Комедия">😄 Комедия</option>
            <option value="Боевик">💥 Боевик</option>
            <option value="Фантастика">🚀 Фантастика</option>
            <option value="Ужасы">👻 Ужасы</option>
            <option value="Другое">📌 Другое</option>
          </select>

          <input
            type="number"
            min="1"
            max="10"
            value={rating}
            onChange={(e) => setRating(e.target.value)}
            placeholder="Рейтинг (1-10)"
          />
        </div>

        <button type="submit">➕ Добавить фильм</button>
      </form>

      <div className="movies-list">
        {movies.map((movie) => (
          <div key={movie.id} className="movie-card">
            <div className="movie-header">
              <h3>{movie.title}</h3>
              <span 
                className="status-badge"
                style={{ backgroundColor: getStatusColor(movie.status) }}
              >
                {getStatusText(movie.status)}
              </span>
            </div>

            <div className="movie-info">
              <span className="genre">🎭 {movie.genre}</span>
              <span className="rating">⭐ {movie.rating}/10</span>
            </div>

            <div className="movie-actions">
              <button 
                onClick={() => updateStatus(movie.id, movie.status)}
                className="status-btn"
              >
                {movie.status === 'watched' ? '↩️ Вернуть в список' : '✅ Смотрел'}
              </button>
              <button 
                onClick={() => deleteMovie(movie.id)}
                className="delete-btn"
              >
                🗑️ Удалить
              </button>
            </div>
          </div>
        ))}
      </div>

      {movies.length === 0 && (
        <p className="empty">Нет фильмов. Добавь первый! 🎬</p>
      )}
    </div>
  );
}

export default App;