export default function DisneyPlusLogo({ size = 32 }) {
  const h = size
  const w = size * 2.6
  return (
    <svg width={w} height={h} viewBox="0 0 130 50" fill="none" xmlns="http://www.w3.org/2000/svg">
      <text
        x="2"
        y="38"
        fontFamily="Arial, sans-serif"
        fontWeight="800"
        fontSize="30"
        fill="currentColor"
        letterSpacing="-0.5"
        fontStyle="italic"
      >
        DISNEY
      </text>
      {/* Plus sign */}
      <rect x="108" y="10" width="5" height="30" fill="currentColor" rx="2" />
      <rect x="95" y="22" width="30" height="5" fill="currentColor" rx="2" />
    </svg>
  )
}
