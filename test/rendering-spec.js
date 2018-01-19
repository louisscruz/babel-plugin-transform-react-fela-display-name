import React from 'react';
import PropTypes from 'prop-types';
import {
  shallow,
  mount,
  generateComponentWithPlugin,
  generateComponentWithoutPlugin
} from './utils';

const MyButton = ({ text }) => <button>{text}</button>;

MyButton.propTypes = {
  text: PropTypes.string
};

MyButton.defaultProps = {
  text: ''
};

const myComponentInputCode = `
  const MyComponentRules = () => ({});
  const MyComponent = ReactFela.createComponent(MyComponentRules, 'div');
`;

describe('rendering component hierarchy', () => {
  describe('without the plugin', () => {
    // These tests are here for sanity checks.
    const MyComponent = generateComponentWithoutPlugin(myComponentInputCode);

    it('does not change the displayName', () => {
      expect(MyComponent.displayName).not.toEqual('MyComponent');
    });

    it('renders the outer wrapper with the default displayName', () => {
      const wrapper = shallow(
        <div>
          <MyComponent />
        </div>
      );
      expect(wrapper.find('MyComponentRules').exists()).toBe(true);
    });
  });

  describe('with the plugin', () => {
    const MyComponent = generateComponentWithPlugin(myComponentInputCode);

    it('changes the displayName', () => {
      expect(MyComponent.displayName).toEqual('MyComponent');
    });

    it('renders the outer wrapper with the displayName', () => {
      const wrapper = shallow(
        <div>
          <MyComponent />
        </div>
      );
      expect(wrapper.find('MyComponent').exists()).toBe(true);
    });

    it('does not mutate the inner display names', () => {
      const wrapper = mount(<MyComponent />);
      expect(wrapper.find('MyComponentRules').length).toBe(1);
      expect(wrapper.find('div').length).toBe(1);
    });
  });
});
