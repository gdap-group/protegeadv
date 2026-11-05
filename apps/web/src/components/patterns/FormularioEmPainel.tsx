import * as React from 'react';
import {
  useForm,
  type UseFormReturn,
  type FieldValues,
  type DefaultValues,
  type FieldErrors,
  type Resolver,
  FormProvider,
} from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { type ZodType } from 'zod';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from '../ui/sheet';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '../ui/dialog';
import { Button } from '../ui/button';
import '../../lib/zod-pt'; // Garante o registro do mapa de erro em português
import { cn } from '../../lib/utils';

export interface FormularioEmPainelProps<TFormValues extends FieldValues> {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  schema: ZodType<TFormValues>;
  defaultValues: DefaultValues<TFormValues>;
  onSubmit: (data: TFormValues) => Promise<void> | void;
  submitLabel?: string;
  cancelLabel?: string;
  side?: 'top' | 'bottom' | 'left' | 'right';
  className?: string;
  children:
    | ((form: UseFormReturn<TFormValues>) => React.ReactNode)
    | React.ReactNode;
}

export function FormularioEmPainel<TFormValues extends FieldValues>({
  open,
  onOpenChange,
  title,
  description,
  schema,
  defaultValues,
  onSubmit,
  submitLabel = 'Salvar',
  cancelLabel = 'Cancelar',
  side = 'right',
  className,
  children,
}: FormularioEmPainelProps<TFormValues>) {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [showDiscardDialog, setShowDiscardDialog] = React.useState(false);

  const resolver = React.useMemo(
    () =>
      zodResolver(
        schema as unknown as Parameters<typeof zodResolver>[0]
      ) as unknown as Resolver<TFormValues>,
    [schema]
  );

  const form = useForm<TFormValues>({
    resolver,
    defaultValues,
    mode: 'onBlur',
    reValidateMode: 'onChange',
  });

  // Inscreve explicitamente no proxy do formState para rastrear isDirty
  const { isDirty } = form.formState;

  const prevOpenRef = React.useRef(open);
  // Reseta o formulário apenas quando o painel for aberto
  React.useEffect(() => {
    if (open && !prevOpenRef.current) {
      form.reset(defaultValues);
      setShowDiscardDialog(false);
    }
    prevOpenRef.current = open;
  }, [open, defaultValues, form]);

  const handleAttemptClose = () => {
    if (isDirty) {
      setShowDiscardDialog(true);
    } else {
      onOpenChange(false);
    }
  };

  const handleConfirmDiscard = () => {
    form.reset(defaultValues);
    setShowDiscardDialog(false);
    onOpenChange(false);
  };

  const handleFormSubmit = async (data: TFormValues) => {
    try {
      setIsSubmitting(true);
      await onSubmit(data);
      form.reset(data);
      onOpenChange(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFormError = (errors: FieldErrors<TFormValues>) => {
    // Foco automático no primeiro campo inválido
    const firstKey = Object.keys(errors)[0];
    if (firstKey) {
      const fieldEl = document.querySelector(
        `[name="${firstKey}"]`
      ) as HTMLElement | null;
      fieldEl?.focus();
    }
  };

  return (
    <>
      <Sheet
        open={open}
        onOpenChange={(nextOpen) => {
          if (!nextOpen) {
            handleAttemptClose();
          } else {
            onOpenChange(true);
          }
        }}
      >
        <SheetContent
          side={side}
          className={cn(
            'flex flex-col sm:max-w-lg w-full h-full p-0 overflow-hidden bg-[var(--color-surface)] border-l border-[var(--color-border)]',
            className
          )}
          onPointerDownOutside={(e) => {
            if (isDirty) {
              e.preventDefault();
              setShowDiscardDialog(true);
            }
          }}
          onEscapeKeyDown={(e) => {
            if (isDirty) {
              e.preventDefault();
              setShowDiscardDialog(true);
            }
          }}
        >
          {/* Cabeçalho do Painel */}
          <SheetHeader className="p-6 border-b border-[var(--color-border)] text-left shrink-0">
            <SheetTitle className="text-lg font-semibold text-[var(--color-text)]">
              {title}
            </SheetTitle>
            {description && (
              <SheetDescription className="text-sm text-[var(--color-muted)]">
                {description}
              </SheetDescription>
            )}
          </SheetHeader>

          {/* Formulário com Scroll e Rodapé Integrado */}
          <FormProvider {...form}>
            <form
              id="painel-form"
              onSubmit={form.handleSubmit(handleFormSubmit, handleFormError)}
              className="flex flex-col flex-1 min-h-0"
              noValidate
            >
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {typeof children === 'function' ? children(form) : children}
              </div>

              {/* Rodapé com Ações de Salvar e Cancelar */}
              <SheetFooter className="p-4 border-t border-[var(--color-border)] bg-[var(--color-surface)] flex-row justify-end gap-2 shrink-0">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={handleAttemptClose}
                  disabled={isSubmitting}
                >
                  {cancelLabel}
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  loading={isSubmitting}
                  disabled={isSubmitting}
                >
                  {submitLabel}
                </Button>
              </SheetFooter>
            </form>
          </FormProvider>
        </SheetContent>
      </Sheet>

      {/* Confirmação de Alterações Não Salvas */}
      <Dialog open={showDiscardDialog} onOpenChange={setShowDiscardDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Descartar alterações?</DialogTitle>
            <DialogDescription>
              Você possui dados modificados neste formulário. Se sair agora, todas as alterações não salvas serão perdidas.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex-row justify-end gap-2 mt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setShowDiscardDialog(false)}
            >
              Continuar editando
            </Button>
            <Button
              type="button"
              variant="danger"
              onClick={handleConfirmDiscard}
            >
              Descartar alterações
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

/**
 * Componentes auxiliares para campos de formulário padronizados
 */
export function FormFieldItem({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={cn('space-y-1.5', className)}>{children}</div>;
}

export function FormFieldLabel({
  htmlFor,
  required,
  children,
  className,
}: {
  htmlFor?: string;
  required?: boolean;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <label
      htmlFor={htmlFor}
      className={cn(
        'text-xs font-medium text-[var(--color-text)] flex items-center gap-1',
        className
      )}
    >
      <span>{children}</span>
      {required && (
        <span className="text-[var(--color-danger)] font-mono" aria-hidden="true">
          *
        </span>
      )}
    </label>
  );
}

export function FormFieldErrorMessage({
  id,
  children,
  className,
}: {
  id?: string;
  children?: React.ReactNode;
  className?: string;
}) {
  if (!children) return null;
  return (
    <p
      id={id}
      role="alert"
      className={cn(
        'text-xs font-medium text-[var(--color-danger)] animate-in fade-in-50',
        className
      )}
    >
      {children}
    </p>
  );
}
