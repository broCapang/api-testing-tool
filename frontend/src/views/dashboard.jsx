import React, { useState, useEffect } from 'react';
import { Container, Grid, Paper, Typography, CircularProgress, Card, CardContent, CardActions, Button } from '@mui/material';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, Legend } from 'recharts';
import TestList from '../components/dashboard/testList';

const dataLine = [
  { name: 'Sep', uv: 400 },
  { name: 'Oct', uv: 300 },
  { name: 'Nov', uv: 200 },
  { name: 'Dec', uv: 278 },
  { name: 'Jan', uv: 189 },
  { name: 'Feb', uv: 239 },
];

const dataPie = [
  { name: 'BOLA', value: 24 },
  { name: 'SQLI', value: 40 },
  { name: 'SSRF', value: 12 },
  { name: 'SSTI', value: 15 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const Dashboard = () => {
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch collections from the backend
  useEffect(() => {
    const fetchCollections = async () => {
      try {
        const response = await fetch('http://localhost:8000/collections/', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch collections');
        }

        const data = await response.json();
        setCollections(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCollections();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <CircularProgress />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Typography variant="h6" color="error">
          Error: {error}
        </Typography>
      </div>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 10 }} >
      <Grid container spacing={4} >
        {/* Number of API Endpoints */}
        <Grid item xs={12} sm={6} md={4}>
          <Paper sx={{ p: 3, borderRadius: 2, boxShadow: 2, '&:hover': { transform: 'scale(1.05)', boxShadow: 4 } }}>
            <Typography variant="h6" sx={{ mb: 1, color: '#333' }}>
              Number of API Endpoints
            </Typography>
            <Typography variant="h4" sx={{ color: '#444' }}>
              236
            </Typography>
          </Paper>
        </Grid>

        {/* Test Runs */}
        <Grid item xs={12} sm={6} md={4}>
          <Paper sx={{ p: 3, borderRadius: 2, boxShadow: 2, '&:hover': { transform: 'scale(1.05)', boxShadow: 4 } }}>
            <Typography variant="h6" sx={{ mb: 1, color: '#333' }}>
              Test runs
            </Typography>
            <Typography variant="h4" sx={{ color: '#444' }}>
              32
            </Typography>
          </Paper>
        </Grid>

        {/* Test Runs this month */}
        <Grid item xs={12} sm={6} md={4}>
          <Paper sx={{ p: 3, borderRadius: 2, boxShadow: 2, '&:hover': { transform: 'scale(1.05)', boxShadow: 4 } }}>
            <Typography variant="h6" sx={{ mb: 1, color: '#333' }}>
              Test runs this month
            </Typography>
            <Typography variant="h4" sx={{ color: '#444' }}>
              3
            </Typography>
          </Paper>
        </Grid>

        {/* LineChart: Warnings over months */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 4, background: '#f9f9f9', borderRadius: 2 }}>
            <Typography variant="h6" sx={{ mb: 2, color: '#333' }}>
              Warnings over months
            </Typography>
            <LineChart width={600} height={300} data={dataLine}>
              <Line type="monotone" dataKey="uv" stroke="#8884d8" />
              <CartesianGrid stroke="#ccc" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
            </LineChart>
          </Paper>
        </Grid>

        {/* PieChart: Vulnerability Types */}
        {/* <Grid item xs={12} md={4}>
          <Paper sx={{ p: 4, display: 'flex', justifyContent: 'center', background: '#f9f9f9', borderRadius: 2 }}>
            <Typography variant="h6" align="center" sx={{ mb: 2, color: '#333' }}>
              Percentage Vulnerability Types
            </Typography>
            <PieChart width={200} height={300}>
              <Legend layout="horizontal" verticalAlign="top" align="right" />
              <Pie
                data={dataPie}
                cx="50%"
                cy="50%"
                labelLine={true}
                label={true}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {dataPie.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index]} />
                ))}
              </Pie>
            </PieChart>
          </Paper>
        </Grid> */}

        {/* Display Collections */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3, borderRadius: 2, boxShadow: 2 }}>
            <Typography variant="h6" sx={{ mb: 2, color: '#333' }}>
              Available Collections
            </Typography>
            <Grid container spacing={4}>
              {collections.map((collection) => (
                <Grid item xs={12} sm={6} md={4} key={collection.collection_id}>
                  <Card sx={{ borderRadius: 2, boxShadow: 2, '&:hover': { transform: 'scale(1.05)', boxShadow: 4 } }}>
                    <CardContent>
                      <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#333' }}>
                        {collection.name}
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#666' }}>
                        {collection.api_endpoints.length} API Endpoints
                      </Typography>
                    </CardContent>
                    <CardActions>
                      <Button size="small" sx={{ color: '#3f51b5' }} onClick={() => handleViewCollection(collection.collection_id)}>
                        View Details
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );

  function handleViewCollection(collectionId) {
    console.log(`View details for collection ${collectionId}`);
    // Redirect to another page or show details
  }
};

export default Dashboard;
