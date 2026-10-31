#!/usr/bin/env bash
# Forward mail received at contact@jaklabs.io to a real inbox.
#
#   FORWARD_TO=<inbox> infrastructure/create-inbound-mail.sh           # provision / update
#   infrastructure/create-inbound-mail.sh --check                      # report, change nothing
#
# Set up 2026-10-31 at JD's request. Before this, contact@jaklabs.io delivered ONLY to the
# WorkMail mailbox contact@hasletthandyman.info (it is an alias on it) — which is the same
# mailbox the Haslett energy-programme notes describe as "the unmonitored contact@ mailbox",
# where two BBB complaints died and produced the F rating now sitting in front of the
# Michigan Saves and MiHER applications. 97 MB had accumulated in it. So the agency's
# published front door was arriving somewhere with a documented history of nobody reading it.
#
# ⚠️ IT DOES NOT TOUCH DNS, AND THERE IS NO --mx FLAG. jaklabs.io already has an MX pointing
# at SES (10 inbound-smtp.us-east-1.amazonaws.com) because the WorkMail organisation set it
# up. The sibling script in morrell-crm needed one; this does not, and offering the flag
# would be offering to break live mail for the whole domain. The MX is ASSERTED below and
# the script refuses to run if it has changed.
#
# ⚠️ WORKMAIL KEEPS ITS COPY. This rule is ADDITIVE and carries no StopAction, so mail lands
# in FORWARD_TO *and* still reaches the mailbox as an archive. Removing jaklabs.io from the
# WorkMail rule's recipients would mean editing `m-76c90ae2...`, the rule that carries ALL
# of Haslett's mail including the work-order intake that bills — a live-money blast radius
# to gain nothing a second delivery does not already give us. THE HASLETT RULE applies: this
# changes nothing about Haslett's invoices, payouts or crew app.
#
# ⚠️ ORDERED BEFORE THE WORKMAIL RULE, ON PURPOSE. AWS documents StopAction as the way to
# halt rule evaluation, but whether a WorkmailAction also ends it is not something this
# script should bet the agency's inbound mail on: if it does, and this rule sat after it,
# the forward would silently never fire and a quiet inbox would be the only symptom. Placing
# it first makes the question irrelevant. The check at the end FAILS if that order ever
# drifts, because position is the one property of this rule that nothing else would notice.
#
# ⚠️ FORWARD_TO is passed in, never written in this file — it is a person's inbox, and this
# repo is public-adjacent. Read the live value back with:
#   aws lambda get-function-configuration --function-name jaklabs-mail-forwarder \
#     --query 'Environment.Variables.FORWARD_TO' --output text
#
# ⚠️ The receipt rule set INBOUND_MAIL is SHARED with Haslett's work-order intake, the
# WorkMail rule and Morrell's two rules. This script only adds or updates its own rule, by
# name, and never rewrites the set.
set -euo pipefail
REGION=us-east-1
ACCOUNT=706558533041
HERE="$(cd "$(dirname "$0")" && pwd)"
DOMAIN=jaklabs.io
ADDRESS="contact@$DOMAIN"
BRAND='JAK Labs'
BUCKET="jaklabs-inbound-mail-$ACCOUNT"
PREFIX=contact/
FN=jaklabs-mail-forwarder
ROLE=JakLabsMailForwarderRole
RULESET=INBOUND_MAIL
RULE=jaklabs-contact
AFTER=haslett-workorder-intake     # so this lands BEFORE the WorkMail rule
WORKMAIL_RULE=m-76c90ae2070d430c8da9e93f1cf82d3e
EXPECTED_MX='10 inbound-smtp.us-east-1.amazonaws.com'
RULE_ARN="arn:aws:ses:$REGION:$ACCOUNT:receipt-rule-set/$RULESET:receipt-rule/$RULE"

say()  { printf '  %s\n' "$*"; }
fail() { printf '  FAIL: %s\n' "$*" >&2; exit 1; }

# ── checks that must hold before anything is changed ────────────────────────────
MX=$(dig +short MX "$DOMAIN" | sed 's/\.$//' | tr -d '\r' | head -1)
[ "$MX" = "$EXPECTED_MX" ] || fail "MX for $DOMAIN is '$MX', expected '$EXPECTED_MX'. Mail is not coming through SES; stopping rather than creating a rule that can never fire."
say "MX: $MX"
aws ses describe-receipt-rule --rule-set-name "$RULESET" --rule-name "$WORKMAIL_RULE" --region "$REGION" >/dev/null 2>&1 \
  || fail "the WorkMail rule $WORKMAIL_RULE is not in $RULESET; the ordering assumption above no longer holds."
