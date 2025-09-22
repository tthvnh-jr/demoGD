import { useState } from "react";
import { AccountInfo } from "@/components/AccountInfo";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Item = { id: string; table: string; name: string; note?: string; status: "ordered"|"cooking"|"done" };
const INITIAL: Item[] = [
  { id: "1", table: "A1", name: "Beef Pho", note: "ít hành", status: "ordered" },
  { id: "2", table: "B3", name: "Ramen", note: "spicy", status: "ordered" },
];

export default function Chef(){
  const [list, setList] = useState<Item[]>(INITIAL);
  const next = (s: Item["status"]) => (s === "ordered" ? "cooking" : s === "cooking" ? "done" : "done");

  return (
    <div className="container py-8">
      <AccountInfo />
      <Card>
        <CardHeader><CardTitle>Hàng chờ món</CardTitle></CardHeader>
        <CardContent className="grid gap-3">
          {list.map((it,i)=> (
            <div key={it.id} className="flex items-center justify-between rounded-md border p-3">
              <div>
                <div className="font-medium">Bàn {it.table} — {it.name}</div>
                {it.note && <div className="text-xs text-muted-foreground">Ghi chú: {it.note}</div>}
              </div>
              <Button
                style={{ backgroundColor: it.status==='cooking'? '#f59e0b' : undefined }}
                variant={it.status==='ordered'? 'secondary' : 'default'}
                onClick={()=>{ const copy=[...list]; copy[i]={...it, status: next(it.status)}; setList(copy); }}
              >
                {it.status==='ordered' ? 'Bắt đầu nấu' : it.status==='cooking' ? 'Hoàn thành' : 'Hoàn thành'}
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
