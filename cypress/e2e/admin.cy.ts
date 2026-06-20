/* global cy, describe, it */

describe("Brawnshtein Practice Library administration", () => {
  it("lets an authorized administrator add an external PDF worksheet", function () {
    cy.env<{ ADMIN_EMAIL?: string; ADMIN_PASSWORD?: string }>(["ADMIN_EMAIL", "ADMIN_PASSWORD"])
      .then(({ ADMIN_EMAIL: adminEmail, ADMIN_PASSWORD: adminPassword }) => {
        if (!adminEmail || !adminPassword) {
          this.skip();
          return;
        }

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
});
