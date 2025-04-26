'use client';

import { useRouter } from 'next/navigation';

import { VaccinationCard } from '@/components/schedules/vaccination-card';
import { AntiTetanusCard } from '@/components/schedules/anti-tetanus-card';
import { VaccinationHeader } from '@/components/schedules/vaccination-header';
import { VaccinationLoading } from '@/components/schedules/vaccination-loading';
import { VaccinationEmpty } from '@/components/schedules/vaccination-empty';
import { useVaccinationSchedule } from '@/hooks/use-vaccination-schedule';

interface VaccinationScheduleProps {
  patientId: string;
}

export function VaccinationSchedule({ patientId }: VaccinationScheduleProps) {
  const router = useRouter();
  const {
    isLoading,
    isSaving,
    scheduleData,
    animalStatus,
    nextVaccination,
    handleVaccinationToggle,
    handleAntiTetanusUpdate,
  } = useVaccinationSchedule(patientId);

  const handleBack = () => {
    router.push(`/patients/${patientId}`);
  };

  if (isLoading) {
    return <VaccinationLoading />;
  }

  if (!scheduleData) {
    return <VaccinationEmpty onBack={handleBack} />;
  }

  return (
    <div className="space-y-6">
      <VaccinationHeader
        scheduleData={scheduleData}
        nextVaccination={nextVaccination}
        onBack={handleBack}
      />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <AntiTetanusCard
          antiTetanus={scheduleData.antiTetanus}
          onUpdate={handleAntiTetanusUpdate}
          disabled={isSaving}
        />

        {scheduleData.vaccinations.map((vaccination) => (
          <VaccinationCard
            key={vaccination.day}
            vaccination={vaccination}
            onToggleStatus={(completed) =>
              handleVaccinationToggle(vaccination.day, completed)
            }
            disabled={isSaving}
            animalStatus={animalStatus}
          />
        ))}
      </div>
    </div>
  );
}
