export interface Schedule {
  id: string;
  name: string;
  date: string;
  time: string;
  venue: string;
  openSlots: string;
  bookedSlots: string;
  totalSlots: string;
  feePlayer: string;
  feeGk: string;
  typeEvent: string;
  typeMatch: string;
  imageUrl: string;
  description: string;
  gmapLink: string;
  address: string;
  facilities: Facilites[];
}

export interface ScheduleDetail extends Schedule {
  rules: Rules[];
  lineUp: object;
}

interface Facilites {
  name: string;
}

export interface Rules {
  description: string;
}
