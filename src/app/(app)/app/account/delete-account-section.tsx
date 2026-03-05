"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
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
import { deleteAccount } from "@/actions/profile-actions";
import { toast } from "sonner";
import { AlertCircle, Loader2 } from "lucide-react";

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
        <div className="flex flex-col gap-4">
            <div className="flex items-start gap-4 p-4 border border-destructive/30 bg-destructive/5 rounded-xl">
                <div className="p-2 bg-destructive/10 rounded-full text-destructive">
                    <AlertCircle className="w-5 h-5" />
                </div>
                <div className="flex-1">
                    <h3 className="text-base font-semibold text-destructive">
                        Excluir Conta
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">
                        A exclusão da sua conta remove permanentemente todos os seus dados,
                        incluindo hábitos, grupos e configurações. Esta ação não pode ser
                        desfeita.
                    </p>

                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button variant="destructive" className="mt-4 w-full sm:w-auto">
                                Excluir Conta Permanentemente
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle className="text-destructive flex items-center gap-2">
                                    <AlertCircle className="w-5 h-5" />
                                    Você tem certeza absoluta?
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                    Esta ação não pode ser desfeita. Isso excluirá permanentemente sua
                                    conta e removerá seus dados de nossos servidores.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel disabled={isDeleting}>Cancelar</AlertDialogCancel>
                                <AlertDialogAction
                                    onClick={handleDelete}
                                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
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
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
            </div>
        </div>
    );
}
