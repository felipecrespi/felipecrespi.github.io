import { useEffect, useState} from "react";
import { Link as ReactLink } from "react-router-dom";
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Pagination from '@mui/material/Pagination';
import Link from '@mui/material/Link';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import ToggleLocation from './ToggleLocation/'
import SearchBar from "../general/SearchBar";
import Map from "./Map";
import { Typography, CssBaseline } from "@mui/material";
import { styled } from '@mui/material/styles';
import { ThemeProvider, createTheme } from "@mui/material/styles";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: 'white',
  ...theme.typography.body2,
  padding: theme.spacing(2),
  textAlign: 'left',
  color: theme.palette.text.secondary,
  borderRadius: '20px',
}));

const themeLight = createTheme({
  palette: {
    background: {
      default: "#2B3035"
    }, 
    secondary:{
      main: "#ffffff"
    }
  }
});

const Studios = () => {
    const [allStudios, setAllStudios] = useState([]);
    const [studios, setStudios] = useState([]);
    const [sortBy, setSortBy] = useState('')
    const [location, setLocation] = useState({latitude: 43.653225, longitude: -79.383186})
    const [search, setSearch] = useState({name: '', class_name: '', amenities: '', coach: ''})
    const [count, setCount] = useState(0)
    const [page, setPage] = useState(1)

    const handlePage = (e, p) => {
      setPage(p);
    }

    const updateSortBy = (alignment) => {
      if(alignment === 'left'){
        setSortBy('my_location');
      }
      if(alignment === 'right'){
        setSortBy('default');
      }
    }

    useEffect(() => {
      const { latitude, longitude } = location;
      fetch(`http://127.0.0.1:8000/studios/all/?latitude=${latitude}&longitude=${longitude}`)
          .then(res => res.json())
          .then(json => {
              setAllStudios(json.results);
              setCount(json.count);
          })
      }, [])

    useEffect(() => {
      const { latitude, longitude } = location;
      fetch(`http://127.0.0.1:8000/studios/all/?limit=9&offset=${(page - 1) * 9}&latitude=${latitude}&longitude=${longitude}`)
          .then(res => res.json())
          .then(json => {
              setStudios(json.results);
              setCount(json.count);
          })
      }, [location])

    useEffect(() => {
      const { latitude, longitude } = location;
      let { name, class_name, amenities, coach } = search;
      name = name !== null && name.length > 0 ? `&name=${name}` : '';
      class_name = class_name !== null && class_name.length > 0 ? `&class_name=${class_name}` : '';
      amenities = amenities !== null && amenities.length > 0 ? `&amenities=${amenities}` : '';
      coach = coach !== null && coach.length > 0 ? `&coach=${coach}` : '';

      setPage(1);

      fetch(`http://127.0.0.1:8000/studios/all/?limit=9&offset=${(page - 1) * 9}&latitude=${latitude}&longitude=${longitude}${name}${class_name}${coach}${amenities}`)
          .then(res => res.json())
          .then(json => {
              setStudios(json.results);
              setCount(json.count);
          })
      }, [search])

      useEffect(() => {
        const { latitude, longitude } = location;
        let { name, class_name, amenities, coach } = search;
        name = name !== null && name.length > 0 ? `&name=${name}` : '';
        class_name = class_name !== null && class_name.length > 0 ? `&class_name=${class_name}` : '';
        amenities = amenities !== null && amenities.length > 0 ? `&amenities=${amenities}` : '';
        coach = coach !== null && coach.length > 0 ? `&coach=${coach}` : '';
  
        fetch(`http://127.0.0.1:8000/studios/all/?limit=9&offset=${(page - 1) * 9}&latitude=${latitude}&longitude=${longitude}${name}${class_name}${coach}${amenities}`)
            .then(res => res.json())
            .then(json => {
                setStudios(json.results);
                setCount(json.count);
            })
        }, [page])

    useEffect(() => {
      if(sortBy === 'my_location'){
        navigator.geolocation.getCurrentPosition(
          function(position) {
            setLocation({latitude: position.coords.latitude, longitude: position.coords.longitude})
          },
        );
      }
      if(sortBy === 'default'){
        setLocation({latitude: 43.653225, longitude: -79.383186})
      }
    }, [sortBy])

    const studioOptions = allStudios.map((studio) => {return studio.name})
    const amenitiesOptions = [...new Set(allStudios.map((studio) => {return studio.amenities}).filter(e => e.length).flat(1).map((amenities) => {return amenities.name}))]
    const allClasses = allStudios.map((studio) => {return studio.klass}).filter(e => e.length).flat(1)
    const classOptions = [...new Set(allClasses.map((klass) => {return klass.name}))]
    const coachOptions = [...new Set(allClasses.map((klass) => {return klass.coach}))]

    return (studios &&
    <>
    <ThemeProvider theme={themeLight}>
    <CssBaseline />
    <Stack direction='column' spacing={2} justifyContent='center' alignItems='center' p={'2em'}>
      <Typography variant='h1' fontWeight={'bold'} color={'white'}>Studios</Typography>
      <Typography variant='h5' color={'white'}>Search/filter by:</Typography>
      <Stack direction='row' spacing={2}>
        <SearchBar setSearch={setSearch} search={search} search_value='name' text="Studio" opts={studioOptions}></SearchBar>
        <SearchBar setSearch={setSearch} search={search} search_value='class_name' text="Class" opts={classOptions}></SearchBar>
        <SearchBar setSearch={setSearch} search={search} search_value='amenities' text="Amenities" opts={amenitiesOptions}></SearchBar>
        <SearchBar setSearch={setSearch} search={search} search_value='coach' text="Coach" opts={coachOptions}></SearchBar>
      </Stack>
      <br></br>
      <Typography variant='h5' color={'white'}>Sort by:</Typography>
      <ToggleLocation onClick={updateSortBy}></ToggleLocation>
      <Grid container spacing={5} justifyContent='center' alignItems='flext-start' p={'5em'}>
        <Grid item xs={6}>
          <Map latitude={location.latitude} longitude={location.longitude} studios={studios}></Map>
        </Grid>
        <Grid item xs={6}>
          <Grid container rowSpacing={2} columnSpacing={6} justifyContent='center' alignItems="flex-start">
          {studios.map((studio, index) => (
              <Grid item xs={4} key={studio.id}>
              <Link component={ReactLink} to={`/studios/${studio.id}`} underline='none' key={index}>
                  <Item key={studio.id}>
                    <Typography variant='h5' key={`${studio.id} Name`} color={'#F65250'} fontWeight='bold'>
                      {studio.name}
                    </Typography>
                    <Typography variant='subtitle2' key={`${studio.id} Address`} color={'#2B3035'}>
                      {studio.address}
                    </Typography>
                    <Typography variant='subtitle2' key={`${studio.id} Postal Code`} color={'#2B3035'}>
                      {studio.postal_code}
                    </Typography>
                    <Typography variant='subtitle2' key={`${studio.id} Phone number`} color={'#2B3035'}>
                      {studio.phone_num}
                    </Typography>
                  </Item>
                </Link>
              </Grid>
          ))}
        </Grid>
        </Grid>
        <Grid item xs={1}>
            <Pagination color="secondary" count={Math.ceil(count / 10)} onChange={handlePage} page={page} />
          </Grid>
      </Grid>
    </Stack>
    </ThemeProvider>
    </>
    )
}

export default Studios