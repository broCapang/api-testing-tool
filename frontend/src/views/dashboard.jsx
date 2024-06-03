import React from 'react';
import { Container, Grid, Paper, Typography } from '@mui/material';
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
  return (
    <Container maxWidth="lg" className="py-20">
      <Grid container spacing={4}>
        <Grid item xs={12} sm={6} md={4}>
          <Paper className="p-6 rounded-lg shadow-lg bg-white">
            <Typography variant="h6" className="mb-2 text-gray-800">
              Number of API Endpoints
            </Typography>
            <Typography variant="h4" className="text-gray-900">
              236
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Paper className="p-6 rounded-lg shadow-lg bg-white">
            <Typography variant="h6" className="mb-2 text-gray-800">
              Test runs
            </Typography>
            <Typography variant="h4" className="text-gray-900">
              32
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Paper className="p-6 rounded-lg shadow-lg bg-white">
            <Typography variant="h6" className="mb-2 text-gray-800">
              Test runs this months
            </Typography>
            <Typography variant="h4" className="text-gray-900">
              3
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={8}>
          <Paper className="p-6 rounded-lg shadow-lg bg-white">
            <Typography variant="h6" className="mb-4 text-gray-800">
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
        <Grid item xs={12} md={4}>
          <Paper className="p-6 rounded-lg shadow-lg bg-white">
            <Typography variant="h6" align='center' className="mb-4 text-gray-800">
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
        <Grid item xs={12} md={16}>
        <Paper className="p-6 rounded-lg shadow-lg bg-white">
          <Typography variant="h6" className="mb-4 text-gray-800">
            Security Test Cases
          </Typography>
          < TestList />
        </Paper>
        </Grid>
        
      </Grid>
    </Container>
  );
};

export default Dashboard;
