import { useMemo, useState } from "react";
import { AccountInfo } from "@/components/AccountInfo";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

type Tx = { id: string; method: "cash"|"momo"|"bank"; amount: number };
const SAMPLE: Tx[] = [
  { id: "t1", method: "cash", amount: 500000 },
  { id: "t2", method: "momo", amount: 320000 },
  { id: "t3", method: "bank", amount: 880000 },
];

type Product = { id: string; name: string; plan: number; visible: boolean };
const INITIAL: Product[] = [
  { id: "p1", name: "Beef Pho", plan: 50, visible: true },
  { id: "p2", name: "Vegan Salad", plan: 40, visible: true },
  { id: "p3", name: "Ramen Spicy", plan: 30, visible: false },
];

export default function Manager(){
  const [txs] = useState<Tx[]>(SAMPLE);
  const [items, setItems] = useState<Product[]>(INITIAL);
  const [accName, setAccName] = useState("");
  const totals = useMemo(()=> ({
    cash: txs.filter(t=>t.method==='cash').reduce((s,t)=>s+t.amount,0),
    momo: txs.filter(t=>t.method==='momo').reduce((s,t)=>s+t.amount,0),
    bank: txs.filter(t=>t.method==='bank').reduce((s,t)=>s+t.amount,0),
  }),[txs]);
  const grand = totals.cash + totals.momo + totals.bank;

  return (
    <div className="container py-8">
      <AccountInfo />
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>Report doanh thu ngày</CardTitle></CardHeader>
          <CardContent className="grid gap-2 text-sm">
            <div>Tiền mặt: <b>{totals.cash.toLocaleString()}₫</b></div>
            <div>MoMo: <b>{totals.momo.toLocaleString()}₫</b></div>
            <div>Ngân hàng: <b>{totals.bank.toLocaleString()}₫</b></div>
            <div className="pt-2 border-t">Tổng kết ca: <b>{grand.toLocaleString()}₫</b></div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Product Management</CardTitle></CardHeader>
          <CardContent className="grid gap-3">
            {items.map((p,i)=> (
              <div key={p.id} className="flex items-center justify-between gap-3 rounded-md border p-3">
                <div>
                  <div className="font-medium">{p.name}</div>
                  <div className="text-xs text-muted-foreground">Kế hoạch bán trong ngày</div>
                </div>
                <div className="flex items-center gap-2">
                  <Input value={p.plan} onChange={(e)=>{
                    const v = parseInt(e.target.value||"0");
                    const next=[...items]; next[i] = { ...p, plan: Number.isNaN(v)?0:v }; setItems(next);
                  }} className="w-20"/>
                  <Button variant={p.visible?"secondary":"outline"} onClick={()=>{ const next=[...items]; next[i] = { ...p, visible: !p.visible }; setItems(next); }}>
                    {p.visible?"Đang bán":"Ẩn"}
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>CRUD tài khoản (đơn giản)</CardTitle></CardHeader>
          <CardContent className="flex gap-2">
            <Input placeholder="Tên tài khoản" value={accName} onChange={(e)=>setAccName(e.target.value)} />
            <Button onClick={()=> setAccName("")}>Thêm (mock)</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
