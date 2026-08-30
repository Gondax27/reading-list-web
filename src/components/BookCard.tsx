import { BookmarkPlus, Info, Trash2 } from 'lucide-react';
import { useState } from 'react';

import BookCoverImage from '@/components/BookCoverImage';
import BookDetailDialog from '@/components/BookDetailDialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import type { Book } from '@/types/library';

interface BookCardProps {
  book: Book;
  type: 'available-list' | 'reading-list';
  idx: number;
  handleChangeBook: (book: Book) => void;
}

const BookCard = ({ book, type, idx, handleChangeBook }: BookCardProps) => {
  const [detailsOpen, setDetailsOpen] = useState(false);

  const loadingStrategy =
    type === 'available-list' ? (idx > 7 ? 'lazy' : 'eager') : idx > 5 ? 'lazy' : 'eager';

  return (
    <>
      <Card className='animation-fade-in flex h-full flex-col overflow-hidden border border-border/80 bg-card pt-0 shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg'>
        <div className='relative aspect-[2/3] w-full overflow-hidden border-b border-border/50'>
          <BookCoverImage
            src={book.cover}
            alt={`Portada de ${book.title}`}
            loading={loadingStrategy}
          />
        </div>

        <CardHeader className='gap-1.5 p-4 pb-2'>
          <div className='flex items-center justify-between gap-2'>
            <Badge variant='secondary' className='max-w-[130px] truncate text-xs font-medium'>
              {book.genre}
            </Badge>
            {book.year ? (
              <span className='shrink-0 font-mono text-xs text-muted-foreground'>{book.year}</span>
            ) : null}
          </div>

          <CardTitle
            className='line-clamp-2 min-h-[2.6rem] text-base leading-snug font-semibold text-card-foreground'
            title={book.title}
          >
            {book.title}
          </CardTitle>

          <CardDescription
            className='line-clamp-1 text-xs font-medium text-muted-foreground'
            title={book.author.name}
          >
            {book.author.name}
          </CardDescription>
        </CardHeader>

        <CardContent className='flex-1 px-4 py-0 pb-3'>
          <p className='line-clamp-2 text-xs leading-relaxed text-muted-foreground/90'>
            {book.synopsis}
          </p>
        </CardContent>

        <CardFooter
          className={
            type === 'reading-list'
              ? 'mt-auto flex items-center justify-between gap-2 border-t-0 bg-transparent p-4 pt-0'
              : 'mt-auto flex items-center gap-2 border-t-0 bg-transparent p-4 pt-0'
          }
        >
          {type === 'available-list' && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  type='button'
                  size='sm'
                  className='flex-1'
                  aria-label={`Añadir ${book.title} a la lista de lectura`}
                  onClick={() => handleChangeBook(book)}
                >
                  <BookmarkPlus data-icon='inline-start' />
                  Añadir
                </Button>
              </TooltipTrigger>
              <TooltipContent>Añadir a favoritos</TooltipContent>
            </Tooltip>
          )}

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type='button'
                variant='outline'
                size='sm'
                className={type === 'available-list' ? 'flex-1' : undefined}
                aria-label={`Ver detalles de ${book.title}`}
                onClick={() => setDetailsOpen(true)}
              >
                <Info data-icon='inline-start' />
                Detalles
              </Button>
            </TooltipTrigger>
            <TooltipContent>Ver detalles del libro</TooltipContent>
          </Tooltip>

          {type === 'reading-list' && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  type='button'
                  variant='destructive'
                  size='sm'
                  aria-label={`Quitar ${book.title} de la lista`}
                  onClick={() => handleChangeBook(book)}
                >
                  <Trash2 data-icon='inline-start' />
                  Quitar
                </Button>
              </TooltipTrigger>
              <TooltipContent>Quitar de la lista</TooltipContent>
            </Tooltip>
          )}
        </CardFooter>
      </Card>

      <BookDetailDialog
        book={book}
        open={detailsOpen}
        onOpenChange={setDetailsOpen}
        mode={type}
        onAdd={type === 'available-list' ? handleChangeBook : undefined}
        onRemove={type === 'reading-list' ? handleChangeBook : undefined}
      />
    </>
  );
};

export default BookCard;
