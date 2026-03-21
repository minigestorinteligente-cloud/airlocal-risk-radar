export default function WelcomeCard({ property, guest }: any) {

    return (
      <div className="bg-white rounded-xl shadow p-6">
  
        <h1 className="text-2xl font-bold">
          Welcome {guest}
        </h1>
  
        <p className="text-gray-600">
          Enjoy your stay at {property}
        </p>
  
      </div>
    )
  }