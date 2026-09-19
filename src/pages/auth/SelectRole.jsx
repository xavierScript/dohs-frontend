// import hero from '../../../assets/register.jpg'
import hero2 from '../../assets/select1.png'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import SignInAs from '../../components/auth/SignInAs'

const SelectRole = () => {

  return (
    <>
      <Navbar />

      <div className='mt-20 flex justify-center'>
        <div className='flex flex-col md:flex-row items-center justify-around h-full w-full max-w-6xl my-10 px-4 border-grey bg-white'>
          <div className='w-full md:w-1/2 h-full'>
            <img
              src={hero2}
              alt='Woman with dog'
              className='w-full md:w-full max-w-full lg:block'
            />
          </div>
          <SignInAs />
        </div>
      </div>

      <Footer />
    </>
  )
}

export default SelectRole
