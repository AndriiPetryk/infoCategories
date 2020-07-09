import variables from 'enums/styleVariables.scss';

const { $greyPrimary } = variables;

export const customCategoriesSelectStyles = {
  valueContainer: base => ({
    ...base,
    paddingLeft: '8px',
    minHeight: '31px'
  }),
  option: base => ({
    ...base,
    width: '50%',
    maxWidth: '50%',
    backgroundColor: 'transparent',
    color: $greyPrimary,
    '&:hover': {
      backgroundColor: '#E4F7FA'
    }
  })
};
