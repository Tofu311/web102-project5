import { useState, useEffect } from 'react';

const API_KEY = import.meta.env.VITE_API_KEY;

const PLATFORMS = [
  { id: 'pc', label: 'PC' },
  { id: 'xbox', label: 'Xbox' },
  { id: 'playstation', label: 'PlayStation' },
  { id: 'switch', label: 'Nintendo Switch' },
  { id: 'mobile', label: 'Mobile' },
];

const Overview = () => {
  const [games, setGames] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedPlatforms, setSelectedPlatforms] = useState([]);

  useEffect(() => {
    // fetch initial list
    const fetchGames = async () => {
      const fetchedGames = await getGames();
      if (fetchedGames && fetchedGames.length) setGames(fetchedGames);
    };
    fetchGames();
  }, []);

  // Will fetch games; if query is provided, we can also attach platform filters
  const getGames = async (query = '', platforms = []) => {
    const base = 'https://api.gamebrain.co/v1/games';
    let url = base;

    if (query) {
      url += `?query=${encodeURIComponent(query)}`;
    }

    if (platforms && platforms.length > 0) {
      // API expects filters as JSON in the `filters` query param.
      const filters = [
        {
          key: 'platform',
          values: platforms.map((p) => ({ value: p })),
        },
      ];
      const joiner = url.includes('?') ? '&' : '?';
      url += `${joiner}filters=${encodeURIComponent(JSON.stringify(filters))}`;
    }

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: { 'x-api-key': API_KEY },
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
    const results = await getGames(term, term ? selectedPlatforms : []);
    setGames(results);
  };

  const togglePlatform = (id) => {
    setSelectedPlatforms((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
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

          {/* show filters only when there's a search term */}
          {search.trim().length > 0 && (
            <fieldset className="mb-2 border border-gray-200 p-3 rounded">
              <legend className="text-sm font-medium mb-2">Filter by platform</legend>
              <div className="flex flex-wrap gap-2">
                {PLATFORMS.map((p) => (
                  <label key={p.id} className="inline-flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={selectedPlatforms.includes(p.id)}
                      onChange={() => togglePlatform(p.id)}
                      className="form-checkbox"
                    />
                    <span className="text-sm">{p.label}</span>
                  </label>
                ))}
              </div>
            </fieldset>
          )}

          <div className="flex gap-2">
            <button type="submit" className="px-3 py-1 bg-black text-white rounded">
              Search
            </button>
            <button
              type="button"
              className="px-3 py-1 bg-black text-white border rounded"
              onClick={async () => {
                setSearch('');
                setSelectedPlatforms([]);
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
                  <img src={image} alt={game.name ?? 'game'} className="w-full h-48 object-cover" />
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