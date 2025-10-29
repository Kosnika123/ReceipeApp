// importData.js
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://wgotrndfpoqcjmvzeshy.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indnb3RybmRmcG9xY2ptdnplc2h5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkzMjA4MjAsImV4cCI6MjA3NDg5NjgyMH0.NR3j_ctwE-50ItD8b9gzTPxoMx_Zf57g78W8V7I3SQo";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function fetchMealsByLetter(letter) {
  const res = await fetch(
    `https://www.themealdb.com/api/json/v1/1/search.php?f=${letter}`
  );
  const data = await res.json();
  return data.meals || [];
}

(async function importData() {
  const alphabet = "abcdefghijklmnopqrstuvwxyz".split("");
  let allMeals = [];

  console.log("📥 Fetching all recipes...");
  const results = await Promise.all(alphabet.map(fetchMealsByLetter));
  results.forEach((meals) => allMeals.push(...meals));

  console.log(`✅ Found ${allMeals.length} recipes from API`);

  const recipes = allMeals.map((meal) => ({
    id: parseInt(meal.idMeal, 10), // 👈 ensure integer ID
    title: meal.strMeal,
    cartegory: meal.strCategory,
    instructions: meal.strInstructions,
    image_url: meal.strMealThumb,
    youtube_url: meal.strYoutube,
  }));

  // Batch insert in chunks of 50
  const batchSize = 50;
  for (let i = 0; i < recipes.length; i += batchSize) {
    const batch = recipes.slice(i, i + batchSize);

    const { error } = await supabase
      .from("receipes")
      .upsert(batch, { onConflict: "id" });

    if (error) {
      console.error(`❌ Error on batch ${i / batchSize + 1}:`, error.message);
    } else {
      console.log(`✅ Batch ${i / batchSize + 1} inserted (${batch.length} recipes)`);
    }
  }

  console.log("🎉 All recipes imported successfully!");
})();
