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
import {install} from '@github/check-all'
install(document.querySelector('[data-check-all-container]'))
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
