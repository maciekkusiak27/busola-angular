export interface Departure {
  name: string;
  direction: string;
  departures: string[];
  type: string;
  carrier: string;
}

export interface DeparturesData {
  stops: Departure[];
}
