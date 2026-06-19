interface PdfViewerProps {
  pdfUrl: string;
  title: string;
  onDownload: () => void;
}

export function PdfViewer({ pdfUrl, title, onDownload }: PdfViewerProps) {
  if (!pdfUrl) {
    return (
      <div className="pdf-empty-state">
        <span aria-hidden="true">PDF</span>
        <h2>קובץ התרגול אינו זמין כרגע</h2>
        <p>אפשר לנסות שוב מאוחר יותר או לחזור לרשימת התרגולים.</p>
      </div>
    );
  }

  return (
    <section className="pdf-viewer-section" aria-labelledby="pdf-viewer-title">
      <div className="pdf-viewer-toolbar">
        <div>
          <span className="pdf-label">PDF</span>
          <h2 id="pdf-viewer-title">תצוגת התרגול</h2>
        </div>
        <div className="pdf-toolbar-actions">
          <a className="worksheet-action worksheet-action-secondary" href={pdfUrl} target="_blank" rel="noreferrer">
            פתח במסך מלא
          </a>
          <a className="worksheet-action worksheet-action-primary" href={pdfUrl} download onClick={onDownload}>
            הורד PDF
          </a>
        </div>
      </div>

      <div className="pdf-frame-wrapper">
        <object className="pdf-frame" data={`${pdfUrl}#view=FitH`} type="application/pdf" aria-label={`תצוגת PDF: ${title}`}>
          <div className="pdf-browser-fallback">
            <p>הדפדפן אינו תומך בהצגת PDF בתוך העמוד.</p>
            <a href={pdfUrl} target="_blank" rel="noreferrer">פתיחת הקובץ בחלון חדש</a>
          </div>
        </object>
      </div>
    </section>
  );
}
