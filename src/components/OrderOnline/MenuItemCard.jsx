import React, { useMemo, useState } from "react";
import { useCart } from "./CartContext";
import "./OrderOnline.css";

/**
 * MenuItemCard — displays prices in PLN (Polish złoty)
 * Props:
 *  item: { id, title, desc, basePrice, veg, addOns?: [{id,name,price,type}] }
 */
export default function MenuItemCard({ item }) {
  const { items: cartItems, addItem, updateQty } = useCart();

  const [selectedAddOnIds, setSelectedAddOnIds] = useState([]);

  // currency formatter for Poland (PLN)
  const formatPrice = (value) => {
    try {
      return new Intl.NumberFormat("pl-PL", {
        style: "currency",
        currency: "PLN",
        maximumFractionDigits: 0,
      }).format(Number(value || 0));
    } catch {
      return `PLN ${Math.round(Number(value || 0))}`;
    }
  };

  const addonById = (id) => (item.addOns || []).find((a) => String(a.id) === String(id)) || null;
  const addonKeyFromIds = (ids = []) => (ids || []).map(String).sort().join("|");
  const addonKeyFromObj = (addOns = []) => (addOns || []).map(a => String(a.id)).sort().join("|");

  const matchingIndex = useMemo(() => {
    const key = addonKeyFromIds(selectedAddOnIds);
    return cartItems.findIndex(ci => String(ci.id) === String(item.id) && addonKeyFromObj(ci.addOns) === key);
  }, [cartItems, item.id, selectedAddOnIds]);

  const cartQty = matchingIndex >= 0 ? Number(cartItems[matchingIndex].qty || 0) : 0;

  const toggleAddOn = (addon) => {
    if (!addon) return;
    const idStr = String(addon.id);
    if (addon.type === "single") {
      setSelectedAddOnIds([idStr]);
    } else {
      setSelectedAddOnIds(prev => prev.includes(idStr) ? prev.filter(x => x !== idStr) : [...prev, idStr]);
    }
  };

  const selectedAddOnsObjects = useMemo(() => {
    return (selectedAddOnIds || []).map(id => {
      const a = addonById(id);
      return a ? { id: a.id, name: a.name, price: Number(a.price || 0) } : null;
    }).filter(Boolean);
  }, [selectedAddOnIds, item.addOns]);

  const displaySinglePrice = useMemo(() => {
    const addOnTotal = selectedAddOnsObjects.reduce((s, a) => s + (Number(a.price) || 0), 0);
    return Number(item.basePrice || 0) + addOnTotal;
  }, [selectedAddOnsObjects, item.basePrice]);

  const handleAdd = () => {
    const payload = {
      id: item.id,
      title: item.title,
      basePrice: Number(item.basePrice || 0),
      qty: 1,
      veg: !!item.veg,
      addOns: selectedAddOnsObjects,
      addOnOptions: (item.addOns || []).map(a => ({ id: a.id, name: a.name, price: Number(a.price||0), type: a.type })),
    };
    addItem(payload);
  };

  const handleIncrement = () => {
    if (matchingIndex >= 0) updateQty(matchingIndex, cartQty + 1);
    else handleAdd();
  };
  const handleDecrement = () => {
    if (matchingIndex >= 0) updateQty(matchingIndex, cartQty - 1);
  };

  return (
    <div className="menu-item-card" aria-live="polite">
      <div className="menu-item-top">
        <div className={`veg-dot ${item.veg ? "veg" : "nonveg"}`} aria-hidden="true" />
        <div style={{ minWidth: 0 }}>
          <h4 className="mi-title">{item.title}</h4>
          <p className="mi-desc">{item.desc}</p>
        </div>
        <div className="mi-price">{formatPrice(item.basePrice)}</div>
      </div>

      {item.addOns && item.addOns.length > 0 && (
        <div className="mi-addons" aria-label={`Customizations for ${item.title}`}>
          <small className="mi-addon-title">Customize</small>
          <div className="mi-addon-list">
            {item.addOns.map(a => {
              const idStr = String(a.id);
              const checked = selectedAddOnIds.includes(idStr);
              return (
                <label key={a.id} className={`mi-addon ${a.type === "single" ? "single" : "multi"}`}>
                  <input
                    type={a.type === "single" ? "radio" : "checkbox"}
                    name={`addon-${item.id}`}
                    checked={checked}
                    onChange={() => toggleAddOn(a)}
                  />
                  <span>{a.name}{(a.price || 0) ? ` (+${formatPrice(a.price)})` : ""}</span>
                </label>
              );
            })}
          </div>
        </div>
      )}

      <div className="mi-controls" style={{ marginTop: "auto" }}>
        {cartQty === 0 ? (
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
            <div className="mi-total">{formatPrice(displaySinglePrice)}</div>
            <div>
              <button className="btn-add" onClick={handleAdd}>Add</button>
            </div>
          </div>
        ) : (
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
            <div className="qty-controls" role="group" aria-label={`Quantity controls for ${item.title}`}>
              <button aria-label="Decrease quantity" className="btn-qty" onClick={handleDecrement}>−</button>
              <div className="qty-value" aria-live="polite">{cartQty}</div>
              <button aria-label="Increase quantity" className="btn-qty" onClick={handleIncrement}>+</button>
            </div>

            <div>
              <div className="mi-total">{formatPrice(displaySinglePrice * cartQty)}</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