aws sesv2 get-email-identity --email-identity "$DOMAIN" --region "$REGION" >/dev/null 2>&1 \
  || fail "$DOMAIN is not a verified SES identity, so the forwarder could not send From $ADDRESS."
say "SES identity $DOMAIN verified; WorkMail rule present"

report_order() {
  python3 - "$RULE" "$WORKMAIL_RULE" <<'PY'
import json,subprocess,sys
rule,wm=sys.argv[1],sys.argv[2]
rs=json.loads(subprocess.run(['aws','ses','describe-active-receipt-rule-set','--output','json'],
    capture_output=True,text=True,check=True).stdout)
names=[r['Name'] for r in rs['Rules']]
print('  order: '+' -> '.join(names))
# ⚠️ ABSENT EXITS NON-ZERO. An earlier version returned 0 here, so `--check` reported
# "NOT PRESENT" and then told its caller everything was fine -- a guard whose broken state
# is indistinguishable from its healthy one (fleet rule 5). 4 = absent, 3 = wrong order.
if rule not in names: print('  %s: NOT PRESENT'%rule); sys.exit(4)
i,j=names.index(rule),names.index(wm)
print('  %s at %d, WorkMail at %d: %s'%(rule,i,j,'OK (before)' if i<j else 'WRONG -- after WorkMail'))
sys.exit(0 if i<j else 3)
PY
}

if [ "${1:-}" = "--check" ]; then
  report_order; rc=$?
  aws lambda get-function-configuration --function-name "$FN" --region "$REGION" \
    --query '{Runtime:Runtime,Brand:Environment.Variables.BRAND,From:Environment.Variables.FROM_ADDRESS,Modified:LastModified}' \
    --output json 2>/dev/null || say "function $FN: absent"
  exit $rc
fi

FORWARD_TO="${FORWARD_TO:?set FORWARD_TO to the inbox that should receive $ADDRESS mail}"

# ── bucket: private, encrypted, 90-day retention ────────────────────────────────
if ! aws s3api head-bucket --bucket "$BUCKET" 2>/dev/null; then
  aws s3api create-bucket --bucket "$BUCKET" --region "$REGION" >/dev/null
  say "bucket created: $BUCKET"
fi
aws s3api put-public-access-block --bucket "$BUCKET" --public-access-block-configuration \
  BlockPublicAcls=true,IgnorePublicAcls=true,BlockPublicPolicy=true,RestrictPublicBuckets=true
aws s3api put-bucket-encryption --bucket "$BUCKET" --server-side-encryption-configuration \
  '{"Rules":[{"ApplyServerSideEncryptionByDefault":{"SSEAlgorithm":"AES256"}}]}'
aws s3api put-bucket-lifecycle-configuration --bucket "$BUCKET" --lifecycle-configuration \
  '{"Rules":[{"ID":"expire-90d","Status":"Enabled","Filter":{"Prefix":""},"Expiration":{"Days":90}}]}'
aws s3api put-bucket-policy --bucket "$BUCKET" --policy "$(cat <<JSON
{"Version":"2012-10-17","Statement":[{"Sid":"SesWritesOnlyFromThisRule","Effect":"Allow",
 "Principal":{"Service":"ses.amazonaws.com"},"Action":"s3:PutObject",
 "Resource":"arn:aws:s3:::$BUCKET/$PREFIX*",
 "Condition":{"StringEquals":{"AWS:SourceAccount":"$ACCOUNT"},"ArnLike":{"AWS:SourceArn":"$RULE_ARN"}}}]}
JSON
)"
say "bucket: private, AES256, 90-day expiry, writable only by rule $RULE"

# ── role: read its own prefix, send only as contact@ ────────────────────────────
# ⚠️ The Deny is not decoration. This function lives in an account that also holds Haslett's
# live money tables and Morrell's PHI plane, and a mail forwarder has no business reaching
# any database at all. Denying dynamodb outright is both strictly correct and the version
# that cannot rot as tables are added; the PHI tables and their CMK are named as well so the
# intent survives anyone who later decides the broad Deny is inconvenient.
if ! aws iam get-role --role-name "$ROLE" >/dev/null 2>&1; then
  aws iam create-role --role-name "$ROLE" --assume-role-policy-document \
    '{"Version":"2012-10-17","Statement":[{"Effect":"Allow","Principal":{"Service":"lambda.amazonaws.com"},"Action":"sts:AssumeRole"}]}' >/dev/null
  say "role created: $ROLE"
  sleep 10   # IAM is eventually consistent; Lambda rejects a role it cannot yet see.
fi
aws iam attach-role-policy --role-name "$ROLE" \
  --policy-arn arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole
