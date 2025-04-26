'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import { Calendar, Syringe, Check, X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';

interface AntiTetanusProps {
  administered: boolean;
  date?: Date;
}

interface AntiTetanusCardProps {
  antiTetanus: AntiTetanusProps;
  onUpdate: (administered: boolean, date?: Date) => void;
  disabled?: boolean;
}

export function AntiTetanusCard({
  antiTetanus,
  onUpdate,
  disabled = false,
}: AntiTetanusCardProps) {
  const [date, setDate] = useState<Date | undefined>(antiTetanus.date);

  const handleDateChange = (newDate: Date | undefined) => {
    setDate(newDate);
    if (newDate) {
      onUpdate(true, newDate);
    }
  };

  const handleToggle = () => {
    if (antiTetanus.administered) {
      // If currently administered, mark as not administered
      onUpdate(false, undefined);
      setDate(undefined);
    } else {
      // If not administered, mark as administered with today's date
      const today = new Date();
      onUpdate(true, today);
      setDate(today);
    }
  };

  return (
    <Card
      className={cn(
        antiTetanus.administered ? 'border-blue-200 bg-blue-50' : ''
      )}
    >
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">Anti-Tetanus</CardTitle>
            <CardDescription>Tetanus toxoid vaccination</CardDescription>
          </div>
          <div className="rounded-full bg-blue-100 p-1">
            <Syringe className="h-5 w-5 text-blue-600" />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {antiTetanus.administered && date ? (
            <div className="flex items-center text-sm text-blue-600">
              <Check className="mr-2 h-4 w-4" />
              <span>Administered on: {format(date, 'MMMM d, yyyy')}</span>
            </div>
          ) : (
            <div className="flex items-center text-sm text-muted-foreground">
              <X className="mr-2 h-4 w-4" />
              <span>Not yet administered</span>
            </div>
          )}

          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start text-left font-normal"
              >
                <Calendar className="mr-2 h-4 w-4" />
                {date ? format(date, 'PPP') : 'Select administration date'}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <CalendarComponent
                mode="single"
                selected={date}
                onSelect={handleDateChange}
                disabled={(date) => date > new Date()}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      </CardContent>
      <CardFooter className="pt-2">
        <Button
          variant={antiTetanus.administered ? 'destructive' : 'default'}
          className="w-full"
          onClick={handleToggle}
          disabled={disabled}
        >
          {antiTetanus.administered ? (
            <>
              <X className="mr-1 h-4 w-4" /> Mark as Not Administered
            </>
          ) : (
            <>
              <Check className="mr-1 h-4 w-4" /> Mark as Administered Today
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
