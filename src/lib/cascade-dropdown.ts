import { Province, CityMunicipality, Barangay } from "@/config/types";

// Helper function to find province ID by province code
export function findProvinceIdByCode(
  provinces: Province[],
  provinceCode: string
): number | null {
  const province = provinces.find((p) => p.code === provinceCode);
  return province ? province.id : null;
}

// Helper function to find city ID by city code
export function findCityIdByCode(
  cities: CityMunicipality[],
  cityCode: string
): number | null {
  const city = cities.find((c) => c.code === cityCode);
  return city ? city.id : null;
}

// Helper function to filter cities by province
export function filterCitiesByProvince(
  cities: CityMunicipality[],
  provinceId: number
): CityMunicipality[] {
  return cities.filter((city) => city.province_id === provinceId);
}

// Helper function to filter barangays by city
export function filterBarangaysByCity(
  barangays: Barangay[],
  cityId: number
): Barangay[] {
  return barangays.filter(
    (barangay) => barangay.city_municipality_id === cityId
  );
}
