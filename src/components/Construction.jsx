import React from 'react';
import wip from '../assets/under-construction.gif';
const Construction = () => {
    return (
        <section className="flex flex-col md:flex-row justify-center items-center gap-1 mt-12 h-screen w-full">
            <img src={wip} alt="Work in progress animation" className="w-1/4"></img>
            <h1 className="text-black text-xl md:text-4xl"> Page is Under Construction</h1>
        </section>
    );
};

export default Construction;