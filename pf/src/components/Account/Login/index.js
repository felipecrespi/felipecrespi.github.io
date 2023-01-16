import { styled } from '@mui/material/styles';
import { Box, Button, TextField, Typography, Paper} from "@mui/material";
import React, {useState} from 'react';
import Avatar from '@mui/material/Avatar';
import CssBaseline from '@mui/material/CssBaseline';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Container from '@mui/material/Container';
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


async function loginUser(credentials) {
    return fetch(`http://127.0.0.1:8000/accounts/login/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
          },
        body: JSON.stringify(credentials)
    }).then(data => data.json())
}

async function getUser(token) {
    return fetch(`http://127.0.0.1:8000/accounts/view/`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token["accessToken"]}`
        },
    }).then(data => data.json())
}

export default function SignIn() {
    const [username, setUsername] = useState()
    const [password, setPassword] = useState()
    const [usernameError, setUsernameError] = useState(false)
    const [passwordError, setPasswordError] = useState(false)
    const [helperText, setHelperText] = useState("")
    const handleSubmit = async (event) => {
        event.preventDefault();
        const response = await loginUser({username, password})
        if ("access" in response) {
            const token = response['access']
            localStorage.setItem('accessToken', response['access'])
            const user = await getUser({accessToken: token})
            localStorage.setItem('user', JSON.stringify(user))
            window.location.href = "/";
        } else {
            setUsernameError(true)
            setPasswordError(true)
            setHelperText("Incorrect username or password")
        };
    }

    return (
        <>
        <ThemeProvider theme={themeButton}>
            <CssBaseline />
        <Typography variant='h1' fontWeight='bold' pl={'1em'} pt={'1em'} color='white'>Sign in</Typography>
        <Container component="main" maxWidth="xs">
            <Item>
            <CssBaseline />
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
            <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                <TextField
                margin="normal"
                required
                fullWidth
                id="username"
                label="User name"
                name="username"
                autoComplete="username"
                autoFocus
                error = {usernameError}
                onChange={e => setUsername(e.target.value)}
                />
                <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                error = {passwordError}
                helperText={helperText}
                onChange={e => setPassword(e.target.value)}
                />
                <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                >
                Sign In
                </Button>
                <Grid container>
                <Grid item>
                    <Link href="/account/register" variant="body2">
                    {"Don't have an account? Sign Up"}
                    </Link>
                </Grid>
                </Grid>
            </Box>
            </Box>
            </Item>
        </Container>
        </ThemeProvider>
        </>
    );
}