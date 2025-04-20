import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { UseFormReturn } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';
import { FormValues } from './schema';
import { CalendarNav } from '../ui/calendar-nav';

interface MedicalInformationStepProps {
  form: UseFormReturn<FormValues>;
}

export function MedicalInformationStep({ form }: MedicalInformationStepProps) {
  return (
    <>
      <FormField
        control={form.control}
        name="antiTetanusGiven"
        render={({ field }) => (
          <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
            <FormControl>
              <Checkbox
                checked={field.value}
                onCheckedChange={(checked) => {
                  field.onChange(checked);
                  if (checked) {
                    form.setValue('dateOfAntiTetanus', new Date());
                  } else {
                    form.setValue('dateOfAntiTetanus', undefined);
                  }
                }}
              />
            </FormControl>
            <div className="space-y-1 leading-none">
              <FormLabel>Anti-Tetanus Given</FormLabel>
              <FormDescription>
                Check if anti-tetanus vaccine was administered
              </FormDescription>
            </div>
          </FormItem>
        )}
      />

      {form.watch('antiTetanusGiven') && (
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="dateOfAntiTetanus"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <div className="flex flex-row items-center justify-start gap-2">
                  <FormLabel>Date of Anti-Tetanus shot given</FormLabel>
                  <FormMessage className="text-xs text-muted-foreground italic" />
                </div>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={'outline'}
                        className={cn(
                          'w-full pl-3 text-left font-normal',
                          !field.value && 'text-muted-foreground'
                        )}
                      >
                        {field.value ? (
                          format(field.value, 'PPP')
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <CalendarNav
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </FormItem>
            )}
          />
        </div>
      )}

      <FormField
        control={form.control}
        name="briefHistory"
        render={({ field }) => (
          <FormItem>
            <div className="flex flex-row items-center justify-start gap-2">
              <FormLabel>Brief History</FormLabel>
              <FormMessage className="text-xs text-muted-foreground italic" />
            </div>
            <FormControl>
              <Textarea
                placeholder="Describe how the incident occurred"
                className="resize-none"
                {...field}
              />
            </FormControl>
          </FormItem>
        )}
      />

      {/* Allergies field with single checkbox */}
      <div className="space-y-4">
        <FormField
          control={form.control}
          name="allergy"
          render={({ field }) => (
            <FormItem>
              <div className="flex flex-row items-center justify-start gap-2">
                <FormLabel>Allergies</FormLabel>
                <FormMessage className="text-xs text-muted-foreground italic" />
              </div>
              <FormControl>
                <Input
                  placeholder="List allergies"
                  {...field}
                  disabled={field.value === 'none'}
                  className={cn(field.value === 'none' && 'opacity-50')}
                />
              </FormControl>
              <div className="flex flex-row items-center space-x-3 mb-2">
                <Checkbox
                  checked={field.value === 'none'}
                  onCheckedChange={(checked) => {
                    field.onChange(checked ? 'none' : '');
                  }}
                  id="no-allergies"
                />
                <label
                  htmlFor="no-allergies"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Check if no known allergies
                </label>
              </div>
            </FormItem>
          )}
        />
      </div>

      {/* Medications field with single checkbox */}
      <div className="space-y-4">
        <FormField
          control={form.control}
          name="medications"
          render={({ field }) => (
            <FormItem>
              <div className="flex flex-row items-center justify-start gap-2">
                <FormLabel>Current Medications</FormLabel>
                <FormMessage className="text-xs text-muted-foreground italic" />
              </div>
              <FormControl>
                <Input
                  placeholder="List medications"
                  {...field}
                  disabled={field.value === 'none'}
                  className={cn(field.value === 'none' && 'opacity-50')}
                />
              </FormControl>
              <div className="flex flex-row items-center space-x-3 mb-2">
                <Checkbox
                  checked={field.value === 'none'}
                  onCheckedChange={(checked) => {
                    field.onChange(checked ? 'none' : '');
                  }}
                  id="no-medications"
                />
                <label
                  htmlFor="no-medications"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Check if no medications
                </label>
              </div>
            </FormItem>
          )}
        />
      </div>
    </>
  );
}
