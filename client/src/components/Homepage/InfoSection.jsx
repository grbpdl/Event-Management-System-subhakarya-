import React from 'react'
import styles from "../../style";

import { ganesh } from "../../assets";

const InfoSection = () => {
  return (
    <section id="home" className={`flex md:flex-row flex-col`} >
      <div className={`flex-1 ${styles.flexStart} flex-col xl:px-0 sm:px-16 px-6`}>
        <div className="flex flex-row items-center py-[6px] px-4 bg-discount-gradient rounded-[10px] mb-2">
          <p className={`${styles.paragraph} ml-2`}>
          <span className="text-white">卐 </span>With you from{" "}
            <span className="text-white">Shree Ganesh</span> to the end<span className="text-white"> 卐  </span>
          </p>
        </div>
      

        <div className="flex flex-row justify-between items-center w-full">
          <h1 className="flex-1 font-poppins font-semibold ss:text-[60px] text-[50px] text-white ss:leading-[100.8px] leading-[60px]">
            Giving you smooth <br className="sm:block hidden" />{" "}
            <span className="text-gradient">Management</span>{" "}
          </h1>

        </div>

        <h1 className="font-poppins font-semibold ss:text-[60px] text-[50px] text-white ss:leading-[100.8px] leading-[60px] w-full">
          At your Fingertips
        </h1>
        
        <p className={`${styles.paragraph} max-w-[470px] mt-5`}>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Repudiandae pariatur officia aperiam
           temporibus dolor? Iure aliquid repellat alias ex, eum quidem possimus quod numquam maxime nesciunt
            et similique tempore placeat.
        </p>
      </div>
      <div className={`flex-1 flex ${styles.flexCenter} md:my-0 my-10 relative`}>
        <img src={ganesh} alt="ganesh" className="  w-[100%] h-[100%] relative z-[5]" />

        {/* gradient start */}
        <div className="absolute z-[0] w-[40%] h-[35%] top-0 pink__gradient" />
        <div className="absolute z-[1] w-[80%] h-[80%] rounded-full white__gradient bottom-40" />
        <div className="absolute z-[0] w-[50%] h-[50%] right-20 bottom-20 blue__gradient" />
        {/* gradient end */}
      </div>

     
    </section>
  );
};

export default InfoSection;
