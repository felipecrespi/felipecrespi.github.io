import * as React from 'react';
import { useEffect, useState} from "react";
import {Link, Outlet} from 'react-router-dom';
import {AppBar, Toolbar, Button, Menu, MenuItem, IconButton, Avatar, Typography} from "@mui/material"
import logo from "./tfc.jpg"


const Navbar = () => {
  const token = localStorage.getItem('accessToken');
  const [avatar, setAvatar] = useState('')
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const logoutUser = () => {
    localStorage.removeItem('accessToken')
    window.location.href = "/";
  };

  useEffect(() => {
    if (token == null){
      return setAvatar('')
    }
    fetch(`http://127.0.0.1:8000/accounts/view/`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        },
    }).then(data => data.json())
    .then(json => {
        setAvatar(json.avatar)
    })
  }
  )

  return (
    <>
      <AppBar position='static' style={{ background: '#F65250' }}>
        <Toolbar>
          <Button id = "logo"
                  sx={{display: {xs: "none", md: "flex"}}}>
            <Link style = {{textDecoration: "none"}} to="/"><img src={logo} alt="logo" width="210" height="110"/></Link>
          
          </Button>    
          <Button
                  aria-controls="shrunken_logo_menu"
                  aria-haspopup="true"
                  onClick={handleOpenNavMenu}
                  sx={{margin: "auto", display: {xs: "flex", md: "none"}}}>
            <img src={logo} alt="logo" width="210" height="110"/>
          </Button>

          <Menu id="shrunken_logo_menu"
            anchorEl={anchorElNav}
            anchorOrigin={{
              vertical: 'center', 
              horizontal: 'center'
            }}
            keepMounted
            transformOrigin={{
              vertical: 'center',
              horizontal: 'center',
            }}
            open={Boolean(anchorElNav)}
            onClose={handleCloseNavMenu}
            sx={{
              display: { xs: 'block', md: 'none' },
            }}
          >
            <MenuItem onClick={handleCloseNavMenu}><Link style = {{textDecoration: "none", color:"white"}}to="/studios">Studios</Link></MenuItem>
            <MenuItem onClick={handleCloseNavMenu}><Link style = {{textDecoration: "none", color:"white"}}to="/subscriptions">Subscriptions</Link></MenuItem>
            {!token&&
            <MenuItem onClick={handleCloseNavMenu}><Link style = {{textDecoration: "none", color:"white"}}to="/subscriptions">Subscriptions</Link></MenuItem>
            }
            {!token&& 
            <MenuItem onClick={handleCloseUserMenu}><Link style = {{textDecoration: "none", color:"white"}}to="/account/login">Login</Link></MenuItem>
            }
            {!token&&
            <MenuItem onClick={handleCloseUserMenu}><Link style = {{textDecoration: "none", color:"white"}}to="/account/register">Register</Link></MenuItem>
            }
            <MenuItem onClick={handleCloseNavMenu}><Link style = {{textDecoration: "none", color:"white"}}to="/account/view">My account</Link></MenuItem>
            <MenuItem onClick={handleCloseNavMenu}><Link style = {{textDecoration: "none", color:"white"}}to="/account/classes">My classes</Link></MenuItem>
          </Menu>


          <Button sx={{margin: "auto", display: {xs: "none", md: "flex"}}}><Link style = {{textDecoration: "none", color:"white", fontSize: "200%", fontWeight: 'bold'}} to="/studios">Studios</Link></Button>
          <Button sx={{margin: "auto", display: {xs: "none", md: "flex"}}}><Link style = {{textDecoration: "none", color:"white", fontSize: "200%", fontWeight: 'bold'}} to="/subscriptions">Subscriptions</Link></Button>
          <IconButton id = "account_btn"
                  aria-controls="profile_menu"
                  aria-haspopup="true"
                  onClick={handleOpenUserMenu}
                  sx={{marginLeft: "auto", display: {xs: "none", md: "flex"}}}>
                  <Avatar src={avatar} 
                          sx={{ width: 100, height: 100}}/>
          </IconButton>
          <Menu id="profile_menu"
            anchorEl={anchorElUser}
            anchorOrigin={{vertical: 'bottom', horizontal: 'right'}}
            keepMounted
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            open={Boolean(anchorElUser)}
            onClose={handleCloseUserMenu}
          >
            {!token&& 
            <MenuItem onClick={handleCloseUserMenu}><Link style = {{textDecoration: "none", color:"black"}}to="/account/login">Login</Link></MenuItem>
            }
            {!token&&
            <MenuItem onClick={handleCloseUserMenu}><Link style = {{textDecoration: "none", color:"black"}}to="/account/register">Register</Link></MenuItem>
            }
            {token&&
            <MenuItem onClick={handleCloseUserMenu}><Link style = {{textDecoration: "none", color:"black"}}to="/account/view">My account</Link></MenuItem>
            }
            {token&&
            <MenuItem onClick={handleCloseUserMenu}><Link style = {{textDecoration: "none", color:"black"}}to="/account/classes">My classes</Link></MenuItem>
            }
            {token&& 
            <MenuItem onClick={logoutUser}>Logout</MenuItem>
            }
          </Menu>
        </Toolbar>
      </AppBar>
      <Outlet/>
    </>
  )
}
export default Navbar;