import React, { useState, useEffect } from 'react';
import { Grid, Paper, Typography, CircularProgress, Card, CardContent, CardActions, Button } from '@mui/material';

const Collections = () => {
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
    <Grid container spacing={4}>
      {collections.map((collection) => (
        <Grid item xs={12} sm={6} md={4} key={collection.collection_id}>
          <Card className="rounded-lg shadow-lg">
            <CardContent>
              <Typography variant="h6" color="textPrimary" className="font-semibold">
                {collection.name}
              </Typography>
              <Typography variant="body2" color="textSecondary" className="mt-2">
                {collection.api_endpoints.length} API Endpoints
              </Typography>
            </CardContent>
            <CardActions>
              <Button size="small" color="primary" onClick={() => handleViewCollection(collection.collection_id)}>
                View Details
              </Button>
            </CardActions>
          </Card>
        </Grid>
      ))}
    </Grid>
  );

  function handleViewCollection(collectionId) {
    console.log(`View details for collection ${collectionId}`);
    // Redirect to another page or show details
  }
};

export default Collections;
