// eslint-disable-next-line no-unused-vars
import React from 'react'
import Heart from '../assets/heart.png';

const QuickConsult = () => {
    return (
        <section className="bg-gray-50 w-full flex flex-col items-center">
            <div className="container text-center w-4/5 py-20">
                <h3 className="text-3xl font-bold mb-10 text-start text-steelBlue font-primary"><span className='text-cyan'>Quick</span> Consult For</h3>
                <div className="grid grid-cols-2 xl:grid-cols-6 gap-6 font-primary">
                    <a href="#" className='flex rounded-md bg-whiteSteel bg-opacity-15 p-3 cursor-pointer items-center items-center'>
                        <img src={Heart} alt='' className='w-14' />
                        <p className='text-steelBlue font-semibold text-sm  ml-2 text-left'>Lassa Fever</p>
                    </a>

                    <a href="#" className='flex rounded-md bg-whiteSteel bg-opacity-15 p-3 cursor-pointer items-center'>
                        <img src={Heart} alt='' className='w-14' />
                        <p className='text-steelBlue font-semibold text-sm  ml-2 text-left'>Yellow Fever</p>
                    </a>

                    <a href="#" className='flex rounded-md bg-whiteSteel bg-opacity-15 p-3 cursor-pointer items-center'>
                        <img src={Heart} alt='' className='w-14' />
                        <p className='text-steelBlue font-semibold text-sm  ml-2 text-left'>Ebola</p>
                    </a>

                    <a href="#" className='flex rounded-md bg-whiteSteel bg-opacity-15 p-3 cursor-pointer items-center'>
                        <img src={Heart} alt='' className='w-14' />
                        <p className='text-steelBlue font-semibold text-sm  ml-2 text-left'>Avian Influenza</p>
                    </a>

                    <a href="#" className='flex rounded-md bg-whiteSteel bg-opacity-15 p-3 cursor-pointer items-center'>
                        <img src={Heart} alt='' className='w-14' />
                        <p className='text-steelBlue font-semibold text-sm  ml-2 text-left'>Dengue</p>
                    </a>

                    <a href="#" className='flex rounded-md bg-whiteSteel bg-opacity-15 p-3 cursor-pointer items-center'>
                        <img src={Heart} alt='' className='w-14' />
                        <p className='text-steelBlue font-semibold text-sm  ml-2 text-left'>Monkey Pox</p>
                    </a>

                    <a href="#" className='flex rounded-md bg-whiteSteel bg-opacity-15 p-3 cursor-pointer items-center'>
                        <img src={Heart} alt='' className='w-14' />
                        <p className='text-steelBlue font-semibold text-sm  ml-2 text-left'>Common Flu</p>
                    </a>

                    <a href="#" className='flex rounded-md bg-whiteSteel bg-opacity-15 p-3 cursor-pointer items-center'>
                        <img src={Heart} alt='' className='w-14' />
                        <p className='text-steelBlue font-semibold text-sm  ml-2 text-left'>Bird Flu</p>
                    </a>

                    <a href="#" className='flex rounded-md bg-whiteSteel bg-opacity-15 p-3 cursor-pointer items-center'>
                        <img src={Heart} alt='' className='w-14' />
                        <p className='text-steelBlue font-semibold text-sm  ml-2 text-left'>Monkey pox</p>
                    </a>

                    <a href="#" className='flex rounded-md bg-whiteSteel bg-opacity-15 p-3 cursor-pointer items-center'>
                        <img src={Heart} alt='' className='w-14' />
                        <p className='text-steelBlue font-semibold text-sm  ml-2 text-left'>Yellow Fever</p>
                    </a>

                    <a href="#" className='flex rounded-md bg-whiteSteel bg-opacity-15 p-3 cursor-pointer items-center'>
                        <img src={Heart} alt='' className='w-14' />
                        <p className='text-steelBlue font-semibold text-sm  ml-2 text-left'>Dengue</p>
                    </a>

                    <a href="#" className='flex rounded-md bg-whiteSteel bg-opacity-15 p-3 cursor-pointer items-center'>
                        <img src={Heart} alt='' className='w-14' />
                        <p className='text-steelBlue font-semibold text-sm  ml-2 text-left'>Cholera</p>
                    </a>
                    {/* {['Lassa Fever', 'Yellow Fever', 'Ebola', 'Avian Influenza', 'Dengue', 'Monkey Pox', 'Monkey Pox', 'Dengue', 'Lassa Fever, Yellow Fever, Ebola, Avian Influenza'].map((item, index) => (
                        <div key={index} className="bg-white p-4 shadow rounded">
                            <p className="text-lg">{item}</p>
                        </div>
                    ))} */}
                </div>
                <div className='mt-10 text-right self-end'>
                    <a href='#' className='text-steelBlue font-primary font-medium text-base float-right hover:underline'>View All</a>
                </div>
            </div>
            
        </section>
    )
}

export default QuickConsult