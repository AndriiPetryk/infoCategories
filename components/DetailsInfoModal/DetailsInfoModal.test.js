import React from 'react';
import { mount, shallow } from 'enzyme';
import '../../../../../__mocks__/matchMedia';
import ExperienceDetailsInfo from 'components/ExperienceDetailsInfo/ExperienceDetailsInfo';
import PrevNextButtons from 'components/PrevNextButtons/PrevNextButtons';
import Modal from 'components/Modal/Modal';
import DetailsInfoModal from './DetailsInfoModal';

const onModalCloseMock = jest.fn();
const onFetchInfoDetailsMock = jest.fn();
const onNextClickMock = jest.fn();
const onPrevClickMock = jest.fn();
const onWishlistIconClickMock = jest.fn();
const isWishlistedMock = jest.fn();

let wrapper;

const DEFAULT_PROPS = {
  onModalClose: onModalCloseMock,
  onFetchInfoDetails: onFetchInfoDetailsMock,
  onWishlistIconClick: onWishlistIconClickMock,
  isWishlisted: isWishlistedMock,
  infoId: 380,
  isDetailsModalOpen: true,
  infosIds: [354, 765, 980],
  wishlistTotalCount: 0,
  infoTitle: 'Bike SF and the Golden Gate Bridge',
  subDescription: '',
  catalogDetailImagesUrl:
    'https://ucarecdn.com/12ef4e1e-abe0-4d92-83e0-6984502898e6~3/',
  location: 'San Francisco, CA',
  groupSize: 2,
  duration: '1 day',
  infoCategory: 'Active',
  infoDetailsReceived: false,
  isFetching: false,
  dataReceived: true,
  hasError: false
};

const setup = props =>
  shallow(<DetailsInfoModal {...DEFAULT_PROPS} {...props} />);

describe('DetailsInfoModal', () => {
  beforeEach(() => {
    wrapper = setup();
  });

  it('renders correct', () => {
    expect(wrapper.exists()).toBe(true);
  });

  it('components renders correctly', () => {
    expect(wrapper.find(Modal).exists()).toBe(true);
    expect(wrapper.find(ExperienceDetailsInfo).exists()).toBe(true);
    expect(wrapper.find(PrevNextButtons).exists()).toBe(true);
  });

  test('on buttons NextArrow and PrevArrow called', () => {
    const ButtonWrapper = mount(
      <PrevNextButtons
        onNextClick={onNextClickMock}
        onPrevClick={onPrevClickMock}
      />
    );
    ButtonWrapper.find('NextArrow').simulate('click');
    ButtonWrapper.find('PrevArrow').simulate('click');
    expect(onNextClickMock).toHaveBeenCalledTimes(1);
    expect(onPrevClickMock).toHaveBeenCalledTimes(1);
  });
});
