'use client';

import { useState, useRef, useEffect } from 'react';
import ToggleThemeIcon from "./icons/ToggleThemeIcon";
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import clsx from 'clsx';

interface AuthenticatedNavbarProps {
  userName?: string | null;
  userEmail?: string | null;
}

export default function AuthenticatedNavbar({ userName, userEmail }: AuthenticatedNavbarProps) {
  const isDarkTheme = useSelector((state: RootState) => state.theme.isDarkTheme);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <nav className={clsx(
      'h-[50px] border-b-1 flex items-center justify-between px-6',
      {
        'bg-[#1e1e1e] border-[#3c3c3c]': isDarkTheme,
        'bg-white border-[#d4d4d4]': !isDarkTheme
      }
    )}>
      <div className="flex items-center gap-4">
        <h1 className={clsx(
          'text-xl font-bold',
          {
            'text-white': isDarkTheme,
            'text-gray-900': !isDarkTheme
          }
        )}>
          Collaborative Markdown Editor
        </h1>
      </div>

      <div className="flex items-center gap-3">
        <ToggleThemeIcon />
        
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className={clsx(
              'p-2 rounded-lg transition-colors',
              {
                'hover:bg-gray-700': isDarkTheme,
                'hover:bg-gray-100': !isDarkTheme
              }
            )}
            title="Profile"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="size-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
            </svg>
          </button>

          {showDropdown && (
            <div className={clsx(
              'absolute right-0 mt-2 w-64 rounded-lg shadow-lg py-2 z-50',
              {
                'bg-gray-800 border border-gray-700': isDarkTheme,
                'bg-white border border-gray-200': !isDarkTheme
              }
            )}>
              <div className="px-4 py-3 border-b border-gray-700 dark:border-gray-700">
                <p className={clsx(
                  'text-sm font-semibold',
                  {
                    'text-white': isDarkTheme,
                    'text-gray-900': !isDarkTheme
                  }
                )}>
                  {userName || 'User'}
                </p>
                <p className={clsx(
                  'text-xs mt-1',
                  {
                    'text-gray-400': isDarkTheme,
                    'text-gray-500': !isDarkTheme
                  }
                )}>
                  {userEmail || 'No email'}
                </p>
              </div>
              
              <button
                className={clsx(
                  'w-full text-left px-4 py-2 text-sm transition-colors',
                  {
                    'text-gray-300 hover:bg-gray-700': isDarkTheme,
                    'text-gray-700 hover:bg-gray-100': !isDarkTheme
                  }
                )}
                onClick={() => {
                  // Handle logout
                  window.location.href = '/login';
                }}
              >
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
