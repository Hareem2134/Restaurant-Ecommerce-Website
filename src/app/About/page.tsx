import React from 'react'
import Image from "next/image";
import ForAllHeroSections from '../../../components/ForAllHeroSections'

export default function About() {
  return (
    <div>
        <ForAllHeroSections/>

        {/* First Section: Content and Buttons */}
        <section className="text-white body-font">
          <div className="container mx-auto flex px-5 py-24 items-center">
            {/* Left Image */}
            <div className="flex flex-col md:flex-row items-center md:space-x-4">
              <Image
                className="object-cover object-center w-[309px] h-[400px] rounded-lg"
                alt="About Image"
                src="/About1.png"
                width={309} height={400}
              />
            </div>

            {/* Right Images */}
            <div className="flex flex-col space-y-2 mt-2 ml-4">
              <Image
                className="object-cover object-center w-[309px] h-[230px] rounded-lg"
                alt="Image 2"
                src="/about4.png"
                width={309} height={230}
              />
              <Image
                className="object-cover object-center w-[309px] h-[270px] rounded-lg"
                alt="Image 3"
                src="/aboutt.png"
                width={309} height={270}
              />
            </div>

            {/* Text Content */}
            <div className="lg:flex-grow md:w-1/2 lg:pl-24 md:pl-16 flex flex-col md:items-start md:text-left items-center text-center">
              <h1 className="text-sm mb-4 font-medium text-yellow-400 italic">About us _____</h1>
              <p className="text-white title-font text-3xl font-bold">Food is an important part of a balanced Diet</p>
              <p className="mb-8 leading-relaxed mt-8 text-white">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque diam pellentesque bibendum non dui volutpat fringilla bibendum. Urna, elit augue urna, vitae feugiat pretium donec id elementum. Ultrices mattis vitae mus risus. Lacus nisi, et ac dapibus sit eu velit in consequat.
              </p>
              <div className="flex justify-center">
                <button className="inline-flex text-white bg-orange-400 border-0 py-2 px-3 focus:outline-none rounded text-lg">
                  Show More
                </button>
                <button className="ml-4 inline-flex text-white border-0 py-2 px-3 focus:outline-none rounded text-lg">
                  Watch video
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Second Section: Why Choose Us */}
        <section className="text-white body-font">
          <div className="container mx-auto flex px-5 py-6 items-center justify-center flex-col">
            <h1 className="text-white text-3xl font-bold mt-1">Why Choose Us</h1>
            <p className="text-white text-center mt-2">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque diam pellentesque bibendum non dui volutpat fringilla bibendum.</p>
            <Image
              className="mb-10 object-cover object-center w-[1320px] h-[386px] mt-10"
              alt="Why Choose Us"
              src="/about.png"
              width={1320} height={386}
            />
          </div>
        </section>

        {/* Third Section: Team Members */}
        <section className="text-white body-font">
          <div className="container px-3 py-20 mx-auto">
            <div className="flex flex-wrap -m-4">
              <div className="p-4 md:w-1/3">
                <div className="h-full flex justify-center items-center flex-col border-2 rounded-lg overflow-hidden">
                  <Image src="/Student.png" width={80} height={80} alt="Best Chef" />
                  <div className="p-6">
                    <h1 className="title-font text-lg font-medium text-white mb-2 text-bold text-center">BEST CHEF</h1>
                    <p className="leading-relaxed mb-3 text-center text-white">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque diam pellentesque bibendum non dui volutpat</p>
                  </div>
                </div>
              </div>

              <div className="p-4 md:w-1/3">
                <div className="h-full border-2 flex justify-center items-center flex-col rounded-lg overflow-hidden">
                  <Image src="/Coffee.png" width={80} height={80} alt="120 Item Food" />
                  <div className="p-6">
                    <h1 className="title-font text-lg font-medium text-white mb-2 text-bold text-center">120 Item Food</h1>
                    <p className="leading-relaxed mb-3 text-center text-white">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque diam pellentesque bibendum non dui volutpat</p>
                  </div>
                </div>
              </div>

              <div className="p-4 md:w-1/3">
                <div className="h-full border-2 flex justify-center items-center flex-col rounded-lg overflow-hidden">
                  <Image src="/man.png" width={80} height={80} alt="Clean Environment" />
                  <div className="p-6">
                    <h1 className="title-font text-lg font-medium text-white mb-2 text-bold text-center">Clean Environment</h1>
                    <p className="leading-relaxed mb-3 text-center text-white">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque diam pellentesque bibendum non dui volutpat</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* <Image src="/TeamMember.png" width={1440} height={80} alt="Team Member"/>
        <Image src="/Testimonials.png" width={1273} height={770} alt="Testimonials" className='px-44' />
        <Image src="/FoodMenu.png" width={1320} height={941} alt="Food Menu" className='px-44 mb-16' /> */}

    </div>
  )
}
