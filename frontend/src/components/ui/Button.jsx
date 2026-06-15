import PropTypes from 'prop-types'

export default function Button({ children, variant = 'primary', onClick, disabled }) {
  return (
    <button data-variant={variant} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  )
}

Button.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf(['primary', 'secondary']),
  onClick: PropTypes.func,
  disabled: PropTypes.bool,
}
