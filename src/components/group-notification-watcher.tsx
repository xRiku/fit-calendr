"use client";

import { useEffect, useRef } from "react";
import { toast } from "sonner";
import {
	getUnreadGroupNotifications,
	markNotificationsRead,
} from "@/actions/group-actions";

export function GroupNotificationWatcher() {
	const inFlight = useRef(false);

	useEffect(() => {
		let cancelled = false;

		async function checkNotifications() {
			if (inFlight.current) return;
			inFlight.current = true;

			const notifications = await getUnreadGroupNotifications().catch(() => []);
			inFlight.current = false;
			if (cancelled || notifications.length === 0) return;

			for (const n of notifications) {
				toast(n.message, { duration: 6000 });
			}

			markNotificationsRead(notifications.map((n) => n.id)).catch(() => {});
		}

		checkNotifications();
		return () => {
			cancelled = true;
		};
	}, []);

	return null;
}
