function login(user = getActor()) {
  return cy.getStore().invoke('dispatch', 'login', user);
}

function loginWithUI(user = getActor()) {
  cy.findByLabelText(/email/i)
    .type(user.email);
  cy.findByLabelText(/password/i)
    .type(user.password);
  cy.findByText(/log in/i)
    .click();
}

function logout() {
  return cy.getStore().invoke('dispatch', 'logout');
}

const getActor = () => ({
  email: Cypress.env('USERNAME') || 'admin@example.com',
  password: Cypress.env('PASSWORD') || 'admin123.'
});

export default {
  login,
  loginWithUI,
  logout
};
