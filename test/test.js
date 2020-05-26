import subscribe from '../dist/index.js'

describe('check-all', function () {
  let subscription
  beforeEach(function () {
    document.body.innerHTML = `
      <div data-check-all-container>
        Count: <span data-check-all-count>0</span>
        <label><input type="checkbox" data-check-all> Check All</label>
        <label><input type="checkbox" data-check-all-item> github/fetch</label>
        <label><input type="checkbox" data-check-all-item> github/textarea-autosize</label>
        <label><input type="checkbox" data-check-all-item> github/eventlistener-polyfill</label>
        <label><input type="checkbox" data-check-all-item> github/quote-selection</label>
      </div>
    `
    subscription = subscribe(document.querySelector('[data-check-all-container]'))
  })

  afterEach(function () {
    subscription.unsubscribe()
    document.body.innerHTML = ''
  })

  it('checks all', function () {
    const checkAll = document.querySelector('[data-check-all]')
    const count = document.querySelector('[data-check-all-count]')
    const firstItem = document.querySelector('[data-check-all-item]')
    checkAll.click()
    assert.equal(count.textContent, '4')
    assert.equal(document.querySelectorAll('[data-check-all-item]:checked').length, 4)
    checkAll.click()
    assert.equal(count.textContent, '0')
    assert.equal(document.querySelectorAll('[data-check-all-item]:checked').length, 0)
    assert.notOk(checkAll.indeterminate)
    firstItem.click()
    assert.ok(checkAll.indeterminate)
    assert.notOk(checkAll.checked)
    checkAll.checked = false
    checkAll.dispatchEvent(new Event('change', {bubbles: true}))
    assert.notOk(checkAll.indeterminate)
  })

  it('checks range', function () {
    const checkAll = document.querySelector('[data-check-all]')
    const count = document.querySelector('[data-check-all-count]')
    const checkboxes = document.querySelectorAll('[data-check-all-item]')
    checkboxes[1].dispatchEvent(new MouseEvent('click'))
    assert.equal(count.textContent, '1')
    assert.equal(document.querySelectorAll('[data-check-all-item]:checked').length, 1)
    assert(checkAll.indeterminate)

    checkboxes[3].dispatchEvent(new MouseEvent('mousedown', {shiftKey: true, bubbles: true}))
    checkboxes[3].dispatchEvent(new MouseEvent('click', {shiftKey: true, bubbles: true}))
    assert.equal(count.textContent, '3')
    assert.notOk(checkboxes[0].checked)
    assert(checkboxes[1].checked)
    assert(checkboxes[2].checked)
    assert(checkboxes[3].checked)
    assert(checkAll.indeterminate)
  })

  it('checks range with label click', function () {
    const checkAll = document.querySelector('[data-check-all]')
    const count = document.querySelector('[data-check-all-count]')
    const checkboxes = document.querySelectorAll('[data-check-all-item]')
    checkboxes[1].click()
    assert.equal(count.textContent, '1')
    assert.equal(document.querySelectorAll('[data-check-all-item]:checked').length, 1)
    assert(checkAll.indeterminate)

    const label = checkboxes[3].closest('label')
    label.dispatchEvent(new MouseEvent('mousedown', {shiftKey: true, bubbles: true}))
    label.dispatchEvent(new MouseEvent('click', {shiftKey: true, bubbles: true}))
    assert.equal(count.textContent, '3')
    assert.notOk(checkboxes[0].checked)
    assert(checkboxes[1].checked)
    assert(checkboxes[2].checked)
    assert(checkboxes[3].checked)
    assert(checkAll.indeterminate)
  })
})
