import { useRouter } from 'next/router';

export default function MovieCard({ movie }) {
    const router = useRouter();
    const imageUrl = movie.poster_path
      ? `https://image.tmdb.org/t/p/w300${movie.poster_path}`
      : '/placeholder.jpg';
  
    const handleClick = () => {
      router.push(`/movie/${movie.id}`);
    };
  
    return (
      <div className="movie-card" onClick={handleClick}>
        <img src={imageUrl} alt={movie.title} />
        <div className="content">
          <h3>{movie.title}</h3>
          <p>{movie.release_date?.split('-')[0] || 'N/A'}</p>
        </div>
        <div className="rating">
          <span>★ {movie.vote_average?.toFixed(1) || 'N/A'}</span>
        </div>
        <style jsx>{`
        .movie-card {
          position: relative;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          border-radius: 12px;
          overflow: hidden;
          background: linear-gradient(145deg, #1e1e1e, #2a2a2a);
          width: 100%;
          max-width: 300px;
          margin: 0 auto;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        .movie-card:hover {
          transform: translateY(-8px) scale(1.02);
          box-shadow: 0 12px 20px rgba(0, 0, 0, 0.2);
        }

        .movie-card img {
          width: 100%;
          height: auto;
          aspect-ratio: 2/3;
          object-fit: cover;
          transition: transform 0.3s ease;
        }

        .movie-card:hover img {
          transform: scale(1.05);
        }

        .content {
          padding: 16px;
          position: relative;
          background: linear-gradient(to top, rgba(26, 26, 26, 0.95), rgba(26, 26, 26, 0.8));
        }

        .content h3 {
          margin: 0;
          font-size: 1.1rem;
          color: #ffffff;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          font-weight: 600;
          letter-spacing: 0.5px;
        }

        .content p {
          margin: 8px 0;
          color: #a0a0a0;
          font-size: 0.9rem;
          transition: color 0.3s ease;
        }

        .movie-card:hover .content p {
          color: #ffffff;
        }

        .rating {
          margin-top: 8px;
          color: #ffd700;
          font-size: 0.95rem;
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .rating span {
          display: inline-flex;
          align-items: center;
          transition: transform 0.3s ease;
        }

        .movie-card:hover .rating span {
          transform: scale(1.1);
        }

        @media (max-width: 768px) {
          .movie-card {
            max-width: 100%;
          }

          .content {
            padding: 12px;
          }

          .content h3 {
            font-size: 1rem;
          }

          .content p,
          .rating {
            font-size: 0.85rem;
          }
        }
      `}</style>
      </div>
      
    );
  }