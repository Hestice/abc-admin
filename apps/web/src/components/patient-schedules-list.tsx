'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Loader2, Plus, Calendar, CheckCircle2, Clock } from 'lucide-react';
import { getPatientSchedules } from '@/utils/get-patient-schedules';
import { getPatient } from '@/utils/get-patients';
import { Schedule } from '@/types/schedule';
import { PatientSummary } from '@/types/patient';
import { ScheduleStatus } from '@/enums/schedule-status';
import { formatDate } from '@/utils/date-utils';
import { AppRoutes } from '@/constants/routes';
import { Configuration, SchedulesApi } from '@abc-admin/api-lib';
import { getSession } from '@/lib/auth/client';
import { useToast } from '@/hooks/use-toast';

interface PatientSchedulesListProps {
  patientId: string;
}

export function PatientSchedulesList({ patientId }: PatientSchedulesListProps) {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [patient, setPatient] = useState<PatientSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [schedulesData, patientData] = await Promise.all([
          getPatientSchedules({ setIsLoading: () => {}, patientId }),
          getPatient({ setIsLoading: () => {}, patientId }),
        ]);
        setSchedules(schedulesData);
        setPatient(patientData.patient);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast({
          title: 'Error',
          description: 'Failed to load schedules. Please try again.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [patientId, toast]);

  const handleCreateSchedule = async () => {
    try {
      setIsCreating(true);
      const { session } = await getSession();
      const accessToken = session?.access_token;

      if (!accessToken) {
        throw new Error('No authentication token found. Please log in again.');
      }

      const config = new Configuration({
        basePath: process.env.NEXT_PUBLIC_BACKEND_URL,
        accessToken: accessToken,
      });

      const schedulesApi = new SchedulesApi(config);
      const response = await schedulesApi.schedulesControllerCreate({
        patientId,
      });

      // Navigate to the edit page for the new schedule
      router.push(
        AppRoutes.EDIT_PATIENT.replace(':id', patientId).replace(
          ':scheduleId',
          response.data.id
        )
      );
    } catch (error) {
      console.error('Error creating schedule:', error);
      toast({
        title: 'Error',
        description: 'Failed to create schedule. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsCreating(false);
    }
  };

  const handleScheduleClick = (scheduleId: string) => {
    router.push(
      AppRoutes.EDIT_PATIENT.replace(':id', patientId).replace(
        ':scheduleId',
        scheduleId
      )
    );
  };

  const getCompletionStatus = (schedule: Schedule) => {
    const completedDays = [
      schedule.day0Completed,
      schedule.day3Completed,
      schedule.day7Completed,
      schedule.day28Completed,
    ].filter(Boolean).length;

    return `${completedDays}/4`;
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Patient Information Header */}
      {patient && (
        <Card>
          <CardHeader>
            <CardTitle>
              {patient.firstName} {patient.middleName} {patient.lastName}
            </CardTitle>
            <CardDescription>
              Patient ID: {patient.id} • Registered:{' '}
              {formatDate(new Date(patient.dateRegistered))}
            </CardDescription>
          </CardHeader>
        </Card>
      )}

      {/* Create New Schedule Button */}
      <div className="flex justify-end">
        <Button onClick={handleCreateSchedule} disabled={isCreating}>
          {isCreating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating...
            </>
          ) : (
            <>
              <Plus className="mr-2 h-4 w-4" />
              Create New Schedule
            </>
          )}
        </Button>
      </div>

      {/* Schedules List */}
      {schedules.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-lg font-medium mb-2">No schedules found</p>
            <p className="text-sm text-muted-foreground mb-4">
              Create a new vaccination schedule to get started.
            </p>
            <Button onClick={handleCreateSchedule} disabled={isCreating}>
              <Plus className="mr-2 h-4 w-4" />
              Create Schedule
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {schedules.map((schedule) => {
            const isCompleted = schedule.status === ScheduleStatus.completed;
            return (
              <Card
                key={schedule.id}
                className="cursor-pointer hover:bg-accent transition-colors"
                onClick={() => handleScheduleClick(schedule.id)}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="text-lg">
                        Schedule {formatDate(new Date(schedule.day0Date))}
                      </CardTitle>
                      <CardDescription>
                        Started on {formatDate(new Date(schedule.day0Date))}
                      </CardDescription>
                    </div>
                    <Badge variant={isCompleted ? 'default' : 'outline'}>
                      {schedule.status === ScheduleStatus.completed
                        ? ScheduleStatus.completed
                        : ScheduleStatus.in_progress}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      {isCompleted ? (
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                      ) : (
                        <Clock className="h-4 w-4 text-yellow-600" />
                      )}
                      <span className="text-muted-foreground">
                        Completion: {getCompletionStatus(schedule)} days
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
