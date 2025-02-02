import React, { useState } from "react";
import axios from "axios";

const Faculty = () => {
  const [file, setFile] = useState(null);
  const [questionsAnswers, setQuestionsAnswers] = useState("");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post("http://localhost:5000/api/faculty/upload-material", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.data.success) {
        setQuestionsAnswers(response.data.questionsAnswers);
      } else {
        console.error("Error:", response.data.message);
      }
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">رفع المادة التعليمية</h2>
      <form onSubmit={handleSubmit} className="mb-4">
        <input type="file" onChange={handleFileChange} className="mb-2" />
        <button type="submit" className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600">
          رفع الملف
        </button>
      </form>

      {questionsAnswers && (
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h3 className="text-xl font-bold mb-2">الأسئلة والأجوبة:</h3>
          <pre className="whitespace-pre-wrap">{questionsAnswers}</pre>
        </div>
      )}
    </div>
  );
};

export default Faculty;