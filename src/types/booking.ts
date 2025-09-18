export interface bookingRequest {
  scheduleId: string;
  bookingType: string;
  isGuest: boolean;
  name: string;
  phoneNumber: string;
  isPlayer: boolean;
  isGk: boolean;
}

export interface bookingResponse {}
