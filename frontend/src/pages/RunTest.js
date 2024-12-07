import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AuthWrapper from '../components/auth/authWrapper';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import { CircularProgress, Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from '@mui/material';
import Collections from '../components/collections/Collections';

const RunTest = () => {
  const [url, setUrl] = useState('URL');
  const navigate = useNavigate();
  const { id } = useParams();
  const [tests, setTests] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [selectedTest, setSelectedTest] = useState(null);

  const storedToken = localStorage.getItem('access_token');

  // States for collection details modal
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedCollection, setSelectedCollection] = useState(null);
  const [loadingCollectionDetail, setLoadingCollectionDetail] = useState(false);
  const [collectionError, setCollectionError] = useState(null);

  useEffect(() => {
    const fetchTests = async () => {
      try {
        const response = await fetch('http://localhost:8000/security/security_test_cases/', {
          headers: {
            'Authorization': `Bearer ${storedToken}`,
          },
        });
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        if (Array.isArray(data)) {
          setTests(data);
        } else {
          console.error('Unexpected response format:', data);
        }
      } catch (error) {
        console.error('Fetching tests failed:', error);
      }
    };

    fetchTests();
  }, [storedToken]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:8000/security/runTest/', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${storedToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url: url,
          id: selectedTest,
        }),
      });
      if (!response.ok) {
        console.log(response);
      }
      response.json().then(data => {
        console.log(data);
        if (data.result) {
          alert('Test Passed: ' + url + ' is vulnerable');
        } else {
          alert('Test Failed');
        }
      });

    } catch (error) {
      console.log("Error");
      alert(error);
    }
  };

  // Handle viewing a single collection detail
  const handleViewCollection = async (collectionId) => {
    setLoadingCollectionDetail(true);
    setCollectionError(null);

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
      setModalOpen(true);
    } catch (err) {
      console.error('Error fetching collection details:', err.message);
      setCollectionError(err.message);
    } finally {
      setLoadingCollectionDetail(false);
    }
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedCollection(null);
  };

  return (
    <div className="min-h-screen bg-gray-900 px-4 py-10">
      <div className="bg-white shadow-lg rounded-lg max-w-4xl w-full mx-auto p-6">
        <h2 className="text-2xl font-semibold text-center">Run Test</h2>
        <form className="mt-6" onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="url" className="block text-sm font-semibold uppercase">
              URL
            </label>
            <input
              id="url"
              type="url"
              name="url"
              placeholder="URL"
              autoComplete="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="block w-full border border-gray-400 bg-white text-black h-10 px-3 rounded-lg focus:bg-gray-200 mt-2"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-semibold uppercase">Test Type</label>
            {tests.map((test) => (
              <div key={test.id} className="flex items-center mt-2">
                <input
                  type="radio"
                  id={`test-${test.id}`}
                  name="test"
                  value={test.id}
                  onChange={() => setSelectedTest(test.id)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                  required
                />
                <label htmlFor={`test-${test.id}`} className="ml-2 block text-sm text-gray-700">
                  <strong>{test.name}</strong>: {test.description}
                </label>
              </div>
            ))}
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white uppercase text-lg font-semibold p-3 rounded-lg mt-4 transition duration-200"
          >
            Run Test
          </button>
        </form>

        {/* Collections Section */}
        <div className="mt-10">
          <h3 className="text-xl font-semibold mb-4">Collections</h3>
          <Collections onViewCollection={handleViewCollection} />
        </div>
      </div>

      {/* Modal for displaying selected collection details */}
      <Dialog open={modalOpen} onClose={handleCloseModal} maxWidth="md" fullWidth>
        <DialogTitle>Collection Details</DialogTitle>
        <DialogContent>
          {loadingCollectionDetail && <CircularProgress />}
          {collectionError && <Typography color="error">Error: {collectionError}</Typography>}
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
          <Button onClick={handleCloseModal} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default RunTest;
