"use client";

import { useState, useEffect } from "react";
import { OnboardingData, City } from "@/models/user";
import { CitiesApiService } from "@/services/citiesApi";
import { School, MapPin, Loader2, Search } from "lucide-react";
import { OnboardingApiService } from "@/services/onboardingApi";
import { SearchBox } from "@/components/ui/SearchBox";

interface AcademicInfoStepProps {
  data: Partial<OnboardingData>;
  onUpdate: (data: Partial<OnboardingData>) => void;
  error?: string;
}

export const AcademicInfoStep = ({
  data,
  onUpdate,
  error,
}: AcademicInfoStepProps) => {
  const [cities, setCities] = useState<City[]>([]);
  const [isLoadingCities, setIsLoadingCities] = useState(true);
  const [filteredCities, setFilteredCities] = useState<City[]>([]);
  const [schools, setSchools] = useState<any>([]);
  const [isLoadingSchools, setIsLoadingSchools] = useState(true);
  const [filteredSchools, setFilteredSchools] = useState<any[]>([]);

  const onUpdateItems = (data: Partial<OnboardingData>) => {
    onUpdate(data);
  };
  useEffect(() => {
    const loadCities = async () => {
      try {
        setIsLoadingCities(true);
        const citiesData = await CitiesApiService.getCities();
        setCities(citiesData);
        setFilteredCities(citiesData);
      } catch (error) {
        console.error("Failed to load cities:", error);
      } finally {
        setIsLoadingCities(false);
      }
    };
    loadCities();
  }, []);
  useEffect(() => {
    const loadSchools = async () => {
      try {
        setIsLoadingSchools(true);
        const schoolsData = await OnboardingApiService.searchSchools();
        console.log(schoolsData, 'schoolsData');
        setSchools(schoolsData);
        setFilteredSchools(schoolsData);
      } catch (error) {
        console.error("Failed to load schools:", error);
      } finally {
        setIsLoadingSchools(false);
      }
    };
    loadSchools();
  }, []);
  return (
    <div className="space-y-6">
      {/* School Name */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <School className="w-5 h-5 text-blue-500" />
          <label className="text-lg font-semibold text-gray-800">
            School Name *
          </label>
        </div>
       <SearchBox
          id="schoolId"
          onUpdate={onUpdateItems}
          setData={setSchools}
          error={error}
          data={schools}
          isLoadingData={isLoadingSchools}
          filteredData={filteredSchools}
          selectedId={data.schoolId} 
          setFilteredData={setFilteredSchools}
       />
      </div>

      {/* City Selection */}
      <div>
      <div className="flex items-center gap-2 mb-3">
        <MapPin className="w-5 h-5 text-blue-500" />
        <label className="text-lg font-semibold text-gray-800">City *</label>
      </div>
        <SearchBox
          id="cityId"
          onUpdate={onUpdateItems}
          setData={setCities} 
          error={error}
          data={cities}
          isLoadingData={isLoadingCities}
          filteredData={filteredCities}
          selectedId={data.cityId}
          setFilteredData={setFilteredCities}
          />
      </div>
    </div>
  );
};

