import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  CircularProgress,
  Snackbar,
  Alert,
  Box,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

const CollectionsPage = () => {
  const navigate = useNavigate();

  // -----------------------------
  // State variables
  // -----------------------------
  const [collections, setCollections] = useState([]);
  const [collectionsLoading, setCollectionsLoading] = useState(true);
  const [collectionsError, setCollectionsError] = useState(null);

  // For delete notifications
  const [deleteError, setDeleteError] = useState(null);
  const [deleteSuccess, setDeleteSuccess] = useState(false);

  // For running tests
  const [testLoading, setTestLoading] = useState(false);
  const [testSuccess, setTestSuccess] = useState(false); // to show "Testing Done!"
  const [tests, setTests] = useState([]);
  const [testsLoading, setTestsLoading] = useState(true);
  const [testsError, setTestsError] = useState(null);

  const storedToken = localStorage.getItem('access_token');

  // -----------------------------
  // Fetch collections
  // -----------------------------
  useEffect(() => {
    const fetchCollections = async () => {
      try {
        const response = await fetch('http://localhost:8000/collections/', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${storedToken}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch collections');
        }

        const data = await response.json();
        setCollections(data);
      } catch (error) {
        setCollectionsError(error.message);
      } finally {
        setCollectionsLoading(false);
      }
    };

    fetchCollections();
  }, [storedToken]);

  // -----------------------------
  // Fetch security test cases
  // -----------------------------
  useEffect(() => {
    const fetchTests = async () => {
      setTestsLoading(true);
      setTestsError(null);
      try {
        const response = await fetch(
          'http://localhost:8000/security/security_test_cases/',
          {
            headers: {
              Authorization: `Bearer ${storedToken}`,
            },
          }
        );
        if (!response.ok) {
          throw new Error('Failed to fetch security test cases');
        }
        const data = await response.json();
        setTests(data);
      } catch (error) {
        setTestsError(error.message);
      } finally {
        setTestsLoading(false);
      }
    };

    fetchTests();
  }, [storedToken]);

  // -----------------------------
  // Delete a collection
  // -----------------------------
  const handleDeleteCollection = async (collectionId) => {
    if (!window.confirm('Are you sure you want to delete this collection?')) {
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:8000/collections/${collectionId}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${storedToken}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to delete the collection');
      }

      // Remove from local state
      setCollections((prevCollections) =>
        prevCollections.filter(
          (collection) => collection.collection_id !== collectionId
        )
      );
      setDeleteSuccess(true);
    } catch (error) {
      setDeleteError(error.message);
    }
  };

  // -----------------------------
  // Navigate to "Assessments" page
  // -----------------------------
  const handleViewAssessments = (collectionId) => {
    navigate(`/assessments/${collectionId}`);
  };

  // -----------------------------
  // Navigate to "Collection Detail" page
  // -----------------------------
  const handleViewCollection = (collectionId) => {
    navigate(`/collection/${collectionId}`);
  };

  // -----------------------------
  // Run Test (All tests)
  // -----------------------------
  const handleRunTest = async (collectionId) => {
    // Set the test loading spinner
    setTestLoading(true);
    setTestSuccess(false); // reset any prior success state

    try {
      const response = await fetch('http://localhost:8000/security/runAllTests/', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${storedToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          collection_id: collectionId,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to run all security tests');
      }

      const data = await response.json();
      console.log('Test results:', data);

      // Show success snackbar
      setTestSuccess(true);
    } catch (error) {
      console.error('Error running test:', error);
      alert('Error running test: ' + error.message);
    } finally {
      // Turn off spinner
      setTestLoading(false);
    }
  };

  // -----------------------------
  // Close any open snackbar
  // -----------------------------
  const handleSnackbarClose = () => {
    setDeleteError(null);
    setDeleteSuccess(false);
    setTestSuccess(false);
  };

  // -----------------------------
  // Render
  // -----------------------------
  if (collectionsLoading) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#f0f2f5',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (collectionsError) {
    return (
      <Typography variant="h6" color="error" sx={{ mt: 4, textAlign: 'center' }}>
        Error: {collectionsError}
      </Typography>
    );
  }

  return (
    <Container
      maxWidth="lg"
      sx={{
        py: 12,
        minHeight: '100vh',
      }}
    >
      <Typography
        variant="h4"
        color="white"
        sx={{ mb: 4, fontWeight: 'bold', textAlign: 'center' }}
      >
        Available Collections
      </Typography>

      <Grid container spacing={3}>
        {collections.map((collection) => (
          <Grid item xs={12} sm={6} md={6} key={collection.collection_id}>
            <Card
              sx={{
                borderRadius: 2,
                boxShadow: 3,
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                '&:hover': {
                  transform: 'scale(1.02)',
                  boxShadow: 6,
                },
              }}
            >
              <CardContent>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  {collection.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {collection.api_endpoints.length} API Endpoints
                </Typography>
              </CardContent>

              <CardActions sx={{ justifyContent: 'space-between', px: 2 }}>
                <Button
                  size="small"
                  variant="outlined"
                  onClick={() => handleViewAssessments(collection.collection_id)}
                >
                  View Assessments
                </Button>
                <Button
                  size="small"
                  variant="outlined"
                  onClick={() => handleViewCollection(collection.collection_id)}
                >
                  View Collection
                </Button>
                {/* Run Test button */}
                <Button
                  size="small"
                  variant="outlined"
                  color="success"
                  onClick={() => handleRunTest(collection.collection_id)}
                  disabled={testLoading} // disable if test is running
                >
                  {testLoading ? (
                    <CircularProgress size={18} />
                  ) : (
                    'Run Test'
                  )}
                </Button>
                <Button
                  size="small"
                  variant="outlined"
                  color="error"
                  onClick={() => handleDeleteCollection(collection.collection_id)}
                >
                  Delete
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Snackbar for Deletion Errors/Success */}
      <Snackbar
        open={!!deleteError}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
      >
        <Alert onClose={handleSnackbarClose} severity="error">
          {deleteError}
        </Alert>
      </Snackbar>
      <Snackbar
        open={deleteSuccess}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
      >
        <Alert onClose={handleSnackbarClose} severity="success">
          Collection deleted successfully!
        </Alert>
      </Snackbar>

      {/* Snackbar for Test Completion */}
      <Snackbar
        open={testSuccess}
        autoHideDuration={4000}
        onClose={handleSnackbarClose}
      >
        <Alert onClose={handleSnackbarClose} severity="success">
          Testing Done!
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default CollectionsPage;
