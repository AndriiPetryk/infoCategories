import PropTypes from 'prop-types';

export const INFO_PAGE_QUERY = 'page';
export const INFO_PER_PAGE_QUERY = 'per_page';
export const INFO_BUCKET_ID = 'bucket_id';
export const INFO_LOCATION_ID = 'location_with_parents';
export const INFO_CATEGORY_ID = 'category_id';
export const INFO_LOCATION_TEXT = 'location_text';

export const FILTERS = {
  page: 'page',
  perPage: 'per_page'
};

export const DEFAULT_PAGE = '1';
export const PER_PAGE = '50';
export const DEFAULT_SELECTED_BUCKET_BY_PRICE_PRIORITY = [500, 250, 1000, 150];

export const INFO_DEFAULT_PARAMS = {
  [INFO_PAGE_QUERY]: DEFAULT_PAGE,
  [INFO_PER_PAGE_QUERY]: PER_PAGE
};

export const urlParamsPropTypes = PropTypes.shape({
  [INFO_PAGE_QUERY]: PropTypes.string,
  [INFO_PER_PAGE_QUERY]: PropTypes.string,
  [INFO_BUCKET_ID]: PropTypes.string,
  [INFO_LOCATION_ID]: PropTypes.string,
  [INFO_LOCATION_TEXT]: PropTypes.string
});

export const PREVIEW_INFO_SHAPE = PropTypes.shape({
  id: PropTypes.number,
  name: PropTypes.string,
  catalog_cover_image_url: PropTypes.string,
  tagline: PropTypes.string,
  is_wishlisted: PropTypes.bool
});

export const BUCKETS_LIST_SHAPE = PropTypes.shape({
  bucket_id: PropTypes.number,
  custom_bucket_id: PropTypes.number,
  name: PropTypes.string,
  reward_type: PropTypes.string,
  standard: PropTypes.bool,
  is_disabled: PropTypes.bool,
  guideline: PropTypes.string,
  price: PropTypes.string
});

export const LOCATIONS_LIST_SHAPE = PropTypes.shape({
  name: PropTypes.string,
  shortname: PropTypes.string,
  assignable: PropTypes.bool,
  supported: PropTypes.bool,
  catalog_image_url: PropTypes.string,
  has_sublocations: PropTypes.bool,
  has_parent_location: PropTypes.bool,
  sublocations: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number,
      name: PropTypes.string
    })
  ),
  parent_location: PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string
  })
});

export const INFO_CATEGORIES_LIST_SHAPE = PropTypes.shape({
  id: PropTypes.number,
  name: PropTypes.string
});
