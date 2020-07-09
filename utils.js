import { isEmpty, find } from 'lodash';
import { Fetch } from 'utils';
import _isEqual from 'lodash/isEqual';
import _assign from 'lodash/assign';
import { API } from '../../enums/api';
import { INFO_DEFAULT_PARAMS } from './constants';

export const toggleInWishlist = (offeringId, id) =>
  Fetch.post(API.experiences.wishlist.toggleInWishlist(offeringId), {
    selected_location_id: id
  });

export const getSelectedCategoriesOptions = (
  infoCategoriesList,
  categoryIds = []
) => infoCategoriesList.filter(({ id }) => categoryIds.includes(id.toString()));

const otherOption = {
  id: 2,
  name: 'Other'
};
const specifiedLocationsTitle = {
  id: 'availableLocations',
  name: 'Available Office Locations',
  isDisabled: true
};

const supportedLocationsTitle = {
  id: 'otherLocations',
  name: 'Other Locations',
  isDisabled: true
};

export const getArrayOfLocationsIds = locations => {
  if (!isEmpty(locations)) {
    const {
      supported_locations: supportedLocations,
      specified_locations: specifiedLocations
    } = locations;

    return [
      ...supportedLocations.map(({ id }) => id),
      ...specifiedLocations.map(({ id }) => id)
    ];
  }
  return [];
};

export const getExperiencesLocations = locations => {
  if (!isEmpty(locations)) {
    const {
      supported_locations: supportedLocations,
      specified_locations: specifiedLocations
    } = locations;

    supportedLocations.map(location =>
      _assign(location, { hint_text: location.name })
    );

    specifiedLocations.map(location =>
      _assign(location, { hint_text: location.name })
    );

    const customSelectSupportedLocationsOptions = supportedLocations.filter(
      item => !find(specifiedLocations, location => location.id === item.id)
    );

    let customSelectOptions = [
      ...customSelectSupportedLocationsOptions,
      otherOption
    ];

    if (specifiedLocations.length) {
      customSelectOptions = [
        specifiedLocationsTitle,
        ...specifiedLocations,
        otherOption,
        supportedLocationsTitle,
        ...customSelectSupportedLocationsOptions
      ];
    }
    return customSelectOptions;
  }
  return [];
};

export const getLocationIdForFilter = (locationList, locationId) =>
  locationList.filter(({ id }) => id === +locationId);

export const checkIfFiltersApplied = currentParams =>
  Object.entries(currentParams)
    .filter(param => !param.includes('page'))
    .some(([key, value]) => !_isEqual(INFO_DEFAULT_PARAMS[key], value));
