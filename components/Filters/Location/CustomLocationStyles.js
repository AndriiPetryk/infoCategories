import variables from 'enums/styleVariables.scss';

const { $greyPrimary } = variables;

export const customLocationSelectStyles = {
  valueContainer: base => ({
    ...base,
    paddingLeft: '33px',
    minHeight: '31px',
    flexDirection: 'row',
    '& > i': {
      top: '50%',
      transform: 'translateY(-50%)'
    }
  }),
  option: (base, { isDisabled }) => ({
    ...base,
    fontWeight: isDisabled ? '500' : '300',
    color: $greyPrimary,
    backgroundColor: 'transparent',
    '&:hover': {
      backgroundColor: '#E4F7FA'
    }
  })
};
