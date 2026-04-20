// Cooky mascotte SVG · réutilisée depuis le prototype
import { tokens } from '@/lib/tokens';

export type Pose = 'default' | 'wave' | 'cooking' | 'watching' | 'thinking' | 'happy' | 'sleeping';

export function Cooky({ size = 120, pose = 'default' }: { size?: number; pose?: Pose }) {
  return (
    <svg viewBox="0 0 120 120" width={size} height={size} style={{ display: 'block' }}>
      <path d="M30 108 Q30 88 42 84 L78 84 Q90 88 90 108 Z" fill={tokens.paper} />
      <path d="M30 108 Q30 88 42 84 L78 84 Q90 88 90 108 Z" fill="none" stroke="#E8E0CE" strokeWidth={1} />
      <circle cx={60} cy={95} r={1.8} fill={tokens.tomato} />
      <path d="M44 82 L60 86 L76 82 L72 92 L60 90 L48 92 Z" fill={tokens.tomato} />
      <path d="M60 86 L60 90" stroke="#A03528" strokeWidth={0.8} />
      <circle cx={60} cy={66} r={18} fill="#E8C9A8" />
      <ellipse cx={41} cy={66} rx={2.5} ry={3.5} fill="#E8C9A8" />
      <ellipse cx={79} cy={66} rx={2.5} ry={3.5} fill="#E8C9A8" />
      <ellipse cx={46} cy={70} rx={3} ry={2} fill="#E8A896" opacity={0.55} />
      <ellipse cx={74} cy={70} rx={3} ry={2} fill="#E8A896" opacity={0.55} />
      {renderEyes(pose)}
      <path d="M52 70 Q55 73 60 71 Q65 73 68 70 Q65 74 60 73 Q55 74 52 70 Z" fill="#3D342B" />
      {renderMouth(pose)}
      <g>
        <rect x={42} y={48} width={36} height={6} rx={2} fill={tokens.paper} />
        <circle cx={48} cy={38} r={11} fill={tokens.paper} />
        <circle cx={72} cy={38} r={11} fill={tokens.paper} />
        <circle cx={60} cy={32} r={13} fill={tokens.paper} />
        <circle cx={54} cy={42} r={9} fill={tokens.paper} />
        <circle cx={66} cy={42} r={9} fill={tokens.paper} />
      </g>
      {renderArms(pose)}
    </svg>
  );
}

function renderEyes(pose: Pose) {
  if (pose === 'happy') return (
    <g>
      <path d="M46 63 Q50 58 54 63" stroke={tokens.ink} strokeWidth={1.8} fill="none" strokeLinecap="round" />
      <path d="M66 63 Q70 58 74 63" stroke={tokens.ink} strokeWidth={1.8} fill="none" strokeLinecap="round" />
    </g>
  );
  return (
    <g>
      <ellipse cx={50} cy={62} rx={2.2} ry={2.6} fill={tokens.ink} />
      <ellipse cx={70} cy={62} rx={2.2} ry={2.6} fill={tokens.ink} />
      <circle cx={50.6} cy={61.3} r={0.7} fill="#fff" />
      <circle cx={70.6} cy={61.3} r={0.7} fill="#fff" />
    </g>
  );
}

function renderMouth(pose: Pose) {
  if (pose === 'thinking') return <path d="M56 73 L64 73" stroke={tokens.ink} strokeWidth={1.6} strokeLinecap="round" />;
  return <path d="M55 74 Q60 78 65 74" stroke={tokens.ink} strokeWidth={1.6} fill="none" strokeLinecap="round" />;
}

function renderArms(pose: Pose) {
  if (pose === 'wave') return (
    <g>
      <path d="M38 92 Q34 100 36 108" stroke={tokens.paper} strokeWidth={9} fill="none" strokeLinecap="round" />
      <path d="M82 92 Q92 80 96 68" stroke={tokens.paper} strokeWidth={9} fill="none" strokeLinecap="round" />
      <circle cx={97} cy={66} r={5} fill="#E8C9A8" />
    </g>
  );
  if (pose === 'cooking') return (
    <g>
      <path d="M38 92 Q34 96 36 102" stroke={tokens.paper} strokeWidth={9} fill="none" strokeLinecap="round" />
      <ellipse cx={42} cy={104} rx={10} ry={3.5} fill="#8B6F47" />
      <path d="M82 92 Q88 88 92 82" stroke={tokens.paper} strokeWidth={9} fill="none" strokeLinecap="round" />
    </g>
  );
  return (
    <g>
      <path d="M38 92 Q34 100 36 108" stroke={tokens.paper} strokeWidth={9} fill="none" strokeLinecap="round" />
      <path d="M82 92 Q86 100 84 108" stroke={tokens.paper} strokeWidth={9} fill="none" strokeLinecap="round" />
    </g>
  );
}
