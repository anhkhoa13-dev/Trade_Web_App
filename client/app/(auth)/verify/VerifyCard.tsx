import { Card, CardContent, CardHeader, CardTitle } from "../../ui/shadcn/card";
import VerifyForm from "./VerifyForm";

interface VerifyCardProps {
  token: string;
  email: string;
}

export default function VerifyCard({ token, email }: VerifyCardProps) {
  return (
    <Card className="w-full max-w-sm mx-auto">
      <CardHeader className="pb-3 sm:pb-4 px-4 sm:px-6">
        <CardTitle className="text-center text-xl sm:text-2xl font-bold">
          Verify Your Email
        </CardTitle>
      </CardHeader>
      <CardContent className="px-4 sm:px-6 pb-4 sm:pb-6">
        <p className="text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4 text-center break-all">
          We sent a 6-digit code to {email}.
        </p>
        <VerifyForm urlToken={token} />
      </CardContent>
    </Card>
  );
}
