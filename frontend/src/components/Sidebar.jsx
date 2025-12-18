import React, { useState } from "react";
import logo from "../assets/logo.png";
import { LayoutDashboard, PlusCircle, ListChecks } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { MenuIcon } from "lucide-react";

const Sidebar = () => {

  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation()
  const current = location.pathname

  return (
    <>
      <div className="bg-[#24242C] m-5 h-[95%] rounded-[5px] max-h-screen overflow-y-hidden hidden md:block">
        <div className="p-2 flex items-center gap-1">
          <img src={logo} className="w-12 h-12 p-2 rounded-[50%]" alt="" />
          <h1 className="text-[#E5E7EB] font-bold text-2xl">CrediSense</h1>
        </div>
        <ul className="mt-10 flex flex-col gap-10 p-5 text-[#A1A1AA]">
          <li
            className={`flex gap-2 items-center ${
              current === "/"
                ? "bg-purple-500 text-white p-2 rounded-[5px]"
                : ""
            }`}
          >
            <LayoutDashboard /> <Link to="/">Dashboard</Link>
          </li>
          <li
            className={`flex gap-2 items-center ${
              current.startsWith("/New_Prediction")
                ? "bg-purple-500 text-white p-2 rounded-[5px]"
                : ""
            }`}
          >
            <PlusCircle /> <Link to="New_Prediction">New-Prediction</Link>
          </li>
          <li
            className={`flex gap-2 items-center ${
              current === "/Predictions"
                ? "bg-purple-500 text-white p-2 rounded-[5px]"
                : ""
            }`}
          >
            <ListChecks /> <Link to="Predictions">Predictions</Link>
          </li>
        </ul>
        <div className="text-gray-100 p-3 mt-78 text-center text-[12px] opacity-75">
          {/*<div className=" w-[90%] h-[200px] bg-gray-600"></div>*/}
          © 2025 CrediSense — Tous droits réservés.
        </div>
      </div>
      {isOpen && (
        <div
          className="fixed inset-0 bg-gray-500/50 z-40"
          onClick={() => setIsOpen(false)}
        ></div>
      )}
      <div className={`md:hidden overflow-hidden`}>
        <div className="flex items-center justify-between p-2">
          <div className="p-2 flex items-center gap-1">
            <img src={logo} className="w-12 h-12 p-2 rounded-[50%]" alt="" />
            <h1 className="text-[#E5E7EB] font-bold text-2xl">CrediSense</h1>
          </div>
          <div className="p-2">
            <MenuIcon color="white" onClick={() => setIsOpen(true)} size={30} />
          </div>
        </div>
        <div
          className={`md:hidden fixed top-0 right-0 h-[100vh] w-[310px] bg-[#24242C] z-50 transform transition-transform duration-500 ${
            isOpen ? "translate-x-0 duration-300" : "hidden"
          }`}
        >
          <div className="bg-[#24242C] m-5 h-[95%] rounded-[5px] max-h-screen">
            <div className="p-2 flex items-center gap-1">
              <img src={logo} className="w-12 h-12 p-2 rounded-[50%]" alt="" />
              <h1 className="text-[#E5E7EB] font-bold text-2xl">CrediSense</h1>
            </div>
            <ul className="mt-10 flex flex-col gap-10 p-5 text-[#A1A1AA]">
              <li
                className={`flex gap-2 items-center ${
                  current === "/"
                    ? "bg-purple-500 text-white p-2 rounded-[5px]"
                    : ""
                }`}
              >
                <LayoutDashboard /> <Link to="/">Dashboard</Link>
              </li>
              <li
                className={`flex gap-2 items-center ${
                  current.startsWith("/New_Prediction")
                    ? "bg-purple-500 text-white p-2 rounded-[5px]"
                    : ""
                }`}
              >
                <PlusCircle /> <Link to="New_Prediction">New-Prediction</Link>
              </li>
              <li
                className={`flex gap-2 items-center ${
                  current === "/Predictions"
                    ? "bg-purple-500 text-white p-2 rounded-[5px]"
                    : ""
                }`}
              >
                <ListChecks /> <Link to="Predictions">Predictions</Link>
              </li>
            </ul>
            <div>
              {/*<div className=" w-[90%] h-[200px] bg-gray-600"></div>*/}
              © 2025 CrediSense — Tous droits réservés.
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
