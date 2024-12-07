import React, { useState, useEffect } from 'react';
import { Grid, Card, CardContent, CardActions, Typography, Button, CircularProgress } from '@mui/material';

const Collections = ({ onViewCollection }) => {
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
      <div className="flex justify-center items-center h-full">
        <CircularProgress />
      </div>
    );
  }

  if (error) {
    return (
      <Typography variant="h6" color="error">
        Error: {error}
      </Typography>
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
              <Button size="small" color="primary" onClick={() => onViewCollection(collection.collection_id)}>
                View Details
              </Button>
            </CardActions>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default Collections;
