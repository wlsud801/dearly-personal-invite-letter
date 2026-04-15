import IntroSection from "./components/sections/IntroSection";
import RSVPButton from "./components/RSVPButton";
import InvitationSection from "./components/sections/InvitationSection";
import FamilySection from "./components/sections/FamilySection";
import CalendarSection from "./components/sections/CalendarSection";
import GallerySection from "./components/sections/GallerySection";
import NoticeSection from "./components/sections/NoticeSection";
import MessageSection from "./components/sections/MessageSection";
import LocationSection from "./components/sections/LocationSection";
import GiftSection from "./components/sections/GiftSection";
import ThanksSection from "./components/sections/ThanksSection";

export default function Page() {
  return (
    <main className="flex flex-col w-full">
      <RSVPButton />
      <IntroSection />
      <InvitationSection />
      <FamilySection />
      <CalendarSection />
      <GallerySection />
      <NoticeSection />
      <MessageSection />
      <LocationSection />
      <GiftSection />
      <ThanksSection />
    </main>
  );
}
