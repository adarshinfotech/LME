#!/usr/bin/env bash
# Runs the migration + RLS test suite against a throwaway local Postgres.
# Usage: PGHOST=/path/to/socket-or-host PGPORT=5432 PGUSER=postgres npm run test:db
set -euo pipefail
cd "$(dirname "$0")/.."
DB=lmi_rls_test
PSQL=(psql -v ON_ERROR_STOP=1 -q)
"${PSQL[@]}" -d postgres -c "drop database if exists $DB" -c "create database $DB"
"${PSQL[@]}" -d "$DB" -f tests/stub_supabase.sql
for f in migrations/*.sql; do "${PSQL[@]}" -d "$DB" -f "$f"; done
out=$("${PSQL[@]}" -d "$DB" -A -t -f tests/rls_test.sql 2>&1)
echo "$out" | grep -E '\|t$|NOTICE:  pass' | sed -E 's/^.*NOTICE:  //'
"${PSQL[@]}" -d postgres -c "drop database $DB"
if echo "$out" | grep -qE '\|f$|FAIL'; then echo "RLS tests FAILED"; exit 1; fi
echo "All database tests passed."
