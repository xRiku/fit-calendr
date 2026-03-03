"use client";

import { useEffect } from "react";
import { toast } from "sonner";
import {
	getUnreadGroupNotifications,
	markNotificationsRead,
} from "@/actions/group-actions";

export function GroupNotificationWatcher() {
	useEffect(() => {
		let cancelled = false;

		async function checkNotifications() {
			const notifications = await getUnreadGroupNotifications();
			if (cancelled || notifications.length === 0) return;

			for (const n of notifications) {
				toast(n.message, { duration: 6000 });
			}

			await markNotificationsRead(notifications.map((n) => n.id));
		}

		checkNotifications();
		return () => {
			cancelled = true;
		};
	}, []);

	return null;
}
