import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { setTheme } from '@/store/theme-slice';
import clsx from 'clsx';

export default function ToggleThemeIcon() {
  const dispatch = useDispatch();
  const isDarkTheme = useSelector((state: RootState) => state.theme.isDarkTheme);

  const toggleTheme = () => {
    dispatch(setTheme(!isDarkTheme));
  }

  return (
    <button
      title="Toggle Theme"
      className={clsx(
        'p-1.5 rounded border-1 hover:border-gray-400',
        {
          'bg-[#3c3c3c] border-[#3c3c3c]': isDarkTheme,
          'bg-white border-gray-300': !isDarkTheme
        }
      )}
      onClick={toggleTheme}
    >
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="size-4">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z" />
      </svg>
    </button>
  );
}