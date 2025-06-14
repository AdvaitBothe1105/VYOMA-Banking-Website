import React from "react";
import { CiFacebook } from "react-icons/ci";
import { CiTwitter } from "react-icons/ci";
import { FaGooglePlusG } from "react-icons/fa";
import { FaHome } from "react-icons/fa";
import { FaEnvelope } from "react-icons/fa";
import { IoIosCall } from "react-icons/io";
import { FaArrowRightFromBracket } from "react-icons/fa6";

export const Footer = () => {
  return (
    <>
      <footer className="text-white text-center text-lg-start xl:pl-16 md:px-10 bg-[#23242a]">
        <div className="container mx-auto p-4">
          <div className="flex flex-wrap justify-between gap-8 mt-4">
            {/* About Company */}
            <div className="w-full md:w-1/2 lg:w-1/3 mb-4">
              <h5 className="text-xl font-bold mb-4 uppercase">
                About Company
              </h5>
              <p className="text-justify">
                At vero eos et accusamus et iusto odio dignissimos ducimus qui
                blanditiis praesentium voluptatum deleniti atque corrupti.
              </p>
              <p className="text-justify mt-2">
                Blanditiis praesentium voluptatum deleniti atque corrupti quos
                dolores et quas molestias.
              </p>
              <div className="flex gap-3 justify-evenly mt-4">
                <a className="bg-yellow-500 text-black p-2 rounded-full text-xl">
                  <CiFacebook />
                </a>
                <a className="bg-yellow-500 text-black p-2 rounded-full text-xl">
                  <CiTwitter />
                </a>
                <a className="bg-yellow-500 text-black p-2 rounded-full text-xl">
                  <FaGooglePlusG />
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div className="w-full md:w-1/4 lg:w-1/5">
              <h6 className="text-xl font-bold mb-4 uppercase">Quick Links</h6>
              <div className="flex flex-col gap-2">
                <p className="flex items-center gap-2">
                  <FaArrowRightFromBracket />
                  <a href="#" className="text-white hover:underline">
                    Home
                  </a>
                </p>
                <p className="flex items-center gap-2">
                  <FaArrowRightFromBracket />
                  <a href="#" className="text-white hover:underline">
                    Shop
                  </a>
                </p>
                <p className="flex items-center gap-2">
                  <FaArrowRightFromBracket />
                  <a href="#" className="text-white hover:underline">
                    Contact Us
                  </a>
                </p>
              </div>
            </div>

            {/* Contact Info */}
            <div className="w-full md:w-1/2 lg:w-1/3 mb-4">
              <h5 className="text-xl font-bold mb-4">Contact Us:</h5>
              <ul className="space-y-3">
                <li className="flex items-center gap-3">
                  <FaHome />
                  <span>Chembur, Mumbai - 400071</span>
                </li>
                <li className="flex items-center gap-3">
                  <FaEnvelope />
                  <span>asdesigns@outlook.com</span>
                </li>
                <li className="flex items-center gap-3">
                  <IoIosCall />
                  <span>+01 234 567 89</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="text-center p-3 bg-black bg-opacity-20">
          © 2024 Copyright:
          <a
            href="https://mdbootstrap.com/"
            className="text-white hover:underline"
          >
            {" "}
            MDBootstrap.com
          </a>
        </div>
      </footer>
    </>
  );
};
