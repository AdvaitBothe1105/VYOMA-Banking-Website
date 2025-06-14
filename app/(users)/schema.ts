import * as z from "zod";

export const userFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  phone: z.string().regex(/^\d{10}$/, "Invalid phone number"),
  dob: z.string().min(1, "DOB is required"),
  address: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  pincode: z.string().regex(/^\d{6}$/, "Invalid pincode"),
  aadharNumber: z.string().regex(/^\d{12}$/, "Invalid Aadhar number"),
  panNumber: z.string().regex(/^[A-Z]{5}[0-9]{4}[A-Z]$/, "Invalid PAN"),
  accountType: z.string().min(1, "Select an account type"),
  agree: z.literal(true, {
    errorMap: () => ({ message: "You must agree to terms." }),
  }),
});
