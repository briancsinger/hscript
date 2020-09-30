import React, { useEffect } from 'react';
import clsx from 'clsx';
import Router from 'next/router';
import { makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Drawer from '@material-ui/core/Drawer';
import Box from '@material-ui/core/Box';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import Badge from '@material-ui/core/Badge';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import PhoneIcon from '@material-ui/icons/Phone';
import AssignmentIcon from '@material-ui/icons/Assignment';
import AssignmentIndIcon from '@material-ui/icons/AssignmentInd';
import GroupIcon from '@material-ui/icons/Group';
import NotificationsIcon from '@material-ui/icons/Notifications';
import { mainListItems, secondaryListItems } from './listItems';
import Copyright from '../Copyright';
import Avatar from '@material-ui/core/Avatar';
import getGravatar from '../../utils/get-gravatar';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Grow from '@material-ui/core/Grow';
import Popper from '@material-ui/core/Popper';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import theme from '../../theme/theme';

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        backgroundColor: theme.palette.background.default,
    },
    toolbar: {
        justifyContent: 'space-between',
    },
    toolbarIcon: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        padding: '0 8px',
        ...theme.mixins.toolbar,
    },
    tab: {
        minHeight: theme.spacing(7),
        flexDirection: 'row',
        alignItems: 'center',
        '&> .MuiSvgIcon-root': {
            marginRight: theme.spacing(1),
            marginBottom: '0 !important',
        },
    },
    tabSelected: {
        '& .MuiSvgIcon-root': {
            fill: theme.palette.secondary.main,
        },
    },
    tabsIndicator: {
        borderTopRightRadius: '4px',
        height: '4px',
        borderTopLeftRadius: '4px',
    },
    appBar: {
        background: theme.palette.background.paper,
        zIndex: theme.zIndex.drawer + 1,
        borderBottom: `1px solid ${theme.palette.grey[100]}`,
        color: theme.palette.text.primary,
    },
    appBarShift: {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    menuButton: {
        marginRight: 36,
    },
    menuButtonHidden: {
        display: 'none',
    },
    drawerPaper: {
        position: 'relative',
        whiteSpace: 'nowrap',
        width: drawerWidth,
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    drawerPaperClose: {
        overflowX: 'hidden',
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        width: theme.spacing(7),
    },
    appBarSpacer: theme.mixins.toolbar,
    content: {
        flexGrow: 1,
        height: '100vh',
        overflow: 'auto',
    },
    container: {
        paddingTop: theme.spacing(4),
        paddingBottom: theme.spacing(4),
    },
    paper: {
        padding: theme.spacing(2),
        display: 'flex',
        overflow: 'auto',
        flexDirection: 'column',
    },
    fixedHeight: {
        height: 240,
    },
}));

