import React, {useState, useEffect} from 'react'
import { Dialog, DialogTitle, DialogContent, DialogActions, DialogContentText, TextField, Button, Typography } from '@mui/material'


export default function Popup(props){
    const {title, children, openPopup, setOpenPopup} = props;
    return (
        <Dialog open = {openPopup}>
            <DialogTitle>
                <div style={{display: 'flex'}}>
                    <Typography variant="h2" component="div" style={{flexGrow:1}}>
                        {title}
                    </Typography>
                    <Button sx={{height: 60}}color = "error" variant="contained" onClick={()=>{setOpenPopup(false)}}>X</Button>
                </div>
            </DialogTitle>
            <DialogContent>
                {children}
            </DialogContent>
        </Dialog>
    )
}