# Check All

- Check/uncheck `[data-check-all]` to check/uncheck all checkboxes in a container.
- Shift click on `[data-check-all-item]` to select all checkboxes between the last checked checkbox and the target checkbox.
- Auto-update `[data-check-all-count]` to count of checked items.

## Installation

```
$ npm install @github/check-all
```

## Usage

### JS

```js
import checkAll from '@github/check-all'
checkAll(document.querySelector('[data-check-all-container]'))
```

Using a library like [selector-observer](https://github.com/josh/selector-observer), the behavior can automatically be applied to any container matching a selector.

```js
import {observe} from 'selector-observer'
import checkAll from '@github/check-all'

observe('[data-check-all-container]', { subscribe: checkAll })
```

### HTML

```html
<div data-check-all-container>
  Count: <span data-check-all-count>0</span>
  <label><input type="checkbox" data-check-all> Check All</label>
  <label><input type="checkbox" data-check-all-item> github/fetch</label>
  <label><input type="checkbox" data-check-all-item> github/textarea-autosize</label>
  <label><input type="checkbox" data-check-all-item> github/eventlistener-polyfill</label>
  <label><input type="checkbox" data-check-all-item> github/quote-selection</label>
</div>
```

## Development

```
npm install
npm test
```

## License

Distributed under the MIT license. See LICENSE for details.
