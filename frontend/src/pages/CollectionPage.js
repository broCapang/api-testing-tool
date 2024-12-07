import React, { useState, useEffect } from 'react';
import { Grid, Card, Container, CardContent, CardActions, Typography, Button, CircularProgress, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Radio, RadioGroup, FormControlLabel } from '@mui/material';

const CollectionsPage = () => {
  const [collections, setCollections] = useState([]);
  const [collectionsLoading, setCollectionsLoading] = useState(true);
  const [collectionsError, setCollectionsError] = useState(null);

  const [selectedCollection, setSelectedCollection] = useState(null);
  const [collectionModalOpen, setCollectionModalOpen] = useState(false);
  const [loadingCollectionDetail, setLoadingCollectionDetail] = useState(false);
  const [collectionDetailError, setCollectionDetailError] = useState(null);

  const [runTestModalOpen, setRunTestModalOpen] = useState(false);
  const [tests, setTests] = useState([]);
  const [testsLoading, setTestsLoading] = useState(true);
  const [testsError, setTestsError] = useState(null);

  const [selectedTestCase, setSelectedTestCase] = useState('');
  const [testUrl, setTestUrl] = useState('');

  const storedToken = localStorage.getItem('access_token');

  // Fetch collections on load
  useEffect(() => {
    const fetchCollections = async () => {
      try {
        const response = await fetch('http://localhost:8000/collections/', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${storedToken}`,
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

  // Fetch test cases on load (so they're ready when user wants to run a test)
  useEffect(() => {
    const fetchTests = async () => {
      try {
        const response = await fetch('http://localhost:8000/security/security_test_cases/', {
          headers: {
            'Authorization': `Bearer ${storedToken}`,
          },
        });
        if (!response.ok) {
          throw new Error('Failed to fetch test cases');
        }
        const data = await response.json();
        if (Array.isArray(data)) {
          setTests(data);
        } else {
          console.error('Unexpected response format:', data);
        }
      } catch (error) {
        setTestsError(error.message);
      } finally {
        setTestsLoading(false);
      }
    };

    fetchTests();
  }, [storedToken]);

  const handleViewCollection = async (collectionId) => {
    setLoadingCollectionDetail(true);
    setCollectionDetailError(null);
    setSelectedCollection(null);

    try {
      const response = await fetch(`http://localhost:8000/collections/${collectionId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${storedToken}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch collection details');
      }

      const data = await response.json();
      setSelectedCollection(data);
      setCollectionModalOpen(true);
    } catch (err) {
      console.error('Error fetching collection details:', err.message);
      setCollectionDetailError(err.message);
    } finally {
      setLoadingCollectionDetail(false);
    }
  };

  const handleCloseCollectionModal = () => {
    setCollectionModalOpen(false);
    setSelectedCollection(null);
  };

  const handleOpenRunTestModal = (collectionId) => {
    // Reset run test form fields
    setSelectedTestCase('');
    setTestUrl('');

    // We could store the collectionId if needed for any reason, but the runTest endpoint may not require it.
    // If the runTest endpoint requires a collection ID, you can store it in state as well:
    // setCurrentCollectionId(collectionId);

    setRunTestModalOpen(true);
  };

  const handleCloseRunTestModal = () => {
    setRunTestModalOpen(false);
  };

  const handleRunTestSubmit = async (e) => {
    // e.preventDefault();
    // if (!selectedTestCaseId || !selectedCollectionId) {
    //   alert('Please select a test case and a collection.');
    //   return;
    // }
  
    // try {
    //   const response = await fetch('http://localhost:8000/security/runTest/', {
    //     method: 'POST',
    //     headers: {
    //       'Authorization': `Bearer ${storedToken}`,
    //       'Content-Type': 'application/json',
    //     },
    //     body: JSON.stringify({
    //       collection_id: selectedCollectionId,
    //       securitytest_id: selectedTestCaseId
    //     }),
    //   });
      
    //   if (!response.ok) {
    //     console.log(response);
    //     throw new Error('Failed to run test');
    //   }
  
    //   const data = await response.json();
    //   console.log(data);
  
    //   // Based on the returned results, handle UI updates or alerts
    //   // The structure: data.results = [{endpoint, test_case_id, result}, ...]
    //   // 'result' may have a structure indicating vulnerability.
    //   // Adjust alert logic based on how 'result' is structured.
  
    //   const anyVulnerable = data.results.some(r => r.result && r.result.vulnerable);
    //   if (anyVulnerable) {
    //     alert(`Some endpoints are vulnerable.`);
    //   } else {
    //     alert('No vulnerabilities found in the tested endpoints.');
    //   }
  
    // } catch (error) {
    //   console.error("Error running test:", error);
    //   alert("Error running test: " + error.message);
    // }
  };
  

  if (collectionsLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <CircularProgress />
      </div>
    );
  }

  if (collectionsError) {
    return (
      <Typography variant="h6" color="error">
        Error: {collectionsError}
      </Typography>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 15 }} className='h-screen items-center justify-center'>
      <Typography variant="h5" sx={{ mb: 4, color: 'white' }}>
        Available Collections
      </Typography>
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
                  View Collection
                </Button>
                <Button size="small" color="secondary" onClick={() => handleOpenRunTestModal(collection.collection_id)}>
                  Run Test
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Collection Details Modal */}
      <Dialog open={collectionModalOpen} onClose={handleCloseCollectionModal} maxWidth="md" fullWidth>
        <DialogTitle>Collection Details</DialogTitle>
        <DialogContent>
          {loadingCollectionDetail && <CircularProgress />}
          {collectionDetailError && <Typography color="error">Error: {collectionDetailError}</Typography>}
          {selectedCollection && !loadingCollectionDetail && (
            <>
              <Typography variant="h6">{selectedCollection.name}</Typography>
              <Typography variant="subtitle1">Collection ID: {selectedCollection.collection_id}</Typography>
              <Typography variant="body1">
                Number of API endpoints: {selectedCollection.api_endpoints.length}
              </Typography>

              <Typography variant="h6" sx={{ mt: 2 }}>API Endpoints</Typography>
              {selectedCollection.api_endpoints.length > 0 ? (
                <ul>
                  {selectedCollection.api_endpoints.map((endpoint, index) => (
                    <li key={index}>{endpoint}</li>
                  ))}
                </ul>
              ) : (
                <Typography variant="body2">No endpoints found.</Typography>
              )}
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseCollectionModal} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Run Test Modal */}
      <Dialog open={runTestModalOpen} onClose={handleCloseRunTestModal} maxWidth="sm" fullWidth>
        <DialogTitle>Run Test</DialogTitle>
        <DialogContent>
          {testsLoading && <CircularProgress />}
          {testsError && <Typography color="error">Error: {testsError}</Typography>}
          {!testsLoading && !testsError && (
            <form onSubmit={handleRunTestSubmit} id="runTestForm">
              <Typography variant="body1" sx={{ mt: 2 }}>
                Select Test Type:
              </Typography>
              <RadioGroup
                value={selectedTestCase}
                onChange={(e) => setSelectedTestCase(e.target.value)}
              >
                {tests.map((testCase) => (
                  <FormControlLabel
                    key={testCase.id}
                    value={testCase.id.toString()}
                    control={<Radio required />}
                    label={
                      <span>
                        <strong>{testCase.name}</strong>: {testCase.description}
                      </span>
                    }
                  />
                ))}
              </RadioGroup>
            </form>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseRunTestModal} color="error">
            Cancel
          </Button>
          <Button type="submit" form="runTestForm" color="primary">
            Run Test
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default CollectionsPage;
