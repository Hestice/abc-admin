import { toast } from '@/hooks/use-toast';
import { updateVaccination } from '@/utils/update-vaccination';
import { mapDayToVaccinationDay } from '@/utils/transform-schedule';
import { PatientVaccination } from '@/types/vaccinations';
interface VaccinationUpdateParams {
  day: number;
  completed: boolean;
  scheduleData: PatientVaccination;
  setIsSaving: (isSaving: boolean) => void;
  patientId: string;
  setScheduleData: (data: PatientVaccination) => void;
}

export async function updateVaccinationStatus({
  day,
  completed,
  scheduleData,
  setIsSaving,
  patientId,
  setScheduleData,
}: VaccinationUpdateParams): Promise<void> {
  if (!scheduleData) return;

  setIsSaving(true);
  try {
    if (completed) {
      const vaccinationDay = mapDayToVaccinationDay(day);

      // Update vaccination in the backend
      await updateVaccination({
        setIsLoading: setIsSaving,
        patientId,
        vaccinationDay,
      });
    }

    // Update local state
    const updatedVaccinations = scheduleData.vaccinations.map((vaccination) => {
      if (vaccination.day === day) {
        return {
          ...vaccination,
          completed,
          completedDate: completed ? new Date() : undefined,
        };
      }
      return vaccination;
    });

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
}

/**
 * Updates anti-tetanus information
 */
export async function updateAntiTetanusStatus({
  administered,
  date,
  scheduleData,
  setIsSaving,
  setScheduleData,
}: {
  administered: boolean;
  date?: Date;
  scheduleData: PatientVaccination;
  setIsSaving: (isSaving: boolean) => void;
  setScheduleData: (data: PatientVaccination) => void;
}): Promise<void> {
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
}
