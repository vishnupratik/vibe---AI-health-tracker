import { SVGProps } from 'react';

interface ProgressRingProps extends Omit<SVGProps<SVGSVGElement>, 'stroke'> {
  radius: number;
  stroke: number;
  progress: number;
  color?: string;
  trackColor?: string;
}

export function ProgressRing({
  radius,
  stroke,
  progress,
  color = 'var(--color-nature-500)',
  trackColor = 'var(--color-nature-100)',
  ...props
}: ProgressRingProps) {
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <svg
      height={radius * 2}
      width={radius * 2}
      className="transform -rotate-90"
      {...props}
    >
      <circle
        stroke={trackColor}
        fill="transparent"
        strokeWidth={stroke}
        r={normalizedRadius}
        cx={radius}
        cy={radius}
      />
      <circle
        stroke={color}
        fill="transparent"
        strokeWidth={stroke}
        strokeDasharray={circumference + ' ' + circumference}
        style={{ strokeDashoffset, transition: 'stroke-dashoffset 0.5s ease-in-out' }}
        strokeLinecap="round"
        r={normalizedRadius}
        cx={radius}
        cy={radius}
      />
    </svg>
  );
}
