export type Currency = 'AED' | 'USD' | 'EUR' | 'GBP' | 'CAD';

export type TripType = 'ONEWAY' | 'RETURN' | 'MULTI CITY';

export type CabinClass = 'ECONOMY' | 'PREMIUM' | 'BUSINESS' | 'FIRST';

export interface PassengerCount {
  adults: number;
  children: number;
  infants: number;
}

export interface FlightSearchParams {
  tripType: TripType;
  origin: string;
  destination: string;
  departureDate: string;
  returnDate?: string;
  passengers: PassengerCount;
  cabinClass: CabinClass;
}

export interface HotelSearchParams {
  destination: string;
  checkIn: string;
  checkOut: string;
  guests: PassengerCount;
  rooms: number;
  amenities: string[];
}

export interface Package {
  id: string;
  title: string;
  description: string;
  price: number;
  currency: Currency;
  image: string;
  category: 'Umrah' | 'Holiday' | 'UAE' | 'Charter';
}
