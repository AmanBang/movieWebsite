import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaPlay,
  FaInfoCircle,
  FaStar,
  FaChevronLeft,
  FaCalendarAlt,
  FaClock,
  FaChevronDown
} from 'react-icons/fa';
import Link from 'next/link';

export default function SeriesDetail() {
  const router = useRouter();
  const { id } = router.query;
  const [series, setSeries] = useState(null);
  const [seasons, setSeasons] = useState([]);
  const [selectedSeason, setSelectedSeason] = useState(1);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showFullOverview, setShowFullOverview] = useState(false);

  useEffect(() => {
    if (id) {
      fetchSeriesDetails();
      fetchSeasonDetails(selectedSeason);
    }
  }, [id, selectedSeason]);

  const fetchSeriesDetails = async () => {
    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/tv/${id}?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}`
      );
      if (!response.ok) throw new Error('Failed to fetch series details');
      const data = await response.json();
      setSeries(data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const fetchSeasonDetails = async (seasonNumber) => {
    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/tv/${id}/season/${seasonNumber}?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}`
      );
      if (!response.ok) throw new Error('Failed to fetch season details');
      const data = await response.json();
      setSeasons(prevSeasons => ({
        ...prevSeasons,
        [seasonNumber]: data.episodes
      }));
    } catch (err) {
      setError(err.message);
    }
  };

    // Add this function inside the component
    const handleEpisodeClick = (episodeNumber) => {
      router.push(`/watch/series/${id}/${selectedSeason}/${episodeNumber}`);
    };

  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-gray-900">
        <div className="loader-ring"></div>
      </div>
    );
  }

  if (error || !series) {
    return (
      <div className="error-state">
        <h2>{error || 'Series not found'}</h2>
        <button onClick={() => router.back()}>Go Back</button>
      </div>
    );
  }

  return (
    <div className="series-container">
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"></meta>
      {/* Hero Section */}
      <section className="hero">
        <motion.div
          className="hero-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{
            backgroundImage: `url(https://image.tmdb.org/t/p/original${series.backdrop_path})`
          }}
        >
          <div className="hero-gradient" />
        </motion.div>

        <nav className="navigation">
          <motion.button
            className="back-btn"
            whileHover={{ x: -5 }}
            onClick={() => router.back()}
          >
            <FaChevronLeft /> Back
          </motion.button>
        </nav>

        <div className="hero-content">
          <motion.div
            className="poster-wrapper"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
          >
            <img
              src={`https://image.tmdb.org/t/p/w500${series.poster_path}`}
              alt={series.name}
              className="poster"
            />
          </motion.div>

          <motion.div
            className="series-info"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <h1>{series.name}</h1>

            <div className="meta-info">
              <span className="rating">
                <FaStar className="star" />
                {series.vote_average?.toFixed(1)}
              </span>
              <span className="divider">•</span>
              <span>{series.first_air_date?.split('-')[0]}</span>
              <span className="divider">•</span>
              <span>{series.number_of_seasons} Seasons</span>
            </div>

            <motion.div
              className="overview"
              animate={{ height: showFullOverview ? 'auto' : '80px' }}
            >
              <p>{series.overview}</p>
              <button
                className="read-more"
                onClick={() => setShowFullOverview(!showFullOverview)}
              >
                <FaChevronDown
                  className={`icon ${showFullOverview ? 'rotate-180' : ''}`}
                />
              </button>
            </motion.div>

            <div className="action-buttons">
              <button className="primary-btn">
                <FaPlay /> Watch Now
              </button>
              <button className="secondary-btn">
                <FaInfoCircle /> More Info
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Episodes Section */}
      <section className="episodes-section">
        <div className="season-selector">
          <h2>Episodes</h2>
          <div className="selector-wrapper">
            <select
              value={selectedSeason}
              onChange={(e) => setSelectedSeason(Number(e.target.value))}
            >
              {Array.from({ length: series.number_of_seasons }, (_, i) => (
                <option key={i + 1} value={i + 1}>
                  Season {i + 1}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="episodes-grid">  {/* Removed motion.div and layout */}
          <AnimatePresence mode="wait">
            {seasons[selectedSeason]?.map((episode) => (
              <motion.article
                key={episode.id}
                className="episode-card"
                layout  // Keep layout on the individual cards
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                whileHover={{ scale: 1.02 }}
                onClick={() => handleEpisodeClick(episode.episode_number)}
                style={{ cursor: 'pointer' }} // Add this to show it's clickable
              >
                <div className="episode-media">
                  <div className="episode-thumbnail">
                    <img
                      src={episode.still_path
                        ? `https://image.tmdb.org/t/p/w500${episode.still_path}`
                        : '/placeholder.jpg'}
                      alt={episode.name}
                      loading="lazy"
                    />
                    <div className="episode-overlay">
                      <button className="play-button">
                        <FaPlay className="play-icon" />
                      </button>
                    </div>
                  </div>
                  <div className="episode-badge">
                    Episode {episode.episode_number}
                  </div>
                </div>

                <div className="episode-content">
                  <div className="episode-header">
                    <h3>{episode.name}</h3>
                    <div className="episode-rating">
                      <FaStar />
                      <span>{episode.vote_average?.toFixed(1)}</span>
                    </div>
                  </div>

                  <p className="episode-overview">{episode.overview}</p>

                  <div className="episode-metadata">
                    <span>
                      <FaCalendarAlt />
                      {episode.air_date || 'TBA'}
                    </span>
                    <span>
                      <FaClock />
                      {episode.runtime || 'N/A'} min
                    </span>
                  </div>
                </div>
              </motion.article>
            ))}
          </AnimatePresence>
        </div>
      </section>

      <style jsx global>{`
      /* Add global for motion components */
      .episode-card {
        background: rgba(255, 255, 255, 0.05);
        border-radius: 16px;
        overflow: hidden;
        transition: all 0.3s ease;
        height: 100%;
        display: flex;
        flex-direction: column;
      }
    `}</style>
      <style jsx>{`
        /* Container & Global Styles */
        .series-container {
          min-height: 100vh;
          background: #0a0a0a;
          color: #fff;
        }

        /* Loading & Error States */
        .loader-ring {
          width: 50px;
          height: 50px;
          border: 4px solid rgba(255, 255, 255, 0.1);
          border-top-color: #e50914;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        .error-state {
          height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 1rem;
          color: #fff;
        }

        /* Hero Section */
        .hero {
          position: relative;
          height: 100vh;
          overflow: hidden;
        }

        .hero-backdrop {
          position: absolute;
          inset: 0;
          background-size: cover;
          background-position: center;
          filter: brightness(0.5);
        }

        .hero-gradient {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            0deg,
            rgba(10, 10, 10, 1) 0%,
            rgba(10, 10, 10, 0.8) 50%,
            rgba(10, 10, 10, 0.4) 100%
          );
        }

        .navigation {
          position: fixed;
          top: 2rem;
          left: 2rem;
          z-index: 10;
        }

        .back-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1.5rem;
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          border: none;
          border-radius: 50px;
          color: #fff;
          font-size: 1rem;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .back-btn:hover {
          background: rgba(255, 255, 255, 0.2);
        }

        .hero-content {
          position: relative;
          max-width: 1400px;
          margin: 0 auto;
          padding: 0 2rem;
          height: 100%;
          display: grid;
          grid-template-columns: 350px 1fr;
          gap: 4rem;
          align-items: center;
        }

        /* Poster & Series Info */
        .poster-wrapper {
          position: relative;
        }

        .poster {
          width: 100%;
          border-radius: 16px;
          box-shadow: 0 8px 30px rgba(0, 0, 0, 0.5);
          transition: transform 0.3s ease;
        }

        .series-info {
          max-width: 800px;
        }

        .series-info h1 {
          font-size: 4rem;
          font-weight: 700;
          margin-bottom: 1.5rem;
          line-height: 1.1;
          background: linear-gradient(45deg, #fff, #888);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .meta-info {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 2rem;
          font-size: 1.1rem;
        }

        .rating {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: #ffd700;
        }

        .divider {
          color: rgba(255, 255, 255, 0.3);
        }

        /* Overview Section */
        .overview {
          position: relative;
          margin-bottom: 2rem;
          overflow: hidden;
        }

        .overview p {
          font-size: 1.1rem;
          line-height: 1.6;
          color: rgba(255, 255, 255, 0.8);
        }

        .read-more {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          padding: 2rem 0 0;
          background: linear-gradient(
            to top,
            rgba(10, 10, 10, 1) 0%,
            rgba(10, 10, 10, 0) 100%
          );
          border: none;
          color: #fff;
          cursor: pointer;
          display: flex;
          justify-content: center;
        }

        /* Action Buttons */
        .action-buttons {
          display: flex;
          gap: 1rem;
        }

        .primary-btn,
        .secondary-btn {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 1rem 2rem;
          border-radius: 50px;
          font-size: 1.1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .primary-btn {
          background: #e50914;
          color: #fff;
          border: none;
        }

        .primary-btn:hover {
          background: #f40d18;
          transform: translateY(-2px);
        }

        .secondary-btn {
          background: rgba(255, 255, 255, 0.1);
          color: #fff;
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .secondary-btn:hover {
          background: rgba(255, 255, 255, 0.2);
          transform: translateY(-2px);
        }

        .season-selector {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 3rem;
          padding: 0 1rem;
        }

        .season-selector h2 {
          font-size: 2rem;
          font-weight: 600;
        }

        .selector-wrapper {
          position: relative;
        }

        .selector-wrapper select {
          appearance: none;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: white;
          padding: 0.75rem 3rem 0.75rem 1.5rem;
          border-radius: 12px;
          font-size: 1rem;
          cursor: pointer;
          transition: all 0.3s ease;
          min-width: 150px;
        }

        .selector-wrapper::after {
          content: '';
          position: absolute;
          right: 1rem;
          top: 50%;
          transform: translateY(-50%);
          border-left: 5px solid transparent;
          border-right: 5px solid transparent;
          border-top: 5px solid white;
          pointer-events: none;
        }

          /* Episodes Grid */
        .episodes-grid {
          display: grid;
          gap: 2rem;
          grid-template-columns: 1fr;  /* Start with one column */
          width: 100%; /* Use full width */
          margin: 0 auto;
          padding: 0 1rem; /* Add some padding */
          box-sizing: border-box; /* Include padding in the width */
        }

        .episode-card {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 16px;
          overflow: hidden;
          transition: all 0.3s ease;
          height: 100%;
          display: flex;
          flex-direction: column;
        }

        .episode-card:hover {
          transform: translateY(-5px);
          background: rgba(255, 255, 255, 0.08);
        }

        .episode-media {
          position: relative;
        }

        .episode-thumbnail {
          position: relative;
          aspect-ratio: 16/9;
          overflow: hidden;
        }

        .episode-thumbnail img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.3s ease;
        }

        .episode-card:hover .episode-thumbnail img {
          transform: scale(1.05);
        }

        .episode-overlay {
          position: absolute;
          inset: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .episode-card:hover .episode-overlay {
          opacity: 1;
        }

        .play-button {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          background: rgba(229, 9, 20, 0.9);
          border: none;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: transform 0.2s ease;
        }

        .play-button:hover {
          transform: scale(1.1);
        }

        .episode-badge {
          position: absolute;
          top: 1rem;
          left: 1rem;
          background: rgba(0, 0, 0, 0.75);
          padding: 0.5rem 1rem;
          border-radius: 8px;
          font-size: 0.875rem;
          backdrop-filter: blur(4px);
        }

        .episode-content {
          padding: 1.5rem;
          flex: 1;
          display: flex;
          flex-direction: column;
        }

        .episode-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 1rem;
          margin-bottom: 1rem;
        }

        .episode-header h3 {
          font-size: 1.125rem;
          font-weight: 600;
          margin: 0;
          line-height: 1.4;
          flex: 1;
        }

        .episode-rating {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: #ffd700;
          font-weight: 600;
        }

        .episode-overview {
          color: rgba(255, 255, 255, 0.7);
          font-size: 0.875rem;
          line-height: 1.6;
          margin: 0 0 1.5rem;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
          flex: 1;
        }

        .episode-metadata {
          display: flex;
          justify-content: space-between;
          padding-top: 1rem;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          font-size: 0.875rem;
          color: rgba(255, 255, 255, 0.5);
        }

        .episode-metadata span {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        /* Responsive grid breakpoints */
        @media screen and (min-width: 640px) {
          .episodes-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }

        @media screen and (min-width: 1024px) {
          .episodes-grid {
            grid-template-columns: repeat(3, minmax(0, 1fr));
          }
        }

        @media screen and (min-width: 1440px) {
          .episodes-grid {
            grid-template-columns: repeat(4, minmax(0, 1fr));
          }
        }

        @media screen and (min-width: 1800px) {
          .episodes-grid {
            grid-template-columns: repeat(5, minmax(0, 1fr));
          }
        }

          @media (max-width: 1024px) {
          .hero-content {
            grid-template-columns: 1fr;
            gap: 2rem;
            align-content: center;
          }

          .poster-wrapper {
            max-width: 300px;
            margin: 0 auto;
          }

          .series-info h1 {
            font-size: 3rem;
            text-align: center;
          }

          .meta-info {
            justify-content: center;
          }

          .action-buttons {
            justify-content: center;
          }
        }

        @media (max-width: 768px) {
          .series-info h1 {
            font-size: 2.5rem;
          }

          .action-buttons {
            flex-direction: column;
          }
        }


          @media (max-width: 480px) {

          .season-selector {
            flex-direction: column;
            gap: 1rem;
            align-items: flex-start;
          }

          .episode-content {
            padding: 1rem;
          }

          .episode-header h3 {
            font-size: 1rem;
          }

          .hero-content {
            padding: 0 1rem;
          }
            /* Reduce padding on smaller screens */
          .episodes-section {
            padding: 2rem 1rem;
          }
        }

        .episodes-section {
              /* Remove max-width */
              /* max-width: 2000px;  */
              margin: 0 auto;
              padding: 4rem 2rem; /*Keep padding, adjust as needed */
              box-sizing: border-box;
          }

      `}</style>
    </div>
  );
}