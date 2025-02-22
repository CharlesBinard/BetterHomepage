import React, { useState, useEffect } from "react";
import { AutoComplete } from "@/components/ui/autocomplete";

export interface City {
    name: string;
    latitude: number;
    longitude: number;
    country: string;
    postcodes?: string[];
}

interface CityAutocompleteProps {
    value?: City;
    onSelect: (data: City) => void;
}

const CityAutocomplete: React.FC<CityAutocompleteProps> = ({ value, onSelect }) => {
    const [searchValue, setSearchValue] = useState<string>("");
    const [selectedValue, setSelectedValue] = useState<string>("");
    const [results, setResults] = useState<City[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    // Initialize searchValue based on the initial value prop
    useEffect(() => {
        if (value) {
            const formattedValue = `${value.name} ${value.postcodes?.[0] || ""}, ${value.country}`;
            setSearchValue(formattedValue);
        } else {
            setSearchValue("");
        }
    }, []); // Run only once on mount

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
                .then((res) => {
                    if (!res.ok) throw new Error(`Error fetching data: ${res.statusText}`);
                    return res.json();
                })
                .then((data) => setResults(data.results || []))
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
        if (!value) return;

        try {
            const city: City = JSON.parse(value);
            const formattedValue = `${city.name} ${city.postcodes?.[0] || ""}, ${city.country}`;
            setSearchValue(formattedValue);
            onSelect(city);
        } catch (error) {
            console.error("Failed to parse selected city JSON:", error);
        }
    };

    const items = results.map((city) => ({
        value: JSON.stringify(city),
        label: `${city.name} ${city.postcodes?.[0] || ""}, ${city.country}`,
    }));

    // Use a key to reset the component when the value changes
    return (
        <div className="relative" key={value ? `${value.name}-${value.country}` : "empty"}>
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