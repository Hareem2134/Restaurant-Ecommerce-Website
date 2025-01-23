"use client"
import React from 'react'
import Image from "next/image";
import FoodCategory from "../../components/FoodCategory";
import HeroAboutus from '../../components/HeroAboutus';
import HomePageExperience from '../../components/HomePageExperience';
import ChefOnHome from '../../components/ChefOnHome';

import AIRecommendations from '../../components/AIRecommendations';
import AnalyticsDashboard from '../../components/AnalyticsDashboard';
import BulkUpload from '../../components/BulkUpload';
import DiscountPromotion from '../../components/DiscountPromotion';
import FilterPanel from '../../components/FilterPanel';
import GiftCardVoucher from '../../components/GiftCardVoucher';
import OrderTracking from '../../components/OrderTracking';
import ReviewsAndRatings from '../../components/ReviewsAndRatings';
import SocialMediaSharing from '../../components/SocialMediaSharing';
import Wishlist from '../../components/Wishlist';
import UserProfile from '../../components/UserProfile';
import AdminDashboard from '../../components/AdminDashboard';
import AdvancedSearch from '../../components/AdvancedSearch';
import Notifications from '../../components/Notifications';
import ProductComparison from '../../components/ProductComparison';
import RelatedProducts from '../../components/RelatedProducts';
import SubscriptionManagement from '../../components/SubscriptionManagement';


function HomePage() {
  return (
    <>
      <section className='bg-black px-3 md:px-[135px] flex flex-col justify-evenly md:flex-row  md:items-center py-[50px]'>
         {/* Heading */}
         <div className='text-white w-full md:w-[50%]'>
          <h1 className='md:text-[32px] text-[24px] font-normal text-[#FF9F0D] font whitespace-nowrap'>
            Its Quick & Amusing!
          </h1>

          <h1 className='text-[25px] md:text-[50px] font-bold whitespace-nowrap md:whitespace-normal'>

            <span className='text-[#FF9F0D]'>Th</span>e Art of speed food Quality
          </h1>

          <p className='text-[10px] md:text-[16px] font-normal'>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Varius sed pharetra dictum neque massa congue
          </p>

          <div className='flex flex-col md:flex-row items-center md:items-start'>

          <button className='bg-[#FF9F0D] text-white w-[100px] h-[30px] md:w-[190px] md:h-[60px] rounded-[40px] mt-[32px] hover:bg-yellow-800'>
            See More
          </button>
          </div>
        </div>

        {/* Image */}
        <div className='mt-[50px] md:mt-0 '>   
            <Image 
                src="/hero.png"
                alt='Hero Image'
                width={700}
                height={500}
                className=''
            />
        </div>
    </section>

    <HeroAboutus/>
    <FoodCategory/>
    <HomePageExperience/>
    <ChefOnHome/>

    <hr/>
    <hr/>
    <hr/>
    <hr/>

            <AdminDashboard/>
            <AdvancedSearch/>
            <AIRecommendations/>
            <AnalyticsDashboard/>
            <BulkUpload/>
            <DiscountPromotion/>
            <FilterPanel/>
            <GiftCardVoucher/>
            <Notifications/>
            <OrderTracking/>
            <ProductComparison/>

            <RelatedProducts/>
            <ReviewsAndRatings/>
            <SocialMediaSharing/>

            <SubscriptionManagement/>
            <UserProfile/>
            <Wishlist/>

    </>
  )
}

export default HomePage