'use client';

import { format } from 'date-fns';
import { Check, X, Calendar, Clock, CheckCircle2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

interface Vaccination {
  day: number;
  label: string;
  date: Date;
  completed: boolean;
  completedDate?: Date;
  optional?: boolean;
}

interface VaccinationCardProps {
  vaccination: Vaccination;
  onToggleStatus: (completed: boolean) => void;
  disabled?: boolean;
}

export function VaccinationCard({
  vaccination,
  onToggleStatus,
  disabled = false,
}: VaccinationCardProps) {
  return (
    <Card
      className={cn(
        vaccination.completed ? 'border-green-200 bg-green-50' : ''
      )}
    >
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-2">
            <div>
              <CardTitle className="text-lg">Day {vaccination.day}</CardTitle>
              <CardDescription>{vaccination.label}</CardDescription>
            </div>
            {vaccination.optional && (
              <Badge variant="outline" className="text-xs">
                Optional
              </Badge>
            )}
          </div>
          {vaccination.completed ? (
            <div className="rounded-full bg-green-100 p-1">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
            </div>
          ) : (
            <div className="rounded-full bg-amber-100 p-1">
              <Clock className="h-5 w-5 text-amber-600" />
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex items-center text-sm">
            <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
            <span>Scheduled: {format(vaccination.date, 'MMMM d, yyyy')}</span>
          </div>
          {vaccination.completed && vaccination.completedDate && (
            <div className="flex items-center text-sm text-green-600">
              <Check className="mr-2 h-4 w-4" />
              <span>
                Completed: {format(vaccination.completedDate, 'MMMM d, yyyy')}
              </span>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-end pt-2">
        <Button
          variant={vaccination.completed ? 'destructive' : 'default'}
          size="sm"
          onClick={() => onToggleStatus(!vaccination.completed)}
          disabled={disabled}
        >
          {vaccination.completed ? (
            <>
              <X className="mr-1 h-4 w-4" /> Mark Incomplete
            </>
          ) : (
            <>
              <Check className="mr-1 h-4 w-4" /> Mark Complete
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
