"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Loader2, Trash2 } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
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
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { deleteProgressInRange } from "@/actions/actions";
import type { DateRange } from "react-day-picker";
import { toast } from "sonner";
import { ReactNode } from "react";

interface DeleteProgressDialogProps {
    children: ReactNode;
}

export function DeleteProgressDialog({ children }: DeleteProgressDialogProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [dateRange, setDateRange] = useState<DateRange | undefined>();
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async () => {
        if (!dateRange?.from) return;

        try {
            setIsDeleting(true);
            await deleteProgressInRange(dateRange.from, dateRange.to ?? dateRange.from);
            toast.success("Progresso excluído com sucesso!");
            setDateRange(undefined);
            setIsOpen(false);
        } catch (error) {
            toast.error("Erro ao excluir progresso. Tente novamente.");
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Trash2 className="w-5 h-5 text-destructive" />
                        Excluir Progresso
                    </DialogTitle>
                    <DialogDescription>
                        Selecione um intervalo de datas para excluir todos os treinos e refeições livres{" "}
                        <span className="font-semibold text-foreground">
                            dentro desse período
                        </span>{" "}
                        (inclusive).
                    </DialogDescription>
                </DialogHeader>

                <div className="flex flex-col gap-6 py-4">
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium">Selecionar Intervalo de Datas</label>
                        <Calendar
                            mode="range"
                            selected={dateRange}
                            onSelect={setDateRange}
                            locale={ptBR}
                            className="rounded-md border text-sm"
                            style={{ "--cell-size": "2.25rem" } as React.CSSProperties}
                        />
                    </div>

                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button
                                variant="destructive"
                                disabled={!dateRange?.from || isDeleting}
                                className="w-full"
                            >
                                {isDeleting ? (
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                ) : (
                                    <Trash2 className="h-4 w-4 mr-2" />
                                )}
                                {isDeleting ? "Excluindo..." : "Excluir Progresso"}
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Excluir Progresso</AlertDialogTitle>
                                <AlertDialogDescription>
                                    Tem certeza que deseja excluir todos os seus registros de treinos e
                                    refeições livres de{" "}
                                    <span className="font-semibold text-foreground">
                                        {dateRange?.from ? format(dateRange.from, "PPP", { locale: ptBR }) : ""}
                                    </span>
                                    {" "}até{" "}
                                    <span className="font-semibold text-foreground">
                                        {dateRange ? format(dateRange.to ?? dateRange.from!, "PPP", { locale: ptBR }) : ""}
                                    </span>
                                    ? Esta ação não pode ser desfeita.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel disabled={isDeleting}>Cancelar</AlertDialogCancel>
                                <AlertDialogAction
                                    onClick={handleDelete}
                                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                    disabled={isDeleting}
                                >
                                    Sim, excluir dados
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
            </DialogContent>
        </Dialog>
    );
}
