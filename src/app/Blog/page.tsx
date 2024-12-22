import React from 'react'
import ForAllHeroSections from '../../../components/ForAllHeroSections'
import BlogCardOnBlog from "../../../components/BlogCardOnBlog";
import SidebarOnBlog from "../../../components/SidebarOnBlog";

export default function Blog() {

  const blogs = [
    {
      image: "/BlogImage1.png",
      date: "Feb 14, 2022",
      title: "10 Reasons To Do A Digital Detox Challenge",
      description: "At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat",
    },
    {
      image: "/BlogImage2.png",
      date: "Feb 15, 2022",
      title: "The Ultimate Burger with Sweet Bread Cheese",
      description: "At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat",
    },
    {
      image: "/BlogImage3.png",
      date: "/DateOnBlog.png",
      title: "Vegetarian Egg Drop in Ramen Soup",
      description: "At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat",
    },
    {
      image: "/BlogImage4.png",
      date: "/DateOnBlog.png",
      title: "My Favorite Easy Black Pizza Toast Recipe",
      description: "At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat",
    },
  ];


  return (
    <>
    <div>
        <ForAllHeroSections/>
    </div>

    <div className="bg-gray-100 min-h-screen p-5 px-48 py-20">
      <div className="container mx-auto flex flex-col md:flex-row">
        <div className="w-full md:w-2/3 lg:w-3/4 space-y-6 pr-8">
          {blogs.map((blog, idx) => (
            <BlogCardOnBlog
              key={idx}
              image={blog.image}
              date={blog.date}
              title={blog.title}
              description={blog.description}
            />
          ))}
        </div>

      <SidebarOnBlog/>
      </div>

    </div>
    </>
  );
}
