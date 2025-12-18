"use server";

import { PaymentService } from "@/backend/payment/payment.services";

export async function initiateDeposit(amount: number) {
  return await PaymentService.initiateDeposit({ amount });
}

export async function verifyVnPayCallback(queryString: string) {
  const queryParams = new URLSearchParams(queryString);
  return await PaymentService.verifyVnPayCallback(queryParams);
}
