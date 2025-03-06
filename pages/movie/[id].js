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
          src={`https://vidcloud1.com/streaming.php?id=${id}`}
          title="Movie Video"
          frameBorder="0"
          sandbox="allow-scripts allow-same-origin allow-presentation"
          referrerPolicy="no-referrer"
          allow="autoplay; encrypted-media; picture-in-picture"
          allowFullScreen
        />
      </div>
    </div>
  );
}