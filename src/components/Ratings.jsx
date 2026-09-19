// eslint-disable-next-line no-unused-vars
import React from 'react'

const Ratings = () => {
    return (
        <div className='mt-16 grid-cols-3 mb-20 justify-between items-center w-3/4 hidden md:grid'>
            <div className='flex font-sans text-darkCoal space-x-2'>
                <p className='font-bold text-5xl'>500+</p>
                <p className='font-normal text-lg'>Healthcare Providers<br /> Using Our Software</p>
            </div>

            <div className='flex font-sans text-darkCoal space-x-2'>
                <p className='font-bold text-5xl'>93%</p>
                <p className='font-normal text-lg'>Users Recommend<br /> Our Software</p>
            </div>

            <div className='flex font-sans text-darkCoal space-x-2'>
                <p className='font-bold text-5xl'>99%</p>
                <p className='font-normal text-lg'>System Uptime</p>
            </div>
        </div>
    )
}

export default Ratings