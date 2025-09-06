export interface ILocation {
  latitude: number;
  longitude: number;
}

export interface IIncident {
  id: string;
  title: string;
  description: string;
  media: string[];
  tags: string[];
  location: ILocation;
  createdAt: Date;
  updatedAt: Date;
}
