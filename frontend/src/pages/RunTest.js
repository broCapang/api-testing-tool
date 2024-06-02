// in this page, user will add an URL to test
// user will choose the test type
// the page will run into endpoint /security/runTest/{security_test_case_id}
// the test type will only show name and description and pick using radio button


import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import AuthWrapper from '../components/auth/authWrapper';
import { useParams } from 'react-router-dom';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';

const RunTest = () => {
    const [url, setUrl] = useState('URL');
    const navigate = useNavigate();
    const { id } = useParams();
    const [tests, setTests] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const [selectedTest, setSelectedTest] = useState(null);


    const storedToken = localStorage.getItem('access_token');
    
    useEffect(() => {
        const fetchTests = async () => {
            
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
                    console.log(data);
                } else {
                    console.error('Unexpected response format:', data);
                }
            } catch (error) {
                console.error('Fetching tests failed:', error);
            }
        };

        fetchTests();
    }, []);

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
            console.log(id, url);
            if (!response.ok) {
                console.log(response)
                throw new Error('Token verification failed');
            }
            response.json().then(data => {
                console.log(data);
                alert('Test ran successfully');
            });
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <div className="flex items-center justify-center min-h-screen px-4 bg-gray-100 dark:bg-gray-900">
            <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg max-w-md w-full p-6">
                <h2 className="text-2xl font-semibold text-gray-800 dark:text-white text-center">Run Test</h2>
                <form className="mt-6" onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="url" className="block text-sm font-semibold text-gray-600 uppercase">URL</label>
                        <input id="url" type="url" name="url" placeholder="URL" autoComplete="url" value={url} onChange={(e) => setUrl(e.target.value)} className="block w-full border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-700 dark:text-white h-10 px-3 rounded-lg focus:outline-none focus:bg-white focus:dark:bg-gray-600 mt-2" required />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-semibold text-gray-600 uppercase">Test Type</label>
                        {tests.map((test) => (
                            <div key={test.id} className="flex items-center mt-2">
                                <input type="radio" id={`test-${test.id}`} name="test" value={test.id} onChange={() => setSelectedTest(test.id)} className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300" required />
                                <label htmlFor={`test-${test.id}`} className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                                    <strong>{test.name}</strong>: {test.description}
                                </label>
                            </div>
                        ))}
                    </div>
                    <button type="submit" className="w-full bg-blue-500 hover:bg-blue-600 text-white uppercase text-lg font-semibold p-3 rounded-lg mt-4 transition duration-200">Run Test</button>
                </form>
            </div>
        </div>
    );
}

export default RunTest;
