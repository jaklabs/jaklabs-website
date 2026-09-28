---
title: "Digital Infrastructure Architect: the job is knowing what owns what"
slug: digital-infrastructure-architect-knowing-what-owns-what
excerpt: "Post nine of ten, and a job I hold. Ninety-six Lambdas across three sets of infrastructure code. The skill is not building them. It is knowing which thing is allowed to change which."
series: "The Ten"
seriesIndex: 9
category: Engineering
authorName: JD Kemp
status: DRAFT
---

I run the infrastructure for several businesses out of one AWS account: ninety-six
Lambda functions, a few dozen repositories, Terraform in one place, CDK in
another, and a handful of things created by hand years ago that nothing manages
at all.

The architecture part of that job is not the diagram. It is ownership.

## A small example that is the whole job

Last week I moved six functions from one Node runtime to a newer one. Trivial
change. A single field.

Four of the six belonged to a CloudFormation stack. Two belonged to nothing —
created by hand, managed by no code anywhere.

If I had changed all six the obvious way, with a command against each function,
every one would have reported success. The runtime would have updated. Everything
would have looked correct.

And the four managed ones would have been silently reverted the next time anybody
deployed that stack, because a stack's definition wins over whatever you did to
the resource by hand. Not immediately. Weeks later, on an unrelated change, in a
way that would present as *"the runtime bump didn't hold"* with no obvious cause.

So the four went through their stack, where a diff showed exactly four
modifications and nothing else, and the two went through the command line. The
difference between those two paths is not technical difficulty. It is knowing
which is which, and the only way to know is to look — the tags tell you, if you
check them.

## The second half: what does this fail into

The other thing this job is made of is asking what a component does when the
thing beneath it is not there.

Same week, same account: a contact form. It accepted twelve submissions over
eight months and delivered zero emails. Every submission returned success. The
function logged nothing wrong, because nothing was wrong from its point of view —
it handed the message to the email service, which accepted it, and the message
was then dropped silently downstream for a reason no component in my system could
see.

It returned success because it writes to two destinations and either one landing
counts. That is a deliberate and good design — an enquiry should survive one
destination failing. It also meant a total failure of the channel the business
actually watched looked exactly like a healthy system for eight months.

Architecture is largely the practice of noticing that kind of thing before it has
run for eight months. Not by being clever. By asking, of every piece: if this
were completely broken, what would I see?

## Why this is a career and not a task

Because the individual pieces are easy now and there are far more of them.
Provisioning a function, a queue, a table — all trivial, all fast, all
well-documented.

What does not get easier is the relationships: what owns what, what happens when
one of them is absent, and which failures produce no signal at all. That grows
combinatorially with the number of pieces, and the pieces are multiplying because
they are cheap.

The person who can hold that map is not doing the same job as the person who can
create the resources. It only looks similar from outside.

## Where I come into this

If you have infrastructure nobody fully maps any more — some in code, some created by hand, some nobody remembers — that is the normal state and it is worth an afternoon of somebody drawing the ownership. [Tell me what you are running](/contact), and if it turns out to be tidier than you feared, I will say so.

*Post 9 of 10. The last one is the job I did not expect to see on this list.*
