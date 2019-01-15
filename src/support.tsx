/// <reference types="cypress" />

import { getRootSuite, getTests } from './support-utils';

const React = require('react')
const ReactDOM = require('react-dom')

const addOnlySkipButtons = ($runnableTitle, title, spec) => {
  const onClickSkip = () => {
    console.log('onClickSkip', title, spec)
    cy.task('skipTests', {
      filename: spec.absolute,
      title: [title]
    })
  }

  const onClickOnly = () => {
    console.log('onClickOnly', title, spec)
    cy.task('onlyTests', {
      filename: spec.absolute,
      title: [title]
    })
  }
  const onNormal = () => {
    console.log('onNormal', title, spec)

    cy.task('allTests', {
      filename: spec.absolute,
      title: [title]
    })
  }

  const buttons = (
    <span>
      {' '}
      <i
        className='fa fa-circle-o-notch'
        title='Skip this test'
        onClick={onClickSkip}
      />{' '}
      <i
        className='fa fa-arrow-circle-left'
        title='Run only this test'
        onClick={onClickOnly}
      />{' '}
      <i
        className='fa fa-list-ul'
        title='Remove skip or only'
        onClick={onNormal}
      />
    </span>
  )

  const $buttons = Cypress.$(
    '<span class="only-skip" style="margin-left: 1em" />'
  )[0]
  $runnableTitle.after($buttons)
  ReactDOM.render(buttons, $buttons)
}

after(() => {
  // TODO auto retry until there are .runnable-title elements present
  setTimeout(() => {
    console.log('after all tests')
    // @ts-ignore
    const runnable = cy.state('runnable')
    const root = getRootSuite(runnable)
    // console.log(root)
    const titles = getTests(root)
    // console.table(titles)
    const humanTitles = titles.map(title => title.join(' - '))
    console.log(humanTitles.join('\n'))

    titles.forEach(title => {
      // @ts-ignore
      const $runnableTitle = Cypress.$.find(
        `.runnable-title:contains('${title}')`
      )
      if (!$runnableTitle.length) {
        return
      }
      console.log($runnableTitle)
      addOnlySkipButtons($runnableTitle[0], title, Cypress.spec)
    })
  }, 500)
  // Cypress.$.find('.runnable-title')
})
