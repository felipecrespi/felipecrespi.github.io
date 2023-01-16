import { useEffect, useState} from "react";
import * as React from 'react';
import Typography from '@mui/material/Typography';
import { styled, ThemeProvider, createTheme} from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Pagination from '@mui/material/Pagination';
import ClassList from "../general/ClassList"
import CssBaseline from '@mui/material/CssBaseline';

const themeLight = createTheme({
    palette: {
      background: {
        default: "#2B3035"
      }
    }
  });

const token = localStorage.getItem('accessToken')

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'left',
    color: theme.palette.text.secondary,
  }));

const ClassHistory = () => {
    const [classes, setClasses] = useState([]);
    const [count, setCount] = useState(0)
    const [page, setPage] = useState(1)

    const handlePage = (e, p) => {
        setPage(p);
    }

    const requestOptions = {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        }
    };

    useEffect(() => {
        fetch(`http://127.0.0.1:8000/classes/history/?limit=10&offset=${(page - 1) * 10}`, requestOptions)
            .then(res => res.json())
            .then(json => {
                setClasses(json.results);
                setCount(json.count);
            })
        }, [page])
    
    return !classes ? null : (
    <>
    <ThemeProvider theme={themeLight}>
    <CssBaseline />
    <Stack direction='column' spacing={3} p={'5em'} alignItems='stretch'>
        <Typography variant='h1' color={'white'} sx={{ fontWeight: 'bold' }}>Your class history:</Typography>
        <Item>
            <ClassList classes={classes}></ClassList>
            <Pagination count={Math.ceil(count / 10)} onChange={handlePage} page={page} />
        </Item>
    </Stack>
    </ThemeProvider>
    </>    
    )
}

export default ClassHistory