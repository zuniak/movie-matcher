export default function HBOMaxLogo({ size = 32 }) {
  const h = size
  const w = size * 2.4
  return (
    <svg width={w} height={h} viewBox="0 0 120 50" fill="none" xmlns="http://www.w3.org/2000/svg">
      <text
        x="4"
        y="36"
        fontFamily="Arial Black, sans-serif"
        fontWeight="900"
        fontSize="34"
        fill="currentColor"
        letterSpacing="-1"
      >
        HBO
      </text>
      <text
        x="4"
        y="50"
        fontFamily="Arial, sans-serif"
        fontWeight="700"
        fontSize="13"
        fill="currentColor"
        letterSpacing="4"
      >
        MAX
      </text>
    </svg>
  )
}
