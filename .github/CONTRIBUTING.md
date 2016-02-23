# Contributing to Robinhood Node

1. [Getting involved](#getting-involved)
2. [Reporting bugs](#reporting-bugs)
3. [Feature requests](#feature-requests)
4. [Pull requests](#pull-requests)

## Getting involved
This started as a weekend project because I thought that the service provided by Robinhood was awesome, and having a way to play with it from a script was a must.

That means that there are a lot of things that could use your help, if you don't know where to start take a look at the [open issues](https://github.com/aurbano/robinhood-node/issues).

## Reporting bugs
### Make sure the bug is in the Robinhood Node package!

At the moment it is essentially a thin wrapper around http calls, so most errors will be due to wrong requests/permissions.

### Use the latest version

Releases come out fairly often, so run a quick `npm update` in the directory where you are using it.

*Tip: You can run `npm outdated` to check whether you have any pending updates.*

### Add a test case/reproduction steps

This is essential, make sure that in the description there is **enough information** to **reproduce the issue**.

**Read it twice**, specially after a bit of time! It usually seems obvious when you are writing it but then even you will find the instructions obscure at best.

## Feature Requests
Similarly to reporting bugs, quickly search to make sure it hasn't been addressed before.

Explain thoroughly the feature you'd like to see implemented, ideally with **sample code and expected output**.

Finally, consider tackling the feature yourself! It's easy and fun!

## Pull Requests
**Yay!** You've finished a feature/bug fix, follow this checklist before you submit:

1. Make sure that you have included a **test** for your fix, ideally tests that should pass and tests that should fail.
2. If there is an issue that is relevant, **reference** it in the description (i.e. Fixes #13) to give more context and update the issue.
3. **Describe** as best as you can your changes, and ideally why you've done it the way you have. It might not be obvious to others.
4. **Add your name** to the [Contributors list](https://github.com/aurbano/robinhood-node#contributors) on the Readme!

Go drink a beer!
