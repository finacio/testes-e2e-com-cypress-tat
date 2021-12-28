/* eslint-disable linebreak-style */
describe('Scenarios where authentication is a pre-requirement', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/notes').as('getNotes')
    cy.login()
  })

  it('CRUDs a note', () => {
    const faker = require('faker')
    const noteDescription = faker.lorem.words(4)

    cy.createNote(noteDescription)
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(15000)
    cy.wait('@getNotes')

    const updatedNoteDescription = faker.lorem.words(4)
    const attachFile = true

    cy.editNote(noteDescription, updatedNoteDescription, attachFile)
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(15000)
    cy.wait('@getNotes')

    cy.deleteNote(updatedNoteDescription)
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(15000)
    cy.wait('@getNotes')
  })

  it('successfully submits the form', () => {
    cy.intercept('POST', '**/prod/billing').as('paymentRequest')

    cy.fillSettingsFormAndSubmit()

    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(15000)
    cy.wait('@getNotes')
    cy.wait('@paymentRequest').then(response => {
      expect(response.state).to.equal('Complete')
    })
  })

  it.only('logs out', () => {
    cy.visit('')
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(15000)
    cy.wait('@getNotes')

    if(Cypress.config('viewportWidth') < Cypress.env('viewportWidthBreakpoint')) {
      cy.get('.navbar-toggle.collapsed')
        .should('be.visible')
        .click()
    }
  })
})