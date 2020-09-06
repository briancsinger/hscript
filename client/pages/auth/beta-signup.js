import React from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import BetaSignupForm from '../../component/signup/BetaSignupForm';
import Container from '@material-ui/core/Container';

const useStyles = makeStyles((theme) => ({
    root: {
        height: '100vh',
        backgroundColor: theme.palette.grey[900],
    },
    image: {
        backgroundImage:
            'url(https://images.unsplash.com/photo-1573497491208-6b1acb260507?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1650&q=80)',
        backgroundRepeat: 'no-repeat',
        backgroundColor:
            theme.palette.type === 'light'
                ? theme.palette.grey[50]
                : theme.palette.grey[900],
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        opacity: 0.5,
    },
    paper: {
        margin: theme.spacing(8, 4),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main,
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(1),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
    textHeaders: {
        fontStyle: 'italic',
    },
    textHeaderMain: {
        fontWeight: 'bold',
    },
}));

export default function BetaSignUp() {
    const classes = useStyles();

    return (
        <Grid container component="main" className={classes.root}>
            <CssBaseline />
            <Grid item xs={false} sm={4} md={8} className={classes.image} />
            <Grid
                item
                xs={12}
                sm={8}
                md={4}
                component={Paper}
                elevation={6}
                square
            >
                <div className={classes.paper}>
                    <Container maxWidth="xs" className={classes.textHeaders}>
                        <Typography
                            component="h1"
                            variant="h1"
                            align="center"
                            className={classes.textHeaderMain}
                        >
                            intra
                        </Typography>
                        <Typography component="h1" variant="h6" align="center">
                            Quicker, simpler interview prep for teams
                        </Typography>
                    </Container>
                    <BetaSignupForm />
                </div>
            </Grid>
        </Grid>
    );
}
