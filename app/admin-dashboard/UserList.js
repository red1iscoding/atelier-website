// components/UserList.js
const UserList = ({ users }) => {
    return (
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md">
          <thead>
            <tr>
              <th className="p-4 text-left">Name</th>
              <th className="p-4 text-left">Role</th>
              <th className="p-4 text-left">Last Login</th>
              <th className="p-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr key={index}>
                <td className="p-4">{user.name}</td>
                <td className="p-4">{user.role}</td>
                <td className="p-4">{user.lastLogin}</td>
                <td className="p-4">
                  <button className="bg-yellow-500 text-white px-3 py-1 rounded">Edit</button>
                  <button className="bg-red-500 text-white px-3 py-1 rounded ml-2">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };
  
  export default UserList;
  