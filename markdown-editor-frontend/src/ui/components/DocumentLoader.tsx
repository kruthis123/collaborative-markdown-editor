'use client';

import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { loadDocument, setClientId } from '@/store/markdown-slice';

interface DocumentLoaderProps {
  content: string;
  userId: string;
}

export default function DocumentLoader({ content, userId }: Readonly<DocumentLoaderProps>) {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(loadDocument({ content }));
    dispatch(setClientId(userId));
  }, [content, userId, dispatch]);

  return null;
}
