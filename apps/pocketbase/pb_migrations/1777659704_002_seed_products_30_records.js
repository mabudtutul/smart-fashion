/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("products");

  const record0 = new Record(collection);
    record0.set("name", "Premium Cotton T-Shirt");
    record0.set("description", "Comfortable and breathable premium cotton t-shirt perfect for everyday wear. Available in multiple colors with a classic fit.");
    record0.set("price", 599);
    record0.set("category", "Clothing");
    record0.set("stock", 50);
    record0.set("rating", 4.5);
    record0.set("featured", true);
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
    record1.set("name", "Casual Denim Shirt");
    record1.set("description", "Versatile denim shirt ideal for casual outings. Made from high-quality denim with a relaxed fit and classic styling.");
    record1.set("price", 1299);
    record1.set("category", "Clothing");
    record1.set("stock", 35);
    record1.set("rating", 4.2);
    record1.set("featured", true);
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
    record2.set("name", "Summer Dress");
    record2.set("description", "Light and elegant summer dress perfect for warm weather. Features a flattering silhouette and breathable fabric.");
    record2.set("price", 1899);
    record2.set("category", "Clothing");
    record2.set("stock", 25);
    record2.set("rating", 4.8);
    record2.set("featured", true);
    record2.set("new", true);
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
    record3.set("name", "Formal Blazer");
    record3.set("description", "Professional formal blazer suitable for business meetings and formal events. Tailored fit with premium fabric.");
    record3.set("price", 3499);
    record3.set("category", "Clothing");
    record3.set("stock", 15);
    record3.set("rating", 4.6);
    record3.set("bestseller", true);
  try {
    app.save(record3);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record4 = new Record(collection);
    record4.set("name", "Casual Hoodie");
    record4.set("description", "Cozy and comfortable hoodie perfect for casual wear. Made from soft fabric with a modern design.");
    record4.set("price", 1599);
    record4.set("category", "Clothing");
    record4.set("stock", 40);
    record4.set("rating", 4.3);
    record4.set("new", true);
  try {
    app.save(record4);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record5 = new Record(collection);
    record5.set("name", "Linen Pants");
    record5.set("description", "Breathable linen pants ideal for warm weather. Features a comfortable fit and elegant appearance.");
    record5.set("price", 1799);
    record5.set("category", "Clothing");
    record5.set("stock", 30);
    record5.set("rating", 4.4);
    record5.set("featured", true);
  try {
    app.save(record5);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record6 = new Record(collection);
    record6.set("name", "Silk Blouse");
    record6.set("description", "Luxurious silk blouse with a sophisticated design. Perfect for both professional and casual settings.");
    record6.set("price", 2499);
    record6.set("category", "Clothing");
    record6.set("stock", 20);
    record6.set("rating", 4.7);
    record6.set("new", true);
  try {
    app.save(record6);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record7 = new Record(collection);
    record7.set("name", "Vintage Jacket");
    record7.set("description", "Stylish vintage-inspired jacket with timeless appeal. Great for layering and adding character to any outfit.");
    record7.set("price", 2899);
    record7.set("category", "Clothing");
    record7.set("stock", 18);
    record7.set("rating", 4.5);
    record7.set("bestseller", true);
  try {
    app.save(record7);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record8 = new Record(collection);
    record8.set("name", "Running Sneakers");
    record8.set("description", "High-performance running sneakers with advanced cushioning technology. Designed for comfort and durability.");
    record8.set("price", 2499);
    record8.set("category", "Shoes");
    record8.set("stock", 45);
    record8.set("rating", 4.6);
    record8.set("featured", true);
  try {
    app.save(record8);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record9 = new Record(collection);
    record9.set("name", "Casual Canvas Shoes");
    record9.set("description", "Lightweight canvas shoes perfect for everyday casual wear. Comfortable and versatile for any occasion.");
    record9.set("price", 899);
    record9.set("category", "Shoes");
    record9.set("stock", 60);
    record9.set("rating", 4.2);
  try {
    app.save(record9);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record10 = new Record(collection);
    record10.set("name", "Formal Leather Shoes");
    record10.set("description", "Premium leather formal shoes ideal for business and formal occasions. Crafted with precision and elegance.");
    record10.set("price", 3299);
    record10.set("category", "Shoes");
    record10.set("stock", 25);
    record10.set("rating", 4.7);
    record10.set("bestseller", true);
  try {
    app.save(record10);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record11 = new Record(collection);
    record11.set("name", "Sports Basketball Shoes");
    record11.set("description", "Professional basketball shoes with superior ankle support and grip. Designed for performance and style.");
    record11.set("price", 2899);
    record11.set("category", "Shoes");
    record11.set("stock", 35);
    record11.set("rating", 4.5);
    record11.set("new", true);
  try {
    app.save(record11);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record12 = new Record(collection);
    record12.set("name", "Comfortable Loafers");
    record12.set("description", "Elegant loafers combining comfort with style. Perfect for both casual and semi-formal settings.");
    record12.set("price", 1999);
    record12.set("category", "Shoes");
    record12.set("stock", 30);
    record12.set("rating", 4.4);
  try {
    app.save(record12);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record13 = new Record(collection);
    record13.set("name", "Stylish Boots");
    record13.set("description", "Fashionable boots with premium construction. Versatile for various seasons and occasions.");
    record13.set("price", 2699);
    record13.set("category", "Shoes");
    record13.set("stock", 22);
    record13.set("rating", 4.6);
    record13.set("new", true);
  try {
    app.save(record13);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record14 = new Record(collection);
    record14.set("name", "Summer Sandals");
    record14.set("description", "Comfortable summer sandals perfect for warm weather. Lightweight and easy to wear.");
    record14.set("price", 599);
    record14.set("category", "Shoes");
    record14.set("stock", 70);
    record14.set("rating", 4.1);
  try {
    app.save(record14);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record15 = new Record(collection);
    record15.set("name", "Designer Heels");
    record15.set("description", "Elegant designer heels with premium craftsmanship. Perfect for special occasions and formal events.");
    record15.set("price", 3899);
    record15.set("category", "Shoes");
    record15.set("stock", 18);
    record15.set("rating", 4.8);
    record15.set("bestseller", true);
  try {
    app.save(record15);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record16 = new Record(collection);
    record16.set("name", "Stainless Steel Watch");
    record16.set("description", "Premium stainless steel watch with precision movement. A timeless accessory for any occasion.");
    record16.set("price", 4999);
    record16.set("category", "Watches");
    record16.set("stock", 20);
    record16.set("rating", 4.9);
    record16.set("featured", true);
    record16.set("bestseller", true);
  try {
    app.save(record16);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record17 = new Record(collection);
    record17.set("name", "Leather Wrist Watch");
    record17.set("description", "Sophisticated leather strap watch combining elegance with functionality. Ideal for daily wear.");
    record17.set("price", 3499);
    record17.set("category", "Watches");
    record17.set("stock", 25);
    record17.set("rating", 4.7);
    record17.set("featured", true);
  try {
    app.save(record17);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record18 = new Record(collection);
    record18.set("name", "Gold Necklace");
    record18.set("description", "Exquisite gold necklace with intricate design. A perfect statement piece for any wardrobe.");
    record18.set("price", 2299);
    record18.set("category", "Fashion Jewelry");
    record18.set("stock", 30);
    record18.set("rating", 4.6);
    record18.set("new", true);
  try {
    app.save(record18);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record19 = new Record(collection);
    record19.set("name", "Pearl Earrings");
    record19.set("description", "Classic pearl earrings with timeless elegance. Perfect for both casual and formal occasions.");
    record19.set("price", 1599);
    record19.set("category", "Fashion Jewelry");
    record19.set("stock", 40);
    record19.set("rating", 4.5);
  try {
    app.save(record19);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record20 = new Record(collection);
    record20.set("name", "Diamond Ring");
    record20.set("description", "Stunning diamond ring with premium craftsmanship. A luxurious accessory for special moments.");
    record20.set("price", 5000);
    record20.set("category", "Fashion Jewelry");
    record20.set("stock", 10);
    record20.set("rating", 4.9);
    record20.set("featured", true);
  try {
    app.save(record20);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record21 = new Record(collection);
    record21.set("name", "Leather Crossbody Bag");
    record21.set("description", "Stylish leather crossbody bag perfect for everyday use. Combines functionality with fashion.");
    record21.set("price", 2199);
    record21.set("category", "Bags & Backpack");
    record21.set("stock", 28);
    record21.set("rating", 4.6);
    record21.set("new", true);
  try {
    app.save(record21);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record22 = new Record(collection);
    record22.set("name", "Canvas Backpack");
    record22.set("description", "Durable canvas backpack ideal for travel and daily use. Spacious with multiple compartments.");
    record22.set("price", 1299);
    record22.set("category", "Bags & Backpack");
    record22.set("stock", 50);
    record22.set("rating", 4.3);
  try {
    app.save(record22);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record23 = new Record(collection);
    record23.set("name", "Designer Handbag");
    record23.set("description", "Premium designer handbag with elegant design. A must-have accessory for fashion enthusiasts.");
    record23.set("price", 3999);
    record23.set("category", "Bags & Backpack");
    record23.set("stock", 15);
    record23.set("rating", 4.8);
    record23.set("bestseller", true);
  try {
    app.save(record23);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record24 = new Record(collection);
    record24.set("name", "Silk Scarf");
    record24.set("description", "Luxurious silk scarf with vibrant patterns. Versatile accessory for any season.");
    record24.set("price", 899);
    record24.set("category", "Fashion Jewelry");
    record24.set("stock", 60);
    record24.set("rating", 4.2);
  try {
    app.save(record24);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record25 = new Record(collection);
    record25.set("name", "Leather Belt");
    record25.set("description", "Classic leather belt with quality buckle. Perfect for completing any outfit.");
    record25.set("price", 799);
    record25.set("category", "Fashion Jewelry");
    record25.set("stock", 55);
    record25.set("rating", 4.1);
  try {
    app.save(record25);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record26 = new Record(collection);
    record26.set("name", "Sunglasses");
    record26.set("description", "Stylish sunglasses with UV protection. Essential accessory for sunny days.");
    record26.set("price", 1999);
    record26.set("category", "Fashion Jewelry");
    record26.set("stock", 35);
    record26.set("rating", 4.4);
    record26.set("new", true);
  try {
    app.save(record26);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record27 = new Record(collection);
    record27.set("name", "Wool Hat");
    record27.set("description", "Warm and comfortable wool hat perfect for cold weather. Available in multiple colors.");
    record27.set("price", 599);
    record27.set("category", "Fashion Jewelry");
    record27.set("stock", 45);
    record27.set("rating", 4.0);
  try {
    app.save(record27);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record28 = new Record(collection);
    record28.set("name", "Cashmere Gloves");
    record28.set("description", "Soft cashmere gloves providing warmth and luxury. Ideal for winter fashion.");
    record28.set("price", 1299);
    record28.set("category", "Fashion Jewelry");
    record28.set("stock", 32);
    record28.set("rating", 4.5);
  try {
    app.save(record28);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record29 = new Record(collection);
    record29.set("name", "Leather Wallet");
    record29.set("description", "Premium leather wallet with multiple card slots. Durable and stylish everyday accessory.");
    record29.set("price", 1099);
    record29.set("category", "Bags & Backpack");
    record29.set("stock", 50);
    record29.set("rating", 4.3);
  try {
    app.save(record29);
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