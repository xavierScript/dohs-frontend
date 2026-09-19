// eslint-disable-next-line no-unused-vars
import React from 'react';
import Dev_one from '../assets/dev_one.png';
import Dev_two from '../assets/dev_two.png';
import Dev_three from '../assets/dev_three.png';
import Dev_four from '../assets/dev_four.png';

const Impact = () => {
    return (
        <section className="py-4 bg-darkGray">
            <div className="flex flex-col items-center justify-center gap-6 md:flex-row px-4 text-center mb-5">

                <div className=" grid grid-cols-2 gap-4 md:w-1/4">
                    <img src={Dev_one} alt="Impact 1" className="rounded-lg" />
                    <img src={Dev_two} alt="Impact 2" className="rounded-lg mt-5 md:mt-10" />
                    <img src={Dev_three} alt="Impact 3" className="rounded-lg" />
                    <img src={Dev_four} alt="Impact 4" className="rounded-lg mt-5 md:mt-10" />
                </div>

                <div className='mt-10 font-sans text-white w-full md:w-1/2 md:p-4 self-center'>
                    <h2 className="text-3xl font-bold mb-4 text-left">Impact</h2>
                    <p className=" text-left leading-9 text-base">
                        Intersectoral spillover threat-alert to community health, Prevention of outbreaks of zoonotic disease in animals and
                        people, Improvement in food safety and security, A robust alert system Reduction in anti-microbial resistant infections,
                        Improvement of human and animal health, Empowerment of frontline workers with supportive technologies Protection of
                        global health security, and Protection of biodiversity and conservation.
                    </p>
                </div>
            </div>
        </section>
    );
};

export default Impact;