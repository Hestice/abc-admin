import { format } from 'date-fns';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PatientVaccination } from '@/types/vaccinations';

interface VaccinationHeaderProps {
  scheduleData: PatientVaccination;
  nextVaccination: { day: number; date: Date } | null;
  onBack: () => void;
}

export function VaccinationHeader({
  scheduleData,
  nextVaccination,
  onBack,
}: VaccinationHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <Button variant="outline" size="sm" onClick={onBack}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Patient
        </Button>
      </div>
      <div className="flex flex-col sm:items-end">
        <p className="text-sm font-medium">
          Patient: <span className="font-bold">{scheduleData.patientName}</span>
        </p>
        <p className="text-sm text-muted-foreground">
          Exposure Date: {format(scheduleData.exposureDate, 'MMMM d, yyyy')}
        </p>
        {nextVaccination && (
          <p className="text-sm mt-1">
            <span className="font-medium text-primary">Next vaccination:</span>{' '}
            Day {nextVaccination.day} (
            {format(nextVaccination.date, 'MMMM d, yyyy')})
          </p>
        )}
      </div>
    </div>
  );
}
