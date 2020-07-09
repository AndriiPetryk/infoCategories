import React from 'react';
import { shallow } from 'enzyme';
import '../../../__mocks__/matchMedia';
import Info from './Info';

describe('Info', () => {
  it('renders correctly', () => {
    const wrapper = shallow(<Info />);
    expect(wrapper.exists()).toBe(true);
  });
});
