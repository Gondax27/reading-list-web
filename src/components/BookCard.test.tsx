import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import BookCard from '@/components/BookCard';
import { TooltipProvider } from '@/components/ui/tooltip';
import type { Book } from '@/types/library';

const mockBook: Book = {
  title: 'El Señor de los Anillos',
  pages: 1200,
  genre: 'Fantasía',
  cover: 'https://covers.openlibrary.org/b/id/123-M.jpg',
  synopsis: 'Una aventura épica en la Tierra Media.',
  year: 1954,
  ISBN: '9780261102385',
  author: {
    name: 'J.R.R. Tolkien',
    otherBooks: ['El Hobbit', 'El Silmarillion'],
  },
};

const renderWithProviders = (ui: React.ReactElement) => {
  return render(<TooltipProvider>{ui}</TooltipProvider>);
};

describe('BookCard Component', () => {
  it('renders book information correctly', () => {
    const handleChangeBook = vi.fn();

    renderWithProviders(
      <BookCard book={mockBook} type='available-list' idx={0} handleChangeBook={handleChangeBook} />
    );

    expect(screen.getByText('El Señor de los Anillos')).toBeInTheDocument();
    expect(screen.getByText('J.R.R. Tolkien')).toBeInTheDocument();
    expect(screen.getByText('Fantasía')).toBeInTheDocument();
    expect(screen.getByText('1954')).toBeInTheDocument();
    expect(screen.getByText('Una aventura épica en la Tierra Media.')).toBeInTheDocument();
  });

  it('calls handleChangeBook when clicking "Añadir" in available-list mode', () => {
    const handleChangeBook = vi.fn();

    renderWithProviders(
      <BookCard book={mockBook} type='available-list' idx={0} handleChangeBook={handleChangeBook} />
    );

    const addButton = screen.getByRole('button', { name: /Añadir/i });
    fireEvent.click(addButton);

    expect(handleChangeBook).toHaveBeenCalledTimes(1);
    expect(handleChangeBook).toHaveBeenCalledWith(mockBook);
  });

  it('calls handleChangeBook when clicking "Quitar" in reading-list mode', () => {
    const handleChangeBook = vi.fn();

    renderWithProviders(
      <BookCard book={mockBook} type='reading-list' idx={0} handleChangeBook={handleChangeBook} />
    );

    const removeButton = screen.getByRole('button', { name: /Quitar/i });
    fireEvent.click(removeButton);

    expect(handleChangeBook).toHaveBeenCalledTimes(1);
    expect(handleChangeBook).toHaveBeenCalledWith(mockBook);
  });

  it('opens details dialog when clicking "Detalles"', () => {
    const handleChangeBook = vi.fn();

    renderWithProviders(
      <BookCard book={mockBook} type='available-list' idx={0} handleChangeBook={handleChangeBook} />
    );

    const detailsButton = screen.getByRole('button', { name: /Detalles/i });
    fireEvent.click(detailsButton);

    expect(screen.getByText('1200 páginas')).toBeInTheDocument();
    expect(screen.getByText('9780261102385')).toBeInTheDocument();
    expect(screen.getByText('Otros libros del autor')).toBeInTheDocument();
  });
});
