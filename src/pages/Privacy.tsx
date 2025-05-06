import React from 'react';
import { Container, Typography, Box, Paper } from '@mui/material';

const Privacy: React.FC = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Box textAlign="center" mb={6}>
        <Typography variant="h2" component="h1" gutterBottom>
          Privacy Policy
        </Typography>
        <Typography variant="h5" color="text.secondary" paragraph>
          Last updated: {new Date().toLocaleDateString()}
        </Typography>
      </Box>

      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>
          1. Information We Collect
        </Typography>
        <Typography paragraph>
          We collect information that you provide directly to us, including:
        </Typography>
        <Typography component="ul" sx={{ pl: 4 }}>
          <li>Account information (name, email, phone number)</li>
          <li>Payment information</li>
          <li>Equipment listings and rental history</li>
          <li>Communications with other users</li>
          <li>Profile information and preferences</li>
        </Typography>

        <Typography variant="h4" gutterBottom sx={{ mt: 4 }}>
          2. How We Use Your Information
        </Typography>
        <Typography paragraph>
          We use the collected information to:
        </Typography>
        <Typography component="ul" sx={{ pl: 4 }}>
          <li>Provide and maintain our services</li>
          <li>Process transactions and manage your account</li>
          <li>Communicate with you about our services</li>
          <li>Improve and personalize your experience</li>
          <li>Ensure platform security and prevent fraud</li>
        </Typography>

        <Typography variant="h4" gutterBottom sx={{ mt: 4 }}>
          3. Information Sharing
        </Typography>
        <Typography paragraph>
          We may share your information with:
        </Typography>
        <Typography component="ul" sx={{ pl: 4 }}>
          <li>Other users (as necessary for the rental process)</li>
          <li>Service providers and business partners</li>
          <li>Legal authorities when required by law</li>
        </Typography>

        <Typography variant="h4" gutterBottom sx={{ mt: 4 }}>
          4. Data Security
        </Typography>
        <Typography paragraph>
          We implement appropriate security measures to protect your personal information. However, no method of transmission over the internet is 100% secure, and we cannot guarantee absolute security.
        </Typography>

        <Typography variant="h4" gutterBottom sx={{ mt: 4 }}>
          5. Your Rights
        </Typography>
        <Typography paragraph>
          You have the right to:
        </Typography>
        <Typography component="ul" sx={{ pl: 4 }}>
          <li>Access your personal information</li>
          <li>Correct inaccurate data</li>
          <li>Request deletion of your data</li>
          <li>Opt-out of marketing communications</li>
          <li>Export your data</li>
        </Typography>

        <Typography variant="h4" gutterBottom sx={{ mt: 4 }}>
          6. Cookies and Tracking
        </Typography>
        <Typography paragraph>
          We use cookies and similar tracking technologies to improve your browsing experience and analyze website traffic. You can control cookie settings through your browser preferences.
        </Typography>

        <Typography variant="h4" gutterBottom sx={{ mt: 4 }}>
          7. Children's Privacy
        </Typography>
        <Typography paragraph>
          Our services are not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13.
        </Typography>

        <Typography variant="h4" gutterBottom sx={{ mt: 4 }}>
          8. International Data Transfers
        </Typography>
        <Typography paragraph>
          Your information may be transferred to and processed in countries other than your country of residence. We ensure appropriate safeguards are in place for such transfers.
        </Typography>

        <Typography variant="h4" gutterBottom sx={{ mt: 4 }}>
          9. Changes to Privacy Policy
        </Typography>
        <Typography paragraph>
          We may update this privacy policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the "Last updated" date.
        </Typography>

        <Typography variant="h4" gutterBottom sx={{ mt: 4 }}>
          10. Contact Us
        </Typography>
        <Typography paragraph>
          If you have questions about this Privacy Policy, please contact us at privacy@orentit.com
        </Typography>
      </Paper>
    </Container>
  );
};

export default Privacy; 