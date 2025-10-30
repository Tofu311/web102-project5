import { useState, useEffect } from 'react';

const API_KEY = import.meta.env.VITE_API_KEY;

const Overview = () => {
  const [games, setGames] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    // fetch initial list
    const fetchGames = async () => {
      const fetchedGames = await getGames();
      if (fetchedGames && fetchedGames.length) setGames(fetchedGames);
    };
    fetchGames();
  }, []);

  // Will fetch the top 10 most popular games or run a query when provided
  const getGames = async (query = '') => {
    const base = 'https://api.gamebrain.co/v1/games';
    const url = query ? `${base}?query=${encodeURIComponent(query)}` : base;

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: { 'x-api-key': API_KEY }
      });
      if (!response.ok) throw new Error(`Response status: ${response.status}`);
      const result = await response.json();
      return result.results || [];
    } catch (error) {
      console.error(error);
      return [];
    }
  };

  // submit handler for the search form
  const handleSubmit = async (e) => {
    e.preventDefault();
    const term = (search || '').trim();
    const results = await getGames(term);
    setGames(results);
  };

  return (
    // add left padding so content doesn't sit under the fixed sidebar
    <main className="p-6 ml-72 min-h-screen bg-gray-50">
      <form onSubmit={handleSubmit} className="mb-6">
        <div className="max-w-md">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full mb-2 p-2 border border-gray-300 rounded"
            type="search"
            placeholder="Search for Games"
            aria-label="Search for games"
          />
          <div className="flex gap-2">
            <button type="submit" className="px-3 py-1 bg-black text-white rounded">Search</button>
            <button
              type="button"
              className="px-3 py-1 bg-black text-white border rounded"
              onClick={async () => {
                setSearch('');
                const all = await getGames();
                setGames(all);
              }}
            >
              Reset
            </button>
          </div>
        </div>
      </form>

      {games.length === 0 ? (
        <p>No results found.</p>
      ) : (
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {games.map((game) => {
            const ratingMean =
              game.rating?.mean ?? (typeof game.rating === 'number' ? game.rating : null);
            const ratingDisplay =
              ratingMean !== null ? (Number(ratingMean) * 10).toFixed(2) : null;
            const ratingCount = game.rating?.count ?? null;
            const image =
              (typeof game.image === 'string' && game.image) ||
              (Array.isArray(game.screenshots) && game.screenshots[0]) ||
              '';

            return (
              <article key={game.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
                {image ? (
                  <img
                    src={image}
                    alt={game.name ?? 'game'}
                    className="w-full h-48 object-cover"
                  />
                ) : (
                  <div className="w-full h-48 bg-gray-200 flex items-center justify-center text-sm text-gray-500">
                    No image
                  </div>
                )}

                <div className="p-4">
                  <h3 className="text-lg font-semibold mb-1">{game.name ?? 'Untitled'}</h3>
                  <p className="text-sm text-gray-600">Year: {game.year ?? 'N/A'}</p>
                  <p className="text-sm text-gray-600">Genre: {game.genre ?? 'N/A'}</p>
                  <p className="text-sm text-gray-600">
                    Rating:{' '}
                    {ratingDisplay !== null ? `${ratingDisplay} / 10` : 'N/A'}
                    {ratingCount ? ` (${Math.round(ratingCount)} ratings)` : ''}
                  </p>
                </div>
              </article>
            );
          })}
        </section>
      )}
    </main>
  );
};

export default Overview;