import { S3Client } from "@aws-sdk/client-s3";
import { env } from "@/env";

function createR2Client() {
	if (
		!env.R2_ACCOUNT_ID ||
		!env.R2_ACCESS_KEY_ID ||
		!env.R2_SECRET_ACCESS_KEY
	) {
		return null;
	}
	return new S3Client({
		region: "auto",
		endpoint: `https://${env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
		credentials: {
			accessKeyId: env.R2_ACCESS_KEY_ID,
			secretAccessKey: env.R2_SECRET_ACCESS_KEY,
		},
	});
}

export function getR2() {
	const client = createR2Client();
	if (!client || !env.R2_BUCKET_NAME || !env.R2_PUBLIC_URL) {
		throw new Error("R2 is not configured. Set R2_* environment variables.");
	}
	return { client, bucket: env.R2_BUCKET_NAME, publicUrl: env.R2_PUBLIC_URL };
}
