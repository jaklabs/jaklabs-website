---
title: "AI Automation Specialist: the job is making them fail loudly"
slug: ai-automation-specialist-fail-loudly
excerpt: "Post three of ten, and the first one I hold. I have 51 scheduled automations running a real business. Building them was the easy part and not the job."
series: "The Ten"
seriesIndex: 3
category: Engineering
authorName: JD Kemp
status: DRAFT
---

This is the first job on the list I actually do. I have **51 scheduled
automations** running a home-services business — billing, crew payouts, work
order intake, lead capture, close-out. Eighteen of them move real money.

Building them was not the hard part, and it is not the job.

## What people think the job is

Wiring things together. Trigger fires, data moves, something happens without a
human. The demo is always the same: watch this form submission become a CRM
record become an email.

That demo is a Tuesday afternoon. Anyone can do it now, which is exactly why it
is not a career.

## What the job actually is

**Making sure a broken automation looks broken.**

The defining property of automation is that nobody is watching. That is the
point and it is also the entire risk, because the failure mode of an unwatched
job is not an error — it is silence, and silence is what success looks like too.

I have a rule for this that I apply to everything scheduled: *if this were
completely broken, what would I see?* If the answer matches what a healthy system
looks like, the automation is decorative.

Three examples from my own systems, all found in one hour:

A backup script treated a clean working tree as proof that a backup had happened.
It had not — commits sat unpushed for two days while the script sent a green
"healthy again" message five times. **Reassurance is worse than silence.**

A session health-check was the notification. A missing registry, a corrupt
registry and a crashed process each produced exactly the observable of a healthy
fleet: nothing at all.

A contact form on a live website accepted twelve submissions over eight months
and delivered zero emails. Every one returned a success response. The failure
was invisible on every surface anyone was looking at.

None of those were hard to build. All of them were built. Each was wrong in the
one direction that does not generate a complaint.

## The actual skill

Ask of any automation: what does it do when it fails, and how would I find out?

Then make the failure louder than the success. Write a heartbeat — a timestamp
file, a metric, anything that lets you tell *"nothing went wrong"* apart from
*"nothing ran."* Those two states look identical from the outside and they are
completely different facts.

And never let a proxy stand in for the thing you are guaranteeing. The proxy
drifts, and the guard quietly un-guards itself while continuing to report that
everything is fine.

## Why this is a real career and not a tool skill

Because the tools keep getting better at the building and no better at the
watching. Every generation of automation software makes the wiring easier and
leaves the hard question exactly where it was.

The job is not knowing the tool. It is having been burned enough times to ask
the second question before the incident rather than after it.

## Where I come into this

Most of my work is this: finding the scheduled jobs that fail quietly and making them fail loudly instead. If you have automation touching invoicing, payroll or anything that moves money, [tell me what you are running](/contact) — and if your jobs already have a heartbeat, that is what I will tell you.

*Post 3 of 10. The next is about a job where the hard half is also the
unglamorous half.*
