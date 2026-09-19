import React, { useState, useEffect, useRef } from 'react';
import { NavLink } from 'react-router-dom';
import { FaBars, FaTimes, FaChevronDown } from 'react-icons/fa';

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);
    const mobileMenuRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
            if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target) && !event.target.closest('button[aria-label="Toggle menu"]')) {
                setIsMenuOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 768) {
                setIsMenuOpen(false);
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleKeyDown = (event) => {
        if (event.key === 'Escape') {
            setIsMenuOpen(false);
            setIsDropdownOpen(false);
        }
    };

    const toggleMenu = () => setIsMenuOpen(prev => !prev);
    const toggleDropdown = () => setIsDropdownOpen(prev => !prev);

    const navLinkClass = ({ isActive }) => 
        `block px-4 py-2 text-base transition-colors duration-200 hover:text-steelBlue ${
            isActive ? 'text-steelBlue font-semibold' : 'text-darkCharcoal'
        }`;

    const dropdownLinkClass = ({ isActive }) =>
        `block px-4 py-2 text-base transition-colors duration-200 hover:bg-gray-100 ${
            isActive ? 'text-steelBlue font-semibold bg-gray-50' : 'text-darkCharcoal'
        }`;

    return (
        <header className="bg-white shadow-md font-primary fixed top-0 left-0 w-full z-50">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <div className="flex-shrink-0">
                        <h1 className="text-2xl md:text-3xl font-bold text-darkCharcoal">
                            DOHS
                        </h1>
                    </div>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center space-x-8">
                        <NavLink to="/" className={navLinkClass}>
                            Home
                        </NavLink>
                        <NavLink to="/about" className={navLinkClass}>
                            About
                        </NavLink>
                        <NavLink to="/surveillance" className={navLinkClass}>
                            Surveillance Data
                        </NavLink>
                        
                        {/* Desktop Dropdown */}
                        <div className="relative" ref={dropdownRef}>
                            <button
                                onClick={toggleDropdown}
                                onKeyDown={handleKeyDown}
                                className="flex items-center px-4 py-2 text-base text-darkCharcoal hover:text-steelBlue transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-steelBlue focus:ring-offset-2 rounded-md"
                                aria-expanded={isDropdownOpen}
                                aria-haspopup="true"
                            >
                                Report
                                <FaChevronDown 
                                    className={`ml-1 h-3 w-3 transition-transform duration-200 ${
                                        isDropdownOpen ? 'rotate-180' : ''
                                    }`} 
                                />
                            </button>
                            
                            {isDropdownOpen && (
                                <div className="absolute left-0 mt-2 w-64 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                    <div className="py-1">
                                        <NavLink 
                                            to="/report-env-inc" 
                                            className={dropdownLinkClass}
                                            onClick={() => setIsDropdownOpen(false)}
                                        >
                                            Environmental Inclusiveness
                                        </NavLink>
                                        <NavLink 
                                            to="/report-dis-cas" 
                                            className={dropdownLinkClass}
                                            onClick={() => setIsDropdownOpen(false)}
                                        >
                                            Disease Cases
                                        </NavLink>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Login Button */}
                        <NavLink 
                            to="/login" 
                            className="bg-turquoiseBlue text-white px-6 py-2 rounded-full font-medium transition-colors duration-200 hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-turquoiseBlue focus:ring-offset-2"
                        >
                            Login
                        </NavLink>
                    </nav>

                    {/* Mobile menu button */}
                    <button
                        onClick={toggleMenu}
                        onKeyDown={handleKeyDown}
                        className="md:hidden p-2 rounded-md text-darkCharcoal hover:text-steelBlue hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-steelBlue focus:ring-offset-2 transition-colors duration-200"
                        aria-expanded={isMenuOpen}
                        aria-label="Toggle menu"
                    >
                        {isMenuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
                    </button>
                </div>

                {/* Mobile Navigation */}
                {isMenuOpen && (
                    <div 
                        ref={mobileMenuRef}
                        className="md:hidden border-t border-gray-200 bg-white"
                    >
                        <div className="px-2 pt-2 pb-3 space-y-1">
                            <NavLink 
                                to="/" 
                                className={({ isActive }) => 
                                    `block px-3 py-2 text-base font-medium rounded-md transition-colors duration-200 ${
                                        isActive 
                                            ? 'text-steelBlue bg-gray-50' 
                                            : 'text-darkCharcoal hover:text-steelBlue hover:bg-gray-50'
                                    }`
                                }
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Home
                            </NavLink>
                            <NavLink 
                                to="/about" 
                                className={({ isActive }) => 
                                    `block px-3 py-2 text-base font-medium rounded-md transition-colors duration-200 ${
                                        isActive 
                                            ? 'text-steelBlue bg-gray-50' 
                                            : 'text-darkCharcoal hover:text-steelBlue hover:bg-gray-50'
                                    }`
                                }
                                onClick={() => setIsMenuOpen(false)}
                            >
                                About
                            </NavLink>
                            <NavLink 
                                to="/surveillance" 
                                className={({ isActive }) => 
                                    `block px-3 py-2 text-base font-medium rounded-md transition-colors duration-200 ${
                                        isActive 
                                            ? 'text-steelBlue bg-gray-50' 
                                            : 'text-darkCharcoal hover:text-steelBlue hover:bg-gray-50'
                                    }`
                                }
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Surveillance Data
                            </NavLink>
                            
                            {/* Mobile Dropdown */}
                            <div className="px-3 py-2">
                                <button
                                    onClick={toggleDropdown}
                                    className="flex items-center justify-between w-full text-left text-base font-medium text-darkCharcoal hover:text-steelBlue transition-colors duration-200 focus:outline-none"
                                    aria-expanded={isDropdownOpen}
                                >
                                    Report
                                    <FaChevronDown 
                                        className={`h-3 w-3 transition-transform duration-200 ${
                                            isDropdownOpen ? 'rotate-180' : ''
                                        }`} 
                                    />
                                </button>
                                
                                {isDropdownOpen && (
                                    <div className="mt-2 pl-4 space-y-1">
                                        <NavLink 
                                            to="/report-env-inc" 
                                            className={({ isActive }) => 
                                                `block px-3 py-2 text-sm rounded-md transition-colors duration-200 ${
                                                    isActive 
                                                        ? 'text-steelBlue bg-gray-50' 
                                                        : 'text-darkCharcoal hover:text-steelBlue hover:bg-gray-50'
                                                }`
                                            }
                                            onClick={() => {
                                                setIsMenuOpen(false);
                                                setIsDropdownOpen(false);
                                            }}
                                        >
                                            Environmental Inclusiveness
                                        </NavLink>
                                        <NavLink 
                                            to="/report-dis-cas" 
                                            className={({ isActive }) => 
                                                `block px-3 py-2 text-sm rounded-md transition-colors duration-200 ${
                                                    isActive 
                                                        ? 'text-steelBlue bg-gray-50' 
                                                        : 'text-darkCharcoal hover:text-steelBlue hover:bg-gray-50'
                                                }`
                                            }
                                            onClick={() => {
                                                setIsMenuOpen(false);
                                                setIsDropdownOpen(false);
                                            }}
                                        >
                                            Disease Cases
                                        </NavLink>
                                    </div>
                                )}
                            </div>

                            {/* Mobile Login Button */}
                            <div className="px-3 pt-4">
                                <NavLink 
                                    to="/login" 
                                    className="block w-full text-center bg-turquoiseBlue text-white px-6 py-3 rounded-full font-medium transition-colors duration-200 hover:bg-opacity-90"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    Login
                                </NavLink>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </header>
    );
};

export default Navbar;