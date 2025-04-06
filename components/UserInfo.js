// components/UserInfo.js
import { FaUser } from 'react-icons/fa';

export default function UserInfo({ user }) {
  return (
    <div className="mb-8">
      <h1 className="text-4xl font-bold text-[#333333]">Welcome, {user.fullName}!</h1> {/* Dark text for main title */}
      <div className="flex items-center mt-4">
        <FaUser className="text-[#de0b0b] text-4xl mr-4" /> {/* Profile Icon */}
        <div>
          <p className="text-lg text-[#333333]">Subscription: {user.subscriptionStatus}</p> {/* Dark text */}
          <p className="text-sm text-[#333333]">Plan Expiry: {user.planExpiry}</p> {/* Dark text */}
        </div>
      </div>
    </div>
  );
}
