import { createTheme } from '@mui/material';
import {
  blue,
  deepPurple,
  green,
  grey,
  orange,
  red
} from '@mui/material/colors';

const theme = createTheme({
  sour: {
    colors: {
      purple: {
        main: deepPurple[400],
        light: deepPurple[200],
        medium: deepPurple[300],
        dark: deepPurple[500]
      },
      grey: {
        main: grey[800],
        light: grey[600],
        medium: grey[700],
        dark: grey[900]
      },
      green: {
        main: green[800],
        light: green[600],
        medium: green[700],
        dark: green[900]
      },
      orange: {
        main: orange[800],
        light: orange[600],
        medium: orange[700],
        dark: orange[900]
      },
      red: {
        main: red[800],
        light: red[600],
        medium: red[700],
        dark: red[900]
      },
      blue: {
        main: blue[800],
        light: blue[600],
        medium: blue[700],
        dark: blue[900]
      }
    }
  }
});

export default theme;
