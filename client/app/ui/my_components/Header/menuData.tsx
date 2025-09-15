import { Menu } from "@/app/types/Menu";

export const menuData: Menu[] = [
    {
        id: 1,
        title: "Markets",
        path: "/"
    },
    {
        id: 2,
        title: "More",
        subMenu: [
            {
                id: 21,
                title: "Referral",
                path: "/",
                description: "Invite friends and earn commission from their trading"
            },
            {
                id: 22,
                title: "Vouchers",
                path: "/",
                description: "Claim rewards, vouchers, and join Binance promotions"
            },
            {
                id: 23,
                title: "Support",
                path: "/",
                description: "Help center, FAQs, and 24/7 customer support"
            }
        ]
    }

]