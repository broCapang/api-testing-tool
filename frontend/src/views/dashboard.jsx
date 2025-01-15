import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

import Collections from "../components/collections/Collections"; // Your existing Collections component

// Colors for PieChart (adjust as desired)
const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#AF19FF", "#FF77B9"];

const Dashboard = () => {
  // State for analytics overview
  const [overview, setOverview] = useState({
    total_users: 0,
    total_collections: 0,
    total_assessments: 0,
    total_results: 0,
  });

  // State for time-series data
  const [trendData, setTrendData] = useState([]);

  // State for top endpoints
  const [topEndpoints, setTopEndpoints] = useState([]);

  // State for summary by collections (could display a table or chart)
  const [collectionsSummary, setCollectionsSummary] = useState([]);

  // Example: Pie chart data (if you’d like to show some distribution).
  // If your backend does not provide direct vulnerability type distribution,
  // you can adapt or remove the PieChart section.
  const [vulnData, setVulnData] = useState([
    { name: "SQL Injection", value: 0 },
    { name: "BOLA", value: 0 },
    { name: "Header Validation", value: 0 },
    { name: "Sensitive Info", value: 0 },
    { name: "CORS", value: 0 },
  ]);

  useEffect(() => {
    // Example: token from localStorage. Adjust as needed.
    const token = localStorage.getItem("access_token");

    // Create an axios instance with default settings
    const instance = axios.create({
      baseURL: "http://localhost:8000",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const fetchAnalyticsOverview = async () => {
      try {
        const response = await instance.get("/analytics/overview");
        setOverview(response.data);
      } catch (error) {
        console.error("Error fetching overview data:", error);
      }
    };

    const fetchTrends = async () => {
      try {
        const response = await instance.get("/analytics/trends");
        // Response is an array of {date: "YYYY-MM-DD", count: number}
        setTrendData(response.data);
      } catch (error) {
        console.error("Error fetching trends data:", error);
      }
    };

    const fetchTopEndpoints = async () => {
      try {
        const response = await instance.get("/analytics/top-endpoints");
        setTopEndpoints(response.data);
      } catch (error) {
        console.error("Error fetching top endpoints:", error);
      }
    };

    const fetchSummaryByCollection = async () => {
      try {
        const response = await instance.get("/analytics/summary-by-collection");
        setCollectionsSummary(response.data);
      } catch (error) {
        console.error("Error fetching summary by collection:", error);
      }
    };
    const fetchVulnerabilityDistribution = async () => {
      try {
        const response = await instance.get("/analytics/vulnerabilities-distribution");
        // response.data will be something like:
        // [ { type: 'cors', count: 3}, { type: 'header', count: 5}, ... ]
        const rawData = response.data;

        // Optionally map the "type" to a more user-friendly label
        const labelMap = {
          cors: "CORS",
          header: "Header",
          sqli: "SQL Injection",
          bola: "BOLA",
          sensitive_info: "Sensitive Info",
        };

        // Convert to Recharts-friendly format: { name: string, value: number }
        const mappedData = rawData.map((item) => ({
          name: labelMap[item.type] || item.type,
          value: item.count,
        }));

        setVulnData(mappedData);
      } catch (error) {
        console.error("Error fetching vulnerability distribution:", error);
      }
    };

    // Call all data fetchers
    fetchAnalyticsOverview();
    fetchTrends();
    fetchTopEndpoints();
    fetchSummaryByCollection();
    fetchVulnerabilityDistribution();
  }, []);

  return (
    <Container
      maxWidth="xl"
      sx={{ py: 4, minHeight: "100vh" }}
    >
      <Typography variant="h4" sx={{ mb: 3, fontWeight: "bold" }}>
        Dashboard
      </Typography>

      {/* ============ ROW 1: High-level stats ============ */}
      <Grid container spacing={3}>
        {/* TOTAL USERS */}
        <Grid item xs={12} sm={6} md={3}>
          <Paper
            sx={{
              p: 3,
              borderRadius: 2,
              boxShadow: 2,
              "&:hover": { transform: "scale(1.03)", boxShadow: 4 },
              transition: "all 0.2s ease-in-out",
            }}
          >
            <Typography variant="h6" sx={{ color: "#666" }}>
              Total Users
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: "bold" }}>
              {overview.total_users}
            </Typography>
          </Paper>
        </Grid>

        {/* TOTAL COLLECTIONS */}
        <Grid item xs={12} sm={6} md={3}>
          <Paper
            sx={{
              p: 3,
              borderRadius: 2,
              boxShadow: 2,
              "&:hover": { transform: "scale(1.03)", boxShadow: 4 },
              transition: "all 0.2s ease-in-out",
            }}
          >
            <Typography variant="h6" sx={{ color: "#666" }}>
              Total Collections
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: "bold" }}>
              {overview.total_collections}
            </Typography>
          </Paper>
        </Grid>

        {/* TOTAL ASSESSMENTS */}
        <Grid item xs={12} sm={6} md={3}>
          <Paper
            sx={{
              p: 3,
              borderRadius: 2,
              boxShadow: 2,
              "&:hover": { transform: "scale(1.03)", boxShadow: 4 },
              transition: "all 0.2s ease-in-out",
            }}
          >
            <Typography variant="h6" sx={{ color: "#666" }}>
              Total Assessments
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: "bold" }}>
              {overview.total_assessments}
            </Typography>
          </Paper>
        </Grid>

        {/* TOTAL RESULTS */}
        <Grid item xs={12} sm={6} md={3}>
          <Paper
            sx={{
              p: 3,
              borderRadius: 2,
              boxShadow: 2,
              "&:hover": { transform: "scale(1.03)", boxShadow: 4 },
              transition: "all 0.2s ease-in-out",
            }}
          >
            <Typography variant="h6" sx={{ color: "#666" }}>
              Total Results
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: "bold" }}>
              {overview.total_results}
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* ============ ROW 2: Charts ============ */}
      <Grid container spacing={3} sx={{ mt: 1 }}>
        {/* Time-Series (Line Chart) */}
        <Grid item xs={12} md={8}>
          <Paper
            sx={{
              p: 3,
              borderRadius: 2,
              boxShadow: 2,
            }}
          >
            <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>
              Assessments Over Time
            </Typography>
            <Box sx={{ width: "100%", height: 300 }}>
              <ResponsiveContainer>
                <LineChart data={trendData} margin={{ top: 10, right: 20, bottom: 10, left: 0 }}>
                  <Line type="monotone" dataKey="count" stroke="#8884d8" strokeWidth={2} />
                  <CartesianGrid stroke="#ccc" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                </LineChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>

        {/* Pie Chart for Vulnerabilities Distribution */}
        <Grid item xs={12} md={4}>
          <Paper
            sx={{
              p: 3,
              borderRadius: 2,
              boxShadow: 2,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>
              Vulnerabilities Distribution
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={vulnData}
                  dataKey="value"
                  nameKey="name"
                  label={(entry) => entry.name}
                  outerRadius={80}
                  fill="#8884d8"
                >
                  {vulnData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>

      {/* ============ ROW 3: Tables / Collections, etc. ============ */}
      <Grid container spacing={3} sx={{ mt: 1 }}>
        {/* Top Endpoints Table */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, borderRadius: 2, boxShadow: 2 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>
              Top Endpoints
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: "bold" }}>Endpoint</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>Tests Count</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {topEndpoints.map((item, idx) => (
                    <TableRow key={idx}>
                      <TableCell>{item.endpoint}</TableCell>
                      <TableCell>{item.tests_count}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>

        {/* Collections Summary Table */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, borderRadius: 2, boxShadow: 2 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>
              Collections Summary
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: "bold" }}>Collection</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>API Endpoints</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>Total Tests</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {collectionsSummary.map((col, idx) => (
                    <TableRow key={idx}>
                      <TableCell>{col.collection_name}</TableCell>
                      <TableCell>{col.api_endpoints}</TableCell>
                      <TableCell>{col.total_tests}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>

      {/* ============ ROW 4: Your existing Collections component ============ */}
      <Grid container spacing={3} sx={{ mt: 2 }}>
        <Grid item xs={12}>
          <Collections />
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard;
