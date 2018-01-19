import PropTypes from 'prop-types';
import Enzyme, { mount as enzymeMount, shallow as enzymeShallow } from 'enzyme';
import { createRenderer } from 'fela';
import Adapter from 'enzyme-adapter-react-16';

import transformReactFelaDisplayName from '../src';

const ReactFela = require('react-fela');
const babel = require('babel-core');

Enzyme.configure({ adapter: new Adapter() });

export const mount = (node, options = {}) => {
  const renderer = createRenderer();

  const component = enzymeMount(node, {
    childContextTypes: {
      renderer: PropTypes.object
    },
    context: {
      renderer
    },
    ...options
  });

  return component;
};

export const shallow = (node, options = {}) => {
  const renderer = createRenderer();

  const component = enzymeShallow(node, {
    context: {
      renderer
    },
    ...options
  });

  return component;
};

const handleComponentGeneration = ({ shouldUsePlugin }) => componentCode => {
  const plugins = [
    [
      'module-resolver',
      {
        root: ['./src', './node_modules'],
        alias: {
          test: './test'
        }
      }
    ]
  ];

  if (shouldUsePlugin) plugins.push([transformReactFelaDisplayName, { globalSource: 'ReactFela' }]);

  const { code } = babel.transform(componentCode, {
    presets: ['env', 'react'],
    plugins
  });

  // eslint-disable-next-line no-new-func
  const MyComponentFile = new Function(
    'ReactFela',
    `
    ${code}
    return MyComponent;
    `
  );

  return MyComponentFile(ReactFela);
};

export const generateComponentWithoutPlugin = handleComponentGeneration({ shouldUsePlugin: false });
export const generateComponentWithPlugin = handleComponentGeneration({ shouldUsePlugin: true });
