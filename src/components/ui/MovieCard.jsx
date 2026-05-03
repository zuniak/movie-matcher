import PropTypes from 'prop-types'

export default function MovieCard({ movie, onLike, onSkip, onInfo }) {
  return (
    <div>
      <img src={movie?.poster} alt={movie?.title} />
      <div>{movie?.title}</div>
      <div>
        <button onClick={onSkip}>Skip</button>
        <button onClick={onInfo}>Info</button>
        <button onClick={onLike}>Like</button>
      </div>
    </div>
  )
}

MovieCard.propTypes = {
  movie: PropTypes.shape({
    poster: PropTypes.string,
    title: PropTypes.string,
  }),
  onLike: PropTypes.func,
  onSkip: PropTypes.func,
  onInfo: PropTypes.func,
}
