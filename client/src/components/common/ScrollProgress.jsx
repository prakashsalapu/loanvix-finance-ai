import { useScrollPosition } from '../../hooks/useScrollPosition'

export default function ScrollProgress() {
  const { scrollPercentage } = useScrollPosition()

  return (
    <div
      className="progress-bar"
      style={{ width: `${scrollPercentage}%` }}
      role="progressbar"
      aria-valuenow={scrollPercentage}
      aria-valuemin={0}
      aria-valuemax={100}
    />
  )
}
