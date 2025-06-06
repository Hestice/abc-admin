import { z } from 'zod';
import { Category, Sex, Status } from '@abc-admin/enums';

// Define the form schema with Zod
export const formSchema = z.object({
  // Personal Information
  firstName: z.string().min(1, 'First name is required'),
  middleName: z.string().optional(),
  lastName: z.string().min(1, 'Last name is required'),
  dateOfBirth: z.date({
    required_error: 'Date of birth is required',
  }),
  sex: z.nativeEnum(Sex, {
    required_error: 'Sex is required',
  }),
  address: z.string().min(1, 'Address is required'),
  email: z.string().email('Invalid email format').optional().or(z.literal('')),

  // Exposure Details
  category: z.nativeEnum(Category, {
    required_error: 'Category is required',
  }),
  bodyPartsAffected: z.string().min(1, 'Body parts affected is required'),
  placeOfExposure: z.string().min(1, 'Place of exposure is required'),
  dateOfExposure: z.date({
    required_error: 'Date of exposure is required',
  }),
  sourceOfExposure: z.string().min(1, 'Source of exposure is required'),
  isExposureAtHome: z.boolean().default(false),
  animalStatus: z
    .nativeEnum(Status, {
      required_error: 'Animal status is required',
    })
    .default(Status.UNKNOWN),
  isWoundCleaned: z.boolean(),

  // Medical Information
  antiTetanusGiven: z.boolean(),
  dateOfAntiTetanus: z.date().optional(),
  briefHistory: z.string().min(1, 'Brief history is required'),

  // Make allergies and medications optional
  allergy: z.string().optional().default('none'),
  medications: z.string().optional().default('none'),
});

export type FormValues = z.infer<typeof formSchema>;

// Define the steps of the form
export const steps = [
  {
    id: 'personal-info',
    title: 'Personal Information',
    description: "Patient's basic information",
    fields: [
      'firstName',
      'middleName',
      'lastName',
      'dateOfBirth',
      'sex',
      'address',
      'email',
    ],
  },
  {
    id: 'exposure-details',
    title: 'Exposure Details',
    description: 'Information about the animal bite exposure',
    fields: [
      'category',
      'bodyPartsAffected',
      'placeOfExposure',
      'dateOfExposure',
      'isExposureAtHome',
      'sourceOfExposure',
      'animalStatus',
      'isWoundCleaned',
    ],
  },
  {
    id: 'medical-info',
    title: 'Medical Information',
    description: "Patient's medical history and treatment",
    fields: [
      'antiTetanusGiven',
      'dateOfAntiTetanus',
      'briefHistory',
      'allergy',
      'noAllergies',
      'medications',
      'noMedications',
    ],
  },
];

// Sex options with icons
export const sexOptions = [
  { value: Sex.MALE, label: 'Male', icon: 'Male' },
  { value: Sex.FEMALE, label: 'Female', icon: 'Female' },
  { value: Sex.OTHER, label: 'Other', icon: 'Users' },
];

// Add status options with icons
export const statusOptions = [
  { value: Status.ALIVE, label: 'Alive', icon: 'CheckCircle' },
  { value: Status.DEAD, label: 'Dead', icon: 'XCircle' },
  { value: Status.LOST, label: 'Lost', icon: 'Search' },
  { value: Status.UNKNOWN, label: 'Unknown', icon: 'HelpCircle' },
];
