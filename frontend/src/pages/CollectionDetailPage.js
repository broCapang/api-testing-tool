import React, { useEffect, useState } from 'react';
import {
  Container,
  CircularProgress,
  Typography,
  Button,
  Paper,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  Box,
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';

const CollectionDetailPage = () => {
  const { collectionId } = useParams();
  const navigate = useNavigate();

  const [selectedCollection, setSelectedCollection] = useState(null);
  const [loadingCollectionDetail, setLoadingCollectionDetail] = useState(false);
  const [collectionDetailError, setCollectionDetailError] = useState(null);

  const storedToken = localStorage.getItem('access_token');

  useEffect(() => {
    const fetchCollection = async () => {
      setLoadingCollectionDetail(true);
      try {
        const response = await fetch(
          `http://localhost:8000/collections/${collectionId}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${storedToken}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error('Failed to fetch collection details');
        }

        const data = await response.json();
        setSelectedCollection(data);
      } catch (error) {
        setCollectionDetailError(error.message);
      } finally {
        setLoadingCollectionDetail(false);
      }
    };

    fetchCollection();
  }, [collectionId, storedToken]);

  if (loadingCollectionDetail) {
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

  if (collectionDetailError) {
    return (
      <Typography
        variant="h6"
        color="error"
        sx={{ mt: 4, textAlign: 'center' }}
      >
        Error: {collectionDetailError}
      </Typography>
    );
  }

  return (
    <Container
      maxWidth="md"
      sx={{
        py: 12,
        minHeight: '100vh',
      }}
    >
      <Button variant="outlined" onClick={() => navigate(-1)} sx={{ mb: 3,  backgroundColor: '#093170' }}>
        Go Back
      </Button>

      <Typography variant="h4" color="white" sx={{ mb: 4, fontWeight: 'bold' }}>
        Collection Details
      </Typography>

      {selectedCollection && (
        <>
          <Typography variant="h5" color="white" sx={{ mb: 1, fontWeight: 'bold' }}>
            {selectedCollection.name}
          </Typography>
          <Typography variant="subtitle1" color="white" sx={{ mb: 2 }}>
            <strong>Collection ID:</strong> {selectedCollection.collection_id}
          </Typography>
          <Typography variant="body1" color="white" sx={{ mb: 2 }}>
            <strong>Number of API endpoints:</strong>{" "}
            {selectedCollection.api_endpoints.length}
          </Typography>

          <Typography variant="h6" color="white" sx={{ mt: 4, mb: 2, fontWeight: 'bold' }}>
            API Endpoints
          </Typography>
          {selectedCollection.api_endpoints.length > 0 ? (
            <TableContainer component={Paper} sx={{ backgroundColor: '#fff' }}>
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                    <TableCell>
                      <strong>No.</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Endpoint</strong>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {selectedCollection.api_endpoints.map((endpoint, index) => (
                    <TableRow key={index}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{endpoint}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Typography variant="body2" sx={{ mt: 2 }}>
              No endpoints found.
            </Typography>
          )}
        </>
      )}
    </Container>
  );
};

export default CollectionDetailPage;
