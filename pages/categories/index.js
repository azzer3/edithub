import { useEffect, useState } from "react";
import Link from "next/link";
import Header from "../../components/Header";

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetch("/api/categories")
      .then(res => res.json())
      .then(data => setCategories(data));
  }, []);

  return (
    <div>
      <Header />
      <h1>Categories</h1>
      <ul>
        {categories.map(cat => (
          <li key={cat.id}>
            <Link href={`/categories/${cat.id}`}>
              {cat.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
