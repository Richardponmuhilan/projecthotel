// src/components/OrderOnline/OrderOnline.jsx
import React, { useMemo, useState } from "react";
import { CartProvider } from "./CartContext";
import MenuCategory from "./MenuCategory";
import CartDrawer from "./CartDrawer";
import "./OrderOnline.css";

/* SAMPLE MENU data — replace with real API data */
const SAMPLE_MENU = [
  {
    category: "Veg",
    items: [
      {
        id: "veg-1",
        title: "Paneer Butter Masala",
        desc: "Creamy tomato gravy & soft paneer cubes.",
        basePrice: 220,
        veg: true,
        addOns: [
          { id: "ghee", name: "Extra Ghee", price: 12, type: "multi" },
          { id: "cheese", name: "Cheese", price: 25, type: "multi" },
        ],
      },
      {
        id: "veg-2",
        title: "Aloo Gobi",
        desc: "Spiced potatoes & cauliflower.",
        basePrice: 170,
        veg: true,
      },
    ],
  },
  {
    category: "Non-Veg",
    items: [
      {
        id: "nv-1",
        title: "Chicken Tikka Masala",
        desc: "Smoky tandoori chicken in rich masala.",
        basePrice: 280,
        veg: false,
        addOns: [{ id: "extraChicken", name: "Extra Chicken", price: 50, type: "multi" }],
      },
      {
        id: "nv-2",
        title: "Mutton Rogan Josh",
        desc: "Slow-cooked mutton in aromatic spices.",
        basePrice: 320,
        veg: false,
      },
    ],
  },
  {
    category: "Desserts",
    items: [
      { id: "dess-1", title: "Gulab Jamun", desc: "Warm syrupy dumplings", basePrice: 80, veg: true },
      { id: "dess-2", title: "Rasmalai", desc: "Saffron milk & spongy cheese", basePrice: 95, veg: true },
    ],
  },
  {
    category: "Drinks",
    items: [
      { id: "drk-1", title: "Masala Chai", desc: "Spiced tea", basePrice: 35, veg: true },
      { id: "drk-2", title: "Mango Lassi", desc: "Creamy mango yogurt drink", basePrice: 70, veg: true },
    ],
  },
];

export default function OrderOnline() {
  const [activeCategory, setActiveCategory] = useState(SAMPLE_MENU[0].category);

  const categories = useMemo(() => SAMPLE_MENU.map((c) => c.category), []);

  const activeItems = useMemo(
    () => SAMPLE_MENU.find((c) => c.category === activeCategory)?.items || [],
    [activeCategory]
  );

  return (
    <CartProvider>
      <div className="order-page container">
        <h2 className="page-title">Order Online</h2>

        <div className="category-tabs">
          {categories.map((c) => (
            <button
              key={c}
              className={`cat-btn ${c === activeCategory ? "active" : ""}`}
              onClick={() => setActiveCategory(c)}
            >
              {c}
            </button>
          ))}
        </div>

        <div className="category-content">
          <MenuCategory title={activeCategory} items={activeItems} />
        </div>

        <CartDrawer />
      </div>
    </CartProvider>
  );
}
