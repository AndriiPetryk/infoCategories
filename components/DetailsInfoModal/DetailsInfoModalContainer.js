import { connect } from 'react-redux';
import pluralize from 'pluralize';
import { selectors } from 'redux-reducers';

import { infoList as infoStateKey } from 'enums/reduxStateKeys';
import DetailsInfoModal from './DetailsInfoModal';

const {
  collectionDetailsSelectors: { isItemDataReceived, isItemDataFetching },
  paginatedReducerSelectors: { getIds: getPaginatedIds, getNormalizedItem }
} = selectors;
const mapStateToProps = (state, ownProps) => {
  const { [infoStateKey.root]: infoState } = state;

  const { currentInfoId } = ownProps;
  const infosIds = getPaginatedIds(infoState);
  const { collectionDetails: infoDetails } = infoState;

  const infoDetailsReceived = isItemDataReceived(infoDetails, currentInfoId);

  const infoDetailsFetching = isItemDataFetching(infoDetails, currentInfoId);

  let infoTitle;
  let subDescription;
  let location;
  let groupSize;
  let duration;
  let infoCategory;
  let infoId;
  let catalogDetailImagesUrl;

  if (!infoDetailsFetching) {
    const infoDetailsData = getNormalizedItem(infoState, currentInfoId);
    const {
      id,
      name,
      subdescription,
      catalog_detail_images_url,
      location: infoLocation,
      details: { group_size_number, duration_value, duration_type },
      category: { name: infoName }
    } = infoDetailsData;

    infoId = id;
    infoTitle = name;
    subDescription = subdescription;
    catalogDetailImagesUrl = catalog_detail_images_url;
    location = infoLocation;
    groupSize = +group_size_number;
    infoCategory = infoName;
    let customDuration = duration_type === 'custom' ? '' : duration_type;
    customDuration = pluralize(customDuration, +duration_value);
    duration = `${duration_value} ${customDuration}`;
  }

  return {
    infoId,
    infoTitle,
    subDescription,
    catalogDetailImagesUrl,
    location,
    groupSize,
    duration,
    infoCategory,
    infoDetailsReceived,
    infosIds: infosIds || []
  };
};

const DetailsInfoModalContainer = connect(
  mapStateToProps,
  null
)(DetailsInfoModal);

export default DetailsInfoModalContainer;
