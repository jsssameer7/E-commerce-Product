import React, { useState } from 'react';
import { Bot, X, Send, Sparkles, LoaderCircle } from 'lucide-react';
import { api } from '../lib/api';

export const ShoppingAssistant: React.FC = () => {
  const [open,setOpen]=useState(false);
  const [question,setQuestion]=useState('');
  const [loading,setLoading]=useState(false);
  const [answer,setAnswer]=useState('');
  const [products,setProducts]=useState<Array<{id:string;name:string;brand:string;price:number;rating:number;image:string;reason:string}>>([]);
  const [error,setError]=useState('');
  async function ask(e:React.FormEvent){
    e.preventDefault(); if(!question.trim()||loading)return;
    setLoading(true);setError('');
    try { const result=await api.assistant(question.trim());setAnswer(result.answer);setProducts(result.products); }
    catch { setError('Could not reach the assistant API. Start the Express server and seed the MongoDB catalog.'); }
    finally { setLoading(false); }
  }
  return <>
    <button className="assistant-launcher" onClick={()=>setOpen(v=>!v)} aria-label="Open AI shopping assistant">
      {open?<X size={21}/>:<Bot size={21}/>}<span>{open?'Close':'AI Assistant'}</span>
    </button>
    {open&&<section className="assistant-panel" aria-label="AI shopping assistant">
      <header className="assistant-header"><div className="assistant-icon"><Sparkles size={19}/></div><div><strong>ElectroGuide</strong><p>Catalog-based shopping helper</p></div><button onClick={()=>setOpen(false)} aria-label="Close assistant"><X size={18}/></button></header>
      <div className="assistant-content">
        <p className="assistant-intro">Tell me what you need, your budget, and how you plan to use it. I'll suggest matches from the current catalog.</p>
        {answer&&<div className="assistant-answer">{answer}</div>}
        {products.map(p=><article className="assistant-product" key={p.id}>{p.image&&<img src={p.image} alt="" loading="lazy"/>}<div><strong>{p.name}</strong><p>{p.brand} · ★ {p.rating}</p><b>₹{p.price.toLocaleString('en-IN')}</b><small>{p.reason}</small></div></article>)}
        {error&&<p className="assistant-error" role="alert">{error}</p>}
      </div>
      <form className="assistant-form" onSubmit={ask}><input value={question} onChange={e=>setQuestion(e.target.value)} maxLength={500} placeholder="e.g. laptop for coding under ₹60000" aria-label="Describe what you need"/><button disabled={loading||!question.trim()} aria-label="Ask assistant">{loading?<LoaderCircle className="spin" size={18}/>:<Send size={18}/>}</button></form>
      <p className="assistant-disclaimer">Suggestions use catalog data, not an external AI model. Verify specifications before purchase.</p>
    </section>}
  </>;
};
