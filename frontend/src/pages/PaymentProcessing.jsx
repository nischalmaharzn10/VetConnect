// src/pages/PaymentProcessing.jsx
import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

const PaymentProcessing = () => {
  const { id } = useParams(); // booking ID from route
  const navigate = useNavigate();

  useEffect(() => {
    // Here you would call backend to confirm payment, etc.
    // For demo, just redirect to success page after 2 seconds.
    setTimeout(() => {
      navigate(`/api/payment/esewa/success/${id}`);
    }, 2000);
  }, [id, navigate]);

  return (
    <div className="payment-processing">
      <h2>Processing your payment...</h2>
      <p>Please wait while we confirm your transaction.</p>
    </div>
  );
};

export default PaymentProcessing;
