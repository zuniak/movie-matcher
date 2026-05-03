import PropTypes from 'prop-types'

export default function MovieDetailSheet({ movie, onClose }) {
  if (!movie) return null
  return (
    <div>
      <button onClick={onClose}>Close</button>
      <div>{movie.title}</div>
    </div>
  )
}

MovieDetailSheet.propTypes = {
  movie: PropTypes.shape({ title: PropTypes.string }),
  onClose: PropTypes.func,
}
