import React from "react";
import GetAllStudent from "../components/department/GetAllStudent";
import PenddingAplication from "../components/department/PenddingAplication";

const DepartmentDashBoard = () => {
  return (
    <div>
      <GetAllStudent />
      <PenddingAplication />
    </div>
  );
};

export default DepartmentDashBoard;
