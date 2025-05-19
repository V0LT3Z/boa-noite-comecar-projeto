
import { AdminLayout } from "@/components/admin/AdminLayout";
import { EventsManager } from "@/components/admin/events/EventsManager";

const AdminEvents = () => {
  return (
    <AdminLayout>
      <EventsManager />
    </AdminLayout>
  );
};

export default AdminEvents;
