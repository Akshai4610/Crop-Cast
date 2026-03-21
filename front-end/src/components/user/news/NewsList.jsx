import NewsCard from "./NewsCard";

const NewsList = ({ news, userEmail, onLike, onDislike, onOpen }) => {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {news.map((n) => (
        <NewsCard
          key={n._id}
          n={n}
          userEmail={userEmail}
          onLike={onLike}
          onDislike={onDislike}
          onOpen={onOpen}
        />
      ))}
    </div>
  );
};

export default NewsList;