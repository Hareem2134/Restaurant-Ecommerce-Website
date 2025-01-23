"use client"
import React, { useState } from "react";

const FilterPanel: React.FC = () => {
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPriceRange([priceRange[0], parseInt(e.target.value)]);
  };

  const handleBrandChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const values = Array.from(e.target.selectedOptions, (option) => option.value);
    setSelectedBrands(values);
  };

  return (
    <div>
      <h2>Filters</h2>
      <div>
        <label>Price Range:</label>
        <input
          type="range"
          min={0}
          max={1000}
          value={priceRange[1].toString()}
          onChange={handlePriceChange}
        />
      </div>
      <div>
        <label>Brand:</label>
        <select
          multiple
          value={selectedBrands}
          onChange={handleBrandChange}
        >
          <option value="brand1">Brand 1</option>
          <option value="brand2">Brand 2</option>
        </select>
      </div>
      <div>
        <label>
          <input
            type="checkbox"
            checked={inStockOnly}
            onChange={(e) => setInStockOnly(e.target.checked)}
          />
          In Stock Only
        </label>
      </div>
    </div>
  );
};

export default FilterPanel;
