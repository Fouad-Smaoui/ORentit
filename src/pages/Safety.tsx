import React from 'react';
import { Container, Typography, Box, Paper, Grid } from '@mui/material';
import { Security, VerifiedUser, Report, Support } from '@mui/icons-material';

const Safety: React.FC = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Box textAlign="center" mb={6}>
        <Typography variant="h2" component="h1" gutterBottom>
          Safety Guidelines
        </Typography>
        <Typography variant="h5" color="text.secondary" paragraph>
          Your safety is our top priority
        </Typography>
      </Box>

      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 4, height: '100%' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Security sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
              <Typography variant="h4">
                For Renters
              </Typography>
            </Box>
            <Typography variant="h6" gutterBottom>
              Before Renting
            </Typography>
            <Typography component="ul" sx={{ pl: 4 }}>
              <li>Verify the equipment's condition through photos and descriptions</li>
              <li>Read reviews of the equipment owner</li>
              <li>Check the equipment's maintenance history</li>
              <li>Review the rental terms and conditions</li>
            </Typography>

            <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
              During Rental
            </Typography>
            <Typography component="ul" sx={{ pl: 4 }}>
              <li>Inspect the equipment upon receipt</li>
              <li>Document any existing damage</li>
              <li>Use the equipment as intended</li>
              <li>Follow safety guidelines</li>
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 4, height: '100%' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <VerifiedUser sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
              <Typography variant="h4">
                For Owners
              </Typography>
            </Box>
            <Typography variant="h6" gutterBottom>
              Before Listing
            </Typography>
            <Typography component="ul" sx={{ pl: 4 }}>
              <li>Ensure equipment is in good working condition</li>
              <li>Provide clear, accurate descriptions</li>
              <li>Take detailed photos</li>
              <li>Set clear rental terms</li>
            </Typography>

            <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
              During Rental
            </Typography>
            <Typography component="ul" sx={{ pl: 4 }}>
              <li>Document equipment condition before handover</li>
              <li>Provide usage instructions</li>
              <li>Maintain communication with renter</li>
              <li>Keep records of all transactions</li>
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper elevation={3} sx={{ p: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Report sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
              <Typography variant="h4">
                Reporting Issues
              </Typography>
            </Box>
            <Typography paragraph>
              If you encounter any safety concerns or issues:
            </Typography>
            <Typography component="ul" sx={{ pl: 4 }}>
              <li>Report immediately through our platform</li>
              <li>Document the issue with photos if possible</li>
              <li>Contact our support team</li>
              <li>Follow emergency procedures if necessary</li>
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper elevation={3} sx={{ p: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Support sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
              <Typography variant="h4">
                Our Safety Measures
              </Typography>
            </Box>
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <Typography variant="h6" gutterBottom>
                  Verification
                </Typography>
                <Typography>
                  We verify user identities and maintain secure payment processing to protect all parties.
                </Typography>
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography variant="h6" gutterBottom>
                  Insurance
                </Typography>
                <Typography>
                  We offer insurance options to protect against damage, theft, and liability.
                </Typography>
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography variant="h6" gutterBottom>
                  Support
                </Typography>
                <Typography>
                  Our support team is available 24/7 to assist with any safety concerns or issues.
                </Typography>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Safety; 