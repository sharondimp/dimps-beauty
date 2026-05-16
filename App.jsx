import { useState, useEffect } from "react";
import { FaInstagram, FaTiktok, FaPhone, FaEnvelope } from "react-icons/fa";

/* ───────── GLOBAL STYLES ───────── */
const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,600;0,700;1,400&family=Montserrat:wght@300;400;500;600&display=swap');

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    html { scroll-behavior: smooth; }
    body { background: #080808; color: #f0e6d3; font-family: 'Montserrat', sans-serif; overflow-x: hidden; }
    ::-webkit-scrollbar { width: 3px; }
    ::-webkit-scrollbar-thumb { background: #b8924a; border-radius: 2px; }

    @keyframes fadeUp  { from { opacity:0; transform:translateY(36px) } to { opacity:1; transform:translateY(0) } }
    @keyframes fadeIn  { from { opacity:0 } to { opacity:1 } }
    @keyframes marquee { from { transform:translateX(0) } to { transform:translateX(-50%) } }
    @keyframes drift   { 0%,100%{transform:translateY(0) translateX(0);opacity:.35} 50%{transform:translateY(-18px) translateX(8px);opacity:.75} }
    @keyframes modalIn { from{opacity:0;transform:scale(.95)} to{opacity:1;transform:scale(1)} }

    .fu  { animation: fadeUp .8s ease both; }
    .fu1 { animation: fadeUp .8s .15s ease both; }
    .fu2 { animation: fadeUp .8s .3s  ease both; }
    .fu3 { animation: fadeUp .8s .45s ease both; }
    .fu4 { animation: fadeUp .8s .6s  ease both; }

    .gold-btn {
      background: linear-gradient(135deg,#b8924a,#e8c97a,#b8924a);
      background-size: 200% auto; color: #0d0d0d; border: none; cursor: pointer;
      font-family: 'Montserrat',sans-serif; font-weight: 600;
      letter-spacing: 3px; text-transform: uppercase;
      transition: background-position .5s, transform .2s, box-shadow .3s;
    }
    .gold-btn:hover { background-position:right center; transform:translateY(-2px); box-shadow:0 8px 28px #b8924a55; }

    .outline-btn {
      background: transparent; color: #b8924a; border: 1px solid #b8924a; cursor: pointer;
      font-family: 'Montserrat',sans-serif; font-weight: 500;
      letter-spacing: 2px; text-transform: uppercase; transition: all .3s;
    }
    .outline-btn:hover { background: #b8924a; color: #0d0d0d; }

    .card {
      background: #0f0f0f; border: 1px solid #1c1c1c; cursor: pointer;
      transition: border-color .3s, transform .3s, box-shadow .3s;
    }
    .card:hover { border-color:#b8924a; transform:translateY(-6px); box-shadow:0 20px 50px #00000088, 0 0 28px #b8924a18; }

    .nav-btn {
      background: none; border: none; color: #c8b99a;
      font-family: 'Montserrat',sans-serif; font-size: 10px;
      letter-spacing: 3px; text-transform: uppercase; cursor: pointer;
      padding: 4px 0; position: relative; transition: color .2s;
    }
    .nav-btn::after { content:''; position:absolute; bottom:0; left:0; right:0; height:1px; background:#b8924a; transform:scaleX(0); transition:transform .3s; }
    .nav-btn:hover { color:#e8c97a; }
    .nav-btn:hover::after { transform:scaleX(1); }

    .field {
      width:100%; background:#111; border:1px solid #2a2a2a;
      color:#f0e6d3; font-family:'Montserrat',sans-serif; font-size:13px;
      padding:13px 16px; outline:none; transition:border-color .3s; margin-bottom:14px;
    }
    .field:focus { border-color:#b8924a; }
    .field::placeholder { color:#555; }

    @media(max-width:768px){
      .hide-mob { display:none !important; }
      .grid-3   { grid-template-columns:1fr 1fr !important; }
    }
    @media(max-width:480px){
      .grid-3 { grid-template-columns:1fr !important; }
    }
  `}</style>
);

/* ───────── DATA ───────── */
const PRODUCTS = [
  { id:1, name:"Obsidian Lace Front",   price:85000, tag:"BEST SELLER", short:'Jet black · 26" · HD lace',         detail:"Premium HD lace front wig in jet black. 180% density for a full, natural look. Pre-plucked hairline with baby hairs. Fits all head sizes.", bg:"#141414" },
  { id:2, name:"Golden Hour Body Wave", price:72000, tag:"NEW IN",      short:'Honey blonde ombré · 22" · wavy',   detail:"Stunning honey-to-blonde ombré body wave. Soft, bouncy curls that hold shape. No shedding, no tangling. Beginner-friendly install.", bg:"#1c1407" },
  { id:3, name:"Noir Closure Wig",      price:60000, tag:"NEW IN",      short:'Natural black · 20" · 4×4',         detail:"4×4 lace closure wig in natural black. Silky straight texture with a natural part. Easy to install, perfect for everyday glam.", bg:"#0f0f0f" },
  { id:4, name:"Empress Straight",      price:78000, tag:"BEST SELLER", short:'Jet black · 28" · bone straight',   detail:"Bone straight raw hair wig. Ultra-sleek and glossy finish. 28 inches of pure drama. Can be dyed and heat-styled freely.", bg:"#0d0d0d" },
  { id:5, name:"Burgundy Goddess",      price:68000, tag:"HOT",         short:'Wine red · 24" · full lace',        detail:"Deep burgundy full lace wig. Rich, bold colour that commands attention. 24 inches of lush, voluminous hair. Perfect for special occasions.", bg:"#150506" },
  { id:6, name:"Ivory Dream",           price:90000, tag:"LUXURY",      short:'Platinum blonde · 30" · raw',       detail:"Top-tier raw Vietnamese platinum blonde hair. 30 inches of silky, flowing luxury. Our most exclusive piece — limited stock.", bg:"#1a1710" },
];

const fmt = (n) => "₦" + n.toLocaleString("en-NG");
const MARQUEE = "DIMP'S BEAUTY EMPIRE  ✦  CROWNED IN CONFIDENCE  ✦  LUXURY WIGS LAGOS  ✦  ";

/* ───────── PARTICLES ───────── */
function Particles() {
  return (
    <div style={{position:"absolute",inset:0,overflow:"hidden",pointerEvents:"none",zIndex:1}}>
      {[...Array(20)].map((_,i) => (
        <div key={i} style={{
          position:"absolute", borderRadius:"50%",
          width:i%3===0?2:1, height:i%3===0?2:1,
          background:i%4===0?"#b8924a":"#ffffff66",
          left:`${(i*5.3+4)%100}%`, top:`${(i*7.1+8)%100}%`,
          animation:`drift ${3+(i%4)}s ease-in-out infinite`,
          animationDelay:`${i*0.35}s`,
        }}/>
      ))}
    </div>
  );
}

/* ───────── MARQUEE ───────── */
function MarqueeStrip() {
  return (
    <div style={{background:"#b8924a",overflow:"hidden",whiteSpace:"nowrap",padding:"9px 0"}}>
      <div style={{display:"inline-block",animation:"marquee 22s linear infinite"}}>
        {[MARQUEE, MARQUEE].map((t,i) => (
          <span key={i} style={{fontSize:9,letterSpacing:3,fontWeight:600,color:"#0d0d0d"}}>{t}</span>
        ))}
      </div>
    </div>
  );
}

/* ───────── NAVBAR ───────── */
function Navbar({ setPage, cartCount }) {
  const [scrolled, setScrolled] = useState(false);
  const [mob, setMob] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const go = (p) => { setPage(p); setMob(false); window.scrollTo(0,0); };
  const goContact = () => {
    setMob(false); setPage("landing");
    setTimeout(() => document.getElementById("contact")?.scrollIntoView({behavior:"smooth"}), 120);
  };

  return (
    <>
      <nav style={{
        position:"fixed",top:0,left:0,right:0,zIndex:300,
        display:"flex",alignItems:"center",justifyContent:"space-between",
        padding:"16px 5%",
        background: scrolled ? "rgba(8,8,8,0.94)" : "transparent",
        backdropFilter: scrolled ? "blur(14px)" : "none",
        borderBottom: scrolled ? "1px solid #1a1a1a" : "none",
        transition:"all .4s",
      }}>
        {/* LOGO — swap the box below with <img src="your-logo.png" style={{height:40}}/> when ready */}
        <div onClick={() => go("landing")} style={{cursor:"pointer",display:"flex",alignItems:"center",gap:12}}>
          <div style={{
            width:40,height:40,border:"1px solid #b8924a",flexShrink:0,
            display:"flex",alignItems:"center",justifyContent:"center",
            fontSize:8,letterSpacing:1,color:"#b8924a",fontWeight:600,
          }}>LOGO</div>
          <div>
            <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:18,fontWeight:700,letterSpacing:2,color:"#f0e6d3",lineHeight:1}}>DIMP'S</div>
            <div style={{fontSize:7,letterSpacing:5,color:"#b8924a",fontWeight:500}}>BEAUTY EMPIRE</div>
          </div>
        </div>

        {/* Desktop links */}
        <div className="hide-mob" style={{display:"flex",gap:32}}>
          <button className="nav-btn" onClick={() => go("landing")}>Home</button>
          <button className="nav-btn" onClick={() => go("shop")}>Shop</button>
          <button className="nav-btn" onClick={goContact}>Contact</button>
        </div>

        {/* Cart + burger */}
        <div style={{display:"flex",alignItems:"center",gap:16}}>
          <button onClick={() => go("cart")} style={{background:"none",border:"none",cursor:"pointer",color:"#f0e6d3",fontSize:18,position:"relative"}}>
            🛒
            {cartCount > 0 && (
              <span style={{
                position:"absolute",top:-6,right:-6,
                background:"#b8924a",color:"#0d0d0d",
                borderRadius:"50%",width:16,height:16,fontSize:9,fontWeight:700,
                display:"flex",alignItems:"center",justifyContent:"center",
              }}>{cartCount}</span>
            )}
          </button>
          <button onClick={() => setMob(!mob)} style={{
            background:"none",border:"none",color:"#f0e6d3",fontSize:22,cursor:"pointer",
            display:"none",
          }} id="mob-burger">☰</button>
        </div>
      </nav>

      {/* Mobile fullscreen menu */}
      {mob && (
        <div style={{
          position:"fixed",inset:0,zIndex:290,
          background:"rgba(8,8,8,0.97)",
          display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:36,
          animation:"fadeIn .3s ease",
        }}>
          <button onClick={() => setMob(false)} style={{position:"absolute",top:20,right:24,background:"none",border:"none",color:"#f0e6d3",fontSize:24,cursor:"pointer"}}>✕</button>
          {[["Home","landing"],["Shop","shop"],["Cart","cart"]].map(([label,p]) => (
            <button key={p} className="nav-btn" style={{fontSize:14,letterSpacing:5}} onClick={() => go(p)}>{label}</button>
          ))}
          <button className="nav-btn" style={{fontSize:14,letterSpacing:5}} onClick={goContact}>Contact</button>
        </div>
      )}

      <style>{`@media(max-width:768px){ #mob-burger{ display:block !important; } }`}</style>
    </>
  );
}

/* ───────── LANDING PAGE ───────── */
function Landing({ setPage }) {
  return (
    <div>
      {/* Hero */}
      <section style={{
        minHeight:"100vh",position:"relative",overflow:"hidden",
        display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",
        textAlign:"center",padding:"100px 6% 80px",
        background:"linear-gradient(160deg,#0d0d0d 0%,#080808 50%,#100a04 100%)",
      }}>
        <Particles />
        {/* Decorative rings */}
        <div style={{position:"absolute",width:500,height:500,borderRadius:"50%",border:"1px solid #b8924a08",top:"50%",left:"50%",transform:"translate(-50%,-50%)",zIndex:1,pointerEvents:"none"}}/>
        <div style={{position:"absolute",width:340,height:340,borderRadius:"50%",border:"1px solid #b8924a14",top:"50%",left:"50%",transform:"translate(-50%,-50%)",zIndex:1,pointerEvents:"none"}}/>

        <div style={{position:"relative",zIndex:2}}>
          <p className="fu" style={{fontSize:9,letterSpacing:6,color:"#b8924a",fontWeight:600,textTransform:"uppercase",marginBottom:24}}>✦ Lagos Finest ✦</p>
          <h1 className="fu1" style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"clamp(3.2rem,10vw,7.5rem)",fontWeight:700,lineHeight:1,letterSpacing:-1,color:"#f0e6d3",marginBottom:8}}>
            Dimp's
          </h1>
          <h1 className="fu2" style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"clamp(1.6rem,5vw,3.8rem)",fontWeight:300,fontStyle:"italic",letterSpacing:8,color:"#b8924a",marginBottom:32}}>
            Beauty Empire
          </h1>
          <p className="fu3" style={{fontSize:"clamp(.85rem,2vw,1rem)",color:"#9a8870",letterSpacing:2,lineHeight:1.9,maxWidth:400,margin:"0 auto 48px"}}>
            Luxury wigs crafted for women who walk into rooms and own them.
          </p>
          <div className="fu4" style={{display:"flex",gap:16,justifyContent:"center",flexWrap:"wrap"}}>
            <button className="gold-btn" style={{padding:"16px 44px",fontSize:11,borderRadius:0}}
              onClick={() => { setPage("shop"); window.scrollTo(0,0); }}>
              Start Shopping
            </button>
            <button className="outline-btn" style={{padding:"15px 32px",fontSize:11,borderRadius:0}}
              onClick={() => document.getElementById("contact")?.scrollIntoView({behavior:"smooth"})}>
              Contact Us
            </button>
          </div>
        </div>
        <p style={{position:"absolute",bottom:28,fontSize:9,letterSpacing:4,color:"#2a2018",textTransform:"uppercase",zIndex:2}}>scroll down</p>
      </section>

      <MarqueeStrip />

      {/* About strip */}
      <section style={{padding:"80px 6%",background:"#0a0a0a",borderTop:"1px solid #111"}}>
        <div style={{maxWidth:760,margin:"0 auto",textAlign:"center"}}>
          <p style={{fontSize:9,letterSpacing:5,color:"#b8924a",fontWeight:600,textTransform:"uppercase",marginBottom:18}}>Our Promise</p>
          <h2 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"clamp(1.8rem,4vw,3rem)",fontWeight:600,color:"#f0e6d3",lineHeight:1.3,marginBottom:22}}>
            Crowned in Confidence,<br/><em>Draped in Luxury</em>
          </h2>
          <p style={{fontSize:13,color:"#6a5a48",lineHeight:2,maxWidth:520,margin:"0 auto"}}>
            Every wig in our collection is sourced with care, crafted with precision, and designed to make you feel like the queen you are. From silky straights to bold colours — we have your crown.
          </p>
        </div>
      </section>

      {/* Contact Footer */}
      <footer id="contact" style={{background:"#050505",borderTop:"1px solid #161616",padding:"60px 6% 36px"}}>
        <div style={{maxWidth:900,margin:"0 auto"}}>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(190px,1fr))",gap:40,marginBottom:44}}>
            <div>
              <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:22,fontWeight:700,letterSpacing:2,color:"#f0e6d3",marginBottom:4}}>DIMP'S</div>
              <div style={{fontSize:8,letterSpacing:5,color:"#b8924a",marginBottom:14}}>BEAUTY EMPIRE</div>
              <p style={{fontSize:12,color:"#4a3a28",lineHeight:1.8}}>Luxury wigs for the confident woman. Lagos, Nigeria.</p>
            </div>
            <div>
  <p style={{fontSize:9,letterSpacing:4,color:"#b8924a",fontWeight:600,marginBottom:18,textTransform:"uppercase"}}>Get In Touch</p>
  <p style={{fontSize:12,color:"#6a5a48",marginBottom:10,display:"flex",alignItems:"center",gap:8}}><FaPhone color="#b8924a"/> 09138866463</p>
  <p style={{fontSize:12,color:"#6a5a48",marginBottom:10,display:"flex",alignItems:"center",gap:8}}><FaEnvelope color="#b8924a"/> dimpsbeautyempire01@gmail.com</p>
  <div style={{display:"flex",gap:16,marginTop:12}}>
    <a href="https://instagram.com/dimpsbeautyempire_" target="_blank" rel="noreferrer" style={{color:"#b8924a",fontSize:20}}><FaInstagram/></a>
    <a href="https://tiktok.com/@dimpsbeautyempire_" target="_blank" rel="noreferrer" style={{color:"#b8924a",fontSize:20}}><FaTiktok/></a>
  </div>
</div>
          <div style={{borderTop:"1px solid #161616",paddingTop:22,display:"flex",justifyContent:"space-between",flexWrap:"wrap",gap:10}}>
            <p style={{fontSize:10,color:"#2a2018",letterSpacing:2}}>© 2026 DIMP'S BEAUTY EMPIRE. ALL RIGHTS RESERVED.</p>
            <p style={{fontSize:10,color:"#2a2018",letterSpacing:1}}>MADE WITH 🖤</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

/* ───────── PRODUCT MODAL ───────── */
function ProductModal({ product, onClose, onAddToCart }) {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  return (
    <div onClick={onClose} style={{
      position:"fixed",inset:0,zIndex:400,
      background:"rgba(0,0,0,0.88)",backdropFilter:"blur(6px)",
      display:"flex",alignItems:"center",justifyContent:"center",padding:20,
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        background:"#0f0f0f",border:"1px solid #2a2a2a",
        maxWidth:500,width:"100%",padding:"36px 32px",
        animation:"modalIn .35s ease",position:"relative",
      }}>
        <button onClick={onClose} style={{position:"absolute",top:14,right:18,background:"none",border:"none",color:"#444",fontSize:20,cursor:"pointer"}}>✕</button>

        {/* Image placeholder — swap with <img src={product.image}/> later */}
        <div style={{
          width:"100%",height:190,background:product.bg,
          border:"1px solid #222",marginBottom:26,
          display:"flex",alignItems:"center",justifyContent:"center",
        }}>
          <p style={{fontSize:9,letterSpacing:4,color:"#2a2018",textTransform:"uppercase"}}>Product Image</p>
        </div>

        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8}}>
          <h2 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:22,fontWeight:600,color:"#f0e6d3"}}>{product.name}</h2>
          <span style={{fontSize:8,letterSpacing:2,background:"#b8924a",color:"#0d0d0d",padding:"4px 10px",fontWeight:700,whiteSpace:"nowrap",marginLeft:12,flexShrink:0}}>{product.tag}</span>
        </div>
        <p style={{fontSize:20,color:"#b8924a",fontWeight:600,marginBottom:14,fontFamily:"'Cormorant Garamond',serif"}}>{fmt(product.price)}</p>
        <p style={{fontSize:13,color:"#6a5a48",lineHeight:1.9,marginBottom:28}}>{product.detail}</p>

        <div style={{display:"flex",gap:12}}>
          <button className="gold-btn" style={{flex:1,padding:"14px 0",fontSize:10,borderRadius:0}}
            onClick={() => { onAddToCart(product); onClose(); }}>
            Add to Cart
          </button>
          <button className="outline-btn" style={{padding:"14px 20px",fontSize:10,borderRadius:0}} onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

