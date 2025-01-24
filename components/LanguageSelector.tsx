"use client";

import React, { useState } from "react";

export default function LanguageSelector() {
  const [selectedLanguage, setSelectedLanguage] = useState("en");

  const languages = [
    { code: "en", name: "English" },
    { code: "fr", name: "French" },
    { code: "es", name: "Spanish" },
    { code: "de", name: "German" },
    { code: "zh", name: "Chinese" },
  ];

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedLanguage(event.target.value);
  };

  return (
    <div className="relative max-w-sm mx-auto mt-4">
      <label
        htmlFor="language-selector"
        className="block text-white text-sm font-medium mb-2"
      >
        Select Language:
      </label>
      <select
        id="language-selector"
        value={selectedLanguage}
        onChange={handleChange}
        className="w-full p-3 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        {languages.map((language) => (
          <option key={language.code} value={language.code}>
            {language.name}
          </option>
        ))}
      </select>
    </div>
  );
}
