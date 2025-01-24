// "use client"
// import { SetStateAction, useState } from 'react';

// const languages = [
//   { code: 'en', label: 'English' },
//   { code: 'ur', label: 'Urdu' },
//   { code: 'ar', label: 'Arabic' },
//   { code: 'fr', label: 'French' },
//   { code: 'es', label: 'Spanish' },
//   { code: 'de', label: 'German' },
//   { code: 'zh', label: 'Chinese' },
// ];

// const LanguageSwitcher = () => {
//   const [currentLang, setCurrentLang] = useState('en');

//   const handleLanguageChange = (code: SetStateAction<string>) => {
//     setCurrentLang(code);

//     const translateUrl = `https://translate.google.com/translate?sl=auto&tl=${code}&u=${window.location.href}`;
//     window.location.href = translateUrl;
//   };

//   return (
//     <div >
//       <select
//         value={currentLang}
//         onChange={(e) => handleLanguageChange(e.target.value)}
//         className="p-3 border border-gray-300 rounded-lg bg-white text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
//         style={{
//           padding: '5px 10px',
//           border: '1px solid #ccc',
//           borderRadius: '4px',
//           fontSize: '14px',
//           cursor: 'pointer',
//         }}
//       >
//         {languages.map((lang) => (
//           <option
//             key={lang.code}
//             value={lang.code}>
//             {lang.label}
//           </option>
//         ))}
//       </select>
//     </div>
//   );
// };

// export default LanguageSwitcher;



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
      className="bg-black text-white border border-gray-500 rounded-md px-3 py-1 text-sm cursor-pointer focus:outline-none focus:ring-2 focus:ring-orange-500"
    >
      {languages.map((lang) => (
        <option key={lang.code} value={lang.code} className="text-white">
          {lang.label}
        </option>
      ))}
    </select>
  );
};

export default LanguageSwitcher;
