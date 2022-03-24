import { Context } from 'probot';

import { plumberPullEvent } from '../services/common.service';

import { Issue } from './issue.model';
import { Commit } from './commit.model';
import { Review } from './review.model';

import { BugRef } from '../types/commit';
import { PullRequestObject } from '../types/pullRequest';

export class PullRequest extends Issue {
  private _context:
    | Context<typeof plumberPullEvent.edited[number]>
    | Context<typeof plumberPullEvent.init[number]>;
  protected _commits: Commit[];
  protected _review: Review;

  protected _invalidCommits: Commit[];

  constructor(data: PullRequestObject) {
    super(data);
    this._context = data.context;
    this._commits = data.commits;
    this._review = new Review({ context: this.context });

    this._invalidCommits = this.invalidCommits = this.getCommitsBugRefs();
  }

  private get context() {
    return this._context;
  }

  get review() {
    return this._review;
  }

  get invalidCommits() {
    return this._invalidCommits;
  }

  set invalidCommits(commits: Commit[]) {
    this._invalidCommits = commits;

    if (this.invalidCommits.length) {
      this.review.message = this.invalidBugReferenceTemplate(
        this.invalidCommits
      );
    } else {
      this.review.message = `👍 *LGTM* 👍`;
    }
  }

  /**
   * Check if PR has only commits with correct bug reference
   *
   * @returns - True if all commits have correct bug reference
   */
  commitsHaveBugRefs(): boolean {
    for (let i = 0; i < this._commits.length; i++) {
      if (!this._commits[i].bugRef) {
        return false;
      }
    }

    return true;
  }

  /**
   * Check commits for bug references and retrieve them
   *
   * @returns - Array of commits with invalid or none bug reference
   */
  protected getCommitsBugRefs() {
    let bug: BugRef = undefined;

    let invalidCommits = this._commits.filter(commit => {
      if (commit.bugRef && bug && commit.bugRef === bug) {
        /* Already noted bug reference */
        return false;
      } else if (commit.bugRef && !bug) {
        /* First bug reference */
        bug = commit.bugRef;
        return false;
      } else {
        /* Multiple bug references in one PR or no bug reference */
        return true;
      }
    });

    this.bugRef = bug;
    return invalidCommits;
  }

  /**
   * Compose comment about invalid bug references
   *
   * @param commits
   * @returns - Composed comment
   */
  invalidBugReferenceTemplate(commits: Commit[]) {
    /* Do not change following indentation! */
    const template = `⚠️ *Following commits are missing proper bugzilla reference!* ⚠️
---
  
${commits
  .map(commit => {
    let slicedMsg = commit.message.split(/\n/, 1)[0].slice(0, 70);
    const dotDot = '...';

    return slicedMsg.length < 70
      ? `\`\`${slicedMsg}\`\` - ${commit.sha}`
      : `\`\`${slicedMsg}${dotDot}\`\` - ${commit.sha}`;
  })
  .join('\r\n')}
  
---
Please ensure, that all commit messages includes i.e.: _Resolves: #123456789_ or _Related: #123456789_ and only **one** 🐞 is referenced per PR.`;

    return template;
  }

  /**
   * Update PR title
   *
   * @param oldTitle
   */
  setTitle(oldTitle: string) {
    if (oldTitle === this.titleString) {
      return;
    }

    this.context.octokit.pulls.update(
      this.context.pullRequest({
        title: this.titleString,
      })
    );
  }

  /**
   * Fetch commits from PR
   *
   * @param context
   * @returns - Promised array of commits
   */
  static async getCommits(
    context:
      | Context<typeof plumberPullEvent.edited[number]>
      | Context<typeof plumberPullEvent.init[number]>
  ) {
    return (
      await context.octokit.pulls.listCommits(context.pullRequest())
    ).data.map(commit => {
      const data = {
        sha: commit.sha,
        message: commit.commit.message,
      };

      return new Commit(data);
    });
  }

  /**
   * Compose input object for PullRequest object
   *
   * @param context
   * @param commits
   * @returns - PullRequestObject, that is used in instantiation of PullRequest object
   */
  static composeInput(
    context:
      | Context<typeof plumberPullEvent.edited[number]>
      | Context<typeof plumberPullEvent.init[number]>,
    commits: Commit[]
  ): PullRequestObject {
    const { pull_request } = context.payload;

    return {
      id: context.payload.number,
      title: { name: pull_request.title },
      body: pull_request.body,
      assignees: pull_request.assignees.map(assignee => assignee.login),
      labels: pull_request.labels.map(label => label.name),
      milestone: pull_request?.milestone,
      // project: pull_request?.project,
      context,
      commits,
    };
  }
}
