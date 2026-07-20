# Riverside Rebuild — Round 24: Transfer News Refresh (Pre-Launch)

Paste into Claude Code once the deploy-prep round is confirmed done. This
is a data-accuracy pass based on real, dated transfer news as of July
2026 — some items are solid, one needs verification before acting.

## 1. Matt Targett — now fully confirmed, resolve the old flag

Confirmed definitively: his loan from Newcastle was not made permanent.
This closes the ambiguity flagged back in round2/round12. Verify he's
fully excluded from squad data and not appearing as a Sign target — if
he's still present anywhere, remove him.

## 2. Morgan Rogers sell-on event — update destination to Chelsea

The round6 event randomised the buying club among four speculative
options (Arsenal/Chelsea/PSG/Man Utd). Real reporting has since firmed up
specifically on Chelsea. Update the event copy to name Chelsea directly
rather than randomising a club — keep the fee randomised within the
previously-established range (£90-130m, Boro's cut at 20%) since no
confirmed final fee is available yet, just fix the destination.

## 3. Morgan Whittaker is significantly undervalued

Real market value per TransferFeed: approximately €18m (~£15.5m). This is
the same category of issue as the Sol Brynn and Riley McGree corrections
— the formula-based valuation almost certainly has him far below this.
Check his current in-game value and correct it against this real figure.

## 4. Check Hamilton, Dieng, and Burgzorg against the tag-accuracy system

TransferFeed currently lists all three as having active transfer
speculation ("potential transfer being considered by the club or the
player"). Hamilton's KEY ASSET tag was already corrected in round17 —
verify Dieng and Burgzorg aren't currently showing as settled/KEY ASSET
when their real situations suggest otherwise. Apply the same
self-consistency logic from round11 (don't tag KEY ASSET where real
situational facts contradict it).

## 5. Add Otto Rosengren to Project tier — with the real complication intact

Malmö FF, Swedish, 23, midfielder, one senior Sweden cap. Real, live
rumour — one Swedish outlet has Boro as favourites for his signature.
**But also real:** more recent domestic (Teesside) reporting says he's
likely to be ruled out specifically over work permit eligibility, despite
the interest. This is good material, not a reason to exclude him — tag him
with something reflecting that real uncertainty (e.g. a "WORK PERMIT
DOUBT" chip alongside whatever tier tags normally apply), rather than
presenting him as a clean, straightforward signing. This is exactly the
kind of texture the Project tier should have — genuine scouting interest
complicated by a real-world obstacle.

## 6. Needs verification, don't act on this without checking first

One lower-reliability source claims Boro have completed a permanent
signing of a player named Leo Castledine *from Chelsea* this summer. This
directly conflicts with existing squad data, which already has a Leo
Castledine modeled as an existing Boro academy player (age 20, subject of
the round11 tag-accuracy fix). That same source also contained at least
one claim that looks incorrect on its face, so treat it as unreliable
rather than authoritative. **Don't overwrite the existing Castledine data
based on this alone** — if there's a way to verify from a better source
whether this is a real transfer involving a different or the same player,
do that first; otherwise leave the existing data as-is and flag this as
unresolved rather than guessing.

## Definition of done

- Targett fully absent from all data, confirmed
- Rogers event references Chelsea specifically
- Whittaker's value corrected against the real €18m figure
- Dieng and Burgzorg checked against tag logic, corrected if needed
- Rosengren added to Project tier with the work-permit-doubt tag intact
- Castledine discrepancy left unresolved and flagged, not silently
  overwritten based on the unreliable source
