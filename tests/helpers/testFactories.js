import FavoriteMovieIdb from '../../src/scripts/data/favorite-movie-idb';
import LikeButtonInitiator from '../../src/scripts/utils/like-button-presenter';

const createLikeButtonPresenterWithMovie = async (movie) => {
  await LikeButtonInitiator.init({
    likeButtonContainer: document.querySelector('#likeButtonContainer'),
    favoriteMovies: FavoriteMovieIdb,
    movie,
  });
};
export { createLikeButtonPresenterWithMovie };
