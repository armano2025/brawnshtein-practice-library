/* global cy, describe, it */

describe("Brawnshtein Practice Library navigation", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("navigates from the home page to mathematics", () => {
    cy.contains("a", "מתמטיקה").click();
    cy.location("pathname").should("equal", "/mathematics");
    cy.contains("h1", "מתמטיקה").should("be.visible");
  });

  it("opens a Hebrew search result", () => {
    cy.get("#practice-search").type("לוח הכפל");
    cy.get(".search-results li").first().as("firstSearchResult");
    cy.get("@firstSearchResult").find("mark.search-highlight").should("have.length", 2);
    cy.get("@firstSearchResult").should("contain.text", "לוח הכפל").find("a").click();
    cy.location("pathname").should("equal", "/worksheet/grade-3-multiplication-table");
  });

  it("keeps the home page usable on a mobile viewport", () => {
    cy.viewport("iphone-x");
    cy.contains("h1", "מאגר תרגילי בראונשטיין").should("be.visible");
    cy.get("#practice-search").should("be.visible");
    cy.contains("a", "מתמטיקה").should("be.visible");
  });

  it("opens a five-unit track for grade 10", () => {
    cy.visit("/grade/grade-10");
    cy.contains("h1", "כיתה י׳").should("be.visible");
    cy.contains("a", "5 יח״ל").click();
    cy.location("pathname").should("equal", "/grade/grade-10/track/grade-10-5-units");
    cy.contains("h1", "כיתה י׳ — 5 יח״ל").should("be.visible");
    cy.contains("a", "חדו״א").should("be.visible");
  });

  const adminEmail = Cypress.env("ADMIN_EMAIL");
  const adminPassword = Cypress.env("ADMIN_PASSWORD");
  const adminTest = adminEmail && adminPassword ? it : it.skip;

  adminTest("lets an authorized administrator add an external PDF worksheet", () => {
    const worksheetTitle = `תרגול E2E ${Date.now()}`;
    cy.visit("/admin");
    cy.get("[data-cy=admin-email]").type(adminEmail, { log: false });
    cy.get("[data-cy=admin-password]").type(adminPassword, { log: false });
    cy.get("[data-cy=admin-login]").click();
    cy.get("[data-cy=admin-grade]").select("grade-7");
    cy.get("[data-cy=admin-topic]").select(1);
    cy.get("[data-cy=admin-title]").type(worksheetTitle);
    cy.get("[data-cy=admin-description]").type("תרגול שנוצר בבדיקת קצה לקצה");
    cy.get("[data-cy=admin-tags]").type("בדיקה, אחוזים");
    cy.get("[data-cy=admin-pdf-url]").type("https://brawnshtein-pdfs.pages.dev/e2e/sample.pdf");
    cy.get("[data-cy=admin-save]").click();
    cy.contains("התרגול נשמר בהצלחה").should("be.visible");
    cy.get("[data-cy=admin-topic]").invoke("val").then((topicSlug) => {
      cy.visit(`/topic/${String(topicSlug)}`);
      cy.contains(worksheetTitle).should("be.visible");
    });
  });
});
