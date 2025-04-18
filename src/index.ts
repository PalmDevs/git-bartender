import { execute as executeUnknown } from './commands/[unknown]'
import { command } from './context'
import { string } from './strings'

process.title = string('product.name')

try {
    const { execute, uninvokable } = await import(`./commands/${command}`)
    if (uninvokable) throw 'Command not invokable'
    await execute()
} catch {
    await executeUnknown()
}
