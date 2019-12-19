const core = require('@actions/core')
const { GitHub, context } = require('@actions/github')
const github = new GitHub(process.env.GITHUB_TOKEN)

const getMessage = (user, url) => {
  const messages = [
    `Ho, ho, ho! You've been good this year! Santa approves [your list](${url}). Clear the chimney!`,
    `Santa's elves report that you've been mischievous this year, \`@${user}\`! Santa denies [your list](${url}). Try being less naughty next year.`
  ]
  return messages[Math.floor(Math.random() * messages.length)]
}

async function run () {
  try {
    // Dear Santa must be triggered on issues or issue_comment
    if (process.env.GITHUB_EVENT_NAME.indexOf('issue') < 0) {
      core.setFailed('Dear Santa Action must be run upon an issues or issue_comment event')
      return
    }

    const user = process.env.GITHUB_ACTOR
    const re = /[dD]ear\s[sS]anta?/
    const list = context.payload.comment ? context.payload.comment.body : context.payload.issue.body

    // Dear Santa must be triggered with issues or issue comments having a line starting with "dear santa" (not case sensitive)
    if (list.search(re) < 0) {
      core.setFailed('Not a letter to Santa after all... missing "Dear Santa".')
      return
    }

    // Url of the wish list comment
    const url = list.html_url

    github.issues.createComment({
      ...context.repo,
      issue_number: context.issue.number,
      body:
`
<h3 align="center">𝐹𝓇𝑜𝓂 𝓉𝒽𝑒 𝒹𝑒𝓈𝓀 𝑜𝒻 </h3>
<h1 align="center">🌟 🛷 🎄 𝓢𝓪𝓷𝓽𝓪 𝓒𝓵𝓪𝓾𝓼  🎄 🛷 🌟</h1>

Hello \`@${user}\`,

${getMessage(user, url)}

Yours truly,
Santa 🎅
`
    })
  } catch (error) {
    core.setFailed(error.message)
  }
}

run()
