export type CityId = "isb" | "khi" | "lhe";
export interface City {
  id: CityId;
  name: string;
  areas: string[];
}
