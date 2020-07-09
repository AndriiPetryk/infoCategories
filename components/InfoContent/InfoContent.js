import React, { Component } from 'react';
import PropTypes from 'prop-types';
import PaginationDetails from 'components/PaginationDetails/PaginationDetails';
import PreviewInfoTile from 'components/PreviewInfoTile/PreviewInfoTile';
import _isEqual from 'lodash/isEqual';
import CircleLoader from 'components/CircleLoader/CircleLoader';
import { OTHER_LOCATION } from 'enums/locations';
import DetailsInfoModalContainer from '../DetailsInfoModal/DetailsInfoModalContainer';
import FilterBlock from '../Filters/FilterBlock/FilterBlockContainer';
import HasError from './HasError';
import NoResults from './NoResults';
import {
  urlParamsPropTypes,
  PREVIEW_INFO_SHAPE,
  INFO_CATEGORY_ID,
  INFO_LOCATION_ID,
  INFO_BUCKET_ID
} from '../../constants';
import { toggleInWishlist } from '../../utils';
import styles from './InfoContent.scss';

class InfoContent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isDetailsModalOpen: false,
      currentInfoId: null,
      wishlistTotalCount: null,
      wishListIds: []
    };
  }

  componentDidMount() {
    const {
      fetchBucketList,
      fetchProgramList,
      fetchLocations,
      initialDataReceived
    } = this.props;

    if (initialDataReceived) {
      this.fetchExperiencesWithDefaultFilters();
    } else {
      fetchBucketList();
      fetchProgramList();
      fetchLocations();
    }
  }

  componentDidUpdate(prevProps) {
    const {
      urlParams,
      fetchInfo,
      wishlistedOfferingsIds,
      initialDataReceived
    } = this.props;

    if (!prevProps.initialDataReceived && initialDataReceived) {
      this.fetchExperiencesWithDefaultFilters();
      return;
    }

    const didWihlistedOfferingsIdsChange = !_isEqual(
      prevProps.wishlistedOfferingsIds,
      wishlistedOfferingsIds
    );
    const didParamsChange = !_isEqual(prevProps.urlParams, urlParams);
    if (didParamsChange) {
      fetchInfo(urlParams);
    }
    if (didWihlistedOfferingsIdsChange) {
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState({
        wishListIds: wishlistedOfferingsIds,
        wishlistTotalCount: wishlistedOfferingsIds.length
      });
    }
  }

  applyDefaultFilters = () => {
    const {
      locationId,
      defaultBucketId,
      userLocationIsFilterable,
      onParamsChange
    } = this.props;
    // redirecting with default location and bucket selected
    const defaultLocationId = userLocationIsFilterable
      ? locationId
      : OTHER_LOCATION; // user location or Other
    onParamsChange({
      [INFO_BUCKET_ID]: defaultBucketId,
      [INFO_LOCATION_ID]: defaultLocationId
    });
  };

  fetchExperiencesWithDefaultFilters = () => {
    const {
      urlParams,
      fetchInfo,
      defaultBucketId,
      locationId
    } = this.props;

    if (
      (defaultBucketId && !urlParams[INFO_BUCKET_ID]) ||
      (locationId && !urlParams[INFO_LOCATION_ID])
    ) {
      // no needed filters, applying defaults
      this.applyDefaultFilters();
    } else {
      fetchInfo(urlParams);
    }
  };

  onModalClose = () => {
    this.setState({ isDetailsModalOpen: false, currentInfoId: null });
  };

  onFetchInfoDetails = (offeringData, offeringDataType) => {
    const { fetchinfoDetails } = this.props;
    const offeringId =
      offeringDataType === 'offeringId' ? offeringData : offeringData.id;
    this.setState(
      { isDetailsModalOpen: true, currentInfoId: offeringId },
      fetchinfoDetails(offeringId)
    );
  };

  onTotalCount = () => {
    const { wishListIds } = this.state;
    const wishlistTotalCount =
      wishListIds.length === 0 ? null : wishListIds.length;
    this.setState({ wishlistTotalCount });
  };

  isWishlisted = id => {
    const { wishListIds } = this.state;
    return !!wishListIds.includes(id);
  };

  onWishlistUpdate = async (event, id) => {
    event.stopPropagation();
    const { locationId } = this.props;
    const { wishListIds } = this.state;
    try {
      await toggleInWishlist(id, locationId);
      const isExperienceIncluded = wishListIds.includes(id);
      if (!isExperienceIncluded) {
        this.setState(
          {
            wishListIds: [...wishListIds, id]
          },
          this.onTotalCount
        );
      }
      if (isExperienceIncluded) {
        const index = wishListIds.indexOf(id);
        wishListIds.splice(index, 1);
        this.setState({ wishListIds }, this.onTotalCount);
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(error);
    }
  };

  render() {
    const {
      dataReceived,
      hasError,
      isFetching,
      onParamsChange,
      Info,
      infosIds,
      InfoTotalCount,
      InfoPageCount,
      urlParams,
      areFiltersApplied,
      isOnlyActivated
    } = this.props;

    const { [INFO_CATEGORY_ID]: categoryIds } = urlParams;
    const showCategory = !!categoryIds;

    const {
      isDetailsModalOpen,
      currentInfoId,
      wishlistTotalCount
    } = this.state;

    const isLoading = isFetching || !dataReceived;
    const noResults =
      dataReceived && infosIds.length === 0 && areFiltersApplied;

    let content;
    if (hasError) {
      content = <HasError onParamsChange={onParamsChange} />;
    } else if (noResults) {
      content = <NoResults onParamsChange={onParamsChange} />;
    } else {
      content = (
        <div className={styles.InfoWrap}>
          {currentInfoId && (
            <DetailsInfoModalContainer
              showCategory={showCategory}
              isDetailsModalOpen={isDetailsModalOpen}
              isWishlisted={this.isWishlisted}
              onWishlistIconClick={this.onWishlistUpdate}
              onModalClose={this.onModalClose}
              currentInfoId={currentInfoId}
              wishlistTotalCount={wishlistTotalCount}
              onFetchInfoDetails={this.onFetchInfoDetails}
            />
          )}
          {Info.map(data => {
            const {
              id,
              name: infoName,
              catalog_cover_image_url: imgSrc,
              primary_experience_category,
              tagline: hoverText
            } = data;
            const infoCategory =
              primary_experience_category !== null
                ? primary_experience_category.name
                : '';
            return (
              <div
                key={id}
                onClick={() => this.onFetchInfoDetails(data, 'offeringData')}
                className={styles.column}
              >
                <PreviewInfoTile
                  doNotShowCategory={showCategory}
                  className={styles.experienceTile}
                  imgSrc={imgSrc}
                  infoName={infoName}
                  infoCategory={infoCategory}
                  isWishListed={this.isWishlisted(id)}
                  onWishListIconClick={event =>
                    this.onWishlistUpdate(event, id)
                  }
                  hoverText={hoverText}
                />
              </div>
            );
          })}
        </div>
      );
    }

    return (
      <>
        <FilterBlock
          isOnlyActivated={isOnlyActivated}
          wishlistTotalCount={wishlistTotalCount}
        />
        <PaginationDetails
          entityName="results"
          pageCount={InfoPageCount}
          areFiltersApplied={areFiltersApplied && !isFetching}
          entityCount={InfoTotalCount}
          urlParams={urlParams}
        />
        {isLoading ? <CircleLoader /> : content}
      </>
    );
  }
}

