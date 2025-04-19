type DirTreeNode = {
    [key: string]: DirTreeNode | null
}

export function buildDirTree(paths: string[]): DirTreeNode {
    const root: DirTreeNode = {}

    for (const path of paths) {
        const parts = path.split('/')
        let current = root

        for (let i = 0; i < parts.length; i++) {
            const part = parts[i]!
            if (!current[part]) current[part] = i === parts.length - 1 ? null : {}
            if (current[part] !== null) current = current[part] as DirTreeNode
        }
    }

    return root
}

export function printDirTree(tree: DirTreeNode, prefix = '', root = true): void {
    const entries = Object.entries(tree).sort(([a], [b]) => a.localeCompare(b))
    const total = entries.length

    entries.forEach(([key, value], index) => {
        const isLastEntry = index === total - 1
        const connector = root ? '' : isLastEntry ? '└── ' : '├── '

        console.log(`${prefix}${connector}${key}`)

        if (value !== null) {
            const newPrefix = root ? '' : prefix + (isLastEntry ? '    ' : '│   ')
            printDirTree(value, newPrefix, false)
        }
    })
}
