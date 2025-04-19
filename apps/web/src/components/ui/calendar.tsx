'use client';

import * as React from 'react';
import { ChevronLeft, ChevronRight, ChevronsUpDown } from 'lucide-react';
import { DayPicker, DropdownProps } from 'react-day-picker';
import { format, getYear } from 'date-fns';
import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Command,
  CommandInput,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

// Custom searchable year component
const SearchableYearDropdown = React.memo(
  ({
    value,
    onChange,
    fromYear,
    toYear,
  }: {
    value?: number;
    onChange: (year: number) => void;
    fromYear: number;
    toYear: number;
  }) => {
    const [open, setOpen] = React.useState(false);
    const years = React.useMemo(() => {
      const currentYear = toYear || new Date().getFullYear();
      const startYear = fromYear || 1800;
      const years = [];
      for (let year = startYear; year <= currentYear; year++) {
        years.push(year);
      }
      return years;
    }, [fromYear, toYear]);

    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="h-7 w-[70px] justify-between px-2 text-xs"
          >
            {value || 'Year'}
            <ChevronsUpDown className="ml-1 h-3 w-3 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[160px] p-0" align="start">
          <Command>
            <CommandInput placeholder="Search year..." className="h-8" />
            <CommandEmpty>No year found</CommandEmpty>
            <CommandGroup className="max-h-60 overflow-y-auto">
              {years.map((year) => (
                <CommandItem
                  value={year.toString()}
                  key={year}
                  onSelect={() => {
                    onChange(year);
                    setOpen(false);
                  }}
                  className="text-sm"
                >
                  {year}
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
    );
  }
);
SearchableYearDropdown.displayName = 'SearchableYearDropdown';

// Regular month dropdown (doesn't need to be searchable)
const MonthDropdown = React.memo(
  ({ value, onChange, children }: DropdownProps) => {
    const options = React.useMemo(() => {
      return React.Children.toArray(children) as React.ReactElement<
        React.HTMLProps<HTMLOptionElement>
      >[];
    }, [children]);

    const selected = React.useMemo(() => {
      return options.find((child) => child.props.value === value);
    }, [options, value]);

    const handleChange = React.useCallback(
      (value: string) => {
        const changeEvent = {
          target: { value },
        } as React.ChangeEvent<HTMLSelectElement>;
        onChange?.(changeEvent);
      },
      [onChange]
    );

    return (
      <Select value={value?.toString()} onValueChange={handleChange}>
        <SelectTrigger className="pr-1.5 focus:ring-0 focus:ring-offset-0 h-7">
          <SelectValue>{selected?.props?.children}</SelectValue>
        </SelectTrigger>
        <SelectContent position="popper">
          <ScrollArea className="h-40">
            {options.map((option, id: number) => (
              <SelectItem
                key={`${option.props.value}-${id}`}
                value={option.props.value?.toString() ?? ''}
              >
                {option.props.children}
              </SelectItem>
            ))}
          </ScrollArea>
        </SelectContent>
      </Select>
    );
  }
);
MonthDropdown.displayName = 'MonthDropdown';

// Determine which dropdown component to use based on dropdown type
const DropdownComponent = React.memo(
  ({
    value,
    onChange,
    children,
    ...props
  }: DropdownProps & { name?: string }) => {
    // Check if this is a year dropdown
    const isYearDropdown = props.name === 'year';

    if (isYearDropdown) {
      return (
        <SearchableYearDropdown
          value={typeof value === 'number' ? value : Number(value)}
          onChange={(year: number) => {
            const changeEvent = {
              target: { value: year.toString() },
            } as React.ChangeEvent<HTMLSelectElement>;
            onChange?.(changeEvent);
          }}
          fromYear={1800}
          toYear={new Date().getFullYear()}
        />
      );
    }

    return (
      <MonthDropdown value={value} onChange={onChange} children={children} />
    );
  }
);
DropdownComponent.displayName = 'DropdownComponent';

// Extended Calendar component with searchable year dropdown
function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  captionLayout,
  ...props
}: CalendarProps) {
  const isDropdownCaption =
    captionLayout === 'dropdown' || captionLayout === 'dropdown-buttons';
  const [month, setMonth] = React.useState<Date>(
    props.defaultMonth || new Date()
  );

  // Get current month index and year
  const currentMonth = month.getMonth();
  const currentYear = getYear(month);

  // Memoize these values to prevent unnecessary re-renders
  const rootClassName = React.useMemo(
    () => cn('p-3 pointer-events-auto', className),
    [className]
  );

  const navButtonClassName = React.useMemo(
    () =>
      cn(
        buttonVariants({ variant: 'outline' }),
        'h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100'
      ),
    []
  );

  const dayClassName = React.useMemo(
    () =>
      cn(
        buttonVariants({ variant: 'ghost' }),
        'h-9 w-9 p-0 font-normal aria-selected:opacity-100'
      ),
    []
  );

  // Handler for month change
  const handleMonthChange = React.useCallback(
    (month: number) => {
      const newDate = new Date(
        month === 11 ? currentYear + 1 : currentYear,
        month === 11 ? 0 : month + 1
      );
      setMonth(newDate);
    },
    [currentYear]
  );

  // Handler for year change
  const handleYearChange = React.useCallback(
    (year: number) => {
      const newDate = new Date(year, currentMonth);
      setMonth(newDate);
    },
    [currentMonth]
  );

  // Custom navigation component
  const CustomCaption = React.useCallback(
    ({ displayMonth }: { displayMonth: Date }) => {
      const months = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December',
      ];

      return (
        <div className="flex items-center justify-center gap-1 pt-1">
          {isDropdownCaption ? (
            <>
              <Select
                value={displayMonth.getMonth().toString()}
                onValueChange={(value) => handleMonthChange(parseInt(value))}
              >
                <SelectTrigger className="h-7 w-[90px] text-xs">
                  <SelectValue>{months[displayMonth.getMonth()]}</SelectValue>
                </SelectTrigger>
                <SelectContent position="popper" className="min-w-0">
                  {months.map((month, index) => (
                    <SelectItem
                      key={month}
                      value={index.toString()}
                      className="text-sm"
                    >
                      {month}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <SearchableYearDropdown
                value={displayMonth.getFullYear()}
                onChange={handleYearChange}
                fromYear={
                  typeof props.fromYear === 'number' ? props.fromYear : 1800
                }
                toYear={
                  typeof props.toYear === 'number'
                    ? props.toYear
                    : new Date().getFullYear()
                }
              />
            </>
          ) : (
            <div className="text-sm font-medium">
              {format(displayMonth, 'LLLL yyyy')}
            </div>
          )}
        </div>
      );
    },
    [
      isDropdownCaption,
      handleMonthChange,
      handleYearChange,
      props.fromYear,
      props.toYear,
    ]
  );

  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={rootClassName}
      month={month}
      onMonthChange={setMonth}
      captionLayout="buttons"
      classNames={{
        months: 'flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0',
        month: 'space-y-4',
        caption: 'flex justify-center pt-1 relative items-center',
        caption_label: 'text-sm font-medium',
        nav: 'space-x-1 flex items-center',
        nav_button: navButtonClassName,
        nav_button_previous: 'absolute left-1',
        nav_button_next: 'absolute right-1',
        table: 'w-full border-collapse space-y-1',
        head_row: 'flex',
        head_cell:
          'text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]',
        row: 'flex w-full mt-2 first:justify-end',
        cell: 'text-center text-sm p-0 relative [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20',
        day: dayClassName,
        day_selected:
          'bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground',
        day_today: 'bg-accent text-accent-foreground',
        day_outside: 'day-outside text-muted-foreground opacity-50',
        day_disabled: 'text-muted-foreground opacity-50',
        day_range_middle:
          'aria-selected:bg-accent aria-selected:text-accent-foreground',
        day_hidden: 'invisible',
        vhidden: 'hidden',
        ...classNames,
      }}
      components={{
        IconLeft: () => <ChevronLeft className="h-4 w-4" />,
        IconRight: () => <ChevronRight className="h-4 w-4" />,
        Caption: CustomCaption,
      }}
      {...props}
    />
  );
}

Calendar.displayName = 'Calendar';

export { Calendar };
