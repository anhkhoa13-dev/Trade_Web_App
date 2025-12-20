import Link from "next/link";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../ui/shadcn/card";
import RegisterForm from "./RegisterForm";

export default function RegisterCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-center text-xl sm:text-2xl font-bold">
          Create Account
        </CardTitle>
      </CardHeader>
      <CardContent>
        <RegisterForm />

        <p className="text-center text-xs sm:text-sm text-muted-foreground mt-3 sm:mt-4">
          Already have an account?{" "}
          <Link href="/login" className="text-foreground hover:underline">
            Login
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
