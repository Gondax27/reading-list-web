import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';

import ReadingList from '@/components/ReadingList';
import { useLibraryStore } from '@/store/library';
import type { Book } from '@/types/library';

const mockBook1: Book = {
  title: 'Cien Años de Soledad',
  pages: 417,
  genre: 'Realismo Mágico',
  cover: 'https://covers.openlibrary.org/b/id/101-M.jpg',
  synopsis: 'La historia de la familia Buendía en Macondo.',
  year: 1967,
  ISBN: '9780307474728',
  author: {
    name: 'Gabriel García Márquez',
    otherBooks: ['El Amor en los Tiempos del Cólera'],
  },
};

describe('ReadingList Component', () => {
  beforeEach(() => {
    localStorage.clear();
    useLibraryStore.setState({
      readingList: [],
      availableBooks: [],
      totalFound: 0,
    });
  });

  it('renders empty state when reading list is empty', () => {
    render(<ReadingList className='test-class' wrapperImagesClassName='grid' />);

    expect(screen.getByText('Tu Lista de Lectura')).toBeInTheDocument();
    expect(
      screen.getByText(/Aún no has añadido libros\. Explora el catálogo/i)
    ).toBeInTheDocument();
  });

  it('renders books when reading list contains elements', () => {
    useLibraryStore.setState({
      readingList: [mockBook1],
    });

    render(<ReadingList className='test-class' wrapperImagesClassName='grid' />);

    expect(screen.getByText('Mi Lista')).toBeInTheDocument();
    expect(screen.getByText('Cien Años de Soledad')).toBeInTheDocument();
    expect(screen.getByText('Gabriel García Márquez')).toBeInTheDocument();
  });

  it('allows removing a book from the list', () => {
    useLibraryStore.setState({
      readingList: [mockBook1],
    });

    render(<ReadingList className='test-class' wrapperImagesClassName='grid' />);

    const removeBtn = screen.getByRole('button', { name: /Quitar Cien Años de Soledad/i });
    fireEvent.click(removeBtn);

    expect(useLibraryStore.getState().readingList).toHaveLength(0);
  });
});
