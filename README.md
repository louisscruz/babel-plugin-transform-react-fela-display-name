[![npm version](https://badge.fury.io/js/babel-plugin-transform-react-fela-display-name.svg)](https://badge.fury.io/js/babel-plugin-transform-react-fela-display-name)
[![codecov](https://codecov.io/gh/louisscruz/babel-plugin-transform-react-fela-display-name/branch/master/graph/badge.svg)](https://codecov.io/gh/louisscruz/babel-plugin-transform-react-fela-display-name)
[![MIT Licence](https://badges.frapsoft.com/os/mit/mit.svg?v=103)](https://opensource.org/licenses/mit-license.php)

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

### Via `.babelrc` (Recommended)

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

### `functionNameRegEx`

You can provide a custom regular expression to check against for function usage instead of the original one which will only match `createComponent` and
`createComponentWithProxy`.

For instance, the following allows for this plugin to latch onto usage of `customFunction`.

```json
{
  "plugins": [
    [
      "transform-react-fela-display-name",
      {
        "functionNameRegEx": "customFunction"
      }
    ]
  ]
}
```

### `reactFelaPackageRegEx`

You can provide a custom regular expression to check against instead of the original one for package name which will only match `react-fela`.

For instance, the following allows for this plugin to latch onto usage of `createComponent` imported from `custom-package`.

```json
{
  "plugins": [
    [
      "transform-react-fela-display-name",
      {
        "reactFelaPackageRegEx": "custom-package"
      }
    ]
  ]
}
```

## Changelog

Changes to this package are recorded in the [CHANGELOG.md](./CHANGELOG.md).

## Contributing

All pull requests must pass the CI status checks.
