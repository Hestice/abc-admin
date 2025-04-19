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
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';
import { FormValues } from './schema';

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
                  if (!checked) {
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

      {/* Date of Anti-Tetanus field with smooth transition */}
      <div
        className={cn(
          'grid transition-all duration-300 ease-in-out',
          !form.watch('antiTetanusGiven')
            ? 'grid-rows-[0fr] opacity-0 invisible h-0 my-0'
            : 'grid-rows-[1fr] opacity-100 visible h-auto my-4'
        )}
      >
        <div className="overflow-hidden">
          <FormField
            control={form.control}
            name="dateOfAntiTetanus"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Date of Anti-Tetanus</FormLabel>
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
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) => date > new Date()}
                      initialFocus
                      captionLayout="dropdown-buttons"
                      fromYear={1900}
                      toYear={new Date().getFullYear()}
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>

      <FormField
        control={form.control}
        name="briefHistory"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Brief History</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Describe how the incident occurred"
                className="resize-none"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Allergies field with "None" checkbox */}
      <div className="space-y-4">
        <FormField
          control={form.control}
          name="noAllergies"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-4">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>No Allergies</FormLabel>
                <FormDescription>
                  Check if patient has no known allergies
                </FormDescription>
              </div>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="allergy"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Allergies</FormLabel>
              <FormControl>
                <Input
                  placeholder="List allergies"
                  {...field}
                  disabled={form.watch('noAllergies')}
                  className={cn(form.watch('noAllergies') && 'opacity-50')}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* Medications field with "None" checkbox */}
      <div className="space-y-4">
        <FormField
          control={form.control}
          name="noMedications"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-4">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>No Medications</FormLabel>
                <FormDescription>
                  Check if patient is not taking any medications
                </FormDescription>
              </div>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="medications"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Current Medications</FormLabel>
              <FormControl>
                <Input
                  placeholder="List medications"
                  {...field}
                  disabled={form.watch('noMedications')}
                  className={cn(form.watch('noMedications') && 'opacity-50')}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </>
  );
}
