# 📱 Quick Responsive Breakpoints Card

Copy this card to use as a reference when making other modules responsive!

---

## Standard Breakpoints

```css
/* Extra Small Mobile */
@media (max-width: 360px) { }

/* Mobile Portrait */
@media (max-width: 480px) { }

/* Mobile Landscape & Small Tablets */
@media (max-width: 768px) { }

/* Tablets */
@media (max-width: 1024px) { }

/* Large Tablets & Small Laptops */
@media (max-width: 1200px) { }

/* Landscape Phones */
@media (max-height: 600px) and (orientation: landscape) { }
```

---

## Common Patterns

###  Grid Transformation
```css
.grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 30px;
}

@media (max-width: 1024px) {
  .grid { grid-template-columns: repeat(2, 1fr); gap: 24px; }
}

@media (max-width: 768px) {
  .grid { grid-template-columns: 1fr; gap: 20px; }
}
```

### Container Padding
```css
.container { padding: 40px; }

@media (max-width: 1024px) { .container { padding: 30px; } }
@media (max-width: 768px) { .container { padding: 20px; } }
@media (max-width: 480px) { .container { padding: 15px; } }
@media (max-width: 360px) { .container { padding: 12px; } }
```

### Typography Scale
```css
h1 { font-size: 3.5rem; }

@media (max-width: 1024px) { h1 { font-size: 3rem; } }
@media (max-width: 768px) { h1 { font-size: 2.5rem; } }
@media (max-width: 480px) { h1 { font-size: 2rem; } }
@media (max-width: 360px) { h1 { font-size: 1.75rem; } }
```

### Full-Width Buttons
```css
.button {
  padding: 16px 32px;
  display: inline-block;
}

@media (max-width: 768px) {
  .button {
    width: 100%;
    padding: 14px 24px;
  }
}

@media (max-width: 480px) {
  .button { padding: 12px 20px; }
}
```

### Modal Responsive
```css
.modal {
  max-width: 900px;
  padding: 40px 30px;
  border-radius: 16px;
}

@media (max-width: 768px) {
  .modal {
    max-width: 100%;
    padding: 30px 20px;
    border-radius: 12px;
  }
}

@media (max-width: 480px) {
  .modal {
    padding: 25px 16px;
    border-radius: 10px;
  }
}
```

---

## Touch Target Checklist

✅ Minimum 44x44px (WCAG 2.1 AA)  
✅ Recommended 48x48px  
✅ Adequate spacing between targets  
✅ Full-width on mobile when appropriate  

---

## Typography Checklist

✅ Base mobile font: 16px (prevents zoom on iOS)  
✅ Progressive scaling up for desktop  
✅ Line-height: 1.5-1.7 for readability  
✅ Max line width: 65-75 characters  

---

## Grid Checklist

✅ Start with mobile single column  
✅ Add columns on larger screens  
✅ Use auto-fit or auto-fill for flexibility  
✅ Scale gaps with screen size  

---

## Quick Copy-Paste Template

```css
/* Component Name */
.component-name {
  /* Desktop styles */
  padding: 40px;
  font-size: 1.5rem;
}

/* Large Tablets (1200px and below) */
@media (max-width: 1200px) {
  .component-name {
    padding: 35px;
  }
}

/* Tablets (1024px and below) */
@media (max-width: 1024px) {
  .component-name {
    padding: 30px;
    font-size: 1.3rem;
  }
}

/* Mobile Landscape (768px and below) */
@media (max-width: 768px) {
  .component-name {
    padding: 20px;
    font-size: 1.2rem;
  }
}

/* Mobile Portrait (480px and below) */
@media (max-width: 480px) {
  .component-name {
    padding: 15px;
    font-size: 1rem;
  }
}

/* Extra Small (360px and below) */
@media (max-width: 360px) {
  .component-name {
    padding: 12px;
    font-size: 0.9rem;
  }
}

/* Landscape Phones */
@media (max-height: 600px) and (orientation: landscape) {
  .component-name {
    padding: 20px;
  }
}
```

---

**Print this and keep it handy!** 🎯
