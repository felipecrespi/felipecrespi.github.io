import { useParams } from 'react-router';
import {useContext, useEffect, useState} from "react";
import * as React from 'react';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import Typography from '@mui/material/Typography';
import CssBaseline from '@mui/material/CssBaseline';
import ExpandMore from '@mui/icons-material/ExpandMore';
import ExpandLess from '@mui/icons-material/ExpandLess';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import { styled, ThemeProvider, createTheme } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Pagination from '@mui/material/Pagination';
import SearchBar from "../general/SearchBar";
import ClassList from "../general/ClassList"
import Link from '@mui/material/Link';

const themeLight = createTheme({
    palette: {
      background: {
        default: "#2B3035"
      },
      primary: {
        main: '#F65250',
        contrastText: '#F65250',
    },
  }});

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'left',
    borderRadius: '24px',
  }));

const Studio = () => {
    const { id } = useParams();
    const [studio, setStudio] = useState(0);
    const [classes, setClasses] = useState([]);
    const [search, setSearch] = useState({name: '', day: '', start_time: '', end_time: '', coach: ''})
    const [count, setCount] = useState(0)
    const [page, setPage] = useState(1)

    const handlePage = (e, p) => {
        setPage(p);
    }

    useEffect(() => {
        fetch(`http://127.0.0.1:8000/studios/${id}/`)
            .then(res => res.json())
            .then(json => {
                setStudio(json);
            })
        }, [])

    useEffect(() => {
        let { name, day, start_time, end_time, coach } = search;
        name = name !== null && name.length > 0 ? `&name=${name}` : '';
        day = day !== null && day.length > 0 ? `&day=${day}` : '';
        start_time = start_time !== null && start_time.length > 0 ? `&start_time=${start_time}` : '';
        end_time = end_time !== null && end_time.length > 0 ? `&end_time=${end_time}` : '';
        coach = coach !== null && coach.length > 0 ? `&coach=${coach}` : '';

        setPage(1);

        fetch(`http://127.0.0.1:8000/studios/${id}/classes/?limit=10&offset=${(page - 1) * 10}${name}${day}${coach}${start_time}${end_time}`)
            .then(res => res.json())
            .then(json => {
                setClasses(json.results);
                setCount(json.count);
            })
        }, [search])

        useEffect(() => {
            let { name, day, start_time, end_time, coach } = search;
            name = name !== null && name.length > 0 ? `&name=${name}` : '';
            day = day !== null && day.length > 0 ? `&day=${day}` : '';
            start_time = start_time !== null && start_time.length > 0 ? `&start_time=${start_time}` : '';
            end_time = end_time !== null && end_time.length > 0 ? `&end_time=${end_time}` : '';
            coach = coach !== null && coach.length > 0 ? `&coach=${coach}` : '';
    
            fetch(`http://127.0.0.1:8000/studios/${id}/classes/?limit=10&offset=${(page - 1) * 10}${name}${day}${coach}${start_time}${end_time}`)
                .then(res => res.json())
                .then(json => {
                    setClasses(json.results);
                    setCount(json.count);
                })
            }, [page])
    
    const classOptions = studio ? [...new Set(studio.klass.map((k) => {return k.name}))] : null
    const dayOptions = studio ? [...new Set(studio.klass.map((k) => {return k.day}))] : null
    const startTimeOptions = studio ? [...new Set(studio.klass.map((k) => {return k.start_time}))] : null
    const endTimeOptions = studio ? [...new Set(studio.klass.map((k) => {return k.end_time}))] : null
    const coachOptions = studio ? [...new Set(studio.klass.map((k) => {return k.coach}))] : null

    return !studio ? null : (
    <>
    <ThemeProvider theme={themeLight}>
    <CssBaseline />
    <Stack direction='column' spacing={3} p={'5em'} alignItems='center'>
        <Typography variant='h1' color={'white'} sx={{ fontWeight: 'bold' }}>{studio.name}</Typography>
        <Grid container justifyContent='space-between' alignItems='flext-start' spacing={12}>
            <Grid item xs={6}>
                <Item>
                    <Stack direction='column' alignItems={'flex-start'} justifyContent={'center'} spacing={2} p={'2em'}>
                        <Typography variant='h2' fontWeight={700}>Studio Details:</Typography>
                        <Link rel="noopener noreferrer" 
                        target="_blank"
                        href={`https://www.google.com/maps/dir/?api=1&destination=${studio.latitude},${studio.longitude}`}><Typography variant='h4'>Address: {studio.address}</Typography></Link>
                        <Typography variant='h4'>Postal Code: {studio.postal_code}</Typography>
                        <Typography variant='h4'>Phone: {studio.phone_num}</Typography>
                        <Typography variant='h4'>Amenities:</Typography>
                        {studio.amenities !== undefined && <Stack direction="column" pl={'2em'} spacing={0.5} alignItems='flex-start' justifyContent={'flext-start'}>
                            {studio.amenities.map((item, index) => (
                            <Typography variant='h5' key={index}>{`${item.name}: ${item.quantity}`}</Typography>
                        ))}
                        </Stack>}
                    </Stack>
                    
                </Item>
            </Grid>
            <Grid item xs>
                {studio.images.length > 0 &&
                <Box sx={{ boxShadow: 5, width: '35em', height:'35em' }}>
                    <ImageList sx={{ width: '35em', height:'35em' }} cols={2} gap={2}>
                    {studio.images.map((item) => {
                        return(
                        (<ImageListItem key={item.img}>
                            <img
                                src={`${item.img}?w=164&h=164&fit=crop&auto=format`}
                                srcSet={`${item.img}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
                                alt={item.title}
                                loading="lazy"
                            />
                        </ImageListItem>
                    ))})}
                    </ImageList>
                </Box>}
            </Grid>
        </Grid>
    </Stack>
    <Stack direction='column' alignItems='center' spacing={2}>
        <Typography variant='h3' color={'white'} sx={{ fontWeight: 'bold' }}>Classes</Typography>
        <Typography variant='h6' color={'white'}>Filter and search by</Typography>
        <Stack direction='row' spacing={2}>
                <SearchBar setSearch={setSearch} search={search} search_value='name' text="Class" opts={classOptions}></SearchBar>
                <SearchBar setSearch={setSearch} search={search} search_value='day' text="Weekday" opts={dayOptions}></SearchBar>
                <SearchBar setSearch={setSearch} search={search} search_value='start_time' text="Start at" opts={startTimeOptions}></SearchBar>
                <SearchBar setSearch={setSearch} search={search} search_value='end_time' text="End at" opts={endTimeOptions}></SearchBar>
                <SearchBar setSearch={setSearch} search={search} search_value='coach' text="Coach" opts={coachOptions}></SearchBar>
            </Stack>
    </Stack>
    <Stack direction='column' spacing={3} p={'5em'} alignItems='stretch'>  
        <Item>
            <ClassList classes={classes}></ClassList>
            <Pagination count={Math.ceil(count / 10)} onChange={handlePage} page={page} />
        </Item>
    </Stack>
    </ThemeProvider>
    </>    
    )
}

export default Studio