import React from 'react';
import { Container, Typography, Box, Paper } from '@mui/material';

const Terms: React.FC = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Box textAlign="center" mb={6}>
        <Typography variant="h2" component="h1" gutterBottom>
          Terms of Service
        </Typography>
        <Typography variant="h5" color="text.secondary" paragraph>
          Last updated: {new Date().toLocaleDateString()}
        </Typography>
      </Box>

      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>
          1. Acceptance of Terms
        </Typography>
        <Typography paragraph>
          By accessing and using ORentit's services, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this site.
        </Typography>

        <Typography variant="h4" gutterBottom sx={{ mt: 4 }}>
          2. User Accounts
        </Typography>
        <Typography paragraph>
          To use certain features of our service, you must register for an account. You agree to provide accurate and complete information during registration and to keep your account information updated. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.
        </Typography>

        <Typography variant="h4" gutterBottom sx={{ mt: 4 }}>
          3. Equipment Rental
        </Typography>
        <Typography paragraph>
          Our platform facilitates the rental of equipment between users. As a renter, you agree to:
        </Typography>
        <Typography component="ul" sx={{ pl: 4 }}>
          <li>Use the equipment responsibly and in accordance with its intended purpose</li>
          <li>Return the equipment in the same condition as received</li>
          <li>Pay all applicable fees and charges</li>
          <li>Report any damage or issues immediately</li>
        </Typography>

        <Typography variant="h4" gutterBottom sx={{ mt: 4 }}>
          4. Equipment Listing
        </Typography>
        <Typography paragraph>
          As an equipment owner, you agree to:
        </Typography>
        <Typography component="ul" sx={{ pl: 4 }}>
          <li>Provide accurate descriptions of your equipment</li>
          <li>Maintain equipment in good working condition</li>
          <li>Honor all confirmed bookings</li>
          <li>Comply with all applicable laws and regulations</li>
        </Typography>

        <Typography variant="h4" gutterBottom sx={{ mt: 4 }}>
          5. Payments and Fees
        </Typography>
        <Typography paragraph>
          We charge service fees for facilitating rentals through our platform. All fees are clearly displayed before booking. Payment processing is handled securely through our payment partners. Refunds are subject to our refund policy and the terms of the specific rental agreement.
        </Typography>

        <Typography variant="h4" gutterBottom sx={{ mt: 4 }}>
          6. Insurance and Liability
        </Typography>
        <Typography paragraph>
          While we provide insurance options, users are encouraged to obtain appropriate insurance coverage. ORentit is not liable for any damages, injuries, or losses arising from the use of rented equipment. Users are responsible for their own safety and compliance with all applicable laws.
        </Typography>

        <Typography variant="h4" gutterBottom sx={{ mt: 4 }}>
          7. Prohibited Activities
        </Typography>
        <Typography paragraph>
          Users are prohibited from:
        </Typography>
        <Typography component="ul" sx={{ pl: 4 }}>
          <li>Violating any applicable laws or regulations</li>
          <li>Engaging in fraudulent activities</li>
          <li>Misrepresenting equipment or rental terms</li>
          <li>Interfering with the proper functioning of the platform</li>
        </Typography>

        <Typography variant="h4" gutterBottom sx={{ mt: 4 }}>
          8. Termination
        </Typography>
        <Typography paragraph>
          We reserve the right to terminate or suspend access to our services for violations of these terms or for any other reason at our sole discretion. Users may terminate their account at any time by following the account deletion process.
        </Typography>

        <Typography variant="h4" gutterBottom sx={{ mt: 4 }}>
          9. Changes to Terms
        </Typography>
        <Typography paragraph>
          We reserve the right to modify these terms at any time. Users will be notified of significant changes. Continued use of the platform after changes constitutes acceptance of the modified terms.
        </Typography>

        <Typography variant="h4" gutterBottom sx={{ mt: 4 }}>
          10. Contact Information
        </Typography>
        <Typography paragraph>
          For questions about these Terms of Service, please contact us at legal@orentit.com
        </Typography>
      </Paper>
    </Container>
  );
};

export default Terms; 