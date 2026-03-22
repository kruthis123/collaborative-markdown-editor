import { useEffect, useRef, useState } from 'react';
import clsx from 'clsx';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';

export interface ProfileIconProps {
  userName?: string | null;
  userEmail?: string | null;
}

export default function ProfileIcon({ userName, userEmail }: Readonly<ProfileIconProps>) {
  const [showDropdown, setShowDropdown] = useState(false);
  const isDarkTheme = useSelector((state: RootState) => state.theme.isDarkTheme);
  const currentUser = useSelector((state: RootState) => state.user);
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
    <div className="pr-2">
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setShowDropdown(!showDropdown)}
          className="transition-opacity hover:opacity-80"
          title="Profile"
        >
          <div
            className="w-8 h-8 rounded-full border-2 border-white flex items-center justify-center text-white font-semibold text-sm cursor-pointer"
            style={{ backgroundColor: currentUser.color }}
          >
            {userName?.charAt(0).toUpperCase() || 'U'}
          </div>
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
  );
}