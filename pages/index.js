import { useEffect, useState } from "react";
import Link from "next/link";

export default function HomePage() {
  const [user, setUser] = useState(null);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    // Récupération de la session utilisateur
    fetch("/api/auth/session", { credentials: "include" })
      .then(res => res.json())
      .then(data => setUser(data.user))
      .catch(err => {
        console.error("Erreur récupération session:", err);
        setUser(null);
      });

    // Récupération des catégories
    fetch("/api/categories")
      .then(res => res.json())
      .then(data => setCategories(data))
      .catch(err => console.error(err));
  }, []);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
      setUser(null);
    } catch (err) {
      console.error("Erreur déconnexion:", err);
    }
  };

  return (
    <div class="content">
      <div class="header">
        <h1>EditHUB</h1>

      </div>

      <div style={{ marginBottom: "1rem" }}>
        {!user && (
          <>
            <Link href="/login"><button>Login</button></Link>
            <Link href="/register"><button>Register</button></Link>
          </>
        )}
        {user && (
          <>
            <button onClick={handleLogout}>Disconnect</button>
            {user.isAdmin && <Link href="/admin"><button>Admin</button></Link>}
          </>
        )}
      </div>

      <h2>Catégories</h2>
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
