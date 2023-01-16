import {useContext, useEffect, useState} from "react";
import * as React from 'react';
import Collapse from '@mui/material/Collapse';
import ExpandMore from '@mui/icons-material/ExpandMore';
import ExpandLess from '@mui/icons-material/ExpandLess';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import EnrollButton from "../../Studio/EnrollButton";
import Typography from '@mui/material/Typography';

const token = localStorage.getItem('accessToken')

export default function ClassList( { classes } ) {
    const [selectedIndex, setSelectedIndex] = React.useState("")
    const handleClick = index => {
        if (selectedIndex === index) {
        setSelectedIndex("")
        } else {
        setSelectedIndex(index)
        }
    }
    return(
        classes !== undefined && classes.map((item, index) => {
            return (
                <List key={index}>
                    <ListItem
                    key={index}
                    button
                    onClick={() => {
                        handleClick(index)
                    }}
                    >
                    <ListItem style={{display:'flex', justifyContent:'flex-start'}}>
                        <Typography variant='h5'>{`${item.name} on ${item.date}`}</Typography>
                    </ListItem>
                    {index === selectedIndex ? <ExpandLess /> : <ExpandMore />}
                    </ListItem>
                    <Collapse in={index === selectedIndex} timeout="auto" unmountOnExit>
                        <List component="div" disablePadding>
                            <ListItem style={{display:'flex', justifyContent:'flex-start'}}>
                                <Typography variant='body1'>{`From ${item.start_time} to ${item.end_time} on ${item.day}s`}</Typography>
                            </ListItem>
                            <ListItem style={{display:'flex', justifyContent:'flex-start'}}>
                                <Typography variant='body1'>{`About the class: ${item.description}`}</Typography>
                            </ListItem>
                            <ListItem style={{display:'flex', justifyContent:'flex-start'}}>
                                <Typography variant='body1'>{`Keywords: ${item.keywords}`}</Typography>
                            </ListItem>
                            <ListItem style={{display:'flex', justifyContent:'flex-start'}}>
                                <Typography variant='body'>{item.user !== undefined ? `Capacity: ${item.capacity - item.user.length}/${item.capacity}` : `Capacity: ${item.capacity}/${item.capacity}`}</Typography>
                            </ListItem>
                            <ListItem>
                                <EnrollButton class_name={item.name} class_id={item.id}></EnrollButton>
                            </ListItem>
                        </List>
                    </Collapse>
                </List>
            )
        })
    )
}