import Link from "next/link";
import React from "react";
import Image from "next/image";
import ForAllHeroSections from "../../../components/ForAllHeroSections";

export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-white">

      <ForAllHeroSections/>

      {/* Signup Form */}
      <section className="py-16">
        <div className="container mx-auto max-w-md bg-white shadow-lg rounded-md p-8">
          <h3 className="text-2xl font-bold mb-6 text-center">Sign Up</h3>
          <form>
            <div className="mb-4">
              <label className="block mb-2 font-medium">Name</label>
              <div className="flex items-center border rounded px-3 py-2">
                <Image src="/SignupUser.png" alt="Name Icon" width={16} height={16} className="mr-2" />
                <input
                  type="text"
                  className="w-full focus:ring focus:ring-yellow-300 outline-none"
                  placeholder="Name"
                />
              </div>
            </div>
            <div className="mb-4">
              <label className="block mb-2 font-medium">Email</label>
              <div className="flex items-center border rounded px-3 py-2">
                <Image src="/Envelope.png" alt="Email Icon" width={16} height={16} className="mr-2" />
                <input
                  type="email"
                  className="w-full focus:ring focus:ring-yellow-300 outline-none"
                  placeholder="Email"
                />
              </div>
            </div>
            <div className="mb-4">
              <label className="block mb-2 font-medium">Password</label>
              <div className="flex items-center border rounded px-3 py-2">
                <Image src="/Lock.png" alt="Password Icon" width={16} height={16} className="mr-2" />
                <input
                  type="password"
                  className="w-full focus:ring focus:ring-yellow-300 outline-none"
                  placeholder="Password"
                />
              </div>
            </div>
            <div className="flex items-center mb-4">
              <input type="checkbox" className="mr-2" />
              <span>Remember me?</span>
            </div>
            <button
              type="submit"
              className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 rounded"
            >
              Sign Up
            </button>
            <p className="text-center mt-4">
              <Link href="/forgot-password" className="text-yellow-500">Forgot password?</Link>
            </p>
          </form>
          <div className="text-center mt-8">
            <p>or</p>
            <button className="w-full bg-gray-100 border text-black py-2 rounded mt-2 flex items-center justify-center">
              <Image src="/Google.png" alt="Google" width={20} height={20} className="mr-2" />
              Sign up with Google
            </button>
            <button className="w-full bg-gray-100 border text-black py-2 rounded mt-2 flex items-center justify-center">
              <Image src="/Apple.png" alt="Apple" width={20} height={20} className="mr-2" />
              Sign up with Apple
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
