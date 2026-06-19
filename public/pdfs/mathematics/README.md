# Mathematics PDF files

Store public worksheet PDFs in this directory using the following structure:

```text
{grade-slug}/{topic-folder}/{file-name}.pdf
```

Naming rules:

- Use lowercase English kebab-case.
- Use stable, descriptive filenames.
- Do not include spaces or Hebrew characters in paths.
- Do not store private or sensitive files here.

Example filesystem path:

```text
public/pdfs/mathematics/grade-7/percentages/sample.pdf
```

Matching Firestore `pdfUrl` value:

```text
/pdfs/mathematics/grade-7/percentages/sample.pdf
```

The production build copies this directory into `dist/pdfs/mathematics/`, and Firebase Hosting deploys it with the site.
