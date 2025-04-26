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
import { FormValues, statusOptions } from './schema';
import { CategoryLabels } from '@/enums/category';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@radix-ui/react-popover';
import { format } from 'date-fns';
import { Card } from '../ui/card';
import { CalendarNav } from '../ui/calendar-nav';
import { CalendarIcon } from 'lucide-react';
import { ButtonGroup } from '../ui/button-group';

interface ExposureDetailsStepProps {
  form: UseFormReturn<FormValues>;
  modifiedFields?: Record<string, boolean>;
}

export function ExposureDetailsStep({
  form,
  modifiedFields = {},
}: ExposureDetailsStepProps) {
  return (
    <>
      <FormField
        control={form.control}
        name="category"
        render={({ field }) => (
          <FormItem
            className={cn(
              modifiedFields.category &&
                'border-secondary pl-2 rounded transition-all'
            )}
          >
            <div className="flex flex-row items-center justify-start gap-2">
              <FormLabel
                className={cn(
                  modifiedFields.category && 'text-secondary font-medium'
                )}
              >
                Bite Category
                {modifiedFields.category && (
                  <span className="ml-1 text-xs">(Modified)</span>
                )}
              </FormLabel>
              <FormMessage className="text-xs text-muted-foreground italic" />
            </div>
            <FormControl>
              <div className="space-y-3">
                {Object.entries(CategoryLabels).map(([value, label]) => (
                  <Button
                    key={value}
                    type="button"
                    variant={
                      field.value === Number(value)
                        ? modifiedFields.category
                          ? 'secondary'
                          : 'default'
                        : 'outline'
                    }
                    className="w-full justify-start text-left h-auto py-3 px-4 group"
                    onClick={() => field.onChange(Number(value))}
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className={cn(
                          'w-5 h-5 rounded-full border flex items-center justify-center group-hover:border-accent ',
                          field.value === Number(value)
                            ? modifiedFields.category
                              ? 'border-secondary-foreground bg-secondary-foreground text-background'
                              : 'border-primary-foreground bg-primary-foreground text-background'
                            : 'border-muted-foreground'
                        )}
                      >
                        {field.value === Number(value) && (
                          <div
                            className={cn(
                              'w-2.5 h-2.5 rounded-full',
                              modifiedFields.category
                                ? 'bg-secondary'
                                : 'bg-primary'
                            )}
                          />
                        )}
                      </div>
                      <div className="flex flex-col">
                        <span
                          className={cn(
                            'font-medium group-hover:text-accent',
                            modifiedFields.category &&
                              field.value === Number(value) &&
                              'group-hover:text-secondary-foreground',
                            field.value === Number(value) &&
                              'group-hover:text-background'
                          )}
                        >
                          Category {value}
                        </span>
                        <span
                          className={cn(
                            'text-xs text-muted-foreground group-hover:text-accent',
                            field.value === Number(value) && 'text-background',
                            modifiedFields.category &&
                              field.value === Number(value) &&
                              'group-hover:text-secondary-foreground',
                            field.value === Number(value) &&
                              'group-hover:text-background'
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
          <FormItem
            className={cn(
              modifiedFields.bodyPartsAffected &&
                'border-secondary pl-2 rounded transition-all'
            )}
          >
            <div className="flex flex-row items-center justify-start gap-2">
              <FormLabel
                className={cn(
                  modifiedFields.bodyPartsAffected &&
                    'text-secondary font-medium'
                )}
              >
                Body Parts Affected
                {modifiedFields.bodyPartsAffected && (
                  <span className="ml-1 text-xs">(Modified)</span>
                )}
              </FormLabel>
              <FormMessage className="text-xs text-muted-foreground italic" />
            </div>
            <FormControl>
              <Input
                placeholder="Hand, arm, leg, etc."
                {...field}
                className={cn(
                  modifiedFields.bodyPartsAffected && 'border-secondary'
                )}
              />
            </FormControl>
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="dateOfExposure"
        render={({ field }) => (
          <FormItem
            className={cn(
              'flex flex-col',
              modifiedFields.dateOfExposure &&
                'border-secondary pl-2 rounded transition-all'
            )}
          >
            <div className="flex flex-row items-center justify-start gap-2">
              <FormLabel
                className={cn(
                  modifiedFields.dateOfExposure && 'text-secondary font-medium'
                )}
              >
                Date of Exposure
                {modifiedFields.dateOfExposure && (
                  <span className="ml-1 text-xs">(Modified)</span>
                )}
              </FormLabel>
              <FormMessage className="text-xs text-muted-foreground italic" />
            </div>
            <Popover>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    variant={
                      modifiedFields.dateOfExposure ? 'secondary' : 'outline'
                    }
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
                <Card>
                  <CalendarNav
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    initialFocus
                  />
                </Card>
              </PopoverContent>
            </Popover>
          </FormItem>
        )}
      />
      <div className="w-full space-y-2">
        <div className="flex flex-row items-center justify-start gap-2">
          <FormLabel
            className={cn(
              modifiedFields.isExposureAtHome && 'text-secondary font-medium'
            )}
          >
            Place of Exposure
            {modifiedFields.isExposureAtHome && (
              <span className="ml-1 text-xs">(Modified)</span>
            )}
          </FormLabel>
        </div>

        <FormField
          control={form.control}
          name="isExposureAtHome"
          render={({ field }) => (
            <FormItem
              className={cn(
                'flex flex-row items-start space-x-3 space-y-0 mt-1',
                modifiedFields.isExposureAtHome &&
                  'border-secondary pl-2 rounded transition-all'
              )}
            >
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  className={cn(
                    modifiedFields.isExposureAtHome &&
                      'border-secondary data-[state=checked]:bg-secondary'
                  )}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel
                  className={cn(
                    modifiedFields.isExposureAtHome &&
                      'text-secondary font-medium'
                  )}
                >
                  Exposure Occurred at Home
                </FormLabel>
                <FormDescription>
                  Check if the exposure happened at the patient's residence
                </FormDescription>
              </div>
            </FormItem>
          )}
        />

        {!form.watch('isExposureAtHome') && (
          <FormField
            control={form.control}
            name="placeOfExposure"
            render={({ field }) => (
              <FormItem
                className={cn(
                  modifiedFields.placeOfExposure &&
                    'border-secondary pl-2 rounded transition-all'
                )}
              >
                <FormControl>
                  <Input
                    placeholder="Park, school, etc."
                    {...field}
                    className={cn(
                      modifiedFields.placeOfExposure && 'border-secondary'
                    )}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
      </div>
      <FormField
        control={form.control}
        name="sourceOfExposure"
        render={({ field }) => (
          <FormItem
            className={cn(
              modifiedFields.sourceOfExposure &&
                'border-secondary pl-2 rounded transition-all'
            )}
          >
            <div className="flex flex-row items-center justify-start gap-2">
              <FormLabel
                className={cn(
                  modifiedFields.sourceOfExposure &&
                    'text-secondary font-medium'
                )}
              >
                Source of Exposure
                {modifiedFields.sourceOfExposure && (
                  <span className="ml-1 text-xs">(Modified)</span>
                )}
              </FormLabel>
              <FormMessage className="text-xs text-muted-foreground italic" />
            </div>
            <FormControl>
              <Input
                placeholder="Dog, Cat, Hamster, etc."
                {...field}
                className={cn(
                  modifiedFields.sourceOfExposure && 'border-secondary'
                )}
              />
            </FormControl>
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="animalStatus"
        render={({ field }) => (
          <FormItem
            className={cn(
              modifiedFields.animalStatus &&
                'border-secondary pl-2 rounded transition-all'
            )}
          >
            <div className="flex flex-row items-center justify-start gap-2">
              <FormLabel
                className={cn(
                  modifiedFields.animalStatus && 'text-secondary font-medium'
                )}
              >
                Status of Animal
                {modifiedFields.animalStatus && (
                  <span className="ml-1 text-xs">(Modified)</span>
                )}
              </FormLabel>
              <FormMessage className="text-xs text-muted-foreground italic" />
            </div>
            <FormControl>
              <ButtonGroup
                options={statusOptions}
                value={field.value}
                onChange={field.onChange}
                name={field.name}
                className={cn(
                  modifiedFields.animalStatus && 'border-secondary'
                )}
                isModified={modifiedFields.animalStatus}
              />
            </FormControl>
            <FormDescription>
              Specify the current status of the animal that caused the exposure
            </FormDescription>
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="isWoundCleaned"
        render={({ field }) => (
          <FormItem
            className={cn(
              modifiedFields.isWoundCleaned &&
                'border-secondary pl-2 rounded transition-all'
            )}
          >
            <div className="flex flex-row items-center justify-start gap-2">
              <FormLabel
                className={cn(
                  modifiedFields.isWoundCleaned && 'text-secondary font-medium'
                )}
              >
                Was the Wound Cleaned?
                {modifiedFields.isWoundCleaned && (
                  <span className="ml-1 text-xs">(Modified)</span>
                )}
              </FormLabel>
              <FormMessage className="text-xs text-muted-foreground italic" />
            </div>
            <FormControl>
              <div className="flex gap-4">
                <Button
                  type="button"
                  variant={
                    field.value
                      ? modifiedFields.isWoundCleaned
                        ? 'secondary'
                        : 'default'
                      : 'outline'
                  }
                  className="w-full"
                  onClick={() => field.onChange(true)}
                >
                  Yes, the wound was cleaned properly.
                </Button>
                <Button
                  type="button"
                  variant={
                    !field.value
                      ? modifiedFields.isWoundCleaned
                        ? 'secondary'
                        : 'default'
                      : 'outline'
                  }
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
