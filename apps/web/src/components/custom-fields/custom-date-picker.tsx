'use client';

import * as React from 'react';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import {
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useCallback, useMemo, useState } from 'react';

interface CustomDatePickerProps {
  value?: Date;
  onChange?: (date?: Date) => void;
  label?: string;
  placeholder?: string;
  fromYear?: number;
  toYear?: number;
  minDate?: Date;
  maxDate?: Date;
  disabled?: boolean;
  className?: string;
  showFormField?: boolean;
  field?: any; // For react-hook-form integration
}

export default function CustomDatePicker({
  value,
  onChange,
  label,
  placeholder = 'Pick a date',
  fromYear = 1800,
  toYear = new Date().getFullYear(),
  minDate,
  maxDate,
  disabled = false,
  className,
  showFormField = true,
  field,
}: CustomDatePickerProps) {
  const [open, setOpen] = useState(false);

  // Use either direct value or field value from react-hook-form
  const dateValue = field?.value || value;

  const handleSelect = useCallback(
    (date?: Date) => {
      if (field) {
        field.onChange(date);
      } else if (onChange) {
        onChange(date);
      }
      setOpen(false);
    },
    [field, onChange]
  );

  const formattedDate = useMemo(
    () => (dateValue ? format(dateValue, 'PPP') : undefined),
    [dateValue]
  );

  const disabledDays = useCallback(
    (date: Date) => {
      if (maxDate && date > maxDate) return true;
      if (minDate && date < minDate) return true;
      return false;
    },
    [maxDate, minDate]
  );

  const datePickerContent = (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          disabled={disabled}
          className={cn(
            'w-full pl-3 text-left font-normal justify-between',
            !dateValue && 'text-muted-foreground',
            className
          )}
        >
          {formattedDate || <span>{placeholder}</span>}
          <CalendarIcon className="h-4 w-4 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={dateValue}
          onSelect={handleSelect}
          disabled={disabledDays}
          initialFocus
          captionLayout="dropdown-buttons"
          fromYear={fromYear}
          toYear={toYear}
          defaultMonth={dateValue || undefined}
        />
      </PopoverContent>
    </Popover>
  );

  if (!showFormField) {
    return datePickerContent;
  }

  return (
    <FormItem className="flex flex-col">
      <div className="flex flex-row items-center justify-start gap-2">
        {label && <FormLabel>{label}</FormLabel>}
        <FormMessage className="text-xs text-muted-foreground italic" />
      </div>
      <FormControl>{datePickerContent}</FormControl>
    </FormItem>
  );
}
