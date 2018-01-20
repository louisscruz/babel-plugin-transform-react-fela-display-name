import pluginTester from 'babel-plugin-tester';
import displayNamePlugin from '../src';

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
        MyComponent.displayName = 'MyComponent';
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
        MyComponent.displayName = 'MyComponent';
      `
    },
    'adds a line setting the displayName in scenarios with multiple imports when using createComponent': {
      code: `
        import { somethingElse, createComponent } from 'react-fela';
        const MyComponentRules = () => ({});
        const MyComponent = createComponent(MyComponentRules, 'div');
      `,
      output: `
        import { somethingElse, createComponent } from 'react-fela';
        const MyComponentRules = () => ({});
        const MyComponent = createComponent(MyComponentRules, 'div');
        MyComponent.displayName = 'MyComponent';
      `
    },
    'adds a line setting the displayName in scenarios with multiple imports when using createComponentWithProxy': {
      code: `
        import { somethingElse, createComponentWithProxy } from 'react-fela';
        const MyComponentRules = () => ({});
        const MyComponent = createComponentWithProxy(MyComponentRules, 'div');
      `,
      output: `
        import { somethingElse, createComponentWithProxy } from 'react-fela';
        const MyComponentRules = () => ({});
        const MyComponent = createComponentWithProxy(MyComponentRules, 'div');
        MyComponent.displayName = 'MyComponent';
      `
    },
    'adds a line setting the displayName in scenarios with multiple package imports when using createComponent': {
      code: `
        import something from 'something';
        import { somethingElse } from 'react-fela';
        import { createComponent } from 'react-fela';
        const MyComponentRules = () => ({});
        const MyComponent = createComponent(MyComponentRules, 'div');
      `,
      output: `
        import something from 'something';
        import { somethingElse } from 'react-fela';
        import { createComponent } from 'react-fela';
        const MyComponentRules = () => ({});
        const MyComponent = createComponent(MyComponentRules, 'div');
        MyComponent.displayName = 'MyComponent';
      `
    },
    'adds a line setting the displayName in scenarios with multiple package imports when using createComponentWithProxy': {
      code: `
        import something from 'something';
        import { somethingElse } from 'react-fela';
        import { createComponentWithProxy } from 'react-fela';
        const MyComponentRules = () => ({});
        const MyComponent = createComponentWithProxy(MyComponentRules, 'div');
      `,
      output: `
        import something from 'something';
        import { somethingElse } from 'react-fela';
        import { createComponentWithProxy } from 'react-fela';
        const MyComponentRules = () => ({});
        const MyComponent = createComponentWithProxy(MyComponentRules, 'div');
        MyComponent.displayName = 'MyComponent';
      `
    },
    'adds a line setting the displayName directly after the usage of createComponent': {
      code: `
        import { createComponent } from 'react-fela';
        const x = 1;
        const MyComponentRules = () => ({});
        const MyComponent = createComponent(MyComponentRules, 'div');
        const y = 2;
        const MyOtherComponentRules = () => ({});
        const MyOtherComponent = createComponent(MyOtherComponentRules, 'div');
        const z = 3;
      `,
      output: `
        import { createComponent } from 'react-fela';
        const x = 1;
        const MyComponentRules = () => ({});
        const MyComponent = createComponent(MyComponentRules, 'div');
        MyComponent.displayName = 'MyComponent';
        const y = 2;
        const MyOtherComponentRules = () => ({});
        const MyOtherComponent = createComponent(MyOtherComponentRules, 'div');
        MyOtherComponent.displayName = 'MyOtherComponent';
        const z = 3;
      `
    },
    'adds a line setting the displayName directly after the usage of createComponentWithProxy': {
      code: `
        import { createComponentWithProxy } from 'react-fela';
        const x = 1;
        const MyComponentRules = () => ({});
        const MyComponent = createComponentWithProxy(MyComponentRules, 'div');
        const y = 2;
        const MyOtherComponentRules = () => ({});
        const MyOtherComponent = createComponentWithProxy(MyOtherComponentRules, 'div');
        const z = 3;
      `,
      output: `
        import { createComponentWithProxy } from 'react-fela';
        const x = 1;
        const MyComponentRules = () => ({});
        const MyComponent = createComponentWithProxy(MyComponentRules, 'div');
        MyComponent.displayName = 'MyComponent';
        const y = 2;
        const MyOtherComponentRules = () => ({});
        const MyOtherComponent = createComponentWithProxy(MyOtherComponentRules, 'div');
        MyOtherComponent.displayName = 'MyOtherComponent';
        const z = 3;
      `
    },
    'adds a line setting the displayName directly after the mixed usage of createComponent and createComponentWithProxy': {
      code: `
        import { createComponent, createComponentWithProxy } from 'react-fela';
        const x = 1;
        const MyComponentRules = () => ({});
        const MyComponent = createComponent(MyComponentRules, 'div');
        const y = 2;
        const MyOtherComponentRules = () => ({});
        const MyOtherComponent = createComponentWithProxy(MyOtherComponentRules, 'div');
        const z = 3;
      `,
      output: `
        import { createComponent, createComponentWithProxy } from 'react-fela';
        const x = 1;
        const MyComponentRules = () => ({});
        const MyComponent = createComponent(MyComponentRules, 'div');
        MyComponent.displayName = 'MyComponent';
        const y = 2;
        const MyOtherComponentRules = () => ({});
        const MyOtherComponent = createComponentWithProxy(MyOtherComponentRules, 'div');
        MyOtherComponent.displayName = 'MyOtherComponent';
        const z = 3;
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
        MyComponent.displayName = 'MyComponent';
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
        MyComponent.displayName = 'MyComponent';
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
        MyComponent.displayName = 'MyComponent';
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
        MyComponent.displayName = 'MyComponent';
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
        MyComponent.displayName = 'MyComponent';
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
        MyComponent.displayName = 'MyComponent';
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
        MyComponent.displayName = 'MyComponent';
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
        MyComponent.displayName = 'MyComponent';
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
        MyComponent.displayName = 'MyComponent';
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
        MyComponent.displayName = 'MyComponent';
      `
    },
    'adds a line after the class setting the displayName when using createComponent when the assignment is a static property of a class': {
      // The babelrc brings in the necessary transform-class-properties plugin.
      babelOptions: {
        filename: __filename,
        babelrc: true
      },
      code: `
        import React from 'react';
        import { createComponent } from 'react-fela';

        const MyChildComponentRules = () => ({});

        class MyParentComponent extends React.Component {
          static MyChildComponent = createComponent(MyChildComponentRules, 'div');

          render() {
            return (
              <MyParentComponent.MyChildComponent />
            )
          }
        }
      `,
      snapshot: true
    },
    'adds a line after the class setting the displayName when using createComponentWithProxy when the assignment is a static property of a class': {
      // The babelrc brings in the necessary transform-class-properties plugin.
      babelOptions: {
        filename: __filename,
        babelrc: true
      },
      code: `
        import React from 'react';
        import { createComponentWithProxy } from 'react-fela';

        const MyChildComponentRules = () => ({});

        class MyParentComponent extends React.Component {
          static MyChildComponent = createComponentWithProxy(MyChildComponentRules, 'div');

          render() {
            return (
              <MyParentComponent.MyChildComponent />
            )
          }
        }
      `,
      snapshot: true
    },
    'adds a line after the class setting the displayName when using createComponent when the assignment is a static property of a class when from an object': {
      // The babelrc brings in the necessary transform-class-properties plugin.
      babelOptions: {
        filename: __filename,
        babelrc: true
      },
      code: `
        import React from 'react';
        import ReactFela from 'react-fela';

        const MyChildComponentRules = () => ({});

        class MyParentComponent extends React.Component {
          static MyChildComponent = ReactFela.createComponent(MyChildComponentRules, 'div');

          render() {
            return (
              <MyParentComponent.MyChildComponent />
            )
          }
        }
      `,
      snapshot: true
    },
    'adds a line after the class setting the displayName when using createComponentWithProxy when the assignment is a static property of a class when from an object': {
      // The babelrc brings in the necessary transform-class-properties plugin.
      babelOptions: {
        filename: __filename,
        babelrc: true
      },
      code: `
        import React from 'react';
        import ReactFela from 'react-fela';

        const MyChildComponentRules = () => ({});

        class MyParentComponent extends React.Component {
          static MyChildComponent = ReactFela.createComponentWithProxy(MyChildComponentRules, 'div');

          render() {
            return (
              <MyParentComponent.MyChildComponent />
            )
          }
        }
      `,
      snapshot: true
    },
    'adds a line after the class setting the displayName when using createComponent when the assignment is a static property of a class when global': {
      pluginOptions: {
        globalSource: 'ReactFela'
      },
      // The babelrc brings in the necessary transform-class-properties plugin.
      babelOptions: {
        filename: __filename,
        babelrc: true
      },
      code: `
        import React from 'react';

        const MyChildComponentRules = () => ({});

        class MyParentComponent extends React.Component {
          static MyChildComponent = ReactFela.createComponent(MyChildComponentRules, 'div');

          render() {
            return (
              <MyParentComponent.MyChildComponent />
            )
          }
        }
      `,
      snapshot: true
    },
    'adds a line after the class setting the displayName when using createComponentWithProxy when the assignment is a static property of a class when global': {
      pluginOptions: {
        globalSource: 'ReactFela'
      },
      // The babelrc brings in the necessary transform-class-properties plugin.
      babelOptions: {
        filename: __filename,
        babelrc: true
      },
      code: `
        import React from 'react';

        const MyChildComponentRules = () => ({});

        class MyParentComponent extends React.Component {
          static MyChildComponent = ReactFela.createComponentWithProxy(MyChildComponentRules, 'div');

          render() {
            return (
              <MyParentComponent.MyChildComponent />
            )
          }
        }
      `,
      snapshot: true
    }
  }
});