/* ───────── SHOP PAGE ───────── */
function Shop({ setCart }) {
  const [modal, setModal] = useState(null);

  const addToCart = (product) => {
    setCart(prev => {
      const exists = prev.find(i => i.id === product.id);
      if (exists) return prev.map(i => i.id === product.id ? {...i, qty:i.qty+1} : i);
      return [...prev, {...product, qty:1}];
    });
  };

  return (
    <div style={{minHeight:"100vh",paddingTop:72}}>
      <MarqueeStrip />
      <div style={{padding:"56px 5%"}}>
        <div style={{textAlign:"center",marginBottom:48}}>
          <p style={{fontSize:9,letterSpacing:5,color:"#b8924a",fontWeight:600,textTransform:"uppercase",marginBottom:14}}>Our Collection</p>
          <h1 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"clamp(2rem,5vw,3.5rem)",fontWeight:600,color:"#f0e6d3"}}>Shop All Wigs</h1>
        </div>

        <div className="grid-3" style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:20,maxWidth:1000,margin:"0 auto"}}>
          {PRODUCTS.map(p => (
            <div key={p.id} className="card" onClick={() => setModal(p)} style={{overflow:"hidden"}}>
              {/* Image area — replace bg div with <img> when you have product photos */}
              <div style={{width:"100%",height:200,background:p.bg,display:"flex",alignItems:"flex-end",padding:10}}>
                <span style={{fontSize:8,letterSpacing:2,background:"#b8924a",color:"#0d0d0d",padding:"3px 8px",fontWeight:700}}>{p.tag}</span>
              </div>
              <div style={{padding:"16px 14px"}}>
                <h3 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:16,fontWeight:600,color:"#f0e6d3",marginBottom:5}}>{p.name}</h3>
                <p style={{fontSize:11,color:"#4a3a28",marginBottom:12,lineHeight:1.6}}>{p.short}</p>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                  <span style={{fontSize:15,color:"#b8924a",fontWeight:600,fontFamily:"'Cormorant Garamond',serif"}}>{fmt(p.price)}</span>
                  <button className="outline-btn" style={{fontSize:9,padding:"6px 12px",borderRadius:0}}
                    onClick={e => { e.stopPropagation(); addToCart(p); }}>
                    + Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {modal && <ProductModal product={modal} onClose={() => setModal(null)} onAddToCart={addToCart} />}
    </div>
  );
}

