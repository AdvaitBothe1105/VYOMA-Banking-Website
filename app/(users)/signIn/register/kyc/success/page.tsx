import SuccessPage from "@/app/components/SuccessKYC";
import React, { Suspense } from "react";

const page = () => {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <SuccessPage />
      </Suspense>
    </div>
  );
};

export default page;
