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
import { updateVaccination } from '@/utils/update-vaccination';
import { VaccinationDay } from '@/types/schedule';

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
        console.log('scheduleResponse: ', scheduleResponse);
        // Map schedule data to PatientVaccination structure
        const transformedData: PatientVaccination = {
          id: scheduleResponse.id,
          patientId: scheduleResponse.patientId,
          patientName: 'Patient', // This should be fetched from API or passed as prop
          exposureDate: new Date(scheduleResponse.day0Date),
          vaccinations: [
            {
              day: 0,
              label: 'First Dose',
              date: new Date(scheduleResponse.day0Date),
              completed: scheduleResponse.day0Completed,
              completedDate: scheduleResponse.day0CompletedAt
                ? new Date(scheduleResponse.day0CompletedAt)
                : undefined,
            },
            {
              day: 3,
              label: 'Second Dose',
              date: new Date(scheduleResponse.day3Date),
              completed: scheduleResponse.day3Completed,
              completedDate: scheduleResponse.day3CompletedAt
                ? new Date(scheduleResponse.day3CompletedAt)
                : undefined,
            },
            {
              day: 7,
              label: 'Third Dose',
              date: new Date(scheduleResponse.day7Date),
              completed: scheduleResponse.day7Completed,
              completedDate: scheduleResponse.day7CompletedAt
                ? new Date(scheduleResponse.day7CompletedAt)
                : undefined,
            },
            {
              day: 28,
              label: 'Fourth Dose',
              date: new Date(scheduleResponse.day28Date),
              completed: scheduleResponse.day28Completed,
              completedDate: scheduleResponse.day28CompletedAt
                ? new Date(scheduleResponse.day28CompletedAt)
                : undefined,
              optional: true,
            },
          ],
          antiTetanus: {
            required: true,
            administered: false, // This should come from API
            date: undefined,
          },
        };

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

  // Handle vaccination status toggle
  const handleVaccinationToggle = async (day: number, completed: boolean) => {
    if (!scheduleData) return;

    setIsSaving(true);
    try {
      if (completed) {
        let vaccinationDay;

        // Map the day number to VaccinationDay enum
        switch (day) {
          case 0:
            vaccinationDay = VaccinationDay.DAY_0;
            break;
          case 3:
            vaccinationDay = VaccinationDay.DAY_3;
            break;
          case 7:
            vaccinationDay = VaccinationDay.DAY_7;
            break;
          case 28:
            vaccinationDay = VaccinationDay.DAY_28;
            break;
          default:
            throw new Error(`Invalid vaccination day: ${day}`);
        }

        // Update vaccination in the backend
        await updateVaccination({
          setIsLoading: setIsSaving,
          patientId,
          vaccinationDay,
        });
      }

      // Update local state
      const updatedVaccinations = scheduleData.vaccinations.map(
        (vaccination) => {
          if (vaccination.day === day) {
            return {
              ...vaccination,
              completed,
              completedDate: completed ? new Date() : undefined,
            };
          }
          return vaccination;
        }
      );

      setScheduleData({
        ...scheduleData,
        vaccinations: updatedVaccinations,
      });

      toast({
        title: completed
          ? 'Vaccination Completed'
          : 'Vaccination Marked as Incomplete',
        description: `Day ${day} vaccination has been updated successfully.`,
      });
    } catch (error) {
      console.error('Error updating vaccination status:', error);
      toast({
        title: 'Error',
        description: 'Failed to update vaccination status. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Handle anti-tetanus update
  const handleAntiTetanusUpdate = async (
    administered: boolean,
    date?: Date
  ) => {
    if (!scheduleData) return;

    setIsSaving(true);
    try {
      // In a real app, this would be an API call
      // await fetch(`/api/patients/${patientId}/anti-tetanus`, {
      //   method: 'PUT',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ administered, date }),
      // })

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Update local state
      setScheduleData({
        ...scheduleData,
        antiTetanus: {
          ...scheduleData.antiTetanus,
          administered,
          date,
        },
      });

      toast({
        title: 'Anti-Tetanus Updated',
        description: 'Anti-tetanus information has been updated successfully.',
      });
    } catch (error) {
      console.error('Error updating anti-tetanus status:', error);
      toast({
        title: 'Error',
        description:
          'Failed to update anti-tetanus information. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

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
