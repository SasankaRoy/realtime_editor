import React from "react";
import Avatar from "react-avatar";

export const Client = ({ username }) => {
  
  return (
    <>
      <div className="client_div">
        <Avatar name={username} size={50} round="12px" />
        <span className="userName">{username}</span>
      </div>
    </>
  );
};
