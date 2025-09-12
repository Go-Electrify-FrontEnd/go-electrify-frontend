"use client";

export default function PurposeWarning() {
  return (
    <div
      id="purpose-warning"
      className="flex flex-col items-center align-middle w-full border text-center border-stone-300 bg-stone-50 dark:border-stone-700 dark:bg-stone-900 p-2 text-sm text-stone-700 dark:text-stone-200"
    >
      <p className="w-full h-full items-center text-center">
        This is a demo application for educational purposes only. All
        functionalities are assumed.
      </p>

      <p className="w-full h-full items-center text-center italic   ">
        (Ứng dụng này chỉ mang tính chất demo cho mục đích học tập. Mọi chức
        năng đều là giả định.)
      </p>
    </div>
  );
}
