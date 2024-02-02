export type Lookup = {
    bucket: string;
    folder: string
}

export type Process = {
    numOfDays: number
    lookup: Lookup[]
    ignoreList: string[]
}