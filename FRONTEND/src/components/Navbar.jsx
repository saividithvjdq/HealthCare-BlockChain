import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  Container,
  Avatar,
  Button,
  Tooltip,
  MenuItem,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Divider
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import HealthAndSafetyIcon from '@mui/icons-material/HealthAndSafety';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleLogout = () => {
    logout();
    handleCloseUserMenu();
    navigate('/login');
  };

  const toggleDrawer = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setDrawerOpen(open);
  };

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'Records', path: '/records' },
  ];

  return (
    <AppBar position="static" sx={{ backgroundColor: '#1976d2' }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          {/* Logo for larger screens */}
          <HealthAndSafetyIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />
          <Typography
            variant="h6"
            noWrap
            component={Link}
            to="/"
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.2rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            HEALTHCARE BLOCKCHAIN
          </Typography>

          {/* Mobile menu */}
          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="menu"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={toggleDrawer(true)}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Drawer
              anchor="left"
              open={drawerOpen}
              onClose={toggleDrawer(false)}
            >
              <Box
                sx={{ width: 250 }}
                role="presentation"
                onClick={toggleDrawer(false)}
                onKeyDown={toggleDrawer(false)}
              >
                <List>
                  {navItems.map((item) => (
                    <ListItem key={item.name} disablePadding>
                      <ListItemButton component={Link} to={item.path}>
                        <ListItemText primary={item.name} />
                      </ListItemButton>
                    </ListItem>
                  ))}
                </List>
                <Divider />
                {user ? (
                  <List>
                    <ListItem disablePadding>
                      <ListItemButton component={Link} to="/profile">
                        <ListItemText primary="Profile" />
                      </ListItemButton>
                    </ListItem>
                    <ListItem disablePadding>
                      <ListItemButton onClick={handleLogout}>
                        <ListItemText primary="Logout" />
                      </ListItemButton>
                    </ListItem>
                  </List>
                ) : (
                  <List>
                    <ListItem disablePadding>
                      <ListItemButton component={Link} to="/login">
                        <ListItemText primary="Login" />
                      </ListItemButton>
                    </ListItem>
                    <ListItem disablePadding>
                      <ListItemButton component={Link} to="/register">
                        <ListItemText primary="Register" />
                      </ListItemButton>
                    </ListItem>
                  </List>
                )}
              </Box>
            </Drawer>
          </Box>

          {/* Logo for mobile */}
          <HealthAndSafetyIcon sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }} />
          <Typography
            variant="h5"
            noWrap
            component={Link}
            to="/"
            sx={{
              mr: 2,
              display: { xs: 'flex', md: 'none' },
              flexGrow: 1,
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.2rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            HEALTHCARE
          </Typography>

          {/* Desktop menu */}
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            {navItems.map((item) => (
              <Button
                key={item.name}
                component={Link}
                to={item.path}
                sx={{ my: 2, color: 'white', display: 'block' }}
              >
                {item.name}
              </Button>
            ))}
          </Box>

          {/* User menu */}
          <Box sx={{ flexGrow: 0 }}>
            {user ? (
              <>
                <Tooltip title="Open settings">
                  <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                    <Avatar alt={user.name || 'User'} src="/static/images/avatar/2.jpg">
                      {user.name ? user.name.charAt(0) : <AccountCircleIcon />}
                    </Avatar>
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
                  <MenuItem component={Link} to="/profile" onClick={handleCloseUserMenu}>
                    <Typography textAlign="center">Profile</Typography>
                  </MenuItem>
                  <MenuItem onClick={handleLogout}>
                    <Typography textAlign="center">Logout</Typography>
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
                <Button
                  component={Link}
                  to="/login"
                  sx={{ color: 'white', mr: 1 }}
                >
                  Login
                </Button>
                <Button
                  component={Link}
                  to="/register"
                  variant="contained"
                  sx={{ 
                    backgroundColor: 'white', 
                    color: '#1976d2',
                    '&:hover': {
                      backgroundColor: '#e0e0e0',
                    }
                  }}
                >
                  Register
                </Button>
              </Box>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar;