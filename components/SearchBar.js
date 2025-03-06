import { useState } from 'react';
import styles from '../styles/Home.module.css';

export default function SearchBar({ onSearch }) {
  const [query, setQuery] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
    }
  };

  return (
    <form className={styles['search-form']} onSubmit={handleSubmit}>
      <div className={styles['search-container']}>
        <input
          type="text"
          className={styles['search-input']}
          placeholder="Search anything..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>
    </form>
  );
}