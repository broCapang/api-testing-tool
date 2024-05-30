import React from 'react';

function Header () {
    return (
        <header>
            <nav class="bg-white dark:bg-gray-900 fixed w-full z-20 top-0 start-0 border-b border-gray-200 dark:border-gray-600">
                <div class="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
                    <a class="flex items-center space-x-3 rtl:space-x-reverse">
                        <img src="https://gravatar.com/userimage/237902374/d690a94093196f2dfb40ce0dc63d32e8.jpeg?size=256" class="h-8" alt="Me"/>
                            <span class="self-center text-2xl font-semibold whitespace-nowrap text-white">DataShield</span>
                    </a>
                    
                    <div class="items-center justify-between hidden w-full md:flex md:w-auto md:order-1" id="navbar-sticky">
                        <ul class="flex flex-col p-4 md:p-0 mt-4 font-medium border border-gray-100 rounded-lg bg-gray-50 md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-gray-900">
                            <li>
                                <a href="#" class="block py-2 px-3 rounded md:hover:bg-transparent md:hover:text-blue-700 md:p-0 md:dark:hover:text-blue-500 text-white hover:bg-gray-700 hover:text-white border-gray-700 " aria-current="page">Dashboard</a>
                            </li>
                            <li>
                                <a href="#" class="block py-2 px-3 rounded md:hover:bg-transparent md:hover:text-blue-700 md:p-0 md:dark:hover:text-blue-500 text-white hover:bg-gray-700 hover:text-white border-gray-700" aria-current="page">Profile</a>
                            </li>
                            <li>
                                <a href="#" class="block py-2 px-3 rounded md:hover:bg-transparent md:hover:text-blue-700 md:p-0 md:dark:hover:text-blue-500 text-white hover:bg-gray-700 hover:text-white border-gray-700" aria-current="page">Testing</a>
                            </li>
                        </ul>
                    </div>
                    <div class="flex md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
                        <button type="button" class="text-white font-medium rounded-lg text-sm px-4 py-2 text-center bg-blue-600 hover:bg-blue-700 focus:ring-blue-800">Login</button>
                    </div>
                </div>
            </nav>
        </header>
    );
};

export default Header;