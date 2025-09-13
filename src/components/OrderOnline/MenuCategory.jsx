// src/components/OrderOnline/MenuCategory.jsx
import React from "react";
import MenuItemCard from "./MenuItemCard";

export default function MenuCategory({ title, items }) {
  return (
    <section className="menu-category">
      <h3 className="category-title">{title}</h3>
      <div className="category-grid">
        {items.map((it) => (
          <MenuItemCard key={it.id} item={it} />
        ))}
      </div>
    </section>
  );
}
