// These are UI scenario tests, not simulations of the backend game rules.
// Open the runner to watch them; the page also has an 8-second autoplay mode.
const select = index => cy.get(`[data-cy=scenario-${index}]`).click();
describe('Сценарії ігрового столу', () => {
  beforeEach(() => {
    cy.setCookie('bluff_locale', 'uk');
    cy.visit('/dev/game-scenarios');
    cy.contains('Сценарії гри').should('be.visible');
  });
  it('shows eight players on a mobile screen without page overflow', () => {
    cy.viewport(390, 844);
    cy.get('section[aria-label="Ігровий стіл"]').within(() => {
      ['Марія', 'Олександр', 'Anna', 'Тарас', 'Marta', 'Дмитро'].forEach(name => cy.contains(name).should('exist'));
      cy.contains('Дуже довге ім’я гравця').should('exist');
    });
    cy.document().then(doc => expect(doc.documentElement.scrollWidth).to.be.at.most(390));
    cy.screenshot('eight-players-mobile');
  });
  it('selects a card and enables the play button', () => {
    select(1);
    cy.contains('button', 'Виберіть карти для ходу').should('be.disabled');
    cy.get('button[aria-label="A♥"]').click();
    cy.get('button[aria-label="A♥"]').should('have.attr', 'aria-pressed', 'true');
    cy.contains('button', 'Покласти карти (1 шт)').should('be.enabled');
    cy.screenshot('your-turn-selected-card');
  });
  it('shows a bluff notification without move history', () => {
    select(2);
    cy.get('[role=status]').should('contain', 'Марія блефувала');
    cy.contains('Історія гри').should('not.exist');
    cy.screenshot('bluff-notification');
  });
  it('shows a disconnected player and countdown', () => {
    select(3);
    cy.get('section[aria-label="Ігровий стіл"]').should('contain', 'Олександр').and('contain', 'с');
    cy.screenshot('disconnected-player');
  });
  it('shows the first winner while the game continues', () => {
    select(4);
    cy.get('section[aria-label="Ігровий стіл"]').should('contain', '1 місце').and('contain', 'Хід');
    cy.screenshot('first-winner');
  });
  [5, 6].forEach(index => it(index === 5 ? 'shows your victory' : 'shows your defeat', () => {
    select(index);
    cy.get('[role=status]').should('contain', index === 5 ? 'Ти переміг' : '8 місце');
    cy.get('section[aria-label="Ігровий стіл"]').should('contain', 'Гру завершено');
    cy.contains('button', 'Виберіть карти для ходу').should('be.disabled');
    cy.screenshot(index === 5 ? 'victory' : 'defeat');
  }));
});
