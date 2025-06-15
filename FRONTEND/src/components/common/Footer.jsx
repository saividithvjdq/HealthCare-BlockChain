import { Box, Container, Typography, Link, Button, Dialog, DialogTitle, DialogContent } from '@mui/material';
import { styled } from '@mui/material/styles';

const FooterWrapper = styled(Box)(({ theme }) => ({
  backgroundColor: '#1a237e', // Deep purple color matching your theme
  color: '#ffffff',
  padding: theme.spacing(3, 0),
  marginTop: 'auto',
  width: '100%',
  bottom: 0,
}));

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <FooterWrapper>
      <Container maxWidth="lg">
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
          }}
        >
          <Box sx={{ mb: { xs: 2, md: 0 } }}>
            <Typography variant="h6" gutterBottom>
              Contact Us
            </Typography>
            <Typography variant="body2">
              Email: support@healthcare-blockchain.com
            </Typography>
            <Typography variant="body2">
              Phone: +91 123-456-7890
            </Typography>
          </Box>
          
          <Box sx={{ textAlign: 'right' }}>
            <Typography variant="body2">
              © {currentYear} Healthcare Blockchain. All rights reserved.
            </Typography>
          </Box>
        </Box>
      </Container>
    </FooterWrapper>
  );
};

export default Footer;