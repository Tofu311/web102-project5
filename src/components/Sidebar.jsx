import { useState } from "react";
import OverviewIcon from "../assets/Overview.svg";
import SearchIcon from "../assets/Search.svg";
import SaveIcon from "../assets/Saved.svg";
import AboutIcon from "../assets/About.svg";
import ControlIcon from "../assets/control.png";
import ControllerIcon from "../assets/Controller.svg";

const Sidebar = () => {
  const [open, setOpen] = useState(true);
  const Menus = [
    { title: "Overview", src: OverviewIcon },
    { title: "Search", src: SearchIcon },
    { title: "Saved Games", src: SaveIcon },
    { title: "About", src: AboutIcon },
  ];

  return (
    <div className="flex">
      <div
        className={`${open ? "w-72" : "w-20"} h-screen bg-black p-5 pt-8 relative duration-300`}
      >
        <img
          src={ControlIcon}
          className={`absolute cursor-pointer -right-3 top-9 w-7 border-dark-purple
         border-2 rounded-full ${!open && "rotate-180"}`}
          onClick={() => setOpen(!open)}
        />
        <div className="flex gap-x-4 items-center">
          <img
            src={ControllerIcon}
            className={`cursor-pointer duration-500 ${open && "rotate-[360deg]"
              }`}
          />
          <h1
            className={`text-white origin-left font-medium text-xl duration-200 ${!open && "scale-0"
              }`}
          >
            Game On!
          </h1>
        </div>
        <ul className="pt-6">
          {Menus.map((Menu, index) => (
            <li
              key={index}
              className={`flex  rounded-md p-2 cursor-pointer hover:bg-light-white text-gray-300 text-sm items-center gap-x-4 
              ${Menu.gap ? "mt-9" : "mt-2"} ${index === 0 && "bg-light-white"
                } `}
            >
              <img src={Menu.src} />
              <span className={`${!open && "hidden"} origin-left duration-200`}>
                {Menu.title}
              </span>
            </li>
          ))}
        </ul>
      </div>

    </div>
  )
}

export default Sidebar;