import React from 'react';

const PaginationOnShop = () => {
  return (
    <div className="flex justify-center items-center mt-6">
      <button className="border rounded px-3 py-1 mx-1">&laquo;</button>
      <button className="border rounded px-3 py-1 mx-1 bg-orange-500 text-white">1</button>
      <button className="border rounded px-3 py-1 mx-1">2</button>
      <button className="border rounded px-3 py-1 mx-1">3</button>
      <button className="border rounded px-3 py-1 mx-1">&raquo;</button>
    </div>
  );
};

export default PaginationOnShop;