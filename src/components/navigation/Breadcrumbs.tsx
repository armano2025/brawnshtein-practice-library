import { Link, matchPath, useLocation } from "react-router-dom";
import { useAsyncResource } from "../../hooks/useAsyncResource";
import { catalogService } from "../../services/catalogService";

interface BreadcrumbItem {
  label: string;
  path?: string;
}

async function getBreadcrumbs(pathname: string): Promise<BreadcrumbItem[]> {
  const home: BreadcrumbItem = { label: "דף הבית", path: "/" };

  if (matchPath("/mathematics", pathname)) {
    return [home, { label: "מתמטיקה" }];
  }

  const trackMatch = matchPath("/grade/:id/track/:trackId", pathname);
  if (trackMatch) {
    const [category, track] = await Promise.all([
      trackMatch.params.id ? catalogService.getGradeBySlug(trackMatch.params.id) : null,
      trackMatch.params.trackId ? catalogService.getTrackBySlug(trackMatch.params.trackId) : null,
    ]);

    return [
      home,
      { label: "מתמטיקה", path: "/mathematics" },
      { label: category?.title ?? "כיתה", path: category ? `/grade/${category.slug}` : undefined },
      { label: track?.name ?? "מסלול יחידות" },
    ];
  }

  const gradeMatch = matchPath("/grade/:id", pathname);
  if (gradeMatch) {
    const category = gradeMatch.params.id
      ? await catalogService.getGradeBySlug(gradeMatch.params.id)
      : null;
    return [home, { label: "מתמטיקה", path: "/mathematics" }, { label: category?.title ?? "מסלול תרגול" }];
  }

  const topicMatch = matchPath("/topic/:id", pathname);
  if (topicMatch) {
    const topic = topicMatch.params.id
      ? await catalogService.getTopicBySlug(topicMatch.params.id)
      : null;
    const category = topic
      ? await catalogService.getGradeBySlug(topic.gradeSlug)
      : null;

    if (topic && category) {
      return [
        home,
        { label: "מתמטיקה", path: "/mathematics" },
        { label: category.title, path: `/grade/${category.slug}` },
        { label: topic.name },
      ];
    }

    return [home, { label: "מתמטיקה", path: "/mathematics" }, { label: "נושא" }];
  }

  const worksheetMatch = matchPath("/worksheet/:id", pathname);
  if (worksheetMatch) {
    const worksheet = worksheetMatch.params.id
      ? await catalogService.getWorksheetBySlug(worksheetMatch.params.id)
      : null;
    const topic = worksheet
      ? await catalogService.getTopicBySlug(worksheet.topicSlug)
      : null;
    const category = worksheet
      ? await catalogService.getGradeBySlug(worksheet.gradeSlug)
      : null;

    if (worksheet && topic && category) {
      return [
        home,
        { label: "מתמטיקה", path: "/mathematics" },
        { label: category.title, path: `/grade/${category.slug}` },
        { label: topic.name, path: `/topic/${topic.slug}` },
        { label: worksheet.title },
      ];
    }

    return [home, { label: "מתמטיקה", path: "/mathematics" }, { label: "תרגול" }];
  }

  return [];
}

export function Breadcrumbs() {
  const { pathname } = useLocation();
  const resource = useAsyncResource(`breadcrumbs:${pathname}`, () => getBreadcrumbs(pathname));
  const items = resource.data ?? [];

  if (resource.isLoading) {
    return <div className="content-container breadcrumbs-loading" aria-label="טוען פירורי לחם" />;
  }

  if (resource.error || items.length === 0) {
    return null;
  }

  return (
    <nav className="content-container breadcrumbs" aria-label="פירורי לחם">
      <ol>
        {items.map((item, index) => (
          <li key={`${item.label}-${index}`}>
            {item.path ? <Link to={item.path}>{item.label}</Link> : <span aria-current="page">{item.label}</span>}
          </li>
        ))}
      </ol>
    </nav>
  );
}
