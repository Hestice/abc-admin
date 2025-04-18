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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Calendar, Loader2, Search, UserPlus } from 'lucide-react';
import { useMediaQuery } from '@/hooks/use-media-query';
import PatientTableMobile from './patient-management/table-mobile';
import PatientsTable from './patient-management/table-web';
import { getPatients } from '@/utils/get-patients';
import { Patient } from '@/types/patient';

export function PatientManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPatient, setSelectedPatient] = useState<any>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const isMobile = useMediaQuery('(max-width: 768px)');
  // TODO: Filter patients based on search term

  const [isLoading, setIsLoading] = useState(false);
  const [patients, setPatients] = useState<Patient[]>([]);
  const fetchPatients = async () => {
    try {
      setIsLoading(true);
      const response = await getPatients({ setIsLoading });
      setPatients(response.patients);
    } catch (error) {
      console.error('Failed to fetch patients:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  const handleAddNewPatient = () => {
    // In a real application, this would navigate to a new patient form
    console.log('Navigate to add new patient page');
    // router.push("/patients/new")
  };

  const handleViewPatient = (patient: any) => {
    setSelectedPatient(patient);
    setIsViewDialogOpen(true);
  };

  const handleEditPatient = (patient: any) => {
    setSelectedPatient(patient);
    setIsEditDialogOpen(true);
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
        <CardFooter className="flex flex-col sm:flex-row justify-between">
          <div className="text-sm text-muted-foreground mb-2 sm:mb-0">
            Showing {patients.length} of {patients.length} patients
          </div>
          <div className="flex items-center space-x-2 w-full sm:w-auto">
            <Button
              variant="outline"
              size="sm"
              disabled
              className="flex-1 sm:flex-none"
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled
              className="flex-1 sm:flex-none"
            >
              Next
            </Button>
          </div>
        </CardFooter>
      </Card>

      {/* View Patient Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-[500px] w-[calc(100%-2rem)] max-h-[calc(100vh-2rem)] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Patient Details</DialogTitle>
            <DialogDescription>
              Detailed information about the patient.
            </DialogDescription>
          </DialogHeader>
          {selectedPatient && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">{selectedPatient.name}</h3>
                <Badge
                  variant={
                    selectedPatient.status === 'Complete'
                      ? 'default'
                      : 'outline'
                  }
                >
                  {selectedPatient.status}
                </Badge>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">
                    Patient ID
                  </p>
                  <p>{selectedPatient.id}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">
                    Age
                  </p>
                  <p>{selectedPatient.age}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">
                    Contact
                  </p>
                  <p>{selectedPatient.contact}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">
                    Date Registered
                  </p>
                  <p>{selectedPatient.dateRegistered}</p>
                </div>
              </div>

              <div className="rounded-lg border p-4">
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-muted-foreground" />
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Next Vaccination</p>
                    <p className="text-sm">{selectedPatient.nextVaccination}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
          <DialogFooter className="flex flex-col sm:flex-row gap-2">
            <Button
              variant="outline"
              onClick={() => setIsViewDialogOpen(false)}
              className="w-full sm:w-auto"
            >
              Close
            </Button>
            <Button
              onClick={() => {
                setIsViewDialogOpen(false);
                handleEditPatient(selectedPatient);
              }}
              className="w-full sm:w-auto"
            >
              Edit
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Patient Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px] w-[calc(100%-2rem)] max-h-[calc(100vh-2rem)] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Patient</DialogTitle>
            <DialogDescription>
              Make changes to the patient information.
            </DialogDescription>
          </DialogHeader>
          {selectedPatient && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-2 sm:gap-4">
                <label htmlFor="id" className="sm:text-right font-medium">
                  ID:
                </label>
                <Input
                  id="id"
                  defaultValue={selectedPatient.id}
                  className="sm:col-span-3"
                  disabled
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-2 sm:gap-4">
                <label htmlFor="name" className="sm:text-right font-medium">
                  Name:
                </label>
                <Input
                  id="name"
                  defaultValue={selectedPatient.name}
                  className="sm:col-span-3"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-2 sm:gap-4">
                <label htmlFor="age" className="sm:text-right font-medium">
                  Age:
                </label>
                <Input
                  id="age"
                  defaultValue={selectedPatient.age}
                  className="sm:col-span-3"
                  type="number"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-2 sm:gap-4">
                <label htmlFor="contact" className="sm:text-right font-medium">
                  Contact:
                </label>
                <Input
                  id="contact"
                  defaultValue={selectedPatient.contact}
                  className="sm:col-span-3"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-2 sm:gap-4">
                <label htmlFor="date" className="sm:text-right font-medium">
                  Registered:
                </label>
                <Input
                  id="date"
                  defaultValue={selectedPatient.dateRegistered}
                  className="sm:col-span-3"
                  type="date"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-2 sm:gap-4">
                <label htmlFor="status" className="sm:text-right font-medium">
                  Status:
                </label>
                <Input
                  id="status"
                  defaultValue={selectedPatient.status}
                  className="sm:col-span-3"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-2 sm:gap-4">
                <label
                  htmlFor="nextVaccination"
                  className="sm:text-right font-medium"
                >
                  Next Vaccination:
                </label>
                <Input
                  id="nextVaccination"
                  defaultValue={selectedPatient.nextVaccination}
                  className="sm:col-span-3"
                />
              </div>
            </div>
          )}
          <DialogFooter className="flex flex-col sm:flex-row gap-2">
            <Button
              variant="outline"
              onClick={() => setIsEditDialogOpen(false)}
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>
            <Button
              onClick={() => setIsEditDialogOpen(false)}
              className="w-full sm:w-auto"
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
