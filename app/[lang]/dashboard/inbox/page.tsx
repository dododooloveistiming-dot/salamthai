import { MOCK_INQUIRIES } from "@/lib/dashboard-mock";
import InboxClient from "@/components/dashboard/InboxClient";
import type { Lang } from "@/lib/types";

export default function InboxPage({ params: _ }: { params: { lang: Lang } }) {
  return <InboxClient inquiries={MOCK_INQUIRIES} />;
}
