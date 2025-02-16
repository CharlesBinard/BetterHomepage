import React, { useState, useEffect } from "react";
import { AutoComplete } from "@/components/ui/autocomplete";

export interface City {
    name: string;
    latitude: number;
    longitude: number;
    country: string;
}

interface CityAutocompleteProps {
    value?: City;
    onSelect: (data: City) => void;
}

const CityAutocomplete = ({
                              value,
                              onSelect,
                          }: CityAutocompleteProps) => {
    const [searchValue, setSearchValue] = useState<string>("");
    const [selectedValue, setSelectedValue] = useState<string>("");
    const [results, setResults] = useState<City[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        setSearchValue(value ? `${value.name}, ${value.country}` : "");
    }, [value]);

    useEffect(() => {
        if (searchValue.length < 3) {
            setResults([]);
            return;
        }

        const timeoutId = setTimeout(() => {
            setLoading(true);
            fetch(
                `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
                    searchValue
                )}`
            )
                .then((res) => res.json())
                .then((data) => {
                    setResults(data.results || []);
                })
                .catch(console.error)
                .finally(() => setLoading(false));
        }, 500);

        return () => clearTimeout(timeoutId);
    }, [searchValue]);

    const handleSearchValueChange = (value: string) => {
        setSearchValue(value);
        setSelectedValue("");
    };

    const handleSelectedValueChange = (value: string) => {
        setSelectedValue(value);

        if (!value) {
            return;
        }

        try {
            const city: City = JSON.parse(value);
            setSearchValue(`${city.name}, ${city.country}`);
            onSelect(city);
        } catch (error) {
            console.error("Failed to parse JSON:", error);
        }
    };


    const items = results.map((city) => ({
        value: JSON.stringify(city),
        label: `${city.name}, ${city.country}`,
    }));

    return (
        <div className="relative">
            <AutoComplete
                selectedValue={selectedValue}
                onSelectedValueChange={handleSelectedValueChange}
                searchValue={searchValue}
                onSearchValueChange={handleSearchValueChange}
                items={items}
                isLoading={loading}
                placeholder="Enter city name"
                emptyMessage="No results found."
            />
        </div>
    );
};

export default CityAutocomplete;
