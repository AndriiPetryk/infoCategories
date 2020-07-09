import React from 'react';
import PropTypes from 'prop-types';
import Select from 'components/SelectWithFilterButton/SelectWithFilterButton';
import { customCategoriesSelectStyles } from './CustomCategoriesSelectStyle';
import {
  INFO_CATEGORIES_LIST_SHAPE,
  INFO_DEFAULT_PARAMS
} from '../../../constants';
import styles from './Categories.scss';

const getOptionLabel = option => option.name;
const getOptionValue = option => option.id;

const CategoriesFilter = ({
  infoCategoriesList,
  selectedCategoriesOptions,
  onParamsChange,
  onChange
}) => {
  if (!infoCategoriesList || infoCategoriesList.length === 0) {
    return null;
  }

  return (
    <div className={styles.selectFilter}>
      <Select
        options={infoCategoriesList}
        isMulti
        getOptionLabel={getOptionLabel}
        getOptionValue={getOptionValue}
        isClearable={false}
        isSearchable={false}
        placeholder="Choose categories"
        value={selectedCategoriesOptions}
        filterCountEntity="Category"
        onChange={category => onChange(category, 'category')}
        onParamsChange={() => onParamsChange(INFO_DEFAULT_PARAMS, true)}
        hideSelectedOptions={false}
        styles={customCategoriesSelectStyles}
      />
    </div>
  );
};

CategoriesFilter.propTypes = {
  infoCategoriesList: PropTypes.arrayOf(INFO_CATEGORIES_LIST_SHAPE)
    .isRequired,
  selectedCategoriesOptions: PropTypes.arrayOf(INFO_CATEGORIES_LIST_SHAPE)
    .isRequired,
  onChange: PropTypes.func.isRequired,
  onParamsChange: PropTypes.func.isRequired
};

export default CategoriesFilter;
