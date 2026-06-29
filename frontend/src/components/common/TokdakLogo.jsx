const TokdakLogo = ({ height = 28, light = false }) => {
  const ratio = 160 / 40;
  const width = height * ratio;
  const mainColor = light ? '#ffffff' : '#111111';
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 40" width={width} height={height}>
      <g transform="translate(4, 2)">
        <path d="M 6,15 L 18,9 L 30,15 L 18,21 Z" fill="none" stroke={mainColor} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M 6,15 L 6,25 L 18,31 L 18,21" fill="none" stroke={mainColor} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M 30,15 L 30,25 L 18,31" fill="none" stroke={mainColor} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M 14,2 L 23,11 L 34,2" fill="none" stroke="#FF6B00" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="34" cy="2" r="2" fill="#FF6B00" />
      </g>
      <text x="48" y="26" fontFamily="Inter, sans-serif" fontWeight="800" fontSize="22" fill={mainColor} letterSpacing="0.5">
        TOK<tspan fill="#FF6B00">DAK</tspan>
      </text>
    </svg>
  );
};

export default TokdakLogo;
