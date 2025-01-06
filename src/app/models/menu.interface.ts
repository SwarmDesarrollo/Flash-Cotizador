export interface MenuI {
    path: string,
    title: string,
    icon: string,
    class: string
}


export interface AccessI {
    code: number
    codeAccess: number
    codeTypeUser: number
    state: number
    access: {
        class: string
        code: number
        icon: string
        path: string
        title: string
    }

}