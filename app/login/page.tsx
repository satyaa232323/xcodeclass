export default function LoginPage() {
  return (
    <div
      className="flex items-center justify-center min-h-screen bg-cover bg-center"
      style={{ backgroundImage: "url('images/bg-login.png')" }}
    >

      {/* Login card */}
      <div className="bg-white/90 rounded-2xl shadow-xl w-96 p-8 relative z-10">
        <h1 className="text-2xl font-bold text-center text-black">XcodeVideo</h1>
        <p className="text-center text-gray-500 mb-6">Login Account</p>

        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Username</label>
                <input
                type="text"
                className="w-full mt-1 px-3 py-2 border-2 border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
                className="w-full mt-1 px-3 py-2 border-2 border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                />
          </div>

          <div className="text-right text-sm">
            <a href="#" className="text-gray-500 hover:underline">
              Forgot password?
            </a>
          </div>

          <button
            type="submit"
            className="w-full bg-red-600 text-white py-2 rounded-full hover:bg-red-700 transition"
          >
            SIGN IN
          </button>
        </form>
      </div>
    </div>
  );
}