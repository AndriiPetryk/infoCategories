import React from 'react';
import { mount } from 'enzyme';
import '../../../../../__mocks__/matchMedia';
import { MemoryRouter, Route } from 'react-router-dom';
import PropTypes from 'prop-types';
import CircleLoader from 'components/CircleLoader/CircleLoader';
import PaginationDetails from 'components/PaginationDetails/PaginationDetails';
import PreviewInfoTile from 'components/PreviewInfoTile/PreviewInfoTile';
import HasError from './HasError';
import NoResults from './NoResults';
import InfoContent from './InfoContent';

import {
  INFO_DEFAULT_PARAMS,
  INFO_PAGE_QUERY,
  INFO_BUCKET_ID,
  INFO_LOCATION_ID
} from '../../constants';

const onParamsChangeMock = jest.fn();
const fetchinfoDetailsMock = jest.fn();
const fetchInfoMock = jest.fn();
const fetchProgramListMock = jest.fn();
const fetchBucketListMock = jest.fn();
const fetchLocationsMock = jest.fn();

jest.mock('../DetailsInfoModal/DetailsInfoModalContainer', () => () =>
  'ActivityFeedFiltersContainer'
);

jest.mock('../Filters/FilterBlock/FilterBlockContainer', () => () =>
  'ActivityFeedItemContainer'
);
let wrapper;

const DEFAULT_PROPS = {
  Info: [
    {
      id: 40,
      name: 'Introduction to Flying Trapeze ',
      catalog_cover_image_url:
        'https://ucarecdn.com/61a71445-0575-4ce9-b4b6-bd9026619a45/',
      tagline: "'Damn everything but the circus.' - E. E. Cummings. ",
      primary_experience_category: {
        id: 1,
        name: 'Adrenaline'
      }
    }
  ],
  infosIds: [354, 765, 980],
  wishlistedOfferingsIds: [],
  InfoCount: 0,
  InfoTotalCount: 0,
  InfoPageCount: 3,
  defaultBucketId: 6,
  locationId: 2,
  urlParams: INFO_DEFAULT_PARAMS,
  fetchInfo: fetchInfoMock,
  fetchinfoDetails: fetchinfoDetailsMock,
  fetchBucketList: fetchBucketListMock,
  fetchProgramList: fetchProgramListMock,
  fetchLocations: fetchLocationsMock,
  onParamsChange: onParamsChangeMock,
  areFiltersApplied: false,
  isFetching: false,
  dataReceived: true,
  initialDataReceived: false,
  hasError: false
};

const RouteWrapper = ({ children }) => (
  <MemoryRouter>
    <Route>{children}</Route>
  </MemoryRouter>
);

RouteWrapper.propTypes = {
  children: PropTypes.node.isRequired
};

const setup = props =>
  mount(<InfoContent {...DEFAULT_PROPS} {...props} />, {
    wrappingComponent: RouteWrapper
  });

describe('InfoContent', () => {
  beforeEach(() => {
    fetchInfoMock.mockClear();
    fetchBucketListMock.mockClear();
    fetchProgramListMock.mockClear();
    fetchLocationsMock.mockClear();
    onParamsChangeMock.mockClear();
    wrapper = setup();
  });

  it('components renders correctly', () => {
    expect(wrapper.find(CircleLoader).exists()).toBe(false);
    expect(wrapper.find(PaginationDetails).exists()).toBe(true);
    expect(wrapper.find(PreviewInfoTile).exists()).toBe(true);
    expect(wrapper.find(HasError).exists()).toBe(false);
    expect(wrapper.find(NoResults).exists()).toBe(false);
  });

  it('fetches programs, locations and buckets on mount', () => {
    expect(fetchBucketListMock).toHaveBeenCalledTimes(1);
    expect(fetchProgramListMock).toHaveBeenCalledTimes(1);
    expect(fetchLocationsMock).toHaveBeenCalledTimes(1);
  });

  it('changes url to trigger fetching experiences when programs and buckets are loaded', () => {
    expect(fetchInfoMock).toHaveBeenCalledTimes(0);
    wrapper.setProps({
      initialDataReceived: true
    });

    expect(onParamsChangeMock).toHaveBeenCalledWith(
      expect.objectContaining({
        [INFO_BUCKET_ID]: DEFAULT_PROPS.defaultBucketId,
        [INFO_LOCATION_ID]: DEFAULT_PROPS.locationId
      })
    );
  });

  it('render loader if data is not received and data fetching', () => {
    wrapper = setup({ isFetching: true, dataReceived: false });
    expect(wrapper.find(CircleLoader).exists()).toBe(true);
    expect(wrapper.find(PaginationDetails).exists()).toBe(true);
    expect(wrapper.find(PreviewInfoTile).exists()).toBe(false);
    expect(wrapper.find(HasError).exists()).toBe(false);
    expect(wrapper.find(NoResults).exists()).toBe(false);
  });

  it('shows no result if filters are not applied and experiences are not sent', () => {
    wrapper = setup({
      dataReceived: true,
      infosIds: [],
      areFiltersApplied: true
    });
    expect(wrapper.find(NoResults).exists()).toBe(true);
    expect(wrapper.find(CircleLoader).exists()).toBe(false);
    expect(wrapper.find(PreviewInfoTile).exists()).toBe(false);
    expect(wrapper.find(PaginationDetails).exists()).toBe(true);
    expect(wrapper.find(HasError).exists()).toBe(false);
  });

  it('fetches new experiences data if params change', () => {
    expect(fetchInfoMock).toHaveBeenCalledTimes(0);
    wrapper.setProps({
      urlParams: {
        ...INFO_DEFAULT_PARAMS,
        [INFO_PAGE_QUERY]: '2'
      }
    });

    expect(fetchInfoMock).toHaveBeenCalledTimes(1);

    wrapper.setProps({
      urlParams: {
        ...INFO_DEFAULT_PARAMS,
        [INFO_BUCKET_ID]: '8'
      }
    });

    expect(fetchInfoMock).toHaveBeenCalledTimes(2);
  });

  it("doesn't fetch new experiences data if props changed except urlParams", () => {
    expect(fetchInfoMock).toHaveBeenCalledTimes(0);
    wrapper.setProps({
      isFetching: true
    });
    expect(fetchInfoMock).toHaveBeenCalledTimes(0);
  });
});
