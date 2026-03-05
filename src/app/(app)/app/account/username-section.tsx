"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateUsername } from "@/actions/profile-actions";
import { toast } from "sonner";
import { AtSign } from "lucide-react";

export function UsernameSection({
	currentUsername,
}: { currentUsername: string | null }) {
	const [username, setUsername] = useState(currentUsername ?? "");
	const [isPending, startTransition] = useTransition();

	const isDirty = username.trim().toLowerCase() !== (currentUsername ?? "");

	function handleSave() {
		startTransition(async () => {
			try {
				await updateUsername(username);
				toast.success("Nome de usuário atualizado");
			} catch (err) {
				toast.error(
					err instanceof Error
						? err.message
						: "Falha ao atualizar nome de usuário",
				);
			}
		});
	}

	return (
		<div className="flex flex-col gap-2">
			<Label htmlFor="username">Nome de usuário</Label>
			<div className="flex gap-2">
				<div className="relative flex-1">
					<AtSign className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
					<Input
						id="username"
						value={username}
						onChange={(e) => setUsername(e.target.value.toLowerCase())}
						className="pl-9"
						placeholder="seu-usuario"
						maxLength={30}
					/>
				</div>
				<Button size="sm" onClick={handleSave} disabled={!isDirty || isPending}>
					{isPending ? "Salvando…" : "Salvar"}
				</Button>
			</div>
			<p className="text-xs text-muted-foreground">
				Apenas letras minúsculas, números e hífens. De 3 a 30 caracteres.
			</p>
		</div>
	);
}
