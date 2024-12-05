import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Box, Paper, Typography, TextField, Button, CircularProgress, Alert, Autocomplete } from '@mui/material';

const Discover = () => {
  const [domain, setDomain] = useState('https://');  // Default value for domain
  const [name, setName] = useState('My Collection');
  const [tests, setTests] = useState([]);
  const [selectedTest, setSelectedTest] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const storedToken = localStorage.getItem('access_token');
  const navigate = useNavigate();


  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    try {
      const response = await fetch('http://localhost:8000/crawl', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${storedToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          domain,
          name,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to start the crawling task');
      }

      const data = await response.json();
      setMessage(`Collection '${data.name}' complete `);
      console.log(data);
    } catch (error) {
      console.error('Error during crawl submission:', error);
      setMessage('Error starting crawl');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: 5 }} className="justify-center h-screen content-center">
      <Paper sx={{ p: 4, borderRadius: 2, boxShadow: 3 }}>
        <Typography variant="h5" align="center" sx={{ mb: 3 }}>
          Run Discovery Tool
        </Typography>

        {message && (
          <Alert severity={message.includes('Error') ? 'error' : 'success'} sx={{ mb: 3 }}>
            {message}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <Box sx={{ mb: 3 }}>
            <TextField
              fullWidth
              label="Domain"
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              variant="outlined"
              required
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Collection Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              variant="outlined"
              required
              sx={{ mb: 2 }}
            />


          </Box>

          <Button
            fullWidth
            type="submit"
            variant="contained"
            color="primary"
            sx={{ mt: 2 }}
            disabled={isLoading}
          >
            {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Run Discovery Tool'}
          </Button>
        </form>
      </Paper>
    </Container>
  );
};

export default Discover;
