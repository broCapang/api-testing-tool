import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { Container, Box, Paper, Typography, TextField, Button } from '@mui/material';

// Desc: Profile page for the user to view their profile
// it will show something like this:
//   "username": "irfan",
//   "email": "irfan@example.com",
//   "full_name": null,
//   "id": 6,

const Profile = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [fullname, setFullname] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);
    const navigate = useNavigate();
  
    // Fetch the user profile information
    useEffect(() => {
      const fetchProfile = async () => {
        const storedToken = localStorage.getItem('access_token');
        if (!storedToken) {
          navigate('/login');
          return;
        }
        try {
          const response = await fetch('http://localhost:8000/user/profile/', {
            headers: {
              'Authorization': `Bearer ${storedToken}`,
            },
          });
          if (!response.ok) {
            throw new Error('Failed to fetch profile');
          }
          const data = await response.json();
          setUsername(data.username);
          setEmail(data.email);
          setFullname(data.full_name || '');
          setLoading(false);
        } catch (error) {
          setError('Failed to fetch profile information');
          localStorage.removeItem('access_token');
          navigate('/login');
        }
      };
      fetchProfile();
    }, [navigate]);
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      setError(null);
      setSuccessMessage(null);
  
      // Validation
      if (!username || !email || !password) {
        setError('All fields are required');
        return;
      }
  
      setLoading(true);
  
      const storedToken = localStorage.getItem('access_token');
      try {
        const response = await fetch('http://localhost:8000/user/profile/update/', {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${storedToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ username, email, full_name: fullname, password }),
        });
  
        if (!response.ok) {
          throw new Error('Failed to update profile');
        }
  
        setSuccessMessage('Profile updated successfully');
      } catch (error) {
        setError('Failed to update profile');
      } finally {
        setLoading(false);
      }
    };
  

    return (
        <Container maxWidth="sm" className="justify-center h-screen content-center">
        <Paper elevation={3} className="p-10 mb-6">
            <Typography variant="h5" className="mb-4 text-center">Profile Information</Typography>
            <Box className="text-black">
                <Typography variant="body1"><strong>Username:</strong> {username}</Typography>
                <Typography variant="body1"><strong>Email:</strong> {email}</Typography>
                <Typography variant="body1"><strong>Full Name:</strong> {fullname}</Typography>
            </Box>
        </Paper>
        <Paper elevation={3} className="p-6">
            <Typography variant="h5" className="mb-4 text-center">Update Profile</Typography>
            <form >
                <TextField
                    fullWidth
                    label="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    margin="normal"
                    variant="outlined"
                    required
                />
                <TextField
                    fullWidth
                    label="Email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    margin="normal"
                    variant="outlined"
                    required
                />
                <TextField
                    fullWidth
                    label="Full Name"
                    value={fullname}
                    onChange={(e) => setFullname(e.target.value)}
                    margin="normal"
                    variant="outlined"
                />
                <TextField
                    fullWidth
                    label="Password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    margin="normal"
                    variant="outlined"
                    required
                />
                <Button
                    fullWidth
                    type="submit"
                    variant="contained"
                    color="primary"
                    className="mt-4"
                >
                    Update
                </Button>
            </form>
        </Paper>
    </Container>
    );



}

export default Profile;

            