aws iam put-role-policy --role-name "$ROLE" --policy-name JakLabsMailForward --policy-document "$(cat <<JSON
{"Version":"2012-10-17","Statement":[
 {"Sid":"ReadReceivedMail","Effect":"Allow","Action":"s3:GetObject","Resource":"arn:aws:s3:::$BUCKET/$PREFIX*"},
 {"Sid":"SendOnlyAsContact","Effect":"Allow","Action":["ses:SendEmail","ses:SendRawEmail"],"Resource":"*",
  "Condition":{"StringEquals":{"ses:FromAddress":"$ADDRESS"}}},
 {"Sid":"NoDatabaseEver","Effect":"Deny","Action":["dynamodb:*"],"Resource":"*"},
 {"Sid":"NeverTouchThePhiPlane","Effect":"Deny","Action":["dynamodb:*","kms:*"],
  "Resource":["arn:aws:dynamodb:$REGION:$ACCOUNT:table/morrell-crm-care-prod*",
              "arn:aws:dynamodb:$REGION:$ACCOUNT:table/morrell-crm-audit-prod*",
              "arn:aws:kms:$REGION:$ACCOUNT:key/1cbabff1-b111-4589-bef6-86b096eb3c10"]}]}
JSON
)"
say "role: GetObject on $PREFIX, send only From $ADDRESS, Deny on all DynamoDB and the PHI plane"

# ── function ────────────────────────────────────────────────────────────────────
ZIP=$(mktemp -d)/fn.zip
(cd "$HERE/lambda/mail-forwarder" && zip -qr "$ZIP" index.mjs rewrite.mjs)
ENVV="Variables={MAIL_BUCKET=$BUCKET,MAIL_PREFIX=$PREFIX,FROM_ADDRESS=$ADDRESS,BRAND=$BRAND,FORWARD_TO=$FORWARD_TO}"
if aws lambda get-function --function-name "$FN" --region "$REGION" >/dev/null 2>&1; then
  aws lambda update-function-code --function-name "$FN" --zip-file "fileb://$ZIP" --region "$REGION" >/dev/null
  aws lambda wait function-updated --function-name "$FN" --region "$REGION"
  aws lambda update-function-configuration --function-name "$FN" --region "$REGION" --environment "$ENVV" >/dev/null
  aws lambda wait function-updated --function-name "$FN" --region "$REGION"
  say "function updated: $FN"
else
  aws lambda create-function --function-name "$FN" --region "$REGION" --runtime nodejs22.x \
    --handler index.handler --role "arn:aws:iam::$ACCOUNT:role/$ROLE" --timeout 30 --memory-size 256 \
    --zip-file "fileb://$ZIP" --environment "$ENVV" >/dev/null
  aws lambda wait function-active --function-name "$FN" --region "$REGION"
  say "function created: $FN"
fi
aws lambda add-permission --function-name "$FN" --region "$REGION" --statement-id ses-invoke \
  --action lambda:InvokeFunction --principal ses.amazonaws.com \
  --source-account "$ACCOUNT" --source-arn "$RULE_ARN" >/dev/null 2>&1 || true

# ── SES receipt rule: store, then forward ───────────────────────────────────────
RULEJSON=$(cat <<JSON
{"Name":"$RULE","Enabled":true,"TlsPolicy":"Optional","ScanEnabled":true,"Recipients":["$ADDRESS"],
 "Actions":[{"S3Action":{"BucketName":"$BUCKET","ObjectKeyPrefix":"$PREFIX"}},
            {"LambdaAction":{"FunctionArn":"arn:aws:lambda:$REGION:$ACCOUNT:function:$FN","InvocationType":"Event"}}]}
JSON
)
if aws ses describe-receipt-rule --rule-set-name "$RULESET" --rule-name "$RULE" --region "$REGION" >/dev/null 2>&1; then
  aws ses update-receipt-rule --rule-set-name "$RULESET" --rule "$RULEJSON" --region "$REGION"
  say "receipt rule updated: $RULE"
else
  aws ses create-receipt-rule --rule-set-name "$RULESET" --after "$AFTER" --rule "$RULEJSON" --region "$REGION"
  say "receipt rule created: $RULE (after $AFTER, before $WORKMAIL_RULE)"
fi

# ── the order is the thing nothing else would notice ────────────────────────────
report_order || fail "$RULE is ordered AFTER the WorkMail rule. If the WorkMail action ends rule evaluation the forward will never fire, and a quiet inbox is the only symptom. Move it with: aws ses delete-receipt-rule --rule-set-name $RULESET --rule-name $RULE && FORWARD_TO=... $0"
say "done. Mail to $ADDRESS -> s3://$BUCKET/$PREFIX -> $FN -> $FORWARD_TO (and still to WorkMail)"
