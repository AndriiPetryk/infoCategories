import React from 'react';
import PropTypes from 'prop-types';
import EmptyState from 'components/EmptyState/EmptyState';
import ErrorStateImg from 'assets/images/errrorState.png';
import Button from 'components/Button/Button';
import { INFO_DEFAULT_PARAMS } from '../../constants';
import styles from './InfoContent.scss';

const HasError = ({ onParamsChange }) => {
  return (
    <div className={styles.errorState}>
      <EmptyState
        src={ErrorStateImg}
        width={132}
        height={102}
        title="Something went wrong!"
        text=""
        actions={[
          <Button
            key="try-more"
            buttonText="Try again"
            onClick={() => {
              onParamsChange(INFO_DEFAULT_PARAMS, true);
            }}
          />
        ]}
      />
    </div>
  );
};

HasError.propTypes = {
  onParamsChange: PropTypes.func.isRequired
};

export default HasError;
