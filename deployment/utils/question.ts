import * as readline from 'readline'

const rl = readline.createInterface(process.stdin, process.stdout)
const questionAsync = async (question: string): Promise<string> => {
  return new Promise((resolve) => {
    rl.question(question, resolve)
  })
}

export { rl }
export default questionAsync
