import React from "react";
import { FiCreditCard, FiMail, FiUser, FiUsers } from "react-icons/fi";
import {Link} from "react-router-dom";
import { IoSettings } from "react-icons/io5";


const ShortCuts = () => {
  return (
    <div className="relative top-0">
      {/* <p className="text-xl font-semibold mb-2">Settings</p> */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <Card
        to='/admin/profile'
          title="Account"
          subtitle="Manage profile"
          href="#"
          Icon={FiUser}
        />
        <Card title="Settings" to='/admin/settings' subtitle="Manage settings" href="#" Icon={IoSettings} />
        <Card title="Team" to='/admin/user' subtitle="Manage team" href="#" Icon={FiUsers} />
        <Card
          title="Billing"
          subtitle="Manage cards"
          href="#"
          Icon={FiCreditCard}
        />
      </div>
    </div>
  );
};

const Card = ({ title, subtitle, Icon, href, to }) => {
  return (
    <Link
      to={to}
      href={href}
      className="w-full  p-4 rounded-lg border-[1px] border-slate-300 relative 
      overflow-hidden group bg-white shadow-2xl"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-green-600 to-teal-600 
      translate-y-[100%] group-hover:translate-y-[0%] transition-transform duration-300" />

      <Icon className="absolute z-10 -top-12 -right-12 text-9xl text-slate-100 group-hover:text-violet-400 group-hover:rotate-12 transition-transform duration-300" />
      <Icon className="mb-2 text-2xl text-green-600 group-hover:text-white transition-colors 
      relative z-10 duration-300" />
      <h3 className="font-medium text-lg text-slate-950 group-hover:text-white relative z-10 duration-300">
        {title}
      </h3>
      <p className="text-black group-hover:text-violet-200 
      relative z-10 duration-300 font-montserat-light">
        {subtitle}
      </p>
    </Link>
  );
};

export default ShortCuts;