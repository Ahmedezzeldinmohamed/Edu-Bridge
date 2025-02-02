import React, { useState } from "react";

const Assistant = () => {
  const [userInput, setUserInput] = useState("");
  const [assistantResponse, setAssistantResponse] = useState("");

  const handleSendMessage = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userInput }),
      });

      const data = await response.json();
      if (data.success) {
        setAssistantResponse(data.message);
      } else {
        console.error("Error:", data.message);
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  // دالة علشان نحول النص لـ قائمة
  const formatResponse = (response) => {
    if (!response) return null;

    // نقسم النص بناءً على النقاط أو العلامات
    const points = response.split("*").filter((point) => point.trim() !== "");

    return (
      <ul className="list-disc list-inside space-y-2">
        {points.map((point, index) => (
          <li key={index} className="text-gray-700">
            {point.trim()}
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div className="flex flex-col h-full bg-gray-50 p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Assistant</h2>
      <div className="flex-grow bg-white p-4 rounded-lg shadow-inner overflow-y-auto mb-4">
        <div className="bg-blue-50 p-3 rounded-lg">
          <h3 className="font-semibold text-blue-800 mb-2">Assistant Response:</h3>
          {formatResponse(assistantResponse)}
        </div>
      </div>
      <div className="flex gap-2">
        <input
          type="text"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder="Type your message here..."
          className="flex-grow p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleSendMessage}
          className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition duration-300"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Assistant;