import { Card, CardContent, CardHeader, CardTitle } from "../../ui/shadcn/card";
import VerifyForm from "./VerifyForm";

interface VerifyCardProps {
  token: string,
  email: string
}

export default function VerifyCard({ token, email }: VerifyCardProps) {

  return (
    <Card className="w-full max-w-sm">
      <CardHeader className="pb-4">
        <CardTitle className="text-center text-2xl font-bold">
          Verify Your Email
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4 text-center">
          We sent a 6-digit code to {email}.
        </p>
        <VerifyForm urlToken={token} />
      </CardContent>
    </Card>
  );
}
