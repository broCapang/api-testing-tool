


// This component is used to display the list of tests in the dashboard
// It is used in the dashboard component
// It will fetch endpoint /security/security_test_cases/
// The response will be a list of tests  id |      name       |             description              |   payload
// It will display the list of tests in a table


import React ,{ useState, useEffect} from 'react';
import { Link } from 'react-router-dom';
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';


import AuthWrapper from '../auth/authWrapper';
import AddTest from '../../pages/AddTest';

const TestList = () => {
    const [tests, setTests] = useState([]);
    const [openRows, setOpenRows] = useState({});
    

    useEffect(() => {
        const fetchTests = async () => {
            const storedToken = localStorage.getItem('access_token');
            try {
                const response = await fetch('http://localhost:8000/security/security_test_cases/',{
                    headers: {
                        'Authorization': `Bearer ${storedToken}`,
                    },
                });
                console.log(response);
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
    }, []);

    const handleExpandClick = (id) => {
        setOpenRows((prevOpenRows) => ({
            ...prevOpenRows,
            [id]: !prevOpenRows[id],
        }));
    };

    return (
        <div>
        
        <Box >
        
        <TableContainer component={Paper}>
            <Table>
                <TableHead>
                    <TableRow >
                        <TableCell />
                        <TableCell >ID</TableCell>
                        <TableCell>Name</TableCell>
                        <TableCell>Description</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {tests.map((test) => (
                        <React.Fragment key={test.id}>
                            <TableRow>
                                <TableCell>
                                    <IconButton
                                        aria-label="expand row"
                                        size="medium"
                                        onClick={() => handleExpandClick(test.id)}
                                    >
                                        {openRows[test.id] ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                                    </IconButton>
                                </TableCell>
                                <TableCell component="th" scope="row">
                                    {test.id}
                                </TableCell>
                                <TableCell>{test.name}</TableCell>
                                <TableCell>{test.description}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                                    <Collapse in={openRows[test.id]} timeout="auto" unmountOnExit>
                                        <Box sx={{ margin: 1 }}>
                                            <Typography variant="body1">
                                                <strong>Description:</strong> {test.description}
                                            </Typography>
                                            <Typography variant="body1">
                                                <strong>Test Case:</strong> <pre className="bg-gray-200 p-2 rounded">{test.payload}</pre>
                                            </Typography>
                                        </Box>
                                    </Collapse>
                                </TableCell>
                            </TableRow>
                        </React.Fragment>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
        <div className='grid justify-center grid-cols-2 gap-4'>
        <Link to='/addTest' className='block w-full mt-6 p-3 bg-blue-600 text-white text-center rounded-lg hover:bg-blue-700 transition duration-150'>
            Add Test
        </Link>
        <Link to='/runTest' className='block w-full mt-6 p-3 bg-blue-600 text-white text-center rounded-lg hover:bg-blue-700 transition duration-150'>
            Run Test
        </Link>
        </div>
    </Box>
        
    </div>
    );
}

export default TestList;