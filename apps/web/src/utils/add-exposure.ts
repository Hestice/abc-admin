import {
  ExposuresApi,
  Configuration,
  CreateExposureDto,
} from '@abc-admin/api-lib';
import { getSession } from '@/lib/auth/client';
import { NewExposure, Exposure } from '@/types/exposure';

interface AddExposureConnectionProps {
  setIsLoading: (isLoading: boolean) => void;
  newExposure: NewExposure;
}

interface ApiResponse<T> {
  data: T;
  status: number;
  statusText: string;
  headers: Record<string, string>;
  config: any;
  request: any;
}

export class ApiError extends Error {
  status?: number;

  constructor(message: string, status?: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

export const addExposure = async ({
  setIsLoading,
  newExposure,
}: AddExposureConnectionProps): Promise<ApiResponse<Exposure>> => {
  setIsLoading(true);

  try {
    const { session } = await getSession();
    const accessToken = session?.access_token;

    if (!accessToken) {
      throw new ApiError('No authentication token found. Please log in again.');
    }

    const config = new Configuration({
      basePath: process.env.NEXT_PUBLIC_BACKEND_URL,
      accessToken: accessToken,
    });

    // Adapt NewExposure to CreateExposureDto format expected by API
    const createExposureDto: CreateExposureDto = {
      patientId: newExposure.patientId,
      category: newExposure.category as any, // API expects object (enum), but we have number
      bodyPartsAffected: newExposure.bodyPartsAffected,
      placeOfExposure: newExposure.placeOfExposure,
      dateOfExposure: newExposure.dateOfExposure,
      isExposureAtHome: newExposure.isExposureAtHome,
      sourceOfExposure: newExposure.sourceOfExposure,
      animalStatus: newExposure.animalStatus as any, // API expects object (enum)
      isWoundCleaned: newExposure.isWoundCleaned,
      antiTetanusGiven: newExposure.antiTetanusGiven,
      briefHistory: newExposure.briefHistory,
      allergy: newExposure.allergy,
      medications: newExposure.medications,
      // Only include dateOfAntiTetanus if provided
      ...(newExposure.dateOfAntiTetanus && {
        dateOfAntiTetanus: newExposure.dateOfAntiTetanus,
      }),
    } as CreateExposureDto;

    const exposuresApi = new ExposuresApi(config);
    const response = await exposuresApi.exposuresControllerCreate(
      createExposureDto
    );

    return response as unknown as ApiResponse<Exposure>;
  } catch (error: any) {
    console.error('API connection failed:', error);

    // Check for specific API error responses
    if (error.response) {
      const status = error.response.status;
      const errorMessage = error.response.data?.message;
      let message = 'An error occurred while adding the exposure';

      // Handle specific status codes
      if (status === 409) {
        message =
          'An exposure already exists. Please use the existing exposure or contact support.';
      } else if (status === 400) {
        message =
          errorMessage ||
          'Invalid input data. Please check your form and try again.';
      } else if (status === 401 || status === 403) {
        message = 'You are not authorized to perform this action.';
      } else if (status === 404) {
        message = 'Patient not found.';
      } else if (status >= 500) {
        message = 'Server error. Please try again later.';
      }

      throw new ApiError(message, status);
    }

    // For other errors
    throw new ApiError(
      error instanceof Error ? error.message : 'Unknown error occurred'
    );
  } finally {
    setIsLoading(false);
  }
};
