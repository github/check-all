describe('check-all', function() {
  let subscription
  beforeEach(function() {
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
    subscription = checkAll.default(document.querySelector('[data-check-all-container]'))
  })

  afterEach(function() {
    subscription.unsubscribe()
    document.body.innerHTML = ''
  })

  it('checks all', function() {
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

  it('checks range', function() {
    const checkAll = document.querySelector('[data-check-all]')
    const count = document.querySelector('[data-check-all-count]')
    const checkboxes = document.querySelectorAll('[data-check-all-item]')
    checkboxes[1].click()
    assert.equal(count.textContent, '1')
    assert.equal(document.querySelectorAll('[data-check-all-item]:checked').length, 1)
    assert(checkAll.indeterminate)

    const event = document.createEvent('Events')
    event.initEvent('mousedown', true, true)
    event.shiftKey = true
    checkboxes[3].dispatchEvent(event)
    checkboxes[3].click()
    assert.equal(count.textContent, '3')
    assert.notOk(checkboxes[0].checked)
    assert(checkboxes[1].checked)
    assert(checkboxes[2].checked)
    assert(checkboxes[3].checked)
    assert(checkAll.indeterminate)
  })
})
