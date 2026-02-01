interface RegionBadgeProps {
  region: string | null
}

const REGION_FLAGS: Record<string, string> = {
  USA: '🇺🇸',
  BC: '🇨🇦',
  AB: '🇨🇦',
  ON: '🇨🇦',
  QC: '🇨🇦',
  SK: '🇨🇦',
  MB: '🇨🇦',
  NS: '🇨🇦',
  NB: '🇨🇦',
  PE: '🇨🇦',
  NL: '🇨🇦',
  YT: '🇨🇦',
  NT: '🇨🇦',
  NU: '🇨🇦',
}

export default function RegionBadge({ region }: RegionBadgeProps) {
  if (!region) return null

  const flag = REGION_FLAGS[region] || '🌐'
  const isUSA = region === 'USA'

  return (
    <span
      className={`region-flag d-flex align-items-center justify-content-center ${
        isUSA ? 'bg-danger' : 'bg-light'
      }`}
      style={{
        fontSize: '14px',
        width: '28px',
        height: '22px',
        borderRadius: '3px',
      }}
      title={region}
    >
      {flag}
    </span>
  )
}
