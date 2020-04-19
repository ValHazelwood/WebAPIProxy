import React from "react";

type HeaderProps = {
  title: string;
};

const Header = ({ title }: HeaderProps) => {
  console.log("Header rendered");
  return (
    <header className="header">
      <h2>{title}</h2>
    </header>
  );
};

export default Header;
