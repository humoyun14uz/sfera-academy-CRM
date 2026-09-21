import * as React from 'react'
import {
  Controller,
  FormProvider,
  useFormContext,
  useFormState,
  type ControllerProps,
  type FieldPath,
  type FieldValues,
} from 'react-hook-form'
import * as LabelPrimitive from '@radix-ui/react-label'
import { Slot } from '@radix-ui/react-slot'
import { cn } from '@/lib/utils'
import { getCookie } from '@/lib/cookies'
import { Label } from '@/components/ui/label'

const Form = FormProvider

type FormFieldContextValue<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = {
  name: TName
}

const FormFieldContext = React.createContext<FormFieldContextValue>(
  {} as FormFieldContextValue
)

const FormField = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  ...props
}: ControllerProps<TFieldValues, TName>) => {
  return (
    <FormFieldContext.Provider value={{ name: props.name }}>
      <Controller {...props} />
    </FormFieldContext.Provider>
  )
}

const useFormField = () => {
  const fieldContext = React.useContext(FormFieldContext)
  const itemContext = React.useContext(FormItemContext)
  const { getFieldState } = useFormContext()
  const formState = useFormState({ name: fieldContext.name })
  const fieldState = getFieldState(fieldContext.name, formState)

  if (!fieldContext) {
    throw new Error('useFormField should be used within <FormField>')
  }

  const { id } = itemContext

  return {
    id,
    name: fieldContext.name,
    formItemId: `${id}-form-item`,
    formDescriptionId: `${id}-form-item-description`,
    formMessageId: `${id}-form-item-message`,
    ...fieldState,
  }
}

type FormItemContextValue = {
  id: string
}

const FormItemContext = React.createContext<FormItemContextValue>(
  {} as FormItemContextValue
)

function FormItem({ className, ...props }: React.ComponentProps<'div'>) {
  const id = React.useId()

  return (
    <FormItemContext.Provider value={{ id }}>
      <div
        data-slot='form-item'
        className={cn('grid gap-2', className)}
        {...props}
      />
    </FormItemContext.Provider>
  )
}

function FormLabel({
  className,
  ...props
}: React.ComponentProps<typeof LabelPrimitive.Root>) {
  const { error, formItemId } = useFormField()

  return (
    <Label
      data-slot='form-label'
      data-error={!!error}
      className={cn('data-[error=true]:text-destructive', className)}
      htmlFor={formItemId}
      {...props}
    />
  )
}

function FormControl({ ...props }: React.ComponentProps<typeof Slot>) {
  const { error, formItemId, formDescriptionId, formMessageId } = useFormField()

  return (
    <Slot
      data-slot='form-control'
      id={formItemId}
      aria-describedby={
        !error
          ? `${formDescriptionId}`
          : `${formDescriptionId} ${formMessageId}`
      }
      aria-invalid={!!error}
      {...props}
    />
  )
}

function FormDescription({ className, ...props }: React.ComponentProps<'p'>) {
  const { formDescriptionId } = useFormField()

  return (
    <p
      data-slot='form-description'
      id={formDescriptionId}
      className={cn('text-sm text-muted-foreground', className)}
      {...props}
    />
  )
}

function FormMessage({ className, ...props }: React.ComponentProps<'p'>) {
  const { error, formMessageId } = useFormField()
  const rawBody = error ? String(error?.message ?? '') : props.children
  const body = typeof rawBody === 'string' ? rawBody : String(rawBody ?? '')
  const localizedBody = getCookie('sfera-language') === 'uz'
    ? body
        .replace(' is required.', ' kiritilishi shart.')
        .replace('Please select a ', 'Iltimos, ')
        .replace('Please choose a ', 'Iltimos, ')
        .replace('Please upload a file.', 'Iltimos, fayl yuklang.')
        .replace('Please upload csv format.', 'Iltimos, CSV formatidagi faylni yuklang.')
        .replace('Title', 'Sarlavha')
        .replace('Status', 'Holat')
        .replace('Label', 'Teg')
        .replace('Priority', 'Muhimlik')
        .replace('Role', 'Rol')
        .replace('First Name', 'Ism')
        .replace('Last Name', 'Familiya')
        .replace('Username', 'Foydalanuvchi nomi')
        .replace('Phone number', 'Telefon raqami')
        .replace('Email', 'Elektron pochta')
        .replace('Password', 'Parol')
        .replace('email to display.', 'elektron pochta manzilini tanlang.')
        .replace('language.', 'tilni tanlang.')
        .replace('date of birth.', 'tug‘ilgan sanani tanlang.')
    : body

  if (!body) {
    return null
  }

  return (
    <p
      data-slot='form-message'
      id={formMessageId}
      className={cn('text-sm text-destructive', className)}
      {...props}
    >
      {localizedBody}
    </p>
  )
}

export {
  useFormField,
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
  FormField,
}
