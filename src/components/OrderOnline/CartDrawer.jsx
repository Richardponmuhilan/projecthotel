// src/components/OrderOnline/CartDrawer.jsx
import React, { useMemo, useState, useEffect } from "react";
import { useCart } from "./CartContext";
import CheckoutModal from "./CheckoutModal";
import "./OrderOnline.css"; // your existing styles (path may vary)

export default function CartDrawer() {
  const { items, updateQty, removeIndex, updateItemAddOns, clearCart, subtotal } = useCart();

  const [open, setOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [editingSelection, setEditingSelection] = useState([]);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);

  useEffect(() => {
    if (editingIndex != null && (editingIndex < 0 || editingIndex >= items.length)) {
      setEditingIndex(null);
      setEditingSelection([]);
    }
  }, [items, editingIndex]);

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

  const totalItemsCount = useMemo(() => items.reduce((s, it) => s + (Number(it.qty) || 0), 0), [items]);

  const openForIndex = (idx) => {
    setEditingIndex(idx);
    const selected = (items[idx]?.addOns || []).map(a => String(a.id));
    setEditingSelection(selected);
    setOpen(true);
  };

  const toggleEditingAddon = (opt) => {
    if (!opt) return;
    const id = String(opt.id);
    if (opt.type === "single") {
      setEditingSelection([id]);
    } else {
      setEditingSelection(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
    }
  };

  const saveEditor = () => {
    if (editingIndex == null) return;
    const opts = items[editingIndex]?.addOnOptions || [];
    const newAddOns = editingSelection.map(id => {
      const o = opts.find(x => String(x.id) === String(id));
      return o ? { id: o.id, name: o.name, price: Number(o.price || 0) } : null;
    }).filter(Boolean);
    updateItemAddOns(editingIndex, newAddOns);
    setEditingIndex(null);
    setEditingSelection([]);
  };

  // Clear confirmation handlers
  const confirmClear = () => setShowClearConfirm(true);
  const doClear = () => {
    clearCart();
    setShowClearConfirm(false);
    setEditingIndex(null);
  };
  const cancelClear = () => setShowClearConfirm(false);

  // Open checkout modal (only if cart has items)
  const openCheckout = () => {
    if (!items || items.length === 0) {
      alert("Cart is empty.");
      return;
    }
    setShowCheckoutModal(true);
  };

  // When user clicks "Add more items" in the modal: close modal + close drawer
  const handleAddMoreItems = () => {
    setShowCheckoutModal(false);
    setOpen(false);
  };

  // after order placed callback
  const handleOrderPlaced = (payload) => {
    console.log("Order placed:", payload);
    // modal already closes itself (see CheckoutModal implementation)
    // you can trigger analytics / navigation here
  };

  return (
    <>
      {/* floating cart button */}
      <div className="cart-floating">
        <button
          className="cart-btn"
          onClick={() => setOpen(true)}
          aria-expanded={open}
          aria-controls="cart-drawer"
        >
          Cart ({totalItemsCount}) • {formatPrice(Number(subtotal || 0))}
        </button>
      </div>

      {/* drawer */}
      <aside id="cart-drawer" className={`cart-drawer ${open ? "open" : ""}`} role="dialog" aria-modal="true">
        <div className="cart-head">
          <h4>Your cart</h4>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            {items.length > 0 && (
              <button className="btn-clear" onClick={confirmClear} aria-label="Clear cart">Clear</button>
            )}
            <button className="close" aria-label="Close cart" onClick={() => { setOpen(false); setEditingIndex(null); }}>×</button>
          </div>
        </div>

        <div className="cart-body">
          {items.length === 0 && <div className="empty">Your cart is empty</div>}

          {items.map((it, idx) => {
            const addOnText = (it.addOns || []).map(a => a.name).join(", ");
            const linePrice = ((Number(it.basePrice || 0) + (it.addOns || []).reduce((s, a) => s + Number(a.price || 0), 0)) * Number(it.qty || 0));
            const hasAddOnOptions = Array.isArray(it.addOnOptions) && it.addOnOptions.length > 0;

            return (
              <div key={idx} className="cart-line">
                <div className="cart-line-main">
                  <div className="line-info" style={{ minWidth: 0 }}>
                    <div className="line-title">{it.title}</div>
                    {addOnText && <div className="line-addons">{addOnText}</div>}
                    {hasAddOnOptions && <div className="addon-available">Add-ons available</div>}
                  </div>

                  <div className="line-controls">
                    <div className="line-qty">
                      <button aria-label="Decrease quantity" onClick={() => updateQty(idx, (it.qty || 1) - 1)}>-</button>
                      <span>{it.qty}</span>
                      <button aria-label="Increase quantity" onClick={() => updateQty(idx, (it.qty || 1) + 1)}>+</button>
                    </div>

                    <div className="line-price">{formatPrice(Number(linePrice || 0))}</div>

                    {hasAddOnOptions && <button className="edit" onClick={() => openForIndex(idx)} aria-label={`Edit ${it.title}`}>Edit</button>}

                    <button className="remove" onClick={() => removeIndex(idx)} aria-label={`Remove ${it.title}`}>Remove</button>
                  </div>
                </div>

                {/* editor (appears below the main row) */}
                {editingIndex === idx && (
                  <div className="cart-line-editor">
                    <div className="editor-title">Edit add-ons</div>

                    {(!it.addOnOptions || it.addOnOptions.length === 0) ? (
                      <div className="editor-empty">No add-ons available for this item.</div>
                    ) : (
                      <div className="editor-options">
                        {it.addOnOptions.map(opt => {
                          const checked = editingSelection.includes(String(opt.id));
                          return (
                            <label key={opt.id} className="editor-option">
                              <input
                                type={opt.type === "single" ? "radio" : "checkbox"}
                                name={`cart-edit-${idx}`}
                                checked={checked}
                                onChange={() => toggleEditingAddon(opt)}
                              />
                              <span>{opt.name}{opt.price ? ` (+${formatPrice(Number(opt.price || 0))})` : ""}</span>
                            </label>
                          );
                        })}
                      </div>
                    )}

                    <div className="editor-actions">
                      <button className="btn-proceed" onClick={saveEditor}>Save</button>
                      <button className="reset-btn" onClick={() => setEditingSelection([])}>Clear</button>
                      <button className="btn-clear" onClick={() => { setEditingIndex(null); setEditingSelection([]); }}>Cancel</button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="cart-footer">
          <div className="cart-sub">
            <div>Subtotal</div>
            <div>{formatPrice(Number(subtotal || 0))}</div>
          </div>

          <div className="cart-actions">
            <button className="btn-proceed" onClick={openCheckout}>
              Proceed ({formatPrice(Number(subtotal || 0))})
            </button>
          </div>
        </div>
      </aside>

      {open && <div className="cart-backdrop" onClick={() => { setOpen(false); setEditingIndex(null); }} />}

      {/* Clear confirmation modal */}
      {showClearConfirm && (
        <>
          <div className="confirm-modal-backdrop" onClick={cancelClear} />
          <div className="confirm-modal" role="dialog" aria-modal="true" aria-labelledby="confirm-title">
            <div className="confirm-content">
              <h4 id="confirm-title">Clear cart?</h4>
              <p>Are you sure you want to remove all items from your cart?</p>
              <div className="confirm-actions">
                <button className="btn-clear" onClick={cancelClear}>Cancel</button>
                <button className="btn-proceed" onClick={() => { doClear(); setShowClearConfirm(false); }}>Yes, clear</button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Checkout modal overlay (animated) */}
      <CheckoutModal
        open={showCheckoutModal}
        onClose={() => setShowCheckoutModal(false)}
        onAddMore={() => handleAddMoreItems()}
        onOrderPlaced={(payload) => handleOrderPlaced(payload)}
      />
    </>
  );
}
