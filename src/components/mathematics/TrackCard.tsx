import { Link } from "react-router-dom";
import type { Track } from "../../models/Track";

interface TrackCardProps {
  track: Track;
}

export function TrackCard({ track }: TrackCardProps) {
  return (
    <Link className="track-card" to={`/grade/${track.gradeSlug}/track/${track.slug}`}>
      <span className="track-card-mark" aria-hidden="true">{track.shortLabel}</span>
      <span className="track-card-content">
        <strong>{track.name}</strong>
        <span>{track.description}</span>
      </span>
      <span className="track-card-arrow" aria-hidden="true">←</span>
    </Link>
  );
}
