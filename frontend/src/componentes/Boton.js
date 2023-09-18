import React from 'react';

const Boton = ({ onClick, text, color }) => {
  return (
    <button
      onClick={onClick}
      style={{
        backgroundColor: "#BADA55",
        display: "inline",
        color: "#666",
        fontWeight: 400,
        borderRadius: "0 5px 5px 0, 0 2rem 2rem 0",
        width: "4rem",
        height: "2rem"
      }}
    >
      {text}
    </button>
  );
};

export default Boton;
