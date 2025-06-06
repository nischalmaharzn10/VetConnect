import { useNavigate } from 'react-router-dom';

const PaymentSuccess = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-green-50 p-4">
      <div className="bg-white shadow-lg rounded-2xl p-8 max-w-md text-center">
        <h2 className="text-2xl font-bold text-green-600 mb-4">Payment Successful!</h2>
        <p className="text-gray-700 mb-6">Thank you for your payment. Your appointment is confirmed.</p>
        <button
          onClick={() => navigate('/my-appointments')}
          className="bg-green-600 text-white px-4 py-2 rounded-xl hover:bg-green-700 transition"
        >
          Return to My Appointments
        </button>
      </div>
    </div>
  );
};

export default PaymentSuccess;
