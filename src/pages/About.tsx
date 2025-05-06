import React from 'react';
import { Container, Typography, Box, Grid, Paper } from '@mui/material';

const About: React.FC = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Box textAlign="center" mb={6}>
        <Typography variant="h2" component="h1" gutterBottom>
          About ORentit
        </Typography>
        <Typography variant="h5" color="text.secondary" paragraph>
          Your Trusted Platform for Equipment Rental
        </Typography>
      </Box>

      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 4, height: '100%' }}>
            <Typography variant="h4" gutterBottom>
              Our Mission
            </Typography>
            <Typography paragraph>
              At ORentit, we're revolutionizing the way people access equipment. Our mission is to create a sustainable, 
              community-driven platform that makes equipment rental accessible, affordable, and convenient for everyone.
            </Typography>
            <Typography paragraph>
              We believe in the power of sharing economy and sustainable consumption. By enabling people to rent rather 
              than buy, we're helping reduce waste and promote more efficient use of resources.
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 4, height: '100%' }}>
            <Typography variant="h4" gutterBottom>
              Our Vision
            </Typography>
            <Typography paragraph>
              We envision a world where access to equipment is as simple as a few clicks, where communities can share 
              resources efficiently, and where sustainability is at the core of consumption.
            </Typography>
            <Typography paragraph>
              Through our platform, we're building a community of responsible renters and owners who understand the 
              value of shared resources and sustainable practices.
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper elevation={3} sx={{ p: 4 }}>
            <Typography variant="h4" gutterBottom>
              Why Choose ORentit?
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <Typography variant="h6" gutterBottom>
                  Trust & Safety
                </Typography>
                <Typography>
                  Our platform implements robust verification systems and secure payment processing to ensure 
                  safe transactions for all users.
                </Typography>
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography variant="h6" gutterBottom>
                  Quality Assurance
                </Typography>
                <Typography>
                  We maintain high standards for listed equipment and provide comprehensive insurance options 
                  for peace of mind.
                </Typography>
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography variant="h6" gutterBottom>
                  Community Focus
                </Typography>
                <Typography>
                  We foster a community of responsible users who value quality service and sustainable practices.
                </Typography>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default About; 