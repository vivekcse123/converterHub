import { BiodataData, BiodataTemplateId, BiodataType } from '../models/biodata.model';

function uid(): string {
  return typeof crypto !== 'undefined' && crypto.randomUUID
    ? crypto.randomUUID()
    : `id-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export function createBlankBiodata(
  templateId: BiodataTemplateId = 'classic-marriage',
  type: BiodataType = 'marriage',
): BiodataData {
  return {
    id: uid(),
    name: 'My Biodata',
    templateId,
    type,
    personal: {
      fullName: '',
      gender: 'Female',
      dateOfBirth: '',
      placeOfBirth: '',
      timeOfBirth: '',
      religion: 'Hindu',
      caste: '',
      subCaste: '',
      gotra: '',
      height: '',
      weight: '',
      complexion: '',
      bloodGroup: '',
      maritalStatus: 'Never Married',
      motherTongue: '',
      nationality: 'Indian',
      manglik: '',
      diet: 'Vegetarian',
      photo: '',
    },
    contact: {
      email: '',
      phone: '',
      whatsapp: '',
      address: '',
      city: '',
      state: '',
      pincode: '',
      country: 'India',
    },
    education: [],
    professional: {
      occupation: '',
      employer: '',
      jobTitle: '',
      annualIncome: '',
      workCity: '',
      workCountry: 'India',
      workExperience: '',
    },
    skills: [],
    hobbies: [],
    languages: [],
    achievements: [],
    family: {
      fatherName: '',
      fatherOccupation: '',
      motherName: '',
      motherOccupation: '',
      brothers: '',
      sisters: '',
      familyType: 'Nuclear',
      familyStatus: 'Middle Class',
      familyValues: 'Traditional',
      nativePlace: '',
      aboutFamily: '',
    },
    partnerPreferences: {
      ageFrom: '',
      ageTo: '',
      heightFrom: '',
      heightTo: '',
      religion: '',
      caste: '',
      education: '',
      occupation: '',
      location: '',
      other: '',
    },
    sectionVisibility: {},
    updatedAt: Date.now(),
  };
}

export function createSampleBiodata(templateId: BiodataTemplateId = 'classic-marriage'): BiodataData {
  const biodata = createBlankBiodata(templateId, 'marriage');
  biodata.name = 'Priya Sharma - Biodata';
  biodata.personal = {
    fullName: 'Priya Sharma',
    gender: 'Female',
    dateOfBirth: '15 March 1997',
    placeOfBirth: 'New Delhi',
    timeOfBirth: '10:30 AM',
    religion: 'Hindu',
    caste: 'Brahmin',
    subCaste: 'Saraswat',
    gotra: 'Kashyap',
    height: '5\'4"',
    weight: '55 kg',
    complexion: 'Fair',
    bloodGroup: 'B+',
    maritalStatus: 'Never Married',
    motherTongue: 'Hindi',
    nationality: 'Indian',
    manglik: 'No',
    diet: 'Vegetarian',
    photo: '',
  };
  biodata.contact = {
    email: 'priya.sharma@email.com',
    phone: '+91 98765 43210',
    whatsapp: '+91 98765 43210',
    address: '42, Green Park Colony',
    city: 'New Delhi',
    state: 'Delhi',
    pincode: '110016',
    country: 'India',
  };
  biodata.education = [
    { id: uid(), degree: 'B.Tech', field: 'Computer Science', institution: 'Delhi Technological University', year: '2019', grade: '8.5 CGPA' },
    { id: uid(), degree: 'Class XII', field: 'Science (PCM)', institution: 'Delhi Public School, RK Puram', year: '2015', grade: '93%' },
  ];
  biodata.professional = {
    occupation: 'Software Engineer',
    employer: 'Infosys Ltd.',
    jobTitle: 'Senior Software Engineer',
    annualIncome: '₹12 LPA',
    workCity: 'Bengaluru',
    workCountry: 'India',
    workExperience: '4 years',
  };
  biodata.skills = ['JavaScript', 'Angular', 'Python', 'SQL', 'Problem Solving'];
  biodata.hobbies = ['Classical Dance', 'Reading', 'Cooking', 'Yoga'];
  biodata.languages = ['Hindi', 'English', 'Sanskrit'];
  biodata.achievements = ['State Merit Scholarship 2015', 'Best Employee Award 2022'];
  biodata.family = {
    fatherName: 'Mr. Rajesh Sharma',
    fatherOccupation: 'Business (Import-Export)',
    motherName: 'Mrs. Sunita Sharma',
    motherOccupation: 'Homemaker',
    brothers: '1 (Married)',
    sisters: '1 (Unmarried)',
    familyType: 'Joint',
    familyStatus: 'Upper Middle Class',
    familyValues: 'Traditional',
    nativePlace: 'Jaipur, Rajasthan',
    aboutFamily: 'We are a well-settled, cultured family with strong values. Our family maintains a warm and loving environment.',
  };
  biodata.partnerPreferences = {
    ageFrom: '26',
    ageTo: '32',
    heightFrom: '5\'6"',
    heightTo: '6\'0"',
    religion: 'Hindu',
    caste: 'Brahmin (Caste no bar for good match)',
    education: 'Graduate or above',
    occupation: 'Working Professional / Business',
    location: 'Delhi NCR / Open to relocation',
    other: 'Looking for an educated, well-settled, family-oriented individual with good values.',
  };
  return biodata;
}
