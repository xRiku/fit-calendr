import Header from "./header";
import MainNav from "./main-nav";
import { ModeToggle } from "./theme-toggle";

export default function LoggedHeader() {
  return (
    <Header>
      <MainNav />
      <ModeToggle />
    </Header>
  );
}
