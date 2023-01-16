import { FormControl, InputLabel, Select, MenuItem, Stack, IconButton, Grid, Box, Button, TextField, Typography, Paper, styled, Container} from "@mui/material";
import { useEffect, useState} from "react";
import {Avatar} from '@mui/material/';
import Popup from './Popup.js'
import { PaginatedList } from "react-paginated-list";
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
    padding: theme.spacing(2),
    textAlign: 'left',
    color: theme.palette.text.secondary,
    borderRadius: '30px',
  }));

  const token = localStorage.getItem('accessToken')

/*async function editUser(values) {
    return fetch(`http://127.0.0.1:8000/accounts/edit/`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(values)
    }).then(data => data.json())
    }*/

async function editUser(values){
    const fileInput = document.getElementById('avatar_input');
    var myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${token}`);

    var formdata = new FormData();
    formdata.append("username", values.username ? values.username : '');
    formdata.append("first_name", values.first_name ? values.first_name : '');
    formdata.append("last_name", values.last_name ? values.last_name : '');
    formdata.append("email", values.email ? values.email : '');
    formdata.append("password", values.password ? values.password : '');
    formdata.append("phone", values.phone ? values.phone : '');
    if(fileInput.files.length > 0){
        formdata.append("avatar", fileInput.files[0], values.avatar);
    }

    var requestOptions = {
    method: 'PATCH',
    headers: myHeaders,
    body: formdata,
    redirect: 'follow'
    };

    return fetch(`http://127.0.0.1:8000/accounts/edit/`, requestOptions)
    .then(response => response.json)
    //.then(result => console.log(result))
}

async function updateCard(credentials) {
    return fetch(`http://127.0.0.1:8000/accounts/card_update/`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
            },
        body: JSON.stringify(credentials)
    }).then(data => data.json())
}


async function updateSubscription(credentials) {
    return fetch(`http://127.0.0.1:8000/accounts/subscription_update/`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
            },
        body: JSON.stringify(credentials)
    }).then(data => data.json())
}



