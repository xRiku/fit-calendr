"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Camera, Loader2, Trash2 } from "lucide-react";
import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

type AvatarUploadProps = {
	avatarUrl: string | null;
	name: string;
	initials: string;
};

export function AvatarUpload({ avatarUrl, name, initials }: AvatarUploadProps) {
	const inputRef = useRef<HTMLInputElement>(null);
	const [preview, setPreview] = useState<string | null>(null);
	const [isPending, startTransition] = useTransition();
	const router = useRouter();

	const displayUrl = preview ?? avatarUrl;

	function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
		const file = e.target.files?.[0];
		if (!file) return;

		if (file.size > 5 * 1024 * 1024) {
			toast.error("File too large (max 5MB)");
			return;
		}

		const objectUrl = URL.createObjectURL(file);
		setPreview(objectUrl);

		startTransition(async () => {
			const formData = new FormData();
			formData.append("file", file);

			const res = await fetch("/api/avatar", {
				method: "POST",
				body: formData,
			});

			if (!res.ok) {
				const data = await res.json();
				toast.error(data.error ?? "Upload failed");
				setPreview(null);
				return;
			}

			toast.success("Avatar updated");
			router.refresh();
		});
	}

	function handleRemove() {
		startTransition(async () => {
			const res = await fetch("/api/avatar", { method: "DELETE" });

			if (!res.ok) {
				toast.error("Failed to remove avatar");
				return;
			}

			setPreview(null);
			toast.success("Avatar removed");
			router.refresh();
		});
	}

	return (
		<div className="flex items-center gap-3">
			<button
				type="button"
				className="relative group cursor-pointer"
				onClick={() => inputRef.current?.click()}
				disabled={isPending}
			>
				<Avatar className="size-12">
					{displayUrl && <AvatarImage src={displayUrl} alt={name} />}
					<AvatarFallback className="bg-neutral-800 text-sm">
						{initials}
					</AvatarFallback>
				</Avatar>
				<div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity">
					{isPending ? (
						<Loader2 className="size-4 animate-spin text-white" />
					) : (
						<Camera className="size-4 text-white" />
					)}
				</div>
			</button>
			<input
				ref={inputRef}
				type="file"
				accept="image/*"
				className="hidden"
				onChange={handleFileChange}
			/>
			{avatarUrl && !isPending && (
				<Button
					variant="ghost"
					size="icon"
					className="size-8 text-muted-foreground hover:text-destructive"
					onClick={handleRemove}
				>
					<Trash2 className="size-3.5" />
				</Button>
			)}
		</div>
	);
}
