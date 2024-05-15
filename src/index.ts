type Subscription = {
  unsubscribe: () => void
}

export default function subscribe(container: HTMLElement): Subscription {
  let shiftKey = false
  let lastCheckbox: HTMLInputElement | null = null

  container.addEventListener('mousedown', onMouseDown)
  container.addEventListener('change', onChange)

  function setChecked(target: Element, input: HTMLElement, checked: boolean, indeterminate = false): void {
    if (!(input instanceof HTMLInputElement) || input.disabled) return

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
    if (event instanceof CustomEvent && event.detail) {
      const {relatedTarget} = event.detail
      if (relatedTarget && relatedTarget.hasAttribute('data-check-all-item')) {
        return
      }
    }
    const target = event.target
    if (!(target instanceof HTMLInputElement)) return
    lastCheckbox = null

    for (const input of container.querySelectorAll<HTMLElement>('[data-check-all-item]')) {
      setChecked(target, input, target.checked)
    }

    target.indeterminate = false
    updateCount()
  }

  function onMouseDown(event: MouseEvent): void {
    if (!(event.target instanceof Element)) return
    const target = event.target instanceof HTMLLabelElement ? event.target.control || event.target : event.target
    if (target.hasAttribute('data-check-all-item')) {
      shiftKey = event.shiftKey
    }
  }

  function onCheckAllItem(event: Event): void {
    if (event instanceof CustomEvent && event.detail) {
      const {relatedTarget} = event.detail
      if (
        relatedTarget &&
        (relatedTarget.hasAttribute('data-check-all') || relatedTarget.hasAttribute('data-check-all-item'))
      ) {
        return
      }
    }
    const target = event.target
    if (!(target instanceof HTMLInputElement)) return

    const itemCheckboxes = Array.from(container.querySelectorAll<HTMLElement>('[data-check-all-item]'))
    if (shiftKey && lastCheckbox) {
      const [start, end] = [itemCheckboxes.indexOf(lastCheckbox), itemCheckboxes.indexOf(target)].sort()
      for (const input of itemCheckboxes.slice(start, +end + 1 || 9e9)) {
        setChecked(target, input, target.checked)
      }
    }

    shiftKey = false
    lastCheckbox = target

    const allCheckbox = container.querySelector<HTMLElement>('[data-check-all]')
    if (allCheckbox) {
      const total = itemCheckboxes.length
      const count = itemCheckboxes.filter(checkbox => checkbox instanceof HTMLInputElement && checkbox.checked).length
      const checked = count === total
      const indeterminate = total > count && count > 0
      setChecked(target, allCheckbox, checked, indeterminate)
    }
    updateCount()
  }

  function updateCount() {
    // Update count of optional `[data-check-all-count]` element.
    const countContainer = container.querySelector('[data-check-all-count]')
    if (countContainer) {
      const count = container.querySelectorAll('[data-check-all-item]:checked').length
      countContainer.textContent = count.toString()
    }
  }

  return {
    unsubscribe: () => {
      container.removeEventListener('mousedown', onMouseDown)
      container.removeEventListener('change', onChange)
    }
  }
}
