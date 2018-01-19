# babel-plugin-transform-react-fela-display-name

## Introduction

This plugin transforms the display names of all `react-fela` components created with `createComponent` or `createComponentWithProxy` to the name of the variable to which they are assigned.

For example, given:

```js
import { createComponent } from 'react-fela';

const MyComponent = createComponent(() => ({}), 'input');
```

`<MyComponent .../>` typically renders as:

```html
<FelaComponent ...>
  <FelaComponent ...>
    <input ... />
  </FelaComponent>
</FelaComponent>
```

With this plugin, it renders as:

```html
<MyComponent ...>
  <FelaComponent ...>
    <input ... />
  </FelaComponent>
</MyComponent>
```

## Installation

```
npm install babel-plugin-transform-react-fela-display-name --save-dev
```

```
yarn add -D babel-plugin-transfrom-react-fela-display-name
```

## How It Works

This plugin works by injecting an extra line of code that sets the `displayName` after the component declaration.

For instance:

```js
import { createComponentWithProxy } from 'react-fela';

const MyComponent = createComponentWithProxy(() => ({}), 'input');
```

becomes:

```js
import { createComponentWithProxy } from 'react-fela';

const MyComponent = createComponentWithProxy(() => ({}), 'input');
MyComponent.displayName = 'MyComponent';
```

## Usage

### Via ``.babelrc` (Recommended)

```json
{
  "plugins": ["transform-react-fela-display-name"]
}
```

### Via CLI

```shell
babel --plugins transform-react-fela-display-name script.js
```

### Via Node API

```js
require('babel-core').transform('code', {
  plugins: ['transform-react-fela-display-name']
});
```

## Options

### `globalSource`

If you happen to be providing the `react-fela` package globally, you can specify the variable name under which is made so.

For instance, the following allows for this plugin to latch onto usage of `ReactFela.createComponent` or `ReactFela.createComponentWithProxy`:

```json
{
  "plugins": [
    [
      "transform-react-fela-display-name",
      {
        "globalSource": "ReactFela"
      }
    ]
  ]
}
```
