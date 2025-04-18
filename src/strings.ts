import chalkTemplate, { chalkTemplateStderr } from 'chalk-template'
import pkg from '../package.json'

const STRINGS = {
    product: {
        name: 'Git Bartender',
        description: pkg.description,
        cmdline: Object.keys(pkg.bin)[0] ?? 'git-bartender',
        version: pkg.version,
        color: {
            primary: '#F03C2E',
            secondary: '#ADAAAA',
            tertiary: '#776262',
        },
    },
    command: {
        pet: {
            description: 'Petting me? Seriously?',
            warning: [
                "What the fuck? No. Don't do that again.",
                "My claws are sharp, and I ain't your fuckin' pet. So don't ever, do that again.",
                'Roses are red. Violets are blue. You see this middle finger? It is for you.',
                '...',
                "Don't touch me.",
                "Stop it. I'm not paid enough to deal with this bullshit.",
                "Do that again, I fuckin' dare you.",
            ],
        },
        help: {
            greet: [
                'Ugh, here we go again.',
                "You new to this, or is this the 13th time because you forgot? Because I don't care, it doesn't make my shift end faster anyways.",
                'The longer you read, the less I have to do. Keep reading.',
                "I was feeling good, until moments ago. Guess who's back here ordering again.",
                "The manual? Haven't you read it already?",
            ],
            action: "Either way, here's the manual, on what you can order me to do.",
            description: 'Shows the manual, so I can deal with less bullshit from you.',
        },
        push: {
            pullFirst: chalkTemplate`Looks like ya {bold dumbass} forgot to pull changes before committin'. What do you want to do now?`,
            pullFirstSolutionMerge: "Merge 'em changes into another commit",
            pullFirstSolutionRebase: 'Rebase the changes and add your dumb shit on top',
            pullFirstSolutionForcePush: "Be an fuckin' asshole and force push your changes",
        },
        '[unknown]': {
            hint: [
                chalkTemplate`You want a manual or something? Run the {underline help} command then.`,
                chalkTemplate`Here's a very good idea, run the {underline help} command, then talk to me after!`,
                chalkTemplate`It's almost like the {underline help} command exists, just sayin'.`,
            ],
            yell: ['Make it quick. What do you want?', 'The hell do you want?', 'State your business.'],
            yellWithCommand: [
                'Are you fucking high?',
                'Had one too many drinks, did you? You better not be doing this at work.',
                "I don't know what the hell you're talking about.",
                (cmd: string) =>
                    chalkTemplateStderr`I don't know what the hell "{underline ${cmd}}" is supposed to mean.`,
                (cmd: string) =>
                    chalkTemplateStderr`I can only help you with things I actually know about. Not whatever bullshit "{underline ${cmd}}" is.`,
                (cmd: string) =>
                    chalkTemplateStderr`Never have I thought I'd see someone order me to "{underline ${cmd}}".`,
            ],
        },
    },
    placeholder: {
        command: {
            description: chalkTemplate`{italic (I have no idea what this command does)}`,
        },
    },
} as const satisfies {
    product: {
        name: string
        description: string
        cmdline: string
        version: string
        color: {
            primary: string
            secondary: string
            tertiary: string
        }
    }
    placeholder: {
        command: {
            description: string
        }
    }
    command: Record<string, StringDict>
}

// like: never ?? [] => []
// like: string ?? [] => string
// like: never ?? never => never
type NeverCoalesce<T, Y> = [T] extends [never] ? Y : T

export type StringDict = Record<string, Stringifiable | RandomizableStringifiable>
export type StringifableDynamic = (...args: any[]) => string
export type Stringifiable = string | StringifableDynamic
export type RandomizableStringifiable = Array<Stringifiable>

export function string<
    P extends Paths<typeof STRINGS, 2>,
    V extends PathValue<typeof STRINGS, P> = PathValue<typeof STRINGS, P>,
>(
    path: P,
    ...args: V extends RandomizableStringifiable
        ? NeverCoalesce<Parameters<Extract<V[number], StringifableDynamic>>, []>
        : V extends StringifableDynamic
          ? Parameters<V>
          : []
): string {
    let obj: object = STRINGS
    const keys = path.split('.')

    for (let i = 0, len = keys.length; i < len; i++) {
        obj = obj[keys[i]! as keyof typeof obj]
        if (obj === undefined) throw new Error(`Could not read string from access path: ${path}`)
    }

    if (Array.isArray(obj)) obj = obj[Math.floor(Math.random() * obj.length)]
    if (typeof obj === 'string') return obj
    if (typeof obj === 'function') return obj(...args)

    throw new Error(`String access path returned non-stringifiable: ${path}`)
}

// https://gist.github.com/badsyntax/4df5d2d8d6f49b7da59bb47f55fadda5

type Join<Key, Previous, TKey extends number | string = string> = Key extends TKey
    ? Previous extends TKey
        ? `${Key}${'' extends Previous ? '' : '.'}${Previous}`
        : never
    : never

type Previous = [never, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, ...0[]]

type Paths<TEntity, TDepth extends number = 3, TKey extends number | string = string> = [TDepth] extends [never]
    ? never
    : TEntity extends object
      ? {
            [Key in keyof TEntity]-?: Key extends TKey
                ? `${Key}` | Join<Key, Paths<TEntity[Key], Previous[TDepth]>>
                : never
        }[keyof TEntity]
      : ''

type PathValue<T, P extends Paths<T>> = P extends keyof T
    ? T[P]
    : P extends `${infer K}.${infer Rest}`
      ? K extends keyof T
          ? // @ts-expect-error
            PathValue<T[K], Rest>
          : never
      : never
