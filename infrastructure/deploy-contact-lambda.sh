#!/usr/bin/env bash
# Deploy lambda/contact/index.mjs to the live jaklabs-contact-form function.
#
#   infrastructure/deploy-contact-lambda.sh            # deploy, then verify
#   infrastructure/deploy-contact-lambda.sh --check    # report drift, change nothing
#
# ⚠️⚠️ THIS FUNCTION IS NOT IN ANY CLOUDFORMATION STACK, AND THAT IS THE WHOLE REASON THIS
# SCRIPT EXISTS. `JakLabsApiStack` holds jaklabs-audit, jaklabs-blogs and jaklabs-categories
# and NOT this one (nor jaklabs-media) -- these are the two functions the fleet harness
# refers to as "in no stack", without naming them. So `cdk diff` reports
# "There were no differences" for a changed lambda/contact/index.mjs, and `cdk deploy` would
# SUCCEED while deploying nothing. Verified 2026-10-31 by changing the source and watching
# cdk diff report clean on all four stacks. A deploy that succeeds without deploying is the
# worst available outcome, because the change gets reported as live.
#
# ⚠️ The deployed package is `index.mjs` AND NOTHING ELSE -- no node_modules. The handler
# imports @aws-sdk/client-ses, client-dynamodb and lib-dynamodb, all of which the nodejs22
# runtime provides. Do not "fix" that by vendoring the SDK; do check it still holds if the
# runtime ever moves, because a native or bundled dependency fails at runtime and on a
# delay (see jaklabs-audit and its Chromium).
#
# ⚠️ IT VERIFIES BY READING THE CODE BACK OUT OF AWS, not by trusting the API's 200. The
# function's own comments record a bug where SES accepted a send and the mail silently never
# arrived; the lesson generalises -- a successful call is not a deployed artifact.
set -euo pipefail
REGION=us-east-1
FN=jaklabs-contact-form
HERE="$(cd "$(dirname "$0")" && pwd)"
SRC="$HERE/lambda/contact/index.mjs"

say()  { printf '  %s\n' "$*"; }
fail() { printf '  FAIL: %s\n' "$*" >&2; exit 1; }

[ -f "$SRC" ] || fail "missing $SRC"

# The recipient must match what the site publishes. test/contact.test.mjs asserts this too;
# it is re-checked here because this script can be run without running the suite.
PUB=$(grep -oE "export const EMAIL = '[^']+'" "$HERE/../src/lib/business.ts" | sed "s/.*'\(.*\)'/\1/")
RCP=$(grep -oE "^const RECIPIENT_EMAIL = '[^']+'" "$SRC" | sed "s/.*'\(.*\)'/\1/")
[ -n "$PUB" ] && [ -n "$RCP" ] || fail "could not read the published address or the recipient"
[ "$PUB" = "$RCP" ] || fail "the form sends to '$RCP' but the site publishes '$PUB' -- that is the exact fault this handler was written to fix"
say "recipient matches the published address: $RCP"

deployed_recipient() {
  local d; d=$(mktemp -d)
  local url; url=$(aws lambda get-function --function-name "$FN" --region "$REGION" --query 'Code.Location' --output text)
  curl -sS -o "$d/fn.zip" "$url" || return 1
  (cd "$d" && unzip -o -q fn.zip) || return 1
  grep -oE "^const RECIPIENT_EMAIL = '[^']+'" "$d/index.mjs" | sed "s/.*'\(.*\)'/\1/"
}

if [ "${1:-}" = "--check" ]; then
  LIVE=$(deployed_recipient) || fail "could not read the deployed package"
  say "repo recipient:     $RCP"
  say "deployed recipient: $LIVE"
  [ "$LIVE" = "$RCP" ] && { say "in sync"; exit 0; } || { printf '  DRIFT: the live function still sends to %s\n' "$LIVE" >&2; exit 3; }
fi

ZIP=$(mktemp -d)/fn.zip
(cd "$HERE/lambda/contact" && zip -qr "$ZIP" index.mjs)
aws lambda update-function-code --function-name "$FN" --zip-file "fileb://$ZIP" --region "$REGION" >/dev/null
aws lambda wait function-updated --function-name "$FN" --region "$REGION"
say "code uploaded"

LIVE=$(deployed_recipient) || fail "deployed, but could not read the package back to confirm"
[ "$LIVE" = "$RCP" ] || fail "uploaded, but the live function still reports '$LIVE' -- do NOT treat this as deployed"
say "verified from AWS: the live function sends to $LIVE"
