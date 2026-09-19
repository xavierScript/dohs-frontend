// eslint-disable-next-line no-unused-vars
import React from 'react';
import { Link } from 'react-router-dom';
import Ivie from '../assets/ivie_bot.png';

function Chat() {
    return (
        <section className="py-12">
            <div className="">
                <h3 className='text-teal font-primary font-bold text-center md:text-left text-3xl md:ml-40 mb-6'>Chat with Ivie</h3>
                <div className="bg-turquoiseBlue p-6 gap-5 md:gap-0 grid grid-cols-1 md:grid-cols-3 justify-center items-center">
                    <div className="flex mx-auto md:mx-0 md:ml-40 self-center justify-center md:self-stretch">
                        <img src={Ivie} alt="Ivie" className="w-1/2 rounded-full" />
                    </div>

                    <div className='font-manrope md:mr-40 mx-auto md:mx-0 leading-10 w-4/5 md:w-auto self-center'>
                        <h2 className="text-xl font-bold text-white mb-4 text-center md:text-left">Hello! I&apos;m Ivie</h2>
                        <p className="text-white font-extralight text-lg text-center md:text-left md:mb-4">
                            I&apos;m here to assist you with any questions or needs you might have. Whether you&apos;re looking for information, support, or just a friendly chat, I&apos;m here to help. How can I assist you today?
                        </p>
                    </div>

                    <div className='my-10 md:my-28 rounded-md mx-auto md:mx-0 w-1/2 bg-white p-10'>
                        <div className='flex items-center justify-center'>
                            <Link to='/chatbot' className='font-normal font-rale text-2xl text-white bg-turquoiseBlue text-center px-10 py-2 rounded-md'>Chat</Link>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}

export default Chat;