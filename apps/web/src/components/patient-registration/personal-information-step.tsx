'use client';

import { format } from 'date-fns';
import { CalendarIcon, Users } from 'lucide-react';
import { BsGenderMale, BsGenderFemale } from 'react-icons/bs';
import { UseFormReturn } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { FormValues, sexOptions } from './schema';
import { useState } from 'react';
import React from 'react';

interface PersonalInformationStepProps {
  form: UseFormReturn<FormValues>;
}

export function PersonalInformationStep({
  form,
}: PersonalInformationStepProps) {
  // Map icon strings to actual components
  const iconMap = {
    Male: BsGenderMale,
    Female: BsGenderFemale,
    Users,
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="firstName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>First Name</FormLabel>
              <FormControl>
                <Input placeholder="John" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="middleName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Middle Name (Optional)</FormLabel>
              <FormControl>
                <Input placeholder="D" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <FormField
        control={form.control}
        name="lastName"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Last Name</FormLabel>
            <FormControl>
              <Input placeholder="Doe" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="dateOfBirth"
        render={({ field }) => {
          // Use useState with lazy initialization
          const [open, setOpen] = React.useState(false);

          // Memoize the date selection handler
          const handleSelect = React.useCallback(
            (date: Date | undefined) => {
              field.onChange(date);
              setOpen(false);
            },
            [field]
          );

          // Memoize the date formatter
          const formattedDate = React.useMemo(
            () => (field.value ? format(field.value, 'PPP') : undefined),
            [field.value]
          );

          // Memoize the date constraint function
          const disabledDays = React.useCallback(
            (date: Date) => date > new Date() || date < new Date('1800-01-01'),
            []
          );

          // Generate years array only once
          const yearRange = React.useMemo(() => {
            const currentYear = new Date().getFullYear();
            const startYear = 1800;
            const years = [];

            // Pre-calculate the array
            for (let i = 0; i <= currentYear - startYear; i++) {
              years.push(startYear + i);
            }

            return {
              fromYear: startYear,
              toYear: currentYear,
            };
          }, []);

          return (
            <FormItem className="flex flex-col">
              <FormLabel>Date of Birth</FormLabel>
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={'outline'}
                      className={cn(
                        'w-full pl-3 text-left font-normal',
                        !field.value && 'text-muted-foreground'
                      )}
                    >
                      {formattedDate ? formattedDate : <span>Pick a date</span>}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={handleSelect}
                    disabled={disabledDays}
                    initialFocus
                    captionLayout="dropdown-buttons"
                    fromYear={yearRange.fromYear}
                    toYear={yearRange.toYear}
                    defaultMonth={field.value || undefined}
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          );
        }}
      />
      <FormField
        control={form.control}
        name="sex"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Sex</FormLabel>
            <FormControl>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {sexOptions.map((option) => {
                  const IconComponent =
                    iconMap[option.icon as keyof typeof iconMap];
                  return (
                    <Button
                      key={option.value}
                      type="button"
                      variant={
                        field.value === option.value ? 'default' : 'outline'
                      }
                      className={cn(
                        'flex flex-col items-center justify-center h-auto py-3',
                        field.value === option.value ? 'border-primary' : ''
                      )}
                      onClick={() => field.onChange(option.value)}
                    >
                      <IconComponent className="h-5 w-5 mb-1" />
                      <span className="text-xs">{option.label}</span>
                    </Button>
                  );
                })}
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="address"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Address</FormLabel>
            <FormControl>
              <Textarea
                placeholder="123 Main St, City, Country"
                className="resize-none"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="email"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Email (Optional)</FormLabel>
            <FormControl>
              <Input
                type="email"
                placeholder="patient@example.com"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
}
