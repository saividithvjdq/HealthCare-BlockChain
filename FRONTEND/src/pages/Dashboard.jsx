import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Divider,
  Chip,
  LinearProgress,
  AppBar,
  Toolbar,
  IconButton,
  Drawer,
  ListItemIcon,
  Paper,
  Badge,
  Tooltip,
  Menu,
  MenuItem,
} from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { styled } from '@mui/system';
import { Line } from 'react-chartjs-2';
import { motion } from 'framer-motion';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip as ChartTooltip,
  Legend,
} from 'chart.js';
import { useNavigate } from 'react-router-dom';

// Icons
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import DescriptionIcon from '@mui/icons-material/Description';
import HealthAndSafetyIcon from '@mui/icons-material/HealthAndSafety';
import ShieldIcon from '@mui/icons-material/Shield';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ReceiptIcon from '@mui/icons-material/Receipt';
import PersonIcon from '@mui/icons-material/Person';
import NotificationsIcon from '@mui/icons-material/Notifications';
import LogoutIcon from '@mui/icons-material/Logout';
import MenuIcon from '@mui/icons-material/Menu';
import HistoryIcon from '@mui/icons-material/History';
import SearchIcon from '@mui/icons-material/Search';
import SettingsIcon from '@mui/icons-material/Settings';
import SecurityIcon from '@mui/icons-material/Security';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import FindInPageIcon from '@mui/icons-material/FindInPage';
import LockIcon from '@mui/icons-material/Lock';
import CloseIcon from '@mui/icons-material/Close';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  ChartTooltip,
  Legend
);

// Custom theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#1e88e5',
      light: '#64b5f6',
      dark: '#0d47a1',
      contrastText: '#fff',
    },
    secondary: {
      main: '#7c4dff',
      light: '#b388ff',
      dark: '#5e35b1',
      contrastText: '#fff',
    },
    success: {
      main: '#43a047',
      light: '#76d275',
      dark: '#2e7d32',
    },
    error: {
      main: '#e53935',
      light: '#ff6f60',
      dark: '#c62828',
    },
    warning: {
      main: '#ff9800',
      light: '#ffb74d',
      dark: '#f57c00',
    },
    info: {
      main: '#29b6f6',
      light: '#81d4fa',
      dark: '#0288d1',
    },
    background: {
      default: '#f8fafc',
      paper: '#ffffff',
    },
    text: {
      primary: '#2c3e50',
      secondary: '#546e7a',
    },
  },
  typography: {
    fontFamily: "'Poppins', 'Roboto', 'Helvetica', 'Arial', sans-serif",
    h4: {
      fontWeight: 700,
      fontSize: '1.75rem',
    },
    h6: {
      fontWeight: 600,
      fontSize: '1.1rem',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
          fontWeight: 500,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0 4px 14px 0 rgba(0,0,0,0.05)',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 500,
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(0, 0, 0, 0.06)',
        },
      },
    },
  },
  shape: {
    borderRadius: 10,
  },
});

// Styled components
const StyledAppBar = styled(AppBar)(({ theme }) => ({
  background: 'white',
  boxShadow: '0 4px 14px 0 rgba(0,0,0,0.05)',
  position: 'fixed',
  zIndex: theme.zIndex.drawer + 1,
}));

const StyledDrawer = styled(Drawer)(({ theme }) => ({
  width: 250,
  flexShrink: 0,
  '& .MuiDrawer-paper': {
    width: 250,
    boxSizing: 'border-box',
    paddingTop: 64, // Offset for AppBar
    backgroundColor: theme.palette.primary.dark,
    backgroundImage: `linear-gradient(to bottom, ${theme.palette.primary.dark}, ${theme.palette.secondary.dark})`,
    color: 'white',
  },
}));

const ContentContainer = styled(Box)(({ theme }) => ({
  flexGrow: 1,
  paddingTop: theme.spacing(8),
  paddingLeft: 250, // Match drawer width
  transition: theme.transitions.create(['padding'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  [theme.breakpoints.down('md')]: {
    paddingLeft: 0,
  },
}));

const StyledListItem = styled(ListItem)(({ theme, active }) => ({
  color: active ? 'white' : 'rgba(255, 255, 255, 0.7)',
  backgroundColor: active ? 'rgba(255, 255, 255, 0.15)' : 'transparent',
  borderRadius: 8,
  margin: '4px 8px',
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
  },
}));

const LogoutButton = styled(Button)(({ theme }) => ({
  marginTop: 'auto',
  margin: theme.spacing(3),
  backgroundColor: 'rgba(255, 255, 255, 0.1)',
  color: 'white',
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
}));

const StyledCard = styled(Card)(({ theme, color }) => ({
  height: '100%',
  borderLeft: `5px solid ${color || theme.palette.primary.main}`,
  transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 10px 20px 0 rgba(0,0,0,0.1)',
  },
}));

