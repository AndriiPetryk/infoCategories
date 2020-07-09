import React from 'react';
import PropTypes from 'prop-types';
import Select from 'components/Select/Select';
import styles from './RewardsLevel.scss';
import { customRewardLevelSelectStyles } from './CustomRewardLevelSelectStyle';
import { BUCKETS_LIST_SHAPE } from '../../../constants';

const getOptionLabel = option => option.label;
const getOptionValue = option => option.value;

const RewardsLevel = ({ bucketsList, selectedBucketOptions, onChange }) => {
  if (!bucketsList || bucketsList.length === 0) {
    return null;
  }
  return (
    <div className={styles.selectFilter}>
      <Select
        options={bucketsList}
        getOptionLabel={getOptionLabel}
        getOptionValue={getOptionValue}
        placeholder="Choose reward level"
        value={selectedBucketOptions}
        isSearchable={false}
        onChange={bucket => onChange(bucket, 'bucket')}
        styles={customRewardLevelSelectStyles}
      />
    </div>
  );
};

RewardsLevel.propTypes = {
  bucketsList: PropTypes.arrayOf(BUCKETS_LIST_SHAPE).isRequired,
  selectedBucketOptions: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.number,
      label: PropTypes.shape({}),
      bucket: BUCKETS_LIST_SHAPE
    })
  ).isRequired,
  onChange: PropTypes.func.isRequired
};

export default RewardsLevel;
