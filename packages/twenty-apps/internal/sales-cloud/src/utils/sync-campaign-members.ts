import { CampaignMemberStatus } from 'src/constants/campaign-options';
import { formatLeadFullName } from 'src/utils/build-lead-conversion-plan';
import { fetchAll } from 'src/utils/fetch-all';
import { type CrmClient, type FullName } from 'src/utils/lead-conversion-types';

type MemberRecord = {
  id: string;
  name?: string | null;
  memberStatus?: string | null;
  respondedAt?: string | null;
  campaign?: { name?: string | null } | null;
  lead?: { id: string; name?: FullName | null } | null;
  person?: { name?: FullName | null } | null;
};

const fullName = (name?: FullName | null) =>
  formatLeadFullName({ id: '', name: name ?? null });

// Fills an empty name, and stamps the first time a member responded. A typed
// name and an existing response time are never replaced.
export const computeMemberPatch = (
  member: MemberRecord,
  now: Date,
): Record<string, unknown> | null => {
  const patch: Record<string, unknown> = {};
  const who = fullName(member.person?.name) || fullName(member.lead?.name);
  const name = [member.campaign?.name?.trim(), who].filter(Boolean).join(' - ');

  if (!member.name?.trim() && name) {
    patch.name = name;
  }

  if (member.memberStatus === CampaignMemberStatus.RESPONDED && !member.respondedAt) {
    patch.respondedAt = now.toISOString();
  }

  return Object.keys(patch).length > 0 ? patch : null;
};

export const syncCampaignMembers = async (
  client: CrmClient,
  memberIds: string[],
  now: Date = new Date(),
): Promise<void> => {
  if (memberIds.length === 0) {
    return;
  }

  const members = await fetchAll<MemberRecord>(
    client,
    'campaignMembers',
    { id: { in: [...new Set(memberIds)] } },
    {
      id: true,
      name: true,
      memberStatus: true,
      respondedAt: true,
      campaign: { name: true },
      lead: { id: true, name: { firstName: true, lastName: true } },
      person: { name: { firstName: true, lastName: true } },
    },
  );

  for (const member of members) {
    const patch = computeMemberPatch(member, now);

    if (patch) {
      await client.mutation({
        updateCampaignMember: { __args: { id: member.id, data: patch }, id: true },
      });
    }
  }
};
