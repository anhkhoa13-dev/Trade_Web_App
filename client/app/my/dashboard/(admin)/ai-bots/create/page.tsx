
import { Metadata } from "next";
import CreateBotForm from "./_components/CreateBotForm";

export const metadata: Metadata = {
  title: "Create New Bot | Admin Dashboard",
  description: "Configure and deploy a new AI trading bot.",
};

export default function AdminBotCreatePage() {
  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <CreateBotForm />
    </div>
  );
}