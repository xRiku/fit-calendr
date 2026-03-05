"use client";

import { useState } from "react";
import { useWebHaptics } from "web-haptics/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Copy, Check } from "lucide-react";

export function CopyInviteButton({ inviteUrl }: { inviteUrl: string }) {
	const [copied, setCopied] = useState(false);
	const haptic = useWebHaptics();

	async function handleCopy() {
		await navigator.clipboard.writeText(inviteUrl);
		haptic.trigger("success");
		setCopied(true);
		setTimeout(() => setCopied(false), 2000);
	}

	return (
		<div className="flex gap-2 items-center">
			<Input
				value={inviteUrl}
				readOnly
				className="text-xs text-muted-foreground"
			/>
			<Button
				variant="outline"
				size="sm"
				onClick={handleCopy}
				className="shrink-0 gap-2"
			>
				{copied ? (
					<Check className="size-4 text-vibrant-green" />
				) : (
					<Copy className="size-4" />
				)}
				{copied ? "Copiado" : "Copiar"}
			</Button>
		</div>
	);
}
