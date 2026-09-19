// eslint-disable-next-line no-unused-vars
import React from 'react';
import { useNavigate } from 'react-router-dom';
import report from '../assets/report_img.png';
import surveillance from '../assets/surveillance_img.png';
import assistance from '../assets/assistance_img.png';
import analytics from '../assets/analytics_img.png';
import rightArrow from '../assets/b_right_arrow.png';

const serviceData = [
  { title: 'Report Generation', image: report },
  { title: 'Surveillance Map', image: surveillance },
  { title: 'AI Assistance', image: assistance },
  { title: 'Analytics', image: analytics },
  { title: 'One Health Articles', image: report },
  { title: 'Data Analytics', image: surveillance },
  { title: 'Disease Prevention', image: assistance },
  { title: 'Hotlines', image: analytics },
];

const Services = () => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate('/login');
  };

  return (
    <section className="py-20 px-6 md:px-0 bg-gray-50 font-primary">
      <div className="container mx-auto flex flex-col w-full md:w-4/5">
        {/* Heading */}
        <h3 className="text-4xl font-bold text-center mb-6 text-darkCoal">
          Services we offer you
        </h3>
        <p className="text-center text-lg font-normal text-darkCoal mb-16">
          With a comprehensive suite of tools, you can effortlessly monitor and manage
          <br /> public health data. Enhance your surveillance capabilities today.
        </p>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8 self-center w-full">
          {serviceData.map((service, index) => (
            <div
              key={index}
              role="button"
              tabIndex={0}
              onClick={handleCardClick}
              onKeyDown={(e) => e.key === 'Enter' && handleCardClick()}
              className="group bg-white shadow hover:shadow-lg rounded-lg cursor-pointer transition-transform transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-teal-400"
            >
              <img
                src={service.image}
                alt={service.title}
                className="rounded-t-lg w-full object-cover"
              />
              <div className="flex p-4 justify-between items-center">
                <h4 className="text-base text-darkCoal font-medium group-hover:text-teal-600 transition-colors">
                  {service.title}
                </h4>
                <img src={rightArrow} alt="right arrow" className="w-5 h-5" />
              </div>
            </div>
          ))}
        </div>

        {/* View All */}
        <div className="mt-10 text-right">
          <a
            href="#"
            className="text-steelBlue font-primary font-medium text-base hover:underline"
          >
            View All
          </a>
        </div>
      </div>
    </section>
  );
};

export default Services;
