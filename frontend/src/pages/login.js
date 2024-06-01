// Desc: Login page for the user to login to the application
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = ({ setToken }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();


  const handleSubmit = async (event) => {
      event.preventDefault();

      const response = await fetch('http://localhost:8000/token', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: new URLSearchParams({
              username,
              password,
          }),
      });

      const data = await response.json();

      if (response.ok) {
          setToken= data.access_token;
          localStorage.setItem('access_token', data.access_token);  // Store token in local storage
          navigate('/'); // Redirect to the home page

      } else {
          alert(data.detail || 'Login failed');
      }
  };


  return (

    <div class="flex items-center justify-center h-screen">
      <div class="bg-white dark:bg-gray-800 shadow-lg rounded-lg w-96 p-6">
        <h2 class="text-2xl font-semibold text-gray-800 dark:text-white text-center">Login</h2>
        <form class="mt-6" onSubmit={handleSubmit}>
          <div>
            <label for="username" class="block text-xs font-semibold text-gray-600 uppercase">Username</label>
            <input id="username" type="username" name="username" placeholder="
            username" autocomplete="username" value={username} onChange={(e) => setUsername(e.target.value)} class="block w-full border-none bg-gray-100 h-8 px-2 rounded-lg focus:outline-none focus:bg-white mt-2" required />
          </div>
          <div class="mt-4">
            <label for="password" class="block text-xs font-semibold text-gray-600 uppercase">Password</label>
            <input id="password" type="password" name="password" placeholder="password" autocomplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} class="block w-full border-none bg-gray-100 h-8 px-2 rounded-lg focus:outline-none focus:bg-white mt-2" required />
          </div>
          <div class="text-right mt-2">
            {/* <a href="#" class="text-xs font-semibold text-gray-600 hover:text-blue-600 dark:text-blue-400">Forgot Password?</a> */}
          </div>
          <button type="submit" class="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-500 text-white uppercase text-lg font-semibold p-2 rounded-lg">Login</button>
        </form>
        <div class="mt-4 flex items-center justify-between">
          <span class="border-b w-1/5 lg:w-1/4"></span>
          <span class="text-xs text-center text-gray-500 uppercase">Login into DataShield</span>
          <span class="border-b w-1/5 lg:w-1/4"></span>
        </div>
        <p class="mt-8 text-xs text-center font-semibold text-gray-600">Don't have an account? <a href="#" class="text-blue-500 hover:text-blue-600 dark:text-blue-400">Register</a></p>
      </div>
    </div>
  );
}

export default Login;