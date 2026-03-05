"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    ResponsiveDialog,
    ResponsiveDialogTrigger,
    ResponsiveDialogContent,
    ResponsiveDialogHeader,
    ResponsiveDialogTitle,
    ResponsiveDialogDescription,
    ResponsiveDialogFooter,
    ResponsiveDialogClose,
} from "@/components/ui/responsive-dialog";
import { deleteAccount } from "@/actions/profile-actions";
import { toast } from "sonner";
import { Trash2, Loader2 } from "lucide-react";

export function DeleteAccountSection() {
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async () => {
        try {
            setIsDeleting(true);
            await deleteAccount();
            // Redirection handled by server action via signOut
        } catch (error) {
            toast.error("Erro ao excluir conta. Tente novamente.");
            setIsDeleting(false);
        }
    };

    return (
        <ResponsiveDialog>
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="flex items-start gap-3 flex-1">
                    <Trash2 className="size-5 text-destructive mt-0.5 shrink-0" />
                    <div>
                        <p className="text-sm font-medium">Excluir Conta</p>
                        <p className="text-sm text-muted-foreground mt-0.5">
                            Remove permanentemente todos os seus dados. Esta ação não pode ser desfeita.
                        </p>
                    </div>
                </div>
                <ResponsiveDialogTrigger asChild>
                    <Button variant="destructive" size="sm" className="shrink-0 sm:self-center">
                        Excluir conta
                    </Button>
                </ResponsiveDialogTrigger>
            <ResponsiveDialogContent>
                <ResponsiveDialogHeader>
                    <ResponsiveDialogTitle className="text-destructive flex items-center gap-2">
                        <Trash2 className="w-5 h-5" />
                        Você tem certeza absoluta?
                    </ResponsiveDialogTitle>
                    <ResponsiveDialogDescription>
                        Esta ação não pode ser desfeita. Isso excluirá permanentemente sua
                        conta e removerá seus dados de nossos servidores.
                    </ResponsiveDialogDescription>
                </ResponsiveDialogHeader>
                <ResponsiveDialogFooter>
                    <ResponsiveDialogClose asChild>
                        <Button variant="outline" disabled={isDeleting}>Cancelar</Button>
                    </ResponsiveDialogClose>
                    <Button
                        variant="destructive"
                        onClick={handleDelete}
                        disabled={isDeleting}
                    >
                        {isDeleting ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Excluindo...
                            </>
                        ) : (
                            "Sim, excluir minha conta"
                        )}
                    </Button>
                </ResponsiveDialogFooter>
            </ResponsiveDialogContent>
            </div>
        </ResponsiveDialog>
    );
}
