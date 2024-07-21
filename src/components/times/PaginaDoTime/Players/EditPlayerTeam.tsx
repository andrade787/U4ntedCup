import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Switch } from "@/components/ui/switch"
import { Edit } from "lucide-react"

export function EditPlayerTeam() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button className="flex items-center gap-1 mr-2"><Edit size={18} /> Editar Player</Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Edite seu player</SheetTitle>
          <SheetDescription>
            Faça alterações do seu player aqui.
          </SheetDescription>
        </SheetHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="nick" className="text-right">
              Nick
            </Label>
            <Input id="nick" disabled value="Pedro Duarte" className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="nick" className="text-right">
              6° Player
            </Label>
            <Switch id="airplane-mode" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="nick" className="text-right">
              IGL
            </Label>
            <Switch id="airplane-mode" />
          </div>
        </div>
        <SheetFooter>
          <SheetClose asChild>
            <Button type="submit">Salvar Alterações</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
