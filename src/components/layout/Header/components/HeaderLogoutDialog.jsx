import ConfirmDialog from "../../../common/ConfirmDialog/ConfirmDialog";
import { HEADER_COPY } from "../headerCopy";

/**
 * @param {Object} props
 * @param {boolean} props.open
 * @param {() => void} props.onCancel
 * @param {() => void | Promise<void>} props.onConfirm
 * @param {boolean} [props.loading]
 */
export default function HeaderLogoutDialog({
  open,
  onCancel,
  onConfirm,
  loading = false,
}) {
  return (
    <ConfirmDialog
      open={open}
      onClose={onCancel}
      title={HEADER_COPY.logoutTitle}
      description={HEADER_COPY.logoutDescription}
      onConfirm={onConfirm}
      confirmLoading={loading}
      cancelLabel={HEADER_COPY.logoutCancel}
      confirmLabel={HEADER_COPY.logoutConfirm}
      confirmColor="error"
    />
  );
}
