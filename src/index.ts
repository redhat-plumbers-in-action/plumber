import { Probot } from 'probot';

import { plumberPullEvent } from './services/common.service';

import { handlePullRequestInit } from './handlers/pullRequestInit.handler';
// import { handlePullRequestUpdate } from './handlers/pull-request-update.handler';
// import { handlePullRequestLabels } from './handlers/pull-request-labels.handler';
// import { handlePullRequestReviews } from './handlers/pull-request-reviews.handler';
// import {
//   handlePullRequestChecksInProgress,
//   handlePullRequestChecksCompleted,
// } from './handlers/pull-request-checks.handler';

const plumber = (app: Probot) => {
  app.on(plumberPullEvent.init, handlePullRequestInit.bind(null, app));

  // app.on(plumberPullEvent.edited, handlePullRequestUpdate.bind(null, app));

  // app.on(plumberPullEvent.labels, handlePullRequestLabels.bind(null, app));

  // app.on(plumberPullEvent.reviews, handlePullRequestReviews.bind(null, app));

  // app.on(
  //   plumberPullEvent.checksInProgress,
  //   handlePullRequestChecksInProgress.bind(null, app)
  // );

  // app.on(
  //   plumberPullEvent.checksCompleted,
  //   handlePullRequestChecksCompleted.bind(null, app)
  // );

  app.onError(async error => {
    app.log.error(error);
  });
};

export default plumber;
