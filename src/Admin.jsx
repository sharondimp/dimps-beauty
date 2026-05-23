import { useState } from "react";
import { db } from "./firebase";
import { collection, addDoc, deleteDoc, doc, getDocs } from "firebase/firestore";

const ADMIN_PASSWORD = "dimps2026";
const IMGBB_API_KEY = "3c3465e192230bc0bca24a96d34d72f3";
const CATEGORIES = ["Bone Straight", "Straight Human Hair", "Wavy Wigs", "Curly Wigs", "Pixie Cut", "Coloured Wigs"];

export default function Admin() {
  const [authed, setAuthed] = useState(false);
  const [password, setPassword] = useState("");
  const [products, setProducts] = useState([]);
  const [promos, setPromos] = useState([]);
  const [form, setForm] = useState({name:"",price:"",tag:"",category:"Bone Straight",short:"",detail:"",bg:"#111111"});
  const [promoForm, setPromoForm] = useState({code:"",discount:""});
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [promoLoading, setPromoLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [promoSuccess, setPromoSuccess] = useState("");

  const login = () => {
    if (password === ADMIN_PASSWORD) {
      setAuthed(true);
      fetchProducts();
      fetchPromos();
    } else {
      alert("Wrong password!");
    }
  };

  const fetchProducts = async () => {
    const snapshot = await getDocs(collection(db, "Products"));
    setProducts(snapshot.docs.map(d => ({id: d.id, ...d.data()})));
  };

  const fetchPromos = async () => {
    const snapshot = await getDocs(collection(db, "PromoCodes"));
    setPromos(snapshot.docs.map(d => ({id: d.id, ...d.data()})));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const uploadToImgBB = async () => {
    if (!imageFile) return null;
    setUploading(true);
    const data = new FormData();
    data.append("image", imageFile);
    const res = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, {
      method: "POST",
      body: data,
    });
    const json = await res.json();
    setUploading(false);
    return json.data?.url || null;
  };

  const addProduct = async () => {
    if (!form.name || !form.price) { alert("Name and price are required!"); return; }
    setLoading(true);
    const imageUrl = await uploadToImgBB();
    await addDoc(collection(db, "Products"), {
      ...form,
      price: Number(form.price),
      image: imageUrl || "",
    });
    setSuccess("Product added!");
    setForm({name:"",price:"",tag:"",category:"Bone Straight",short:"",detail:"",bg:"#111111"});
    setImageFile(null);
    setImagePreview("");
    fetchProducts();
    setLoading(false);
    setTimeout(() => setSuccess(""), 3000);
  };

  const deleteProduct = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    await deleteDoc(doc(db, "Products", id));
    fetchProducts();
  };

  const addPromo = async () => {
    if (!promoForm.code || !promoForm.discount) { alert("Code and discount are required!"); return; }
    if (isNaN(promoForm.discount) || Number(promoForm.discount) <= 0 || Number(promoForm.discount) > 100) {
      alert("Discount must be a number between 1 and 100!"); return;
    }
    setPromoLoading(true);
    await addDoc(collection(db, "PromoCodes"), {
      code: promoForm.code.toUpperCase().trim(),
      discount: Number(promoForm.discount),
    });
    setPromoSuccess("Promo code added!");
    setPromoForm({code:"",discount:""});
    fetchPromos();
    setPromoLoading(false);
    setTimeout(() => setPromoSuccess(""), 3000);
  };

  const deletePromo = async (id) => {
    if (!window.confirm("Deactivate this promo code?")) return;
    await deleteDoc(doc(db, "PromoCodes", id));
    fetchPromos();
  };

  const inputStyle = {width:"100%",background:"#111",border:"1px solid #2a2a2a",color:"#f0e6d3",fontFamily:"Montserrat,sans-serif",fontSize:13,padding:"13px 16px",outline:"none",marginBottom:12,boxSizing:"border-box"};

  if (!authed) return (
    <div style={{minHeight:"100vh",background:"#080808",display:"flex",alignItems:"center",justifyContent:"center",padding:20}}>
      <div style={{background:"#0f0f0f",border:"1px solid #2a2a2a",padding:"40px 32px",maxWidth:360,width:"100%"}}>
        <h2 style={{fontFamily:"'Cormorant Garamond',serif",color:"#b8924a",fontSize:28,marginBottom:24,textAlign:"center"}}>Admin Access</h2>
        <input type="password" placeholder="Enter password" value={password} onChange={e=>setPassword(e.target.value)} style={inputStyle} />
        <button onClick={login} style={{width:"100%",background:"linear-gradient(135deg,#b8924a,#e8c97a,#b8924a)",color:"#0d0d0d",border:"none",padding:"14px 0",cursor:"pointer",fontFamily:"Montserrat,sans-serif",fontWeight:600,letterSpacing:3,textTransform:"uppercase"}}>
          Login
        </button>
      </div>
    </div>
  );

  return (
    <div style={{minHeight:"100vh",background:"#080808",padding:"40px 5%",color:"#f0e6d3",fontFamily:"Montserrat,sans-serif"}}>
      <h1 style={{fontFamily:"'Cormorant Garamond',serif",color:"#b8924a",fontSize:32,marginBottom:32}}>Admin Dashboard</h1>

      {/* Add Product Form */}
      <div style={{background:"#0f0f0f",border:"1px solid #2a2a2a",padding:"24px",marginBottom:40,maxWidth:600}}>
        <h2 style={{fontSize:14,letterSpacing:3,color:"#b8924a",marginBottom:20,textTransform:"uppercase"}}>Add New Product</h2>
        {success && <p style={{color:"#b8924a",marginBottom:12,fontSize:13}}>{success}</p>}

        {[["name","Product Name"],["price","Price (numbers only)"],["tag","Tag (e.g. NEW IN)"],["short","Short description"],["detail","Full description"],["bg","Background color (e.g. #141414)"]].map(([key,placeholder]) => (
          <input key={key} placeholder={placeholder} value={form[key]} onChange={e=>setForm({...form,[key]:e.target.value})} style={inputStyle} />
        ))}

        <select value={form.category} onChange={e=>setForm({...form,category:e.target.value})}
          style={{...inputStyle, marginBottom:16}}>
          {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>

        <p style={{fontSize:10,letterSpacing:3,color:"#b8924a",textTransform:"uppercase",marginBottom:8}}>Product Image</p>
        <input type="file" accept="image/*" onChange={handleImageChange}
          style={{width:"100%",background:"#111",border:"1px solid #2a2a2a",color:"#6a5a48",fontFamily:"Montserrat,sans-serif",fontSize:12,padding:"10px 16px",marginBottom:12,boxSizing:"border-box",cursor:"pointer"}} />

        {imagePreview && (
          <img src={imagePreview} alt="preview"
            style={{width:"100%",height:180,objectFit:"cover",border:"1px solid #2a2a2a",marginBottom:16}} />
        )}

        <button onClick={addProduct} disabled={loading || uploading}
          style={{background:"linear-gradient(135deg,#b8924a,#e8c97a,#b8924a)",color:"#0d0d0d",border:"none",padding:"14px 28px",cursor:"pointer",fontFamily:"Montserrat,sans-serif",fontWeight:600,letterSpacing:3,textTransform:"uppercase"}}>
          {uploading ? "Uploading Image..." : loading ? "Adding..." : "Add Product ✦"}
        </button>
      </div>

      {/* Promo Codes Section */}
      <div style={{background:"#0f0f0f",border:"1px solid #2a2a2a",padding:"24px",marginBottom:40,maxWidth:600}}>
        <h2 style={{fontSize:14,letterSpacing:3,color:"#b8924a",marginBottom:20,textTransform:"uppercase"}}>Promo Codes</h2>
        {promoSuccess && <p style={{color:"#b8924a",marginBottom:12,fontSize:13}}>{promoSuccess}</p>}

        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:12}}>
          <input placeholder="Code (e.g. FYB25)" value={promoForm.code}
            onChange={e=>setPromoForm({...promoForm,code:e.target.value.toUpperCase()})}
            style={{...inputStyle,marginBottom:0}} />
          <input placeholder="Discount % (e.g. 25)" value={promoForm.discount}
            onChange={e=>setPromoForm({...promoForm,discount:e.target.value})}
            style={{...inputStyle,marginBottom:0}} />
        </div>

        <button onClick={addPromo} disabled={promoLoading}
          style={{background:"linear-gradient(135deg,#b8924a,#e8c97a,#b8924a)",color:"#0d0d0d",border:"none",padding:"12px 24px",cursor:"pointer",fontFamily:"Montserrat,sans-serif",fontWeight:600,letterSpacing:3,textTransform:"uppercase",marginBottom:20}}>
          {promoLoading ? "Adding..." : "Add Promo Code ✦"}
        </button>

        {/* Active Promos List */}
        {promos.length === 0 ? (
          <p style={{fontSize:12,color:"#4a3a28",letterSpacing:1}}>No active promo codes.</p>
        ) : (
          <>
            <p style={{fontSize:10,letterSpacing:3,color:"#6a5a48",textTransform:"uppercase",marginBottom:12}}>Active Codes</p>
            {promos.map(p => (
              <div key={p.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",background:"#111",border:"1px solid #1c1c1c",padding:"12px 16px",marginBottom:8}}>
                <div>
                  <span style={{fontSize:14,color:"#b8924a",fontWeight:600,letterSpacing:2}}>{p.code}</span>
                  <span style={{fontSize:11,color:"#6a5a48",marginLeft:12}}>{p.discount}% off</span>
                </div>
                <button onClick={() => deletePromo(p.id)}
                  style={{background:"transparent",border:"1px solid #c0392b",color:"#c0392b",padding:"4px 12px",cursor:"pointer",fontFamily:"Montserrat,sans-serif",fontSize:10,letterSpacing:2,textTransform:"uppercase"}}>
                  Deactivate
                </button>
              </div>
            ))}
          </>
        )}
      </div>

      {/* Products List */}
      <h2 style={{fontSize:14,letterSpacing:3,color:"#b8924a",marginBottom:20,textTransform:"uppercase"}}>All Products ({products.length})</h2>
      {products.map(p => (
        <div key={p.id} style={{background:"#0f0f0f",border:"1px solid #1c1c1c",padding:"16px",marginBottom:12,display:"flex",justifyContent:"space-between",alignItems:"center",gap:12}}>
          <div style={{display:"flex",alignItems:"center",gap:14}}>
            {p.image
              ? <img src={p.image} alt={p.name} style={{width:52,height:52,objectFit:"cover",border:"1px solid #2a2a2a",flexShrink:0}} />
              : <div style={{width:52,height:52,background:p.bg||"#111",border:"1px solid #2a2a2a",flexShrink:0}} />
            }
            <div>
              <p style={{fontFamily:"'Cormorant Garamond',serif",fontSize:18,color:"#f0e6d3"}}>{p.name}</p>
              <p style={{fontSize:11,color:"#6a5a48"}}>₦{p.price?.toLocaleString()} · {p.category} · {p.tag}</p>
            </div>
          </div>
          <button onClick={() => deleteProduct(p.id)}
            style={{background:"transparent",border:"1px solid #c0392b",color:"#c0392b",padding:"6px 14px",cursor:"pointer",fontFamily:"Montserrat,sans-serif",fontSize:10,letterSpacing:2,textTransform:"uppercase",flexShrink:0}}>
            Delete
          </button>
        </div>
      ))}
    </div>
  );
            }
