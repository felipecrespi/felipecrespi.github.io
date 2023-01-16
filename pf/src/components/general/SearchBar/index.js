import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import { CssBaseline } from '@mui/material';
import { styled } from '@mui/material/styles';
import { ThemeProvider, createTheme } from "@mui/material/styles";

let theme = createTheme({
    palette: {
      primary: {
        main: '#ffffff',
      },
      secondary: {
        main: '#edf2ff',
      },
      background: {
        default: "#2B3035"
      }
    },
  });

const SearchBar = ({ setSearch, search, search_value, text, opts }) =>  {
    return(
        <ThemeProvider theme={theme}>
        <CssBaseline />
        <Autocomplete
            onChange={(event, newValue) => {
                setSearch({...search, [search_value]: newValue});
            }}
            onInputChange={(event, newValue, reason) => {
            if(reason === 'reset'){
                setSearch({...search, [search_value]: ''});
            }
            }}
            id="controllable-states-demo"
            options={opts}
            sx={{ minWidth: '7em', maxWidth: '10em', width: '100%' }}
            renderInput={(params) => <TextField {...params} color='primary' sx={{ input: { color: 'white' }, label: { color: 'white' } }} label={text} />}
        />
        </ThemeProvider>
    )
}

export default SearchBar