import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Container, 
  Typography, 
  TextField, 
  Button, 
  Box, 
  Paper, 
  Grid,
  Alert,
  IconButton,
  InputAdornment,
  CircularProgress
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const Register = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    aadhaar: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Basic validation
    if (!formData.name || !formData.email || !formData.aadhaar || !formData.password) {
      setError('All fields are required');
      return;
    }
    
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    if (formData.aadhaar.length !== 12 || !/^\d+$/.test(formData.aadhaar)) {
      setError('Aadhaar number must be 12 digits');
      return;
    }
    
    try {
      setLoading(true);
      // Connect to your backend API
      const response = await axios.post('http://localhost:5000/api/users/register', {
        name: formData.name,
        email: formData.email,
        aadhaar: formData.aadhaar,
        password: formData.password
      });
      
      // Handle successful registration
      if (response.data.status === 'success') {
        // Store token if provided
        if (response.data.data.token) {
          localStorage.setItem('token', response.data.data.token);
        }
        
        // Use the login function from AuthContext
        login(formData.aadhaar);
        
        // Redirect to dashboard
        navigate('/dashboard');
      } else {
        setError(response.data.message || 'Registration failed');
      }
    } catch (err) {
      console.error('Registration error:', err);
      setError(err.response?.data?.message || 'An error occurred during registration');
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center" color="primary">
          Register
        </Typography>
        
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        
        <Box component="form" onSubmit={handleSubmit} noValidate>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                name="name"
                label="Full Name"
                fullWidth
                value={formData.name}
                onChange={handleChange}
                required
                autoFocus
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                name="email"
                label="Email Address"
                type="email"
                fullWidth
                value={formData.email}
                onChange={handleChange}
                required
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                name="aadhaar"
                label="Aadhaar Number"
                fullWidth
                value={formData.aadhaar}
                onChange={handleChange}
                required
                inputProps={{ maxLength: 12 }}
                helperText="12-digit Aadhaar number"
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                name="password"
                label="Password"
                type={showPassword ? 'text' : 'password'}
                fullWidth
                value={formData.password}
                onChange={handleChange}
                required
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={togglePasswordVisibility}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                name="confirmPassword"
                label="Confirm Password"
                type={showConfirmPassword ? 'text' : 'password'}
                fullWidth
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={toggleConfirmPasswordVisibility}
                        edge="end"
                      >
                        {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              />
            </Grid>
          </Grid>
          
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            size="large"
            sx={{ mt: 3, mb: 2 }}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Register'}
          </Button>
          
          <Grid container justifyContent="flex-end">
            <Grid item>
              <Link to="/login" style={{ textDecoration: 'none' }}>
                <Typography variant="body2" color="primary">
                  Already have an account? Sign in
                </Typography>
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Container>
  );
};

export default Register;