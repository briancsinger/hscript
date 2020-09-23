import React, { useCallback, useState } from 'react';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import IconButton from '@material-ui/core/IconButton';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import Typography from '@material-ui/core/Typography';
import Router from 'next/router';
import Link from 'next/link';
import update from 'immutability-helper';
import { makeStyles, TextField, Grid } from '@material-ui/core';

import DragableTextFieldListItem from './dragableTextFieldListItem';

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

const DragableTextFieldListItems = ({
    initialItems = [],
    onChange,
    itemName,
    itemType,
}) => {
    const classes = useStyles();
    const [items, setItems] = useState([
        ...initialItems,
        { text: '', id: getRandomUniqueId(initialItems), new: true },
    ]);

    const handleItemChange = (item, e) => {
        e.preventDefault();

        const updatedItems = items.map((s) => {
            if (s.id === item.id) {
                const updatedItem = {
                    ...item,
                    text: e.target.value,
                };
                return updatedItem;
            }
            return s;
        });

        if (onChange) {
            let itemsToSave = updatedItems.map((item) => {
                if (item.new) {
                    return {
                        text: item.text,
                    };
                }

                return item;
            });

            // don't save an empty last item
            if (!(itemsToSave.slice(-1).pop() || {}).text) {
                itemsToSave.pop();
            }

            onChange(itemsToSave);
        }

        if ((updatedItems.slice(-1).pop() || {}).text) {
            updatedItems.push({
                text: '',
                id: getRandomUniqueId(initialItems),
                new: true,
            });
        }

        setItems(updatedItems);
    };

    const moveListItem = useCallback(
        (dragIndex, hoverIndex) => {
            const dragItem = items[dragIndex];
            const updatedItems = update(items, {
                $splice: [
                    [dragIndex, 1],
                    [hoverIndex, 0, dragItem],
                ],
            });

            if (onChange) {
                let itemsToSave = updatedItems.map((item) => {
                    if (item.new) {
                        return {
                            text: item.text,
                        };
                    }

                    return item;
                });

                // don't save an empty last item
                if (!(itemsToSave.slice(-1).pop() || {}).text) {
                    itemsToSave.pop();
                }

                onChange(itemsToSave);
            }

            if ((updatedItems.slice(-1).pop() || {}).text) {
                updatedItems.push({
                    text: '',
                    id: getRandomUniqueId(initialItems),
                    new: true,
                });
            }

            setItems(updatedItems);
        },
        [items],
    );

    const itemsList = () => {
        const lowerCaseItemName = itemName.toLowerCase();
        return (
            <Grid container direction="column" spacing={1}>
                {items.map((item, index) => (
                    <DragableTextFieldListItem
                        key={item.id}
                        item={item}
                        itemType={itemType}
                        itemName={itemName}
                        index={index}
                        placeholder={
                            index === items.length - 1
                                ? `Add a new ${lowerCaseItemName}`
                                : `${lowerCaseItemName
                                      .slice(0, 1)
                                      .toUpperCase()} ${lowerCaseItemName.slice(
                                      1,
                                  )}`
                        }
                        moveListItem={moveListItem}
                        handleItemChange={handleItemChange}
                    />
                ))}
            </Grid>
        );
    };

    return itemsList();
};

export default DragableTextFieldListItems;
