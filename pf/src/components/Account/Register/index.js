import { Stack, IconButton, Grid, Box, Button, TextField, Typography, Paper, styled, Container, Link, Checkbox, FormControlLabel} from "@mui/material";
import { useEffect, useState} from "react";
import {Avatar} from '@mui/material/';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider, createTheme } from '@mui/material/styles';

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

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(3),
    paddingLeft: theme.spacing(5),
    paddingRight: theme.spacing(5),
    textAlign: 'left',
    color: theme.palette.text.secondary,
    borderRadius: '30px',
  }));


async function registerUser(credentials) {
    return fetch(`http://127.0.0.1:8000/accounts/signup/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
            },
        body: JSON.stringify(credentials)
    }).then(data => data.json())
}


export default function Register() {
    const [usernameError, setUsernameError] = useState(false)
    const [usernameHelp, setUsernameHelp] = useState("")
    const [passwordError, setPasswordError] = useState(false)
    const [passwordHelp, setPasswordHelp] = useState("")
    const [emailError, setEmailError] = useState(false)
    const [emailHelp, setEmailHelp] = useState("")
    const [phoneError, setPhoneError] = useState(false)
    const [phoneHelp, setPhoneHelp] = useState("Enter a 10 digit phone number (no special characters or spaces)")
    const handleSubmit = async (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const email = data.get('email')
        const password = data.get('password')
        const password2 = data.get('password2')
        const first_name = data.get('first_name')
        const last_name = data.get('last_name')
        const phone = data.get('phone')
        const username = data.get('username')
        const avatar = null

        if (data.get('password') != data.get('password2')){
            setPasswordError(true)
            return setPasswordHelp("Passwords do not match")
        }
        const response = await registerUser({username, password, email, password2, first_name, last_name, phone, avatar})
        if ("username" in response){
            if (response["username"] == "A user with that username already exists."){
                setUsernameError(true)
                setUsernameHelp("A user with that username already exists.")
            }
            if (response["username"] == "This field may not be blank."){
                setUsernameError(true)
                setUsernameHelp("Can't leave blank")
            }
            if (response["password2"] == "This field may not be blank."){
                setUsernameError(true)
                setUsernameHelp("Can't leave blank")
            }
            if (response["email"] == "Enter a valid email address."){
                setEmailError(true)
                setEmailHelp("Enter a valid email address.")
            }
            if (response["phone"] == "Not a valid Phone numer" || response["phone"].length > 1){
                setPhoneError(true)
                setPhoneHelp("Enter a valid phone number")
            }
            
            if (response["username"] != "A user with that username already exists." &&
            response["email"] != "Enter a valid email address." &&
            response["phone"] != "Not a valid Phone numer" && response["phone"].length > 1) {
                window.location.href = "/account/login";
            }
        }
    };

    return (
        <>
        <ThemeProvider theme={themeButton}>
            <CssBaseline />
        <Typography variant='h1' fontWeight='bold' pl={'1em'} pt={'1em'} color='white'>Register</Typography>
        <Container component="main" maxWidth="xs">
            <Item>
            <Box
            sx={{
                marginTop: 8,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
            }}
            >
            <Avatar sx={{ m: 1, bgcolor: '#fd6114' }}>
                <LockOutlinedIcon />
            </Avatar>
            <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
                <Grid container spacing={2}>
                <Grid item xs={12} sm={12}>
                    <TextField
                    name="username"
                    required
                    fullWidth
                    id="username"
                    label="Username"
                    error = {usernameError}
                    helperText={usernameHelp}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                    autoComplete="given-name"
                    name="first_name"
                    fullWidth
                    id="first_name"
                    label="First Name"
                    autoFocus
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                    fullWidth
                    id="last_name"
                    label="Last Name"
                    name="last_name"
                    autoComplete="family-name"
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                    fullWidth
                    id="phone"
                    label="Phone number"
                    name="phone"
                    autoComplete="phone"
                    error = {phoneError}
                    helperText={phoneHelp}
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                    fullWidth
                    id="email"
                    label="Email Address"
                    name="email"
                    autoComplete="email"
                    error={emailError}
                    helperText={emailHelp}
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                    required
                    fullWidth
                    name="password"
                    label="Password"
                    type="password"
                    id="password"
                    error={passwordError}
                    autoComplete="new-password"
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                    required
                    fullWidth
                    name="password2"
                    label="Retype Password"
                    type="password"
                    id="password2"
                    error={passwordError}
                    helperText={passwordHelp}
                    autoComplete="new-password"
                    />
                </Grid>
                </Grid>
                <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                >
                Sign Up
                </Button>
                <Grid container justifyContent="flex-end">
                <Grid item>
                    <Link href="/account/login" variant="body2">
                    Already have an account? Sign in
                    </Link>
                </Grid>
                </Grid>
            </Box>
            </Box>
            </Item>
        </Container>
        </ThemeProvider>
        </>
    )
}