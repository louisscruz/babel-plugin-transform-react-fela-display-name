# babel-plugin-transform-react-fela-display-name

## Introduction

This plugin transforms the display names of all `react-fela` components created with `createComponent` or `createComponentWithProxy` to the name of the variable to which they are assigned.

For example:

```js
import { createComponent } from 'react-fela';

const MyComponent = createComponent(() => ({}), 'input');
```

typically renders as:

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
