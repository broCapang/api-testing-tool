import React from 'react';
import { Container, Grid, Paper, Typography } from '@mui/material';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, Legend } from 'recharts';
import Collections from '../components/collections/Collections';

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
  return (
    <Container maxWidth="lg" sx={{ py: 10 }} className='h-screen items-center justify-center'>
      <Grid container spacing={4}>
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
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', background: '#f9f9f9', borderRadius: 2 }}>
            <Typography variant="h6" align="center" sx={{ mb: 2, color: '#333' }}>
              Percentage Vulnerability Types
            </Typography>
            <PieChart width={300} height={300}>
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
        </Grid>

        {/* Collections List */}
        <Grid item xs={12}>

          <Collections />
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard;
