"use client";

import { logout } from "@/actions/auth.actions";
import { Avatar, AvatarFallback, AvatarImage } from "@/app/ui/shadcn/avatar";
import { Button } from "@/app/ui/shadcn/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/app/ui/shadcn/dropdown-menu";
import { LogOut, User, Wallet } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";

interface UserNavProps {
  user: {
    name: string;
    email: string;
    image?: string | null;
    username: string;
  };
}

export function UserNav({ user }: UserNavProps) {
  const handleLogout = async () => {
    toast.success("Logout ... ");
    await logout();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="subtle">
          <Avatar className="text-foreground">
            <AvatarImage src={user.image!} alt={user.name} />
            <AvatarFallback>
              {user.username
                ? user.username[0].toUpperCase()
                : user.name[0].toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <span>{user.username}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user.username}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link href="/my/profile" className="cursor-pointer">
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/my/wallet/overview" className="cursor-pointer">
              <Wallet className="mr-2 h-4 w-4" />
              <span>Wallet</span>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => handleLogout()} variant="destructive">
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
