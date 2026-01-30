/*
  PURPOSE:
  - Show agriculture news
  - Admin can delete
*/

import { useEffect, useState } from "react";

const NewsPage = () => {
  const [news, setNews] = useState([]);
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    fetch("http://localhost:8000/api/news")
      .then(res => res.json())
      .then(setNews);
  }, []);

  return (
    <div>
      {news.map((n, i) => (
        <div key={i} className="glass-card">
          <h3>{n.title}</h3>
          <p>{n.content}</p>

          {user.role === "admin" && (
            <button
              onClick={() =>
                fetch(`http://localhost:8000/api/news/${n.title}`, {
                  method: "DELETE",
                })
              }
            >
              Delete
            </button>
          )}
        </div>
      ))}
    </div>
  );
};

export default NewsPage;
