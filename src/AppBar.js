import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import AdbIcon from '@mui/icons-material/Adb';
// import FormComponent from './FormComponent';
// import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
const pages = ['Request', 'View',];
const pagesBeforeLogin = ['gooleLoginButton']
const displayName = {
  'Request': 'リクエスト',
  'View': 'リクエストされたすべてのリスト',
  'SignUp': 'サインアップ',
  'Login': 'ログイン',
  'gooleLoginButton': 'ログイン',
  'Logout': 'ログアウト'

}
const settings = ['Profile', 'Account', 'Dashboard', 'Logout'];



const ResponsiveAppBar = ({ user, handleLogout }) => {
  console.log(user);
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

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
  const navigate = useNavigate();

  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          {/* <Router> */}
          <Box
            component="img"
            sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }}
            alt="すかいらーく"
            src='https://www.skylark.co.jp/site_resource/common/images/header/logo_skylark_gloup.png'
            onClick={() => navigate('/')}
          />



          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{ display: { xs: 'block', md: 'none' } }}
            >

              {/* <MenuItem key={"request"}><Link to="/request"><Typography sx={{textAlign:'center'}}>Request</Typography></Link></MenuItem>
                <MenuItem key={"view"}><Link to="/view"><Typography sx={{textAlign:'center'}}>View</Typography></Link></MenuItem>
                <MenuItem key={"modified"}><Link to="/modified"><Typography sx={{textAlign:'center'}}>Modified</Typography></Link></MenuItem> */}

              {user && pages.map((page) => (
                <MenuItem key={page} onClick={() => navigate('/' + page)}>
                  <Typography sx={{ textAlign: 'center' }}>{displayName[page]}</Typography>
                </MenuItem>
              ))}
              {user && <MenuItem >
                <Typography onClick={handleMenuOpen} variant="body1" sx={{ marginRight: 2 }}>
                  {user.name || user.email}
                </Typography>
                <IconButton onClick={handleMenuOpen} color="inherit">
                  <Avatar alt={user.name} src={user.picture} />
                </IconButton>
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleMenuClose}
                >
                  <MenuItem onClick={handleLogout}>Logout</MenuItem>
                </Menu>
                {/* <Typography sx={{ textAlign: 'center' }}>ログアウト</Typography> */}
              </MenuItem>}
              {!user && pagesBeforeLogin.map((page) => (
                <MenuItem key={page} onClick={() => navigate('/' + page)}>
                  <Typography sx={{ textAlign: 'center' }}>{displayName[page]}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>

          <Typography
            variant="h5"
            noWrap
            component="a"
            href="#app-bar-with-responsive-menu"
            sx={{
              mr: 2,
              display: { xs: 'flex', md: 'none' },
              flexGrow: 1,
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
            onClick={() => navigate('/')}
          >
            すかいらーく
          </Typography>

          <Box sx={{
            justifyContent: 'flex-end', // Moves button to the right
            padding: 2, // Optional padding
            display: { xs: 'none', md: 'flex' },
            position: 'absolute',
            right: '10px'
          }}>
            {/* <Button key={"request"}  sx={{ my: 2, color: 'white', display: 'block' }}><Link to="/request">Request</Link></Button>
          <Button key={"view"}  sx={{ my: 2, color: 'white', display: 'block' }}><Link to="/view">View</Link></Button>
          <Button key={"modified"}  sx={{ my: 2, color: 'white', display: 'block' }}><Link to="/modified">Modified</Link></Button> */}

            {user && pages.map((page) => (
              <Button
                key={page}
                onClick={() => navigate('/' + page)}
                sx={{ my: 2, color: 'white', display: 'block' }}
              >
                {displayName[page]}
              </Button>
            ))}
            {user && <> <Button
              onClick={handleMenuOpen}
              sx={{ my: 2, color: 'white', display: 'block' }}
            >
              {user.name}
            </Button>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
              >
                <MenuItem onClick={handleLogout}>ログアウト</MenuItem>
              </Menu></>}
            {!user && pagesBeforeLogin.map((page) => (
              <Button
                key={page}
                onClick={() => navigate('/' + page)}
                sx={{ my: 2, color: 'white', display: 'block' }}
              >
                {displayName[page]}
              </Button>
            ))}
          </Box>

          {/* <Routes>
                <Route path='/request' element={<FormComponent/>}/>
                <Route path='/view' element={<h2>View</h2>}/>
                <Route path='/modified' element={<h2>Modified</h2>}/>
          </Routes> */}

          {/* </Router> */}
          {/* <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar alt="Remy Sharp" src="/static/images/avatar/2.jpg" />
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: '45px' }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {settings.map((setting) => (
                <MenuItem key={setting} onClick={handleCloseUserMenu}>
                  <Typography sx={{ textAlign: 'center' }}>{setting}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box> */}
        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default ResponsiveAppBar;
