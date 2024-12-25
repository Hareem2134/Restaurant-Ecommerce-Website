"use client";
import React, { useState } from "react";
import ForAllHeroSections from "../../../components/ForAllHeroSections";

export default function Contact() {
  const [formData, setFormData] = useState<{ name: string; email: string; message: string }>({
    name: "",
    email: "",
    message: "",
  });

  const [formError, setFormError] = useState<string>("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.message) {
      setFormError("Please fill out all fields.");
      return;
    }

    console.log("Form submitted:", formData);
    alert("Thank you for contacting us!");
    setFormData({ name: "", email: "", message: "" });
    setFormError("");
  };

  return (
    <>
      <ForAllHeroSections />

      <div className="min-h-screen bg-gray-100 p-8">
        <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-6">

          <h1 className="flex justify-center text-3xl font-semibold text-gray-800 mb-2 px-4">Contact Us</h1>
          <p className="flex justify-center text-gray-600 mb-10 px-4">
            Have questions or need assistance? Feel free to reach out to us. We're here to help!
          </p>

          <div className="flex justify-center mx-4">
            {/* Form Section */}
            <form
              onSubmit={handleSubmit}
              className="space-y-6 bg-gray-900 p-10 rounded-lg shadow-[0px_8px_24px_rgba(0,0,0,0.5)] max-w-3xl w-full"
            >
              {formError && (
                <p className="text-red-500 text-sm font-medium text-center">{formError}</p>
              )}

              <div className="relative">
                <label htmlFor="name" className="block text-sm font-medium text-gray-300">
                  Your Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="John Doe"
                  className="mt-2 block w-full border border-gray-700 bg-gray-800 text-gray-300 rounded-lg shadow-sm focus:ring-[#FF9F0D] focus:border-[#FF9F0D] px-4 py-3 transition duration-200"
                />
              </div>

              <div className="relative">
                <label htmlFor="email" className="block text-sm font-medium text-gray-300">
                  Your Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="example@domain.com"
                  className="mt-2 block w-full border border-gray-700 bg-gray-800 text-gray-300 rounded-lg shadow-sm focus:ring-[#FF9F0D] focus:border-[#FF9F0D] px-4 py-3 transition duration-200"
                />
              </div>

              <div className="relative">
                <label htmlFor="message" className="block text-sm font-medium text-gray-300">
                  Your Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  placeholder="Write your message here..."
                  rows={5}
                  className="mt-2 block w-full border border-gray-700 bg-gray-800 text-gray-300 rounded-lg shadow-sm focus:ring-[#FF9F0D] focus:border-[#FF9F0D] px-4 py-3 transition duration-200"
                ></textarea>
              </div>

              <div className="text-center">
                <button
                  type="submit"
                  className="px-8 py-3 bg-[#FF9F0D] text-white rounded-full shadow-lg hover:bg-[#e58b0a] focus:outline-none focus:ring focus:ring-[#FF9F0D] transition duration-300"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>





          <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-4 px-4">Our Address</h2>
              <p className="text-gray-600 px-4">123 Main Street</p>
              <p className="text-gray-600 px-4">City, State, ZIP</p>
              <p className="text-gray-600 px-4">Country</p>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-4 px-4">Contact Information</h2>
              <p className="text-gray-600 px-4">
                <span className="font-medium">Phone:</span> +1 (123) 456-7890
              </p>
              <p className="text-gray-600 px-4">
                <span className="font-medium">Email:</span> support@example.com
              </p>
            </div>
          </div>

          <div className="mt-16 px-4 mb-16">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Find Us</h2>
            <div className="h-64 bg-gray-300 rounded-lg flex items-center justify-center">
              {/* Embed Google Map */}
              <iframe
                title="Google Map"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3162.916025829553!2d-122.08424968469126!3d37.421999979825404!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x808fb7330a8c49f3%3A0x2e4e5ddc0a0c68ed!2sGoogleplex!5e0!3m2!1sen!2sus!4v1609450000000!5m2!1sen!2sus"
                className="w-full h-full rounded-lg"
                allowFullScreen={true}
                loading="lazy"
              ></iframe>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}









      // <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 p-8 flex justify-center items-center">
      //   <div className="max-w-4xl mx-auto bg-white shadow-2xl rounded-xl p-10">

      //     <div className="text-center">
      //       <img
      //         src="/path/to/decorative-icon.svg"
      //         alt="Contact Icon"
      //         className="w-16 h-16 mx-auto mb-4"
      //       />
      //       <h1 className="text-4xl font-bold text-gray-800 mb-2">Get in Touch</h1>
      //       <p className="text-gray-600 mb-8">
      //         We'd love to hear from you! Fill out the form below, and we’ll get back to you soon.
      //       </p>
      //     </div>
      //   </div>
      // </div>

