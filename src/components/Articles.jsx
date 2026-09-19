// eslint-disable-next-line no-unused-vars
import React from 'react';
import Article_one from '../assets/article_one.png';
import Article_two from '../assets/article_two.png';
import Article_three from '../assets/article_three.png';

function Articles() {
    const articles = [
        {
            Image: Article_one,
            title: 'Complete Nutrition',
            description: 'The exact source of most types of diseases is unknown. Find a doctor, a specialist in the bloodstream that...',
            link: '#',
            isFree: true,
        },
        {
            Image: Article_two,
            title: 'Relationship with Pets',
            description: 'The exact source of most types of diseases is unknown. Find a doctor, a specialist in the bloodstream that...',
            link: '#',
            isFree: true,
        },
        {
            Image: Article_three,
            title: 'Why own a GreenHouse',
            description: 'The exact source of most types of diseases is unknown. Find a doctor, a specialist in the bloodstream that...',
            link: '#',
            isFree: true,
        },
        {
            Image: Article_one,
            title: 'Survival by the river',
            description: 'The exact source of most types of diseases is unknown. Find a doctor, a specialist in the bloodstream that...',
            link: '#',
            isFree: true,
        },
    ];

    return (
        <section className="py-12 bg-gray-50 w-full">
            <div className="container mx-auto ">
                <div className='flex flex-col md:flex-row justify-between mx-auto w-4/5'>
                    <h2 className="text-3xl font-bold font-primary text-cyan mb-8 w-full text-center md:text-left md:w-2/3 mx-auto"><span className='text-steelBlue'>OneHealth Healthcare </span>Articles</h2>
                    <div className='md:ml-32 w-4/5 mx-auto'>
                        <p className='text-blueGray text-sm font-normal font-sora text-center md:text-justify'>Healthcare helps people maintain good health and prevent illness.Regular check-ups, vaccinations, and screenings can catch health is.</p>
                    </div>

                </div>

                <div className="grid gap-8 md:grid-cols-4 font-sans w-5/6 mx-auto md:w-full mt-10">
                    {articles.map((article, index) => (
                        <div key={index} className="bg-white p-6 rounded-lg shadow-md flex flex-col gap-10">
                            <img src={article.Image} alt='' className='w-14' />
                            <h3 className="text-xl font-medium text-gray-800 font-primary">{article.title}</h3>
                            <p className="text-blueGray font-normal text-start">{article.description}</p>
                            <div className='flex justify-between'>
                                <span className="inline-block px-2 py-1 text-2xl font-bold text-turquoiseBlue">FREE</span>
                                {article.isFree && (
                                    <a href={article.link} className="text-cyan text-base font-medium hover:underline rounded-md border border-cyan px-5 py-2">Read Now</a>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
                <div className="text-center md:text-right mt-8">
                    <a href="#more-articles" className="text-steelBlue hover:underline">View More</a>
                </div>
            </div>
        </section>
    );
}

export default Articles;