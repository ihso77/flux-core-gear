import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, Sparkles, TrendingUp } from "lucide-react";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const popularSearches = [
  "Mechanical Keyboard",
  "Gaming Mouse",
  "RGB Headset",
  "Wireless",
];

const SearchBar = ({ value, onChange, placeholder = "Search products..." }: SearchBarProps) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleClear = () => {
    onChange("");
    setShowSuggestions(false);
    inputRef.current?.focus();
  };

  const filteredSuggestions = value.length > 0 
    ? popularSearches.filter(s => s.toLowerCase().includes(value.toLowerCase()))
    : popularSearches;

  return (
    <div className="relative w-full max-w-xl mx-auto">
      <motion.div
        initial={false}
        animate={{
          scale: isFocused ? 1.02 : 1,
          boxShadow: isFocused 
            ? "0 0 30px -5px hsl(271 81% 56% / 0.3)" 
            : "0 0 0px 0px transparent",
        }}
        transition={{ duration: 0.2 }}
        className={`relative flex items-center gap-3 rounded-xl border bg-card/50 backdrop-blur-sm px-4 py-3 transition-all duration-300 ${
          isFocused 
            ? "border-primary/50" 
            : "border-border hover:border-primary/30"
        }`}
      >
        <motion.div
          animate={isFocused ? { rotate: 360 } : { rotate: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Search className={`h-5 w-5 transition-colors ${isFocused ? "text-primary" : "text-muted-foreground"}`} />
        </motion.div>
        
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => {
            setIsFocused(true);
            setShowSuggestions(true);
          }}
          onBlur={() => {
            setIsFocused(false);
            setTimeout(() => setShowSuggestions(false), 200);
          }}
          placeholder={placeholder}
          className="flex-1 bg-transparent font-body text-sm text-foreground placeholder:text-muted-foreground outline-none"
        />
        
        <AnimatePresence>
          {value && (
            <motion.button
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleClear}
              className="flex h-6 w-6 items-center justify-center rounded-full bg-muted hover:bg-muted-foreground/20 transition-colors"
            >
              <X className="h-3 w-3 text-muted-foreground" />
            </motion.button>
          )}
        </AnimatePresence>

        {/* Search glow effect */}
        {isFocused && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="pointer-events-none absolute inset-0 rounded-xl bg-primary/5"
          />
        )}
      </motion.div>

      {/* Search Suggestions Dropdown */}
      <AnimatePresence>
        {showSuggestions && filteredSuggestions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 right-0 z-50 mt-2 rounded-xl border border-border bg-card/95 backdrop-blur-xl p-2 shadow-xl"
          >
            <div className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-muted-foreground">
              {value.length === 0 ? (
                <>
                  <TrendingUp className="h-3 w-3" />
                  <span>Popular searches</span>
                </>
              ) : (
                <>
                  <Sparkles className="h-3 w-3 text-primary" />
                  <span>Suggestions</span>
                </>
              )}
            </div>
            
            <div className="space-y-1">
              {filteredSuggestions.map((suggestion, index) => (
                <motion.button
                  key={suggestion}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => {
                    onChange(suggestion);
                    setShowSuggestions(false);
                  }}
                  className="w-full flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-foreground hover:bg-primary/10 transition-colors group"
                >
                  <Search className="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary transition-colors" />
                  <span>{suggestion}</span>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SearchBar;
