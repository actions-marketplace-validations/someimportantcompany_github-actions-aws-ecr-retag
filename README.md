# AWS ECR Retag

[![GitHub](https://badge.fury.io/gh/someimportantcompany%2Fgithub-actions-aws-ecr-retag.svg)](https://github.com/someimportantcompany/github-actions-aws-ecr-retag)
[![CICD](https://github.com/someimportantcompany/github-actions-aws-ecr-retag/workflows/CI/badge.svg?branch=master&event=push)](https://github.com/someimportantcompany/github-actions-aws-ecr-retag/actions?query=workflow%3ACI)
[![Coverage](https://coveralls.io/repos/github/someimportantcompany/github-actions-aws-ecr-retag/badge.svg)](https://coveralls.io/github/someimportantcompany/github-actions-aws-ecr-retag)

Retag a Docker image in ECR without using the Docker CLI, useful if you want to set a tag as "latest" (or similar) but want to avoid pulling, tagging & pushing with the `docker` CLI.

## Usage

```yml
# Required, to set AWS credentials for ECR
- uses: aws-actions/configure-aws-credentials@v1
# Copy image tag from one to another
- uses: someimportantcompany/github-actions-aws-ecr-retag@v1
  with:
    repository: someimportantcompany/some-important-project
    src-tag: main-6b5ee624
    dest-tag: main-latest
```

- You must configure the AWS environment with `aws-actions/configure-aws-credentials` or equivalent.

## Inputs

Key | Description
---- | ----
`repository` | **Required**. The ECR repository name.
`src-tag` | **Required**. The ECR image tag to copy from.
`dest-tag` | **Required**. The ECR image tag to copy to.
`delete-before` | Optionally set to `true` to delete the `dest-tag`.

## Notes

- Any questions or suggestions [please open an issue](https://github.com/someimportantcompany/github-actions-aws-ecr-retag/issues).
