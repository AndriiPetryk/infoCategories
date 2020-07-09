import { compose } from 'redux';
import { connect } from 'react-redux';
import { selectors } from 'redux-reducers';
import { withUrlParamsChange } from 'hocs';
import fetchInfoCategories from 'actions/fetchInfoCategories';

import {
  bucketList as bucketListStateKey,
  account as accountStateKey,
  locationsList as locationsListStateKey,
  infoCategoriesList as infoCategoriesListStateKey,
  programList as programListStateKey
} from 'enums/reduxStateKeys';

import FilterBlock from './FilterBlock';

const { getData } = selectors.fetchReducerSelectors;

const mapStateToProps = (state, { urlParams }) => {
  const {
    [bucketListStateKey]: bucketListState,
    [accountStateKey]: accountState,
    [locationsListStateKey]: locationsListState,
    [infoCategoriesListStateKey]: infoCategoriesListState,
    [programListStateKey]: programListState
  } = state;

  const {
    location_id: locationId,
    company: { id: companyId }
  } = getData(accountState);

  const bucketsList = getData(bucketListState);

  const programList = getData(programListState);

  const locationsData = getData(locationsListState);

  const InfoCategoriesData = getData(infoCategoriesListState);

  const { experience_categories: infoCategoriesList } = InfoCategoriesData;

  return {
    infoCategoriesList: infoCategoriesList || [],
    programList,
    bucketsList,
    companyId,
    urlParams,
    locationsData,
    locationId
  };
};

const mapDispatchToProps = dispatch => ({
  fetchInfoCategories: params => dispatch(fetchInfoCategories(params))
});

export default compose(
  withUrlParamsChange,
  connect(mapStateToProps, mapDispatchToProps)
)(FilterBlock);
