import { MenuItem, FormControl, Select, InputLabel , Grid, Box, Button, TextField, Typography, Paper, styled, Container, Link, Checkbox, FormControlLabel} from "@mui/material";
import { useEffect, useState} from "react";
import Popup from "../View/Popup";
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
    textAlign: 'left',
    color: theme.palette.text.secondary,
    borderRadius: '30px',
  }));

const token = localStorage.getItem('accessToken')

async function makeSubscription(credentials) {
    console.log(credentials)
    return fetch(`http://127.0.0.1:8000/accounts/subscribe/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
            },
        body: JSON.stringify(credentials)
    }).then(data => data.json())
}

export default function Subscription() {
    const token = localStorage.getItem('accessToken')
    const [allPlans, setAllPlans] = useState([]);
    const [hasSubscription, setHasSubscription] = useState(false);
    const [openPopup, setOpenPopup] = useState(false);
    const [planSubscribe, setPlanSubscribe] = useState(null);
    const [currCard, setCurrCard] = useState("")

    useEffect(() => {
        fetch(`http://127.0.0.1:8000/accounts/card_view/`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        },
        }).then(data => data.json())
        .then(json => {
            setCurrCard(json.current_card)
        })
    })

    useEffect(() => {
        if (token == null){
            return setHasSubscription(false)
        }
        fetch(`http://127.0.0.1:8000/accounts/payment_history/`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            },
        }).then(data => data.json())
        .then(json => {
            const check = json.current_subscription
            if (check['user'] == null) {
                setHasSubscription(false)
            } else {
                setHasSubscription(true)
            }
        })
    })

    useEffect(() => {
        fetch(`http://127.0.0.1:8000/accounts/plans/`, {
        method: 'GET',
    }).then(data => data.json())
    .then(json => {setAllPlans(json.plans)})
    }, [token])

    const cannotSub = () => {
        if (hasSubscription){
        }

        if (hasSubscription == true || token == null){
            // does not have subscription or logged in
            return true
        } 
        return false
    };

    const openInPopup = plan => {
        setPlanSubscribe(plan.name)
        setOpenPopup(true)
    }

    const subscribeToPlan = async (event) => {
        event.preventDefault();
        setHasSubscription(true)
        setPlanSubscribe(null)
        const data = new FormData(event.currentTarget);
        const plan = data.get("plan")
        const card_info = data.get("card")
        const response = await makeSubscription({plan, card_info})
        if (response["message"] == "subscribed to plan successfully"){
            window.location.href = "/account/view";
        }

    }

    return (
        <>
        <ThemeProvider theme={themeButton}>
            <CssBaseline />
        <Typography variant='h1' pl={'1em'} pt={'1em'}  fontWeight={'bold'} color={'white'}>Subscriptions</Typography>
        
        <Grid container p={'2em'} pl={'5em'} pr={'5em'} rowSpacing={3} columnSpacing={6} justifyContent='center' alignItems="flex-start">
          {allPlans.map((plan, index) => (
              <Grid item xs={12} key={index}>
                <Item>
                    <Typography variant='h2'>
                        {plan.name}
                    </Typography>
                    <Typography variant='body1'>
                        Price: {plan.price}
                    </Typography>
                    <Typography variant='body1'>
                        Billing period: {plan.billing_period}
                    </Typography>
                    {!cannotSub() &&
                    <Button variant="contained" onClick = {() => {openInPopup(plan)}}>Subscribe to Plan</Button>
                    }
                </Item>
              </Grid>
          ))}
        </Grid>
        <Popup title= {`Subscribe to Plan`} openPopup={openPopup} setOpenPopup={setOpenPopup}>
            <Box component="form" onSubmit={subscribeToPlan} padding={2} p={"2em"}>
                <Box p={"1em"}>
                    <TextField defaultValue={currCard} fullWidth name="card"/>
                </Box>
                <Box p={"1em"}>
                <FormControl fullWidth>
                <InputLabel id="plan-select-label">Plan</InputLabel>
                <Select
                defaultValue={planSubscribe} name = "plan"
                >
                    {allPlans.map((plan, index) => (
                        <MenuItem value={plan.name}> 
                            {plan.name}
                        </MenuItem>
                    ))}
                </Select>
                </FormControl>
                </Box>
                <Button type="submit" onClick={() => {setOpenPopup(false)}} variant="contained" sx={{}}>
                    Subscribe
                </Button>
            </Box>
        </Popup>
        </ThemeProvider>
        </>
    )
}