export default function View() {
    const [username, setUsername] = useState('')
    const [first_name, setFirstname] = useState('')
    const [last_name, setLastname] = useState('')
    const [phone, setPhone] = useState('')
    const [avatar, setAvatar] = useState('')
    const [email, setEmail] = useState('')

    const [subscriptionPopup, setSubscriptionPopup] = useState(false)
    const [paymentPopup, setPaymentPopup] = useState(false)
    const [openPopup, setOpenPopup] = useState(false)

    const [username2, setUsername2] = useState('')
    const [first_name2, setFirstname2] = useState('')
    const [last_name2, setLastname2] = useState('')
    const [phone2, setPhone2] = useState('')
    const [avatar2, setAvatar2] = useState('')
    const [email2, setEmail2] = useState('')
    const [password, setPassword] = useState('')
    
    const [currCard, setCurrCard] = useState("")
    const [cardError, setCardError] = useState(false)

    const [allPlans, setAllPlans] = useState([]);
    const [currentSubscription, setCurrentSubscription] = useState({})
    const [payment_history, setPaymentHistory] = useState([]);

    useEffect(() => {
        if (currentSubscription == {}){
            currentSubscription = {plan: null, 
                date_of_purchase: null,
            next_payment: null,
        card_info: null}
        }
    })

    // Payment history and Current Subscription
    useEffect(() => {
        fetch(`http://127.0.0.1:8000/accounts/payment_history/`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            },
        }).then(data => data.json())
        .then(json => {
            setCurrentSubscription(json.current_subscription)
            setPaymentHistory(json.payment_history)
        })
    }, []
    )

    // Get user
    useEffect(() => {
        fetch(`http://127.0.0.1:8000/accounts/view/`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            },
        }).then(data => data.json())
        .then(json => {
            setUsername(json.username)
            setFirstname(json.first_name)
            setLastname(json.last_name)
            setPhone(json.phone)
            setAvatar(json.avatar)
            setEmail(json.email)
        })

        setUsername2(username)
        setFirstname2(first_name)
        setLastname2(last_name)
        setPhone2(phone)
        setAvatar2(avatar)
        setEmail2(email)
    }, [username, first_name, last_name, phone, avatar, email]
    )

    
    // Payment Method
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
    }, [])

    useEffect(() => {
        fetch(`http://127.0.0.1:8000/accounts/plans/`, {
        method: 'GET',
    })
    .then(data => data.json())
    .then(json => {setAllPlans(json.plans)})
    }, [])

    const handleEditUser = async (event) => {
        event.preventDefault();

        console.log(first_name2)
        const response = await editUser({username: username2,first_name: first_name2,last_name: last_name2,phone: phone2, avatar: avatar2, email: email2, password: password})
        if (username2 in response){
            setUsername(response[username])
            setFirstname(response[first_name])
            setLastname(response[last_name])
            setPhone(response[phone])
            setAvatar(response[avatar])
            setEmail(response[email])
        }
    }

    const handleUpdatePayment = async (event) => {
        event.preventDefault();
        const card = parseInt(document.getElementById("20").value)
        if (isNaN(card)){
            return setCardError(true)
        }
        const response = updateCard({"card_info": card})
        setCurrCard(card)
        setPaymentPopup(false)
        return setCardError(false)
    }

    const handleCancelSubscription = async (event) => {
        setCurrentSubscription({})
        return fetch(`http://127.0.0.1:8000/accounts/subscription_cancel/`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
        }})
    }

    const handleMakeSubscription = async (event) => {
        window.location.href = "/subscriptions";
    }

    const handleUpdateSubscription = async (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const plan = data.get("plan")
        const card_info = data.get("card")
        const response = await updateSubscription({plan, card_info})
        setCurrentSubscription(response)
        if (!("error" in response)){
            setSubscriptionPopup(false)
        }
    }

    return (
        <>
        <ThemeProvider theme={themeButton}>
            <CssBaseline />
        <Typography variant='h1' fontWeight='bold' pl={'1em'} pt={'1em'} color='white'>View Account</Typography>
        <br></br>
        <Stack direction = 'row' spacing={6} justifyContent='center' alignItems='flex-start' p={'5em'}>
        <Grid container alignItems="flex-start" rowSpacing={1} spacing={2} justifyContent="center">
            <Grid item xs>
                <Grid container spacing={4}>
                    <Grid item xs={12}>
                        <Item>
                            <Typography variant='h3'>
                                Profile Information
                            </Typography>
                            
                            <Item>
                                <Button type="submit"
                                color='secondary'
                                fullWidth
                                variant="contained"
                                sx={{ mt: 3, mb: 2 }}
                                onClick = {() => setOpenPopup(true)}
                                >
                                    Edit Profile
                                </Button>
                            </Item>

                            <Grid container spacing = {2}>
                                <Grid item xs={12}>
                                    <Item>
                                    <Typography variant='h3'>
                                        Avatar
                                    </Typography>
                                    <Avatar src = {avatar} sx={{height: 150, width: 150}}></Avatar>
                                    </Item>
                                </Grid>

                                <Grid item xs={12}>
                                    <Item>
                                    <Typography variant='h3'>
                                        Username
                                    </Typography>
                                    <Typography variant='p2' fontSize={20}>
                                        {username}</Typography> 
                                    </Item>
                                </Grid>

                                <Grid item xs={12}>
                                    <Item>
                                    <Typography variant='h3'>
                                        Email
                                    </Typography>
                                    <Typography variant='p2' fontSize={20}>
                                        {email}</Typography> 
                                    </Item>
                                </Grid>

                                <Grid item xs={12}>
                                    <Item>
                                    <Typography variant='h3'>
                                        First Name
                                    </Typography> 
                                    <Typography variant='p2' fontSize={20}>
                                        {first_name}</Typography> 
                                    </Item>
                                </Grid>

                                <Grid item xs={12}>
                                    <Item>
                                    <Typography variant='h3'>
                                        Last Name
                                    </Typography>  
                                    <Typography variant='p2' fontSize={20}>
                                        {last_name}</Typography> 
                                    </Item>
                                </Grid>

                                <Grid item xs={12}>
                                    <Item>
                                    <Typography variant='h3'>
                                        Phone Number
                                    </Typography>  
                                    <Typography variant='p2' fontSize={20}>
                                        {phone}</Typography> 
                                    </Item>
                                </Grid>

                            </Grid>
                           
                        </Item>
                    </Grid>

                </Grid> 
            </Grid>
            <Grid item xs>
                <Grid container spacing={4}>  
                    <Grid item xs={12}>
                        
                        <Item>
                            <Typography variant='h3'> 
                                Payment method
                            </Typography>
                            <Button fullWidth
                            color='secondary'
                                variant="contained"
                                sx={{ mt: 4, mb: 1 }}
                                onClick = {() => setPaymentPopup(true)}>
                                     Update Payment Method </Button>
                            <Box sx={{display: "flex", justifyContent: "space-between"}}  component="div">
                                <span>Card number</span>
                                <span><Typography sx={{fontSize: 20}}>{currCard}</Typography></span>
                            </Box>
                        </Item>
                    </Grid>

                    <Grid item xs={12}>
                        <Item>
                            <Typography variant='h3'>
                                Current Subscription
                            </Typography>
                            <Box sx={{display: "flex", justifyContent: "space-between"}}  component="div">
                                <span>Subscription</span>
                                {currentSubscription.plan != null &&
                                <span><Typography sx={{fontSize: 20}}>{currentSubscription.plan}</Typography></span>
                                }
                                {currentSubscription.plan == null &&
                                    <span>None</span>
                                }
                            </Box>
                            <Box sx={{display: "flex", justifyContent: "space-between"}}  component="div">
                                <span>Date of purchase</span>
                                {currentSubscription.date_of_purchase != null  &&
                                <span><Typography sx={{fontSize: 20}}>{currentSubscription.date_of_purchase.slice(0,10)}</Typography></span>
                                }
                                {currentSubscription.date_of_purchase == null  &&
                                    <span>None</span>
                                }
                            </Box>
                            <Box sx={{display: "flex", justifyContent: "space-between"}}  component="div">
                                <span>Next payment</span>
                                {currentSubscription.next_payment != null &&
                                <span><Typography sx={{fontSize: 20}}>{currentSubscription.next_payment.slice(0,10)}</Typography></span>
                                } 
                                {currentSubscription.next_payment == null &&
                                    <span>None</span>
                                }     
                            </Box>

                            <Box sx={{display: "flex", justifyContent: "space-between"}}  component="div">
                                <span>Card Info</span>
                                {currentSubscription.card_info != null &&
                                <span><Typography sx={{fontSize: 20}}>{currentSubscription.card_info}</Typography></span>
                                }
                                {currentSubscription.card_info == null &&
                                    <span>None</span>
                                }     
                            </Box>

                            <Box sx={{display: "flex", justifyContent: "space-evenly"}}  component="div">
                                {currentSubscription.plan != null &&
                                <span>
                                        <Button color='secondary' variant="contained" onClick={() => setSubscriptionPopup(true)}>
                                            Update Subscription
                                        </Button>
                                </span>
                                }
                                {currentSubscription.plan != null &&
                                <span>
                                    
                                    <Button color='secondary' variant="contained" onClick={handleCancelSubscription}>
                                        Cancel Subscription
                                    </Button>
                                </span>
                                }
                                {currentSubscription.plan == null &&
                                <span>
                                    
                                    <Button color='secondary' variant="contained" onClick={handleMakeSubscription}>
                                        Make subscription
                                    </Button>
                                </span>
                                }
                            </Box>
                        </Item>
                    </Grid>

                    <Grid item xs={12}>
                        <Item>
                            <Typography variant='h3'>
                                Payment History
                            </Typography>
                            <br></br>
                            <PaginatedList
                                    list={payment_history}
                                    itemsPerPage={4}
                                    renderList={(list) => (
                                    <>
                                        {list.map((item, id) => {
                                            if (item.next_payment != null){
                                                item.next_payment = item.next_payment.slice(0,10)
                                            } else {
                                                item.next_payment = "None"
                                            }
                                        return (
                                            <Grid item xs={12} key = {item.id}>
                                                <br></br>
                                                <Item key={id}>
                                                    <Box sx={{display: "flex", justifyContent: "space-between"}}  component="div">
                                                        <span>Plan</span>
                                                        {currentSubscription.card_info != null &&
                                                        <span> <Typography>{item.plan}</Typography></span>
                                                        }
                                                        {currentSubscription.card_info == null &&
                                                            <span>None</span>
                                                        }     
                                                    </Box>
                                                    <Box sx={{display: "flex", justifyContent: "space-between"}}  component="div">
                                                        <span>Date of Purchase</span>
                                                        {currentSubscription.card_info != null &&
                                                        <span> <Typography>{item.date_of_purchase.slice(0,10)}</Typography></span>
                                                        }
                                                        {currentSubscription.card_info == null &&
                                                            <span>None</span>
                                                        }     
                                                    </Box>
                                                    <Box sx={{display: "flex", justifyContent: "space-between"}}  component="div">
                                                        <span>Date of Next Payment</span>
                                                        <span> <Typography>{item.next_payment}</Typography></span>
                                                    </Box>
                                                    <Box sx={{display: "flex", justifyContent: "space-between"}}  component="div">
                                                        <span>Card Info</span>
                                                        {currentSubscription.card_info != null &&
                                                        <span> <Typography>{item.card_info}</Typography></span>
                                                        }
                                                        {currentSubscription.card_info == null &&
                                                            <span>None</span>
                                                        }     
                                                    </Box>
                                                </Item>
                                            </Grid>
                                        );
                                        })}
                                        
                                    </>
                                    )}
                                />
                        </Item>
                    </Grid>

                </Grid>
            </Grid>
        </Grid>
        </Stack>
        <Popup title = "Update Subscription" openPopup = {subscriptionPopup} setOpenPopup = {setSubscriptionPopup}>
            <Box component='form' onSubmit={handleUpdateSubscription} sx={{mt:2}}>
                <Box p={"1em"}>
                    <TextField defaultValue={currCard} fullWidth name="card"/>
                </Box>
                <Box p={"1em"}>
                    <FormControl fullWidth>
                        <InputLabel id="plan-select-label">Plan</InputLabel>
                        <Select defaultValue={currentSubscription.name} name = "plan">
                            {allPlans.map((plan, index) => (
                                <MenuItem value={plan.name}> 
                                    {plan.name}
                                </MenuItem>)
                                )
                            }
                        </Select>
                    </FormControl>
                </Box>
                <Button color='secondary' type="submit" onClick={() => {setOpenPopup(false)}} variant="contained" sx={{}}>
                    Update
                </Button>
            </Box>
        </Popup>


        <Popup title = "Update payment method " openPopup = {paymentPopup} setOpenPopup = {setPaymentPopup}>
            <Box component="form" onSubmit={handleUpdatePayment} sx={{mt: 2}}>
                <div>
                <TextField
                        label="Card number"
                        defaultValue= {currCard}
                        error = {cardError}
                        helperText={"Leave input empty to remove card"}
                        id="20"/>
                </div>
                <br></br>
                <div>
                <Button color='secondary'
                    type="submit"
                    variant="contained" sx={{}}>Save Changes</Button>
                </div>
            </Box>
        </Popup>
        
        
        <Popup title = "Edit Profile" openPopup = {openPopup} setOpenPopup = {setOpenPopup}>
            <Box
                component="form"
                onSubmit={handleEditUser}
                sx={{
                    '& .MuiTextField-root': { m: 1.5, width: '60ch' },
                }}
                noValidate
                autoComplete="off"
                >
                <div>
                    <IconButton variant="contained" component="label">
                        <Avatar src={avatar}
                                sx={{width: 120, height: 120}}>
                        </Avatar>
                        <input id='avatar_input' hidden accept="image/*" multiple type="file" onChange={e => setAvatar2(e.target.value)}/>
                    </IconButton>
                </div>
                <br></br>
                <div>
                    <TextField
                    label="First name"
                    defaultValue= {first_name}
                    id="1"
                    onChange={e => setFirstname2(e.target.value)}
                    />
                    <TextField
                    label="Last name"
                    id="2"
                    defaultValue= {last_name}
                    onChange={e => setLastname2(e.target.value)}
                    />
                </div>
                <div>
                    <TextField
                    label="Username"
                    id="3"
                    defaultValue={username}
                    onChange={e => setUsername2(e.target.value)}
                    />
                    <TextField
                    label="Email"
                    id="4"
                    defaultValue= {email}
                    onChange={e => setEmail2(e.target.value)}
                    />
                    <TextField
                    label="Phone number"
                    id="5"
                    defaultValue= {phone}
                    onChange={e => setPhone2(e.target.value)}
                    />
                </div>
                <div>
                    <TextField
                    label="Password"
                    id="6"
                    type="password"
                    required={true}
                    onChange={e => setPassword(e.target.value)}
                    helperText="Retype password to change OR Type new password to change"
                    />
                </div>
                <div>
                    <Button color='secondary'
                    type="submit"
                    variant="contained" sx={{}}>Save Changes</Button>
                </div>
            </Box>
        </Popup>
        </ThemeProvider>
        </>
    )
}