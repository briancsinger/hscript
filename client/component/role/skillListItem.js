import React, { useRef } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import DragHandleIcon from '@material-ui/icons/DragHandle';
import InputAdornment from '@material-ui/core/InputAdornment';
import { makeStyles } from '@material-ui/core';

InputAdornment;
const SKILL_TYPE = 'SKILL_TYPE';

const useStyles = makeStyles((theme) => ({
    dragIcon: {
        fill: theme.palette.grey['300'],
        '&:hover': {
            cursor: 'grab',
        },
    },
}));

const SkillListItem = ({
    skill,
    placeholder,
    index,
    moveSkillListItem,
    handleSkillChange,
}) => {
    const ref = useRef(null);
    const classes = useStyles();

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

    return (
        <Grid item ref={ref} style={{ opacity }}>
            <TextField
                multiline
                fullWidth
                variant="outlined"
                placeholder={placeholder}
                value={skill.text}
                onChange={handleSkillChange.bind(this, skill)}
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <DragHandleIcon className={classes.dragIcon} />
                        </InputAdornment>
                    ),
                }}
            />
        </Grid>
    );
};

export default SkillListItem;
