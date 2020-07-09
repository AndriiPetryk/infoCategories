import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import WishlistIcon from 'components/WishlistIcon/WishlistIcon';
import styles from './WishList.scss';

const { EMPLOYEE_DOMAIN } = process.env;

const WishList = ({ wishlistTotalCount }) => {
  const [wasTotalCountChanged, setCounterChanges] = useState(true);

  useEffect(() => {
    setCounterChanges(true);
    setTimeout(() => {
      setCounterChanges(false);
    }, 1000);
  }, [wishlistTotalCount]);

  return (
    <div className={styles.wishListCounter}>
      <a href={`${EMPLOYEE_DOMAIN}/wish-list`} className={styles.wishlistText}>
        My wishlist
      </a>
      <WishlistIcon
        wasTotalCountChanged={wasTotalCountChanged}
        wishListTotal={wishlistTotalCount}
        className={classNames([styles.holder, styles.withoutTotal])}
        filled
      />
    </div>
  );
};

WishList.propTypes = {
  wishlistTotalCount: PropTypes.number
};

WishList.defaultProps = {
  wishlistTotalCount: null
};
export default WishList;
