import { Exposure, NewExposure } from '@/types/exposure';
import { ApiResponse } from './add-patient';
import { getSupabaseClient, response, throwOnSupabaseError } from './supabase';

export const addExposure = async (
  newExposure: NewExposure
): Promise<ApiResponse<Exposure>> => {
  const { data, error } = await getSupabaseClient()
    .from('exposures')
    .insert({
      patientId: newExposure.patientId,
      category: newExposure.category,
      bodyPartsAffected: newExposure.bodyPartsAffected,
      placeOfExposure: newExposure.placeOfExposure,
      dateOfExposure: newExposure.dateOfExposure,
      isExposureAtHome: newExposure.isExposureAtHome,
      sourceOfExposure: newExposure.sourceOfExposure,
      animalStatus: newExposure.animalStatus || 'unknown',
      isWoundCleaned: newExposure.isWoundCleaned,
      antiTetanusGiven: newExposure.antiTetanusGiven,
      dateOfAntiTetanus: newExposure.dateOfAntiTetanus || null,
      briefHistory: newExposure.briefHistory,
      allergy: newExposure.allergy,
      medications: newExposure.medications,
    })
    .select()
    .single();
  throwOnSupabaseError(error, 'Failed to create exposure');
  return response(data as Exposure);
};
