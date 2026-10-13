const API_BASE = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api').replace(/\/$/, '');

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) { super(message); this.name = 'ApiError'; this.status = status; }
}
async function request<T>(path: string, options: RequestInit = {}, token?: string): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  });
  const body = response.status === 204 ? null : await response.json().catch(() => ({}));
  if (!response.ok) throw new ApiError(body?.error || `Request failed (${response.status})`, response.status);
  return body as T;
}
export const api = {
  register: (input: {name:string;email:string;password:string}) => request<{token:string;user:{id:string;name:string;email:string;role:'customer'|'admin'}}>('/auth/register',{method:'POST',body:JSON.stringify(input)}),
  login: (input: {email:string;password:string}) => request<{token:string;user:{id:string;name:string;email:string;role:'customer'|'admin'}}>('/auth/login',{method:'POST',body:JSON.stringify(input)}),
  me: (token:string) => request<{user:{id:string;name:string;email:string;role:'customer'|'admin'}}>('/auth/me',{},token),
  products: (params = '') => request<{items:unknown[];total:number}>(`/products${params ? `?${params}` : ''}`),
  createProduct: (token:string, product:unknown) => request('/products',{method:'POST',body:JSON.stringify(product)},token),
  updateProduct: (token:string, id:string, patch:unknown) => request(`/products/${encodeURIComponent(id)}`,{method:'PATCH',body:JSON.stringify(patch)},token),
  assistant: (question:string) => request<{answer:string;mode:string;products:Array<{id:string;name:string;brand:string;price:number;rating:number;image:string;reason:string}>}>('/insights/assistant',{method:'POST',body:JSON.stringify({question})}),
  priceHistory: (productId:string) => request<{items:Array<{price:number;recordedAt:string}>}>(`/insights/prices/${encodeURIComponent(productId)}`),
  createPriceAlert: (token:string, productId:string, targetPrice:number) => request('/insights/alerts',{method:'POST',body:JSON.stringify({productId,targetPrice})},token),
  myPriceAlerts: (token:string) => request('/insights/alerts/mine',{},token),
  createCheckout: (token:string, input:unknown) => request('/orders/checkout',{method:'POST',body:JSON.stringify(input)},token),
  verifyPayment: (token:string, orderId:string, payment:unknown) => request(`/orders/${encodeURIComponent(orderId)}/verify-payment`,{method:'POST',body:JSON.stringify(payment)},token),
  myOrders: (token:string) => request<{items:unknown[]}>('/orders/mine',{},token),
};
