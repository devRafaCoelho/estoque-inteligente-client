import GroupAddOutlinedIcon from "@mui/icons-material/GroupAddOutlined";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CircularProgress from "@mui/material/CircularProgress";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useCallback, useEffect, useState } from "react";
import ConfirmDialog from "../../../../components/common/ConfirmDialog/ConfirmDialog";
import EmptyState from "../../../../components/common/EmptyState/EmptyState";
import FormDialog from "../../../../components/common/FormDialog/FormDialog";
import LoadingButton from "../../../../components/common/LoadingButton/LoadingButton";
import { useAppSnackbar } from "../../../../hooks/useAppSnackbar";
import { ApiError } from "../../../../services/apiClient";
import {
  createHousehold,
  getMyHousehold,
  inviteHouseholdMember,
  leaveHousehold,
  listHouseholdInvites,
  listHouseholdMembers,
  removeHouseholdMember,
  revokeHouseholdInvite,
  updateHousehold,
} from "../../../../services/householdService";
import { formOutlinedInputMinHeightSx } from "../../../../styles/formStyles";
import { HOUSEHOLD_SECTION_COPY as COPY } from "../householdCopy";
import { sectionCardContentSx } from "../MyAccountPage.styled";

function memberDisplayName(member) {
  const name = [member.firstName, member.lastName].filter(Boolean).join(" ").trim();
  return name || member.email || member.userId;
}

/**
 * Seção Conta familiar em Minha Conta (F3-4.3 + ações F3-4.4).
 *
 * @param {{ currentUserId?: string }} props
 */
