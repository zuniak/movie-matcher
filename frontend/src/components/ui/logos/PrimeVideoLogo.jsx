export default function PrimeVideoLogo({ size = 32 }) {
  const h = size
  const w = size * 2.8
  return (
    <svg width={w} height={h} viewBox="0 0 140 50" fill="none" xmlns="http://www.w3.org/2000/svg">
      <text
        x="2"
        y="24"
        fontFamily="Arial, sans-serif"
        fontWeight="800"
        fontSize="18"
        fill="currentColor"
        letterSpacing="1"
      >
        prime
      </text>
      <text
        x="2"
        y="44"
        fontFamily="Arial, sans-serif"
        fontWeight="400"
        fontSize="16"
        fill="currentColor"
        letterSpacing="0.5"
      >
        video
      </text>
      {/* Arrow underline */}
      <path
        d="M2 47 Q71 54 138 47"
        stroke="currentColor"
        strokeWidth="2.5"
        fill="none"
        strokeLinecap="round"
      />
    </svg>
  )
}
