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

// import React from "react";

// interface PaginationProps {
//   currentPage: number;
//   totalPages: number;
//   onPageChange: (page: number) => void;
// }

// const PaginationOnShop: React.FC<PaginationProps> = ({
//   currentPage,
//   totalPages,
//   onPageChange,
// }) => {
//   return (
//     <div>
//       <button
//         onClick={() => onPageChange(currentPage - 1)}
//         disabled={currentPage === 1}
//       >
//         Previous
//       </button>
//       {[...Array(totalPages)].map((_, index) => (
//         <button
//           key={index}
//           onClick={() => onPageChange(index + 1)}
//           className={currentPage === index + 1 ? "active" : ""}
//         >
//           {index + 1}
//         </button>
//       ))}
//       <button
//         onClick={() => onPageChange(currentPage + 1)}
//         disabled={currentPage === totalPages}
//       >
//         Next
//       </button>
//     </div>
//   );
// };

// export default PaginationOnShop;
