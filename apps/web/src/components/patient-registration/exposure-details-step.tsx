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
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';
import { FormValues } from './schema';
import { CategoryLabels } from '@/enums/category';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@radix-ui/react-popover';
import { format } from 'date-fns';
import { Card } from '../ui/card';
import { CalendarNav } from '../ui/calendar-nav';

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
            <div className="flex flex-row items-center justify-start gap-2">
              <FormLabel>Bite Category</FormLabel>
              <FormMessage className="text-xs text-muted-foreground italic" />
            </div>
            <FormControl>
              <div className="space-y-3">
                {Object.entries(CategoryLabels).map(([value, label]) => (
                  <Button
                    key={value}
                    type="button"
                    variant={
                      field.value === Number(value) ? 'default' : 'outline'
                    }
                    className="w-full justify-start text-left h-auto py-3 px-4 group"
                    onClick={() => field.onChange(Number(value))}
                  >
                    <div className="flex items-center gap-2 group-hover:text-background">
                      <div
                        className={cn(
                          'w-5 h-5 rounded-full border flex items-center justify-center group-hover:border-background ',
                          field.value === Number(value)
                            ? 'border-primary-foreground bg-primary-foreground text-background'
                            : 'border-muted-foreground'
                        )}
                      >
                        {field.value === Number(value) && (
                          <div className="w-2.5 h-2.5 rounded-full bg-primary " />
                        )}
                      </div>
                      <div className="flex flex-col">
                        <span className="font-medium group-hover:text-background">
                          Category {value}
                        </span>
                        <span
                          className={cn(
                            'text-xs text-muted-foreground group-hover:text-background',
                            field.value === Number(value) && 'text-background'
                          )}
                        >
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
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="bodyPartsAffected"
        render={({ field }) => (
          <FormItem>
            <div className="flex flex-row items-center justify-start gap-2">
              <FormLabel>Body Parts Affected</FormLabel>
              <FormMessage className="text-xs text-muted-foreground italic" />
            </div>
            <FormControl>
              <Input placeholder="Hand, arm, leg, etc." {...field} />
            </FormControl>
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="dateOfExposure"
        render={({ field }) => (
          <FormItem>
            <div className="flex flex-row items-center justify-start gap-2">
              <FormLabel>Date of Exposure</FormLabel>
              <FormMessage className="text-xs text-muted-foreground italic" />
            </div>
            <FormControl>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      'w-full pl-3 text-left font-normal justify-between',
                      !field.value && 'text-muted-foreground'
                    )}
                  >
                    {field.value ? (
                      format(field.value, 'PPP')
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Card className="w-full">
                    <CalendarNav
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      initialFocus
                    />
                  </Card>
                </PopoverContent>
              </Popover>
            </FormControl>
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="placeOfExposure"
        render={({ field }) => (
          <FormItem className="w-full space-y-2">
            <div className="flex flex-row items-center justify-start gap-2">
              <FormLabel>Place of Exposure</FormLabel>
              <FormMessage className="text-xs text-muted-foreground italic" />
            </div>
            <div className="flex flex-col space-y-3">
              <div className="flex items-start space-x-3">
                <Checkbox
                  id="exposureAtHome"
                  checked={field.value === 'Home'}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      field.onChange('Home');
                    } else {
                      field.onChange('');
                    }
                  }}
                />
                <div className="space-y-1 leading-none">
                  <label
                    htmlFor="exposureAtHome"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Exposure Occurred at Home
                  </label>
                  <p className="text-xs text-muted-foreground">
                    Check if the exposure happened at the patient's residence
                  </p>
                </div>
              </div>

              {field.value !== 'Home' && (
                <FormControl>
                  <Input placeholder="Park, school, etc." {...field} />
                </FormControl>
              )}
            </div>
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="sourceOfExposure"
        render={({ field }) => (
          <FormItem>
            <div className="flex flex-row items-center justify-start gap-2">
              <FormLabel>Source of Exposure</FormLabel>
              <FormMessage className="text-xs text-muted-foreground italic" />
            </div>
            <FormControl>
              <Input placeholder="Dog, cat, etc." {...field} />
            </FormControl>
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="isWoundCleaned"
        render={({ field }) => (
          <FormItem>
            <div className="flex flex-row items-center justify-start gap-2">
              <FormLabel>Was the Wound Cleaned?</FormLabel>
              <FormMessage className="text-xs text-muted-foreground italic" />
            </div>
            <FormControl>
              <div className="flex gap-4">
                <Button
                  type="button"
                  variant={field.value ? 'default' : 'outline'}
                  className="w-full"
                  onClick={() => field.onChange(true)}
                >
                  Yes, the wound was cleaned properly.
                </Button>
                <Button
                  type="button"
                  variant={!field.value ? 'default' : 'outline'}
                  className="w-full"
                  onClick={() => field.onChange(false)}
                >
                  No, the wound was not cleaned at all.
                </Button>
              </div>
            </FormControl>
            <FormDescription>
              Indicate if the wound was cleaned before arrival
            </FormDescription>
          </FormItem>
        )}
      />
    </>
  );
}
