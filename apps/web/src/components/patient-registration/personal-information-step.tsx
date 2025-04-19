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
}

export function PersonalInformationStep({
  form,
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
            <div className="flex flex-row items-center justify-start gap-2">
              <FormLabel>Last Name</FormLabel>
              <FormMessage className="text-xs text-muted-foreground italic" />
            </div>
            <FormControl>
              <Input placeholder="Doe" {...field} />
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
          />
        )}
      />
      <FormField
        control={form.control}
        name="sex"
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              Sex
              <FormMessage />
            </FormLabel>
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
