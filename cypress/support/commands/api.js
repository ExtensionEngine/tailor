Cypress.Commands.add('interceptFetch', (route, alias) => {
  cy.intercept(route, req => {
    delete req.headers['if-none-match'];
  }).as(alias);
  cy.wait(`@${alias}`);
  return cy.get(`@${alias}`).then(({ response }) => response);
});
