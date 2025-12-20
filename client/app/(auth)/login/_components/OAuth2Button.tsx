"use client"

import { useState } from "react"
import { FcGoogle } from "react-icons/fc"
import { FaGithub } from "react-icons/fa"
import { Button } from "../../../ui/shadcn/button"
import { googleLogin } from "@/actions/auth.actions"
import toast from "react-hot-toast"
import { Spinner } from "@/app/ui/shadcn/spinner"

interface SocialButtonProps extends React.ComponentProps<"button"> {
    icon: React.ElementType
    label: string
    action: () => Promise<void>
}

function SocialButton({ icon: Icon, label, action, className, ...props }: SocialButtonProps) {
    const [isLoading, setIsLoading] = useState(false)

    const handleClick = async () => {
        try {
            setIsLoading(true)
            await action()
        } catch (error) {
            toast.error(`${label} login failed`)
            setIsLoading(false)
        }
    }

    return (
        <Button
            variant="outline"
            className={`bg-transparent text-inherit hover:bg-transparent hover:border-primary gap-2 ${className}`}
            onClick={handleClick}
            disabled={isLoading || props.disabled}
            {...props}
        >
            {isLoading ? (
                <Spinner />
            ) : (
                <Icon className="h-5 w-5" />
            )}
            {label}
        </Button>
    )
}

export function GoogleButton() {
    return (
        <SocialButton
            icon={FcGoogle}
            label="Google"
            action={googleLogin}
        />
    )
}

export function GithubButton() {
    return (
        <SocialButton
            icon={FaGithub}
            label="GitHub"
            action={googleLogin}
        />
    )
}