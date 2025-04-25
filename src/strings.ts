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
        github: {
            description: 'Things related to the Hub- shit. Walked myself right into that one.',
            pullRequestDescription: 'Open a pull request. What did you expect?',
            actionsDescription: 'Just pushed your changes? Want to watch the deployment fail?',
            noSubcommand: "You're ordering a category instead of an item. Pick one of the subcommands.",
            invalidSubcommand: "That doesn't exist on the menu. Try again.",
            actionPr: (tb: string, tr: string, fb: string, fr: string) =>
                chalkTemplate`Fine. Making a PR ${tr}/${tb} <- ${fr}/${fb}. Hope it gets closed, or a ton conflicts.`,
            actionActions: (owner: string, repo: string) =>
                chalkTemplate`Opening Actions page for ${owner}/${repo}. Hope your workflows fail.`,
            noActiveLocalBranch: [
                'Are you not on a branch? What are you doing?',
                "I haven't been trained to deal with this. No active brach?",
            ],
            noLocalBranch: (branch: string) =>
                chalkTemplateStderr`Sorry, as a raccoon with usable eyes, the local branch "{underline ${branch}}" doesn't fuckin' exist!`,
            noRemote: (remote: string) =>
                chalkTemplateStderr`The remote "{underline ${remote}}" doesn't exist! Wow, it's almost like you suck at this.`,
            noLocalBranchRemote: "The active branch ain't set to track anything..., yeah nice.",
            noFromRemoteBranch: "Did you forget to push? 'cause it seems like the remote branch ain't there.",
            noTargetBranch: [
                "Target branch doesn't exist. Just like my hope for a change.",
                "Target branch ain't there.",
            ],
            notGitHubRemote: (remote: string) =>
                chalkTemplateStderr`You're expecting a GitHub command to work on the remote "{underline ${remote}}", which is a non-GitHub remote. Are you stupid?`,
        },
        help: {
            greet: [
                'Ugh, here we go again.',
                "You new to this, or is this the 13th time because you forgot? Because I don't care, it doesn't make my shift end faster anyways.",
                'The longer you read, the less I have to do. Keep reading.',
                "I was feeling good, until moments ago. Guess who's back here ordering again.",
                "The manual? Haven't you read it already?",
            ],
            aliasesHeader: 'And here are the aliases.',
            flagTip: chalkTemplate`And, a tip that I can't forget to say: Run commands while passing {underline --help} to view help for those commands.`,
            unknown: [
                (cmd: string) =>
                    chalkTemplateStderr`I can assure you "{underline ${cmd}}" doesn't exist on the manual. So maybe try looking harder?`,
                (cmd: string) => chalkTemplateStderr`Last time I checked, "{underline ${cmd}}" was not on the menu.`,
            ],
            actionSpecific: (cmd: string) =>
                chalkTemplate`So you want help for "{underline ${cmd}}"? Okay fine, here it is. Happy now?`,
            action: [
                "Here you go. Hoping you won't need it again, I don't want to clean up the dust on it for you.",
                "Either way, here's the manual, on what you can order me to do.",
            ],
            description: 'Shows the manual, so I can deal with less bullshit from you.',
            subcommandsHeader: 'And here are the subcommands.',
            usagesHeader:
                "And here's how to use the command, properly. Remember it, so I don't have to call out your bullshit next time.",
            examplesHeader: "Some examples, if you don't have the brain to read the usage syntax.",
        },
        ignore: {
            viewHeader: 'Here are the files you are ignoring. Good job, you finally remembered.',
            description: 'Ignore your files, like ignoring your problems.',
            noFiles: chalkTemplate`{italic (No ignored files, great job. I guess you have no problems.)}`,
            action: [
                "Alright, but you sure about this? I mean, I don't care, but you might want to think about it.",
                'Ignoring files is like ignoring your problems. It never works out. But hey, who am I to judge?',
                "Now that that's done, why don't you just ignore my existence too, as well?",
                "Hopefully you won't forget about these files. Not like it's my problem anyways.",
            ],
            dupe: (pattern: string) =>
                chalkTemplateStderr`${pattern} is already ignored. Can't ignore something twice, can you?`,
        },
        list: {
            description: 'Lists your files, and maybe your insecurities.',
            noArgs: 'So what do you want me to list exactly?',
            stagedHeader: "And here are the files you're going to commit. Nice job, I guess.",
            globHeader: (glob: string[]) => `Filter: ${glob.join(', ')}`,
            noGlob: 'You want to list the files in what, exactly?',
            noFiles: 'Ha! No files. I knew it.',
        },
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
        push: {
            description: 'Brave enough to finally show your code to the world, huh?',
            pullFirst: chalkTemplate`Looks like ya {bold dumbass} forgot to pull changes before committin'. What do you want to do now?`,
            pullFirstSolutionMerge: "Merge 'em changes into another commit",
            pullFirstSolutionRebase: 'Rebase the changes and add your dumb shit on top',
            pullFirstSolutionForcePush: "Be an fuckin' asshole and force push your changes",
        },
        undo: {
            action: (amount: number) => `Uncommited the last ${amount} commits. Stop having commitment issues.`,
            description: 'Uncommits your commits because you have commitment issues.',
        },
        unignore: {
            description: 'Unignoring your problems now? Good for you.',
            noArgs: ['You want to unignore what, exactly?', 'So, what am I supposed to unignore?'],
            noMatch: (pattern: string) =>
                chalkTemplateStderr`${pattern} is not ignored. Can't unignore something that doesn't exist, can you?`,
            action: [
                'Finally decided to face your problems, huh? Good for you.',
                'Done. I wish I could stop ignoring my problems and fix them.',
            ],
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
    generic: {
        error: [
            "Ugh, something went wrong. I don't know what, but it's definitely not my fault.",
            "You gotta be shittin' me. Well, somethin' exploded back there.",
            "Looks like it ain't workin' out. Last time I tried again, I got into deeper shit.",
        ],
        command: {
            correctionConfirmation: (cmd: string) =>
                chalkTemplate`Never heard someone pronounce it like that. Did you mean "{underline ${cmd}}"?`,
            placeholder: {
                description: chalkTemplate`{italic (I have no idea what this command does)}`,
            },
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
    generic: {
        error: RandomizableStringifiable
        command: {
            correctionConfirmation: StringifableDynamic
            placeholder: {
                description: string
            }
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
    P extends Paths<typeof STRINGS, 3>,
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
