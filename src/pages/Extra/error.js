// pages/Error404.jsx
import { useNavigate } from "react-router-dom";
import img404 from '../../Images/404.png'

const ErrorPage=()=> {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-6">
      <div className="max-w-6xl w-full grid md:grid-cols-2 gap-10 items-center">
        
        {/* LEFT SIDE */}
        <div className="text-center md:text-left">
          <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 mb-6">
            You got lost!
          </h1>

          <p className="text-lg text-gray-600 mb-8 leading-relaxed">
            We can’t find what you’re looking for.
            <br />
            Let’s bring you back to a place we know.
          </p>

          <button
            onClick={() => navigate(-1)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-md shadow-md transition duration-300"
          >
            Go Back 
          </button>
        </div>

        {/* RIGHT SIDE */}
        <div className="flex justify-center">
          <img
            src={img404} // replace with your image path
            alt="404 Illustration"
            className="w-full max-w-md"
          />
        </div>

      </div>
    </div>
  );
}

export default ErrorPage
