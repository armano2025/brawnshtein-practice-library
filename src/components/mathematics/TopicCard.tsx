import { Link } from "react-router-dom";
import type { Topic } from "../../models/Topic";

interface TopicCardProps {
  topic: Topic;
}

export function TopicCard({ topic }: TopicCardProps) {
  return (
    <Link className="topic-card" to={`/topic/${topic.slug}`}>
      <span className="topic-card-number" aria-hidden="true">{topic.order}</span>
      <span className="topic-card-content">
        <strong>{topic.name}</strong>
        <span>{topic.description}</span>
      </span>
      <span className="topic-card-arrow" aria-hidden="true">←</span>
    </Link>
  );
}
