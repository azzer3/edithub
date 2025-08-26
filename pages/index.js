import { useEffect, useState } from "react";
import Link from "next/link";
import Header from "../components/Header";
import Footer from "../components/Footer";

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
      <head>
        <title>EditHUB - Accueil</title>
        <link rel="icon" href="/images/logo.png" />
      </head>
      
      <Header />

      <body>
        <div class="body">
          <h1>Ceci est la page d'accueil</h1>
          <img src="/images/pepiclow.png" width="600px" alt="pepiclow"></img>
        </div>
      </body>

      <Footer />
    </div>
  );
}
