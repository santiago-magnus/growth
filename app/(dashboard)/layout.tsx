import Sidebar from "@/components/sidebar";
import TopBar from "@/components/topbar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden" style={{ fontFamily: "'Plus Jakarta Sans', -apple-system, sans-serif", background: "#F5F0EA" }}>
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar />
        <div className="flex-1 overflow-auto p-5 pb-10">
          {children}
        </div>
      </div>
    </div>
  );
}
