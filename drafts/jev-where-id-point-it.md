---
title: "Four things I'd point Jev at, and one I wouldn't"
slug: four-things-id-point-jev-at-and-one-i-wouldnt
excerpt: "A model that returns typed values with calibrated confidence instead of prose. I have spent a year taking models out of systems, so here is where I would put this one back in, and the one place I would not."
category: Engineering
authorName: JD Kemp
status: DRAFT
---

I have written before about pulling language models out of systems and replacing
them with lookup tables and regular expressions. Three times in the last year,
and each time the system got better.

So a model whose entire pitch is that it does not write prose is worth my
attention.

**I have not run Jev.** It went into limited early access on 15 September and I
am not in it. Everything below is where I would point it based on systems I
already run, and what I would have to see before I trusted it with any of them.
Take it as a plan, not a review.

## What it actually is

Jev is the first of what TypeSafe AI calls System One models. Their framing is
that it is "a frontier-intelligence function call: unstructured state in, typed
probabilistic decisions out."

It does not generate text. You define the possible outputs in advance, and it
returns one of them along with a calibrated probability and a confidence score.
TypeSafe claim it never makes type errors, supports up to 255 possible answers,
and runs in 70 to 500 milliseconds at $0.042 per million input tokens with output
tokens free.

Those are their numbers, from their launch post. I have not measured any of them.

## The two questions this runs into

When I decide whether something needs a model, I ask two things:

**Does the same input need to produce the same answer next Tuesday?**

**Do I need to explain the answer to someone who disagrees with it?**

If either is yes, I reach for rules. That test has sent me to regex three times,
and I would make the same call again on all three.

Jev does not pass that test. It is a probabilistic model, so next Tuesday is not
guaranteed, and a confidence score is not a reason — it is a number about a
reason nobody can see.

What it changes is the shape of the fork. Until now the choice was a language
model producing prose I would have to parse and could not trust, or rules I had
to write and maintain by hand. There was nothing in between. A typed answer with
a calibrated confidence is a third option, and the interesting part is not the
answer — it is that you can **threshold** it. Below the line, fall through to the
deterministic path or to a person. That is a genuinely different tool from either
thing I had before.

## Where I would point it

### 1. Classifying the rubbish in a cold email list

Recently I sent a few hundred cold emails in batches, and a human reading one
batch before it went out caught five distinct classes of address that should
never have been mailed: placeholder domains, the prospect's own web vendor,
marketing agencies, an error-tracking ingest endpoint, and a set of Canadian
businesses covered by a different anti-spam regime than the one I had coded for.

None of those guards existed the batch before. Every one of them is a rule I
wrote after a person noticed something.

That is the shape of problem I would hand to Jev first. The answer space is
small and closed, a wrong answer costs one skipped email rather than money, and
the alternative is me writing a new rule every time reality produces a category I
had not imagined. I would keep the hand-written rules as a floor — a known-bad
domain stays known-bad — and use the model for the long tail underneath them.

### 2. The industry classifier in my CRM

Every business in my CRM carries exactly one industry, set the day it arrives.
Fourteen categories, twenty-six tests. It is rules today and the rules are fine.

It is also a textbook bounded classification: a closed set well under the
cardinality limit, an input that is genuinely unstructured, and a wrong answer
that costs a mis-filed record rather than anything real. If Jev is good at
anything, it is this, and I would use my existing tests as the benchmark rather
than taking anyone's word for it.

### 3. Triaging what a site audit found

I have audited 456 Michigan wellness and med spa websites. The findings are
mechanical — load times, missing tags, console errors — but deciding which
finding matters most for a particular business is a judgement, and it is the
judgement I make by hand before every conversation.

Ranking a fixed set of findings for a specific business is scoring over a defined
answer space, which is exactly what the thing is sold for. It also map-reduces
over a dataset I already have, which is the other half of their pitch.

### 4. Checking the output of the one language model I do use

There is a single place in my growth tooling where I call a language model: it
drafts copy, and then that copy is verified against a register of rules before
anything can be sent.

The verifier is deterministic today, and the rule-based half stays. But TypeSafe
pitch this model explicitly at guardrailing other models, and a second opinion
that returns a type instead of an opinion is a reasonable thing to put in that
path. If the two disagree, the draft goes to a human. That is not a downgrade —
disagreement is exactly the signal worth catching.

## Where I would not

I maintain a linter that classifies growth tactics as green, yellow or red, each
with the citation that says why. **There is no model call in that classifier, and
there never will be.**

On the surface it looks like the ideal case. Three outputs, a closed set, obvious
classification. It is the most tempting thing in my codebase to point this at,
and it is the one place the answer is no.

Two reasons, and they are the same two questions from earlier.

**A verdict has to be reproducible.** The same tactic, checked twice, has to come
back the same. Not usually the same, and not the same with a confidence of 0.94.
The whole product is that you can rerun it and get the answer you got last month.

**A verdict has to carry a reason.** Not a score — a citation. The output is not
"this is red", it is "this is red, and here is the rule that makes it red." A
calibrated probability tells you how sure the model is. It does not tell you
which statute you are about to break, and a number in place of a citation is
worse than useless in the only conversation that matters.

There is a version I would consider: Jev in front of the classifier, not inside
it. Triage an unknown tactic into "this probably needs a human to write a rule
for it" without ever producing the verdict itself. Unknown still resolves to
yellow, because unknown is not the same as safe, and a model that cannot
hallucinate a type can still be confidently wrong about a law.

## What I would measure first

The claim that matters is not speed and it is not cost. It is this one: higher
confidence means higher accuracy.

That is a testable claim, and it is testable on my data rather than theirs.
Before I thresholded anything on a confidence score I would want to see, on a few
hundred of my own records I had labelled by hand, that the things it was 90 per
cent sure about really were right about nine times in ten. A confidence score you
have not calibrated against your own data is a number that looks like a
measurement.

If it holds, the threshold is the whole product and I would use it in the four
places above. If it does not, then it is a fast classifier with a decoration
attached, which is still useful, but you must not build a fallback path on it.

The rest — the latency, the price, the type safety — is either true or not and is
easy to find out. Calibration is the part that decides whether you can put it in
front of anything that matters.

## If you are weighing this up

Most of my work is exactly this decision: what belongs in a model, what belongs
in a rule, and how you would know if it were wrong. If you are looking at a
System One model for something in your own stack and want a second opinion before
you wire it in, [tell me what you are building](/contact).

If the honest answer is that your rules are fine and you do not need a model at
all, that is what I will tell you. It has been the answer three times out of
three so far.
