"use client";

import { FilterOptions } from "@/config/types";
import { api } from "@/lib/api-client";
import { useEffect, useState, useCallback } from "react";
import { NativeSelect } from "../ui/native-select";
import { Region, Province, CityMunicipality, Barangay } from "@/config/types";
import {
  findProvinceIdByCode,
  filterCitiesByProvince,
  findCityIdByCode,
  filterBarangaysByCity,
} from "@/lib/utils";
import { Input } from "../ui/input";

interface AddressFilterProps {
  onAddressChange: (address: string) => void;
  defaultAddress?: string;
}

export const AddressFilter = ({
  onAddressChange,
  defaultAddress,
}: AddressFilterProps) => {
  const [regions, setRegions] = useState<FilterOptions<string, string>>([]);
  const [provinces, setProvinces] = useState<FilterOptions<string, string>>([]);
  const [cities, setCities] = useState<FilterOptions<string, string>>([]);
  const [barangays, setBarangays] = useState<FilterOptions<string, string>>([]);

  // Raw data storage for filtering purposes
  const [rawProvinces, setRawProvinces] = useState<Province[]>([]);
  const [rawCities, setRawCities] = useState<CityMunicipality[]>([]);
  const [rawBarangays, setRawBarangays] = useState<Barangay[]>([]);

  const [selectedRegionCode, setSelectedRegionCode] = useState<string>("");
  const [selectedProvinceCode, setSelectedProvinceCode] = useState<string>("");
  const [selectedCityCode, setSelectedCityCode] = useState<string>("");
  const [selectedBarangayCode, setSelectedBarangayCode] = useState<string>("");
  const [addressLine, setAddressLine] = useState<string>("");

  // Selected names for building the address string
  const [selectedRegionName, setSelectedRegionName] = useState<string>("");
  const [selectedProvinceName, setSelectedProvinceName] = useState<string>("");
  const [selectedCityName, setSelectedCityName] = useState<string>("");
  const [selectedBarangayName, setSelectedBarangayName] = useState<string>("");

  const [loading, setLoading] = useState({
    regions: false,
    provinces: false,
    cities: false,
    barangays: false,
  });

  // Helper function to build complete address string
  const buildAddressString = useCallback(() => {
    const addressParts = [];

    if (addressLine.trim()) {
      addressParts.push(addressLine.trim());
    }

    if (selectedBarangayName) {
      addressParts.push(`Barangay ${selectedBarangayName}`);
    }

    if (selectedCityName) {
      addressParts.push(selectedCityName);
    }

    if (selectedProvinceName) {
      addressParts.push(selectedProvinceName);
    }

    if (selectedRegionName) {
      addressParts.push(selectedRegionName);
    }

    return addressParts.join(", ");
  }, [
    addressLine,
    selectedBarangayName,
    selectedCityName,
    selectedProvinceName,
    selectedRegionName,
  ]);

  // Update parent component whenever address changes
  useEffect(() => {
    const fullAddress = buildAddressString();
    onAddressChange(fullAddress);
  }, [buildAddressString, onAddressChange]);

  // Fetch regions on component mount
  useEffect(() => {
    const fetchRegions = async () => {
      try {
        setLoading((prev) => ({ ...prev, regions: true }));
        const regionsEndpoint = "https://psgc.cloud/api/regions";
        const data = await api.get<Region[]>(regionsEndpoint);

        const formattedRegions = data.map((region) => ({
          label: region.name,
          value: region.code,
        }));

        setRegions(formattedRegions);
      } catch (err) {
        console.error("Error fetching regions:", err);
        setRegions([]);
      } finally {
        setLoading((prev) => ({ ...prev, regions: false }));
      }
    };

    fetchRegions();
  }, []);

  // Fetch provinces when region changes
  useEffect(() => {
    const fetchProvinces = async () => {
      if (!selectedRegionCode) {
        setProvinces([]);
        return;
      }

      try {
        setLoading((prev) => ({ ...prev, provinces: true }));
        const provincesEndpoint = `https://psgc.cloud/api/regions/${selectedRegionCode}/provinces`;
        const data = await api.get<Province[]>(provincesEndpoint);

        const formattedProvinces = data.map((province) => ({
          label: province.name,
          value: province.code,
        }));

        setRawProvinces(data);
        setProvinces(formattedProvinces);
      } catch (err) {
        console.error("Error fetching provinces:", err);
        setProvinces([]);
      } finally {
        setLoading((prev) => ({ ...prev, provinces: false }));
      }
    };

    fetchProvinces();

    // Reset dependent dropdowns when region changes
    setSelectedProvinceCode("");
    setSelectedCityCode("");
    setSelectedBarangayCode("");
    setSelectedProvinceName("");
    setSelectedCityName("");
    setSelectedBarangayName("");
    setCities([]);
    setBarangays([]);
    setRawProvinces([]);
    setRawCities([]);
    setRawBarangays([]);
  }, [selectedRegionCode]);

  // Fetch cities when province changes
  useEffect(() => {
    const fetchCities = async () => {
      if (!selectedRegionCode || !selectedProvinceCode) {
        setCities([]);
        setRawCities([]);
        return;
      }

      try {
        setLoading((prev) => ({ ...prev, cities: true }));
        const citiesEndpoint = `https://psgc.cloud/api/regions/${selectedRegionCode}/cities-municipalities`;
        const data = await api.get<CityMunicipality[]>(citiesEndpoint);

        // Find the selected province ID
        const provinceId = findProvinceIdByCode(
          rawProvinces,
          selectedProvinceCode
        );
        if (!provinceId) {
          setCities([]);
          setRawCities([]);
          return;
        }

        // Filter cities by the selected province
        const filteredCities = filterCitiesByProvince(data, provinceId);

        const formattedCities = filteredCities.map((city) => ({
          label: city.name,
          value: city.code,
        }));

        setRawCities(filteredCities);
        setCities(formattedCities);
      } catch (err) {
        console.error("Error fetching cities:", err);
        setCities([]);
        setRawCities([]);
      } finally {
        setLoading((prev) => ({ ...prev, cities: false }));
      }
    };

    fetchCities();

    // Reset dependent dropdowns when province changes
    setSelectedCityCode("");
    setSelectedBarangayCode("");
    setSelectedCityName("");
    setSelectedBarangayName("");
    setBarangays([]);
    setRawBarangays([]);
  }, [selectedProvinceCode, selectedRegionCode, rawProvinces]);

  // Fetch barangays when city changes
  useEffect(() => {
    const fetchBarangays = async () => {
      if (!selectedRegionCode || !selectedCityCode) {
        setBarangays([]);
        setRawBarangays([]);
        return;
      }

      try {
        setLoading((prev) => ({ ...prev, barangays: true }));
        const barangaysEndpoint = `https://psgc.cloud/api/regions/${selectedRegionCode}/barangays`;
        const data = await api.get<Barangay[]>(barangaysEndpoint);

        // Find the selected city ID
        const cityId = findCityIdByCode(rawCities, selectedCityCode);
        if (!cityId) {
          setBarangays([]);
          setRawBarangays([]);
          return;
        }

        // Filter barangays by the selected city
        const filteredBarangays = filterBarangaysByCity(data, cityId);

        const formattedBarangays = filteredBarangays.map((barangay) => ({
          label: barangay.name,
          value: barangay.code,
        }));

        setRawBarangays(filteredBarangays);
        setBarangays(formattedBarangays);
      } catch (err) {
        console.error("Error fetching barangays:", err);
        setBarangays([]);
        setRawBarangays([]);
      } finally {
        setLoading((prev) => ({ ...prev, barangays: false }));
      }
    };

    fetchBarangays();

    // Reset dependent dropdown when city changes
    setSelectedBarangayCode("");
    setSelectedBarangayName("");
  }, [selectedCityCode, selectedRegionCode, rawCities]);

  const handleRegionChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const regionCode = e.target.value;
      setSelectedRegionCode(regionCode);

      // Find and set the region name
      const region = regions.find((r) => r.value === regionCode);
      setSelectedRegionName(region?.label || "");
    },
    [regions]
  );

  const handleProvinceChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const provinceCode = e.target.value;
      setSelectedProvinceCode(provinceCode);

      // Find and set the province name
      const province = provinces.find((p) => p.value === provinceCode);
      setSelectedProvinceName(province?.label || "");
    },
    [provinces]
  );

  const handleCityChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const cityCode = e.target.value;
      setSelectedCityCode(cityCode);

      // Find and set the city name
      const city = cities.find((c) => c.value === cityCode);
      setSelectedCityName(city?.label || "");
    },
    [cities]
  );

  const handleBarangayChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const barangayCode = e.target.value;
      setSelectedBarangayCode(barangayCode);

      // Find and set the barangay name
      const barangay = barangays.find((b) => b.value === barangayCode);
      setSelectedBarangayName(barangay?.label || "");
    },
    [barangays]
  );

  const handleAddressLineChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setAddressLine(e.target.value);
    },
    []
  );

  return (
    <div className="space-y-4">
      <NativeSelect
        label="Region"
        name="region"
        value={selectedRegionCode}
        onChange={handleRegionChange}
        options={regions}
        disabled={loading.regions}
        placeholder={loading.regions ? "Loading regions..." : "Select a region"}
      />

      <NativeSelect
        label="Province"
        name="province"
        value={selectedProvinceCode}
        onChange={handleProvinceChange}
        options={provinces}
        disabled={!selectedRegionCode || loading.provinces}
        placeholder={
          !selectedRegionCode
            ? "Select a region first"
            : loading.provinces
            ? "Loading provinces..."
            : "Select a province"
        }
      />

      <NativeSelect
        label="City/Municipality"
        name="city"
        value={selectedCityCode}
        onChange={handleCityChange}
        options={cities}
        disabled={!selectedProvinceCode || loading.cities}
        placeholder={
          !selectedProvinceCode
            ? "Select a province first"
            : loading.cities
            ? "Loading cities..."
            : "Select a city/municipality"
        }
      />

      <NativeSelect
        label="Barangay"
        name="barangay"
        value={selectedBarangayCode}
        onChange={handleBarangayChange}
        options={barangays}
        disabled={!selectedCityCode || loading.barangays}
        placeholder={
          !selectedCityCode
            ? "Select a city first"
            : loading.barangays
            ? "Loading barangays..."
            : "Select a barangay"
        }
      />

      <Input
        placeholder="Address line (e.g. apartments, suite, unit, building, floor, etc.)"
        disabled={!selectedBarangayCode}
        value={addressLine}
        onChange={handleAddressLineChange}
      />
    </div>
  );
};
