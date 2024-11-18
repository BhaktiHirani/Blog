// src/components/homepage/CustomDate.js
import React from 'react';

const CustomDate = ({ date }) => {
  const formattedDate = new Date(date).toLocaleDateString();
  return <span>{formattedDate}</span>;
};

export default CustomDate;
