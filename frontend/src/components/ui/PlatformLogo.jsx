import PropTypes from 'prop-types'
import NetflixLogo from './logos/NetflixLogo'
import HBOMaxLogo from './logos/HBOMaxLogo'
import DisneyPlusLogo from './logos/DisneyPlusLogo'
import PrimeVideoLogo from './logos/PrimeVideoLogo'

const LOGOS = {
  Netflix: NetflixLogo,
  'HBO Max': HBOMaxLogo,
  'Disney+': DisneyPlusLogo,
  'Prime Video': PrimeVideoLogo,
}

export default function PlatformLogo({ platform, size = 28 }) {
  const Logo = LOGOS[platform]
  if (!Logo) return <span style={{ fontSize: size * 0.45 }}>{platform}</span>
  return <Logo size={size} />
}

PlatformLogo.propTypes = {
  platform: PropTypes.string.isRequired,
  size: PropTypes.number,
}
