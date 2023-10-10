export interface Departure {
  nazwa: string;
  kierunek: string;
  odjazdy: string[];
  typ: string;
  przewoźnik?: string;
}

export interface Przystanek {
  nazwa: string;
  kierunki: string[];
}
