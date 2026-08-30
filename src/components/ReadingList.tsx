import { BookMarked, Download, Library, Trash2 } from 'lucide-react';
import { useCallback } from 'react';
import { toast } from 'sonner';

import BookCard from '@/components/BookCard';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useLibraryStore } from '@/store/library';

interface ReadingListProps {
  className: string;
  wrapperImagesClassName: string;
}

const ReadingList = ({ className, wrapperImagesClassName }: ReadingListProps) => {
  const readingList = useLibraryStore((state) => state.readingList);
  const removeReadingBook = useLibraryStore((state) => state.removeReadingBook);
  const clearReadingList = useLibraryStore((state) => state.clearReadingList);

  const handleExportJson = useCallback(() => {
    try {
      const dataStr = `data:text/json;charset=utf-8,${encodeURIComponent(
        JSON.stringify(readingList, null, 2)
      )}`;
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute('href', dataStr);
      downloadAnchor.setAttribute(
        'download',
        `reading-list-${new Date().toISOString().slice(0, 10)}.json`
      );
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();

      toast.success('Lista de lectura exportada en JSON');
    } catch {
      toast.error('No se pudo exportar la lista');
    }
  }, [readingList]);

  if (readingList.length === 0) {
    return (
      <section className={className}>
        <div className='flex flex-col items-center justify-center p-8 text-center'>
          <div className='mb-4 flex size-14 items-center justify-center rounded-2xl border border-border/80 bg-muted/50 text-muted-foreground shadow-xs'>
            <BookMarked className='size-7' />
          </div>
          <h2 className='font-mono text-xl font-bold tracking-tight text-foreground sm:text-2xl'>
            Tu Lista de Lectura
          </h2>
          <p className='mt-2 max-w-xs text-xs leading-relaxed text-muted-foreground sm:text-sm'>
            Aún no has añadido libros. Explora el catálogo y pulsa <strong>Añadir</strong> para
            guardar tus lecturas pendientes.
          </p>
          <div role='status' aria-live='polite' aria-atomic='true' className='sr-only'>
            Tu lista de lectura está vacía
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={className}>
      <div role='status' aria-live='polite' aria-atomic='true' className='sr-only'>
        {`Tienes ${readingList.length} libro${readingList.length === 1 ? '' : 's'} en tu lista de lectura`}
      </div>
      <div className='flex items-center justify-between gap-3'>
        <div className='flex items-center gap-2'>
          <div className='flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary border border-primary/20'>
            <Library className='size-4' />
          </div>
          <h2 className='font-mono text-lg font-bold tracking-tight text-foreground sm:text-xl'>
            Mi Lista
          </h2>
          <Badge variant='secondary' className='font-mono text-xs'>
            {readingList.length}
          </Badge>
        </div>

        <div className='flex items-center gap-1'>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  type='button'
                  variant='ghost'
                  size='icon-sm'
                  onClick={handleExportJson}
                  aria-label='Exportar lista en JSON'
                >
                  <Download className='size-4 text-muted-foreground' />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Exportar JSON</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <AlertDialog>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <AlertDialogTrigger asChild>
                    <Button
                      type='button'
                      variant='ghost'
                      size='icon-sm'
                      aria-label='Vaciar lista de lectura'
                    >
                      <Trash2 className='size-4 text-destructive/80 hover:text-destructive' />
                    </Button>
                  </AlertDialogTrigger>
                </TooltipTrigger>
                <TooltipContent>Vaciar lista</TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>¿Vaciar lista de lectura?</AlertDialogTitle>
                <AlertDialogDescription>
                  Se eliminarán los {readingList.length} libros guardados de tu lista actual. Podrás
                  deshacer esta acción inmediatamente desde la notificación.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction onClick={clearReadingList}>Vaciar lista</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      <hr className='mt-3 mb-5 border-border' />

      <TooltipProvider>
        <div className={wrapperImagesClassName}>
          {readingList.map((book, idx) => (
            <BookCard
              key={book.ISBN}
              book={book}
              type='reading-list'
              idx={idx}
              handleChangeBook={removeReadingBook}
            />
          ))}
        </div>
      </TooltipProvider>
    </section>
  );
};

export default ReadingList;
