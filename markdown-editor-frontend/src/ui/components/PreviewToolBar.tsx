import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import clsx from 'clsx';

export default function PreviewToolBar() {
  const isDarkTheme = useSelector((state: RootState) => state.theme.isDarkTheme);
  return <div className={clsx(
    'h-[40px] border-b-1 flex items-center',
    {
      'border-[#3c3c3c]': isDarkTheme,
      'border-[#d4d4d4]': !isDarkTheme
    }
  )}>
    <div className="pl-4">
        <div className="text-sm">Preview</div>
      </div>
  </div>;
}