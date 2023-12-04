import { Autocomplete, Paper as MuiPaper, styled } from '@mui/material';
import { TextField } from '.';

const defaultInputSize = 'md';
const defaultSize = 'small';

const SelectBase = styled(Autocomplete)(({ theme, readOnly }) => ({
  '& .MuiAutocomplete-popupIndicator': {
    'color': theme.sour.colors.purple.main,
    '&:hover': { backgroundColor: theme.sour.colors.purple.light },
    '&:active': { backgroundColor: theme.sour.colors.purple.medium },
    ...(readOnly && {
      display: 'none'
    })
  },
  '& .MuiAutocomplete-clearIndicator': {
    'color': theme.sour.colors.purple.main,
    '&:hover': { backgroundColor: theme.sour.colors.purple.light },
    '&:active': { backgroundColor: theme.sour.colors.purple.medium }
  }
}));

const Paper = styled(MuiPaper)(({ theme }) => ({
  backgroundColor: theme.sour.colors.grey.dark,
  color: theme.sour.colors.purple.main
}));

const defaultGetOptionLabel = (option: unknown) => option as string;

const Select = (props: ISelectProps) => {
  const {
    inputSize = defaultInputSize,
    label,
    name,
    placeholder,
    value,
    options,
    getOptionLabel = defaultGetOptionLabel,
    onChange,
    error = false,
    helperText = '',
    readOnly = false,
    removeMargin = false,
    required = false
  } = props;
  return (
    <SelectBase
      disablePortal
      readOnly={readOnly}
      selectOnFocus={!readOnly}
      size={defaultSize}
      PaperComponent={Paper}
      openText=''
      clearText=''
      value={value || null}
      options={options}
      getOptionLabel={getOptionLabel}
      noOptionsText={'No matches...'}
      onChange={(_, value: unknown) => {
        onChange(name, value);
      }}
      renderInput={(props) => (
        <TextField
          inputSize={inputSize}
          label={label}
          placeholder={placeholder}
          error={error}
          helperText={helperText}
          removeMargin={removeMargin}
          required={required}
          {...props}
        />
      )}
    />
  );
};

interface ISelectProps {
  inputSize?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  label: string;
  name: string;
  placeholder?: string;
  value: string;
  options: string[];
  getOptionLabel?: (option: unknown) => string;
  onChange: (name: string, value: unknown) => void;
  error?: boolean;
  helperText?: string;
  readOnly?: boolean;
  removeMargin?: boolean;
  required?: boolean;
}

export default Select;
