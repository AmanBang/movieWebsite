import axios from 'axios';

const TMDB_API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
const TMDB_BASE_URL = 'https://api.themoviedb.org/3/movie';

export default async function handler(req, res) {
  const { id } = req.query;

  if (!TMDB_API_KEY) {
    return res.status(500).json({ error: 'TMDB API key is not configured' });
  }

  try {
    // First, fetch the movie details to get the TMDB ID
    const movieResponse = await axios.get(
      `${TMDB_BASE_URL}/${id}/videos?api_key=${TMDB_API_KEY}`
    );

    const videos = movieResponse.data.results;
    const trailer = videos.find(
      (video) => video.type === 'Trailer' && video.site === 'YouTube'
    ) || videos[0];

    if (trailer) {
      // Return both video key and type for proper player handling
      res.status(200).json({
        key: trailer.key,
        site: trailer.site,
        type: trailer.type
      });
    } else {
      res.status(404).json({ error: 'No video content found' });
    }
  } catch (error) {
    console.error('Error fetching video:', error);
    res.status(500).json({ error: 'Failed to fetch video content' });
  }
}