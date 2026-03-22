'use client';

import React, { useState } from 'react';

interface ImageWithFallbackProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallbackSrc?: string;
}

export function ImageWithFallback({
  src,
  alt,
  className,
  fallbackSrc,
  ...props
}: ImageWithFallbackProps) {
  const [error, setError] = useState(false);

  const fallback = fallbackSrc || `https://placehold.co/600x400/FFF7ED/F97316?text=${encodeURIComponent(alt || 'MealMind')}`;

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={error ? fallback : src}
      alt={alt || ''}
      className={className}
      onError={() => setError(true)}
      {...props}
    />
  );
}
