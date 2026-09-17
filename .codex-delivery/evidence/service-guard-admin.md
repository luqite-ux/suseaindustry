# Service guard administrator-path verification

The Production login route returned HTTP 303 with both tenant and session cookies. The authenticated `/admin` request returned HTTP 200 with the current customer identity. `/admin`, `/admin/login`, `/api`, `/_next`, favicon and static assets are excluded before public-site service evaluation.

Result: **PASS**
