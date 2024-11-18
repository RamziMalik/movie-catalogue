import FavoriteMovieSearchPresenter from '../src/scripts/views/pages/liked-movies/favorite-movie-search-presenter';
import FavoriteMovieSearchView from '../src/scripts/views/pages/liked-movies/favorite-movie-view';

describe('Searching Movies', () => {
  let presenter;
  let favoriteMovies;
  let view;

  const searchMovies = (query) => {
    const queryElement = document.getElementById('query');
    queryElement.value = query;

    queryElement.dispatchEvent(new Event('change'));
  };

  const setMovieSearchContainer = () => {
    view = new FavoriteMovieSearchView();
    document.body.innerHTML = view.getTemplate();
  };

  const constructPresenter = () => {
    favoriteMovies = {
      getAllMovies: jest.fn(),
      searchMovies: jest.fn(),
    };
    presenter = new FavoriteMovieSearchPresenter({
      favoriteMovies,
      view,
    });
  };

  beforeEach(() => {
    setMovieSearchContainer();
    constructPresenter();
  });

  describe('when query is not empty', () => {
    it('Should be able to capture the query typed by the user', () => {
      favoriteMovies.searchMovies.mockImplementation(() => []);

      searchMovies('film a');

      expect(presenter.latestQuery).toEqual('film a');
    });

    it('Should ask the model to search for liked movies', () => {
      favoriteMovies.searchMovies.mockImplementation(() => []);

      searchMovies('film a');

      expect(favoriteMovies.searchMovies).toHaveBeenCalledWith('film a');
    });

    it('should show the movies found by Favorite Movies', (done) => {
      document.getElementById('movies').addEventListener('movies:updated', () => {
        expect(document.querySelectorAll('.movie-item').length).toEqual(3);

        done();
      });

      favoriteMovies.searchMovies.mockImplementation((query) => {
        if (query === 'film a') {
          return [
            { id: 111, title: 'film abc' },
            { id: 222, title: 'ada juga film abcde' },
            { id: 333, title: 'ini juga boleh film a' },
          ];
        }

        return [];
      });

      searchMovies('film a');
    });
  });

  describe('when query is empty', () => {
    it('should capture the query as empty', () => {
      favoriteMovies.getAllMovies.mockImplementation(() => []);

      searchMovies(' ');
      expect(presenter.latestQuery.length).toEqual(0);

      searchMovies('    ');
      expect(presenter.latestQuery.length).toEqual(0);

      searchMovies('\t');
      expect(presenter.latestQuery.length).toEqual(0);
    });

    it('should show all favorite movies', () => {
      favoriteMovies.getAllMovies.mockImplementation(() => []);

      searchMovies('   ');

      expect(favoriteMovies.getAllMovies).toHaveBeenCalled();
    });
  });

  describe('When no favorite movies could be found', () => {
    it('should show the empty message', (done) => {
      document.getElementById('movies').addEventListener('movies:updated', () => {
        expect(document.querySelectorAll('.movie-item__not__found').length).toEqual(1);

        done();
      });

      favoriteMovies.searchMovies.mockImplementation((query) => []);

      searchMovies('film a');
    });

    it('should not show any movie', (done) => {
      document.getElementById('movies').addEventListener('movies:updated', () => {
        expect(document.querySelectorAll('.movie-item').length).toEqual(0);
        done();
      });

      favoriteMovies.searchMovies.mockImplementation((query) => []);

      searchMovies('film a');
    });
  });

  it('should show - when the movie returned does not contain a title', (done) => {
    document.getElementById('movies').addEventListener('movies:updated', () => {
      const movieTitles = document.querySelectorAll('.movie__title');
      expect(movieTitles.item(0).textContent).toEqual('-');

      done();
    });

    favoriteMovies.searchMovies.mockImplementation((query) => {
      if (query === 'film a') {
        return [{ id: 444 }];
      }

      return [];
    });

    searchMovies('film a');
  });
});
