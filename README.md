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
