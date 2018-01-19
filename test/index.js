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
        const MyComponent = createComponent(MyComponentRules, 'div');
      `,
      output: `
        import { createComponent } from 'react-fela';
        const MyComponentRules = () => ({});
        const MyComponent = createComponent(MyComponentRules, 'div');
        MyComponent.displayName = 'MyComponent'
      `
    },
    'adds a line setting the displayName in simple scenarios when using createComponentWithProxy': {
      code: `
        import { createComponentWithProxy } from 'react-fela';
        const MyComponentRules = () => ({});
        const MyComponent = createComponentWithProxy(MyComponentRules, 'div');
      `,
      output: `
        import { createComponentWithProxy } from 'react-fela';
        const MyComponentRules = () => ({});
        const MyComponent = createComponentWithProxy(MyComponentRules, 'div');
        MyComponent.displayName = 'MyComponent'
      `
    },
    'does not add a line for functions that do not match the correct name': `
      import { createComponentWithProxy } from 'react-fela';
      const createComponentWithSomeOtherThing = el => el;
      const MyComponentRules = () => ({});
      const MyComponent = createComponentWithSomeOtherThing(MyComponentRules, 'div');
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
        const MyComponent = intermediaryVariable(MyComponentRules, 'div');
      `,
      output: `
        import { createComponent } from 'react-fela';
        const intermediaryVariable = createComponent;
        const MyComponentRules = () => ({});
        const MyComponent = intermediaryVariable(MyComponentRules, 'div');
        MyComponent.displayName = 'MyComponent'
      `
    },
    'adds a line setting the displayName in scenarios where createComponentWithProxy is used through one intermediary variable': {
      code: `
        import { createComponentWithProxy } from 'react-fela';
        const intermediaryVariable = createComponentWithProxy;
        const MyComponentRules = () => ({});
        const MyComponent = intermediaryVariable(MyComponentRules, 'div');
      `,
      output: `
        import { createComponentWithProxy } from 'react-fela';
        const intermediaryVariable = createComponentWithProxy;
        const MyComponentRules = () => ({});
        const MyComponent = intermediaryVariable(MyComponentRules, 'div');
        MyComponent.displayName = 'MyComponent'
      `
    },
    'adds a line setting the displayName in scenarios where createComponent is from a default import of react-fela': {
      code: `
        import ReactFela from 'react-fela';
        const MyComponentRules = () => ({});
        const MyComponent = ReactFela.createComponent(MyComponentRules, 'div');
      `,
      output: `
        import ReactFela from 'react-fela';
        const MyComponentRules = () => ({});
        const MyComponent = ReactFela.createComponent(MyComponentRules, 'div');
        MyComponent.displayName = 'MyComponent'
      `
    },
    'adds a line setting the displayName in scenarios where createComponentWithProxy is from a default import of react-fela': {
      code: `
        import ReactFela from 'react-fela';
        const MyComponentRules = () => ({});
        const MyComponent = ReactFela.createComponentWithProxy(MyComponentRules, 'div');
      `,
      output: `
        import ReactFela from 'react-fela';
        const MyComponentRules = () => ({});
        const MyComponent = ReactFela.createComponentWithProxy(MyComponentRules, 'div');
        MyComponent.displayName = 'MyComponent'
      `
    },
    'does not add a line setting the displayName in scenarios where createComponent is a property on a non-react-fela object': `
        const ReactFela = {
          createComponent: () => ({})
        };
        const MyComponentRules = () => ({});
        const MyComponent = ReactFela.createComponent(MyComponentRules, 'div');
    `,
    'does not add a line setting the displayName in scenarios where createComponentWithProxy is a property on a non-react-fela object': `
        const ReactFela = {
          createComponentWithProxy: () => ({})
        };
        const MyComponentRules = () => ({});
        const MyComponent = ReactFela.createComponentWithProxy(MyComponentRules, 'div');
    `,
    'does not by default add a line setting the displayName in scenarios where createComponent is global': `
      const MyComponentRules = () => ({});
      const MyComponent = createComponent(MyComponentRules, 'div');
    `,
    'does not by default add a line setting the displayName in scenarios where createComponentWithProxy is global': `
      const MyComponentRules = () => ({});
      const MyComponent = createComponentWithProxy(MyComponentRules, 'div');
    `,
    'adds a line setting the displayName in scenarios where createComponent is global and the option is passed to do so': {
      pluginOptions: {
        globalSource: 'ReactFela'
      },
      code: `
        const MyComponentRules = () => ({});
        const MyComponent = ReactFela.createComponent(MyComponentRules, 'div');
      `,
      output: `
        const MyComponentRules = () => ({});
        const MyComponent = ReactFela.createComponent(MyComponentRules, 'div');
        MyComponent.displayName = 'MyComponent'
      `
    },
    'adds a line setting the displayName in scenarios where createComponentWithProxy is global and the option is passed to do so': {
      pluginOptions: {
        globalSource: 'ReactFela'
      },
      code: `
        const MyComponentRules = () => ({});
        const MyComponent = ReactFela.createComponentWithProxy(MyComponentRules, 'div');
      `,
      output: `
        const MyComponentRules = () => ({});
        const MyComponent = ReactFela.createComponentWithProxy(MyComponentRules, 'div');
        MyComponent.displayName = 'MyComponent'
      `
    },
    'does not add a line setting the displayName when the global does not match the globalSource': {
      pluginOptions: {
        globalSource: 'SomethingWeird'
      },
      code: `
        const MyComponentRules = () => ({});
        const MyComponent = ReactFela.createComponentWithProxy(MyComponentRules, 'div');
      `,
      output: `
        const MyComponentRules = () => ({});
        const MyComponent = ReactFela.createComponentWithProxy(MyComponentRules, 'div');
      `
    },
    'adds a line setting the displayName in simple scenarios when using createComponent when brought in through require property': {
      code: `
        const createComponent = require('react-fela').createComponent;
        const MyComponentRules = () => ({});
        const MyComponent = createComponent(MyComponentRules, 'div');
      `,
      output: `
        const createComponent = require('react-fela').createComponent;
        const MyComponentRules = () => ({});
        const MyComponent = createComponent(MyComponentRules, 'div');
        MyComponent.displayName = 'MyComponent'
      `
    },
    'adds a line setting the displayName in simple scenarios when using createComponentWithProxy when brought in through require property': {
      code: `
        const createComponentWithProxy = require('react-fela').createComponentWithProxy;
        const MyComponentRules = () => ({});
        const MyComponent = createComponentWithProxy(MyComponentRules, 'div');
      `,
      output: `
        const createComponentWithProxy = require('react-fela').createComponentWithProxy;
        const MyComponentRules = () => ({});
        const MyComponent = createComponentWithProxy(MyComponentRules, 'div');
        MyComponent.displayName = 'MyComponent'
      `
    },
    'adds a line setting the displayName in simple scenarios when using createComponent when brought in through require': {
      code: `
        const ReactFela = require('react-fela');
        const MyComponentRules = () => ({});
        const MyComponent = ReactFela.createComponent(MyComponentRules, 'div');
      `,
      output: `
        const ReactFela = require('react-fela');
        const MyComponentRules = () => ({});
        const MyComponent = ReactFela.createComponent(MyComponentRules, 'div');
        MyComponent.displayName = 'MyComponent'
      `
    },
    'adds a line setting the displayName in simple scenarios when using createComponentWithProxy when brought in through require': {
      code: `
        const ReactFela = require('react-fela');
        const MyComponentRules = () => ({});
        const MyComponent = ReactFela.createComponentWithProxy(MyComponentRules, 'div');
      `,
      output: `
        const ReactFela = require('react-fela');
        const MyComponentRules = () => ({});
        const MyComponent = ReactFela.createComponentWithProxy(MyComponentRules, 'div');
        MyComponent.displayName = 'MyComponent'
      `
    }
  }
});
