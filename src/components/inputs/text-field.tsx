import {
  TextField as MaterialTextField,
  OutlinedTextFieldProps,
  styled
} from '@mui/material';

const defaultInputSize = 'md';
const defaultSize = 'small';

const getInputWidth = (inputSize?: string) => {
  switch (inputSize) {
    case 'xs':
      return '4rem';
    case 'sm':
      return '9rem';
    case 'md':
      return '19rem';
    case 'lg':
      return '39rem';
    case 'xl':
      return '79rem';
  }
};

const TextFieldBase = styled(MaterialTextField, {
  shouldForwardProp: (prop) => prop !== 'inputSize' && prop !== 'removeMargin'
})<{ inputSize?: string; removeMargin?: boolean }>(
  ({ theme, error, inputSize, removeMargin }) => ({
    'width': getInputWidth(inputSize),
    ...(!removeMargin && {
      margin: '0.5rem'
    }),
    '& .MuiOutlinedInput-root': {
      'borderRadius': '0.25rem',
      'backgroundColor': theme.sour.colors.grey.dark,
      '& fieldset': {
        borderColor: error
          ? theme.sour.colors.red.main
          : theme.sour.colors.purple.main,
        boxShadow: `0rem 0rem 0.3rem 0.05rem ${theme.sour.colors.grey.main}`
      },
      '&:hover fieldset': {
        borderColor: error
          ? theme.sour.colors.red.dark
          : theme.sour.colors.purple.dark
      },
      '&.Mui-focused fieldset': {
        borderColor: error
          ? theme.sour.colors.red.main
          : theme.sour.colors.purple.main
      }
    },
    '& label': {
      color: error ? theme.sour.colors.red.main : theme.sour.colors.purple.main
    },
    '& label.Mui-focused': {
      color: error ? theme.sour.colors.red.main : theme.sour.colors.purple.main
    },
    '& .MuiFormHelperText-root': {
      color: error ? theme.sour.colors.red.main : theme.sour.colors.purple.main
    },
    '& .MuiInputBase-input': {
      color: theme.sour.colors.purple.main
    }
  })
);

const TextField = (props: ITextFieldProps) => {
  const {
    inputSize = defaultInputSize,
    removeMargin = false,
    children,
    ...rest
  } = props;
  return (
    <TextFieldBase
      inputSize={inputSize}
      removeMargin={removeMargin}
      {...rest}
      size={defaultSize}
    >
      {children}
    </TextFieldBase>
  );
};

interface ITextFieldProps extends Partial<OutlinedTextFieldProps> {
  inputSize?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'outlined';
  removeMargin?: boolean;
}

export default TextField;
