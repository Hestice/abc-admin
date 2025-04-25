'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { ArrowLeft, Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import { VaccinationCard } from '@/components/schedules/vaccination-card';
import { AntiTetanusCard } from '@/components/schedules/anti-tetanus-card';
import { getSchedule } from '@/utils/get-schedule';
import { transformScheduleData } from '@/utils/transform-schedule';
import { updateVaccinationStatus } from '@/utils/vaccination-updater';

// Define the vaccination schedule structure
interface Vaccination {
  day: number;
  label: string;
  date: Date;
  completed: boolean;
  completedDate?: Date;
  optional?: boolean;
}

interface PatientVaccination {
  id: string;
  patientId: string;
  patientName: string;
  exposureDate: Date;
  vaccinations: Vaccination[];
  antiTetanus: {
    required: boolean;
    administered: boolean;
    date?: Date;
  };
}

interface VaccinationScheduleProps {
  patientId: string;
}

export function VaccinationSchedule({ patientId }: VaccinationScheduleProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [scheduleData, setScheduleData] = useState<PatientVaccination | null>(
    null
  );
  const router = useRouter();

  // Fetch vaccination schedule data
  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        const scheduleResponse = await getSchedule({ setIsLoading, patientId });
        const transformedData = transformScheduleData(scheduleResponse);
        setScheduleData(transformedData);
      } catch (error) {
        console.error('Error fetching vaccination schedule:', error);
        toast({
          title: 'Error',
          description: 'Failed to load vaccination schedule. Please try again.',
          variant: 'destructive',
        });
      }
    };

    fetchSchedule();
  }, [patientId]);

  const handleVaccinationToggle = async (day: number, completed: boolean) => {
    if (!scheduleData) return;

    await updateVaccinationStatus({
      day,
      completed,
      scheduleData,
      setIsSaving,
      patientId,
      setScheduleData,
    });
  };

  // Handle anti-tetanus update
  const handleAntiTetanusUpdate = async () => {};

  // Handle navigation back to patient details
  const handleBack = () => {
    router.push(`/patients/${patientId}`);
  };

  // Calculate next vaccination date
  const getNextVaccinationInfo = () => {
    if (!scheduleData) return null;

    const nextVaccination = scheduleData.vaccinations.find(
      (v) => !v.completed && !v.optional
    );
    if (!nextVaccination) return null;

    return {
      day: nextVaccination.day,
      date: nextVaccination.date,
    };
  };

  const nextVaccination = getNextVaccinationInfo();

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center p-6">
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">
              Loading vaccination schedule...
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!scheduleData) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">
            <p className="mb-4">
              No vaccination schedule found for this patient.
            </p>
            <Button onClick={handleBack}>Back to Patient Details</Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <Button variant="outline" size="sm" onClick={handleBack}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Patient
          </Button>
        </div>
        <div className="flex flex-col sm:items-end">
          <p className="text-sm font-medium">
            Patient:{' '}
            <span className="font-bold">{scheduleData.patientName}</span>
          </p>
          <p className="text-sm text-muted-foreground">
            Exposure Date: {format(scheduleData.exposureDate, 'MMMM d, yyyy')}
          </p>
          {nextVaccination && (
            <p className="text-sm mt-1">
              <span className="font-medium text-primary">
                Next vaccination:
              </span>{' '}
              Day {nextVaccination.day} (
              {format(nextVaccination.date, 'MMMM d, yyyy')})
            </p>
          )}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* Anti-Tetanus Card (First) */}
        <AntiTetanusCard
          antiTetanus={scheduleData.antiTetanus}
          onUpdate={handleAntiTetanusUpdate}
          disabled={isSaving}
        />

        {/* Vaccination Cards */}
        {scheduleData.vaccinations.map((vaccination) => (
          <VaccinationCard
            key={vaccination.day}
            vaccination={vaccination}
            onToggleStatus={(completed) =>
              handleVaccinationToggle(vaccination.day, completed)
            }
            disabled={isSaving}
          />
        ))}
      </div>
    </div>
  );
}
