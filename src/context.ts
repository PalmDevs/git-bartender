import chalkTemplate from 'chalk-template'
import figures from 'figures'
import { readdirSync } from 'fs'
import simpleGit from 'simple-git'
import { string } from './strings'

export const git = simpleGit(process.cwd())

export interface Command {
    description?: string
    usages?: string[]
    execute(): Promise<any>
    hidden?: boolean
    uninvokable?: boolean
}

export const commands = new Proxy({} as Record<string, Command>, {
    get: (cache, prop: string) => {
        try {
            return (cache[prop] ??= require(`${import.meta.dir}/commands/${prop}.ts`))
        } catch {}
    },
    ownKeys: () => readdirSync(`${import.meta.dir}/commands`).map(f => fileNameToCommandName(f)),
})

export function fileNameToCommandName(fileName: string) {
    return fileName.replace(/\.[mc]?tsx?$/, '').toLowerCase()
}

export const flags: Record<string, string | boolean> = {}
export let command: string
export const args: string[] = []

const cmdlineArgs = process.argv.slice(2)

for (let i = 0; i < cmdlineArgs.length; i++) {
    const carg = cmdlineArgs[i]!

    if (carg[0] === '-') {
        const flag = carg.slice(carg[1] === '-' ? 2 : 1)
        const next = cmdlineArgs[i + 1]
        if (next) {
            if (next[0] === '-') {
                flags[flag] = true
            } else {
                flags[flag] = next
                i++
            }
        } else flags[flag] = true
    } else if (command!) args.push(carg)
    else command = carg
}

export function setExitCode(code: number) {
    process.exitCode = code
}

function loggablesToString(args: object[]) {
    return args.map(arg => (typeof arg === 'string' ? arg : Bun.inspect(arg))).join(' ')
}

export const logger = {
    info: (...args: any[]) =>
        console.info(
            chalkTemplate`{${string('product.color.secondary')} ${figures.pointerSmall} ${loggablesToString(args)}}`,
        ),
    error: (...args: any[]) =>
        console.error(chalkTemplate`{${string('product.color.primary')} ${figures.cross} ${loggablesToString(args)}}`),
    warn: (...args: any[]) => console.warn(chalkTemplate`{yellowBright ${figures.warning} ${loggablesToString(args)}}`),
    debug: (...args: any[]) =>
        console.debug(
            chalkTemplate`{${string('product.color.tertiary')} ${figures.pointer} ${loggablesToString(args)}}`,
        ),
    log: (...args: any[]) => console.log(chalkTemplate`${loggablesToString(args)}`),
    success: (...args: any[]) => console.info(chalkTemplate`{greenBright ${figures.tick} ${loggablesToString(args)}}`),
}
