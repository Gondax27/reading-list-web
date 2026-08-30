import { BookmarkPlus, Trash2 } from 'lucide-react';

import BookCoverImage from '@/components/BookCoverImage';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import type { Book } from '@/types/library';

interface BookDetailDialogProps {
  book: Book;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: 'available-list' | 'reading-list';
  onAdd?: (book: Book) => void;
  onRemove?: (book: Book) => void;
}

const BookDetailDialog = ({
  book,
  open,
  onOpenChange,
  mode,
  onAdd,
  onRemove,
}: BookDetailDialogProps) => {
  const handlePrimaryAction = () => {
    if (mode === 'available-list' && onAdd) {
      onAdd(book);
    }

    if (mode === 'reading-list' && onRemove) {
      onRemove(book);
    }

    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-h-[90dvh] overflow-y-auto sm:max-w-2xl'>
        <DialogHeader>
          <DialogTitle className='pr-8 text-xl leading-snug'>{book.title}</DialogTitle>
          <DialogDescription>{book.author.name}</DialogDescription>
        </DialogHeader>

        <div className='grid gap-6 sm:grid-cols-[140px_1fr]'>
          <div className='mx-auto aspect-[2/3] w-full max-w-[140px] overflow-hidden rounded-lg'>
            <BookCoverImage src={book.cover} alt={`Portada de ${book.title}`} loading='eager' />
          </div>

          <div className='space-y-4'>
            <div className='flex flex-wrap gap-2'>
              <Badge variant='secondary'>{book.genre}</Badge>
              <Badge variant='outline'>{book.year}</Badge>
              <Badge variant='outline'>{book.pages} páginas</Badge>
            </div>

            <dl className='grid gap-2 text-sm'>
              <div>
                <dt className='font-medium text-muted-foreground'>ISBN</dt>
                <dd>{book.ISBN}</dd>
              </div>
            </dl>

            <div>
              <h3 className='mb-1 text-sm font-medium'>Sinopsis</h3>
              <p className='text-sm leading-relaxed text-muted-foreground'>{book.synopsis}</p>
            </div>

            {book.author.otherBooks.length > 0 && (
              <div>
                <h3 className='mb-1 text-sm font-medium'>Otros libros del autor</h3>
                <ul className='list-inside list-disc text-sm text-muted-foreground'>
                  {book.author.otherBooks.map((title) => (
                    <li key={title}>{title}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        <DialogFooter>
          {mode === 'available-list' && onAdd && (
            <Button type='button' onClick={handlePrimaryAction}>
              <BookmarkPlus data-icon='inline-start' />
              Añadir a mi lista
            </Button>
          )}

          {mode === 'reading-list' && onRemove && (
            <Button type='button' variant='destructive' onClick={handlePrimaryAction}>
              <Trash2 data-icon='inline-start' />
              Quitar de mi lista
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default BookDetailDialog;
