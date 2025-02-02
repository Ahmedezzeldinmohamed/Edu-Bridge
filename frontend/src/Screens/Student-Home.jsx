import React from "react";
import Assistant from "../../components/Assistant"; // استيراد مكون المساعد

const StudentHome = () => {
  return (
    <div>
      <h1>Student Home</h1>
      <Assistant /> {/* إضافة مكون المساعد هنا */}
    </div>
  );
};

export default StudentHome;