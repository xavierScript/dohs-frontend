// eslint-disable-next-line no-unused-vars
import React from 'react';
import Researcher_1 from '../assets/researcher_one.png';
import Researcher_2 from '../assets/researcher_two.png';
import Researcher_3 from '../assets/researcher_three.png';
import Researcher_4 from '../assets/researcher_four.png';
import Researcher_5 from '../assets/researcher_five.png';
import Researcher_6 from '../assets/researcher_six.png';
import Researcher_placeholder from '../assets/researcher.png';




const teamMembers = {
    researchers: [
        { name: 'Dr. E. Olaye', title: 'Principal Investigator', img: Researcher_1 },
        { name: 'Dr. Omorodion Irowa', title: 'Surgeon', img: Researcher_2 },
        { name: 'Dr. O. Dele-Ogbeide', title: 'Data Scientist', img: Researcher_3 },
        { name: 'Dr. Prudence Ehizuenlen', title: 'Co-Researcher', img: Researcher_6 },
        { name: 'Engr. Moses Omosigho', title: 'Co-Researcher', img: Researcher_4 },
        { name: 'Dr. Florence Elei', title: 'Co-Researcher', img: Researcher_5 },
        { name: 'Dr. Abraham Zirra', title: 'Co-Researcher', img: Researcher_4 },
        { name: 'Mr. Yusuf Mshelia', title: 'Data Aid', img: Researcher_5 },
    ],
    developers: [
        { name: 'Deborah Isinwa-Iheme', title: 'Software Developer', img: Researcher_1 },
        { name: 'Victor Edeh', title: 'Facility Manager', img: Researcher_2 },
        { name: 'Daniel Obuh', title: 'Backend Developer', img: Researcher_3 },
        { name: 'Daniel Akhabue', title: 'Data Scientist', img: Researcher_6 },
        { name: 'Elijah Ayara', title: 'Backend Developer', img: Researcher_3 },
        { name: 'Anointing Madukwe', title: 'Backend Developer', img: Researcher_5 },
        { name: 'David Onwuka', title: 'Backend Developer', img: Researcher_4 },
        { name: 'Iniufak Moffat', title: 'UI/UX Designer', img: Researcher_5 },
        { name: 'Hope Afolayan', title: 'Backend Developer', img: Researcher_2 },
        { name: 'Kadijat Kasali', title: 'Frontend Developer', img: Researcher_5 },
        { name: 'Oghenemaro Ogbaudu', title: 'Frontend Developer', img: Researcher_4 },
        { name: 'Freeman Lucky-Ijeh', title: 'UI/UX Designer', img: Researcher_5 },
        { name: 'Usha Igyo', title: 'UI/UX Designer', img: Researcher_3 },
        { name: 'Victor Wariboko-West', title: 'Backend Developer', img: Researcher_5 },
        { name: 'Peter Orji', title: 'UI/UX Designer', img: Researcher_4 },
        { name: 'Williams Aigbe', title: 'Data Scientist', img: Researcher_5 }
    ]
};

const Team = () => {
    return (
        <section className="py-12 bg-gray-100">
            <div className="container mx-auto px-4">
                <h2 className="text-4xl font-sans text-darkCoal font-bold text-center mb-8">Meet our Team</h2>
                <p className="text-darkCharcoal font-sans text-xl  font-normal text-center mb-8 leading-10 md:mx-32">
                    Our team is a harmonious blend of experienced doctors, dedicated researchers, and skilled software developers, ensuring a comprehensive and innovative approach to digital health surveillance.
                    <br />With a wealth of expertise, we share common trends and strategies to improve health outcomes and ensure our platform remains at the forefront of technological advancements.
                    <br />Leveraging our unique skill sets, we create a seamless and user-friendly experience, allowing you to focus on what matters most. Build your next health surveillance solution with confidence, knowing our balanced team is here to support you every step of the way.
                </p>

                <div className="mb-8 mt-20 font-sans">
                    <h3 className="text-xl font-semibold text-left text-blueViolet mb-10">Researchers</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-8 gap-6">
                        {teamMembers.researchers.map((member, index) => (
                            <div key={index} className="text-center">
                                {/* <img src={member.img} alt={member.name} className=" mb-2" /> */}
                                <img src={Researcher_placeholder} alt={member.name} className=" mb-2" />
                                <h4 className="text-sm font-bold text-darkCoal">{member.name}</h4>
                                <p className="text-darkCoal font-normal ">{member.title}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="mt-20 mb-8 font-sans">
                    <h3 className="text-xl font-semibold text-left text-blueViolet mb-10">Developers</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-8 gap-6">
                        {teamMembers.developers.map((member, index) => (
                            <div key={index} className="text-center">
                                {/* <img src={member.img} alt={member.name} className=" mb-2" /> */}
                                <img src={Researcher_placeholder} alt={member.name} className=" mb-2" />
                                <h4 className="text-sm font-bold text-darkCoal">{member.name}</h4>
                                <p className="text-darkCoal font-normal">{member.title}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="mb-20 font-sans">
                    <h3 className="text-xl font-semibold text-left text-blueViolet mb-10">Stakeholders</h3>
                    <ul className="list-disc list-inside text-xl leading-9  text-darkCoal font-normal">
                        <li>Federal Government of Nigeria</li>
                        <li>Federal Ministry of Education</li>
                        <li>Tertiary Education Trust Fund (TETFUND)</li>
                    </ul>
                </div>
            </div>
        </section>
    );
};

export default Team;