import { Link } from 'react-router-dom';

const SignInAs = () => {
  return (
    <div className="flex flex-col items-start md:justify-center w-full md:w-auto p-4 ">
      <h1 className="text-2xl font-semibold text-center mb-6 text-secondary">Welcome back!</h1>
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md  border-grey border-2">
        <div className="flex flex-col space-y-4 gap-8 ">
          <p className="text-2xl font-medium text-center text-secondary self-start">Sign in as</p>
          <div className="flex flex-col md:flex-row justify-between w-full gap-2">
            <Link to="/health-login" className="bg-yellow text-black py-2 px-4 rounded-md hover:bg-yellow-600 w-auto" >
              Health Worker
            </Link>
            <Link to="/non-health-login" className="bg-teal text-black py-2 px-4 rounded-md hover:bg-green-600 w-auto">
              Non-health Worker
            </Link>
          </div>        
        </div>
      </div>
      <div className="text-center mt-6">
          <p>Don`t have an account? <Link to="/signup" className="text-secondary hover:underline">Sign Up</Link></p>
        </div>
    </div>
  );
};

export default SignInAs;
