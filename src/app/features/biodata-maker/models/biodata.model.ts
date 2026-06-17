export type BiodataTemplateId = 'classic-marriage' | 'professional' | 'modern-card';
export type BiodataType = 'marriage' | 'professional';

export interface BiodataPersonal {
  fullName: string;
  gender: string;
  dateOfBirth: string;
  placeOfBirth: string;
  timeOfBirth: string;
  religion: string;
  caste: string;
  subCaste: string;
  gotra: string;
  height: string;
  weight: string;
  complexion: string;
  bloodGroup: string;
  maritalStatus: string;
  motherTongue: string;
  nationality: string;
  manglik: string;
  diet: string;
  photo: string; // base64 data URL
}

export interface BiodataContact {
  email: string;
  phone: string;
  whatsapp: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
}

export interface BiodataEducationItem {
  id: string;
  degree: string;
  field: string;
  institution: string;
  year: string;
  grade: string;
}

export interface BiodataProfessional {
  occupation: string;
  employer: string;
  jobTitle: string;
  annualIncome: string;
  workCity: string;
  workCountry: string;
  workExperience: string;
}

export interface BiodataFamily {
  fatherName: string;
  fatherOccupation: string;
  motherName: string;
  motherOccupation: string;
  brothers: string;
  sisters: string;
  familyType: string;
  familyStatus: string;
  familyValues: string;
  nativePlace: string;
  aboutFamily: string;
}

export interface BiodataPartnerPreferences {
  ageFrom: string;
  ageTo: string;
  heightFrom: string;
  heightTo: string;
  religion: string;
  caste: string;
  education: string;
  occupation: string;
  location: string;
  other: string;
}

export type BiodataSectionId =
  | 'personal'
  | 'contact'
  | 'education'
  | 'professional'
  | 'family'
  | 'skills'
  | 'achievements'
  | 'partnerPreferences';

export interface BiodataData {
  id: string;
  name: string;
  templateId: BiodataTemplateId;
  type: BiodataType;
  personal: BiodataPersonal;
  contact: BiodataContact;
  education: BiodataEducationItem[];
  professional: BiodataProfessional;
  skills: string[];
  hobbies: string[];
  languages: string[];
  achievements: string[];
  family: BiodataFamily;
  partnerPreferences: BiodataPartnerPreferences;
  sectionVisibility: Partial<Record<BiodataSectionId, boolean>>;
  updatedAt: number;
}

export const BIODATA_SECTION_LABELS: Record<BiodataSectionId, string> = {
  personal: 'Personal Details',
  contact: 'Contact Information',
  education: 'Education',
  professional: 'Professional Details',
  family: 'Family Information',
  skills: 'Skills & Hobbies',
  achievements: 'Achievements',
  partnerPreferences: 'Partner Preferences',
};

export const MARRIAGE_SECTIONS: BiodataSectionId[] = [
  'personal', 'contact', 'education', 'professional', 'family', 'skills', 'achievements', 'partnerPreferences',
];

export const PROFESSIONAL_SECTIONS: BiodataSectionId[] = [
  'personal', 'contact', 'education', 'professional', 'skills', 'achievements',
];
