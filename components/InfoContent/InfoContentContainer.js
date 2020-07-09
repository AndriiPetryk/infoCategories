import { compose } from 'redux';
import { connect } from 'react-redux';
import { selectors } from 'redux-reducers';
import { withUrlParamsChange } from 'hocs';
import { fetchInfo, fetchinfoDetails } from 'actions/fetchInfo';
import fetchBucketList from 'actions/fetchBucketList';
import fetchLocations from 'actions/fetchLocations';
import { fetchProgramList } from 'actions/programs';
import {
  account as accountStateKey,
  infoList as infoStateKey,
  bucketList as bucketListStateKey,
  programList as programListStateKey,
  locationsList as locationsListStateKey
} from 'enums/reduxStateKeys';
import {
  getAvailableBucketsIdsInAllPrograms,
  getAvailableBucketIdByPricePriority
} from 'reducers/selectors/bucketList';
import { checkIfFiltersApplied, getArrayOfLocationsIds } from '../../utils';
import {
  PER_PAGE,
  DEFAULT_SELECTED_BUCKET_BY_PRICE_PRIORITY
} from '../../constants';
import InfoContent from './InfoContent';

const {
  getNormalizedItems: getPaginatedNormalizedItems,
  getNormalizedItem: getPaginatedNormalizedItem,
  getIsFetching: getPaginatedIsFetching,
  getHasError: getPaginatedHasError,
  getDataReceived: getPaginatedDataReceived,
  getMetaData: getPaginatedMetaData,
  getIds: getPaginatedIds
} = selectors.paginatedReducerSelectors;

const { getData, getDataReceived } = selectors.fetchReducerSelectors;

const mapStateToProps = (state, { urlParams }) => {
  const {
    [infoStateKey.root]: infoState,
    [accountStateKey]: accountState,
    [bucketListStateKey]: bucketListState,
    [programListStateKey]: programListState,
    [locationsListStateKey]: locationsListState
  } = state;

  const locationsData = getData(locationsListState);
  const locationsDataReceived = getDataReceived(locationsListState);
  const filterableLocationIds = getArrayOfLocationsIds(locationsData);

  const bucketList = getData(bucketListState);
  const bucketListReceived = getDataReceived(bucketListState);

  const programList = getData(programListState);
  const programListReceived = getDataReceived(programListState);

  const availableBucketsIds = getAvailableBucketsIdsInAllPrograms(
    bucketList,
    programList
  );

  const defaultBucketId = getAvailableBucketIdByPricePriority(
    availableBucketsIds,
    DEFAULT_SELECTED_BUCKET_BY_PRICE_PRIORITY
  );

  const { location_id: locationId } = getData(accountState);
  const userLocationIsFilterable = filterableLocationIds.includes(locationId);

  const Info = getPaginatedNormalizedItems(infoState);

  const infosIds = getPaginatedIds(infoState);

  const isInfoDataReceived = getPaginatedDataReceived(infoState);

  const isInfoDataHasError = getPaginatedHasError(infoState);

  const isInfoDataFetching = getPaginatedIsFetching(infoState);

  const {
    total_entries: InfoTotalCount,
    wishlisted_offerings_ids: wishlistedOfferingsIds,
    experience_categories: infoCategoriesList
  } = getPaginatedMetaData(infoState) || {};

  const InfoPageCount = Math.ceil(InfoTotalCount / PER_PAGE) || 0;

  const initialDataReceived =
    bucketListReceived && programListReceived && locationsDataReceived;

  return {
    Info,
    locationId,
    infosIds: infosIds || [],
    isInfoDataReceived,
    infoState,
    InfoTotalCount: InfoTotalCount || 0,
    InfoPageCount,
    wishlistedOfferingsIds: wishlistedOfferingsIds || [],
    infoCategoriesList: infoCategoriesList || [],
    areFiltersApplied: checkIfFiltersApplied(urlParams),
    hasError: isInfoDataHasError,
    isFetching: isInfoDataFetching,
    dataReceived: isInfoDataReceived,
    defaultBucketId,
    userLocationIsFilterable,
    initialDataReceived
  };
};

const mapDispatchToProps = dispatch => ({
  fetchLocations: () => dispatch(fetchLocations()),
  fetchBucketList: () => dispatch(fetchBucketList()),
  fetchProgramList: () => dispatch(fetchProgramList()),
  fetchInfo: params => dispatch(fetchInfo(params)),
  dispatch
});

const mergeProps = (stateToProps, dispatchStateToProps, ownProps) => {
  const { infoState, ...restStateToProps } = stateToProps;
  const { dispatch, ...restDispatchStateToProps } = dispatchStateToProps;
  return {
    ...restStateToProps,
    ...restDispatchStateToProps,
    ...ownProps,
    fetchinfoDetails: offeringId => {
      const offering = getPaginatedNormalizedItem(infoState, offeringId);
      return dispatch(fetchinfoDetails(offering));
    }
  };
};

export default compose(
  withUrlParamsChange,
  connect(mapStateToProps, mapDispatchToProps, mergeProps)
)(InfoContent);
