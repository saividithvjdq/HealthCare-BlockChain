import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  IconButton,
  Button,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  ListItemIcon,
  Divider,
  Chip,
  LinearProgress,
  Tooltip,
  Badge,
  Tab,
  Tabs,
  Paper,
  AppBar,
  Menu,
  MenuItem,
  Toolbar,
  Drawer,
  CssBaseline,
  CircularProgress,
  createTheme,
  ThemeProvider,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import {
  TrendingUp as TrendingUpIcon,
  LocalHospital as LocalHospitalIcon,
  Description as DescriptionIcon,
  Security as SecurityIcon,
  Notifications as NotificationsIcon,
  AccessTime as AccessTimeIcon,
  AccountBalanceWallet as AccountBalanceWalletIcon,
  VerifiedUser as VerifiedUserIcon,
  Warning as EmergencyIcon,
  Receipt as ReceiptIcon,
  Lock as LockIcon,
  History as HistoryIcon,
  Person as PersonIcon,
  Logout as LogoutIcon,
  Dashboard as DashboardIcon,
  Settings as SettingsIcon,
  Menu as MenuIcon,
  Close as CloseIcon,
  Search as SearchIcon,
  KeyboardArrowDown as KeyboardArrowDownIcon,
  FileUpload as FileUploadIcon,
  FindInPage as FindInPageIcon,
  Shield as ShieldIcon,
  HealthAndSafety as HealthAndSafetyIcon,
  Visibility as VisibilityIcon,
  Favorite as FavoriteIcon,
  MonetizationOn as MonetizationOnIcon,
  Healing as HealingIcon,
  CheckCircleOutlined,
  AccessTimeOutlined,
} from '@mui/icons-material';
import { Line } from 'react-chartjs-2';
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
import { motion } from 'framer-motion';
import { ethers } from 'ethers';
import { useNavigate } from 'react-router-dom';

// Import the components
import UserProfile from '../components/patient/UserProfile';
import BillingDetails from '../components/patient/BillingDetails';
import PatientRecordsUpload from '../components/patient/PatientRecordsUpload';
import NearbyFacilitiesMap from '../components/patient/NearbyFacilitiesMap';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  ChartTooltip,
  Legend
);

// Create theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#1e88e5',
      light: '#64b5f6',
      dark: '#0d47a1',
    },
    secondary: {
      main: '#7c4dff',
      light: '#b388ff',
      dark: '#5e35b1',
    },
    success: { main: '#43a047' },
    error: { main: '#e53935' },
    warning: { main: '#ff9800' },
    info: { main: '#29b6f6' },
  },
});

// Create styled components after theme definition but outside the component
const StyledAppBar = styled(AppBar)({
  background: 'white',
  boxShadow: '0 4px 14px 0 rgba(0,0,0,0.05)',
  position: 'fixed',
  zIndex: theme.zIndex.drawer + 1,
});

const StyledDrawer = styled(Drawer)({
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
});

const ContentContainer = styled(Box)({
  position: 'absolute',
  left: 250, // Exactly at the edge of the drawer
  right: 0,
  top: 64, // AppBar height
  bottom: 0,
  overflow: 'auto',
  [theme.breakpoints.down('md')]: {
    left: 0,
  },
});

const StyledListItem = styled(ListItem, {
  shouldForwardProp: (prop) => prop !== 'active',
})(({ active }) => ({
  color: active ? 'white' : 'rgba(255, 255, 255, 0.7)',
  backgroundColor: active ? 'rgba(255, 255, 255, 0.15)' : 'transparent',
  borderRadius: 8,
  margin: '4px 8px',
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
  },
}));

const LogoutButton = styled(Button)({
  marginTop: 'auto',
  margin: theme.spacing(3),
  backgroundColor: 'rgba(255, 255, 255, 0.1)',
  color: 'white',
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
});

const StyledCard = styled(Card, {
  shouldForwardProp: (prop) => prop !== 'color',
})(({ color }) => ({
  height: '100%',
  borderLeft: `5px solid ${color || theme.palette.primary.main}`,
  transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 10px 20px 0 rgba(0,0,0,0.1)',
  },
}));

