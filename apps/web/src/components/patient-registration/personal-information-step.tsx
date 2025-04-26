'use client';

import { Users } from 'lucide-react';
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
import { cn } from '@/lib/utils';
import { FormValues, sexOptions } from './schema';
import CustomDatePicker from '@/components/custom-fields/custom-date-picker';

interface PersonalInformationStepProps {
  form: UseFormReturn<FormValues>;
  modifiedFields?: Record<string, boolean>;
}

export function PersonalInformationStep({
  form,
  modifiedFields = {},
}: PersonalInformationStepProps) {
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
            <FormItem
              className={cn(
                modifiedFields.firstName &&
                  ' border-secondary pl-2 rounded transition-all'
              )}
            >
              <div className="flex flex-row items-center justify-start gap-2">
                <FormLabel
                  className={cn(
                    modifiedFields.firstName && 'text-secondary font-medium'
                  )}
                >
                  First Name
                  {modifiedFields.firstName && (
                    <span className="ml-1 text-xs">(Modified)</span>
                  )}
                </FormLabel>
                <FormMessage className="text-xs text-muted-foreground italic" />
              </div>
              <FormControl>
                <Input
                  placeholder="ex: Juana Marie"
                  {...field}
                  className={cn(modifiedFields.firstName && 'border-secondary')}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="middleName"
          render={({ field }) => (
            <FormItem
              className={cn(
                modifiedFields.middleName &&
                  ' border-secondary pl-2 rounded transition-all'
              )}
            >
              <div className="flex flex-row items-center justify-start gap-2">
                <FormLabel
                  className={cn(
                    modifiedFields.middleName && 'text-secondary font-medium'
                  )}
                >
                  Middle Name (Optional)
                  {modifiedFields.middleName && (
                    <span className="ml-1 text-xs">(Modified)</span>
                  )}
                </FormLabel>
                <FormMessage className="text-xs text-muted-foreground italic" />
              </div>
              <FormControl>
                <Input
                  placeholder="ex: Cruz"
                  {...field}
                  className={cn(
                    modifiedFields.middleName && 'border-secondary'
                  )}
                />
              </FormControl>
            </FormItem>
          )}
        />
      </div>
      <FormField
        control={form.control}
        name="lastName"
        render={({ field }) => (
          <FormItem
            className={cn(
              modifiedFields.lastName &&
                ' border-secondary pl-2 rounded transition-all'
            )}
          >
            <div className="flex flex-row items-center justify-start gap-2">
              <FormLabel
                className={cn(
                  modifiedFields.lastName && 'text-secondary font-medium'
                )}
              >
                Last Name
                {modifiedFields.lastName && (
                  <span className="ml-1 text-xs">(Modified)</span>
                )}
              </FormLabel>
              <FormMessage className="text-xs text-muted-foreground italic" />
            </div>
            <FormControl>
              <Input
                placeholder="ex: Del Rosario"
                {...field}
                className={cn(modifiedFields.lastName && 'border-secondary')}
              />
            </FormControl>
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="dateOfBirth"
        render={({ field }) => (
          <CustomDatePicker
            field={field}
            label="Date of Birth"
            placeholder="Pick a date"
            fromYear={1800}
            toYear={new Date().getFullYear()}
            minDate={new Date('1800-01-01')}
            maxDate={new Date()}
            isModified={modifiedFields.dateOfBirth}
          />
        )}
      />
      <FormField
        control={form.control}
        name="sex"
        render={({ field }) => (
          <FormItem
            className={cn(
              modifiedFields.sex &&
                'border-secondary pl-2 rounded transition-all'
            )}
          >
            <div className="flex flex-row items-center justify-start gap-2">
              <FormLabel
                className={cn(
                  modifiedFields.sex && 'text-secondary font-medium'
                )}
              >
                Sex
                {modifiedFields.sex && (
                  <span className="ml-1 text-xs">(Modified)</span>
                )}
              </FormLabel>
              <FormMessage className="text-xs text-muted-foreground italic" />
            </div>
            <FormControl>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
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
                        field.value === option.value ? 'border-primary' : '',
                        modifiedFields.sex &&
                          field.value === option.value &&
                          'hover:bg-secondary/90 bg-secondary text-secondary-foreground'
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
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="address"
        render={({ field }) => (
          <FormItem
            className={cn(
              modifiedFields.address &&
                ' border-secondary pl-2 rounded transition-all'
            )}
          >
            <div className="flex flex-row items-center justify-start gap-2">
              <FormLabel
                className={cn(
                  modifiedFields.address && 'text-secondary font-medium'
                )}
              >
                Address
                {modifiedFields.address && (
                  <span className="ml-1 text-xs">(Modified)</span>
                )}
              </FormLabel>
              <FormMessage className="text-xs text-muted-foreground italic" />
            </div>
            <FormControl>
              <Textarea
                placeholder="123 Main St, City, Country"
                className={cn(
                  'resize-none',
                  modifiedFields.address && 'border-secondary'
                )}
                {...field}
              />
            </FormControl>
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="email"
        render={({ field }) => (
          <FormItem
            className={cn(
              modifiedFields.email &&
                ' border-secondary pl-2 rounded transition-all'
            )}
          >
            <div className="flex flex-row items-center justify-start gap-2">
              <FormLabel
                className={cn(
                  modifiedFields.email && 'text-secondary font-medium'
                )}
              >
                Email (Optional)
                {modifiedFields.email && (
                  <span className="ml-1 text-xs">(Modified)</span>
                )}
              </FormLabel>
              <FormMessage className="text-xs text-muted-foreground italic" />
            </div>
            <FormControl>
              <Input
                type="email"
                placeholder="patient@example.com"
                className={cn(modifiedFields.email && 'border-secondary')}
                {...field}
              />
            </FormControl>
          </FormItem>
        )}
      />
    </>
  );
}
