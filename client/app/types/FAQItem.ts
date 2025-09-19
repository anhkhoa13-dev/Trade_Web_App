import { type IconName } from 'lucide-react/dynamic'

export type FAQItem = {
    id: string
    icon: IconName
    question: string
    answer: string
}