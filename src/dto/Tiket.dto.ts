export class TicketDTO {
  id: number;
  status: string;
  departureCity: string;
  departureStation: string;
  departureCoodrs: string;
  departureAt: string;
  arrivalCity: string;
  arrivalStation: string;
  arrivalCoodrs: string;
  arrivalAt: string;
  routePath: string;
  carName?: string;
  carNumber?: string;
  driverName?: string;
  driverPhone?: string;
}
