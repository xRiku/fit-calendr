import { auth } from "@/lib/auth";
import prisma from "@/lib/db";
import { getR2 } from "@/lib/r2";
import { PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import sharp from "sharp";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

const MAX_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

export async function POST(request: Request) {
	const session = await auth.api.getSession({ headers: await headers() });
	if (!session) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	const formData = await request.formData();
	const file = formData.get("file") as File | null;

	if (!file) {
		return NextResponse.json({ error: "No file provided" }, { status: 400 });
	}

	if (!ALLOWED_TYPES.includes(file.type)) {
		return NextResponse.json({ error: "Invalid file type" }, { status: 400 });
	}

	if (file.size > MAX_SIZE) {
		return NextResponse.json(
			{ error: "File too large (max 5MB)" },
			{ status: 400 },
		);
	}

	const buffer = Buffer.from(await file.arrayBuffer());
	const webpBuffer = await sharp(buffer)
		.resize(256, 256, { fit: "cover" })
		.webp({ quality: 80 })
		.toBuffer();

	const { client, bucket, publicUrl } = getR2();
	const key = `avatars/${session.user.id}.webp`;

	await client.send(
		new PutObjectCommand({
			Bucket: bucket,
			Key: key,
			Body: webpBuffer,
			ContentType: "image/webp",
		}),
	);

	const avatarUrl = `${publicUrl}/${key}`;

	await prisma.user.update({
		where: { id: session.user.id },
		data: { avatarUrl },
	});

	revalidatePath("/app", "layout");

	return NextResponse.json({ avatarUrl });
}

export async function DELETE() {
	const session = await auth.api.getSession({ headers: await headers() });
	if (!session) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	const { client, bucket } = getR2();
	const key = `avatars/${session.user.id}.webp`;

	await client.send(
		new DeleteObjectCommand({
			Bucket: bucket,
			Key: key,
		}),
	);

	await prisma.user.update({
		where: { id: session.user.id },
		data: { avatarUrl: null },
	});

	revalidatePath("/app", "layout");

	return NextResponse.json({ success: true });
}
