import { useState, useEffect } from "react";
import Link from "next/link";

export default function Header() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Récupère la session côté client
    fetch("/api/auth/session")
      .then(res => res.json())
      .then(data => {
        if (data?.user) setUser(data.user);
      })
      .catch(() => setUser(null));
  }, []);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
    window.location.href = "/"; // redirige vers l'accueil
  };

  return (
    <header>
        <div class="title">
          <a href="/">
            <img src="/images/logo.png" alt="Logo" width={50} />
            <h1>EditHUB</h1>
          </a>
        </div>

        <a href="/categories"><h2>Edit pur</h2></a>
        <a href="/maps"><h2>Maps</h2></a>

        <div class="buttons">
          {!user && (
            <>
              <Link href="/login"><button>Se connecter</button></Link>
              <Link href="/register"><button>S'inscrire</button></Link>
            </>
          )}
          {user && (
            <>
              <button onClick={handleLogout}>Se déconnecter</button>
              {user.isAdmin && <Link href="/admin"><button>Panel administrateur</button></Link>}

              {user && !user.discordId && (
              <a href="/api/auth/discord"><button>Lier Discord</button></a>
              )}

            </>
          )}
        </div>
    </header>
  );
}
