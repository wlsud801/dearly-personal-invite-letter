export const dynamic = "force-dynamic";

import PageLoader from "@/app/components/PageLoader";
import IntroSection from "@/app/components/sections/IntroSection";
import RSVPButton from "@/app/components/RSVPButton";
import InvitationSection from "@/app/components/sections/InvitationSection";
import FamilySection from "@/app/components/sections/FamilySection";
import CalendarSection from "@/app/components/sections/CalendarSection";
import GallerySection from "@/app/components/sections/GallerySection";
import NoticeSection from "@/app/components/sections/NoticeSection";
import MessageSection from "@/app/components/sections/MessageSection";
import LocationSection from "@/app/components/sections/LocationSection";
import GiftSection from "@/app/components/sections/GiftSection";
import ThanksSection from "@/app/components/sections/ThanksSection";

export default function Page() {
  return (
    <PageLoader>
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
    </PageLoader>
  );
}
