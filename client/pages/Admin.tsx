import { useEffect, useState } from "react";
import { AccountInfo } from "@/components/AccountInfo";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export type Account = { id: string; name: string; role: "Admin"|"Manager"|"Chef"|"Staff" };
const KEY = "mossd_accounts";

function load(): Account[] { const raw = localStorage.getItem(KEY); return raw? JSON.parse(raw): []; }
function save(list: Account[]) { localStorage.setItem(KEY, JSON.stringify(list)); }

export default function Admin(){
  const [list, setList] = useState<Account[]>([]);
  const [editing, setEditing] = useState<Account | null>(null);
  const [name, setName] = useState("");
  const [role, setRole] = useState<Account["role"]>("Staff");

  useEffect(()=>{ setList(load()); },[]);

  const upsert = () => {
    if(!name.trim()) return;
    if(editing){
      const next = list.map(a=> a.id===editing.id? { ...a, name, role}: a);
      setList(next); save(next); setEditing(null); setName("");
    } else {
      const next = [...list, { id: crypto.randomUUID(), name: name.trim(), role }];
      setList(next); save(next); setName(""); setRole("Staff");
    }
  };
  const remove = (id: string) => { const next = list.filter(a=>a.id!==id); setList(next); save(next); };

  return (
    <div className="container py-8">
      <AccountInfo />
      <Card>
        <CardHeader><CardTitle>Quản lý tài khoản (Admin)</CardTitle></CardHeader>
        <CardContent className="grid gap-4">
          <div className="flex flex-wrap items-end gap-2">
            <div className="grid gap-2">
              <label className="text-sm font-medium">Tên tài khoản</label>
              <Input value={name} onChange={(e)=>setName(e.target.value)} placeholder="Tên" />
            </div>
            <div className="grid gap-2">
              <label className="text-sm font-medium">Quyền</label>
              <select className="rounded-md border px-3 py-2" value={role} onChange={(e)=> setRole(e.target.value as any)}>
                {(["Admin","Manager","Chef","Staff"] as const).map(r=> <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
            <Button onClick={upsert}>{editing? "Cập nhật" : "Thêm"}</Button>
            {editing && <Button variant="ghost" onClick={()=>{setEditing(null); setName("");}}>Hủy</Button>}
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left">
                  <th className="p-2">Tên</th>
                  <th className="p-2">Quyền</th>
                  <th className="p-2 w-40">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {list.map(a=> (
                  <tr key={a.id} className="border-t">
                    <td className="p-2">{a.name}</td>
                    <td className="p-2">{a.role}</td>
                    <td className="p-2 flex gap-2">
                      <Button variant="outline" size="sm" onClick={()=>{setEditing(a); setName(a.name); setRole(a.role);}}>Sửa</Button>
                      <Button variant="destructive" size="sm" onClick={()=>remove(a.id)}>Xóa</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
