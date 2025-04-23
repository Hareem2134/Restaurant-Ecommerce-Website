import { SetStateAction, useState } from "react";

const languages = [
  { code: "en", label: "English" },
  { code: "ur", label: "Urdu" },
  { code: "ar", label: "Arabic" },
  { code: "fr", label: "French" },
  { code: "es", label: "Spanish" },
  { code: "de", label: "German" },
  { code: "zh", label: "Chinese" },
];

const LanguageSwitcher = () => {
  const [currentLang, setCurrentLang] = useState("en");

  const handleLanguageChange = (code: SetStateAction<string>) => {
    setCurrentLang(code);

    // Redirect to Google Translate URL
    const translateUrl = `https://translate.google.com/translate?sl=auto&tl=${code}&u=${window.location.href}`;
    window.location.href = translateUrl;
  };

  return (
    <select
      value={currentLang}
      onChange={(e) => handleLanguageChange(e.target.value)}
      className="bg-black text-white font-bold border border-gray-500 rounded-md px-3 py-1 text-sm cursor-pointer focus:outline-none focus:ring-2 focus:ring-orange-500"
    >
      {languages.map((lang) => (
        <option key={lang.code} value={lang.code} className="text-white font-bold">
          {lang.label}
        </option>
      ))}
    </select>
  );
};

export default LanguageSwitcher;
