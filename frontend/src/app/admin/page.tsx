// We import the main dashboard component which contains the layout and logic.
import Admin from '@/Admin/AdminDashboard'; 
//import Admin from '../../components/admin-dashboard'; 

/**
 * AdminPage Component
 * This component acts as the public-facing route handler for /Admin. 
 * It renders the full Admin Dashboard.
 * * NOTE: In a production Next.js application, this file should be protected by
 * middleware or server-side checks to redirect users who are not administrators.
 */
export default function AdminPage() {
  return (
    // The AdminDashboard component handles its own full-screen layout.
    <Admin />
  );
}