const IconBox = styled(Avatar)(({ theme, color }) => ({
  backgroundColor: color || theme.palette.primary.main,
  color: 'white',
  width: 52,
  height: 52,
  boxShadow: `0 4px 10px 0 ${color}40 || rgba(33, 150, 243, 0.4)`,
}));

const QuickActionButton = styled(Button)(({ theme, color }) => ({
  padding: theme.spacing(1.5),
  borderRadius: 12,
  textAlign: 'center',
  flexDirection: 'column',
  color: color || theme.palette.primary.main,
  backgroundColor: 'white',
  border: `1px solid ${theme.palette.grey[100]}`,
  boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
  minHeight: 90,
  '&:hover': {
    backgroundColor: theme.palette.grey[50],
    boxShadow: '0 6px 15px rgba(0,0,0,0.08)',
    borderColor: color || theme.palette.primary.light,
  },
  '& .MuiButton-startIcon': {
    marginRight: 0,
    marginBottom: theme.spacing(1),
  },
}));

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const Dashboard = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [userMenuAnchor, setUserMenuAnchor] = useState(null);
  const navigate = useNavigate();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleUserMenuOpen = (event) => {
    setUserMenuAnchor(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setUserMenuAnchor(null);
  };

  const handleLogout = () => {
    handleUserMenuClose();
    // Add logout logic here
    console.log('User logged out');
  };

  // Chart data
  const chartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Medical Records',
        data: [12, 19, 15, 25, 22, 30],
        borderColor: theme.palette.primary.main,
        backgroundColor: 'rgba(33, 150, 243, 0.1)',
        tension: 0.4,
        fill: true,
      },
      {
        label: 'Hospital Visits',
        data: [8, 15, 12, 18, 15, 22],
        borderColor: theme.palette.secondary.main,
        backgroundColor: 'rgba(124, 77, 255, 0.1)',
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        backgroundColor: 'white',
        titleColor: theme.palette.text.primary,
        bodyColor: theme.palette.text.secondary,
        borderWidth: 1,
        borderColor: theme.palette.grey[200],
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        padding: 12,
        usePointStyle: true,
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
      },
      y: {
        beginAtZero: true,
        grid: {
          color: theme.palette.grey[100],
        },
      },
    },
  };

  // Recent activity data
  const recentActivities = [
    {
      id: 1,
      title: 'Blood Test Report',
      type: 'Medical Record',
      provider: 'City Hospital',
      time: '2 hours ago',
      hash: '0x1234...5678',
      color: theme.palette.primary.main,
      icon: <DescriptionIcon />,
    },
    {
      id: 2,
      title: 'General Checkup',
      type: 'Hospital Visit',
      provider: 'Metro Healthcare',
      time: '1 day ago',
      hash: '0xabcd...efgh',
      color: theme.palette.secondary.main,
      icon: <LocalHospitalIcon />,
    },
    {
      id: 3,
      title: 'Dr. Sarah Johnson',
      type: 'Access Grant',
      provider: 'City Hospital',
      time: '2 days ago',
      hash: '0xijkl...mnop',
      color: theme.palette.warning.main,
      icon: <SecurityIcon />,
    },
  ];

  const drawer = (
    <>
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center', mb: 1 }}>
        <Avatar 
          sx={{ 
            bgcolor: 'white', 
            color: theme.palette.primary.dark,
            width: 40,
            height: 40,
            mr: 2,
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          }}
        >
          <HealthAndSafetyIcon />
        </Avatar>
        <Typography variant="h6" sx={{ color: 'white', fontWeight: 600, fontSize: '1rem' }}>
          Health Blockchain
        </Typography>
      </Box>
      <Divider sx={{ backgroundColor: 'rgba(255, 255, 255, 0.1)', mb: 2 }} />
      <List>
        <StyledListItem active={activeTab === 'dashboard' ? 1 : 0} button onClick={() => setActiveTab('dashboard')}>
          <ListItemIcon sx={{ color: 'inherit', minWidth: 40 }}>
            <DashboardIcon />
          </ListItemIcon>
          <ListItemText primary="Dashboard" />
        </StyledListItem>
        <StyledListItem active={activeTab === 'records' ? 1 : 0} button onClick={() => setActiveTab('records')}>
          <ListItemIcon sx={{ color: 'inherit', minWidth: 40 }}>
            <DescriptionIcon />
          </ListItemIcon>
          <ListItemText primary="Medical Records" />
        </StyledListItem>
        <StyledListItem active={activeTab === 'hospitals' ? 1 : 0} button onClick={() => setActiveTab('hospitals')}>
          <ListItemIcon sx={{ color: 'inherit', minWidth: 40 }}>
            <LocalHospitalIcon />
          </ListItemIcon>
          <ListItemText primary="Healthcare Facilities" />
        </StyledListItem>
        <StyledListItem active={activeTab === 'billing' ? 1 : 0} button onClick={() => setActiveTab('billing')}>
          <ListItemIcon sx={{ color: 'inherit', minWidth: 40 }}>
            <ReceiptIcon />
          </ListItemIcon>
          <ListItemText primary="Billing" />
        </StyledListItem>
        <StyledListItem active={activeTab === 'permissions' ? 1 : 0} button onClick={() => setActiveTab('permissions')}>
          <ListItemIcon sx={{ color: 'inherit', minWidth: 40 }}>
            <LockIcon />
          </ListItemIcon>
          <ListItemText primary="Access Control" />
        </StyledListItem>
        <StyledListItem active={activeTab === 'profile' ? 1 : 0} button onClick={() => setActiveTab('profile')}>
          <ListItemIcon sx={{ color: 'inherit', minWidth: 40 }}>
            <PersonIcon />
          </ListItemIcon>
          <ListItemText primary="My Profile" />
        </StyledListItem>
      </List>
      <Divider sx={{ backgroundColor: 'rgba(255, 255, 255, 0.1)', my: 2 }} />
      <List>
        <StyledListItem active={activeTab === 'settings' ? 1 : 0} button onClick={() => setActiveTab('settings')}>
          <ListItemIcon sx={{ color: 'inherit', minWidth: 40 }}>
            <SettingsIcon />
          </ListItemIcon>
          <ListItemText primary="Settings" />
        </StyledListItem>
      </List>
      <Box sx={{ flexGrow: 1 }} />
      <LogoutButton startIcon={<LogoutIcon />} fullWidth onClick={handleLogout}>
        Logout
      </LogoutButton>
    </>
  );

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: 'flex', minHeight: '100vh' }}>
        {/* App Bar */}
        <StyledAppBar>
          <Toolbar sx={{ justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <IconButton
                color="primary"
                edge="start"
                sx={{ mr: 2, display: { md: 'none' } }}
                onClick={handleDrawerToggle}
              >
                <MenuIcon />
              </IconButton>
              <Typography 
                variant="h4" 
                sx={{ 
                  color: theme.palette.primary.dark,
                  fontWeight: 800,
                  background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}
              >
                Healthcare Dashboard
                      </Typography>
                    </Box>
            
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Tooltip title="Search">
                <IconButton sx={{ mx: 1 }} color="primary">
                  <SearchIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Notifications">
                <IconButton sx={{ mx: 1 }} color="primary">
                  <Badge badgeContent={3} color="error">
                    <NotificationsIcon />
                  </Badge>
                </IconButton>
              </Tooltip>
                    <Button
                variant="outlined"
                sx={{ ml: 2, borderRadius: 20, px: 2 }}
                color="primary"
                endIcon={<KeyboardArrowDownIcon />}
                onClick={handleUserMenuOpen}
              >
                John Doe
                    </Button>
              <Menu
                anchorEl={userMenuAnchor}
                open={Boolean(userMenuAnchor)}
                onClose={handleUserMenuClose}
                PaperProps={{
                  elevation: 3,
                  sx: { borderRadius: 2, minWidth: 180, mt: 1 }
                }}
              >
                <MenuItem onClick={handleUserMenuClose}>
                  <ListItemIcon>
                    <PersonIcon fontSize="small" />
                  </ListItemIcon>
                  Profile
                </MenuItem>
                <MenuItem onClick={handleUserMenuClose}>
                  <ListItemIcon>
                    <SettingsIcon fontSize="small" />
                  </ListItemIcon>
                  Settings
                </MenuItem>
                <Divider />
                <MenuItem onClick={handleLogout}>
                  <ListItemIcon>
                    <LogoutIcon fontSize="small" />
                  </ListItemIcon>
                  Logout
                </MenuItem>
              </Menu>
                  </Box>
          </Toolbar>
        </StyledAppBar>

        {/* Sidebar */}
        <Box component="nav">
          <StyledDrawer
            variant="permanent"
            open
            sx={{ display: { xs: 'none', md: 'block' } }}
          >
            {drawer}
          </StyledDrawer>
          <StyledDrawer
            variant="temporary"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            ModalProps={{ keepMounted: true }}
            sx={{
              display: { xs: 'block', md: 'none' },
              '& .MuiDrawer-paper': {
                paddingTop: 0,
              },
            }}
          >
            <Toolbar sx={{ justifyContent: 'flex-end' }}>
              <IconButton onClick={handleDrawerToggle} sx={{ color: 'white' }}>
                <CloseIcon />
                  </IconButton>
            </Toolbar>
            {drawer}
          </StyledDrawer>
                </Box>

        {/* Main Content */}
        <ContentContainer>
          <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>
              Healthcare Blockchain Dashboard
                  </Typography>
            
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Welcome to HealthChain
                    </Typography>
                    <Typography variant="body1" paragraph>
                      Your health records on blockchain
                  </Typography>
                  <Button
                      variant="contained" 
                      color="primary"
                      onClick={() => console.log('Connect wallet')}
                    >
                      Connect Wallet
                            </Button>
              </CardContent>
            </Card>
        </Grid>
      </Grid>
    </Box>
        </ContentContainer>
      </Box>
    </ThemeProvider>
  );
};

export default Dashboard;