/* ───────── CART PAGE ───────── */
function Cart({ cart, setCart, setPage }) {
  const update = (id, qty) => {
    if (qty < 1) { setCart(prev => prev.filter(i => i.id !== id)); return; }
    setCart(prev => prev.map(i => i.id === id ? {...i, qty} : i));
  };
  const total = cart.reduce((s,i) => s + i.price * i.qty, 0);

  return (
    <div style={{minHeight:"100vh",padding:"100px 5% 60px"}}>
      <div style={{maxWidth:680,margin:"0 auto"}}>
        <p style={{fontSize:9,letterSpacing:5,color:"#b8924a",fontWeight:600,textTransform:"uppercase",marginBottom:12}}>Your Cart</p>
        <h1 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"clamp(2rem,5vw,3rem)",fontWeight:600,color:"#f0e6d3",marginBottom:40}}>
          {cart.length === 0 ? "Your cart is empty" : `${cart.length} item${cart.length>1?"s":""}`}
        </h1>

        {cart.length === 0 ? (
          <div style={{textAlign:"center",padding:"60px 0"}}>
            <p style={{color:"#3a3028",fontSize:13,marginBottom:28,letterSpacing:1}}>You haven't added anything yet.</p>
            <button className="gold-btn" style={{padding:"14px 36px",fontSize:10,borderRadius:0}} onClick={() => { setPage("shop"); window.scrollTo(0,0); }}>
              Browse Collection
            </button>
          </div>
        ) : (
          <>
            {cart.map(item => (
              <div key={item.id} style={{display:"flex",alignItems:"center",gap:16,borderBottom:"1px solid #1a1a1a",paddingBottom:20,marginBottom:20}}>
                <div style={{width:68,height:68,background:item.bg,border:"1px solid #222",flexShrink:0}}/>
                <div style={{flex:1}}>
                  <h3 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:16,color:"#f0e6d3",marginBottom:4}}>{item.name}</h3>
                  <p style={{fontSize:11,color:"#4a3a28"}}>{fmt(item.price)} each</p>
                </div>
                <div style={{display:"flex",alignItems:"center",gap:8}}>
                  <button onClick={() => update(item.id, item.qty-1)} style={{background:"#181818",border:"1px solid #2a2a2a",color:"#f0e6d3",width:28,height:28,cursor:"pointer",fontSize:16,lineHeight:1}}>−</button>
                  <span style={{fontSize:13,color:"#f0e6d3",minWidth:22,textAlign:"center"}}>{item.qty}</span>
                  <button onClick={() => update(item.id, item.qty+1)} style={{background:"#181818",border:"1px solid #2a2a2a",color:"#f0e6d3",width:28,height:28,cursor:"pointer",fontSize:16,lineHeight:1}}>+</button>
                </div>
                <span style={{fontSize:14,color:"#b8924a",fontFamily:"'Cormorant Garamond',serif",fontWeight:600,minWidth:84,textAlign:"right"}}>{fmt(item.price*item.qty)}</span>
              </div>
            ))}

            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"20px 0",borderTop:"1px solid #222",marginBottom:28}}>
              <span style={{fontSize:10,letterSpacing:3,color:"#6a5a48",textTransform:"uppercase"}}>Total</span>
              <span style={{fontFamily:"'Cormorant Garamond',serif",fontSize:26,color:"#b8924a",fontWeight:700}}>{fmt(total)}</span>
            </div>

            <button className="gold-btn" style={{width:"100%",padding:"16px 0",fontSize:11,borderRadius:0}}
              onClick={() => { setPage("checkout"); window.scrollTo(0,0); }}>
              Proceed to Checkout
            </button>
          </>
        )}
      </div>
    </div>
  );
}

