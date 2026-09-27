---
title: "One payment, three bugs, and none of them in the guardrails"
slug: one-payment-three-bugs-none-in-the-guardrails
excerpt: "My first live x402 settlement cost half a cent. The payment worked first time. Getting to it took three fixes, and every one was drift between what the scaffold was written against and what actually exists."
category: Engineering
tags: [x402, agentic-payments, base, usdc, guardrails, ai-agents]
coverImage: https://d2ei57nf9fqty3.cloudfront.net/blog/one-payment-three-bugs-none-in-the-guardrails/cover-v5.png
authorName: JD Kemp
status: DRAFT
---

Last week a program I wrote paid for something without me entering a card. Half
a cent, in USDC, on Base, for a sanctions screen. No invoice, no API key, no
signup — the server said "that'll be $0.005", the client settled it, and the
answer came back.

I ran it. It is a demo script, not an autonomous agent loose with a wallet, and
the distinction matters more at the end of this post than at the start.

The payment itself worked on the first attempt. What took the afternoon was
everything around it, and the shape of those failures is the part worth writing
down: **none of the three blockers were in the payment logic or the spend
guards.** All three were drift between what the scaffold had been written
against and what actually exists today.

## What x402 actually is

HTTP has had a `402 Payment Required` status code reserved since 1997 and
unused for almost all of it. x402 gives it a body. You request a paid endpoint,
get back a 402 carrying the price, the asset, the chain and where to pay, you
settle, and you retry with proof.

The part that makes it interesting for agents is that there is no account. No
key to provision, no billing relationship, no human in a signup flow. A process
that holds a wallet can buy one call from a provider it has never met.

That is also the part that should make you nervous, which is why I built the
guardrails before the wallet had anything in it.

## Picking something real to buy

The endpoint in my scaffold was a placeholder that 404s. There was nothing to
pay and no way to know that without looking.

**Probing is free, so probe before you fund anything.** An x402 challenge costs
nothing by construction — the 402 comes back before any money moves — so you can
prove the request and response shape with an empty wallet.

I settled on OFAC sanctions screening: `2s.io/api/crypto/address-screen`, $0.005
a call, which checks a wallet address against the US Treasury SDN list. It is
conformant — the unpaid request returns a 402 whose body carries `x402Version`,
`accepts`, `amount`, `asset`, `payTo` and a timeout — and that turned out to be
a deciding property rather than a given.

I checked the asset address rather than assuming it: `0x8335…2913` on chain
8453, native USDC on Base. An asset address is exactly the field where a typo
sends real money somewhere unrecoverable.

It also had to be something I would genuinely use. I already run a service that
watches and scores on-chain wallets, and whether an address is on the SDN list
is a real input to that score. A demo that buys something useless teaches you
the plumbing and nothing about whether the plumbing was worth laying.

## The settlement

```
0.004998 USDC on Base
block 51625609
wallet 4.880000 → 4.875002
ETH spent: 0
```

Zero ETH, because the facilitator submits the transaction and covers gas — the
protocol claims this and it is true. My wallet never touched the gas; a
different address paid it and my USDC moved in the same transaction.

Four and a half thousandths of a dollar. It is a rounding error, and it is also
the first time software I wrote decided to spend money and then did.

## The three bugs

### 1. A dead import with a confession written on it

```python
from cdp import CdpClient  # noqa: F401
```

Imported, never used — and the `noqa` says so out loud, because the linter had
already noticed and been told to be quiet.

That line meant live mode demanded a Coinbase Developer Platform account and an
API key. So I created one. The signing in this codebase has always been
`eth_account`; no code path here has ever needed CDP. I was sent to sign up for
a service to satisfy an import that did nothing.

A suppressed warning is a note from someone who saw the problem and decided not
to deal with it. Read them.

### 2. The error message named a file nothing reads

```
Set X402_WALLET_PRIVATE_KEY in .env
```

Nothing in the repo opened `.env`.

This is worse than having no instruction at all. Following it exactly produced
the *identical* failure to ignoring it, so the one step I had done correctly
became the step I doubted. I went back and re-checked that file three times.

An instruction that cannot succeed is a trap, and it is a trap specifically for
the person doing what they were told. I fixed it with about eight lines of
stdlib rather than adding a dependency to read one file.

### 3. The SDK had moved underneath it

`requirements.txt` said `x402>=0.1`. Installed was `2.23.0`.

`x402.clients.httpx` no longer exists. The hooks API that replaced it is
deprecated, and the reason is written in its own docstring: *"Event hooks cannot
modify responses in httpx."* Which is precise and fatal — a hook cannot swap a
402 for the paid 200. The whole point of the integration is the swap.

The working path is a transport wrapper. Build the client, register the payment
scheme with a signer on `eip155:8453`, run it.

`>=0.1` is not a version constraint. It is a hope.

## The pattern

Three bugs, one shape. Every one of them was code written against a world that
had since moved: an SDK that reorganised, an instruction that was true once, an
import that mattered in an earlier draft.

None of them were in the guard. The spend caps, the host allowlist, the
per-call ceiling — all of that behaved exactly as written, because I had tested
it against a clock and a fake ledger before any of this was real.

The lesson I take is not "check your dependencies". It is that **the dangerous
code is the code nobody has executed recently.** A guardrail you exercise in
tests every day is in better shape than the setup path you ran once, six months
ago, in a slightly different world.

## The ordering is the safety property

One thing I did not change, and would not:

`guard.authorize()` approves a specific amount *before* anything is signed. The
SDK then re-reads the 402 itself, and the amount it settles is checked against
the amount that was authorised. A provider that quotes $0.005 and tries to
settle $5 is refused, not absorbed.

That ordering is the entire safety property. Everything else here — the caps,
the allowlist, the audit log — is bookkeeping around it. If you take one thing
from this: authorise a number, then let the payment prove it matches. Never let
the thing being paid tell you afterwards what it charged.

## Would I ship an agent that pays for things?

For this? Yes — with caps, an allowlist, and an append-only log of every
decision including the refusals, which is what I have.

For anything larger, not yet. Not because the protocol is unsound; it did
exactly what it said. Because the failure I have not solved is an agent being
*persuaded* to buy something — the caps stop it spending too much, they do not
stop it spending correctly on the wrong thing.

That is a harder problem than gas, and nobody has finished it.

*There is a fourth bug in this story — a dry run that consumed the real spend
caps, so rehearsals could exhaust a budget having spent nothing. That one is
worth its own post.*
