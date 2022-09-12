import { Command } from '@boostercloud/framework-core'
import { Register } from '@boostercloud/framework-types'

@Command({
  authorize: 'all',
})
export class Delete {
  public constructor() {}

  public static async handle(command: Delete, register: Register): Promise<void> {
    register.events(/* YOUR EVENT HERE */)
  }
}
