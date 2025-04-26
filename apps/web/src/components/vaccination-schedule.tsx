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

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-4">
        {/* Anti-tetanus card in the first column */}
        <div className="xl:col-span-1 h-full">
          <AntiTetanusCard
            antiTetanus={scheduleData.antiTetanus}
            onUpdate={handleAntiTetanusUpdate}
            disabled={isSaving}
          />
        </div>

        {/* Vaccination cards grid in the remaining 3 columns */}
        <div className="xl:col-span-3 grid grid-cols-1 xl:grid-cols-2 gap-4">
          {scheduleData.vaccinations
            .sort((a, b) => a.day - b.day)
            .map((vaccination) => (
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
    </div>
  );
}
