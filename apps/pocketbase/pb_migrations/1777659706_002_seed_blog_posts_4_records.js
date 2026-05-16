/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("blog_posts");

  const record0 = new Record(collection);
    record0.set("title", "Summer Fashion Trends 2026");
    record0.set("content", "Discover the hottest summer fashion trends this season including vibrant colors, lightweight fabrics, and sustainable fashion choices. Learn how to style these trends for any occasion. From bold prints to minimalist designs, this season offers something for everyone. Embrace the warmth with breathable materials like linen and cotton, and don't forget to accessorize with statement pieces that reflect your personal style.");
    record0.set("author", "Fashion Expert");
    record0.set("date", "2026-04-25");
  try {
    app.save(record0);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record1 = new Record(collection);
    record1.set("title", "How to Build a Capsule Wardrobe");
    record1.set("content", "A capsule wardrobe is a collection of essential clothing items that work together. Learn how to create a versatile wardrobe with timeless pieces that can be mixed and matched for countless outfits. Start with neutral basics like white t-shirts, black pants, and denim. Add layering pieces such as blazers and cardigans. Include a few statement pieces in your favorite colors. The key is choosing quality over quantity and ensuring every piece complements the others.");
    record1.set("author", "Style Consultant");
    record1.set("date", "2026-04-20");
  try {
    app.save(record1);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record2 = new Record(collection);
    record2.set("title", "Sustainable Fashion Guide");
    record2.set("content", "Explore eco-friendly fashion choices and sustainable brands. Learn about ethical manufacturing, organic materials, and how to make conscious fashion decisions without compromising on style. Sustainable fashion is not just a trend; it's a responsibility. Choose brands that prioritize fair labor practices and use environmentally friendly materials. Invest in quality pieces that last longer, reducing the need for frequent replacements. Support local artisans and small businesses that align with your values.");
    record2.set("author", "Eco Fashion Blogger");
    record2.set("date", "2026-04-15");
  try {
    app.save(record2);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record3 = new Record(collection);
    record3.set("title", "Accessory Styling Tips");
    record3.set("content", "Master the art of accessorizing with our comprehensive guide. From watches to jewelry to bags, learn how to choose and combine accessories that elevate your entire look. Accessories are the finishing touch that can transform a simple outfit into something extraordinary. Start with a quality watch as your foundation piece. Layer delicate jewelry for a sophisticated look, or go bold with statement pieces. Choose a bag that complements your outfit's color palette and style. Remember, less is often more when it comes to accessorizing.");
    record3.set("author", "Fashion Stylist");
    record3.set("date", "2026-04-10");
  try {
    app.save(record3);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }
}, (app) => {
  // Rollback: record IDs not known, manual cleanup needed
})