import React from 'react';
import { mount } from 'enzyme';
import '../../../../../../__mocks__/matchMedia';
import ClearFiltersButton from 'components/ClearFiltersButton/ClearFiltersButton';
import Location from '../Location/Location';
import RewardsLevel from '../RewardsLevel/RewardsLevel';
import CategoriesFilter from '../Categories/Categories';
import WishList from '../WishList/WishList';
import FilterBlock from './FilterBlock';
import {
  INFO_DEFAULT_PARAMS,
  INFO_PAGE_QUERY,
  INFO_LOCATION_ID,
  INFO_BUCKET_ID,
  INFO_CATEGORY_ID
} from '../../../constants';

const onParamsChangeMock = jest.fn();
const fetchInfoCategoriesMock = jest.fn();

const locations = [
  { id: 1, name: 'LA' },
  { id: 2, name: 'SA' }
];

const bucketsList = [
  { value: 1, name: 'Ivory' },
  { value: 2, name: 'Aviator' }
];

const categoriesList = [
  { id: 1, name: 'Adrenaline' },
  { id: 2, name: 'Food & Drink' }
];

let wrapper;

const DEFAULT_PROPS = {
  wishlistTotalCount: 0,
  infoCategoriesList: categoriesList,
  urlParams: {},
  programList: [],
  isOnlyActivated: true,
  onParamsChange: onParamsChangeMock,
  locations,
  bucketsList,
  fetchInfoCategories: fetchInfoCategoriesMock,
  locationsData: {},
  isFetching: false,
  dataReceived: true,
  hasError: false
};

const setup = props => mount(<FilterBlock {...DEFAULT_PROPS} {...props} />);

describe('FilterBlock', () => {
  beforeEach(() => {
    fetchInfoCategoriesMock.mockClear();
  });

  it('renders correct', () => {
    wrapper = setup();
    expect(wrapper.exists()).toBe(true);
  });

  it('components renders correctly', () => {
    wrapper = setup();
    expect(wrapper.find(Location).exists()).toBe(true);
    expect(wrapper.find(RewardsLevel).exists()).toBe(true);
    expect(wrapper.find(CategoriesFilter).exists()).toBe(true);
    expect(wrapper.find(ClearFiltersButton).exists()).toBe(true);
    expect(wrapper.find(WishList).exists()).toBe(true);
  });

  it('reset params if reset button clicked', () => {
    wrapper = setup();
    wrapper.find(ClearFiltersButton).simulate('click');
    expect(onParamsChangeMock).toHaveBeenCalledWith(INFO_DEFAULT_PARAMS, true);
  });

  it('change params with selected location', () => {
    wrapper = setup();
    wrapper
      .find(Location)
      .props()
      .onChange(locations[0], 'location');
    expect(onParamsChangeMock).toHaveBeenCalledWith({
      [INFO_PAGE_QUERY]: 1,
      [INFO_LOCATION_ID]: 1
    });
  });

  it('change params with selected bucket', () => {
    wrapper = setup();
    wrapper
      .find(RewardsLevel)
      .props()
      .onChange(bucketsList[0], 'bucket');
    expect(onParamsChangeMock).toHaveBeenCalledWith({
      [INFO_PAGE_QUERY]: 1,
      [INFO_BUCKET_ID]: 1
    });
  });

  it('change params with selected categories', () => {
    wrapper = setup();
    wrapper
      .find(CategoriesFilter)
      .props()
      .onChange([categoriesList[0]], 'category');
    expect(onParamsChangeMock).toHaveBeenCalledWith({
      [INFO_PAGE_QUERY]: 1,
      [INFO_CATEGORY_ID]: [1]
    });
  });
});
