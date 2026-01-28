"use client";

import { updateUserName } from "@/actions/actions";
import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";

const updateUserSchema = z.object({
	name: z.string().min(2, "Name should be at least 2 characters long"),
});

type UpdateUserSchema = z.infer<typeof updateUserSchema>;

type SetupFormProps = {
	userId?: string;
	name?: string;
};

export default function SetupForm({ name, userId }: SetupFormProps) {
	const router = useRouter();

	const form = useForm<UpdateUserSchema>({
		resolver: zodResolver(updateUserSchema),
		defaultValues: {
			name: name ?? "",
		},
		reValidateMode: "onSubmit",
	});

	const onSubmit = async (data: UpdateUserSchema) => {
		const { name } = data;

		if (!userId || !name) {
			return;
		}

		await updateUserName({
			name,
			userId,
		});

		router.replace("/app/dashboard");
	};

	const isSubmitting = form.formState.isSubmitting;

	return (
		<Form {...form}>
			<form
				id="update-user"
				onSubmit={form.handleSubmit(onSubmit)}
				className="space-y-8"
			>
				<FormField
					control={form.control}
					name="name"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Full name</FormLabel>
							<FormControl>
								<Input placeholder="John Doe" {...field} />
							</FormControl>
							<FormDescription>
								This is your first and last name.
							</FormDescription>
							{form.formState.errors.name && (
								<FormMessage>{form.formState.errors.name?.message}</FormMessage>
							)}
						</FormItem>
					)}
				/>

				{/* <Button form="update-user" type="submit" className="w-full">
          <span>Save</span>
        </Button> */}
				<Button type="submit" className="w-full" disabled={isSubmitting}>
					{isSubmitting ? (
						<Loader2 className="h-4 w-4 animate-spin" />
					) : (
						<span>Save</span>
					)}
				</Button>
			</form>
		</Form>
	);
}
