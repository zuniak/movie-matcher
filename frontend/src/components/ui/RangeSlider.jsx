import PropTypes from 'prop-types'
import styles from './RangeSlider.module.css'

export default function RangeSlider({ min, max, from, to, onChange }) {
  const pctFrom = ((from - min) / (max - min)) * 100
  const pctTo = ((to - min) / (max - min)) * 100

  const handleFrom = (e) => {
    const val = Math.min(Number(e.target.value), to - 1)
    onChange(val, to)
  }

  const handleTo = (e) => {
    const val = Math.max(Number(e.target.value), from + 1)
    onChange(from, val)
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.track}>
        <div
          className={styles.fill}
          style={{ left: `${pctFrom}%`, width: `${pctTo - pctFrom}%` }}
        />
      </div>

      <input
        className={styles.thumb}
        type="range"
        min={min}
        max={max}
        value={from}
        onChange={handleFrom}
      />
      <input
        className={styles.thumb}
        type="range"
        min={min}
        max={max}
        value={to}
        onChange={handleTo}
      />
    </div>
  )
}

RangeSlider.propTypes = {
  min: PropTypes.number.isRequired,
  max: PropTypes.number.isRequired,
  from: PropTypes.number.isRequired,
  to: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired,
}
