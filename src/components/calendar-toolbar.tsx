"use client";

import QuickAddTodayButton from "@/components/quick-add-today-button";
import H2 from "@/components/h2";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreVertical, Trash2 } from "lucide-react";
import { DeleteProgressDialog } from "@/components/delete-progress-dialog";

export default function CalendarToolbar() {
	return (
		<div className="flex items-center justify-between lg:justify-end pt-2 pb-4">
			<div className="lg:hidden">
				<H2>Calendário</H2>
			</div>
			<div className="flex items-center gap-2">
				<QuickAddTodayButton />

				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant="ghost" size="icon" className="h-9 w-9">
							<MoreVertical className="h-4 w-4" />
							<span className="sr-only">Mais opções</span>
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end">
						<DeleteProgressDialog>
							<DropdownMenuItem
								onSelect={(e) => e.preventDefault()}
								className="text-destructive focus:text-destructive cursor-pointer"
							>
								<Trash2 className="mr-2 h-4 w-4" />
								Excluir Progresso
							</DropdownMenuItem>
						</DeleteProgressDialog>
					</DropdownMenuContent>
				</DropdownMenu>
			</div>
		</div>
	);
}
