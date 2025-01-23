"use client"

import React, { useState } from "react";

const BulkUpload: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string>("");

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      if (
        selectedFile.type === "application/vnd.ms-excel" ||
        selectedFile.type === "text/csv"
      ) {
        setFile(selectedFile);
        setError("");
      } else {
        setError("Please upload a valid CSV file.");
      }
    }
  };

  const handleUpload = () => {
    if (file) {
      // Mock validation & upload
      console.log("Uploading file:", file.name);
      alert("File uploaded successfully!");
      setFile(null);
    } else {
      setError("Please select a file before uploading.");
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Bulk Upload</h2>
      <div className="bg-white p-4 shadow-md rounded-md">
        <input
          type="file"
          accept=".csv"
          onChange={handleFileChange}
          className="mb-4 block"
        />
        {error && <p className="text-red-500">{error}</p>}
        <button
          onClick={handleUpload}
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
        >
          Upload
        </button>
      </div>
    </div>
  );
};

export default BulkUpload;
