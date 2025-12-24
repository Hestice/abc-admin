import { useMemo } from 'react';
import { toast } from '@/hooks/use-toast';
import { transformScheduleData } from '@/utils/transform-schedule';
import { updateVaccinationStatus } from '@/utils/vaccination-updater';
import { usePatientSummary } from '@/hooks/queries/use-patients';
import { useSchedule } from '@/hooks/queries/use-schedules';
import { useUpdateVaccination } from '@/hooks/mutations/use-schedule-mutations';
import { PatientVaccination } from '@/types/vaccinations';
import { Status } from '@abc-admin/enums';

export function useVaccinationSchedule(patientId: string, scheduleId?: string) {
  // Fetch patient summary for basic info
  const { data: patientSummaryData, isLoading: isLoadingPatientSummary } =
    usePatientSummary(patientId);

  // Fetch full patient data if needed (currently not used but may be needed in future)
  // const { data: patientData, isLoading: isLoadingPatient } = usePatient(patientId);

  // Fetch schedule data
  const { data: scheduleResponse, isLoading: isLoadingSchedule } = useSchedule(
    patientId,
    scheduleId
  );

  const updateVaccinationMutation = useUpdateVaccination();

  const isLoading = isLoadingPatientSummary || isLoadingSchedule;
  const isSaving = updateVaccinationMutation.isPending;

  // Transform data when available
  const scheduleData = useMemo<PatientVaccination | null>(() => {
    if (!scheduleResponse || !patientSummaryData?.patient) {
      return null;
    }

    const patientData = patientSummaryData.patient;
    const exposure = scheduleResponse.exposure;
    const antiTetanusFromExposure = exposure?.antiTetanusGiven;
    const dateOfAntiTetanusFromExposure = exposure?.dateOfAntiTetanus;

    // Normalize dateOfAntiTetanus to Date or undefined
    const normalizeDate = (
      date: Date | string | undefined
    ): Date | undefined => {
      if (!date) return undefined;
      return date instanceof Date ? date : new Date(date);
    };

    const dateOfAntiTetanus = normalizeDate(
      dateOfAntiTetanusFromExposure || patientData.dateOfAntiTetanus
    );

    return transformScheduleData(
      scheduleResponse,
      patientData.firstName,
      patientData.middleName,
      patientData.lastName,
      antiTetanusFromExposure !== undefined
        ? antiTetanusFromExposure
        : patientData.antiTetanusGiven,
      dateOfAntiTetanus ?? new Date()
    );
  }, [scheduleResponse, patientSummaryData]);

  const animalStatus = useMemo<Status>(() => {
    if (!scheduleResponse || !patientSummaryData?.patient) {
      return Status.UNKNOWN;
    }
    const exposure = scheduleResponse.exposure;
    const animalStatusFromExposure = exposure?.animalStatus;
    return (
      animalStatusFromExposure ||
      patientSummaryData.patient.animalStatus ||
      Status.UNKNOWN
    );
  }, [scheduleResponse, patientSummaryData]);

  const handleVaccinationToggle = async (day: number, completed: boolean) => {
    if (!scheduleData || !scheduleResponse) return;

    // Use the mutation for vaccination updates
    const vaccinationDay = day as any; // VaccinationDay type
    updateVaccinationMutation.mutate({
      patientId,
      scheduleId: scheduleResponse.id,
      vaccinationDay,
    });

    // Also call the existing update function for local state management
    // This will be handled by React Query cache invalidation
    await updateVaccinationStatus({
      day,
      completed,
      scheduleData,
      setIsSaving: () => {},
      patientId,
      setScheduleData: () => {},
    });
  };

  const handleAntiTetanusUpdate = async (
    administered: boolean,
    date?: Date
  ) => {
    // Note: This needs to be updated to use exposure mutations
    // For now, keeping the existing behavior but it should be refactored
    toast({
      title: 'Info',
      description:
        'Anti-tetanus updates should be done through exposure management',
    });
  };

  // Calculate next vaccination date - only consider non-optional vaccinations
  const getNextVaccinationInfo = () => {
    if (!scheduleData) return null;

    const nextVaccination = scheduleData.vaccinations.find(
      (v) => !v.completed && !(v.day === 28 && animalStatus === Status.ALIVE)
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
    animalStatus,
    nextVaccination: getNextVaccinationInfo(),
    handleVaccinationToggle,
    handleAntiTetanusUpdate,
  };
}
