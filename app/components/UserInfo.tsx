"use client";
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { userFormSchema } from "../(users)/schema";
import { useUserStore } from "@/store/userStore"; 
import { useRouter } from "next/navigation";


type FormData = z.infer<typeof userFormSchema>;

const UserInfo = () => {
  const { setUserData } = useUserStore(); 
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(userFormSchema),
  });

  const onSubmit = (data: FormData) => {
      console.log("Form data submitted:", data);
  setUserData(data);
  router.push("/signIn/register/kyc"); // or wherever your KYC form lives
};

  return (
    <div className="flex justify-center items-center min-h-screen bg-[#edeae7] p-10">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white p-8 rounded shadow-md w-full max-w-lg space-y-4"
      >
        <h2 className="text-3xl  text-[#e73a34] text-center">
          Get started!
        </h2>
        <p className="text-sm text-center text-gray-600">
          Please leave your details and we will get in touch with you.
        </p>

        {/* Input Fields */}
        {[
          { label: "Name", id: "name" },
          { label: "Email", id: "email", type: "email" },
          { label: "Password", id: "password", type: "password" },
          { label: "Phone", id: "phone", type: "tel" },
          { label: "Date of Birth", id: "dob", type: "date" },
          { label: "Address", id: "address" },
          { label: "City", id: "city" },
          { label: "State", id: "state" },
          { label: "Pincode", id: "pincode" },
        ].map(({ label, id, type = "text" }) => (
          <div key={id}>
            <label className="block text-sm font-medium text-gray-700">
              {label}*
            </label>
            <input
              type={type}
              {...register(id as keyof FormData)}
              className="input w-full px-3 py-2 mt-1 border border-gray-300 rounded"
            />
            {errors[id as keyof FormData] && (
              <p className="text-red-500 text-xs mt-1">
                {errors[id as keyof FormData]?.message?.toString()}
              </p>
            )}
          </div>
        ))}

        {/* Account Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Account Type*
          </label>
          <select
            {...register("accountType")}
            className="w-full px-3 py-2 mt-1 border border-gray-300 rounded"
          >
            <option value="">Select Account</option>
            <option value="Savings Account">Savings Account</option>
            <option value="Current Account">Current Account</option>
            <option value="DEMAT Account">DEMAT Account</option>
          </select>
          {errors.accountType && (
            <p className="text-red-500 text-xs mt-1">
              {errors.accountType.message}
            </p>
          )}
        </div>

        {/* Terms */}
        <div className="flex items-start gap-2">
          <input
            type="checkbox"
            {...register("agree")}
            className="mt-1"
          />
          <label className="text-sm text-gray-700">
            I agree to the Terms and authorize VYOMA Bank to contact me.
          </label>
        </div>
        {errors.agree && (
          <p className="text-red-500 text-xs">{errors.agree.message}</p>
        )}

        {/* Buttons */}
        <button
          type="submit"
          className="w-full bg-black hover:bg-black text-white py-2 rounded-md shadow cursor-pointer"
        >
          Apply Now
        </button>
        <button
          type="button"
          className="w-full bg-gray-500 hover:bg-gray-600 text-white py-2 rounded-md"
        >
          Back
        </button>
      </form>
    </div>
  );
};

export default UserInfo;
