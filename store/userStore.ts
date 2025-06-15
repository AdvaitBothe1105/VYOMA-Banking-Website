// store/userStore.ts
import { create } from "zustand";

type UserData = {
  name: string;
  email: string;
  password: string;
  phone: string;
  dob: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  accountType: string;
  agree: boolean;
};

type UserStore = {
  userData: Partial<UserData>;
  setUserData: (data: Partial<UserData>) => void;
  clearUserData: () => void;
};

export const useUserStore = create<UserStore>((set) => ({
  userData: {},
  setUserData: (data) =>
    set((state) => ({
      userData: { ...state.userData, ...data },
    })),
  clearUserData: () => set({ userData: {} }),
}));
