import { useState } from "react";
import { Link } from "react-router";
import { ChevronRight, Check, CreditCard, Smartphone, Building, Lock } from "lucide-react";
import { useApp } from "../store/AppContext";
import { formatETB } from "../utils/format";

type Step = "shipping" | "payment" | "review" | "done";
const STEPS: Step[] = ["shipping", "payment", "review", "done"];
const STEP_LABELS: Record<Step, string> = {
  shipping: "Shipping",
  payment: "Payment",
  review: "Review",
  done: "Confirmed",
};

const PAYMENT_METHODS = [
  { id: "telebirr", label: "TeleBirr", icon: Smartphone, desc: "Pay with TeleBirr mobile money" },
  { id: "cbe-birr", label: "CBE Birr", icon: Building, desc: "Commercial Bank of Ethiopia mobile banking" },
  { id: "amole", label: "Amole", icon: Smartphone, desc: "Dashen Bank Amole wallet" },
  { id: "card", label: "Visa / Mastercard", icon: CreditCard, desc: "International credit or debit card" },
];

export default function CheckoutPage() {
  const { cart, totalPrice, dispatch } = useApp();
  const [step, setStep] = useState<Step>("shipping");
  const [payMethod, setPayMethod] = useState("telebirr");

  const shipping = totalPrice >= 500 ? 0 : 80;
  const total = totalPrice + shipping;
  const currentStepIndex = STEPS.indexOf(step);

  const [form, setForm] = useState({
    firstName: "", lastName: "", phone: "", email: "",
    city: "", subcity: "", woreda: "", houseNo: "",
    notes: "",
  });

  function update(field: string, val: string) {
    setForm((f) => ({ ...f, [field]: val }));
  }

  function handlePlaceOrder() {
    dispatch({ type: "CLEAR_CART" });
    setStep("done");
  }

  if (step === "done") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-6">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 rounded-full bg-chart-3/15 flex items-center justify-center mx-auto mb-6">
            <Check size={36} className="text-chart-3" />
          </div>
          <h1 className="font-serif text-3xl font-bold text-foreground mb-3">Order Confirmed!</h1>
          <p className="text-muted-foreground mb-2">
            Thank you for shopping with Selam Market. Your order has been placed successfully.
          </p>
          <p className="font-mono text-sm text-primary font-medium mb-8">
            Order #SM-{Math.floor(Math.random() * 900000) + 100000}
          </p>
          <div className="flex gap-3 justify-center">
            <Link to="/" className="px-6 py-3 bg-primary text-primary-foreground rounded-xl text-sm font-medium hover:bg-primary/90 transition-colors">
              Back to Home
            </Link>
            <Link to="/shop" className="px-6 py-3 border border-border rounded-xl text-sm font-medium text-foreground hover:bg-secondary transition-colors">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-secondary border-b border-border">
        <div className="max-w-7xl mx-auto px-6 py-6">
          {/* Step indicator */}
          <div className="flex items-center gap-0 max-w-md">
            {STEPS.filter((s) => s !== "done").map((s, i) => {
              const idx = STEPS.indexOf(s);
              const done = currentStepIndex > idx;
              const active = currentStepIndex === idx;
              return (
                <div key={s} className="flex items-center flex-1 last:flex-none">
                  <div className="flex items-center gap-2">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-mono font-bold border-2 transition-colors ${
                      done ? "bg-primary border-primary text-primary-foreground"
                        : active ? "border-primary text-primary bg-card"
                          : "border-border text-muted-foreground bg-card"
                    }`}>
                      {done ? <Check size={13} /> : i + 1}
                    </div>
                    <span className={`text-xs font-medium hidden sm:block ${active ? "text-primary" : done ? "text-muted-foreground" : "text-muted-foreground"}`}>
                      {STEP_LABELS[s]}
                    </span>
                  </div>
                  {i < 2 && <div className={`flex-1 h-px mx-3 ${done ? "bg-primary" : "bg-border"}`} />}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="grid lg:grid-cols-3 gap-10">
          {/* Form area */}
          <div className="lg:col-span-2">
            {step === "shipping" && (
              <div className="space-y-6">
                <h2 className="font-serif text-2xl font-bold text-foreground">Shipping Address</h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  {[
                    { field: "firstName", label: "First Name", placeholder: "Dawit" },
                    { field: "lastName", label: "Last Name", placeholder: "Bekele" },
                  ].map(({ field, label, placeholder }) => (
                    <div key={field}>
                      <label className="block text-sm font-medium text-foreground mb-1.5">{label}</label>
                      <input
                        value={form[field as keyof typeof form]}
                        onChange={(e) => update(field, e.target.value)}
                        placeholder={placeholder}
                        className="w-full px-4 py-3 bg-input-background border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-primary transition-colors"
                      />
                    </div>
                  ))}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">Phone Number</label>
                    <input
                      value={form.phone}
                      onChange={(e) => update("phone", e.target.value)}
                      placeholder="+251 91 234 5678"
                      className="w-full px-4 py-3 bg-input-background border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-primary transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">Email Address</label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) => update("email", e.target.value)}
                      placeholder="dawit@example.com"
                      className="w-full px-4 py-3 bg-input-background border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-primary transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">City</label>
                    <select
                      value={form.city}
                      onChange={(e) => update("city", e.target.value)}
                      className="w-full px-4 py-3 bg-input-background border border-border rounded-xl text-sm text-foreground outline-none focus:border-primary transition-colors"
                    >
                      <option value="">Select city</option>
                      {["Addis Ababa", "Hawassa", "Bahir Dar", "Mekelle", "Gondar", "Dire Dawa", "Jimma", "Adama", "Harar"].map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">Subcity / Woreda</label>
                    <input
                      value={form.subcity}
                      onChange={(e) => update("subcity", e.target.value)}
                      placeholder="e.g. Bole, Woreda 03"
                      className="w-full px-4 py-3 bg-input-background border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-primary transition-colors"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-foreground mb-1.5">House Number / Landmark</label>
                    <input
                      value={form.houseNo}
                      onChange={(e) => update("houseNo", e.target.value)}
                      placeholder="Near Bole Medhanialem Church, House No. 123"
                      className="w-full px-4 py-3 bg-input-background border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-primary transition-colors"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-foreground mb-1.5">Delivery Notes (optional)</label>
                    <textarea
                      value={form.notes}
                      onChange={(e) => update("notes", e.target.value)}
                      placeholder="Any special instructions for delivery..."
                      rows={3}
                      className="w-full px-4 py-3 bg-input-background border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-primary transition-colors resize-none"
                    />
                  </div>
                </div>
                <button
                  onClick={() => setStep("payment")}
                  className="flex items-center gap-2 px-8 py-3.5 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary/90 transition-colors"
                >
                  Continue to Payment <ChevronRight size={15} />
                </button>
              </div>
            )}

            {step === "payment" && (
              <div className="space-y-6">
                <h2 className="font-serif text-2xl font-bold text-foreground">Payment Method</h2>
                <div className="space-y-3">
                  {PAYMENT_METHODS.map(({ id, label, icon: Icon, desc }) => (
                    <label
                      key={id}
                      className={`flex items-center gap-4 p-4 rounded-2xl border-2 cursor-pointer transition-colors ${
                        payMethod === id ? "border-primary bg-primary/5" : "border-border hover:border-muted-foreground"
                      }`}
                    >
                      <input
                        type="radio"
                        name="payment"
                        value={id}
                        checked={payMethod === id}
                        onChange={() => setPayMethod(id)}
                        className="sr-only"
                      />
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${payMethod === id ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"}`}>
                        <Icon size={18} />
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-foreground">{label}</div>
                        <div className="text-xs text-muted-foreground mt-0.5">{desc}</div>
                      </div>
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${payMethod === id ? "border-primary" : "border-border"}`}>
                        {payMethod === id && <div className="w-2.5 h-2.5 rounded-full bg-primary" />}
                      </div>
                    </label>
                  ))}
                </div>

                {payMethod === "card" && (
                  <div className="bg-secondary rounded-2xl p-5 space-y-4 border border-border">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1.5">Card Number</label>
                      <input placeholder="1234 5678 9012 3456" className="w-full px-4 py-3 bg-card border border-border rounded-xl text-sm font-mono text-foreground placeholder:text-muted-foreground outline-none focus:border-primary transition-colors" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-1.5">Expiry Date</label>
                        <input placeholder="MM / YY" className="w-full px-4 py-3 bg-card border border-border rounded-xl text-sm font-mono text-foreground placeholder:text-muted-foreground outline-none focus:border-primary transition-colors" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-1.5">CVV</label>
                        <input placeholder="123" className="w-full px-4 py-3 bg-card border border-border rounded-xl text-sm font-mono text-foreground placeholder:text-muted-foreground outline-none focus:border-primary transition-colors" />
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Lock size={12} className="text-primary" />
                  Your payment information is encrypted and secure
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setStep("shipping")}
                    className="px-6 py-3 border border-border rounded-xl text-sm font-medium text-foreground hover:bg-secondary transition-colors"
                  >
                    Back
                  </button>
                  <button
                    onClick={() => setStep("review")}
                    className="flex items-center gap-2 px-8 py-3.5 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary/90 transition-colors"
                  >
                    Review Order <ChevronRight size={15} />
                  </button>
                </div>
              </div>
            )}

            {step === "review" && (
              <div className="space-y-6">
                <h2 className="font-serif text-2xl font-bold text-foreground">Review Your Order</h2>
                <div className="space-y-3">
                  {cart.items.map((item) => (
                    <div key={item.id} className="flex gap-4 p-4 bg-card border border-border rounded-2xl">
                      <img src={item.image} alt={item.name} className="w-16 h-18 object-cover rounded-lg bg-secondary shrink-0" style={{ height: "4.5rem" }} />
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-foreground text-sm leading-snug">{item.name}</div>
                        <div className="text-xs text-muted-foreground mt-0.5">{item.seller}</div>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-xs text-muted-foreground font-mono">Qty: {item.quantity}</span>
                          <span className="font-mono text-sm font-semibold text-foreground">{formatETB(item.price * item.quantity)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="bg-card border border-border rounded-2xl p-4">
                    <div className="text-xs font-mono text-muted-foreground uppercase tracking-wider mb-2">Shipping to</div>
                    <div className="text-sm text-foreground font-medium">{form.firstName} {form.lastName}</div>
                    <div className="text-sm text-muted-foreground mt-0.5">{form.city}, {form.subcity}</div>
                    <div className="text-sm text-muted-foreground">{form.phone}</div>
                  </div>
                  <div className="bg-card border border-border rounded-2xl p-4">
                    <div className="text-xs font-mono text-muted-foreground uppercase tracking-wider mb-2">Payment via</div>
                    <div className="text-sm text-foreground font-medium">
                      {PAYMENT_METHODS.find((m) => m.id === payMethod)?.label}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setStep("payment")}
                    className="px-6 py-3 border border-border rounded-xl text-sm font-medium text-foreground hover:bg-secondary transition-colors"
                  >
                    Back
                  </button>
                  <button
                    onClick={handlePlaceOrder}
                    className="flex items-center gap-2 px-8 py-3.5 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary/90 transition-colors"
                  >
                    <Lock size={15} /> Place Order — {formatETB(total)}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Order summary sidebar */}
          <div className="space-y-4">
            <div className="bg-card border border-border rounded-2xl p-5 sticky top-28">
              <h3 className="font-serif text-lg font-semibold text-foreground mb-4">Order Summary</h3>
              <div className="space-y-3 mb-4">
                {cart.items.slice(0, 3).map((item) => (
                  <div key={item.id} className="flex items-center gap-3">
                    <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-secondary shrink-0">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-primary-foreground text-[10px] font-mono font-bold rounded-full flex items-center justify-center">
                        {item.quantity}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-medium text-foreground truncate">{item.name}</div>
                    </div>
                    <div className="text-xs font-mono font-semibold text-foreground shrink-0">{formatETB(item.price * item.quantity)}</div>
                  </div>
                ))}
                {cart.items.length > 3 && (
                  <div className="text-xs text-muted-foreground text-center">+{cart.items.length - 3} more items</div>
                )}
              </div>
              <div className="border-t border-border pt-4 space-y-2 text-sm">
                <div className="flex justify-between text-muted-foreground">
                  <span>Subtotal</span>
                  <span className="font-mono">{formatETB(totalPrice)}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Shipping</span>
                  <span className={`font-mono ${shipping === 0 ? "text-chart-3" : ""}`}>
                    {shipping === 0 ? "Free" : formatETB(shipping)}
                  </span>
                </div>
                <div className="flex justify-between font-semibold text-foreground pt-2 border-t border-border">
                  <span>Total</span>
                  <span className="font-mono text-base">{formatETB(total)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
