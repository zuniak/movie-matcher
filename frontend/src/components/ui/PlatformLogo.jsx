import PropTypes from 'prop-types'
import netflixUrl from '../../assets/logos/netflix.svg'
import hbomaxUrl from '../../assets/logos/hbomax.svg'
import disneyUrl from '../../assets/logos/disneyplus.svg'
import primeUrl from '../../assets/logos/primevideo.svg'

const LOGOS = {
  Netflix: netflixUrl,
  'HBO Max': hbomaxUrl,
  'Disney+': disneyUrl,
  'Prime Video': primeUrl,
}

// CSS filter that converts any black SVG to pure white
const WHITE_FILTER = 'brightness(0) invert(1)'

export default function PlatformLogo({ platform, size = 28, white = false }) {
  const src = LOGOS[platform]
  if (!src) return <span style={{ fontSize: size * 0.5, color: white ? '#fff' : undefined }}>{platform}</span>

  return (
    <img
      src={src}
      alt={platform}
      height={size}
      style={{
        display: 'block',
        width: 'auto',
        maxWidth: size * 4,
        filter: white ? WHITE_FILTER : undefined,
      }}
    />
  )
}

PlatformLogo.propTypes = {
  platform: PropTypes.string.isRequired,
  size: PropTypes.number,
  white: PropTypes.bool,
}
