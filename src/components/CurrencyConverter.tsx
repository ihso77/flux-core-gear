import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { DollarSign, ChevronDown } from "lucide-react";

const currencies = [
  { code: "USD", symbol: "$", name: "US Dollar", rate: 1 },
  { code: "SAR", symbol: "ر.س", name: "ريال سعودي", rate: 3.75 },
  { code: "AED", symbol: "د.إ", name: "درهم إماراتي", rate: 3.67 },
  { code: "EUR", symbol: "€", name: "Euro", rate: 0.92 },
  { code: "GBP", symbol: "£", name: "British Pound", rate: 0.79 },
  { code: "KWD", symbol: "د.ك", name: "دينار كويتي", rate: 0.31 },
  { code: "QAR", symbol: "ر.ق", name: "ريال قطري", rate: 3.64 },
  { code: "BHD", symbol: "د.ب", name: "دينار بحريني", rate: 0.376 },
  { code: "OMR", symbol: "ر.ع", name: "ريال عماني", rate: 0.385 },
  { code: "EGP", symbol: "ج.م", name: "جنيه مصري", rate: 30.9 },
];

export const useCurrency = () => {
  const stored = typeof window !== "undefined" ? localStorage.getItem("nova-currency") : null;
  const [currency, setCurrencyState] = useState(
    currencies.find((c) => c.code === stored) || currencies[0]
  );

  const setCurrency = (code: string) => {
    const c = currencies.find((cur) => cur.code === code);
    if (c) {
      setCurrencyState(c);
      localStorage.setItem("nova-currency", code);
    }
  };

  const convert = (usdAmount: number | string) => {
    const amount = typeof usdAmount === "string" ? parseFloat(usdAmount) : usdAmount;
    if (isNaN(amount)) return "0.00";
    return (amount * currency.rate).toFixed(2);
  };

  const format = (usdAmount: number | string) => {
    return `${currency.symbol} ${convert(usdAmount)}`;
  };

  return { currency, setCurrency, convert, format, currencies };
};

const CurrencySelector = () => {
  const { currency, setCurrency, currencies } = useCurrency();
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 rounded-lg border border-border bg-card/50 px-2.5 py-1.5 text-xs font-medium text-foreground hover:border-primary/30 transition-colors touch-manipulation"
      >
        <DollarSign className="h-3.5 w-3.5 text-primary" />
        <span>{currency.code}</span>
        <ChevronDown className={`h-3 w-3 transition-transform ${open ? "rotate-180" : ""}`} />
      </motion.button>

      <AnimatePresence>
        {open && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.95 }}
              className="absolute right-0 top-full mt-1 z-50 w-44 rounded-xl border border-border bg-card shadow-xl overflow-hidden"
            >
              {currencies.map((c) => (
                <button
                  key={c.code}
                  onClick={() => {
                    setCurrency(c.code);
                    setOpen(false);
                  }}
                  className={`w-full flex items-center gap-2 px-3 py-2 text-xs hover:bg-primary/10 transition-colors ${
                    c.code === currency.code ? "bg-primary/10 text-primary font-medium" : "text-foreground"
                  }`}
                >
                  <span className="font-medium w-8">{c.symbol}</span>
                  <span>{c.code}</span>
                  <span className="text-muted-foreground ml-auto">{c.name}</span>
                </button>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CurrencySelector;
