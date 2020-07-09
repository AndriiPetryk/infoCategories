import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import EmptyState from 'components/EmptyState/EmptyState';
import noResultsImg from 'assets/img/no_results.png';
import Button from 'components/Button/Button';
import { INFO_DEFAULT_PARAMS } from '../../constants';
import styles from './InfoContent.scss';

const NoResults = ({ onParamsChange }) => {
  return (
    <EmptyState
      src={noResultsImg}
      width={150}
      height={120}
      title="No results found"
      text="Try clearing your search filters or changing your keywords"
      actions={[
        <Button
          key="clear"
          buttonType="tertiary"
          buttonSize="medium"
          buttonText="Clear filters"
          iconPosition="right"
          iconDescription=" "
          iconClassName={classNames('clear_filters', styles.clearIcon)}
          onClick={() => {
            onParamsChange(INFO_DEFAULT_PARAMS, true);
          }}
        />
      ]}
    />
  );
};

NoResults.propTypes = {
  onParamsChange: PropTypes.func.isRequired
};

export default NoResults;
