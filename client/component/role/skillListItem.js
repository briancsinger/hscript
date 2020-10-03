import React, { useRef, useState } from 'react';
import clsx from 'clsx';
import { useDrag, useDrop } from 'react-dnd';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import DragHandleIcon from '@material-ui/icons/DragHandle';
import DeleteIcon from '@material-ui/icons/Delete';
import InputAdornment from '@material-ui/core/InputAdornment';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Divider from '@material-ui/core/Divider';
import { makeStyles, Button, Typography, IconButton } from '@material-ui/core';

InputAdornment;
const SKILL_TYPE = 'SKILL_TYPE';

const useStyles = makeStyles((theme) => ({
    dragIcon: {
        fill: theme.palette.grey['300'],
        '&:hover': {
            cursor: 'grab',
        },
    },
    dragIconWrapper: {
        display: 'flex',
        justifyContent: 'center',
    },
    listItemWrapper: {
        [theme.breakpoints.up('xs')]: {
            paddingTop: theme.spacing(1),
            paddingBottom: theme.spacing(1),
            paddingRight: theme.spacing(2),
        },
        [theme.breakpoints.up('sm')]: {
            paddingTop: theme.spacing(2),
            paddingBottom: theme.spacing(2),
            paddingRight: theme.spacing(4),
        },
        // [theme.breakpoints.up('md')]: {
        //     paddingTop: theme.spacing(2),
        //     paddingBottom: theme.spacing(2),
        //     paddingRight: theme.spacing(4),
        // },
        '&:hover': {
            background: 'rgba(250,250,250,1)',
            cursor: 'text',
        },
        '&:hover .MuiButtonBase-root': {
            opacity: 1,
        },
    },
    listItemWrapperEditing: {
        '&:hover': {
            background: 'initial',
        },
    },
    listItemButton: {
        transition: 'opacity 1s',
    },
    listItemDeleteButton: {
        opacity: 0,
        position: 'absolute',
        right: '10px',
        top: '10px',
        transition: 'opacity .2s',
    },
    listItemText: {
        whiteSpace: 'break-spaces',
    },
}));

const SkillListItem = ({
    skill,
    placeholder,
    index,
    moveSkillListItem,
    handleSkillChange,
    onDeleteSkill,
}) => {
    const ref = useRef(null);
    const classes = useStyles();
    const [isEditing, setIsEditing] = useState(false);
    const [updatedSkillText, setUpdatedSkillText] = useState(skill.text);

    const [, drop] = useDrop({
        accept: SKILL_TYPE,

        hover(item, monitor) {
            if (!ref.current) {
                return;
            }
            const dragIndex = item.index;
            const hoverIndex = index;

            // Don't replace items with themselves
            if (dragIndex === hoverIndex) {
                return;
            }

            // Determine rectangle on screen
            const hoverBoundingRect = ref.current?.getBoundingClientRect();
            // Get vertical middle
            const hoverMiddleY =
                (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
            // Determine mouse position
            const clientOffset = monitor.getClientOffset();
            // Get pixels to the top
            const hoverClientY = clientOffset.y - hoverBoundingRect.top;
            // Only perform the move when the mouse has crossed half of the items height
            // When dragging downwards, only move when the cursor is below 50%
            // When dragging upwards, only move when the cursor is above 50%
            // Dragging downwards
            if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
                return;
            }
            // Dragging upwards
            if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
                return;
            }

            // Time to actually perform the action
            moveSkillListItem(dragIndex, hoverIndex);

            // Note: we're mutating the monitor item here!
            // Generally it's better to avoid mutations,
            // but it's good here for the sake of performance
            // to avoid expensive index searches.
            item.index = hoverIndex;
        },
    });

    const [{ isDragging }, drag] = useDrag({
        item: { type: SKILL_TYPE, id: skill.id, index },
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    });

    const opacity = isDragging ? 0 : 1;

    drag(drop(ref));

    const handleDeleteClicked = (e) => {
        e.preventDefault();
        if (onDeleteSkill) {
            onDeleteSkill(skill._id);
        }
    };

    const handleItemClick = (e) => {
        e.preventDefault();
        setIsEditing(true);
    };

    const handleCancelClicked = (e) => {
        e.preventDefault();
        setIsEditing(false);
    };

    const handleSaveClicked = (e) => {
        e.preventDefault();
        setIsEditing(false);
        if (handleSkillChange) {
            handleSkillChange(skill, updatedSkillText);
        }
    };

    const handleSkillTextChanged = (e) => {
        e.preventDefault();
        setUpdatedSkillText(e.target.value);
    };

    const updateButtonDisabled =
        skill.text === updatedSkillText || !updatedSkillText;

    return (
        <ListItem
            className={clsx(
                classes.listItemWrapper,
                isEditing && classes.listItemWrapperEditing,
            )}
            key={skill._id}
            ref={ref}
            style={{ opacity }}
        >
            <ListItemAvatar className={classes.dragIconWrapper}>
                <DragHandleIcon className={classes.dragIcon} />
            </ListItemAvatar>
            <ListItemText>
                {(isEditing && (
                    <Grid container spacing={1} direction="column">
                        <Grid item>
                            <TextField
                                multiline
                                fullWidth
                                variant="outlined"
                                placeholder={placeholder}
                                value={updatedSkillText}
                                onChange={handleSkillTextChanged}
                            />
                        </Grid>
                        <Grid item container spacing={1}>
                            <Grid item>
                                <Button
                                    variant="contained"
                                    color="secondary"
                                    disabled={updateButtonDisabled}
                                    onClick={handleSaveClicked}
                                >
                                    Update
                                </Button>
                            </Grid>
                            <Grid item>
                                <Button onClick={handleCancelClicked}>
                                    Cancel
                                </Button>
                            </Grid>
                        </Grid>
                    </Grid>
                )) || (
                    <>
                        <Typography
                            variant="body1"
                            onClick={handleItemClick}
                            className={classes.listItemText}
                        >
                            {skill.text}
                        </Typography>
                        <IconButton
                            aria-label="delete"
                            className={classes.listItemDeleteButton}
                            onClick={handleDeleteClicked}
                        >
                            <DeleteIcon />
                        </IconButton>
                    </>
                )}
            </ListItemText>
        </ListItem>
    );
};

export default SkillListItem;
