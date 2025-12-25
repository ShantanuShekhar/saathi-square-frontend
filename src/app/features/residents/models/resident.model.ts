// Resident models
export enum ResidentStatus {
  PENDING_VERIFICATION = 'PENDING_VERIFICATION',
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  MOVED_OUT = 'MOVED_OUT'
}

export enum RelationshipType {
  OWNER = 'OWNER',
  TENANT = 'TENANT',
  FAMILY_MEMBER = 'FAMILY_MEMBER',
  DEPENDENT = 'DEPENDENT'
}

export interface Resident {
  residentId: string;
  userId: string;
  societyId: string;
  flatId?: string;
  firstName: string;
  lastName: string;
  fullName: string;
  email?: string;
  phoneNumber?: string;
  alternatePhone?: string;
  dateOfBirth?: string;
  relationshipType: RelationshipType;
  status: ResidentStatus;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  profileImageUrl?: string;
  occupation?: string;
  vehicleDetails?: string;
  moveInDate?: string;
  moveOutDate?: string;
  isPrimaryResident: boolean;
  verificationStatus?: string;
  verificationNotes?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface CreateResidentRequest {
  userId: string;
  societyId: string;
  flatId?: string;
  firstName: string;
  lastName: string;
  email?: string;
  phoneNumber?: string;
  alternatePhone?: string;
  dateOfBirth?: string;
  relationshipType: RelationshipType;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  profileImageUrl?: string;
  occupation?: string;
  vehicleDetails?: string;
  moveInDate?: string;
}

export interface UpdateResidentRequest {
  firstName?: string;
  lastName?: string;
  email?: string;
  phoneNumber?: string;
  alternatePhone?: string;
  dateOfBirth?: string;
  relationshipType?: RelationshipType;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  profileImageUrl?: string;
  occupation?: string;
  vehicleDetails?: string;
  flatId?: string;
}

export interface ResidentFilterRequest {
  societyId: string;
  flatId?: string;
  status?: ResidentStatus;
  relationshipType?: RelationshipType;
  verificationStatus?: string;
  searchTerm?: string;
  pageNo: number;
  pageSize: number;
}

