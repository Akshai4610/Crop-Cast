import Navbar from "../../components/Navbar";
import PlaceCard from "../../components/PlaceCard";

export default function Dashboard() {
  const isLoggedIn = true;

  const samplePlaces = [
    { name: "Munnar", distance: 146, image: "/img/munnar.jpg", description: "A beautiful hill station..." },
    { name: "Alleppey", distance: 42, image: "/img/alleppey.jpg", description: "Famous for backwaters..." },
  ];

  return (
    <>
      <Navbar isLoggedIn={isLoggedIn} />

      <section className="w-full max-w-6xl mx-auto py-12 px-6 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {samplePlaces.map((p, index) => (
          <PlaceCard key={index} place={p} />
        ))}
      </section>
    </>
  );
}
