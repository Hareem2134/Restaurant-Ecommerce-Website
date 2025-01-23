import { SetStateAction, useState } from 'react';

const languages = [
  { code: 'en', label: 'English' },
  { code: 'fr', label: 'French' },
  { code: 'es', label: 'Spanish' },
];

const LanguageSwitcher = () => {
  const [currentLang, setCurrentLang] = useState('en');

  const handleLanguageChange = (code: SetStateAction<string>) => {
    setCurrentLang(code);

    // Redirect to Google Translate URL
    const translateUrl = `https://translate.google.com/translate?sl=auto&tl=${code}&u=${window.location.href}`;
    window.location.href = translateUrl;
  };

  return (
    <div style={{ display: 'inline-block', margin: '10px' }}>
      <select
        value={currentLang}
        onChange={(e) => handleLanguageChange(e.target.value)}
        style={{
          padding: '5px 10px',
          border: '1px solid #ccc',
          borderRadius: '4px',
          fontSize: '14px',
          cursor: 'pointer',
        }}
      >
        {languages.map((lang) => (
          <option key={lang.code} value={lang.code}>
            {lang.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default LanguageSwitcher;
