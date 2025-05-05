import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";

export default async function AdminPage() {
  const session = await auth();
  console.log(session?.user?.email);
  const isAdmin = session?.user?.role === "ADMIN";

  if (!isAdmin) redirect("/inventory");
  const listings = await prisma.listing.findMany({
    take: 5,
  });

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Admin Panel</h2>
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full table-auto">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="px-4 py-2 font-medium">Title</th>
              <th className="px-4 py-2 font-medium">Location</th>
              <th className="px-4 py-2 font-medium">Rent</th>
              <th className="px-4 py-2 font-medium">Action</th>
            </tr>
          </thead>
          <tbody>
            {listings.map((listing) => (
              <tr key={listing.id} className="border-t hover:bg-gray-50">
                <td className="px-4 py-2">{listing.title}</td>
                <td className="px-4 py-2">{listing.location}</td>
                <td className="px-4 py-2">₱{listing.rent}</td>
                <td className="px-4 py-2 space-x-2">
                  <button className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 text-sm">
                    Approve
                  </button>
                  <button className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-sm">
                    Reject
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
