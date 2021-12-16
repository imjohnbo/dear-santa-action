const core = require('@actions/core');
const { context, getOctokit } = require('@actions/github');

const getMessage = (user, naughty, url) => {
  const buildsUrl = `${context.serverUrl}/${context.repo.owner}/${context.repo.repo}/actions?query=actor%3A${user}`;
  const niceMessages = [
    `Ho, ho, ho! You've [been good](${buildsUrl}) this year! Santa approves [your list](${url}). Clear the chimney! 🏠`,
    `Well done! I can only spot...oh, [one or two broken builds](${buildsUrl}) from up here at the North Pole. Santa approves [your list](${url}). Make way for Rudolph! 🦌`,
  ];
  const naughtyMessages = [
    `Santa's elves report that you've been mischievous this year! Santa denies [your list](${url}). Try being [breaking fewer builds](${buildsUrl}) next year. 😬`,
    `What, you expect [a present](${url})? In this economic climate? With [your broken builds](${buildsUrl})? 😥`
  ]
  return naughty ? naughtyMessages[Math.floor(Math.random() * naughtyMessages.length)] : niceMessages[Math.floor(Math.random() * niceMessages.length)];
};

async function run () {
  try {
    const token = core.getInput('token');
    const { owner, repo } = context.repo;
    const github = getOctokit(token);
    let isNaughty = false;

    // Dear Santa must be triggered on issues or issue_comment
    if (context.eventName.indexOf('issue') < 0) {
      core.setFailed('Dear Santa Action must be run upon an issues or issue_comment event');
      return;
    }

    const user = context.actor;
    const re = /[dD]ear\s[sS]anta?/;
    const list = context.payload.comment ? context.payload.comment.body : context.payload.issue.body;

    // Dear Santa must be triggered with issues or issue comments having a line starting with "dear santa" (not case sensitive)
    if (list.search(re) < 0) {
      core.setFailed('Not a letter to Santa after all... missing "Dear Santa".');
      return;
    }

    // Url of the wish list comment
    const wishlistUrl = context.payload.comment ? context.payload.comment.html_url : context.payload.issue.html_url;

    // Get all workflow runs for this user
    // https://octokit.github.io/rest.js/v18#actions-list-workflow-runs-for-repo
    const runs = await github.rest.actions.listWorkflowRunsForRepo({
      owner,
      repo,
      per_page: 100,
      status: 'completed',
      actor: user
    });

    // Did the user have more failed or successful workflow runs?
    const failed = runs.data.workflow_runs.filter(run => run.conclusion === 'failure').length;
    const successful = runs.data.workflow_runs.filter(run => run.conclusion === 'success').length;
    
    if (failed > successful) {
      isNaughty = true;
    }

    github.rest.issues.createComment({
      ...context.repo,
      issue_number: context.issue.number,
      body:
`
<h3 align="center">𝐹𝓇𝑜𝓂 𝓉𝒽𝑒 𝒹𝑒𝓈𝓀 𝑜𝒻 </h3>
<h1 align="center">🌟 🛷 🎄 𝓢𝓪𝓷𝓽𝓪 𝓒𝓵𝓪𝓾𝓼  🎄 🛷 🌟</h1>

Hello @${user},

${getMessage(user, isNaughty, wishlistUrl)}

Yours truly,
Santa 🎅
`
    });
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
