import { useRouter } from 'next/router';
import styles from '../../styles/Movie.module.css';

export default function MovieDetail() {
  const router = useRouter();
  const { id } = router.query;

  return (
    <div className={styles.container}>
      <button className={styles.backButton} onClick={() => router.back()}>
        ← Back
      </button>
      <div className={styles.videoWrapper}>
        <iframe
          src={`https://vidsrc.xyz/embed/movie/${id}`}
          title="Movie Video"
          frameBorder="0"
          sandbox="allow-scripts allow-presentation"
          referrerPolicy="origin"
          allow="autoplay; encrypted-media; picture-in-picture"
          allowFullScreen
        />
      </div>
    </div>
  );
}
