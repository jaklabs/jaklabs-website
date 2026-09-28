---
title: "Data Storyteller: the story is the easy half"
slug: data-storyteller-the-story-is-the-easy-half
excerpt: "Post seven of ten. Anything can make a chart now. The scarce skill moved to the part before the chart, and almost nobody is hiring for it."
series: "The Ten"
seriesIndex: 7
category: Engineering
authorName: JD Kemp
status: DRAFT
---

The pitch for this job is that data alone does not persuade anyone, so you need
somebody who can turn a spreadsheet into a narrative an executive will act on.

That was true and it is now mostly automated. Point a model at a dataset and you
will get a clear chart, a headline finding and three bullet points, in about the
time it takes to describe what you want. The storytelling half of data
storytelling is no longer scarce.

What is scarce is being able to say whether the number is true.

## The failure this job should exist to prevent

I run a trading system that I have written about before. Three hundred and
seventeen tests, and it found six real correctness bugs — four of which were the
same bug: logic written for long positions, applied to shorts.

Not one of those was visible by reading the code. And critically, not one was
visible in the output either. The system produced numbers the whole time. They
were plausible, they were well-formatted, and several of them were wrong in ways
that would have supported a confident story about an edge that did not exist.

A data storyteller handed that output would have told a compelling story. The
chart would have been clean. The narrative would have been persuasive. It would
also have been fiction, and nothing in the storytelling process would have caught
it, because storytelling operates downstream of the number.

## The three questions that actually matter

These are the ones I ask of any figure before it goes anywhere:

**Can two real things share this value?** Addresses, names, emails and filenames
are attributes, not identities. Joining on one is how a report ends up counting
one property's four work orders as four different customers. I have made this
mistake four separate times, which is why it is first.

**What does this return when it fails?** Never a plausible-looking default. A
timeout that returns an empty string scores an actively maintained project as
abandoned. A missing measurement and a measured zero are different facts and must
never produce the same number.

**Was this knowable at the time?** A signal computed from data that only exists
after the outcome is look-ahead bias wearing a chart. Every derived value needs
to carry its source and its as-of moment, or it is a story about the future told
with the future already in it.

## Where the career actually is

Not in visualisation, and not in narrative. Both are commodity now.

It is in provenance: being the person who can say where a number came from,
whether it was knowable when it was computed, what it does when the source is
missing, and which two things it might be conflating. That work is unglamorous,
it does not demo well, and it is the only part a model cannot do for you —
because the model has no privileged access to whether the number is true either.
It will read a plausible figure, find it plausible, and build you a beautiful
chart.

If you want this job to survive the decade, be the person who checks. The person
who narrates has already been replaced and has not noticed.

## Where I come into this

If you are making decisions off a dashboard nobody has audited, the useful exercise is not a better chart. It is asking the three questions above of every figure on it. [Tell me what you are measuring](/contact), and if the numbers hold up I will tell you they do.

*Post 7 of 10.*
