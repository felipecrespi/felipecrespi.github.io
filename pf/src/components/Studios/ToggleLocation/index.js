import * as React from 'react';
import Typography from '@mui/material/Typography';
import MuiToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import { styled } from '@mui/material/styles';

const ToggleButton = styled(MuiToggleButton)(({ theme }) => ({
  backgroundColor: '#F65250',
  color: theme.palette.text.secondary,
}));

export default function ToggleButtons({ onClick }) {
  const [alignment, setAlignment] = React.useState('');

  const handleAlignment = (event, newAlignment) => {
    setAlignment(newAlignment);
    onClick(newAlignment);
  };

  return (
    <ToggleButtonGroup
      value={alignment}
      exclusive
      onChange={handleAlignment}
      aria-label="text alignment"
    >
      <ToggleButton value="left" aria-label="left aligned">
        <Typography variant='button' color={'white'}>My current location</Typography>
      </ToggleButton>
      <ToggleButton value="right" aria-label="centered">
        <Typography variant='button' color={'white'}>Default location</Typography>
      </ToggleButton>
    </ToggleButtonGroup>
  );
}