InfoContent.propTypes = {
  fetchInfo: PropTypes.func.isRequired,
  fetchinfoDetails: PropTypes.func.isRequired,
  fetchBucketList: PropTypes.func.isRequired,
  fetchProgramList: PropTypes.func.isRequired,
  fetchLocations: PropTypes.func.isRequired,
  isFetching: PropTypes.bool.isRequired,
  userLocationIsFilterable: PropTypes.bool.isRequired,
  locationId: PropTypes.number.isRequired,
  defaultBucketId: PropTypes.number,
  areFiltersApplied: PropTypes.bool.isRequired,
  isOnlyActivated: PropTypes.bool,
  hasError: PropTypes.bool.isRequired,
  dataReceived: PropTypes.bool.isRequired,
  initialDataReceived: PropTypes.bool.isRequired,
  onParamsChange: PropTypes.func.isRequired,
  Info: PropTypes.arrayOf(PREVIEW_INFO_SHAPE).isRequired,
  wishlistedOfferingsIds: PropTypes.arrayOf(PropTypes.number).isRequired,
  infosIds: PropTypes.arrayOf(PropTypes.number).isRequired,
  InfoTotalCount: PropTypes.number.isRequired,
  InfoPageCount: PropTypes.number.isRequired,
  urlParams: urlParamsPropTypes.isRequired
};

InfoContent.defaultProps = {
  isOnlyActivated: false,
  defaultBucketId: undefined
};

export default InfoContent;
