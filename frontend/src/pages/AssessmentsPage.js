import React, { useState, useEffect } from 'react';
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
  IconButton,
  Collapse,
  Box,
} from '@mui/material';
import { KeyboardArrowDown, KeyboardArrowUp } from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';

const AssessmentsPage = () => {
  const { collectionId } = useParams();
  const navigate = useNavigate();

  const [assessments, setAssessments] = useState([]);
  const [loadingAssessments, setLoadingAssessments] = useState(false);
  const [assessmentsError, setAssessmentsError] = useState(null);
  const [expandedRows, setExpandedRows] = useState({});
  const [detailsLoading, setDetailsLoading] = useState({});
  const [detailsError, setDetailsError] = useState({});
  const [details, setDetails] = useState({});

  const storedToken = localStorage.getItem('access_token');

  useEffect(() => {
    const fetchAssessments = async () => {
      setLoadingAssessments(true);
      try {
        const response = await fetch(
          `http://localhost:8000/collections/${collectionId}/assessments/`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${storedToken}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error('Failed to fetch assessments');
        }

        const data = await response.json();
        setAssessments(data);
      } catch (error) {
        setAssessmentsError(error.message);
      } finally {
        setLoadingAssessments(false);
      }
    };

    fetchAssessments();
  }, [collectionId, storedToken]);

  const handleExpandClick = async (assessmentId) => {
    // Toggle expand/collapse
    setExpandedRows((prev) => ({
      ...prev,
      [assessmentId]: !prev[assessmentId],
    }));

    // If we haven't yet fetched the details, do so now
    if (!details[assessmentId]) {
      setDetailsLoading((prev) => ({ ...prev, [assessmentId]: true }));
      try {
        const response = await fetch(
          `http://localhost:8000/assessments/${assessmentId}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${storedToken}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error(
            `Failed to fetch details for assessment ${assessmentId}`
          );
        }

        const data = await response.json();
        setDetails((prev) => ({ ...prev, [assessmentId]: data.results }));
      } catch (error) {
        setDetailsError((prev) => ({
          ...prev,
          [assessmentId]: error.message,
        }));
      } finally {
        setDetailsLoading((prev) => ({ ...prev, [assessmentId]: false }));
      }
    }
  };

  if (loadingAssessments) {
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

  return (
    <Container
      maxWidth="md"
      sx={{
        py: 12,
        minHeight: '100vh'
      }}
    >
      <Button variant="outlined" onClick={() => navigate(-1)} sx={{ mb: 3, backgroundColor: '#093170', }}>
        Go Back
      </Button>

      <Typography variant="h4" color="white" sx={{ mb: 4, fontWeight: 'bold',  }}>
        Assessments for Collection {collectionId}
      </Typography>

      {assessmentsError && (
        <Typography color="error" sx={{ mb: 2 }}>
          Error: {assessmentsError}
        </Typography>
      )}

      {assessments.length === 0 && !assessmentsError && (
        <Typography variant="body1">No assessments found.</Typography>
      )}

      {assessments.length > 0 && (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                <TableCell />
                <TableCell>
                  <strong>Assessment ID</strong>
                </TableCell>
                <TableCell>
                  <strong>Collection ID</strong>
                </TableCell>
                <TableCell>
                  <strong>Timestamp</strong>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {assessments.map((assessment) => (
                <React.Fragment key={assessment.assessment_id}>
                  <TableRow>
                    <TableCell>
                      <IconButton
                        onClick={() =>
                          handleExpandClick(assessment.assessment_id)
                        }
                        aria-expanded={expandedRows[assessment.assessment_id]}
                        aria-label="expand row"
                      >
                        {expandedRows[assessment.assessment_id] ? (
                          <KeyboardArrowUp />
                        ) : (
                          <KeyboardArrowDown />
                        )}
                      </IconButton>
                    </TableCell>
                    <TableCell>{assessment.assessment_id}</TableCell>
                    <TableCell>{assessment.collection_id}</TableCell>
                    <TableCell>{assessment.timestamp}</TableCell>
                  </TableRow>
                  {/* Expandable Detail Row */}
                  <TableRow>
                    <TableCell colSpan={4} sx={{ p: 0 }}>
                      <Collapse
                        in={expandedRows[assessment.assessment_id]}
                        timeout="auto"
                        unmountOnExit
                      >
                        <Box sx={{ m: 2 }}>
                          {detailsLoading[assessment.assessment_id] && (
                            <CircularProgress />
                          )}
                          {detailsError[assessment.assessment_id] && (
                            <Typography color="error" sx={{ mt: 1 }}>
                              Error: {detailsError[assessment.assessment_id]}
                            </Typography>
                          )}
                          {details[assessment.assessment_id] && (
                            <Table size="small">
                              <TableHead>
                                <TableRow>
                                  <TableCell><strong>Endpoint</strong></TableCell>
                                  <TableCell><strong>SQL Injection</strong></TableCell>
                                  <TableCell><strong>BOLA</strong></TableCell>
                                  <TableCell><strong>CORS Check</strong></TableCell>
                                  <TableCell><strong>Header Validation</strong></TableCell>
                                  <TableCell><strong>Sensitive Info</strong></TableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {details[assessment.assessment_id].map(
                                  (result) => (
                                    <TableRow key={result.result_id}>
                                      <TableCell>{result.endpoint}</TableCell>
                                      <TableCell>
                                        {result.sqli ? 'True' : 'False'}
                                      </TableCell>
                                      <TableCell>
                                        {result.bola ? 'True' : 'False'}
                                      </TableCell>
                                      <TableCell>
                                        {result.cors ? 'True' : 'False'}
                                      </TableCell>
                                      <TableCell>
                                        {result.header ? 'True' : 'False'}
                                      </TableCell>
                                      <TableCell>
                                        {result.sensitive_info
                                          ? 'True'
                                          : 'False'}
                                      </TableCell>
                                    </TableRow>
                                  )
                                )}
                              </TableBody>
                            </Table>
                          )}
                        </Box>
                      </Collapse>
                    </TableCell>
                  </TableRow>
                </React.Fragment>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Container>
  );
};

export default AssessmentsPage;
