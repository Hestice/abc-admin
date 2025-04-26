'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Loader2, Search, UserPlus } from 'lucide-react';
import { useMediaQuery } from '@/hooks/use-media-query';
import PatientTableMobile from './patient-management/table-mobile';
import PatientsTable from './patient-management/table-web';
import { getPatients } from '@/utils/get-patients';
import { Patient } from '@/types/patient';
import ViewPatientDialog from './dialog/view-patient';
import { useRouter } from 'next/navigation';
import { AppRoutes } from '@/constants/routes';
const PATIENTS_PER_PAGE = 10;

export function PatientManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPatient, setSelectedPatient] = useState<any>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);

  const isMobile = useMediaQuery('(max-width: 768px)');
  // TODO: Filter patients based on search term

  const [isLoading, setIsLoading] = useState(false);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [totalPatients, setTotalPatients] = useState(0);
  const [page, setPage] = useState(1);

  const totalPages = Math.ceil(totalPatients / PATIENTS_PER_PAGE);
  const isFirstPage = page === 1;
  const isLastPage = page >= totalPages;

  const router = useRouter();

  const fetchPatients = async (page: number) => {
    try {
      setIsLoading(true);
      const response = await getPatients({ setIsLoading, page });
      setPatients(response.patients);
      setTotalPatients(response.total);
    } catch (error) {
      console.error('Failed to fetch patients:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients(1);
  }, []);

  const handleAddNewPatient = () => {
    router.push(AppRoutes.REGISTER_PATIENT);
  };

  const handleViewPatient = (patient: any) => {
    setSelectedPatient(patient);
    setIsViewDialogOpen(true);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    fetchPatients(newPage);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:w-auto">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search patients..."
            className="w-full pl-8 sm:w-[300px]"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button onClick={handleAddNewPatient} className="w-full sm:w-auto">
          <UserPlus className="mr-2 h-4 w-4" />
          Add New Patient
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Patient Records</CardTitle>
          <CardDescription>
            Manage and view all patient records in the system.
          </CardDescription>
        </CardHeader>
        {isLoading ? (
          <div className="flex justify-center items-center h-full">
            <Loader2 className="h-4 w-4 animate-spin" />
          </div>
        ) : (
          <CardContent>
            {isMobile ? (
              // Mobile card view
              <PatientTableMobile
                filteredPatients={patients}
                handleViewPatient={handleViewPatient}
              />
            ) : (
              // Desktop table view
              <PatientsTable
                filteredPatients={patients}
                handleViewPatient={handleViewPatient}
              />
            )}
          </CardContent>
        )}
        <CardFooter className="flex flex-col justify-between gap-4">
          <div className="flex flex-row gap-2 justify-between w-full">
            <span className="text-sm text-muted-foreground mb-2 sm:mb-0">
              Showing {patients.length} out of {totalPatients} patients
            </span>
            <div className="flex items-center space-x-2 w-full sm:w-auto">
              <Button
                variant="outline"
                size="sm"
                disabled={isFirstPage}
                className="flex-1 sm:flex-none"
                onClick={() => handlePageChange(page - 1)}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={isLastPage}
                className="flex-1 sm:flex-none"
                onClick={() => handlePageChange(page + 1)}
              >
                Next
              </Button>
            </div>
          </div>

          <span className="text-xs text-muted-foreground">
            Page {page} of {totalPages}
          </span>
        </CardFooter>
      </Card>

      {/* View Patient Dialog */}
      <ViewPatientDialog
        isViewDialogOpen={isViewDialogOpen}
        setIsViewDialogOpen={setIsViewDialogOpen}
        selectedPatient={selectedPatient}
      />
    </div>
  );
}
