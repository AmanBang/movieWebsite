import { useRouter } from 'next/router';
import styles from '../../../styles/Watch.module.css';
import { useState, useEffect } from 'react';

export default function WatchEpisode() {
  const router = useRouter();
  const [videoSrc, setVideoSrc] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    if (router.isReady) {
      // Correctly destructure the params array from the dynamic route
      const { params } = router.query;
      
      if (!params || params.length !== 3) {
        setError('Invalid URL parameters. Please check the series ID, season number, and episode number.');
        return;
      }

      const [seriesId, seasonNumber, episodeNumber] = params;
      
      if (!seriesId || !seasonNumber || !episodeNumber) {
        setError('Missing required parameters');
        return;
      }

      setVideoSrc(`https://vidbinge.dev/embed/tv/${seriesId}/${seasonNumber}/${episodeNumber}`);
    }
  }, [router.isReady, router.query]);

  // Loading state
  if (!router.isReady) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>Loading...</div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>{error}</div>
        <button className={styles.backButton} onClick={() => router.back()}>
          ← Back
        </button>
      </div>
    );
  }

  // If videoSrc is empty (after initial load or during parameter changes), show loading
  if (!videoSrc) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>Loading video...</div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <button className={styles.backButton} onClick={() => router.back()}>
        ← Back
      </button>
      <div className={styles.videoWrapper}>
        <iframe
          src={videoSrc}
          title="Series Episode"
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