import { useEffect, useState } from 'react';
import {
  getFavorites,
  addFavorite,
  deleteFavorite
} from '../services/api';

function FavoriteList({ weather, onCitySelect }) {
  const [favorites, setFavorites] = useState([]);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const loadFavorites = async () => {
    try {
      setError('');

      const response = await getFavorites();

      setFavorites(response.data || []);
    } catch (error) {
      setError(error.message);
    }
  };

  useEffect(() => {
    loadFavorites();
  }, []);

  const handleAddFavorite = async () => {
    if (!weather) {
      setError('Search for a city first');
      return;
    }

    try {
      setLoading(true);
      setError('');
      setMessage('');

      await addFavorite({
        city: weather.city,
        country: weather.country,
        latitude: weather.latitude,
        longitude: weather.longitude
      });

      setMessage('City added to favorites');

      await loadFavorites();
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteFavorite = async (id) => {
    try {
      setError('');

      await deleteFavorite(id);

      setMessage('Favorite removed');

      await loadFavorites();
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="favorites-section">
      <div className="favorites-header">
        <h2>Favorite Cities</h2>

        <button
          onClick={handleAddFavorite}
          disabled={!weather || loading}
        >
          {loading ? 'Adding...' : 'Add Current City'}
        </button>
      </div>

      {message && (
        <p className="success-message">
          {message}
        </p>
      )}

      {error && (
        <p className="error-message">
          {error}
        </p>
      )}

      {favorites.length === 0 ? (
        <p>No favorite cities yet.</p>
      ) : (
        <div className="favorite-list">
          {favorites.map((favorite) => (
            <div
              className="favorite-item"
              key={favorite._id}
            >
              <button
                className="favorite-city"
                onClick={() => onCitySelect(favorite.city)}
              >
                {favorite.city}, {favorite.country}
              </button>

              <button
                className="delete-button"
                onClick={() => handleDeleteFavorite(favorite._id)}
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default FavoriteList;