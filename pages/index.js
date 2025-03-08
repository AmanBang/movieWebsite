import { useState } from 'react';
import SearchBar from '../components/SearchBar';
import MovieCard from '../components/MovieCard';
import SeriesCard from '../components/SeriesCard';
import styles from '../styles/Home.module.css';
import { Analytics } from "@vercel/analytics/react"
export default function Home() {
  const [activeTab, setActiveTab] = useState('movies');
  const [movies, setMovies] = useState([]);
  const [series, setSeries] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async (query) => {
    setIsLoading(true);
    setError(null);
    try {
      const endpoint = activeTab === 'movies' ? 'search' : 'search-series';
      const res = await fetch(`/api/${endpoint}?query=${encodeURIComponent(query)}`);
      if (!res.ok) throw new Error(`Failed to fetch ${activeTab}`);
      const data = await res.json();
      if (activeTab === 'movies') {
        setMovies(data);
        setSeries([]);
      } else {
        setSeries(data);
        setMovies([]);
      }
    } catch (err) {
      setError(err.message);
      setMovies([]);
      setSeries([]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>Moviegram</h1>
      </header>
      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${activeTab === 'movies' ? styles.active : ''}`}
          onClick={() => setActiveTab('movies')}
        >
          Movies
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'series' ? styles.active : ''}`}
          onClick={() => setActiveTab('series')}
        >
          TV Series
        </button>
      </div>
      <SearchBar onSearch={handleSearch} />
      {isLoading && <p className={styles.loading}>Loading...</p>}
      {error && <p className={styles.error}>Error: {error}</p>}
      {!isLoading && !error && movies.length === 0 && series.length === 0 && (
        <p className={styles.loading}>Search for {activeTab} to explore!</p>
      )}
      <div className={styles.movieGrid}>
        {activeTab === 'movies' &&
          movies.map((movie) => <MovieCard key={movie.id} movie={movie} />)}
        {activeTab === 'series' &&
          series.map((show) => <SeriesCard key={show.id} series={show} />)}
      </div>
    </div>
  );
}