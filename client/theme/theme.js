import { createMuiTheme } from '@material-ui/core/styles';
import { red } from '@material-ui/core/colors';

// Create a theme instance.
const theme = createMuiTheme({
    palette: {
        primary: {
            main: '#556cd6',
        },
        secondary: {
            main: '#19857b',
        },
        error: {
            main: red.A400,
        },
        background: {
            default: '#fff',
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
