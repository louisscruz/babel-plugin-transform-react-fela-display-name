import pluginTester from 'babel-plugin-tester';
import displayNamePlugin from '../src/index';

pluginTester({
  plugin: displayNamePlugin,
  pluginName: 'transform-react-fela-display-name',
  tests: {
    'adds a line setting the displayName in simple scenarios when using createComponent': {
      code: `
        import { createComponent } from 'react-fela';
        const MyComponentRules = () => ({});
        const MyComponent = createComponent(MyComonentRules, 'div');
      `,
      output: `
        import { createComponent } from 'react-fela';
        const MyComponentRules = () => ({});
        const MyComponent = createComponent(MyComonentRules, 'div');
        MyComponent.displayName = 'MyComponent'
      `
    },
    'adds a line setting the displayName in simple scenarios when using createComponentWithProxy': {
      code: `
        import { createComponentWithProxy } from 'react-fela';
        const MyComponentRules = () => ({});
        const MyComponent = createComponentWithProxy(MyComonentRules, 'div');
      `,
      output: `
        import { createComponentWithProxy } from 'react-fela';
        const MyComponentRules = () => ({});
        const MyComponent = createComponentWithProxy(MyComonentRules, 'div');
        MyComponent.displayName = 'MyComponent'
      `
    },
    'does not add a line for functions that do not match the correct name': `
      import { createComponentWithProxy } from 'react-fela';
      const MyComponentRules = () => ({});
      const MyComponent = createComponentWithSomeOtherThing(MyComonentRules, 'div');
    `
  }
});
