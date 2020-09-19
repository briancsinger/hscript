import React, { useState } from 'react';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import IconButton from '@material-ui/core/IconButton';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import Typography from '@material-ui/core/Typography';
import Router from 'next/router';
import Link from 'next/link';
import { makeStyles, TextField, Grid } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({}));

const getRandomUniqueId = (items) => {
    let searchingForUnique = true;
    let newId;
    while (searchingForUnique) {
        newId = Math.floor(Math.random() * 999999);
        searchingForUnique = items.filter(
            (item) => String(item.id) == String(newId),
        ).length;
    }
    return newId;
};

const SkillsInput = ({ initialSkills = [], onChange }) => {
    const classes = useStyles();
    const [skills, setSkills] = useState([
        ...initialSkills,
        { text: '', id: getRandomUniqueId(initialSkills), new: true },
    ]);

    const skillListItem = (skill, index, placeholder, label) => (
        <TextField
            multiline
            fullWidth
            variant="outlined"
            placeholder={placeholder}
            value={skill.text}
            onChange={handleSkillChange.bind(this, skill)}
        />
    );

    const handleSkillChange = (skill, e) => {
        e.preventDefault();

        const updatedSkills = skills.map((s) => {
            if (s.id === skill.id) {
                const updatedSkill = {
                    ...skill,
                    text: e.target.value,
                };
                return updatedSkill;
            }
            return s;
        });

        if (onChange) {
            let skillsToSave = updatedSkills.map((skill) => {
                if (skill.new) {
                    return {
                        text: skill.text,
                    };
                }

                return skill;
            });

            // don't save an empty last skill
            if (!(skillsToSave.slice(-1).pop() || {}).text) {
                skillsToSave.pop();
            }

            onChange(skillsToSave);
        }

        if ((updatedSkills.slice(-1).pop() || {}).text) {
            updatedSkills.push({
                text: '',
                id: getRandomUniqueId(initialSkills),
                new: true,
            });
        }

        setSkills(updatedSkills);
    };

    const skillsList = () => {
        return (
            <Grid container direction="column" spacing={1}>
                {skills.map((skill, index) => (
                    <Grid item key={index}>
                        {skillListItem(
                            skill,
                            index,
                            index === skills.length - 1
                                ? 'Add a new skill'
                                : 'Skill',
                        )}
                    </Grid>
                ))}
            </Grid>
        );
    };

    return skillsList();
};

export default SkillsInput;
