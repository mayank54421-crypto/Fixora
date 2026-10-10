export type StatusType = 'reported' | 'inspected' | 'in_progress' | 'resolved';

export type SeverityType = 'critical' | 'high' | 'medium' | 'low';

export type CategoryType = 
  | 'pothole'
  | 'streetlight'
  | 'water_leakage'
  | 'drainage_sewer'
  | 'footpath'
  | 'transformer_wire'
  | 'garbage_dump'
  | 'public_park';

export interface DamageReport {
  id: string;
  ticketNumber: string;
  title: string;
  titleHi: string;
  description: string;
  descriptionHi: string;
  category: CategoryType;
  categoryNameEn: string;
  categoryNameHi: string;
  status: StatusType;
  severity: SeverityType;
  photoUrl: string;
  resolvedPhotoUrl?: string;
  address: string;
  addressHi: string;
  landmark: string;
  ward: string;
  constituency: string;
  city: string;
  coordinates: [number, number];
  reportedAt: string;
  updatedAt: string;
  upvotes: number;
  upvotedByMe?: boolean;
  assignedDepartment: string;
  departmentHi: string;
  assignedLeaderId: string;
  contractorName?: string;
  estimatedCost?: string;
  officialRemarks?: string;
  officialRemarksHi?: string;
  isAnonymous: boolean;
  anonymousReporterCode: string;
  history: {
    status: StatusType;
    timestamp: string;
    noteEn: string;
    noteHi: string;
    updatedBy: string;
  }[];
}

export interface Leader {
  id: string;
  name: string;
  nameHi: string;
  role: 'ward_corporator' | 'mla' | 'mp' | 'mayor';
  roleTitleEn: string;
  roleTitleHi: string;
  photoUrl: string;
  party: string;
  ward: string;
  constituency: string;
  city: string;
  phoneContact: string;
  email: string;
  resolvedCount: number;
  totalCount: number;
  avgResolutionHours: number;
  citizenApprovalRating: number; // 0 - 5.0
  termPeriod: string;
  mottoEn: string;
  mottoHi: string;
  badges: string[];
}

export interface User {
  id: string;
  name: string;
  role: 'citizen' | 'officer' | 'leader';
  email?: string;
  phone?: string;
  ward?: string;
  department?: string;
  title?: string;
  isAnonymous: boolean;
}

export type Language = 'en' | 'hi';
