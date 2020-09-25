import { createMuiTheme } from '@material-ui/core/styles';
import { red } from '@material-ui/core/colors';

// Create a theme instance.
const theme = createMuiTheme({
    palette: {
        primary: {
            main: '#324CCE',
        },
        secondary: {
            main: '#5D69BF',
        },
        error: {
            main: red.A400,
        },
        background: {
            default: '#F6F6F8',
        },
    },
    typography: {
        h1: {
            fontFamily: "'Futura', 'Helvetica', 'Arial', sans-serif",
        },
        h2: {
            fontFamily: "'Futura', 'Helvetica', 'Arial', sans-serif",
        },
        h3: {
            fontFamily: "'Futura', 'Helvetica', 'Arial', sans-serif",
        },
        h4: {
            fontFamily: "'Futura', 'Helvetica', 'Arial', sans-serif",
        },
        h5: {
            fontFamily: "'Futura', 'Helvetica', 'Arial', sans-serif",
        },
        h6: {
            fontFamily: "'Futura', 'Helvetica', 'Arial', sans-serif",
        },
    },
});

export default theme;
