interface PatientEditFormProps {
  patientId: string;
}

export default function PatientEditForm({ patientId }: PatientEditFormProps) {
  return <div>PatientEditForm {patientId}</div>;
}
