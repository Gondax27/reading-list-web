import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import BookCoverImage, { PLACEHOLDER_COVER } from '@/components/BookCoverImage';

describe('BookCoverImage Component', () => {
  it('renders image and handles load transition', () => {
    render(
      <BookCoverImage src='https://covers.openlibrary.org/b/id/123-M.jpg' alt='Portada de prueba' />
    );

    const img = screen.getByAltText('Portada de prueba') as HTMLImageElement;
    expect(img).toBeInTheDocument();
    expect(img.src).toBe('https://covers.openlibrary.org/b/id/123-M.jpg');

    fireEvent.load(img);
    expect(img).toHaveClass('opacity-100');
  });

  it('handles image error and switches to placeholder', () => {
    render(<BookCoverImage src='https://invalid-url.com/broken.jpg' alt='Portada rota' />);

    const img = screen.getByAltText('Portada rota') as HTMLImageElement;
    fireEvent.error(img);

    expect(img.src).toBe(PLACEHOLDER_COVER);
  });
});
