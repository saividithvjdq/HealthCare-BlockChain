import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  InputAdornment,
  IconButton,
  Alert,
  useTheme,
  CircularProgress,
  Divider,
  Link,
  Paper,
} from '@mui/material';
import {
  Person as PersonIcon,
  Fingerprint as FingerprintIcon,
  Send as SendIcon,
  Lock as LockIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  AccountBalanceWallet as WalletIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { ethers } from 'ethers';

const Login = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');

  const validationSchema = Yup.object({
    aadhaarNumber: Yup.string()
      .required('Aadhaar number is required')
      .matches(/^\d{12}$/, 'Must be exactly 12 digits'),
    otp: Yup.string()
      .when('$step', {
        is: 2,
        then: Yup.string()
          .required('OTP is required')
          .matches(/^\d{6}$/, 'Must be exactly 6 digits'),
      }),
  });

  const formik = useFormik({
    initialValues: {
      aadhaarNumber: '',
      otp: '',
    },
    validationSchema,
    validateOnChange: true,
    onSubmit: async (values) => {
      try {
        setError('');
        setLoading(true);
        if (step === 1) {
          // Call API to send OTP
          // For demo, we'll just move to step 2
          await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
          setStep(2);
        } else {
          // Call API to verify OTP
          // For demo, we'll just redirect to dashboard
          await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
          navigate('/dashboard');
        }
      } catch (err) {
        setError(err.message || 'An error occurred');
      } finally {
        setLoading(false);
      }
    },
  });

  const connectWallet = async () => {
    try {
      if (!window.ethereum) {
        throw new Error('MetaMask is not installed');
      }
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner();
      const address = await signer.getAddress();
      setWalletAddress(address);
      setWalletConnected(true);
    } catch (error) {
      setError(error.message);
    }
  };

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #2196f3 0%, #1976d2 100%)',
        p: 3,
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card
          sx={{
            maxWidth: 450,
            width: '100%',
            borderRadius: 4,
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          }}
        >
          <CardContent sx={{ p: 4 }}>
            <Box sx={{ textAlign: 'center', mb: 4 }}>
              <Typography variant="h4" component="h1" gutterBottom>
                Welcome to HealthChain
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Secure blockchain-powered healthcare platform
              </Typography>
            </Box>

            {error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
            )}

            <form onSubmit={formik.handleSubmit}>
              {step === 1 ? (
                <>
                  <TextField
                    fullWidth
                    id="aadhaarNumber"
                    name="aadhaarNumber"
                    label="Aadhaar Number"
                    value={formik.values.aadhaarNumber}
                    onChange={formik.handleChange}
                    error={formik.touched.aadhaarNumber && Boolean(formik.errors.aadhaarNumber)}
                    helperText={formik.touched.aadhaarNumber && formik.errors.aadhaarNumber}
                    margin="normal"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <FingerprintIcon color="primary" />
                        </InputAdornment>
                      ),
                    }}
                  />
                </>
              ) : (
                <>
                  <TextField
                    fullWidth
                    id="otp"
                    name="otp"
                    label="OTP"
                    type={showPassword ? 'text' : 'password'}
                    value={formik.values.otp}
                    onChange={formik.handleChange}
                    error={formik.touched.otp && Boolean(formik.errors.otp)}
                    helperText={formik.touched.otp && formik.errors.otp}
                    margin="normal"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LockIcon color="primary" />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={handleTogglePassword}
                            edge="end"
                          >
                            {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </>
              )}

              <Box sx={{ mt: 3 }}>
                <Button
                  fullWidth
                  variant="contained"
                  type="submit"
                  disabled={loading}
                  startIcon={loading ? <CircularProgress size={20} /> : <SendIcon />}
                  sx={{
                    py: 1.5,
                    borderRadius: 2,
                    textTransform: 'none',
                    fontSize: '1rem',
                  }}
                >
                  {loading ? 'Processing...' : step === 1 ? 'Send OTP' : 'Verify OTP'}
                </Button>
              </Box>
            </form>

            <Divider sx={{ my: 3 }}>
              <Typography variant="body2" color="text.secondary">
                OR
              </Typography>
            </Divider>

            <Button
              fullWidth
              variant="outlined"
              onClick={connectWallet}
              disabled={walletConnected}
              startIcon={<WalletIcon />}
              sx={{
                py: 1.5,
                borderRadius: 2,
                textTransform: 'none',
                fontSize: '1rem',
              }}
            >
              {walletConnected
                ? `Connected: ${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`
                : 'Connect with MetaMask'}
            </Button>

            <Box sx={{ mt: 3, textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                Don't have an account?{' '}
                <Link href="#" underline="hover">
                  Register here
                </Link>
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </motion.div>
    </Box>
  );
};

export default Login;