import React, { useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import ClearFiltersButton from 'components/ClearFiltersButton/ClearFiltersButton';
import { getBucketOptions } from 'utils/bucket';
import Location from '../Location/Location';
import RewardsLevel from '../RewardsLevel/RewardsLevel';
import CategoriesFilter from '../Categories/Categories';
import WishList from '../WishList/WishList';
import styles from './FilterBlock.scss';
import {
  BUCKETS_LIST_SHAPE,
  INFO_CATEGORIES_LIST_SHAPE,
  INFO_BUCKET_ID,
  INFO_CATEGORY_ID,
  INFO_DEFAULT_PARAMS,
  INFO_LOCATION_ID,
  INFO_PAGE_QUERY,
  urlParamsPropTypes
} from '../../../constants';
import {
  getExperiencesLocations,
  getLocationIdForFilter,
  getSelectedCategoriesOptions
} from '../../../utils';

const FilterBlock = ({
  wishlistTotalCount,
  infoCategoriesList,
  urlParams,
  programList,
  onParamsChange,
  locationsData,
  bucketsList,
  fetchInfoCategories
}) => {
  useEffect(() => {
    // fetchBucketList, fetchLocations and fetchProgramList are triggered in the parent
    fetchInfoCategories(urlParams);
  }, []);

  const locationsList = useMemo(() => getExperiencesLocations(locationsData), [
    locationsData
  ]);

  const onFilterChange = (filteredEntity, filterType) => {
    const paramsChange = {
      [INFO_PAGE_QUERY]: 1
    };
    if (filterType === 'category') {
      paramsChange[INFO_CATEGORY_ID] = filteredEntity.map(({ id }) => id);
    }
    if (filterType === 'bucket') {
      const { value: bucket_id } = filteredEntity;
      paramsChange[INFO_BUCKET_ID] = bucket_id;
    }
    if (filterType === 'location') {
      const { id: locationId } = filteredEntity;
      paramsChange[INFO_LOCATION_ID] = locationId;
    }
    onParamsChange(paramsChange);
  };

  const {
    [INFO_CATEGORY_ID]: categoryIds,
    [INFO_BUCKET_ID]: bucketId,
    [INFO_LOCATION_ID]: locationId
  } = urlParams;

  const selectedCategoriesOptions = categoryIds
    ? getSelectedCategoriesOptions(infoCategoriesList, categoryIds)
    : [];

  const bucketOptions = getBucketOptions(bucketsList, programList);

  const selectedBucketOptions = bucketId
    ? bucketOptions.filter(bucket => bucketId.includes(bucket.value))
    : [];

  const selectedLocationOptions = locationId
    ? getLocationIdForFilter(locationsList, locationId)
    : [];

  return (
    <div className={styles.filterBlockWrap}>
      <div className={styles.filtersWrap}>
        <Location
          onChange={onFilterChange}
          locationsList={locationsList}
          selectedLocationOptions={selectedLocationOptions}
        />
        <RewardsLevel
          onChange={onFilterChange}
          bucketsList={bucketOptions}
          selectedBucketOptions={selectedBucketOptions}
        />
        <CategoriesFilter
          onChange={onFilterChange}
          onParamsChange={onParamsChange}
          selectedCategoriesOptions={selectedCategoriesOptions}
          infoCategoriesList={infoCategoriesList}
        />
        <ClearFiltersButton
          wrapperProps={{
            onClick: () => onParamsChange(INFO_DEFAULT_PARAMS, true)
          }}
        />
      </div>
      <WishList wishlistTotalCount={wishlistTotalCount} />
    </div>
  );
};

FilterBlock.propTypes = {
  wishlistTotalCount: PropTypes.number,
  onParamsChange: PropTypes.func.isRequired,
  infoCategoriesList: PropTypes.arrayOf(INFO_CATEGORIES_LIST_SHAPE).isRequired,
  locationsData: PropTypes.shape({}).isRequired,
  programList: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  bucketsList: PropTypes.arrayOf(BUCKETS_LIST_SHAPE).isRequired,
  urlParams: urlParamsPropTypes.isRequired,
  fetchInfoCategories: PropTypes.func.isRequired
};

FilterBlock.defaultProps = {
  wishlistTotalCount: null
};

export default FilterBlock;
