import { useState, useEffect } from 'react';

const API_KEY = import.meta.env.VITE_API_KEY;

const Overview = () => {
  const [games, setGames] = useState([]);

  useEffect(() => {
    const fetchGames = async () => {
      const fetchedGames = await getGames();
      if (fetchedGames && fetchedGames.length) {
        setGames(fetchedGames);
      }
    };
    fetchGames();
  }, []);

  // Will fetch the top 10 most popular games
  const getGames = async () => {
    const url = 'https://api.gamebrain.co/v1/games';

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: { 'x-api-key': API_KEY }
      });

      if (!response.ok) throw new Error(`Response status: ${response.status}`);

      const result = await response.json();
      const games = result.results || [];
      console.log(games);
      return games;
    } catch (error) {
      console.error(error);
      return [];
    }
  };

  return (
    // add left padding so content doesn't sit under the fixed sidebar
    <main className="p-6 ml-72 min-h-screen bg-gray-50">
      {games.length === 0 ? (
        <p>Loading...</p>
      ) : (
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {games.map((game) => {
            const ratingMean =
              game.rating?.mean ?? (typeof game.rating === 'number' ? game.rating : null);
            const ratingCount = game.rating?.count ?? null;
            // some entries use `image`, some `screenshots` (array)
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
                    {ratingMean !== null ? ratingMean : 'N/A'}
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