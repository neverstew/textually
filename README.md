# textua11y

[Try it out](https://textually.vercel.app)

# Hacktoberfest Submission Notes
## What's the point?
This was a chance for me to combine two things that I've wanted to have more
of an in-depth look at for a while now:

1. supabase
1. a11y in dynamic applications

You can read loads more about my thoughts in the notes.

## Notes
The [notes](/notes) directory for a markdown collection of notes as I
go through the hackathon.

For those of you that use [Obsidian](https://obsidian.md/), you can open it
as a vault and get nice links/rendering.

## Team
Just me!
Twitter: @_mlloydw

## How I Used Supabase
Auth, Data, Realtime, Functions/Triggers engine.

There's a fairly obvious structure to things: users have conversations, conversations have messages. All of those
things appear in realtime with subscriptions.

I bent the auth engine into shape a bit by forcing authentication per-device. There's some weird bits where I'm
forcing sign up using a UUID stored in localStorage but having to fit that into the email pattern that supabase enforces. See [index.svelte](textually/src/routes/index.svelte) and [login](textually/src/routes/[userKey].ts) for a peek at it. This was all done in the name of ease of sign up (especially since some/many people don't have
an email address.)

You can also read more about how I got on in the Day Log below.

# Day Log
## 21/10/09
Time Spent: 8hrs

After yesterday's successes, today just kept on giving. It was GREAT building with
supabase. So fast, so easy.

I wish I could have more time to test the a11y aspects of things. It's really something
that I'll need other people for. (Please raise an issue if you're reading this and
have something - knowing what issues people have will really help me learn how to combat
them in the future!)

## 21/10/09
Time Spent: 3hrs

Finally made it into a groove! A default conversation is created on arrival and the
basis of messages formulated. As per all the hype, creating with supabase is so easy
when combining the table/policy/function UIs with the client/API generated in the
background.

## 21/10/08
Time Spent: 0

Went to the pub. No regrets.

## 21/10/07
Time Spent: 2hrs

Swapped over to [SvelteKit](https://kit.svelte.dev/) to get things going with some solid SSR practices and a11y built
into the linter. Ended up bogged down by an [issue with vite](https://github.com/vitejs/vite/issues/2579) that detracted from building. Very annoying!

In the end I have some basic login functionality working. It'll do for now.

## 21/10/06
Time Spent: 1.5hrs

Decided to skip the gov.uk libraries. It'll introduce too much learning
overhead and detract from me learning the a11y aspects that I'm doing this
for.

Spent some time looking at designs and frustrations with chat options at
the moment. Narrowed down my target audience (see more in [notes](./notes/design/approach.md).

Once that was clear and I have some simple boundaries for attempt one, I
started to craft some simple [designs in figma](https://www.figma.com/file/ETyYKXLLLtQo9YWhn4aWfC/Design?node-id=3%3A18).

Supabase decided to schedule a load of infra updates for today, meaning I
lost a fair amount of time trying to understand why their operations were
going so slowly before giving up.

A small dip of a toe into the next template/build of the first page made it
clear that it's not necessary for me to use next for this project. It will
almost certainly be easier to build in express or similar with a few choice
js scripts to update the page state. This will be the focus of the next
few days.

## 21/10/05
Time spent: 0

Went to a board game cafe instead. Whoops!

## 21/10/04
Time spent: 1hr

Started the hackathon with a bit of research.
Ideas are forming about what to target in the week... Right now I'm thinking
that getting the basics of rooms and chat messages to be accessible will be
more than enough for the time.

Day two should get some wireframes in so I know what to aim for/refer to.
There's an outstanding question about whether the gov.uk UI components might
be helpful or not. This should be easy to work out tomorrow.

