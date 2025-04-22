import { FaUser } from 'react-icons/fa';

export default function UserInfo({ user }) {
  return (
    <div className="mb-8">
      <h1 className="text-4xl font-bold text-[#333333]">Welcome, {user?.fullName}!</h1>
      <div className="flex items-center mt-4">
        <FaUser className="text-[#003366] text-4xl mr-4" /> {/* Changed color to #003366 */}
        <div>
          <p className="text-lg text-[#333333]">Subscription: {user?.subscriptionStatus}</p>
          <p className="text-sm text-[#333333]">Plan Expiry: {user?.planExpiry}</p>
        </div>
      </div>
    </div>
  );
}
