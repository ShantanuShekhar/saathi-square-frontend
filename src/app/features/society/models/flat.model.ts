export interface Flat {
  id: number;
  flatNo: string;
  tower: string;
  floor: number;
  ownerName?: string;
  status: 'Occupied' | 'Vacant';
  documents?: string[];
  paymentHistory?: any[];
}
