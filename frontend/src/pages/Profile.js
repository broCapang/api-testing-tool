import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

// Desc: Profile page for the user to view their profile
// it will show something like this:
//   "username": "irfan",
//   "email": "irfan@example.com",
//   "full_name": null,
//   "id": 6,

const Profile = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [fullname, setFullname] = useState('');
    const [password, setPassword] = useState('');

    const navigate = useNavigate();

    useEffect(() => {
        const fetchProfile = async () => {
            const storedToken = localStorage.getItem('access_token');
            if (!storedToken) {
                navigate('/login');
                return;
            }
            try {
                const response = await fetch('http://localhost:8000/user/profile/', {
                    headers: {
                        'Authorization': `Bearer ${storedToken}`,
                    },
                });
                if (!response.ok) {
                    throw new Error('Token verification failed');
                }
                response.json().then(data => {
                    setUsername(data.username);
                    setEmail(data.email);
                    if (data.full_name){
                        setFullname(data.full_name);
                    }
                    console.log(data);
                });
            } catch (error) {
                localStorage.removeItem('access_token');
                navigate('/login');
            }
        }
        fetchProfile();
    }, [navigate, username, email, fullname, password]);

    return (
        <div className="flex items-center justify-center h-screen">
            <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg w-96 p-6">
                <h2 className="text-2xl font-semibold text-gray-800 dark:text-white text-center">Profile</h2>
                <form className="mt-6">
                    <div>
                        <label htmlFor="username" className="block text-xs font-semibold text-gray-600 uppercase">Username</label>
                        <input id="username" type="username" name="username" placeholder="username" autoComplete="username" value={username} className="block w-full border-none bg-gray-100 h-8 px-2 rounded-lg focus:outline-none focus:bg-white mt-2" required />
                    </div>
                    <div className="mt-4">
                        <label htmlFor="email" className="block text-xs font-semibold text-gray-600 uppercase">Email</label>
                        <input id="email" type="email" name="email" placeholder={email} autoComplete="email" value={email} className="block w-full border-none bg-gray-100 h-8 px-2 rounded-lg focus:outline-none focus:bg-white mt-2" required />
                    </div>
                    <div className="mt-4">
                        <label htmlFor="fullname" className="block text-xs font-semibold text-gray-600 uppercase">Fullname</label>
                        <input id="fullname" type="fullname" name="fullname" placeholder="fullname" autoComplete="fullname" value={fullname} className="block w-full border-none bg-gray-100 h-20 px-2 rounded-lg focus:outline-none focus:bg-white mt-2" required />
                    </div>
                    <div className="mt-4">
                        <label htmlFor="password" className="block text-xs font-semibold text-gray-600 uppercase">Password</label>
                        <input id="password" type="password" name="password" placeholder="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} className="block w-full border-none bg-gray-100 h-8 px-2 rounded-lg focus:outline-none focus:bg-white mt-2" required />
                    </div>
                    <button type="submit" className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-500 text-white uppercase text-lg font-semibold p-2 rounded-lg mt-4">Update</button>
                </form>
            </div>
        </div>
    );



}

export default Profile;

            