export default function HouseholdSection({ currentUserId }) {
  const { success, error } = useAppSnackbar();
  const [loading, setLoading] = useState(true);
  const [household, setHousehold] = useState(null);
  const [membership, setMembership] = useState(null);
  const [members, setMembers] = useState([]);
  const [invites, setInvites] = useState([]);
  const [createOpen, setCreateOpen] = useState(false);
  const [createName, setCreateName] = useState("");
  const [creating, setCreating] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editName, setEditName] = useState("");
  const [editing, setEditing] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviting, setInviting] = useState(false);
  const [leaveOpen, setLeaveOpen] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const [removeTarget, setRemoveTarget] = useState(null);
  const [removing, setRemoving] = useState(false);

  const isOwner = membership?.role === "owner";
  const ownerHasOtherMembers =
    isOwner && members.some((m) => m.role !== "owner" || m.userId !== currentUserId);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const me = await getMyHousehold();
      setHousehold(me.household || null);
      setMembership(me.membership || null);

      if (!me.household?.id) {
        setMembers([]);
        setInvites([]);
        return;
      }

      const membersRes = await listHouseholdMembers(me.household.id);
      setMembers(membersRes.members || []);

      if (me.membership?.role === "owner") {
        const invitesRes = await listHouseholdInvites(me.household.id);
        setInvites(invitesRes.invites || []);
      } else {
        setInvites([]);
      }
    } catch (err) {
      error(err instanceof ApiError ? err.message : COPY.loadError);
    } finally {
      setLoading(false);
    }
  }, [error]);

  useEffect(() => {
    load();
  }, [load]);

  const onCreate = async (e) => {
    e.preventDefault();
    const name = createName.trim();
    if (name.length < 2) return;
    setCreating(true);
    try {
      await createHousehold({ name });
      setCreateOpen(false);
      setCreateName("");
      success(COPY.createSuccess);
      await load();
    } catch (err) {
      error(err instanceof ApiError ? err.message : COPY.createError);
    } finally {
      setCreating(false);
    }
  };

  const openEdit = () => {
    setEditName(household?.name || "");
    setEditOpen(true);
  };

  const onEdit = async (e) => {
    e.preventDefault();
    if (!household?.id) return;
    const name = editName.trim();
    if (name.length < 2) return;
    setEditing(true);
    try {
      await updateHousehold(household.id, { name });
      setEditOpen(false);
      success(COPY.editSuccess);
      await load();
    } catch (err) {
      error(err instanceof ApiError ? err.message : COPY.editError);
    } finally {
      setEditing(false);
    }
  };

  const onInvite = async (e) => {
    e.preventDefault();
    if (!household?.id || !inviteEmail.trim()) return;
    setInviting(true);
    try {
      const result = await inviteHouseholdMember(household.id, {
        email: inviteEmail.trim(),
      });
      setInviteEmail("");
      if (result?.token && typeof navigator !== "undefined" && navigator.clipboard) {
        const link = `${window.location.origin}/conta-familiar/convite?token=${encodeURIComponent(result.token)}`;
        try {
          await navigator.clipboard.writeText(link);
          success(COPY.inviteSuccessWithLink);
        } catch {
          success(COPY.inviteSuccess);
        }
      } else {
        success(COPY.inviteSuccess);
      }
      await load();
    } catch (err) {
      error(err instanceof ApiError ? err.message : COPY.inviteError);
    } finally {
      setInviting(false);
    }
  };

  const onRevokeInvite = async (inviteId) => {
    if (!household?.id) return;
    try {
      await revokeHouseholdInvite(household.id, inviteId);
      success(COPY.revokeInviteSuccess);
      await load();
    } catch (err) {
      error(err instanceof ApiError ? err.message : COPY.revokeInviteError);
    }
  };

  const onConfirmRemove = async () => {
    if (!household?.id || !removeTarget) return;
    setRemoving(true);
    try {
      await removeHouseholdMember(household.id, removeTarget.userId);
      setRemoveTarget(null);
      success(COPY.removeMemberSuccess);
      await load();
    } catch (err) {
      error(err instanceof ApiError ? err.message : COPY.removeMemberError);
    } finally {
      setRemoving(false);
    }
  };

  const onConfirmLeave = async () => {
    if (!household?.id) return;
    setLeaving(true);
    try {
      await leaveHousehold(household.id);
      setLeaveOpen(false);
      success(COPY.leaveSuccess);
      await load();
    } catch (err) {
      error(err instanceof ApiError ? err.message : COPY.leaveError);
    } finally {
      setLeaving(false);
    }
  };

  return (
    <Card>
      <CardContent sx={sectionCardContentSx}>
        <Typography variant="h6" fontWeight={700} color="primary.dark">
          {COPY.title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {COPY.subtitle}
        </Typography>

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 3 }}>
            <CircularProgress size={28} />
          </Box>
        ) : !household ? (
          <EmptyState
            size="sm"
            icon={GroupAddOutlinedIcon}
            title={COPY.emptyTitle}
            description={COPY.emptyDescription}
            action={
              <Button variant="contained" onClick={() => setCreateOpen(true)}>
                {COPY.createLabel}
              </Button>
            }
          />
        ) : (
          <Stack spacing={2}>
            <Box>
              <Stack
                direction="row"
                alignItems="flex-start"
                justifyContent="space-between"
                spacing={1}
              >
                <Box sx={{ minWidth: 0 }}>
                  <Typography variant="subtitle1" fontWeight={700}>
                    {household.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {isOwner ? COPY.roleOwner : COPY.roleMember}
                  </Typography>
                </Box>
                {isOwner ? (
                  <Button size="small" onClick={openEdit} sx={{ flexShrink: 0 }}>
                    {COPY.editNameLabel}
                  </Button>
                ) : null}
              </Stack>
            </Box>

            <Divider />

            <Typography variant="subtitle2" fontWeight={700}>
              {COPY.membersTitle}
            </Typography>
            <Stack spacing={1}>
              {members.map((m) => {
                const isYou = m.userId === currentUserId;
                const label = `${memberDisplayName(m)}${isYou ? COPY.youSuffix : ""}`;
                const roleLabel =
                  m.role === "owner" ? COPY.roleOwner : COPY.roleMember;
                return (
                  <Stack
                    key={m.id || m.userId}
                    direction="row"
                    alignItems="center"
                    justifyContent="space-between"
                    spacing={1}
                  >
                    <Box sx={{ minWidth: 0 }}>
                      <Typography variant="body2" fontWeight={600} noWrap>
                        {label}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {roleLabel}
                        {m.email ? ` · ${m.email}` : ""}
                      </Typography>
                    </Box>
                    {isOwner && m.role !== "owner" ? (
                      <Button
                        size="small"
                        color="error"
                        onClick={() => setRemoveTarget(m)}
                      >
                        {COPY.removeMember}
                      </Button>
                    ) : null}
                  </Stack>
                );
              })}
            </Stack>

            {isOwner ? (
              <>
                <Divider />
                <Typography variant="subtitle2" fontWeight={700}>
                  {COPY.invitesTitle}
                </Typography>
                <Stack
                  component="form"
                  onSubmit={onInvite}
                  direction={{ xs: "column", lg: "row" }}
                  spacing={1.5}
                  alignItems={{ lg: "center" }}
                  sx={{ width: "100%" }}
                >
                  <TextField
                    fullWidth
                    type="email"
                    label={COPY.inviteLabel}
                    placeholder={COPY.invitePlaceholder}
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    sx={formOutlinedInputMinHeightSx}
                    required
                  />
                  <LoadingButton
                    type="submit"
                    variant="contained"
                    loading={inviting}
                    disabled={!inviteEmail.trim()}
                    sx={{ width: { xs: "100%", lg: "auto" }, flexShrink: 0 }}
                  >
                    {COPY.inviteSubmit}
                  </LoadingButton>
                </Stack>
                {invites.length === 0 ? (
                  <Typography variant="body2" color="text.secondary">
                    {COPY.noInvites}
                  </Typography>
                ) : (
                  <Stack spacing={1}>
                    {invites.map((inv) => (
                      <Stack
                        key={inv.id}
                        direction="row"
                        alignItems="center"
                        justifyContent="space-between"
                        spacing={1}
                      >
                        <Box sx={{ minWidth: 0 }}>
                          <Typography variant="body2" noWrap>
                            {inv.email}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {COPY.expiresAt(inv.expiresAt)}
                          </Typography>
                        </Box>
                        <Button
                          size="small"
                          onClick={() => onRevokeInvite(inv.id)}
                        >
                          {COPY.revokeInvite}
                        </Button>
                      </Stack>
                    ))}
                  </Stack>
                )}
              </>
            ) : null}

            <Divider />
            <Button
              color="error"
              variant="outlined"
              onClick={() => setLeaveOpen(true)}
              disabled={ownerHasOtherMembers}
            >
              {COPY.leaveLabel}
            </Button>
            {ownerHasOtherMembers ? (
              <Typography variant="caption" color="text.secondary">
                {COPY.leaveDescriptionOwnerWithMembers}
              </Typography>
            ) : null}
          </Stack>
        )}
      </CardContent>

      {createOpen ? (
        <FormDialog
          open={createOpen}
          onClose={() => !creating && setCreateOpen(false)}
          title={COPY.createDialogTitle}
          formId="create-household-form"
          onSubmit={onCreate}
          isSubmitting={creating}
          cancelButtonLabel={COPY.cancel}
          submitLabel={COPY.createSubmit}
          submitDisabled={createName.trim().length < 2}
          hasUnsavedChanges={Boolean(createName.trim())}
        >
          <TextField
            autoFocus
            fullWidth
            label={COPY.nameLabel}
            placeholder={COPY.namePlaceholder}
            value={createName}
            onChange={(e) => setCreateName(e.target.value)}
            inputProps={{ maxLength: 120 }}
          />
        </FormDialog>
      ) : null}

      {editOpen ? (
        <FormDialog
          open={editOpen}
          onClose={() => !editing && setEditOpen(false)}
          title={COPY.editDialogTitle}
          formId="edit-household-form"
          onSubmit={onEdit}
          isSubmitting={editing}
          cancelButtonLabel={COPY.cancel}
          submitLabel={COPY.editSubmit}
          submitDisabled={
            editName.trim().length < 2 ||
            editName.trim() === (household?.name || "").trim()
          }
          hasUnsavedChanges={
            editName.trim() !== (household?.name || "").trim()
          }
        >
          <TextField
            autoFocus
            fullWidth
            label={COPY.nameLabel}
            placeholder={COPY.namePlaceholder}
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            inputProps={{ maxLength: 120 }}
          />
        </FormDialog>
      ) : null}

      <ConfirmDialog
        open={Boolean(removeTarget)}
        onClose={() => !removing && setRemoveTarget(null)}
        title={COPY.removeMemberTitle}
        description={
          removeTarget
            ? COPY.removeMemberDescription(memberDisplayName(removeTarget))
            : ""
        }
        onConfirm={onConfirmRemove}
        confirmLoading={removing}
        confirmLabel={COPY.removeMemberConfirm}
      />

      <ConfirmDialog
        open={leaveOpen}
        onClose={() => !leaving && setLeaveOpen(false)}
        title={COPY.leaveTitle}
        description={
          isOwner
            ? COPY.leaveDescriptionOwnerSolo
            : COPY.leaveDescriptionMember
        }
        onConfirm={onConfirmLeave}
        confirmLoading={leaving}
        confirmLabel={COPY.leaveConfirm}
      />
    </Card>
  );
}
