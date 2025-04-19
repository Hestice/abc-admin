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
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';
import { FormValues } from './schema';
import { CategoryLabels } from '@/enums/category';

interface ExposureDetailsStepProps {
  form: UseFormReturn<FormValues>;
}

export function ExposureDetailsStep({ form }: ExposureDetailsStepProps) {
  return (
    <>
      <FormField
        control={form.control}
        name="category"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Bite Category</FormLabel>
            <FormControl>
              <div className="space-y-3">
                {Object.entries(CategoryLabels).map(([value, label]) => (
                  <Button
                    key={value}
                    type="button"
                    variant={
                      field.value === Number(value) ? 'default' : 'outline'
                    }
                    className="w-full justify-start text-left h-auto py-3 px-4"
                    onClick={() => field.onChange(Number(value))}
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className={cn(
                          'w-5 h-5 rounded-full border flex items-center justify-center',
                          field.value === Number(value)
                            ? 'border-primary-foreground bg-primary-foreground'
                            : 'border-muted-foreground'
                        )}
                      >
                        {field.value === Number(value) && (
                          <div className="w-2.5 h-2.5 rounded-full bg-primary" />
                        )}
                      </div>
                      <div className="flex flex-col">
                        <span className="font-medium">Category {value}</span>
                        <span className="text-xs text-muted-foreground">
                          {label.split(' - ')[1]}
                        </span>
                      </div>
                    </div>
                  </Button>
                ))}
              </div>
            </FormControl>
            <FormDescription>
              Select the appropriate category based on the exposure severity
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="bodyPartsAffected"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Body Parts Affected</FormLabel>
            <FormControl>
              <Input placeholder="Hand, arm, leg, etc." {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="dateOfExposure"
        render={({ field }) => (
          <FormItem className="flex flex-col">
            <FormLabel>Date of Exposure</FormLabel>
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
      <FormField
        control={form.control}
        name="isExposureAtHome"
        render={({ field }) => (
          <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
            <FormControl>
              <Checkbox
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>
            <div className="space-y-1 leading-none">
              <FormLabel>Exposure Occurred at Home</FormLabel>
              <FormDescription>
                Check if the exposure happened at the patient's residence
              </FormDescription>
            </div>
          </FormItem>
        )}
      />

      {/* Place of Exposure field with smooth transition */}
      <div
        className={cn(
          'grid transition-all duration-300 ease-in-out',
          form.watch('isExposureAtHome')
            ? 'grid-rows-[0fr] opacity-0 invisible h-0 my-0'
            : 'grid-rows-[1fr] opacity-100 visible h-auto my-4'
        )}
      >
        <div className="overflow-hidden">
          <FormField
            control={form.control}
            name="placeOfExposure"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Place of Exposure</FormLabel>
                <FormControl>
                  <Input placeholder="Park, school, etc." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>

      <FormField
        control={form.control}
        name="sourceOfExposure"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Source of Exposure</FormLabel>
            <FormControl>
              <Input placeholder="Dog, cat, etc." {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="isWoundCleaned"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Was the Wound Cleaned?</FormLabel>
            <FormControl>
              <div className="flex gap-4">
                <Button
                  type="button"
                  variant={field.value ? 'default' : 'outline'}
                  className="w-full"
                  onClick={() => field.onChange(true)}
                >
                  Yes
                </Button>
                <Button
                  type="button"
                  variant={!field.value ? 'default' : 'outline'}
                  className="w-full"
                  onClick={() => field.onChange(false)}
                >
                  No
                </Button>
              </div>
            </FormControl>
            <FormDescription>
              Indicate if the wound was cleaned before arrival
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
}
