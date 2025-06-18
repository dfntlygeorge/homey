export type Region = {
  id: number;
  code: string;
  name: string;
  created_at: string;
  updated_at: string;
};

export type Province = {
  id: number;
  code: string;
  name: string;
  region_id: number;
  created_at: string;
  updated_at: string;
};

export type CityMunicipality = {
  id: number;
  code: string;
  name: string;
  zip_code: string;
  district: string;
  type: string;
  region_id: number;
  province_id: number;
  created_at: string;
  updated_at: string;
};

export type Barangay = {
  id: number;
  code: string;
  name: string;
  status: string;
  region_id: number;
  province_id: number;
  city_municipality_id: number;
  created_at: string;
  updated_at: string;
};
