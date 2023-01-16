import * as React from 'react';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import Grow from '@mui/material/Grow';
import Paper from '@mui/material/Paper';
import Popper from '@mui/material/Popper';
import MenuItem from '@mui/material/MenuItem';
import MenuList from '@mui/material/MenuList';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import CssBaseline from '@mui/material/CssBaseline';
import { styled, ThemeProvider, createTheme } from '@mui/material/styles';

const token = localStorage.getItem('accessToken')

const themeButton= createTheme({
  palette: {
    background: {
      default: "#2B3035"
    },
    secondary: {
      main: "#F65250"
    }
  }
});


export default function EnrollButton( { class_name, class_id } ) {
  const [open, setOpen] = React.useState(false);
  const anchorRef = React.useRef(null);
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const [buttonResponse, setButtonResponse] = React.useState(' ');
  const [success, setSuccess] = React.useState(false);

  const options = ['Enroll', `Enroll all ${class_name} classes`, 'Drop', `Drop all ${class_name} classes`];

  const handleClick = () => {
    const requestOptions = {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
        }
    };
    if (selectedIndex === 0){
        fetch(`http://127.0.0.1:8000/classes/${class_id}/enroll/`, requestOptions)
          .then(response => {
          if (!response.ok) {
            response.json().then(json => {
              setButtonResponse(json.detail)
            });
          }
          else{
            setButtonResponse('')
          }
        }
      )
    }
    else if (selectedIndex === 1){
        fetch(`http://127.0.0.1:8000/classes/${class_id}/enroll/all/`, requestOptions)
          .then(response => {
          if (!response.ok) {
            response.json().then(json => {
              setButtonResponse(json.detail)
            });
          }
          else{
            setButtonResponse('')
          }
        }
      )
    }
    else if (selectedIndex === 2){
        fetch(`http://127.0.0.1:8000/classes/${class_id}/dropout/`, requestOptions)
          .then(response => {
          if (!response.ok) {
            response.json().then(json => {
              setButtonResponse(json.detail)
            });
          }
          else{
            setButtonResponse('')
          }
        }
      )
    }
    else if (selectedIndex === 3){
        fetch(`http://127.0.0.1:8000/classes/${class_id}/dropout/all/`, requestOptions)
          .then(response => {
          if (!response.ok) {
            response.json().then(json => {
              setButtonResponse(json.detail)
            });
          }
          else{
            setButtonResponse('')
          }
        }
      )
    }
  };

  const handleMenuItemClick = (event, index) => {
    setSelectedIndex(index);
    setOpen(false);
  };

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }

    setOpen(false);
  };

  React.useEffect(() => {
    if(buttonResponse.length === 0){
      setSuccess(true)
    }
    else if (buttonResponse.length > 1){
      setSuccess(false)
    }
  }, [buttonResponse])

  return (
    <ThemeProvider theme={themeButton}>
    <CssBaseline />
    <Stack direction='column' spacing={2} alignItems='flex-start'>
      <ButtonGroup color='secondary' variant="contained" ref={anchorRef} aria-label="split button">
        <Button onClick={handleClick}>{options[selectedIndex]}</Button>
        <Button
          size="small"
          aria-controls={open ? 'split-button-menu' : undefined}
          aria-expanded={open ? 'true' : undefined}
          aria-label="select merge strategy"
          aria-haspopup="menu"
          onClick={handleToggle}
        >
          <ArrowDropDownIcon />
        </Button>
      </ButtonGroup>
      <Popper
        sx={{
          zIndex: 1,
        }}
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
                placement === 'bottom' ? 'center top' : 'center bottom',
            }}
          >
            <Paper>
              <ClickAwayListener onClickAway={handleClose}>
                <MenuList id="split-button-menu" autoFocusItem>
                  {options.map((option, index) => (
                    <MenuItem
                      key={option}
                      selected={index === selectedIndex}
                      onClick={(event) => handleMenuItemClick(event, index)}
                    >
                      {option}
                    </MenuItem>
                  ))}
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
      {console.log(buttonResponse.length > 1)}
    {buttonResponse.length > 1 && (buttonResponse === 'Given token not valid for any token type' ? <Alert severity="error">You must log in to enroll or drop a class</Alert> : <Alert severity="error">{buttonResponse}</Alert>)}
    {success && <Alert severity='success'>Success</Alert>}
    </Stack>
    </ThemeProvider>
  );
}