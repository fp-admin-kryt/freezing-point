// This is an inline SVG version of fp-logo.svg for use in React components
// You can animate or style this as needed

interface LogoFPProps {
  size?: number
  className?: string
  style?: React.CSSProperties
  color?: string
}

export default function LogoFP({ size = 40, className = '', style = {}, color = '#ffffff', ...props }: LogoFPProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={style}
      {...props}
    >
      {/* Main filled circle */}
      <circle cx="20" cy="32" r="12" fill={color} />
      {/* Dash */}
      <rect x="32" y="30" width="16" height="4" rx="2" fill={color} transform="rotate(-20 32 30)" />
      {/* Stroked circle */}
      <circle cx="44" cy="32" r="12" stroke={color} strokeWidth="3" fill="none" />
      {/* Small filled circle inside stroked circle */}
      <circle cx="44" cy="32" r="4" fill={color} />
    </svg>
  )
}
