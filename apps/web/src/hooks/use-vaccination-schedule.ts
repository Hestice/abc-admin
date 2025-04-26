import { useState, useEffect } from 'react';
import { toast } from '@/hooks/use-toast';
import { getSchedule } from '@/utils/get-schedule';
import { transformScheduleData } from '@/utils/transform-schedule';
import { updateVaccinationStatus } from '@/utils/vaccination-updater';
import { getPatient } from '@/utils/get-patients';
import { PatientVaccination } from '@/types/vaccinations';
import { updatePatientAntiTetanus } from '@/utils/update-patient';

export function useVaccinationSchedule(patientId: string) {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [scheduleData, setScheduleData] = useState<PatientVaccination | null>(
    null
  );

  // Fetch vaccination schedule data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        // Get patient data first
        const patientResponse = await getPatient({
          setIsLoading: () => {},
          patientId,
        });
        const patientData = patientResponse.patient;

        if (!patientData || !patientData.id) {
          throw new Error('Patient data not available');
        }

        // Use the retrieved patient data directly
        const scheduleResponse = await getSchedule({
          setIsLoading: () => {},
          patientId: patientData.id,
        });

        const transformedData = transformScheduleData(
          scheduleResponse,
          patientData.firstName,
          patientData.middleName,
          patientData.lastName,
          patientData.antiTetanusGiven,
          patientData.dateOfAntiTetanus
        );

        setScheduleData(transformedData);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast({
          title: 'Error',
          description: 'Failed to load vaccination data. Please try again.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
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

  const handleAntiTetanusUpdate = async (
    administered: boolean,
    date?: Date
  ) => {
    if (!scheduleData) return;

    try {
      await updatePatientAntiTetanus({
        setIsLoading: setIsSaving,
        patientId,
        administered,
        date,
      });

      // Update local state
      setScheduleData({
        ...scheduleData,
        antiTetanus: {
          ...scheduleData.antiTetanus,
          administered,
          date,
        },
      });
    } catch (error) {
      console.error('Error updating anti-tetanus status:', error);
    }
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

  return {
    isLoading,
    isSaving,
    scheduleData,
    nextVaccination: getNextVaccinationInfo(),
    handleVaccinationToggle,
    handleAntiTetanusUpdate,
  };
}
