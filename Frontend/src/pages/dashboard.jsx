import { useState } from 'react';
import {
  getCurrentWeather,
  getAIRecommendation
} from '../services/api';

import FavoriteList from '../components/favouriteList';
import Forecast from '../components/Forecast';

function Dashboard({ user, onLogout }) {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState(null);
  const [aiRecommendation, setAiRecommendation] = useState('');

  const [error, setError] = useState('');
  const [aiError, setAiError] = useState('');

  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);

  const handleSearch = async (event) => {
    event.preventDefault();

    if (!city.trim()) {
      setError('Please enter a city name');
      return;
    }

    try {
      setLoading(true);
      setError('');
      setAiError('');
      setWeather(null);
      setAiRecommendation('');

      const response = await getCurrentWeather(city.trim());

      setWeather(response.data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAIRecommendation = async () => {
    if (!weather) {
      setAiError('Search for a city first');
      return;
    }

    try {
      setAiLoading(true);
      setAiError('');
      setAiRecommendation('');

      const response = await getAIRecommendation(weather.city);

      setAiRecommendation(response.recommendation);
    } catch (error) {
      setAiError(error.message);
    } finally {
      setAiLoading(false);
    }
  };

  const handleFavoriteCitySelect = async (favoriteCity) => {
    setCity(favoriteCity);

    try {
      setLoading(true);
      setError('');
      setAiError('');
      setWeather(null);
      setAiRecommendation('');

      const response = await getCurrentWeather(favoriteCity);

      setWeather(response.data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard">

      <header className="dashboard-header">
        <div>
          <h1>AI WeatherWise</h1>
          <p>Welcome, {user?.name}</p>
        </div>

        <button onClick={onLogout}>
          Logout
        </button>
      </header>

      <main className="dashboard-content">

        <h2>Check Current Weather</h2>

        <form
          onSubmit={handleSearch}
          className="weather-search"
        >
          <input
            type="text"
            placeholder="Enter city name"
            value={city}
            onChange={(event) => setCity(event.target.value)}
          />

          <button
            type="submit"
            disabled={loading}
          >
            {loading ? 'Searching...' : 'Search'}
          </button>
        </form>

        {error && (
          <p className="error-message">
            {error}
          </p>
        )}

        {weather && (
          <div className="weather-card">

            <h2>
              {weather.city}, {weather.country}
            </h2>

            <p className="temperature">
              {weather.temperature}°C
            </p>

            <p>
              Condition: {weather.condition}
            </p>

            <p>
              {weather.description}
            </p>

            <div className="weather-details">

              <p>
                Feels like: {weather.feelsLike}°C
              </p>

              <p>
                Humidity: {weather.humidity}%
              </p>

              <p>
                Pressure: {weather.pressure} hPa
              </p>

              <p>
                Wind Speed: {weather.windSpeed} m/s
              </p>

            </div>

            <button
              className="ai-button"
              onClick={handleAIRecommendation}
              disabled={aiLoading}
            >
              {aiLoading
                ? 'Getting AI Recommendation...'
                : 'Get AI Recommendation'}
            </button>

          </div>
        )}

        {aiError && (
          <p className="error-message">
            {aiError}
          </p>
        )}

        {aiRecommendation && (
          <div className="ai-card">

            <h2>🤖 AI Weather Recommendation</h2>

            <div className="ai-recommendation">
              {aiRecommendation.split('\n').map((line, index) => (
                <p key={index}>
                  {line || '\u00A0'}
                </p>
              ))}
            </div>

          </div>
        )}

        {/* 5-Day Forecast */}

        <Forecast city={weather?.city || city.trim()} />

        <FavoriteList
          weather={weather}
          onCitySelect={handleFavoriteCitySelect}
        />

      </main>
    </div>
  );
}

export default Dashboard;