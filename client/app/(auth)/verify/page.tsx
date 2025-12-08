
import { redirect } from "next/navigation";
import VerifyCard from "./VerifyCard";

export default async function Page(props: {
  searchParams?: Promise<{
    token?: string,
    email?: string
  }>
}) {

  const params = await props.searchParams

  if (!params || !params.token || !params.email) redirect("/register")

  return (
    <VerifyCard token={params.token} email={params.email} />
  )
}
