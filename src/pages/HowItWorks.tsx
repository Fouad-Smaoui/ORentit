import React from 'react';
import { Container, Typography, Box, Grid, Paper, Step, Stepper, StepLabel } from '@mui/material';

const HowItWorks: React.FC = () => {
  const steps = [
    {
      title: 'Create an Account',
      description: 'Sign up for free and complete your profile to start renting or listing equipment.'
    },
    {
      title: 'Browse Equipment',
      description: 'Search through our extensive catalog of equipment or list your own items for rent.'
    },
    {
      title: 'Book & Pay',
      description: 'Select your desired dates, review the terms, and complete the secure payment process.'
    },
    {
      title: 'Enjoy & Return',
      description: 'Use the equipment and return it in the same condition to complete your rental.'
    }
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Box textAlign="center" mb={6}>
        <Typography variant="h2" component="h1" gutterBottom>
          How It Works
        </Typography>
        <Typography variant="h5" color="text.secondary" paragraph>
          Simple steps to start renting equipment
        </Typography>
      </Box>

      <Stepper alternativeLabel sx={{ mb: 8 }}>
        {steps.map((step, index) => (
          <Step key={index}>
            <StepLabel>{step.title}</StepLabel>
          </Step>
        ))}
      </Stepper>

      <Grid container spacing={4}>
        {steps.map((step, index) => (
          <Grid item xs={12} md={6} key={index}>
            <Paper elevation={3} sx={{ p: 4, height: '100%' }}>
              <Typography variant="h4" gutterBottom>
                {step.title}
              </Typography>
              <Typography paragraph>
                {step.description}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>

      <Box mt={8}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h4" gutterBottom>
            Tips for a Great Experience
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Typography variant="h6" gutterBottom>
                Read Reviews
              </Typography>
              <Typography>
                Check ratings and reviews from other users to ensure quality and reliability.
              </Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="h6" gutterBottom>
                Check Availability
              </Typography>
              <Typography>
                Book early to secure your preferred dates and equipment.
              </Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="h6" gutterBottom>
                Insurance Options
              </Typography>
              <Typography>
                Consider our insurance options for added peace of mind during your rental.
              </Typography>
            </Grid>
          </Grid>
        </Paper>
      </Box>
    </Container>
  );
};

export default HowItWorks; 