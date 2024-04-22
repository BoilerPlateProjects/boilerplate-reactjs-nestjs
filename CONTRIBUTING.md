# Contributing to Project Name

First off, thank you for considering contributing to this project. It's people like you that make Project Name such a great tool.

## Where do I go from here?

If you've noticed a bug or have a feature request, make one! It's generally best if you get confirmation of your bug or approval for your feature request this way before starting to code.

## Fork & create a branch

If this is something you think you can fix, then fork the repository and create a branch with a descriptive name.

A good branch name would be (where issue #325 is the issue you're addressing):

```bash
git checkout -b feature-325-add-ruby
```

## Get the test suite running

Make sure you're using the latest version of Node.js. If you're using Yarn, make sure you're using the latest version of Yarn.

Install the development dependencies:

```bash
yarn install
```

Run the test suite to ensure everything is working as expected:

```bash
yarn test
```

## Implement your fix or feature

At this point, you're ready to make your changes! Feel free to ask for help; everyone is a beginner at first.

## Get the style right

Your patch should follow the same syntax and semantic as the rest of the code. Check the [Style guide](link-to-styleguide) for more details.

## Make a Pull Request

At this point, you should switch back to your master branch and make sure it's up to date with the latest changes from the main repository:

```bash
git remote add upstream git@github.com:MDReal32/boilerplate-reactjs-nestjs.git
git checkout master
git pull upstream master
```

Then update your feature branch from your local copy of master, and push it!

```bash
git checkout feature-325-add-ruby
git rebase master
git push --set-upstream origin feature-325-add-ruby
```

Go to the repository, and you should see your new branch. Click the 'Compare & pull request' button to begin the submission.

## Keeping your Pull Request updated

If a maintainer asks you to "rebase" your PR, they're saying that a lot of code has changed, and that you need to update your branch so it's easier to merge.

To update your `feature-325-add-ruby` branch, use these steps:

```bash
git checkout feature-325-add-ruby
git pull --rebase upstream master
git push --force-with-lease origin feature-325-add-ruby
```

## What if my Pull Request gets rejected?

Don't despair! The goal of a review process is to improve the code quality by making sure everyone understands what's going into the codebase.

## Thank you for your contributions!

We love getting pull requests, and we hope this guide makes it easier for you to contribute.
