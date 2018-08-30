/* @flow */

type State = {|
  shiftKey: boolean,
  lastCheckbox: ?HTMLElement
|}

type Subscription = {|
  unsubscribe: () => void
|}

const checkAllStates: WeakMap<Element, State> = new WeakMap()

export function subscribe(container: Element): Subscription {
  install(container)
  return {
    unsubscribe: () => {
      uninstall(container)
    }
  }
}
export function install(container: Element): void {
  checkAllStates.set(container, {shiftKey: false, lastCheckbox: null})
  container.addEventListener('mousedown', onMouseDown)
  container.addEventListener('change', onChange)
}

export function uninstall(container: Element): void {
  checkAllStates.delete(container)
  container.removeEventListener('mousedown', onMouseDown)
  container.removeEventListener('change', onChange)
}

function setChecked(target: Element, input: HTMLElement, checked: boolean, indeterminate: boolean): void {
  if (!(input instanceof HTMLInputElement)) return

  input.indeterminate = indeterminate
  if (input.checked !== checked) {
    input.checked = checked

    setTimeout(() => {
      const event = new CustomEvent('change', {
        bubbles: true,
        cancelable: false,
        detail: {relatedTarget: target}
      })
      input.dispatchEvent(event)
    })
  }
}

function onChange(event: Event): void {
  const target = event.target
  if (!(target instanceof Element)) return
  if (target.hasAttribute('data-check-all')) {
    onCheckAll(event)
  } else if (target.hasAttribute('data-check-all-item')) {
    onCheckAllItem(event)
  }
}

function onCheckAll(event: Event): void {
  if (event instanceof CustomEvent) {
    const {relatedTarget} = event.detail
    if (relatedTarget && relatedTarget.hasAttribute('data-check-all-item')) {
      return
    }
  }
  const target = event.target
  if (!(target instanceof HTMLInputElement)) return
  const container = event.currentTarget
  if (!(container instanceof HTMLElement)) return
  const state = checkAllStates.get(container)
  if (!state) return
  checkAllStates.set(container, {shiftKey: state.shiftKey, lastCheckbox: null})

  for (const input of container.querySelectorAll('[data-check-all-item]')) {
    setChecked(target, input, target.checked, false)
  }
  updateCount(container)
}

function onMouseDown(event: MouseEvent): void {
  if (!(event.target instanceof Element)) return
  if (event.target.hasAttribute('data-check-all-item')) {
    const container = event.currentTarget
    if (!(container instanceof HTMLElement)) return
    const state = checkAllStates.get(container)
    checkAllStates.set(container, {
      shiftKey: event.shiftKey,
      lastCheckbox: state && state.lastCheckbox
    })
  }
}

function onCheckAllItem(event: Event): void {
  if (event instanceof CustomEvent) {
    const {relatedTarget} = event.detail
    if (relatedTarget.hasAttribute('data-check-all') || relatedTarget.hasAttribute('data-check-all-item')) {
      return
    }
  }
  const target = event.target
  if (!(target instanceof HTMLInputElement)) return
  const container = event.currentTarget
  if (!(container instanceof HTMLElement)) return

  const allCheckbox = container.querySelector('[data-check-all]')
  if (!allCheckbox) return
  const itemCheckboxes = Array.from(container.querySelectorAll('[data-check-all-item]'))
  const state = checkAllStates.get(container)
  if (state && state.shiftKey && state.lastCheckbox) {
    const [start, end] = [itemCheckboxes.indexOf(state.lastCheckbox), itemCheckboxes.indexOf(target)].sort()
    for (const input of itemCheckboxes.slice(start, +end + 1 || 9e9)) {
      setChecked(target, input, target.checked, false)
    }
  }

  checkAllStates.set(container, {shiftKey: false, lastCheckbox: target})

  const total = itemCheckboxes.length
  const count = itemCheckboxes.filter(checkbox => checkbox instanceof HTMLInputElement && checkbox.checked).length
  const checked = count === total
  const indeterminate = total > count && count > 0
  setChecked(target, allCheckbox, checked, indeterminate)
  updateCount(container)
}

function updateCount(container) {
  // Update count of optional `[data-check-all-count]` element.
  const countContainer = container.querySelector('[data-check-all-count]')
  if (countContainer) {
    const count = container.querySelectorAll('[data-check-all-item]:checked').length
    countContainer.textContent = count.toString()
  }
}
