<p align='center'>
  <img src='https://github.com/redhat-plumbers-in-action/team/blob/93529c3358426556a83eb5487f30c9f70c3b2671/members/black-plumber.png' width='100' />
  <h1 align='center'>Plumber</h1>
</p> YO

[![Unit tests](https://github.com/jamacku/plumber/actions/workflows/unit-tests.yml/badge.svg)](https://github.com/jamacku/plumber/actions/workflows/unit-tests.yml) [![Total alerts](https://img.shields.io/lgtm/alerts/g/jamacku/plumber.svg?logo=lgtm&logoWidth=18)](https://lgtm.com/projects/g/jamacku/plumber/alerts/) [![Language grade: JavaScript](https://img.shields.io/lgtm/grade/javascript/g/jamacku/plumber.svg?logo=lgtm&logoWidth=18)](https://lgtm.com/projects/g/jamacku/plumber/context:javascript) [![codecov](https://codecov.io/gh/jamacku/plumber/branch/main/graph/badge.svg?token=unm06qu4vI)](https://codecov.io/gh/jamacku/plumber) [![Mergify Status][mergify-status]][mergify] [![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat)](https://github.com/prettier/prettier) [![Maintainer](https://img.shields.io/badge/docs-Wiki-blue)](https://github.com/jamacku/plumber/wiki)

[mergify]: https://mergify.com
[mergify-status]: https://img.shields.io/endpoint.svg?url=https://api.mergify.com/v1/badges/jamacku/plumber&style=flat

# TODO YOYO

- integration with PP
- integration with Sentry
- helper HTTP endpoint
- Replace bug references with links to trackers

# About YOYOYO

Plumber is a GitHub App built with [Probot](https://github.com/probot/probot) that helps to automate source-git workflows of [Red Hat Plumbers team](https://github.com/redhat-plumbers). Plumber is closely integrated with [Red Hat Bugzilla](https://github.com/redhat-plumbers), using NodeJs module [bugzilla](https://github.com/Mossop/bugzilla-ts).

List of features:

- Commit message linting (_Resolves_, _Related_)
- Support for Bugzilla flags (_qa_ack_, _devel_ack_, _release_, etc.)
- Y-stream, Z-stream and multi-release support
- Configurable
- prepare for possible jira implementation ([jira-client](https://www.npmjs.com/package/jira-client))
- Bugzilla checks (release, etc.)

## Examples YOYOYOYO

```yml
# .github/plumber.yml
package: "systemd"

config:
  - branch: "main"
    release: "c9s"
  - branch: "rhel-9.0.0"
    release: "9.0.0"
  - branch: "rhel-9.1.0"
    release: "9.1.0"

rules:
  bugzillaReference:
    label: "needs-bz"

  review:
    label: "needs-review"

  ci:
    label: "needs-ci"

  upstreamReference:
    label: "needs-upstream"

  flags:
    label: "needs-flags"
    flags: ["qa_ack", "devel_ack", "release"]
```

# Usage

Repositories that are using Plumber bot: ...

# Configuration

Plumber is configurable using `.github/plumber.yml`. **Configuration is required** to allow Plumber so successfully run on repository.

Plumber configuration supports following keys and values:

## Sentry

Plumber allows to enable [Sentry](https://sentry.io) module is invoked using configuration.

# Development

...

```sh
# Install dependencies
yarn

# Compile sources
yarn build

# Run tests
yarn test

# Run the bot
yarn start
```

## Docker

...

```sh
# 1. Build container
docker build -t plumber .

# 2. Start container
docker run -e APP_ID=<app-id> -e PRIVATE_KEY=<pem-value> plumber
```
