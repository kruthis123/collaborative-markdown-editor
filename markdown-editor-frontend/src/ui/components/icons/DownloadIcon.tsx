import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';

interface DownloadIconProps {
  fileName?: string;
}

export default function DownloadIcon({ fileName = 'Untitled.md' }: DownloadIconProps) {
  const markdown = useSelector((state: RootState) => state.markdown.content);

  const handleDownload = () => {
    // Create a blob with the markdown content
    const blob = new Blob([markdown], { type: 'text/markdown' });
    
    // Create a URL for the blob
    const url = URL.createObjectURL(blob);
    
    // Create a temporary anchor element
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    
    // Append to the document, click, and remove
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Clean up the URL
    URL.revokeObjectURL(url);
  };

  return (
    <button title="Download" className="p-1.5 rounded hover:bg-gray-100" onClick={handleDownload}>
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="size-4">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
      </svg>
    </button>
  );
}
