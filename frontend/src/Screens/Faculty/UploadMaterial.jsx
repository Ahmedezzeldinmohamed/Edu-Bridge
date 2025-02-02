import React, { useState } from "react";
import axios from "axios";

const UploadAIMaterial = () => {
  const [file, setFile] = useState(null);
  const [questionsAnswers, setQuestionsAnswers] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setError("");
    } else {
      setError("Please select a valid file.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      setError("Please select a file to upload.");
      return;
    }

    setLoading(true);
    setError("");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post("http://localhost:5000/api/ai-material/upload-ai-material", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.data.success) {
        setQuestionsAnswers(response.data.questionsAnswers);
      } else {
        setError(response.data.message || "Error processing file.");
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      setError("Failed to upload file. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">رفع المادة التعليمية</h2>
      <form onSubmit={handleSubmit} className="mb-4">
        <input type="file" onChange={handleFileChange} className="mb-2" />
        <button
          type="submit"
          className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 disabled:bg-blue-300"
          disabled={loading}
        >
          {loading ? "جاري التحميل..." : "رفع الملف"}
        </button>
      </form>

      {error && <div className="text-red-500 mb-4">{error}</div>}

      {questionsAnswers && (
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h3 className="text-xl font-bold mb-2">الأسئلة والأجوبة:</h3>
          <pre className="whitespace-pre-wrap">{questionsAnswers}</pre>
        </div>
      )}
    </div>
  );
};

export default UploadAIMaterial;