/* ───────── CHECKOUT PAGE ───────── */
function Checkout({ cart, setPage }) {
  const [form, setForm] = useState({name:"",phone:"",email:"",address:"",city:"",state:""});
  const [placed, setPlaced] = useState(false);
  const total = cart.reduce((s,i) => s + i.price * i.qty, 0);
  const set = (k,v) => setForm(prev => ({...prev,[k]:v}));

  const handlePlace = () => {
    if (!form.name || !form.phone || !form.address) { alert("Please fill in your name, phone number and address."); return; }
    setPlaced(true);
  };

  if (placed) return (
    <div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",padding:"100px 5%",textAlign:"center"}}>
      <div>
        <div style={{fontSize:44,marginBottom:24,color:"#b8924a"}}>✦</div>
        <h1 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"clamp(2rem,5vw,3rem)",color:"#b8924a",marginBottom:16}}>Order Placed!</h1>
        <p style={{fontSize:13,color:"#6a5a48",lineHeight:1.9,maxWidth:380,margin:"0 auto 36px"}}>
          Thank you, {form.name}. We've received your order and will contact you at <strong style={{color:"#b8924a"}}>{form.phone}</strong> to confirm delivery.
        </p>
        <button className="gold-btn" style={{padding:"14px 36px",fontSize:10,borderRadius:0}} onClick={() => setPage("landing")}>
          Back to Home
        </button>
      </div>
    </div>
  );

  return (
    <div style={{minHeight:"100vh",padding:"100px 5% 60px"}}>
      <div style={{maxWidth:580,margin:"0 auto"}}>
        <p style={{fontSize:9,letterSpacing:5,color:"#b8924a",fontWeight:600,textTransform:"uppercase",marginBottom:12}}>Almost There</p>
        <h1 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"clamp(2rem,5vw,3rem)",fontWeight:600,color:"#f0e6d3",marginBottom:32}}>Checkout</h1>

        {/* Order summary */}
        <div style={{background:"#0f0f0f",border:"1px solid #1c1c1c",padding:"20px",marginBottom:32}}>
          <p style={{fontSize:9,letterSpacing:4,color:"#b8924a",fontWeight:600,textTransform:"uppercase",marginBottom:14}}>Order Summary</p>
          {cart.map(i => (
            <div key={i.id} style={{display:"flex",justifyContent:"space-between",marginBottom:8}}>
              <span style={{fontSize:12,color:"#6a5a48"}}>{i.name} × {i.qty}</span>
              <span style={{fontSize:12,color:"#b8924a"}}>{fmt(i.price*i.qty)}</span>
            </div>
          ))}
          <div style={{borderTop:"1px solid #1c1c1c",marginTop:12,paddingTop:12,display:"flex",justifyContent:"space-between"}}>
            <span style={{fontSize:10,letterSpacing:2,color:"#4a3a28",textTransform:"uppercase"}}>Total</span>
            <span style={{fontFamily:"'Cormorant Garamond',serif",fontSize:18,color:"#b8924a",fontWeight:700}}>{fmt(total)}</span>
          </div>
        </div>

        {/* Delivery form */}
        <p style={{fontSize:9,letterSpacing:4,color:"#b8924a",fontWeight:600,textTransform:"uppercase",marginBottom:18}}>Delivery Details</p>
        <input className="field" placeholder="Full Name *"        value={form.name}    onChange={e=>set("name",e.target.value)} />
        <input className="field" placeholder="Phone Number *"     value={form.phone}   onChange={e=>set("phone",e.target.value)} />
        <input className="field" placeholder="Email Address"      value={form.email}   onChange={e=>set("email",e.target.value)} />
        <input className="field" placeholder="Delivery Address *" value={form.address} onChange={e=>set("address",e.target.value)} />
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
          <input className="field" style={{marginBottom:0}} placeholder="City"  value={form.city}  onChange={e=>set("city",e.target.value)} />
          <input className="field" style={{marginBottom:0}} placeholder="State" value={form.state} onChange={e=>set("state",e.target.value)} />
        </div>

        <p style={{fontSize:10,color:"#3a3028",letterSpacing:1,margin:"18px 0 24px",lineHeight:1.9}}>
          🔒 Paystack payment integration coming soon. We'll contact you to arrange payment after you place your order.
        </p>

        <button className="gold-btn" style={{width:"100%",padding:"16px 0",fontSize:11,borderRadius:0,marginBottom:12}} onClick={handlePlace}>
          Place Order ✦
        </button>
        <button className="outline-btn" style={{width:"100%",padding:"14px 0",fontSize:10,borderRadius:0}} onClick={() => { setPage("cart"); window.scrollTo(0,0); }}>
          ← Back to Cart
        </button>
      </div>
    </div>
  );
}

/* ───────── APP ROOT ───────── */
export default function App() {
  const [page, setPage] = useState("landing");
  const [cart, setCart] = useState([]);
  const cartCount = cart.reduce((s,i) => s + i.qty, 0);

  const renderPage = () => {
    if (page === "shop")     return <Shop setCart={setCart} />;
    if (page === "cart")     return <Cart cart={cart} setCart={setCart} setPage={setPage} />;
    if (page === "checkout") return <Checkout cart={cart} setPage={setPage} />;
    return <Landing setPage={setPage} />;
  };

  return (
    <>
      <GlobalStyles />
      <Navbar setPage={setPage} cartCount={cartCount} />
      {renderPage()}
    </>
  );
}
