import React from "react";

const NotFoundContracts = () => {
  return (
    <div className="w-full flex flex-col items-center justify-center text-center py-10 bg-[#f8f8f8] rounded-lg shadow-sm mt-10">
      <h2 className="text-xl font-semibold text-[#11191f] mb-4">
        Договорів не знайдено
      </h2>
      <p className="text-lg text-[#555] mb-6">
        Схоже, ви ще не додали жодного контракту. Щоб почати, просто натисніть
        кнопку «Додати договір» вище.
      </p>
    </div>
  );
};

export default NotFoundContracts;
