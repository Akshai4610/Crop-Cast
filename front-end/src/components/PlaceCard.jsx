export default function PlaceCard({ place }) {
  /**
   * place = {
   *   name: string,
   *   distance: number,
   *   image: url,
   *   description: string
   * }
   */

  return (
    <div className="border border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all bg-white">
      
      {/* Image */}
      <img 
        src={place.image} 
        alt={place.name}
        className="w-full h-48 object-cover"
      />

      {/* Card Content */}
      <div className="p-4 flex flex-col gap-2">
        <h3 className="text-lg font-semibold">{place.name}</h3>
        <p className="text-sm text-gray-600 line-clamp-2">{place.description}</p>

        {/* Footer */}
        <div className="flex justify-between items-center pt-3">
          <span className="text-sm font-medium">{place.distance} km away</span>
          <button className="px-4 py-1.5 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700">
            View
          </button>
        </div>
      </div>
    </div>
  );
}
