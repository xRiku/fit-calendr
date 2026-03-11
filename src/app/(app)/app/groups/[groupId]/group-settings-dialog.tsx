"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  ResponsiveDialog,
  ResponsiveDialogContent,
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { useMediaQuery } from "@/hooks/use-media-query";
import {
  updateGroupName,
  updateGroupDescription,
  updateGroupEndDate,
  regenerateInviteCode,
  deleteGroup,
  updateGroupAllowRetroactiveWorkouts,
} from "@/actions/group-actions";
import { toast } from "sonner";
import { Settings, CalendarIcon, RefreshCw, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

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
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState(currentDescription ?? "");
  const [endDate, setEndDate] = useState<Date>(() => new Date(currentEndDate));
  const [retroActive, setRetroActive] = useState(allowRetroactiveWorkouts);
  const [isPendingDesc, startDescTransition] = useTransition();

  function handleOpenChange(value: boolean) {
    if (value) {
      setName(currentName);
      setDescription(currentDescription ?? "");
      setEndDate(new Date(currentEndDate));
    }
    setOpen(value);
  }
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [isPendingRetro, startRetroTransition] = useTransition();

  function handleSaveName() {
    if (name.trim() === currentName) return;
    startTransition(async () => {
      try {
        await updateGroupName(groupId, name);
        toast.success("Nome do grupo atualizado");
      } catch {
        toast.error("Falha ao atualizar nome");
      }
    });
  }

  function handleSaveDescription() {
    startDescTransition(async () => {
      const res = await updateGroupDescription(groupId, description);
      if (res.error) {
        toast.error(res.error);
      } else {
        toast.success("Descrição atualizada");
      }
    });
  }

  function handleSaveEndDate() {
    startTransition(async () => {
      try {
        await updateGroupEndDate(groupId, endDate);
        toast.success("Data final atualizada — os membros foram notificados");
      } catch {
        toast.error("Falha ao atualizar data final");
      }
    });
  }

  function handleRetroactiveToggle(value: boolean) {
    setRetroActive(value);
    startRetroTransition(async () => {
      const res = await updateGroupAllowRetroactiveWorkouts(groupId, value);
      if (res.error) {
        setRetroActive(!value);
        toast.error(res.error);
      }
    });
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
      <ResponsiveDialogContent className="sm:max-w-md">
        <ResponsiveDialogHeader>
          <ResponsiveDialogTitle>Configurações do Grupo</ResponsiveDialogTitle>
        </ResponsiveDialogHeader>

        <div className="flex flex-col gap-5 p-4 pt-2">
          <div className="flex flex-col gap-2">
            <Label htmlFor="group-name-edit">Nome do grupo</Label>
            <div className="flex gap-2">
              <Input
                id="group-name-edit"
                value={name}
                onChange={(e) => setName(e.target.value)}
                maxLength={60}
              />
              <Button
                size="sm"
                onClick={handleSaveName}
                disabled={isPending || name.trim() === currentName}
              >
                Salvar
              </Button>
            </div>
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
            <Button
              size="sm"
              onClick={handleSaveDescription}
              disabled={
                isPendingDesc ||
                description.trim() === (currentDescription ?? "")
              }
              className="self-end"
            >
              Salvar descrição
            </Button>
          </div>

          <div className="flex flex-col gap-2">
            <Label>Data final</Label>
            {isDesktop ? (
              <div className="flex gap-2">
                <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn("flex-1 justify-start gap-2 font-normal")}
                    >
                      <CalendarIcon className="size-4" />
                      {format(endDate, "PPP")}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={endDate}
                      onSelect={(d) => {
                        if (d) {
                          setEndDate(d);
                          setCalendarOpen(false);
                        }
                      }}
                      disabled={(d) => d <= new Date()}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <Button
                  size="sm"
                  onClick={handleSaveEndDate}
                  disabled={
                    isPending ||
                    endDate.toDateString() ===
                      new Date(currentEndDate).toDateString()
                  }
                >
                  Salvar
                </Button>
              </div>
            ) : (
              <>
                <Calendar
                  mode="single"
                  selected={endDate}
                  onSelect={(d) => {
                    if (d) setEndDate(d);
                  }}
                  disabled={(d) => d <= new Date()}
                  className="rounded-md border self-center"
                />
                <Button
                  size="sm"
                  onClick={handleSaveEndDate}
                  disabled={
                    isPending ||
                    endDate.toDateString() ===
                      new Date(currentEndDate).toDateString()
                  }
                >
                  Salvar
                </Button>
              </>
            )}
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
            <Switch
              checked={retroActive}
              onCheckedChange={handleRetroactiveToggle}
              disabled={isPendingRetro}
            />
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
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  );
}
