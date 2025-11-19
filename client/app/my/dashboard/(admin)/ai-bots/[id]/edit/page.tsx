import AdminBotEdit from "./_components/AdminBotEdit";

export default function Page({ params }: { params: { id: string } }) {
  const botId = params.id;

  return (
    <AdminBotEdit
      botId={botId}
    />
  );
}
