import Navbar from "../../components/Navbar";

export default function Home() {
  const isLoggedIn = false; // Public mode

  return (
    <>
      <Navbar isLoggedIn={isLoggedIn} />

      <section className="w-full max-w-5xl mx-auto py-12 px-6">
        <h1 className="text-3xl font-bold mb-4">Discover Nearby Places</h1>
        <p className="text-gray-600 mb-8">
          Find the best destinations sorted by distance. Login to get personalized recommendations.
        </p>
      </section>
    </>
  );
}
