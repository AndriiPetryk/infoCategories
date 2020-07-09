import React from 'react';
import { mount } from 'enzyme';
import '../../../../../../__mocks__/matchMedia';
import WishList from './WishList';

let wrapper;

const setup = props => mount(<WishList {...props} />);

describe('WishList', () => {
  beforeEach(() => {});

  it('renders correct', () => {
    wrapper = setup();
    expect(wrapper.exists()).toBe(true);
  });

  it('components text renders correctly', () => {
    wrapper = setup();
    expect(wrapper.text()).toBe('My wishlist');
  });
});
