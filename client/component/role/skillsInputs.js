import React, { useCallback, useEffect, useState } from 'react';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import IconButton from '@material-ui/core/IconButton';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Avatar from '@material-ui/core/Avatar';
import DragHandleIcon from '@material-ui/icons/DragHandle';
import PostAddIcon from '@material-ui/icons/PostAdd';
import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Router from 'next/router';
import Link from 'next/link';
import update from 'immutability-helper';
import { makeStyles, TextField, Grid, Button } from '@material-ui/core';

import SkillListItem from './skillListItem';

const useStyles = makeStyles((theme) => ({
    listItemWrapper: {
        [theme.breakpoints.up('xs')]: {
            paddingTop: theme.spacing(1),
            paddingBottom: theme.spacing(1),
        },
        [theme.breakpoints.up('sm')]: {
            paddingTop: theme.spacing(2),
            paddingBottom: theme.spacing(2),
        },
        [theme.breakpoints.up('md')]: {
            paddingTop: theme.spacing(2),
            paddingBottom: theme.spacing(2),
        },
    },
    addIcon: {
        fill: theme.palette.grey['300'],
        '&:hover': {
            cursor: 'grab',
        },
    },
    addIconWrapper: {
        display: 'flex',
        justifyContent: 'center',
    },
}));

const SkillsInput = ({
    initialSkills = [],
    onUpdateSkill,
    onMoveSkill,
    onAddSkill,
    onDeleteSkill,
}) => {
    const classes = useStyles();
    const [skills, setSkills] = useState(initialSkills);
    const [newSkill, setNewSkill] = useState('');

    useEffect(() => {
        setSkills(initialSkills);
    }, [initialSkills]);

    const handleNewSkillAdded = (e) => {
        e.preventDefault();

        if (onAddSkill) {
            onAddSkill(newSkill);
            setNewSkill('');
        }
    };

    const handleNewSkillChanged = (e) => {
        e.preventDefault();
        setNewSkill(e.target.value);
    };

    const handleSkillChange = (skill, text) => {
        const updatedSkills = skills.map((s) => {
            if (s._id === skill._id) {
                const updatedSkill = {
                    ...skill,
                    text,
                };
                return updatedSkill;
            }
            return s;
        });

        if (onUpdateSkill) {
            onUpdateSkill(skill, text);
        }

        setSkills(updatedSkills);
    };

    const moveSkillListItem = useCallback(
        (dragIndex, hoverIndex) => {
            const dragSkill = skills[dragIndex];
            const updatedSkills = update(skills, {
                $splice: [
                    [dragIndex, 1],
                    [hoverIndex, 0, dragSkill],
                ],
            });

            if (onMoveSkill) {
                onMoveSkill(updatedSkills);
            }

            setSkills(updatedSkills);
        },
        [skills],
    );

    const skillsList = () => {
        return (
            <>
                <List>
                    {skills.map((skill, index) => (
                        <div key={skill._id}>
                            <SkillListItem
                                key={skill._id}
                                skill={skill}
                                index={index}
                                placeholder="Skill"
                                moveSkillListItem={moveSkillListItem}
                                handleSkillChange={handleSkillChange}
                                onDeleteSkill={onDeleteSkill}
                            />
                            <Divider variant="inset" component="li" />
                        </div>
                    ))}
                    <ListItem className={classes.listItemWrapper} key="new">
                        <ListItemAvatar className={classes.addIconWrapper}>
                            <PostAddIcon className={classes.addIcon} />
                        </ListItemAvatar>
                        <ListItemText>
                            <form onSubmit={handleNewSkillAdded}>
                                <Grid container spacing={2}>
                                    <Grid item xs={10}>
                                        <TextField
                                            id="newSkillText"
                                            value={newSkill}
                                            onChange={handleNewSkillChanged}
                                            label="Add a new skill"
                                            variant="outlined"
                                            fullWidth
                                            multiline
                                        />
                                    </Grid>
                                    <Grid
                                        item
                                        xs={2}
                                        style={{ display: 'flex' }}
                                    >
                                        <Button
                                            variant="contained"
                                            color="secondary"
                                            disabled={!newSkill}
                                            onClick={handleNewSkillAdded}
                                        >
                                            Add skill
                                        </Button>
                                    </Grid>
                                </Grid>
                            </form>
                        </ListItemText>
                    </ListItem>
                </List>
            </>
        );
    };

    return skillsList();
};

export default SkillsInput;
