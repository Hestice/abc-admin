'use client';

import { useParams } from 'next/navigation';
import React from 'react';

export default function PatientInfo() {
  const params = useParams();
  const id = params.id;

  return <div>PatientInfo: {id}</div>;
}
