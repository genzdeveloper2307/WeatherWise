import { useState } from 'react';
import { getForecast } from '../services/api';

function Forecast({ city }) {
  const [forecast, setForecast] = useState([]);
  const [forecastCity, setForecastCity] = useState('');
  const [forecastCountry, setForecastCountry] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleForecast = async () => {
    if (!city) {
      setError('Search for a city first');
      return;
    }

    try {
      setLoading(true);
      setError('');

      const response = await getForecast(city);

      setForecast(response.data.forecast || []);
      setForecastCity(response.data.city);
      setForecastCountry(response.data.country);
    } catch (error) {
      setError(error.message);
      setForecast([]);
    } finally {
      setLoading(false);
    }
  };

  // Group 3-hour forecast data by date
  const groupedForecast = forecast.reduce((groups, item) => {
    const date = item.dateTime.split(' ')[0];

    if (!groups[date]) {
      groups[date] = [];
    }

    groups[date].push(item);

    return groups;
  }, {});

  // Create one summary card for each day
  const dailyForecast = Object.entries(groupedForecast)
    .slice(0, 5)
    .map(([date, items]) => {
      const temperatures = items.map((item) => item.temperature);

      const highestTemperature = Math.max(...temperatures);
      const lowestTemperature = Math.min(...temperatures);

      const highestRainProbability = Math.max(
        ...items.map((item) => item.rainProbability)
      );

      const averageHumidity = Math.round(
        items.reduce(
          (total, item) => total + item.humidity,
          0
        ) / items.length
      );

      const averageWindSpeed = (
        items.reduce(
          (total, item) => total + item.windSpeed,
          0
        ) / items.length
      ).toFixed(1);

      const mainCondition = items[Math.floor(items.length / 2)];

      return {
        date,
        highestTemperature,
        lowestTemperature,
        highestRainProbability,
        averageHumidity,
        averageWindSpeed,
        condition: mainCondition.condition,
        description: mainCondition.description
      };
    });

  const formatDate = (dateString) => {
    const date = new Date(`${dateString}T00:00:00`);

    return date.toLocaleDateString('en-IN', {
      weekday: 'short',
      day: 'numeric',
      month: 'short'
    });
  };

  return (
    <div className="forecast-section">

      <div className="forecast-header">
        <div>
          <h2>5-Day Weather Forecast</h2>

          <p>
            Plan your next few days with detailed weather
            information.
          </p>
        </div>

        <button
          className="forecast-button"
          onClick={handleForecast}
          disabled={!city || loading}
        >
          {loading ? 'Loading...' : 'View Forecast'}
        </button>
      </div>

      {error && (
        <p className="error-message">
          {error}
        </p>
      )}

      {dailyForecast.length > 0 && (
        <div className="forecast-container">

          <div className="forecast-location">
            <h3>
              {forecastCity}, {forecastCountry}
            </h3>
          </div>

          <div className="forecast-grid">

            {dailyForecast.map((day) => (
              <div
                className="forecast-card"
                key={day.date}
              >

                <div className="forecast-card-header">
                  <h3>
                    {formatDate(day.date)}
                  </h3>
                </div>

                <div className="forecast-icon">
                  {day.condition === 'Rain'
                    ? '🌧️'
                    : day.condition === 'Clouds'
                    ? '☁️'
                    : day.condition === 'Clear'
                    ? '☀️'
                    : '🌤️'}
                </div>

                <p className="forecast-condition">
                  {day.description}
                </p>

                <div className="forecast-temperature-range">
                  <span className="forecast-high">
                    {day.highestTemperature}°C
                  </span>

                  <span className="forecast-low">
                    {day.lowestTemperature}°C
                  </span>
                </div>

                <div className="forecast-details">

                  <div className="forecast-detail">
                    <span>🌧️</span>
                    <div>
                      <small>Rain</small>
                      <strong>
                        {day.highestRainProbability}%
                      </strong>
                    </div>
                  </div>

                  <div className="forecast-detail">
                    <span>💧</span>
                    <div>
                      <small>Humidity</small>
                      <strong>
                        {day.averageHumidity}%
                      </strong>
                    </div>
                  </div>

                  <div className="forecast-detail">
                    <span>💨</span>
                    <div>
                      <small>Wind</small>
                      <strong>
                        {day.averageWindSpeed} m/s
                      </strong>
                    </div>
                  </div>

                </div>

              </div>
            ))}

          </div>

        </div>
      )}

    </div>
  );
}

export default Forecast;