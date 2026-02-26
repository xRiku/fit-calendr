import Image from "next/image";

export default function HeaderLogo() {
	return (
		<div className="flex items-center group cursor-pointer selection:bg-transparent transition-transform hover:scale-105 active:scale-95 duration-200">
			<Image
				src="/logo.png"
				alt="FitCalendr Logo"
				width={180}
				height={60}
				className="object-contain drop-shadow-[0_0_15px_rgba(0,240,255,0.3)]"
				priority
			/>
		</div>
	);
}
