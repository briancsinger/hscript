import React, { useState } from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Link from '@material-ui/core/Link';
import Box from '@material-ui/core/Box';
import WhatshotTwoToneIcon from '@material-ui/icons/WhatshotTwoTone';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import CircularProgress from '@material-ui/core/CircularProgress';
import ThumbUpAltTwoToneIcon from '@material-ui/icons/ThumbUpAltTwoTone';
import useRequest from '../../hooks/use-request';

function Copyright() {
    return (
        <Typography variant="body2" color="textSecondary" align="center">
            {'Copyright © '}
            <Link color="inherit" href="https://singer.land/">
                hscript
            </Link>{' '}
            {new Date().getFullYear()}
            {'.'}
        </Typography>
    );
}

const useStyles = makeStyles((theme) => ({
    buttonProgress: {
        color: 'green',
        position: 'absolute',
        top: '50%',
        left: '50%',
        marginTop: -10,
        marginLeft: -12,
    },
    paper: {
        marginTop: theme.spacing(8),
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
    buttonWrapper: {
        margin: theme.spacing(1),
        position: 'relative',
    },
}));

export default function BetaSignupForm() {
    const [emailAddress, setEmailAddress] = useState('');
    const [isValidEmailAddress, setIsValidEmailAddress] = useState(true);
    const [inProgress, setInProgress] = useState(false);
    const [success, setSuccess] = useState(false);
    const classes = useStyles();
    const { doRequest, errors } = useRequest({
        url: '/api/users/beta-signup',
        method: 'post',
        body: { email: emailAddress },
        onSuccess: (resp) => {
            console.log('yay', resp);
            setSuccess(true);
            setInProgress(false);
        },
    });

    const validateEmailAddress = (email) => {
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    };

    const handSubmit = (e) => {
        e.preventDefault();

        const valid = validateEmailAddress(emailAddress);
        setIsValidEmailAddress(valid);

        if (valid) {
            setInProgress(true);
            doRequest();
        }
    };

    const renderSignupForm = () => (
        <>
            <Typography component="h1" variant="h5">
                Sign up for early access
            </Typography>
            <form className={classes.form} onSubmit={handSubmit}>
                <TextField
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    id="email"
                    label="Email Address"
                    name="email"
                    autoComplete="email"
                    autoFocus
                    value={emailAddress}
                    onChange={(e) => setEmailAddress(e.target.value)}
                    error={!isValidEmailAddress}
                    helperText={
                        !isValidEmailAddress &&
                        'Make sure you have a valid email address.'
                    }
                />
                <div className={classes.buttonWrapper}>
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        className={classes.submit}
                        disabled={inProgress}
                    >
                        Get on the list
                    </Button>
                    {inProgress && (
                        <CircularProgress
                            size={25}
                            className={classes.buttonProgress}
                        />
                    )}
                </div>
            </form>
        </>
    );

    const renderSuccess = () => (
        <Typography component="h1" variant="h5">
            You're on the list!
        </Typography>
    );

    return (
        <Container component="main" maxWidth="xs">
            <CssBaseline />
            <div className={classes.paper}>
                <Avatar className={classes.avatar}>
                    {(success && <ThumbUpAltTwoToneIcon />) || (
                        <WhatshotTwoToneIcon />
                    )}
                </Avatar>
                {!success && renderSignupForm()}
                {success && renderSuccess()}
            </div>
            <Box mt={8}>
                <Copyright />
            </Box>
        </Container>
    );
}