export default function Dashboard({ children, pathName = '', currentUser }) {
    const classes = useStyles();
    const [open, setOpen] = React.useState(false);
    const anchorRef = React.useRef(null);

    const paths = pathName.split('/').filter((x) => x);
    let initialVal = 'roles';
    if (paths[0] === 'scripts') {
        initialVal = paths[0];
    }
    const [currentTab, setCurrentTab] = React.useState(initialVal);

    // update tab if pathname changes
    useEffect(() => {
        const paths = pathName.split('/').filter((x) => x);
        if (
            (paths[0] === 'scripts' || paths[0] === 'roles') &&
            paths[0] !== currentTab
        ) {
            setCurrentTab(paths[0]);
        }
    }, [pathName]);

    const handleTabClicked = (e, val) => {
        e.preventDefault();
        setCurrentTab(val);
        Router.push(`/${val}`, `/${val}`);
    };

    const handleToggleMenu = () => {
        setOpen((prevOpen) => !prevOpen);
    };

    const handleClose = (event) => {
        if (anchorRef.current && anchorRef.current.contains(event.target)) {
            return;
        }

        setOpen(false);
    };

    const handleLogoutClicked = (e) => {
        e.preventDefault();
        handleClose(e);
        Router.push('/signout', '/signout');
    };

    function handleListKeyDown(event) {
        if (event.key === 'Tab') {
            event.preventDefault();
            setOpen(false);
        }
    }

    // return focus to the button when we transitioned from !open -> open
    const prevOpen = React.useRef(open);
    React.useEffect(() => {
        if (prevOpen.current === true && open === false) {
            anchorRef.current.focus();
        }

        prevOpen.current = open;
    }, [open]);

    return (
        <div className={classes.root}>
            <CssBaseline />
            <AppBar
                position="absolute"
                elevation={0}
                className={classes.appBar}
            >
                <Toolbar className={classes.toolbar}>
                    <Typography
                        component="h1"
                        variant="h6"
                        color="primary"
                        noWrap
                    >
                        <b>intra</b>
                    </Typography>
                    <Tabs
                        indicatorColor="secondary"
                        centered
                        value={currentTab}
                        onChange={handleTabClicked}
                        classes={{
                            indicator: classes.tabsIndicator,
                        }}
                    >
                        <Tab
                            label="Roles"
                            value="roles"
                            icon={<AssignmentIndIcon />}
                            classes={{
                                wrapper: classes.tab,

                                selected: classes.tabSelected,
                            }}
                        />
                        <Tab
                            label="Scripts"
                            value="scripts"
                            icon={<AssignmentIcon />}
                            classes={{
                                wrapper: classes.tab,
                                selected: classes.tabSelected,
                            }}
                        />
                        <Tab
                            label="Candidates"
                            value="candidates"
                            icon={<GroupIcon />}
                            classes={{
                                wrapper: classes.tab,
                                selected: classes.tabSelected,
                            }}
                        />
                    </Tabs>
                    <IconButton
                        aria-label="menu"
                        ref={anchorRef}
                        aria-controls={open ? 'menu-list-grow' : undefined}
                        aria-haspopup="true"
                        onClick={handleToggleMenu}
                    >
                        <Avatar
                            alt={currentUser.name}
                            sizes="medium"
                            src={getGravatar(currentUser.email, 50)}
                        />
                    </IconButton>
                    <Popper
                        open={open}
                        anchorEl={anchorRef.current}
                        role={undefined}
                        transition
                        disablePortal
                    >
                        {({ TransitionProps, placement }) => (
                            <Grow
                                {...TransitionProps}
                                style={{
                                    transformOrigin:
                                        placement === 'bottom'
                                            ? 'center top'
                                            : 'center bottom',
                                }}
                            >
                                <Paper>
                                    <ClickAwayListener
                                        onClickAway={handleClose}
                                    >
                                        <MenuList
                                            autoFocusItem={open}
                                            id="menu-list-grow"
                                            onKeyDown={handleListKeyDown}
                                        >
                                            <MenuItem onClick={handleClose}>
                                                Profile
                                            </MenuItem>
                                            <MenuItem onClick={handleClose}>
                                                My account
                                            </MenuItem>
                                            <MenuItem
                                                onClick={handleLogoutClicked}
                                            >
                                                Logout
                                            </MenuItem>
                                        </MenuList>
                                    </ClickAwayListener>
                                </Paper>
                            </Grow>
                        )}
                    </Popper>
                </Toolbar>
            </AppBar>

            {/* <Drawer
                variant="permanent"
                classes={{
                    paper: clsx(
                        classes.drawerPaper,
                        !open && classes.drawerPaperClose,
                    ),
                }}
                open={open}
            >
                <div className={classes.toolbarIcon}>
                    <IconButton onClick={handleDrawerClose}>
                        <ChevronLeftIcon />
                    </IconButton>
                </div>
                <Divider />
                <List>{mainListItems}</List>
                <Divider />
                <List>{secondaryListItems}</List>
            </Drawer> */}

            <main className={classes.content}>
                <div className={classes.appBarSpacer} />
                <Container maxWidth="lg" className={classes.container}>
                    {/* <Grid container spacing={3}>
                        <Grid item xs={12} md={8} lg={9}>
                            <Paper className={fixedHeightPaper}>
                                <h2>CHART</h2>
                            </Paper>
                        </Grid>
                        <Grid item xs={12} md={4} lg={3}>
                            <Paper className={fixedHeightPaper}>
                                <h2>Deposits</h2>
                            </Paper>
                        </Grid>
                        <Grid item xs={12}>
                            <Paper className={classes.paper}>
                                <h1>Orders</h1>
                            </Paper>
                        </Grid>
                    </Grid> */}
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            {children}
                        </Grid>
                    </Grid>
                    <Box pt={4}></Box>
                </Container>
            </main>
        </div>
    );
}
