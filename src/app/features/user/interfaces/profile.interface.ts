export interface IAddress {
  id?: number;
  userEmail: string;
  firstName: string;
  lastName: string;
  mobile: string;
  line1: string;
  line2: string;
  city: string;
  state: string;
  pincode: string;
  isPrimaryAddress?: boolean;
}
