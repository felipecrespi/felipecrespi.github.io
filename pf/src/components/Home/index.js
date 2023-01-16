// --- Imports --- //
import React from "react";
import { Link } from "react-router-dom";

// --- Material Ui Imports --- //
import Typography from "@mui/material/Typography";
import { Card, CardContent, CardMedia, CardActionArea, Grid, CssBaseline } from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";


const themeLight = createTheme({
    palette: {
      background: {
        default: "#2B3035"
      }
    }
  });

const Home = () => {
    return (
        <ThemeProvider theme={themeLight}>
            <CssBaseline />
            <Grid container p={'5em'} pl={'15em'} pr={'15em'} rowSpacing={8} justifyContent='space-evenly'>
            <Grid item xs={12}>
                <CardContent>
                <div>
                    <CardMedia
                        sx={{position: 'relative', boxShadow: 10}}
                        component="img"
                        image="http://127.0.0.1:8000/media/Home.jpg"
                    />
                    </div>
                </CardContent>
            </Grid>
            <Grid item xs='auto'>
                <Card sx={{ maxWidth: '50em', backgroundColor: "#F65250"  }}>
                    <CardActionArea component={Link} to='studios'>
                        <CardMedia
                        component="img"
                        height="250vh"
                        image="http://127.0.0.1:8000/media/16321.jpg"
                        alt="studios"
                        />
                        <CardContent>
                        <Typography gutterBottom color={'white'} variant="h5" component="div">
                            Studios
                        </Typography>
                        <Typography variant="body2" color={'white'}>
                            Search for the best fitness studios near you!
                        </Typography>
                        </CardContent>
                    </CardActionArea>
                </Card>
            </Grid>
            <Grid item xs='auto'>
                <Card sx={{ maxWidth: '50em', backgroundColor: "#F65250" }}>
                    <CardActionArea component={Link} to='studios'>
                        <CardMedia
                        component="img"
                        height="250vh"
                        image="http://127.0.0.1:8000/media/5184243.jpg"
                        alt="studios"
                        />
                        <CardContent>
                        <Typography gutterBottom variant="h5" color={'white'} component="div">
                            Classes
                        </Typography>
                        <Typography variant="body2" color={'white'} >
                            Find the classes fit for you. From yoga to CrossFit, from pilates to kickboxing!
                        </Typography>
                        </CardContent>
                    </CardActionArea>
                </Card>
            </Grid>
            <Grid item xs='auto'>
                <Card sx={{ maxWidth: '50em', backgroundColor: "#F65250" }}>
                    <CardActionArea component={Link} to={localStorage.getItem('accessToken') ? 'account/view' : 'account/login'}>
                        <CardMedia
                        component="img"
                        height="250vh"
                        image="http://127.0.0.1:8000/media/5272.jpg"
                        alt="studios"
                        />
                        <CardContent>
                        <Typography gutterBottom variant="h5" color={'white'}  component="div">
                            Start now!
                        </Typography>
                        <Typography variant="body2" color={'white'} >
                            Create an account and make a subscription.
                        </Typography>
                        </CardContent>
                    </CardActionArea>
                </Card>
            </Grid>
        </Grid> 
        </ThemeProvider>             
    );
}
  
export default Home;
