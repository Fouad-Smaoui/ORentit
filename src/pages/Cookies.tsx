import React from 'react';
import { Container, Typography, Box, Paper } from '@mui/material';

const Cookies: React.FC = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Box textAlign="center" mb={6}>
        <Typography variant="h2" component="h1" gutterBottom>
          Cookies Policy
        </Typography>
        <Typography variant="h5" color="text.secondary" paragraph>
          Last updated: {new Date().toLocaleDateString()}
        </Typography>
      </Box>

      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>
          1. What Are Cookies
        </Typography>
        <Typography paragraph>
          Cookies are small text files that are placed on your computer or mobile device when you visit our website. They help us make your experience better by remembering your preferences and providing essential functionality.
        </Typography>

        <Typography variant="h4" gutterBottom sx={{ mt: 4 }}>
          2. Types of Cookies We Use
        </Typography>
        <Typography paragraph>
          We use different types of cookies for various purposes:
        </Typography>
        <Typography component="ul" sx={{ pl: 4 }}>
          <li>
            <strong>Essential Cookies:</strong> Required for basic website functionality and security
          </li>
          <li>
            <strong>Functional Cookies:</strong> Remember your preferences and settings
          </li>
          <li>
            <strong>Analytics Cookies:</strong> Help us understand how visitors use our website
          </li>
          <li>
            <strong>Marketing Cookies:</strong> Used to deliver relevant advertisements
          </li>
        </Typography>

        <Typography variant="h4" gutterBottom sx={{ mt: 4 }}>
          3. How We Use Cookies
        </Typography>
        <Typography paragraph>
          We use cookies to:
        </Typography>
        <Typography component="ul" sx={{ pl: 4 }}>
          <li>Keep you signed in</li>
          <li>Remember your preferences</li>
          <li>Understand how you use our website</li>
          <li>Improve our services</li>
          <li>Provide personalized content</li>
          <li>Ensure security and prevent fraud</li>
        </Typography>

        <Typography variant="h4" gutterBottom sx={{ mt: 4 }}>
          4. Third-Party Cookies
        </Typography>
        <Typography paragraph>
          Some cookies are placed by third-party services that appear on our pages. These include:
        </Typography>
        <Typography component="ul" sx={{ pl: 4 }}>
          <li>Analytics providers (e.g., Google Analytics)</li>
          <li>Payment processors</li>
          <li>Social media platforms</li>
          <li>Advertising networks</li>
        </Typography>

        <Typography variant="h4" gutterBottom sx={{ mt: 4 }}>
          5. Managing Cookies
        </Typography>
        <Typography paragraph>
          You can control and manage cookies in various ways:
        </Typography>
        <Typography component="ul" sx={{ pl: 4 }}>
          <li>Browser settings: Most browsers allow you to view and delete cookies</li>
          <li>Cookie consent: We provide options to accept or decline non-essential cookies</li>
          <li>Third-party opt-outs: Many third-party services provide opt-out mechanisms</li>
        </Typography>

        <Typography variant="h4" gutterBottom sx={{ mt: 4 }}>
          6. Cookie Duration
        </Typography>
        <Typography paragraph>
          Cookies can remain on your device for different periods:
        </Typography>
        <Typography component="ul" sx={{ pl: 4 }}>
          <li>Session cookies: Deleted when you close your browser</li>
          <li>Persistent cookies: Remain until they expire or are deleted</li>
        </Typography>

        <Typography variant="h4" gutterBottom sx={{ mt: 4 }}>
          7. Updates to This Policy
        </Typography>
        <Typography paragraph>
          We may update this cookies policy from time to time. Any changes will be posted on this page with an updated revision date.
        </Typography>

        <Typography variant="h4" gutterBottom sx={{ mt: 4 }}>
          8. Contact Us
        </Typography>
        <Typography paragraph>
          If you have questions about our use of cookies, please contact us at privacy@orentit.com
        </Typography>
      </Paper>
    </Container>
  );
};

export default Cookies; 