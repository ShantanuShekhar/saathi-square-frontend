// Visitor models
export enum VisitorStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  CHECKED_IN = 'CHECKED_IN',
  CHECKED_OUT = 'CHECKED_OUT',
  CANCELLED = 'CANCELLED',
  EXPIRED = 'EXPIRED'
}

export enum VisitorType {
  GUEST = 'GUEST',
  DELIVERY = 'DELIVERY',
  SERVICE = 'SERVICE',
  CONTRACTOR = 'CONTRACTOR',
  FAMILY = 'FAMILY',
  FRIEND = 'FRIEND',
  OTHER = 'OTHER'
}

export interface Visitor {
  visitorId: string;
  visitorCode: string;
  visitorName: string;
  phoneNumber: string;
  email?: string;
  idType?: string;
  idNumber?: string;
  idProofUrl?: string;
  photoUrl?: string;
  visitorType: VisitorType;
  status: VisitorStatus;
  societyId: string;
  flatId?: string;
  hostId: string;
  hostName?: string;
  createdBy?: string;
  purpose?: string;
  expectedArrivalTime: string;
  expectedDepartureTime?: string;
  actualArrivalTime?: string;
  actualDepartureTime?: string;
  vehicleNumber?: string;
  vehicleType?: string;
  numberOfVisitors: number;
  isPreApproved: boolean;
  isRecurring: boolean;
  qrCode?: string;
  gatePassNumber?: string;
  checkedInBy?: string;
  checkedOutBy?: string;
  remarks?: string;
  rejectionReason?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface CreateVisitorRequest {
  visitorName: string;
  phoneNumber: string;
  email?: string;
  idType?: string;
  idNumber?: string;
  idProofUrl?: string;
  photoUrl?: string;
  visitorType: VisitorType;
  societyId: string;
  flatId?: string;
  purpose?: string;
  expectedArrivalTime: string;
  expectedDepartureTime?: string;
  vehicleNumber?: string;
  vehicleType?: string;
  numberOfVisitors?: number;
  isPreApproved?: boolean;
  isRecurring?: boolean;
}

export interface UpdateVisitorRequest {
  visitorName?: string;
  phoneNumber?: string;
  email?: string;
  idType?: string;
  idNumber?: string;
  idProofUrl?: string;
  photoUrl?: string;
  visitorType?: VisitorType;
  purpose?: string;
  expectedArrivalTime?: string;
  expectedDepartureTime?: string;
  vehicleNumber?: string;
  vehicleType?: string;
  numberOfVisitors?: number;
}

export interface VisitorFilterRequest {
  societyId: string;
  flatId?: string;
  hostId?: string;
  visitorType?: VisitorType;
  status?: VisitorStatus;
  dateFrom?: string;
  dateTo?: string;
  searchTerm?: string;
  pageNo: number;
  pageSize: number;
}