const IconBox = styled(Avatar, {
  shouldForwardProp: (prop) => prop !== 'color',
})(({ color }) => ({
  backgroundColor: color || theme.palette.primary.main,
  color: 'white',
  width: 52,
  height: 52,
  boxShadow: `0 4px 10px 0 ${color ? color + '40' : 'rgba(33, 150, 243, 0.4)'}`,
}));

const QuickActionButton = styled(Button, {
  shouldForwardProp: (prop) => prop !== 'color',
})(({ color }) => ({
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

// Tab panel component
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`dashboard-tabpanel-${index}`}
      aria-labelledby={`dashboard-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box>
          {children}
        </Box>
      )}
    </div>
  );
}

const ActivityCard = ({ title, activities }) => {
  return (
    <Card elevation={0} sx={{ height: '100%', border: '1px solid rgba(0, 0, 0, 0.12)' }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          {title}
        </Typography>
        <Divider sx={{ mb: 2 }} />
        <List sx={{ p: 0 }}>
          {activities.map((activity, index) => (
            <ListItem 
              key={index} 
              disablePadding 
              divider={index !== activities.length - 1}
              sx={{ py: 1 }}
            >
              <Box sx={{ display: 'flex', width: '100%', alignItems: 'center' }}>
                <Avatar 
                  sx={{ 
                    bgcolor: activity.color || 'primary.main',
                    mr: 2,
                    width: 40,
                    height: 40
                  }}
                >
                  {activity.icon}
                </Avatar>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="body1" component="div" sx={{ fontWeight: 500 }}>
                    {activity.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" component="div">
                    {activity.description}
                  </Typography>
                </Box>
                <Typography variant="caption" color="text.secondary" component="div">
                  {activity.time}
                </Typography>
              </Box>
            </ListItem>
          ))}
        </List>
      </CardContent>
    </Card>
  );
};

const TransactionCard = ({ title, transactions }) => {
  return (
    <Card elevation={0} sx={{ height: '100%', border: '1px solid rgba(0, 0, 0, 0.12)' }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          {title}
        </Typography>
        <Divider sx={{ mb: 2 }} />
        <List sx={{ p: 0 }}>
          {transactions.map((transaction, index) => (
            <ListItem 
              key={index} 
              disablePadding 
              divider={index !== transactions.length - 1}
              sx={{ py: 1 }}
            >
              <Box sx={{ display: 'flex', width: '100%', alignItems: 'center' }}>
                <Avatar 
                  sx={{ 
                    bgcolor: transaction.status === 'completed' ? 'success.main' : 'warning.main',
                    mr: 2,
                    width: 40,
                    height: 40
                  }}
                >
                  {transaction.status === 'completed' ? <CheckCircleOutlined /> : <AccessTimeOutlined />}
                </Avatar>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="body1" component="div" sx={{ fontWeight: 500 }}>
                    {transaction.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" component="div">
                    {transaction.hospital}
                  </Typography>
                </Box>
                <Box sx={{ textAlign: 'right' }}>
                  <Typography variant="body2" component="div" sx={{ fontWeight: 500 }}>
                    {transaction.amount}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" component="div">
                    {transaction.date}
                  </Typography>
                </Box>
              </Box>
            </ListItem>
          ))}
        </List>
      </CardContent>
    </Card>
  );
};

const VisitedHospitalCard = ({ title, hospitals }) => {
  return (
    <Card elevation={0} sx={{ height: '100%', border: '1px solid rgba(0, 0, 0, 0.12)' }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          {title}
        </Typography>
        <Divider sx={{ mb: 2 }} />
        <List sx={{ p: 0 }}>
          {hospitals.map((hospital, index) => (
            <ListItem 
              key={index} 
              disablePadding 
              divider={index !== hospitals.length - 1}
              sx={{ py: 1 }}
            >
              <Box sx={{ display: 'flex', width: '100%', alignItems: 'center' }}>
                <Avatar 
                  src={hospital.image}
                  sx={{ 
                    mr: 2,
                    width: 40,
                    height: 40
                  }}
                />
                <Box sx={{ flex: 1 }}>
                  <Typography variant="body1" component="div" sx={{ fontWeight: 500 }}>
                    {hospital.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" component="div">
                    {hospital.location}
                  </Typography>
                </Box>
                <Typography variant="caption" color="text.secondary" component="div">
                  {hospital.visitedDate}
                </Typography>
              </Box>
            </ListItem>
          ))}
        </List>
      </CardContent>
    </Card>
  );
};

const EnhancedDashboard = () => {
  const navigate = useNavigate();
  const [walletAddress, setWalletAddress] = useState('');
  const [balance, setBalance] = useState('0');
  const [isConnected, setIsConnected] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [profileMenuAnchor, setProfileMenuAnchor] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuAnchor, setUserMenuAnchor] = useState(null);
  const [activeSidebarItem, setActiveSidebarItem] = useState('dashboard');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Check if MetaMask is installed
    if (window.ethereum) {
      checkConnection();
    }
  }, []);

  const checkConnection = async () => {
    try {
      if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const accounts = await provider.listAccounts();
        if (accounts.length > 0) {
          setWalletAddress(accounts[0]);
          setIsConnected(true);
          const balance = await provider.getBalance(accounts[0]);
          setBalance(ethers.utils.formatEther(balance));
        }
      }
    } catch (error) {
      console.error('Error connecting to MetaMask:', error);
    }
  };

  const connectWallet = async () => {
    if (!window.ethereum) {
      alert('Please install MetaMask to use this feature');
      return;
    }

    try {
      setIsLoading(true);
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const address = await signer.getAddress();
      const balance = await provider.getBalance(address);
      const formattedBalance = ethers.utils.formatEther(balance);
      
      setIsConnected(true);
      setWalletAddress(address);
      setBalance(formattedBalance);
      setIsLoading(false);
    } catch (error) {
      console.error('Error connecting to MetaMask:', error);
      setIsLoading(false);
      alert('Error connecting to wallet: ' + error.message);
    }
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleProfileMenuOpen = (event) => {
    setProfileMenuAnchor(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setProfileMenuAnchor(null);
  };

  const handleLogout = () => {
    handleProfileMenuClose();
    navigate('/login');
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleUserMenuOpen = (event) => {
    setUserMenuAnchor(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setUserMenuAnchor(null);
  };

  const handleSidebarItemClick = (item) => {
    setActiveSidebarItem(item);
    // Map sidebar items to tabs
    switch (item) {
      case 'dashboard':
        setActiveTab(0);
        break;
      case 'billing':
        setActiveTab(1);
        break;
      case 'records':
        setActiveTab(2);
        break;
      case 'profile':
        setActiveTab(3);
        break;
      case 'facilities':
        setActiveTab(4);
        break;
      default:
        setActiveTab(0);
    }
  };

  // Mock data for the chart
  const chartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Medical Records',
        data: [12, 19, 15, 25, 22, 30],
        borderColor: theme.palette.primary.main,
        backgroundColor: theme.palette.primary.light,
        tension: 0.4,
      },
      {
        label: 'Hospital Visits',
        data: [8, 15, 12, 18, 15, 22],
        borderColor: theme.palette.secondary.main,
        backgroundColor: theme.palette.secondary.light,
        tension: 0.4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  // Mock data for recent activities
  const recentActivities = [
    {
      id: 1,
      type: 'Medical Record',
      title: 'Blood Test Report',
      hospital: 'City Hospital',
      time: '2 hours ago',
      icon: <DescriptionIcon />,
      color: theme.palette.primary.main,
      hash: '0x1234...5678',
    },
    {
      id: 2,
      type: 'Hospital Visit',
      title: 'General Checkup',
      hospital: 'Metro Healthcare',
      time: '1 day ago',
      icon: <LocalHospitalIcon />,
      color: theme.palette.secondary.main,
      hash: '0xabcd...efgh',
    },
    {
      id: 3,
      type: 'Access Grant',
      title: 'Dr. Sarah Johnson',
      hospital: 'City Hospital',
      time: '2 days ago',
      icon: <SecurityIcon />,
      color: theme.palette.warning.main,
      hash: '0xijkl...mnop',
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
        <StyledListItem 
          active={activeSidebarItem === 'dashboard' ? 1 : 0} 
          button 
          onClick={() => handleSidebarItemClick('dashboard')}
        >
          <ListItemIcon sx={{ color: 'inherit', minWidth: 40 }}>
            <DashboardIcon />
          </ListItemIcon>
          <ListItemText primary="Dashboard" />
        </StyledListItem>
        <StyledListItem 
          active={activeSidebarItem === 'records' ? 1 : 0} 
          button 
          onClick={() => handleSidebarItemClick('records')}
        >
          <ListItemIcon sx={{ color: 'inherit', minWidth: 40 }}>
            <DescriptionIcon />
          </ListItemIcon>
          <ListItemText primary="Medical Records" />
        </StyledListItem>
        <StyledListItem 
          active={activeSidebarItem === 'facilities' ? 1 : 0} 
          button 
          onClick={() => handleSidebarItemClick('facilities')}
        >
          <ListItemIcon sx={{ color: 'inherit', minWidth: 40 }}>
            <LocalHospitalIcon />
          </ListItemIcon>
          <ListItemText primary="Healthcare Facilities" />
        </StyledListItem>
        <StyledListItem 
          active={activeSidebarItem === 'billing' ? 1 : 0} 
          button 
          onClick={() => handleSidebarItemClick('billing')}
        >
          <ListItemIcon sx={{ color: 'inherit', minWidth: 40 }}>
            <ReceiptIcon />
          </ListItemIcon>
          <ListItemText primary="Billing" />
        </StyledListItem>
        <StyledListItem 
          active={activeSidebarItem === 'permissions' ? 1 : 0} 
          button 
          onClick={() => handleSidebarItemClick('permissions')}
        >
          <ListItemIcon sx={{ color: 'inherit', minWidth: 40 }}>
            <LockIcon />
          </ListItemIcon>
          <ListItemText primary="Access Control" />
        </StyledListItem>
        <StyledListItem 
          active={activeSidebarItem === 'profile' ? 1 : 0} 
          button 
          onClick={() => handleSidebarItemClick('profile')}
        >
          <ListItemIcon sx={{ color: 'inherit', minWidth: 40 }}>
            <PersonIcon />
          </ListItemIcon>
          <ListItemText primary="My Profile" />
        </StyledListItem>
      </List>
      <Divider sx={{ backgroundColor: 'rgba(255, 255, 255, 0.1)', my: 2 }} />
      <List>
        <StyledListItem 
          active={activeSidebarItem === 'settings' ? 1 : 0} 
          button 
          onClick={() => handleSidebarItemClick('settings')}
        >
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
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <AppBar
          position="fixed"
          sx={{
            backgroundColor: 'background.paper',
            color: 'text.primary',
            boxShadow: 1,
            zIndex: theme.zIndex.drawer + 1,
          }}
        >
          <Toolbar>
            <IconButton
              color="inherit"
              edge="start"
              onClick={() => setMobileOpen(!mobileOpen)}
              sx={{ mr: 2, display: { sm: 'none' } }}
            >
              <MenuIcon />
            </IconButton>
            <Box component="div" sx={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>
              <LocalHospitalIcon sx={{ mr: 1, color: 'primary.main' }} />
              <Typography variant="h6" component="div" noWrap>
                HealthChain
              </Typography>
            </Box>

            {isConnected ? (
              <Box component="div" sx={{ display: 'flex', alignItems: 'center' }}>
                <Box component="div" sx={{ mr: 2, display: { xs: 'none', sm: 'block' } }}>
                  <Typography variant="body2" component="div" sx={{ textAlign: 'right' }}>
                    {walletAddress.substring(0, 6)}...{walletAddress.substring(walletAddress.length - 4)}
                  </Typography>
                  <Typography variant="caption" component="div" sx={{ textAlign: 'right' }}>
                    {balance.substring(0, 6)} ETH
                  </Typography>
                </Box>
                <IconButton
                  size="large"
                  color="inherit"
                  aria-label="show new notifications"
                  sx={{ mr: 1 }}
                >
                  <Badge badgeContent={4} color="error">
                    <NotificationsIcon />
                  </Badge>
                </IconButton>
                <Avatar
                  onClick={(e) => setUserMenuAnchor(e.currentTarget)}
                  sx={{ 
                    cursor: 'pointer',
                    bgcolor: 'primary.main',
                    '&:hover': { bgcolor: 'primary.dark' }
                  }}
                >
                  P
                </Avatar>
                <Menu
                  anchorEl={userMenuAnchor}
                  open={Boolean(userMenuAnchor)}
                  onClose={() => setUserMenuAnchor(null)}
                  transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                  anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                >
                  <MenuItem onClick={() => navigate('/profile')}>
                    <ListItemIcon>
                      <PersonIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Profile</ListItemText>
                  </MenuItem>
                  <MenuItem onClick={() => navigate('/settings')}>
                    <ListItemIcon>
                      <SettingsIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Settings</ListItemText>
                  </MenuItem>
                  <Divider />
                  <MenuItem>
                    <ListItemIcon>
                      <LogoutIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Logout</ListItemText>
                  </MenuItem>
                </Menu>
              </Box>
            ) : (
              <Button 
                variant="contained" 
                startIcon={<AccountBalanceWalletIcon />}
                onClick={connectWallet}
              >
                Connect Wallet
              </Button>
            )}
          </Toolbar>
        </AppBar>
        
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

        <ContentContainer>
          <Box sx={{ px: 2, py: 2 }}>
            <Grid item xs={12}>
              <motion.div
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                transition={{ duration: 0.3 }}
              >
                <Paper 
                  elevation={0} 
                  sx={{ 
                    p: 2.5, 
                    mb: 3, 
                    borderRadius: 3, 
                    background: 'linear-gradient(to right, rgba(33, 150, 243, 0.05), rgba(124, 77, 255, 0.05))', 
                    boxShadow: '0 4px 14px 0 rgba(0,0,0,0.05)'
                  }}
                >
                  <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, color: theme.palette.text.primary }}>
                      Quick Actions
                    </Typography>
                    <Chip 
                      label="Blockchain Secured" 
                      size="small" 
                      icon={<VerifiedUserIcon />} 
                      color="primary" 
                      variant="outlined" 
                      sx={{ height: 30, fontWeight: 500, px: 1 }}
                    />
                  </Box>
                  <Grid container spacing={3}>
                    <Grid item xs={6} sm={3}>
                      <QuickActionButton 
                        fullWidth 
                        startIcon={<FileUploadIcon sx={{ fontSize: 32 }} />}
                        color={theme.palette.primary.main}
                      >
                        Upload Medical Record
                      </QuickActionButton>
                    </Grid>
                    <Grid item xs={6} sm={3}>
                      <QuickActionButton 
                        fullWidth 
                        startIcon={<ReceiptIcon sx={{ fontSize: 32 }} />}
                        color={theme.palette.secondary.main}
                      >
                        View Bills
                      </QuickActionButton>
                    </Grid>
                    <Grid item xs={6} sm={3}>
                      <QuickActionButton 
                        fullWidth 
                        startIcon={<FindInPageIcon sx={{ fontSize: 32 }} />}
                        color={theme.palette.info.main}
                      >
                        Find Hospital
                      </QuickActionButton>
                    </Grid>
                    <Grid item xs={6} sm={3}>
                      <QuickActionButton 
                        fullWidth 
                        startIcon={<SecurityIcon sx={{ fontSize: 32 }} />}
                        color={theme.palette.warning.main}
                      >
                        Manage Access
                      </QuickActionButton>
                    </Grid>
                  </Grid>
                </Paper>
              </motion.div>
            </Grid>

            <Box sx={{ mt: 2 }}>
              <TabPanel value={activeTab} index={0}>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6} md={3}>
                    <motion.div
                      variants={cardVariants}
                      initial="hidden"
                      animate="visible"
                      transition={{ duration: 0.3, delay: 0.1 }}
                    >
                      <StyledCard color={theme.palette.primary.main}>
                        <CardContent>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                            <IconBox color={theme.palette.primary.main}>
                              <DescriptionIcon />
                            </IconBox>
                            <Box sx={{ ml: 2 }}>
                              <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
                                32
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                Medical Records
                              </Typography>
                            </Box>
                          </Box>
                          <LinearProgress 
                            variant="determinate" 
                            value={80} 
                            sx={{ 
                              height: 8,
                              borderRadius: 2,
                              backgroundColor: theme.palette.grey[100],
                              '& .MuiLinearProgress-bar': {
                                borderRadius: 2,
                                backgroundColor: theme.palette.primary.main,
                              }
                            }} 
                          />
                        </CardContent>
                      </StyledCard>
                    </motion.div>
                  </Grid>

                  <Grid item xs={12} sm={6} md={3}>
                    <motion.div
                      variants={cardVariants}
                      initial="hidden"
                      animate="visible"
                      transition={{ duration: 0.3, delay: 0.2 }}
                    >
                      <StyledCard color={theme.palette.secondary.main}>
                        <CardContent>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                            <IconBox color={theme.palette.secondary.main}>
                              <LocalHospitalIcon />
                            </IconBox>
                            <Box sx={{ ml: 2 }}>
                              <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
                                12
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                Hospital Visits
                              </Typography>
                            </Box>
                          </Box>
                          <LinearProgress 
                            variant="determinate" 
                            value={60} 
                            sx={{ 
                              height: 8,
                              borderRadius: 2,
                              backgroundColor: theme.palette.grey[100],
                              '& .MuiLinearProgress-bar': {
                                borderRadius: 2,
                                backgroundColor: theme.palette.secondary.main,
                              }
                            }} 
                          />
                        </CardContent>
                      </StyledCard>
                    </motion.div>
                  </Grid>

                  <Grid item xs={12} sm={6} md={3}>
                    <motion.div
                      variants={cardVariants}
                      initial="hidden"
                      animate="visible"
                      transition={{ duration: 0.3, delay: 0.3 }}
                    >
                      <StyledCard color={theme.palette.warning.main}>
                        <CardContent>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                            <IconBox color={theme.palette.warning.main}>
                              <SecurityIcon />
                            </IconBox>
                            <Box sx={{ ml: 2 }}>
                              <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
                                8
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                Access Grants
                              </Typography>
                            </Box>
                          </Box>
                          <LinearProgress 
                            variant="determinate" 
                            value={40} 
                            sx={{ 
                              height: 8,
                              borderRadius: 2,
                              backgroundColor: theme.palette.grey[100],
                              '& .MuiLinearProgress-bar': {
                                borderRadius: 2,
                                backgroundColor: theme.palette.warning.main,
                              }
                            }} 
                          />
                        </CardContent>
                      </StyledCard>
                    </motion.div>
                  </Grid>

                  <Grid item xs={12} sm={6} md={3}>
                    <motion.div
                      variants={cardVariants}
                      initial="hidden"
                      animate="visible"
                      transition={{ duration: 0.3, delay: 0.4 }}
                    >
                      <StyledCard color={theme.palette.error.main}>
                        <CardContent>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                            <IconBox color={theme.palette.error.main}>
                              <ShieldIcon />
                            </IconBox>
                            <Box sx={{ ml: 2 }}>
                              <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
                                1
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                Active Alerts
                              </Typography>
                            </Box>
                          </Box>
                          <LinearProgress 
                            variant="determinate" 
                            value={20} 
                            sx={{ 
                              height: 8,
                              borderRadius: 2,
                              backgroundColor: theme.palette.grey[100],
                              '& .MuiLinearProgress-bar': {
                                borderRadius: 2,
                                backgroundColor: theme.palette.error.main,
                              }
                            }} 
                          />
                        </CardContent>
                      </StyledCard>
                    </motion.div>
                  </Grid>

                  <Grid item xs={12} md={8}>
                    <motion.div
                      variants={cardVariants}
                      initial="hidden"
                      animate="visible"
                      transition={{ duration: 0.3, delay: 0.5 }}
                    >
                      <Card sx={{ height: '100%' }}>
                        <CardContent>
                          <Typography variant="h6" gutterBottom sx={{ color: theme.palette.text.primary }}>
                            Health Activity
                          </Typography>
                          <Box sx={{ height: 300, mt: 2 }}>
                            <Line data={chartData} options={chartOptions} />
                          </Box>
                        </CardContent>
                      </Card>
                    </motion.div>
                  </Grid>

                  <Grid item xs={12} md={4}>
                    <motion.div
                      variants={cardVariants}
                      initial="hidden"
                      animate="visible"
                      transition={{ duration: 0.3, delay: 0.6 }}
                    >
                      <ActivityCard title="Recent Activities" activities={recentActivities} />
                    </motion.div>
                  </Grid>
                </Grid>
              </TabPanel>

              <TabPanel value={activeTab} index={1}>
                <BillingDetails />
              </TabPanel>

              <TabPanel value={activeTab} index={2}>
                <PatientRecordsUpload />
              </TabPanel>

              <TabPanel value={activeTab} index={3}>
                <UserProfile />
              </TabPanel>

              <TabPanel value={activeTab} index={4}>
                <NearbyFacilitiesMap />
              </TabPanel>
            </Box>
          </Box>
        </ContentContainer>
      </Box>
    </ThemeProvider>
  );
};

export default EnhancedDashboard; 