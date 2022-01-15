import { Probot } from 'probot';

import { plumberPullEvent } from './services/common.service';

import { handlePullRequestInit } from './handlers/pull-request-init.handler';
import { handlePullRequestUpdate } from './handlers/pull-request-update.handler';
import { handlePullRequestLabels } from './handlers/pull-request-labels.handler';
import { handlePullRequestReviews } from './handlers/pull-request-reviews.handler';
import {
  handlePullRequestChecksInProgress,
  handlePullRequestChecksCompleted,
} from './handlers/pull-request-checks.handler';

export = (app: Probot) => {
  /*
   *  */
  app.on(plumberPullEvent.init, handlePullRequestInit.bind(null, app));

  /*
   * Title change */
  app.on(plumberPullEvent.edited, handlePullRequestUpdate.bind(null, app));

  /*
   *  */
  app.on(plumberPullEvent.labels, handlePullRequestLabels.bind(null, app));

  /*
   *  */
  app.on(plumberPullEvent.reviews, handlePullRequestReviews.bind(null, app));

  /*
   *  */
  app.on(
    plumberPullEvent.checksInProgress,
    handlePullRequestChecksInProgress.bind(null, app)
  );

  /*
   *  */
  app.on(
    plumberPullEvent.checksCompleted,
    handlePullRequestChecksCompleted.bind(null, app)
  );

  /* Log errors */
  app.onError(async error => {
    app.log.error(error);
  });
};
