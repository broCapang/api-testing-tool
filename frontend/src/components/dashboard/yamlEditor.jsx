import React, { useState, useEffect, useRef } from 'react';
import yaml from 'js-yaml';

function YamlEditor() {
    const [name, setName] = useState('Type of test case data');
    const [desc, setDesc] = useState('Description of test case data');
    const [yamlData, setYamlData] = useState('Test case data data in YAML');
    const textareaRef = useRef(null);

    const handleNameChange = (e) => {
        setName(e.target.value);
    };

    const handleYamlDataChange = (e) => {
        setYamlData(e.target.value);
    };

    const handleDescChange = (e) => {
        setDesc(e.target.value);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const storedToken = localStorage.getItem('access_token');
        try {
            const response = await fetch('http://localhost:8000/security/create/',{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${storedToken}`,
                },
                body: JSON.stringify({
                    name: name,
                    description: desc,
                    payload: yamlData,
                }),
            });
            console.log(JSON.stringify({
                name: name,
                description: desc,
                payload: yamlData,
            }));
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            if (response.status === 201) {
                alert('Test case data created successfully');
            }
        } catch (error) {
            console.error('Fetching tests failed:', error);
        }
    };

    const handleKeyDown = (e) => {
        if (e.keyCode === 9) { // tab was pressed
            e.preventDefault();

            // get caret position/selection
            const start = textareaRef.current.selectionStart;
            const end = textareaRef.current.selectionEnd;

            // set textarea value to: text before caret + tab + text after caret
            setYamlData((prevYamlData) => 
                prevYamlData.substring(0, start) + "\t" + prevYamlData.substring(end)
            );

            // put caret at right position again (add one for the tab)
            setTimeout(() => {
                textareaRef.current.selectionStart = textareaRef.current.selectionEnd = start + 1;
            }, 0);
        }
    };

    useEffect(() => {
        console.log(yamlData);
    }, [name, yamlData]);

    return (
        <div className="max-w-screen-lg m-auto p-4 py-10">
            <h1 className="text-center text-2xl font-bold mb-4 text-white">Edit YAML Data</h1>
            <form className="w-full max-w-lg m-auto" onSubmit={handleSubmit}>
            <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                    Name
                </label>
                <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={handleNameChange}
                    placeholder="Name"
                    className="w-full p-2 border border-gray-300 rounded-lg"
                />
            </div>
            <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                    Description
                </label>
                <input
                    id="desc"
                    type="text"
                    value={desc}
                    onChange={handleDescChange}
                    placeholder="Description"
                    className="w-full p-2 border border-gray-300 rounded-lg"
                />
            </div>
            <div>
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="yamlData">
                    YAML Data
                </label>
                <textarea
                    id="yamlData"
                    value={yamlData}
                    onChange={handleYamlDataChange}
                    onKeyDown={handleKeyDown}
                    ref={textareaRef}
                    rows="20"
                    cols="80"
                    className="w-full p-2 border border-gray-300 rounded-lg"
                />
            </div>
            <button type="submit" className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-500 text-white uppercase text-lg font-semibold p-2 rounded-lg mt-4">Add Test</button>
            </form>
        </div>
    );
};

export default YamlEditor;
