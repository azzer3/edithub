import { useEffect, useState } from "react";

export default function SubmitRun() {
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubCategory, setSelectedSubCategory] = useState("");
  const [quantity, setQuantity] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [game, setGame] = useState("");

  useEffect(() => {
    fetch("/api/categories")
      .then(res => res.json())
      .then(data => setCategories(data));
  }, []);

  useEffect(() => {
    if (!selectedCategory) return;
    fetch(`/api/subCategories?categoryId=${selectedCategory}`)
      .then(res => res.json())
      .then(data => setSubCategories(data));
  }, [selectedCategory]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch("/api/runs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        quantity,
        videoUrl,
        subCategoryId: selectedSubCategory,
        game,
      }),
    });

    const data = await res.json();

    if(!res.ok) {
      if(res.status === 401) {
        alert("Session expired, please reconnect");
      } else {
        alert(data.error || "Error while submitting");
      }
      return;
    }
    
    alert(data.message);
  };

  return (
    <div>
      <h1>Submit a record</h1>
      <form onSubmit={handleSubmit}>
        <label>Category :</label>
        <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} required>
          <option value="">Choose a category</option>
          {categories.map(c => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
        <br></br>
        <label>Sub-category :</label>
        <select value={selectedSubCategory} onChange={(e) => setSelectedSubCategory(e.target.value)} required>
          <option value="">Choose a sub-category</option>
          {subCategories.map(sc => (
            <option key={sc.id} value={sc.id}>{sc.name}</option>
          ))}
        </select>
        <br></br>
        <label>Quantity :</label>
        <input
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          required
        />
        <br></br>
        <label>Video :</label>
        <input
          type="url"
          value={videoUrl}
          onChange={(e) => setVideoUrl(e.target.value)}
        />
        <br></br>
        <label>Version :</label>
        <select value={game} onChange={(e) => setGame(e.target.value)} required>
          <option value="">Choose a version</option>
          <option value="fortnite">fortnite</option>
          <option value="rift">rift</option>
        </select>
        <br></br>
        <button type="submit">Send</button>
      </form>
    </div>
  );
}
