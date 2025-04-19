'use client';

import { PatientRegistrationForm } from './patient-registration-form';

export default function PatientRegistrationPage() {
  return (
    <div className="container py-6">
      <h1 className="text-2xl font-bold mb-6">Patient Registration</h1>
      <PatientRegistrationForm />
    </div>
  );
}
