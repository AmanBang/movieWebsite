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
      </div>
    );
  }