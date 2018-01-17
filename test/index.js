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
      const createComponentWithSomeOtherThing = el => el;
      const MyComponentRules = () => ({});
      const MyComponent = createComponentWithSomeOtherThing(MyComonentRules, 'div');
    `,
    'does not add a line for non-react-fela createComponent function calls': `
      const createComponent = el => el;
      const response = createComponent('test');
    `,
    'does not add a line for non-react-fela createComponentWithProxy function calls': `
      const createComponentWithProxy = el => el;
      const response = createComponentWithProxy('test');
    `,
    'adds a line setting the displayName in scenarios where createComponent is used through one intermediary variable': {
      code: `
        import { createComponent } from 'react-fela';
        const intermediaryVariable = createComponent;
        const MyComponentRules = () => ({});
        const MyComponent = intermediaryVariable(MyComonentRules, 'div');
      `,
      output: `
        import { createComponent } from 'react-fela';
        const intermediaryVariable = createComponent;
        const MyComponentRules = () => ({});
        const MyComponent = intermediaryVariable(MyComonentRules, 'div');
        MyComponent.displayName = 'MyComponent'
      `
    },
    'adds a line setting the displayName in scenarios where createComponentWithProxy is used through one intermediary variable': {
      code: `
        import { createComponentWithProxy } from 'react-fela';
        const intermediaryVariable = createComponentWithProxy;
        const MyComponentRules = () => ({});
        const MyComponent = intermediaryVariable(MyComonentRules, 'div');
      `,
      output: `
        import { createComponentWithProxy } from 'react-fela';
        const intermediaryVariable = createComponentWithProxy;
        const MyComponentRules = () => ({});
        const MyComponent = intermediaryVariable(MyComonentRules, 'div');
        MyComponent.displayName = 'MyComponent'
      `
    }
  }
});
