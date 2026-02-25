import QuickAddTodayButton from "@/components/quick-add-today-button";
import H2 from "@/components/h2";

export default function CalendarToolbar() {
	return (
		<div className="flex items-center justify-between lg:justify-end pt-2 pb-4">
			<div className="lg:hidden">
				<H2>Calendar</H2>
			</div>
			<QuickAddTodayButton />
		</div>
	);
}
