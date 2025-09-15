export type Menu = {
    id: number,
    title: string,
    path?: string,
    subMenu?: (Menu & { description?: string })[]
}