"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  ResponsiveDialog,
  ResponsiveDialogContent,
  ResponsiveDialogFooter,
  ResponsiveDialogHeader,
  ResponsiveDialogTitle,
  ResponsiveDialogTrigger,
} from "@/components/ui/responsive-dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  updateGroupSettings,
  regenerateInviteCode,
  deleteGroup,
} from "@/actions/group-actions";
import { toast } from "sonner";
import { Settings, RefreshCw, Trash2 } from "lucide-react";

interface Props {
  groupId: string;
  currentName: string;
  currentDescription: string | null;
  currentEndDate: Date;
  isActive: boolean;
  allowRetroactiveWorkouts: boolean;
}

export function GroupSettingsDialog({
  groupId,
  currentName,
  currentDescription,
  currentEndDate,
  isActive,
  allowRetroactiveWorkouts,
}: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState(currentDescription ?? "");
  const [endDate, setEndDate] = useState<Date>(() => new Date(currentEndDate));
  const [retroActive, setRetroActive] = useState(allowRetroactiveWorkouts);
  const [isPending, startTransition] = useTransition();

  function handleOpenChange(value: boolean) {
    if (value) {
      setName(currentName);
      setDescription(currentDescription ?? "");
      setEndDate(new Date(currentEndDate));
      setRetroActive(allowRetroactiveWorkouts);
    }
    setOpen(value);
  }

  const isDirty =
    name.trim() !== currentName ||
    description.trim() !== (currentDescription ?? "") ||
    endDate.toDateString() !== new Date(currentEndDate).toDateString() ||
    retroActive !== allowRetroactiveWorkouts;

  function handleSave() {
    startTransition(async () => {
      const res = await updateGroupSettings(groupId, {
        name,
        description,
        endDate,
        allowRetroactiveWorkouts: retroActive,
      });
      if (res.error) {
        toast.error(res.error);
        return;
      }
      if (res.endDateChanged) {
        toast.success(
          "Configurações atualizadas — os membros foram notificados sobre a nova data final",
        );
      } else {
        toast.success("Configurações atualizadas");
      }
      setOpen(false);
    });
  }

  function handleCancel() {
    setOpen(false);
  }

  function handleRegenerateCode() {
    startTransition(async () => {
      try {
        await regenerateInviteCode(groupId);
        toast.success(
          "Link de convite regenerado — o link antigo não funciona mais",
        );
      } catch {
        toast.error("Falha ao gerar novo link de convite");
      }
    });
  }

  function handleDelete() {
    startTransition(async () => {
      try {
        await deleteGroup(groupId);
        toast.success("Grupo excluído");
        setOpen(false);
        router.push("/app/groups");
      } catch {
        toast.error("Falha ao excluir grupo");
      }
    });
  }

  return (
    <ResponsiveDialog open={open} onOpenChange={handleOpenChange}>
      <ResponsiveDialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Settings className="size-4" />
          Configurações
        </Button>
      </ResponsiveDialogTrigger>
      <ResponsiveDialogContent className="sm:max-w-lg">
        <ResponsiveDialogHeader>
          <ResponsiveDialogTitle>Configurações do Grupo</ResponsiveDialogTitle>
        </ResponsiveDialogHeader>

        <ScrollArea className="max-h-[60vh]">
        <div className="flex flex-col gap-5 p-4 pt-2">
          <div className="flex flex-col gap-2">
            <Label htmlFor="group-name-edit">Nome do grupo</Label>
            <Input
              id="group-name-edit"
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={60}
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="group-description-edit">Descrição (opcional)</Label>
            <Textarea
              id="group-description-edit"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              maxLength={280}
              rows={3}
              placeholder="Regras, objetivo, motivação…"
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label>Data final</Label>
            <Calendar
              mode="single"
              selected={endDate}
              onSelect={(d) => {
                if (d) setEndDate(d);
              }}
              disabled={(d) => d <= new Date()}
              className="rounded-md border self-center"
              style={{ '--cell-size': '2.5rem' } as React.CSSProperties}
            />
            <p className="text-xs text-muted-foreground">
              Todos os membros serão notificados quando você alterar isso.
            </p>
          </div>

          <div className="flex items-center justify-between gap-4 py-2">
            <div>
              <p className="text-sm font-medium">Treinos retroativos</p>
              <p className="text-xs text-muted-foreground">
                Permite contar treinos registrados após a data do treino
              </p>
            </div>
            <Switch checked={retroActive} onCheckedChange={setRetroActive} />
          </div>

          {isActive && (
            <>
              <Separator />
              <div className="flex flex-col gap-2">
                <Label>Link de convite</Label>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2 self-start"
                  onClick={handleRegenerateCode}
                  disabled={isPending}
                >
                  <RefreshCw className="size-4" />
                  Gerar novo link de convite
                </Button>
                <p className="text-xs text-muted-foreground">
                  O link antigo vai parar de funcionar imediatamente.
                </p>
              </div>
            </>
          )}

          <Separator />

          <div className="flex flex-col gap-2">
            <Label className="text-destructive">Zona de perigo</Label>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="destructive"
                  size="sm"
                  className="gap-2 self-start"
                >
                  <Trash2 className="size-4" />
                  Excluir grupo
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Excluir "{currentName}"?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Isso vai excluir permanentemente o grupo e remover todos os
                    membros. Essa ação não pode ser desfeita.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDelete}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    Excluir
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
        </ScrollArea>

        <ResponsiveDialogFooter className="flex-col-reverse border-t p-4">
          <Button variant="outline" onClick={handleCancel} disabled={isPending}>
            Cancelar
          </Button>
          <Button onClick={handleSave} disabled={!isDirty || isPending}>
            Salvar
          </Button>
        </ResponsiveDialogFooter>
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  );
}
