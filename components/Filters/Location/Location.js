import React from 'react';
import PropTypes from 'prop-types';
import Select from 'components/Select/Select';
import styles from './Location.scss';
import { LOCATIONS_LIST_SHAPE } from '../../../constants';
import { customLocationSelectStyles } from './CustomLocationStyles';

const getOptionValue = option => option.id;
const getOptionLabel = option => option.name;

const Location = ({ locationsList, selectedLocationOptions, onChange }) => {
  if (!locationsList || locationsList.length === 0) {
    return null;
  }

  return (
    <div className={styles.selectFilter}>
      <Select
        isSearchable
        options={locationsList}
        getOptionLabel={getOptionLabel}
        getOptionValue={getOptionValue}
        placeholder="Choose location"
        value={selectedLocationOptions}
        onChange={location => onChange(location, 'location')}
        customStyles={customLocationSelectStyles}
      />
    </div>
  );
};

Location.propTypes = {
  locationsList: PropTypes.arrayOf(LOCATIONS_LIST_SHAPE).isRequired,
  selectedLocationOptions: PropTypes.arrayOf(LOCATIONS_LIST_SHAPE).isRequired,
  onChange: PropTypes.func.isRequired
};

export default Location;
