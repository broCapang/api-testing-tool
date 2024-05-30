

import react from 'react';

function Login() {
    return (

        <div class="flex items-center justify-center h-screen">
        <div class="bg-white dark:bg-gray-800 shadow-lg rounded-lg w-96 p-6">
          <h2 class="text-2xl font-semibold text-gray-800 dark:text-white text-center">Login</h2>
          <form class="mt-6">
            <div>
              <label for="email" class="block text-xs font-semibold text-gray-600 uppercase">E-mail</label>
              <input id="email" type="email" name="email" placeholder="
              e-mail" autocomplete="email" class="block w-full border-none bg-gray-100 h-8 px-2 rounded-lg focus:outline-none focus:bg-white mt-2" required />
            </div>
            <div class="mt-4">
              <label for="password" class="block text-xs font-semibold text-gray-600 uppercase">Password</label>
              <input id="password" type="password" name="password" placeholder="password" autocomplete="current-password" class="block w-full border-none bg-gray-100 h-8 px-2 rounded-lg focus:outline-none focus:bg-white mt-2" required />
            </div>
            <div class="text-right mt-2">
              <a href="#" class="text-xs font-semibold text-gray-600 hover:text-blue-600 dark:text-blue-400">Forgot Password?</a>
            </div>
            <button type="submit" class="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-500 text-white uppercase text-lg font-semibold p-2 rounded-lg">Login</button>
          </form>
          <div class="mt-4 flex items-center justify-between">
            <span class="border-b w-1/5 lg:w-1/4"></span>
            <a href="#" class="text-xs text-center text-gray-500 uppercase dark:text-gray-400 hover:underline">or login with</a>
            <span class="border-b w-1/5 lg:w-1/4"></span>
          </div>
          <div class="mt-4 grid grid-cols-2 gap-2">
            <div>
              <button type="button" class="w-full bg-blue-900 hover:bg-blue-800 text-white p-2 rounded-lg flex items-center justify-center">
                <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                </svg>
              </button>
            </div>
            <div>
              <button type="button" class="w-full bg-blue-700 hover:bg-blue-600 text-white p-2 rounded-lg flex items-center justify-center">
                <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                </svg>
              </button>
            </div>
          </div>
          <p class="mt-8 text-xs text-center font-semibold text-gray-600">Don't have an account? <a href="#" class="text-blue-500 hover:text-blue-600 dark:text-blue-400">Register</a></p>
        </div>
      </div>
    );
}

export default Login;