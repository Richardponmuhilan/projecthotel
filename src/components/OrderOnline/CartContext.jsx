// CartContext.jsx
import React, { createContext, useContext, useEffect, useState } from "react";

const CartContext = createContext();
export function useCart() { return useContext(CartContext); }

function addonKey(addOns = []) {
  return (addOns || []).map(a => String(a.id)).sort().join("|");
}
function lineKey(item) {
  return `${String(item.id)}::${addonKey(item.addOns)}`;
}
function calcLinePrice(item) {
  const addOnsTotal = (item.addOns || []).reduce((s, a) => s + (Number(a.price) || 0), 0);
  return (Number(item.basePrice || 0) + addOnsTotal) * Number(item.qty || 0);
}

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try {
      const raw = localStorage.getItem("cart_v1");
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try { localStorage.setItem("cart_v1", JSON.stringify(items)); } catch {}
  }, [items]);

  // addItem returns { merged: boolean, index: number }
  const addItem = (item) => {
    const normalized = {
      id: item.id,
      title: item.title,
      basePrice: Number(item.basePrice || 0),
      qty: Number(item.qty || 1),
      addOns: (item.addOns || []).map(a => ({ id: a.id, name: a.name, price: Number(a.price || 0) })),
      // store canonical options for later edit
      addOnOptions: (item.addOnOptions || []).map(a => ({ id: a.id, name: a.name, price: Number(a.price||0), type: a.type })),
      veg: !!item.veg,
    };

    let result = { merged: false, index: -1 };
    setItems(prev => {
      const copy = [...prev];
      const key = lineKey(normalized);
      const idx = copy.findIndex(p => lineKey(p) === key);
      if (idx >= 0) {
        // merge into existing line
        copy[idx] = { ...copy[idx], qty: copy[idx].qty + normalized.qty };
        result = { merged: true, index: idx };
        return copy;
      } else {
        copy.push(normalized);
        result = { merged: false, index: copy.length - 1 };
        return copy;
      }
    });
    // Note: result.index will be correct after setItems runs (React batches),
    //     but we still return the candidate result to caller.
    return result;
  };

  const updateQty = (cartIndex, qty) => {
    setItems(prev => {
      const copy = [...prev];
      if (cartIndex < 0 || cartIndex >= copy.length) return prev;
      if (qty <= 0) {
        copy.splice(cartIndex, 1);
      } else {
        copy[cartIndex] = { ...copy[cartIndex], qty: Number(qty) };
      }
      return copy;
    });
  };

  const updateItemAddOns = (cartIndex, newAddOns = []) => {
    setItems(prev => {
      const copy = [...prev];
      if (cartIndex < 0 || cartIndex >= copy.length) return prev;
      const current = { ...copy[cartIndex] };
      current.addOns = (newAddOns || []).map(a => ({ id: a.id, name: a.name, price: Number(a.price || 0) }));
      copy[cartIndex] = current;
      return copy;
    });
  };

  const removeIndex = (cartIndex) => {
    setItems(prev => prev.filter((_, i) => i !== cartIndex));
  };

  const clearCart = () => setItems([]);

  const subtotal = items.reduce((s, it) => s + calcLinePrice(it), 0);

  return (
    <CartContext.Provider value={{
      items,
      addItem,
      updateQty,
      updateItemAddOns,
      removeIndex,
      clearCart,
      subtotal
    }}>
      {children}
    </CartContext.Provider>
  );
}
